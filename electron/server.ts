import http from 'node:http';
import crypto from 'node:crypto';
import type { BrowserWindow } from 'electron';
import type { Activity } from '../src/types/activity';

interface PendingApproval {
  id: string;
  pluginId: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  token?: string;
  createdAt: number;
}

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

export class PluginServer {
  private server: http.Server | null = null;
  private port: number = 48123;
  private win: BrowserWindow;
  private pendingApprovals = new Map<string, PendingApproval>();
  private approvedPlugins = new Map<string, string>(); // pluginId -> token
  private rateLimits = new Map<string, RateLimitTracker>();
  private activeActivitiesCount = 0;

  constructor(win: BrowserWindow) {
    this.win = win;
  }

  public async start(): Promise<number> {
    const startPort = 48123;
    const maxPort = 48130;

    for (let p = startPort; p <= maxPort; p++) {
      try {
        await this.listenOnPort(p);
        this.port = p;
        return p;
      } catch (err: unknown) {
        const error = err as NodeJS.ErrnoException;
        if (error.code !== 'EADDRINUSE') {
          throw err;
        }
      }
    }
    throw new Error('All ports between 48123 and 48130 are currently in use.');
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  public getPort(): number {
    return this.port;
  }

  public handleApprovalResponse(approvalId: string, approved: boolean): boolean {
    const item = this.pendingApprovals.get(approvalId);
    if (!item) return false;

    if (approved) {
      const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
      item.status = 'approved';
      item.token = token;
      this.approvedPlugins.set(item.pluginId, token);
    } else {
      item.status = 'rejected';
    }
    return true;
  }

  public updateActivitiesCount(count: number): void {
    this.activeActivitiesCount = count;
  }

  private listenOnPort(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const srv = http.createServer((req, res) => this.handleRequest(req, res));

      srv.once('error', (err) => {
        reject(err);
      });

      srv.listen(port, '127.0.0.1', () => {
        this.server = srv;
        resolve();
      });
    });
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    // 1. Anti-CSRF: Check Origin header. Reject requests originating from browser web pages
    const origin = req.headers['origin'];
    if (origin && origin !== 'null' && !origin.startsWith('http://localhost') && !origin.startsWith('http://127.0.0.1')) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden: Cross-origin browser requests rejected' }));
      return;
    }

    const url = new URL(req.url || '/', `http://127.0.0.1:${this.port}`);
    const pathname = url.pathname;

    // 2. Health check endpoint
    if (req.method === 'GET' && pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        version: '1.0.0',
        activeActivities: this.activeActivitiesCount,
      }));
      return;
    }

    // 3. Approval polling endpoint: GET /api/approval/:approvalId
    if (req.method === 'GET' && pathname.startsWith('/api/approval/')) {
      const approvalId = pathname.replace('/api/approval/', '').trim();
      const approval = this.pendingApprovals.get(approvalId);

      if (!approval) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Approval request not found' }));
        return;
      }

      if (approval.status === 'approved') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'approved',
          token: approval.token,
        }));
        return;
      }

      if (approval.status === 'rejected') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'rejected', error: 'User rejected this plugin' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'pending_approval' }));
      return;
    }

    // 4. Activity endpoints: POST /api/activity
    if (req.method === 'POST' && pathname === '/api/activity') {
      const pluginId = (req.headers['x-plugin-id'] as string) || 'unknown-plugin';
      const pluginName = (req.headers['x-plugin-name'] as string) || pluginId;

      // Rate limit check: max 30 requests per 10 seconds
      const now = Date.now();
      const limit = this.rateLimits.get(pluginId) || { count: 0, resetAt: now + 10000 };
      if (now > limit.resetAt) {
        limit.count = 0;
        limit.resetAt = now + 10000;
      }
      limit.count++;
      this.rateLimits.set(pluginId, limit);

      if (limit.count > 30) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Too Many Requests: Rate limit exceeded (30 req / 10s)' }));
        return;
      }

      // Check Authorization
      const authHeader = req.headers['authorization'];
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
      const expectedToken = this.approvedPlugins.get(pluginId);

      // If plugin is not yet approved
      if (!expectedToken || token !== expectedToken) {
        const approvalId = `appr_${crypto.randomUUID().slice(0, 8)}`;
        this.pendingApprovals.set(approvalId, {
          id: approvalId,
          pluginId,
          name: pluginName,
          status: 'pending',
          createdAt: Date.now(),
        });

        // Notify UI to render Approval Card
        if (!this.win.isDestroyed()) {
          this.win.webContents.send('plugin-approval-request', {
            approvalId,
            pluginId,
            name: pluginName,
          });
        }

        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'pending_approval',
          approvalId,
          pollUrl: `/api/approval/${approvalId}`,
          message: 'Approval required. Please approve in the Dynamic Island on your desktop.',
        }));
        return;
      }

      // Read JSON body
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) {
          req.destroy(); // Prevent payload abuse
        }
      });

      req.on('end', () => {
        try {
          const activityData = JSON.parse(body) as Partial<Activity>;
          if (!activityData.title || !activityData.id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Activity payload: missing id or title' }));
            return;
          }

          const fullActivity: Activity = {
            id: String(activityData.id),
            app: activityData.app || pluginName,
            type: activityData.type || 'custom',
            title: String(activityData.title),
            subtitle: activityData.subtitle,
            icon: activityData.icon,
            thumbnail: activityData.thumbnail,
            progress: typeof activityData.progress === 'number' ? activityData.progress : undefined,
            actions: activityData.actions,
            priority: typeof activityData.priority === 'number' ? activityData.priority : 50,
            ttl: activityData.ttl,
            deepLink: activityData.deepLink,
            customData: activityData.customData,
            createdAt: Date.now(),
          };

          if (!this.win.isDestroyed()) {
            this.win.webContents.send('plugin-activity', fullActivity);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', activityId: fullActivity.id }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}
