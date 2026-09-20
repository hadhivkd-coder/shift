async function testAdmin() {
  const baseUrl = 'http://localhost:3000';

  console.log('--- 1. Testing Admin Login ---');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isDemo: true, demoType: 'admin' }),
  });

  if (!loginRes.ok) {
    console.error('Admin login failed:', await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const cookie = loginRes.headers.get('set-cookie');
  console.log('✓ Admin authenticated:', loginData.user.email, 'Role:', loginData.user.role);

  console.log('\n--- 2. Testing /api/admin Telemetry & Triage ---');
  const adminRes = await fetch(`${baseUrl}/api/admin`, {
    headers: { Cookie: cookie },
  });

  if (!adminRes.ok) {
    console.error('Failed to get admin telemetry:', await adminRes.text());
    process.exit(1);
  }

  const adminData = await adminRes.json();
  const s = adminData.executiveSummary;
  console.log(`✓ People Bought Blueprint: ${s.totalPurchases} (Active registered accounts: ${s.totalRegistered})`);
  console.log(`✓ Active in System: ${s.activeInSystem}`);
  console.log(`✓ DOING GOOD Cohort: ${s.doingGoodCount} (${s.doingGoodPct}%)`);
  console.log(`✓ NEEDS ATTENTION / STALLED Cohort: ${s.doingBadCount} (${s.doingBadPct}%)`);

  console.log('\n--- 3. Systemic Diagnostics ---');
  console.log('What Is Working:', adminData.systemicDiagnostics.whatIsWorking[0]);
  console.log('What Is NOT Working (Bottleneck):', adminData.systemicDiagnostics.whatIsNotWorking[0]);
  console.log('Top Reported Obstacles Count:', adminData.systemicDiagnostics.topProblems.length);

  console.log('\n--- 4. Member Triage Sample ---');
  for (const m of adminData.members.slice(0, 4)) {
    console.log(`- ${m.name} (${m.status}): Streak: ${m.streak}d | Day ${m.currentDay}/30 | Last active: ${m.lastActive} | Dial Avg: ${m.dialAverage} | Friction: "${m.topProblem}"`);
  }

  console.log('\n--- 5. Testing 1-Click Encouragement Nudge from Admin ---');
  const targetMember = adminData.members.find(m => m.status === 'NEEDS_ATTENTION') || adminData.members[0];
  const nudgeRes = await fetch(`${baseUrl}/api/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      action: 'send_nudge',
      userId: targetMember.id,
      message: 'Hey Arun, zero pressure on perfection. Just focus on your breakfast protein today and take a 10-minute fresh air walk.',
      nudgeType: 'ENCOURAGEMENT',
    }),
  });

  if (!nudgeRes.ok) {
    console.error('Nudge delivery failed:', await nudgeRes.text());
    process.exit(1);
  }
  const nudgeData = await nudgeRes.json();
  console.log(`✓ Nudge delivered to ${targetMember.name}:`, nudgeData.message);

  console.log('\n=========================================');
  console.log('ALL ADMIN PANEL & TRIAGE CHECKS PASSED!');
  console.log('=========================================');
}

testAdmin().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
