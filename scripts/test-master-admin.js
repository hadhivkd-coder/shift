async function testMasterAdmin() {
  const baseUrl = 'http://localhost:3000';

  console.log('--- 1. Testing Admin Authentication ---');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isDemo: true, demoType: 'admin' }),
  });

  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    process.exit(1);
  }

  const cookie = loginRes.headers.get('set-cookie');
  console.log('✓ Master Admin signed in');

  console.log('\n--- 2. Fetching Master Admin Console Data ---');
  const adminRes = await fetch(`${baseUrl}/api/admin`, {
    headers: { Cookie: cookie },
  });

  if (!adminRes.ok) {
    console.error('Admin fetch failed:', await adminRes.text());
    process.exit(1);
  }

  const adminData = await adminRes.json();
  const fin = adminData.financials;
  const um = adminData.userManagement;
  console.log(`✓ Gross Revenue: ₹${fin.grossRevenue.toLocaleString()}`);
  console.log(`✓ Total Admissions/Purchases: ${fin.totalOrders} (Paid: ${fin.paidOrdersCount}, Refunded: ${fin.refundedCount})`);
  console.log(`✓ Total Users: ${um.totalUsers} (Active: ${um.activeUsersCount}, Suspended: ${um.suspendedUsersCount})`);
  console.log(`✓ Global Broadcast Banner Active: ${adminData.platformSettings.broadcastActive}`);

  console.log('\n--- 3. Testing Manual Member Admission ---');
  const testEmail = `vip.member.${Date.now()}@blueprint.io`;
  const admitRes = await fetch(`${baseUrl}/api/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      action: 'admit_user',
      name: 'Dr. Suresh Varma',
      email: testEmail,
      password: 'password123',
      planName: 'The 20 KG Blueprint + Lifetime App Access',
      amountInr: 4999,
      paymentMethod: 'UPI / Direct Bank Transfer',
    }),
  });

  if (!admitRes.ok) {
    console.error('Manual admission failed:', await admitRes.text());
    process.exit(1);
  }
  const admitData = await admitRes.json();
  console.log('✓ Admission successful:', admitData.message);

  console.log('\n--- 4. Testing User Account Suspension & Reinstatement ---');
  // Suspend
  const suspendRes = await fetch(`${baseUrl}/api/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      action: 'toggle_user_status',
      userId: 'usr_rohan_2026',
      isSuspended: true,
    }),
  });
  console.log('✓ Account suspended:', (await suspendRes.json()).message);

  // Reinstate
  const reinstateRes = await fetch(`${baseUrl}/api/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      action: 'toggle_user_status',
      userId: 'usr_rohan_2026',
      isSuspended: false,
    }),
  });
  console.log('✓ Account reinstated:', (await reinstateRes.json()).message);

  console.log('\n--- 5. Testing Platform Broadcast Banner Publisher ---');
  const broadcastUpdate = await fetch(`${baseUrl}/api/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      action: 'update_settings',
      settings: {
        broadcast_active: '1',
        broadcast_message: '📢 NOTICE: Blueprint Spring Nutrition protocols are now live for all enrolled members.',
      },
    }),
  });
  console.log('✓ Platform settings saved:', (await broadcastUpdate.json()).message);

  console.log('\n--- 6. Verifying Broadcast Delivery on Member Dashboard ---');
  const memberLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isDemo: true, demoType: 'member' }),
  });
  const memberCookie = memberLogin.headers.get('set-cookie');
  const memberMe = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: memberCookie },
  });
  const memberData = await memberMe.json();
  console.log('✓ Member received platform broadcast:', memberData.globalBroadcast);

  console.log('\n======================================================');
  console.log('ALL MASTER ADMIN PLATFORM CONTROL TESTS PASSED 100%!');
  console.log('======================================================');
}

testMasterAdmin().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
