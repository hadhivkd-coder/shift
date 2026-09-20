import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    // 1. REVENUE & FINANCIAL INTELLIGENCE
    const revenueRow = db.prepare(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status = 'PAID' THEN amount_inr ELSE 0 END) as grossRevenue,
        COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paidOrdersCount,
        COUNT(CASE WHEN status = 'REFUNDED' THEN 1 END) as refundedCount,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pendingCount
      FROM admissions_orders
    `).get() as any;

    const grossRevenue = revenueRow?.grossRevenue || 0;
    const totalOrders = revenueRow?.totalOrders || 0;
    const paidOrdersCount = revenueRow?.paidOrdersCount || 0;
    const refundedCount = revenueRow?.refundedCount || 0;
    const pendingCount = revenueRow?.pendingCount || 0;
    const aov = paidOrdersCount > 0 ? Math.round(grossRevenue / paidOrdersCount) : 0;
    const mrr = Math.round(grossRevenue * 0.28); // Estimated active recurring velocity

    // Recent 50 admission orders
    const recentOrders = db.prepare(`
      SELECT 
        id, user_id as userId, customer_name as customerName, customer_email as customerEmail,
        plan_name as planName, amount_inr as amountInr, status, payment_method as paymentMethod,
        transaction_ref as transactionRef, created_at as createdAt
      FROM admissions_orders
      ORDER BY created_at DESC
      LIMIT 60
    `).all() as any[];

    // 2. MASTER USER DIRECTORY & CONTROL STATUS
    const usersRaw = db.prepare(`
      SELECT 
        u.id, u.email, u.role, COALESCE(u.is_suspended, 0) as isSuspended, u.created_at as createdAt,
        p.name, p.preferred_name as preferredName, p.city, p.occupation,
        bp.bmi, bp.weight_kg as weightKg
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN body_profiles bp ON u.id = bp.user_id
      ORDER BY u.created_at DESC
    `).all() as any[];

    const users = usersRaw.map(u => {
      // Find latest activity
      const latestCheckin = db.prepare(`
        SELECT date FROM daily_checkins WHERE user_id = ? ORDER BY date DESC LIMIT 1
      `).get(u.id) as { date?: string } | undefined;

      const orderCount = db.prepare(`
        SELECT count(*) as count FROM admissions_orders WHERE user_id = ? OR customer_email = ?
      `).get(u.id, u.email) as { count: number };

      return {
        id: u.id,
        email: u.email,
        name: u.preferredName || u.name || 'Member',
        fullName: u.name || 'Member',
        city: u.city || 'India',
        occupation: u.occupation || 'Professional',
        role: u.role,
        isSuspended: Boolean(u.isSuspended),
        createdAt: u.createdAt,
        lastActive: latestCheckin?.date || 'Never',
        hasOrders: orderCount.count > 0,
        ordersCount: orderCount.count,
        weightKg: u.weightKg || null,
        bmi: u.bmi || null,
      };
    });

    // 3. PLATFORM GLOBAL CONTROLS & SETTINGS
    const settingsRows = db.prepare(`SELECT key, value FROM platform_settings`).all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const r of settingsRows) {
      settings[r.key] = r.value;
    }

    // 4. SYSTEM AUDIT & SECURITY LOGS
    const auditLogs = db.prepare(`
      SELECT id, user_id as userId, action, details, timestamp
      FROM audit_logs
      ORDER BY timestamp DESC
      LIMIT 30
    `).all() as any[];

    return NextResponse.json({
      success: true,
      financials: {
        grossRevenue,
        totalOrders,
        paidOrdersCount,
        refundedCount,
        pendingCount,
        aov,
        mrr,
        currency: '₹',
        recentOrders,
      },
      userManagement: {
        totalUsers: users.length,
        activeUsersCount: users.filter(u => !u.isSuspended).length,
        suspendedUsersCount: users.filter(u => u.isSuspended).length,
        adminsCount: users.filter(u => u.role === 'admin').length,
        users,
      },
      platformSettings: {
        broadcastActive: settings.broadcast_active === '1',
        broadcastMessage: settings.broadcast_message || '',
        allowSignups: settings.allow_signups !== '0',
        maintenanceMode: settings.maintenance_mode === '1',
        aiAssistantEnabled: settings.ai_assistant_enabled !== '0',
        publicDemoEnabled: settings.public_demo_enabled !== '0',
      },
      auditLogs,
      adminContext: {
        email: currentUser.email,
        role: 'Master Product Owner',
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Admin API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin console data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    // ACTION: MANUALLY ADMIT USER
    if (action === 'admit_user') {
      const { name, email, password, planName, amountInr, paymentMethod } = body;
      if (!name || !email) {
        return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
      }

      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return NextResponse.json({ error: 'A user with this email address already exists.' }, { status: 400 });
      }

      const userId = `usr_adm_${Date.now()}`;
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password || 'shift2026', salt);

      // Create user
      db.prepare(`
        INSERT INTO users (id, email, password_hash, role)
        VALUES (?, ?, ?, 'user')
      `).run(userId, email, passwordHash);

      // Create basic profile
      db.prepare(`
        INSERT INTO profiles (user_id, name, preferred_name)
        VALUES (?, ?, ?)
      `).run(userId, name, name.split(' ')[0]);

      // Create admission order record
      const orderId = `ord_manual_${Date.now()}`;
      const orderAmount = parseFloat(amountInr) || 4999;
      db.prepare(`
        INSERT INTO admissions_orders (id, user_id, customer_name, customer_email, plan_name, amount_inr, status, payment_method, transaction_ref)
        VALUES (?, ?, ?, ?, ?, ?, 'PAID', ?, ?)
      `).run(
        orderId,
        userId,
        name,
        email,
        planName || 'The 20 KG Blueprint + Lifetime App Access',
        orderAmount,
        paymentMethod || 'Manual Admission by Admin',
        `TXN_ADMIN_${Date.now().toString().slice(-6)}`
      );

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run(
        `aud_${Date.now()}`,
        currentUser.id,
        'MANUAL_USER_ADMISSION',
        `Admin manually admitted ${name} (${email}) with plan: ${planName || 'Blueprint Lifetime'}`
      );

      return NextResponse.json({ success: true, message: `Successfully admitted ${name} into SHIFT.` });
    }

    // ACTION: TOGGLE USER STATUS (SUSPEND / REINSTATE)
    if (action === 'toggle_user_status') {
      const { userId, isSuspended } = body;
      if (!userId) return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });

      db.prepare('UPDATE users SET is_suspended = ? WHERE id = ?').run(isSuspended ? 1 : 0, userId);

      // If suspended, wipe active sessions immediately
      if (isSuspended) {
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
      }

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run(
        `aud_${Date.now()}`,
        currentUser.id,
        isSuspended ? 'USER_SUSPENDED' : 'USER_REINSTATED',
        `Admin ${isSuspended ? 'suspended' : 'reinstated'} account for user ${userId}`
      );

      return NextResponse.json({ success: true, message: `User account has been ${isSuspended ? 'suspended' : 'reinstated'}.` });
    }

    // ACTION: CHANGE USER ROLE
    if (action === 'change_role') {
      const { userId, newRole } = body;
      if (!userId || !['user', 'admin'].includes(newRole)) {
        return NextResponse.json({ error: 'Invalid user or role specified.' }, { status: 400 });
      }

      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(newRole, userId);

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run(
        `aud_${Date.now()}`,
        currentUser.id,
        'USER_ROLE_CHANGED',
        `Admin changed role of user ${userId} to ${newRole}`
      );

      return NextResponse.json({ success: true, message: `Role changed to ${newRole}.` });
    }

    // ACTION: RESET USER PASSWORD
    if (action === 'reset_password') {
      const { userId, newPassword } = body;
      if (!userId || !newPassword) {
        return NextResponse.json({ error: 'User ID and new password are required.' }, { status: 400 });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(newPassword, salt);

      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, userId);
      // Invalidate current sessions
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run(
        `aud_${Date.now()}`,
        currentUser.id,
        'ADMIN_PASSWORD_RESET',
        `Admin issued a password reset for user ${userId}`
      );

      return NextResponse.json({ success: true, message: 'Password reset successfully. Active sessions terminated.' });
    }

    // ACTION: DELETE USER ACCOUNT
    if (action === 'delete_user') {
      const { userId } = body;
      if (!userId) return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
      if (userId === currentUser.id) {
        return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
      }

      const target = db.prepare('SELECT email FROM users WHERE id = ?').get(userId) as { email: string } | undefined;
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run(
        `aud_${Date.now()}`,
        currentUser.id,
        'USER_DELETED_BY_ADMIN',
        `Admin permanently purged user ${target?.email || userId}`
      );

      return NextResponse.json({ success: true, message: 'User account and associated records deleted.' });
    }

    // ACTION: UPDATE PLATFORM SETTINGS & BROADCAST
    if (action === 'update_settings') {
      const { settings } = body;
      if (!settings || typeof settings !== 'object') {
        return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 });
      }

      const upsert = db.prepare(`
        INSERT OR REPLACE INTO platform_settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);

      for (const [k, v] of Object.entries(settings)) {
        upsert.run(k, String(v));
      }

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run(
        `aud_${Date.now()}`,
        currentUser.id,
        'PLATFORM_SETTINGS_UPDATED',
        `Admin updated platform settings: ${Object.keys(settings).join(', ')}`
      );

      return NextResponse.json({ success: true, message: 'Platform settings saved.' });
    }

    return NextResponse.json({ error: 'Unrecognized admin action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin API POST error:', error);
    return NextResponse.json({ error: 'Failed to process admin action' }, { status: 500 });
  }
}
