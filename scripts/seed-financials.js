const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'shift.db');
const db = new Database(dbPath);

console.log('--- Initializing Financial & Platform Settings ---');

// Initialize tables if needed
db.exec(`
  CREATE TABLE IF NOT EXISTS admissions_orders (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount_inr REAL NOT NULL,
    status TEXT DEFAULT 'PAID',
    payment_method TEXT DEFAULT 'Razorpay / UPI',
    transaction_ref TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Platform settings default
const defaultSettings = [
  { key: 'broadcast_active', value: '1' },
  { key: 'broadcast_message', value: '🚀 SHIFT Blueprint 2.0 Live: All 30-Day modules and habit algorithms updated.' },
  { key: 'allow_signups', value: '1' },
  { key: 'maintenance_mode', value: '0' },
  { key: 'ai_assistant_enabled', value: '1' },
  { key: 'public_demo_enabled', value: '1' },
  { key: 'currency_symbol', value: '₹' },
];

for (const s of defaultSettings) {
  db.prepare(`
    INSERT OR REPLACE INTO platform_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `).run(s.key, s.value);
}

// Seed Admissions Orders
const existingOrders = db.prepare('SELECT count(*) as c FROM admissions_orders').get();
if (existingOrders.c < 10) {
  const users = db.prepare(`SELECT id, email, role FROM users WHERE role = 'user'`).all();
  const profiles = db.prepare(`SELECT user_id, name FROM profiles`).all();
  const nameMap = {};
  for (const p of profiles) nameMap[p.user_id] = p.name;

  const plans = [
    { name: 'The 20 KG Blueprint + Lifetime App Access', price: 4999, weight: 0.65 },
    { name: 'The 20 KG Blueprint Book & Guide', price: 1999, weight: 0.25 },
    { name: 'SHIFT Annual VIP Masterclass Bundle', price: 8999, weight: 0.10 }
  ];

  const paymentMethods = ['UPI (PhonePe / GPay)', 'HDFC / ICICI Credit Card', 'Razorpay NetBanking', 'Stripe'];
  const now = new Date();

  // Seed for registered users first
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const plan = plans[i % plans.length];
    const daysAgo = Math.floor(Math.random() * 25) + 1;
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);
    const dateStr = orderDate.toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      INSERT OR IGNORE INTO admissions_orders (id, user_id, customer_name, customer_email, plan_name, amount_inr, status, payment_method, transaction_ref, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'PAID', ?, ?, ?)
    `).run(
      `ord_${1000 + i}`,
      u.id,
      nameMap[u.id] || 'Valued Member',
      u.email,
      plan.name,
      plan.price,
      paymentMethods[i % paymentMethods.length],
      `TXN_RZP_${883720 + i}`,
      dateStr
    );
  }

  // Seed additional realistic enrolled orders to reach ~142 purchases
  const extraCustomers = [
    { name: 'Faisal K.P.', email: 'faisal.kp@gmail.com' },
    { name: 'Kavita Menon', email: 'kavita.menon@outlook.com' },
    { name: 'Rahul V. Pillai', email: 'rahul.pillai@yahoo.com' },
    { name: 'Deepa Subramanian', email: 'deepa.sub@gmail.com' },
    { name: 'Ashwin Jose', email: 'ashwin.jose@icloud.com' },
    { name: 'Nandita Sen', email: 'nandita.sen@gmail.com' },
    { name: 'Siddharth Rao', email: 'sid.rao@corp.in' },
    { name: 'Ameena Beevi', email: 'ameena.b@gmail.com' },
    { name: 'Gautam Nambiar', email: 'gautam.n@gmail.com' },
    { name: 'Reshma Thomas', email: 'reshma.t@kerala.gov.in' },
    { name: 'Aditya Chawla', email: 'aditya.c@techcorp.com' },
    { name: 'Lakshmi Warrier', email: 'lakshmi.w@gmail.com' },
    { name: 'Vishnu Das', email: 'vishnu.das@gmail.com' },
    { name: 'Zoya Fathima', email: 'zoya.f@gmail.com' },
    { name: 'Karthik Sridhar', email: 'karthik.s@gmail.com' },
    { name: 'Shreya Hegde', email: 'shreya.h@gmail.com' },
  ];

  for (let j = 0; j < 130; j++) {
    const cust = extraCustomers[j % extraCustomers.length];
    const custEmail = j < extraCustomers.length ? cust.email : `customer_${j + 100}@blueprint.io`;
    const custName = j < extraCustomers.length ? cust.name : `Member ${j + 100}`;
    const plan = plans[j % 3];
    const daysAgo = Math.floor(Math.random() * 45) + 1;
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);
    const dateStr = orderDate.toISOString().replace('T', ' ').substring(0, 19);

    // 2 refunded, 1 pending, rest paid
    const status = j === 7 || j === 23 ? 'REFUNDED' : j === 12 ? 'PENDING' : 'PAID';

    db.prepare(`
      INSERT OR IGNORE INTO admissions_orders (id, user_id, customer_name, customer_email, plan_name, amount_inr, status, payment_method, transaction_ref, created_at)
      VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `ord_${2000 + j}`,
      custName,
      custEmail,
      plan.name,
      plan.price,
      status,
      paymentMethods[j % paymentMethods.length],
      `TXN_RZP_${910000 + j}`,
      dateStr
    );
  }
}

const totalOrders = db.prepare("SELECT count(*) as c, SUM(CASE WHEN status='PAID' THEN amount_inr ELSE 0 END) as revenue FROM admissions_orders").get();
console.log(`✓ Seeded admissions & orders! Total orders: ${totalOrders.c}, Total Revenue: ₹${totalOrders.revenue.toLocaleString()}`);
