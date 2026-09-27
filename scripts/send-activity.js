/**
 * Dynamic Island for Desktop - Sample Plugin Script
 * Demonstrates how external apps / CLI scripts push live activities to the Island
 */

const PLUGIN_ID = 'sample-cli-plugin';
const PLUGIN_NAME = 'Terminal Task Runner';
const SERVER_URL = 'http://127.0.0.1:48123';

async function sendActivity() {
  console.log(`[Plugin] Sending activity request to ${SERVER_URL}/api/activity...`);

  const payload = {
    id: 'cli-build-task-1',
    app: PLUGIN_NAME,
    type: 'custom',
    title: 'Compiling Docker Container',
    subtitle: 'Step 4/7: Building TypeScript layer • 65%',
    icon: 'GitBranch',
    progress: 0.65,
    timeRemaining: '45s',
    priority: 85,
    actions: [
      { id: 'cancel', label: 'Cancel Job', icon: 'X', variant: 'danger' }
    ]
  };

  try {
    const res = await fetch(`${SERVER_URL}/api/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Plugin-Id': PLUGIN_ID,
        'X-Plugin-Name': PLUGIN_NAME,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 202) {
      const data = await res.json();
      console.log(`[Plugin] Status: 202 Accepted. Pending user approval in Dynamic Island UI.`);
      console.log(`[Plugin] Approval ID: ${data.approvalId}. Polling ${data.pollUrl}...`);

      // Poll until user clicks "Cho phép" in Dynamic Island
      let approved = false;
      let token = null;

      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const pollRes = await fetch(`${SERVER_URL}${data.pollUrl}`);
        const pollData = await pollRes.json();

        if (pollData.status === 'approved') {
          console.log(`[Plugin] Approved! Token received: ${pollData.token}`);
          approved = true;
          token = pollData.token;
          break;
        } else if (pollData.status === 'rejected') {
          console.error(`[Plugin] Rejected by user.`);
          return;
        } else {
          console.log(`[Plugin] Waiting for approval... (${i + 1}/30)`);
        }
      }

      if (approved && token) {
        // Re-send with Bearer token
        console.log(`[Plugin] Resending activity with Bearer token...`);
        const authedRes = await fetch(`${SERVER_URL}/api/activity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Plugin-Id': PLUGIN_ID,
            'X-Plugin-Name': PLUGIN_NAME,
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const authedData = await authedRes.json();
        console.log(`[Plugin] Success! Activity pushed to Island:`, authedData);
      }
    } else if (res.ok) {
      const data = await res.json();
      console.log(`[Plugin] Success! Activity updated:`, data);
    } else {
      console.error(`[Plugin] Error: HTTP ${res.status}`, await res.text());
    }
  } catch (err) {
    console.error(`[Plugin] Could not connect to Dynamic Island:`, err.message);
    console.log(`[Plugin] Please make sure Dynamic Island is running on your desktop.`);
  }
}

sendActivity();
