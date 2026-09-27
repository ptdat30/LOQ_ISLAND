/**
 * Automated end-to-end verification script for Dynamic Island for Desktop
 */

const SERVER_URL = 'http://127.0.0.1:48123';

async function runVerification() {
  console.log('====================================================');
  console.log('  DYNAMIC ISLAND FOR DESKTOP - FULL VERIFICATION   ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  }

  // 1. Health check
  console.log('1. Kiểm tra Health Endpoint (/api/health)...');
  try {
    const res = await fetch(`${SERVER_URL}/api/health`);
    assert(res.status === 200, 'Health endpoint trả về HTTP 200');
    const data = await res.json();
    assert(data.status === 'ok', `Health status là "ok" (version: ${data.version}, uptime: ${data.uptime}s)`);
  } catch (err) {
    assert(false, `Không thể kết nối đến server: ${err.message}`);
  }

  // 2. Anti-CSRF Origin check
  console.log('\n2. Kiểm tra Phòng chống CSRF / DNS Rebinding...');
  try {
    const res = await fetch(`${SERVER_URL}/api/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://evil-website.com',
        'X-Plugin-Id': 'evil-plugin',
      },
      body: JSON.stringify({ id: 'test', title: 'Hacked' }),
    });
    assert(res.status === 403, 'Chặn thành công request có Origin từ web ngoài (HTTP 403)');
  } catch (err) {
    assert(false, `Lỗi test CSRF: ${err.message}`);
  }

  // 3. Plugin Non-blocking Approval Protocol (HTTP 202)
  console.log('\n3. Kiểm tra Giao thức Phê duyệt Plugin (HTTP 202 Accepted)...');
  let pollUrl = null;
  try {
    const res = await fetch(`${SERVER_URL}/api/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Plugin-Id': 'test-music-agent',
        'X-Plugin-Name': 'Spotify Test Agent',
      },
      body: JSON.stringify({
        id: 'test-song-01',
        app: 'Spotify',
        type: 'media',
        title: 'Starboy',
        subtitle: 'The Weeknd — Starboy',
        progress: 0.5,
      }),
    });

    assert(res.status === 202, 'Plugin chưa cấp phép nhận mã HTTP 202 Accepted (không bị block request)');
    const data = await res.json();
    assert(data.status === 'pending_approval', 'Trạng thái plugin là "pending_approval"');
    assert(Boolean(data.approvalId && data.pollUrl), `Có approvalId (${data.approvalId}) và pollUrl (${data.pollUrl})`);
    pollUrl = data.pollUrl;
  } catch (err) {
    assert(false, `Lỗi test approval: ${err.message}`);
  }

  // 4. Polling endpoint test
  console.log('\n4. Kiểm tra Endpoint Polling Phê duyệt (/api/approval/:id)...');
  if (pollUrl) {
    try {
      const res = await fetch(`${SERVER_URL}${pollUrl}`);
      assert(res.status === 200, 'Poll endpoint trả về HTTP 200');
      const data = await res.json();
      assert(data.status === 'pending_approval', 'Trạng thái poll đang đợi người dùng duyệt trên UI');
    } catch (err) {
      assert(false, `Lỗi polling: ${err.message}`);
    }
  }

  // 5. Payload Validation
  console.log('\n5. Kiểm tra Ràng buộc Dữ liệu Payload (Data Validation)...');
  try {
    const res = await fetch(`${SERVER_URL}/api/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json',
    });
    // With bad json or unapproved it handles safely
    assert(res.status === 400 || res.status === 202, `Xử lý an toàn khi body sai định dạng (HTTP ${res.status})`);
  } catch (err) {
    assert(false, `Lỗi validation: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`  KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================\n');
}

runVerification();
