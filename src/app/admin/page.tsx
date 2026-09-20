'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Users,
  CreditCard,
  Settings,
  Shield,
  Activity,
  UserPlus,
  Search,
  Lock,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut,
  Sliders,
  Send,
  Trash2,
  KeyRound,
  ExternalLink,
  Radio,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function MasterAdminPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'users' | 'controls' | 'audit'>('overview');

  // Search & Filters
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'user' | 'admin'>('ALL');
  const [searchOrder, setSearchOrder] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PAID' | 'REFUNDED' | 'PENDING'>('ALL');

  // Modals & Forms
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitName, setAdmitName] = useState('');
  const [admitEmail, setAdmitEmail] = useState('');
  const [admitPlan, setAdmitPlan] = useState('The 20 KG Blueprint + Lifetime App Access');
  const [admitAmount, setAdmitAmount] = useState('4999');
  const [admitMethod, setAdmitMethod] = useState('Direct Bank Transfer / UPI');
  const [admitLoading, setAdmitLoading] = useState(false);

  // Password Reset Modal
  const [resetUser, setResetUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // User Details Dossier Modal
  const [inspectedUser, setInspectedUser] = useState<any>(null);

  // Platform Controls Form
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // General Notification
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  }

  async function loadAdminData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.status === 403) {
        setError('Unauthorized: Master Admin credentials required.');
        return;
      }
      if (!res.ok) {
        setError('Failed to fetch administrative data.');
        return;
      }
      const json = await res.json();
      setData(json);

      // Populate platform settings
      if (json.platformSettings) {
        setBroadcastActive(json.platformSettings.broadcastActive);
        setBroadcastMsg(json.platformSettings.broadcastMessage || '');
        setAllowSignups(json.platformSettings.allowSignups);
        setMaintenanceMode(json.platformSettings.maintenanceMode);
        setAiEnabled(json.platformSettings.aiAssistantEnabled);
      }
    } catch {
      setError('Network error while communicating with admin service.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  // Handle Manual User Admission
  async function handleAdmitUser(e: React.FormEvent) {
    e.preventDefault();
    setAdmitLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admit_user',
          name: admitName.trim(),
          email: admitEmail.trim(),
          planName: admitPlan,
          amountInr: admitAmount,
          paymentMethod: admitMethod,
        }),
      });
      const resData = await res.json();
      if (res.ok) {
        showToast(resData.message || 'Member admitted successfully!');
        setShowAdmitModal(false);
        setAdmitName('');
        setAdmitEmail('');
        loadAdminData();
      } else {
        alert(resData.error || 'Failed to admit member');
      }
    } catch {
      alert('Error admitting user');
    } finally {
      setAdmitLoading(false);
    }
  }

  // Handle Toggle User Suspended Status
  async function handleToggleStatus(userId: string, currentSuspended: boolean) {
    if (!confirm(`Are you sure you want to ${currentSuspended ? 'reinstate' : 'suspend'} this user?`)) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_user_status',
          userId,
          isSuspended: !currentSuspended,
        }),
      });
      if (res.ok) {
        showToast(`User account ${currentSuspended ? 'reinstated' : 'suspended'}.`);
        loadAdminData();
        if (inspectedUser && inspectedUser.id === userId) {
          setInspectedUser({ ...inspectedUser, isSuspended: !currentSuspended });
        }
      }
    } catch {
      alert('Failed to update user status');
    }
  }

  // Handle Role Change
  async function handleChangeRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_role', userId, newRole }),
      });
      if (res.ok) {
        showToast(`Role updated to ${newRole}`);
        loadAdminData();
      }
    } catch {
      alert('Failed to update role');
    }
  }

  // Handle Password Reset
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetUser || !newPassword) return;
    setResetLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          userId: resetUser.id,
          newPassword,
        }),
      });
      if (res.ok) {
        showToast(`Password reset successfully for ${resetUser.email}`);
        setResetUser(null);
        setNewPassword('');
      } else {
        alert('Failed to reset password');
      }
    } catch {
      alert('Network error');
    } finally {
      setResetLoading(false);
    }
  }

  // Handle Delete User
  async function handleDeleteUser(userId: string, email: string) {
    if (!confirm(`⚠️ PERMANENT ACTION: Delete user ${email} and all their data? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId }),
      });
      if (res.ok) {
        showToast(`User ${email} deleted.`);
        setInspectedUser(null);
        loadAdminData();
      } else {
        const json = await res.json();
        alert(json.error || 'Failed to delete user');
      }
    } catch {
      alert('Failed to delete user');
    }
  }

  // Handle Save Platform Settings
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: {
            broadcast_active: broadcastActive ? '1' : '0',
            broadcast_message: broadcastMsg.trim(),
            allow_signups: allowSignups ? '1' : '0',
            maintenance_mode: maintenanceMode ? '1' : '0',
            ai_assistant_enabled: aiEnabled ? '1' : '0',
          },
        }),
      });
      if (res.ok) {
        setSettingsSuccess('Platform settings and broadcast banner updated live!');
        setTimeout(() => setSettingsSuccess(''), 4000);
        showToast('Settings saved successfully');
      }
    } catch {
      alert('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#07090B]">
        <div className="flex items-center gap-3 text-sm text-[#8E98A0]">
          <Sparkles className="w-5 h-5 text-[#D8F224] animate-spin" />
          <span className="font-mono">Loading SHIFT Master Admin Console...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07090B] flex items-center justify-center p-4">
        <div className="p-8 text-center max-w-md bg-[#0F1418] border border-white/10 rounded-3xl space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">{error}</h2>
          <p className="text-xs text-[#8E98A0]">
            Please sign in as `admin@shift.health` or use the 1-Click Demo on the landing page.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#D8F224] text-black font-bold text-xs"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  const fin = data?.financials || {};
  const userMgmt = data?.userManagement || {};
  const orders = fin.recentOrders || [];
  const users = userMgmt.users || [];

  // Filtered Users
  const filteredUsers = users.filter((u: any) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchUser.trim()) {
      const q = searchUser.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o: any) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.planName?.toLowerCase().includes(q) ||
        o.transactionRef?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090B] text-[#F3F4F6] flex antialiased selection:bg-[#D8F224] selection:text-black">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#D8F224] text-black px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* DEDICATED ADMIN SIDEBAR (Zero member features: no track, no meals, no skin) */}
      <aside className="w-64 bg-[#0A0E12] border-r border-white/10 p-5 shrink-0 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          {/* Logo & Platform Tag */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D8F224] text-black font-black flex items-center justify-center text-lg shadow-[0_0_20px_rgba(216,242,36,0.3)]">
                S
              </div>
              <div>
                <span className="font-black tracking-widest text-lg text-white">SHIFT</span>
                <span className="block text-[9px] uppercase tracking-widest text-[#D8F224] font-mono font-semibold">
                  MASTER ADMIN
                </span>
              </div>
            </div>
            <div className="mt-3 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-mono text-[#8E98A0] flex items-center justify-between">
              <span>ADMIN:</span>
              <span className="text-white truncate max-w-[120px]">{data?.adminContext?.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#D8F224] text-black font-bold shadow-md'
                  : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Executive Pulse</span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'revenue'
                  ? 'bg-[#D8F224] text-black font-bold shadow-md'
                  : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Revenue & Admissions</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-[#D8F224] text-black font-bold shadow-md'
                  : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Controls ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('controls')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'controls'
                  ? 'bg-[#D8F224] text-black font-bold shadow-md'
                  : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Platform Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'audit'
                  ? 'bg-[#D8F224] text-black font-bold shadow-md'
                  : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Audit & Logs</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
          <ThemeToggle showLabel className="w-full justify-center" />

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#8E98A0] hover:text-white transition-colors"
          >
            <span>View Member App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#8E98A0] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#07090B]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#D8F224] uppercase tracking-widest hidden sm:inline">
              OPERATING CONSOLE
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              {activeTab === 'overview' && 'Command Pulse Overview'}
              {activeTab === 'revenue' && 'Revenue & Admissions Ledger'}
              {activeTab === 'users' && 'Master User Directory & Controls'}
              {activeTab === 'controls' && 'Platform & Global Controls'}
              {activeTab === 'audit' && 'System Access & Audit Stream'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => loadAdminData()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={() => setShowAdmitModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#D8F224] text-black font-bold text-xs hover:scale-105 transition-all shadow-md flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Member</span>
            </button>
          </div>
        </header>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex overflow-x-auto no-scrollbar border-b border-white/10 bg-[#0A0E12] p-2 gap-1 text-xs">
          {[
            { id: 'overview', label: 'Pulse' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'users', label: 'Users' },
            { id: 'controls', label: 'Controls' },
            { id: 'audit', label: 'Audit' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold whitespace-nowrap ${
                activeTab === t.id ? 'bg-[#D8F224] text-black' : 'text-[#8E98A0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-8 pb-16">
          {/* TAB 1: EXECUTIVE PULSE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Financial & Volume Big Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Gross Revenue
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-[#D8F224] font-mono">
                    ₹{fin.grossRevenue?.toLocaleString() || 0}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {fin.paidOrdersCount || 0} paid admissions
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Total Purchases
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {fin.totalOrders || 0}
                  </p>
                  <span className="text-[10px] text-sky-400 font-mono">
                    Avg Order: ₹{fin.aov?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Registered Accounts
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {userMgmt.totalUsers || 0}
                  </p>
                  <span className="text-[10px] text-[#D8F224] font-mono">
                    {userMgmt.activeUsersCount || 0} active • {userMgmt.suspendedUsersCount || 0} suspended
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Est. MRR Velocity
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                    ₹{fin.mrr?.toLocaleString() || 0}
                  </p>
                  <span className="text-[10px] text-teal-400 font-mono">
                    Subscription & VIP access
                  </span>
                </div>
              </div>

              {/* Quick Actions & Live Platform Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Broadcast Control */}
                <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Radio className={`w-4 h-4 ${broadcastActive ? 'text-emerald-400 animate-pulse' : 'text-[#8E98A0]'}`} />
                      <h2 className="text-sm font-bold text-white font-mono uppercase">
                        Global Broadcast Announcement
                      </h2>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${broadcastActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[#8E98A0]'}`}>
                      {broadcastActive ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>

                  <p className="text-xs text-[#8E98A0]">
                    Published across all active member dashboards immediately.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/90">
                    &ldquo;{broadcastMsg || 'No announcement message set.'}&rdquo;
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('controls')}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
                    >
                      Configure Broadcast
                    </button>
                  </div>
                </div>

                {/* System Feature Switches */}
                <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#D8F224]" />
                      <h2 className="text-sm font-bold text-white font-mono uppercase">
                        Web Control Toggles
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono text-[#D8F224]">Live State</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="font-bold text-white">New User Signups</p>
                        <p className="text-[10px] text-[#8E98A0]">Open admission into the platform</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${allowSignups ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {allowSignups ? 'ALLOWED' : 'CLOSED'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="font-bold text-white">Maintenance Mode</p>
                        <p className="text-[10px] text-[#8E98A0]">Restricts non-admin access</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${maintenanceMode ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-[#8E98A0]'}`}>
                        {maintenanceMode ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Admissions Mini-Ledger */}
              <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">Recent Customer Admissions</h2>
                    <p className="text-xs text-[#8E98A0]">Latest Blueprint & companion orders</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="text-xs font-mono text-[#D8F224] hover:underline"
                  >
                    View All {orders.length} Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#8E98A0] font-mono">
                        <th className="py-2.5 px-3">CUSTOMER</th>
                        <th className="py-2.5 px-3">PLAN ENROLLED</th>
                        <th className="py-2.5 px-3">AMOUNT</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3">DATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/90">
                      {orders.slice(0, 6).map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-white">{ord.customerName}</p>
                            <p className="text-[10px] text-[#8E98A0]">{ord.customerEmail}</p>
                          </td>
                          <td className="py-2.5 px-3 text-[#D8F224] font-medium">{ord.planName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-white">
                            ₹{ord.amountInr?.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${ord.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-[#8E98A0]">
                            {ord.createdAt?.split(' ')[0] || ord.createdAt?.split('T')[0]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVENUE & ADMISSIONS LEDGER */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              {/* Financial Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Total Gross Revenue
                  </span>
                  <p className="text-3xl font-black text-[#D8F224] font-mono">
                    ₹{fin.grossRevenue?.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono">100% verified ledger</span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Completed Admissions
                  </span>
                  <p className="text-3xl font-black text-white font-mono">
                    {fin.paidOrdersCount || 0}
                  </p>
                  <span className="text-[10px] text-sky-400 font-mono">Paid transactions</span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Average Order Value
                  </span>
                  <p className="text-3xl font-black text-white font-mono">
                    ₹{fin.aov?.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-white/50 font-mono">Per enrolled customer</span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8E98A0] block">
                    Refunds Processed
                  </span>
                  <p className="text-3xl font-black text-amber-300 font-mono">
                    {fin.refundedCount || 0}
                  </p>
                  <span className="text-[10px] text-amber-300/80 font-mono">Low dispute rate (&lt;1.5%)</span>
                </div>
              </div>

              {/* Admissions Ledger Controls */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                    {['ALL', 'PAID', 'REFUNDED', 'PENDING'].map(st => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          orderStatusFilter === st
                            ? 'bg-[#D8F224] text-black shadow-md'
                            : 'bg-white/[0.03] text-[#8E98A0] hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-[#8E98A0] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchOrder}
                        onChange={e => setSearchOrder(e.target.value)}
                        placeholder="Search customer, plan, TXN..."
                        className="w-full bg-[#141A1F] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                      />
                    </div>

                    <button
                      onClick={() => setShowAdmitModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#D8F224] text-black font-bold text-xs shrink-0 flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ New Admission</span>
                    </button>
                  </div>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#8E98A0] font-mono">
                        <th className="py-2.5 px-3">TRANSACTION</th>
                        <th className="py-2.5 px-3">CUSTOMER</th>
                        <th className="py-2.5 px-3">PLAN NAME</th>
                        <th className="py-2.5 px-3">AMOUNT</th>
                        <th className="py-2.5 px-3">METHOD</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3">TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/90">
                      {filteredOrders.map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-white/[0.03]">
                          <td className="py-3 px-3 font-mono text-[11px] text-[#D8F224]">
                            {ord.transactionRef}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-white">{ord.customerName}</p>
                            <p className="text-[10px] text-[#8E98A0]">{ord.customerEmail}</p>
                          </td>
                          <td className="py-3 px-3 text-white/90 font-medium">
                            {ord.planName}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            ₹{ord.amountInr?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-[#8E98A0] text-[11px]">
                            {ord.paymentMethod}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${ord.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-[#8E98A0]">
                            {ord.createdAt?.split(' ')[0] || ord.createdAt?.split('T')[0]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASTER USER DIRECTORY & CONTROLS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#0E1317] border border-white/10">
                <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                  {['ALL', 'user', 'admin'].map(r => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        roleFilter === r
                          ? 'bg-[#D8F224] text-black shadow-md'
                          : 'bg-white/[0.03] text-[#8E98A0] hover:text-white'
                      }`}
                    >
                      {r.toUpperCase()}S
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#8E98A0] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    placeholder="Search name, email, city..."
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              {/* Users Table with Full Administrative Actions */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">All Platform Accounts ({filteredUsers.length})</h2>
                  <span className="text-xs font-mono text-[#8E98A0]">Master Account Management</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#8E98A0] font-mono">
                        <th className="py-2.5 px-3">MEMBER</th>
                        <th className="py-2.5 px-3">ROLE</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3">JOINED</th>
                        <th className="py-2.5 px-3">LAST ACTIVE</th>
                        <th className="py-2.5 px-3 text-right">ADMIN ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/90">
                      {filteredUsers.map((u: any) => (
                        <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-bold text-white">{u.fullName || u.name}</p>
                            <p className="text-[10px] text-[#8E98A0]">{u.email}</p>
                            <p className="text-[10px] text-[#8E98A0]/70">{u.city} • {u.occupation}</p>
                          </td>

                          <td className="py-3 px-3 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-[#D8F224]/20 text-[#D8F224]' : 'bg-white/10 text-white/80'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono">
                            {u.isSuspended ? (
                              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px]">
                                SUSPENDED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                                ACTIVE
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 font-mono text-[10px] text-[#8E98A0]">
                            {u.createdAt?.split(' ')[0] || u.createdAt?.split('T')[0]}
                          </td>

                          <td className="py-3 px-3 font-mono text-[10px] text-[#D8F224]">
                            {u.lastActive}
                          </td>

                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setInspectedUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold"
                            >
                              Dossier
                            </button>

                            <button
                              onClick={() => handleToggleStatus(u.id, u.isSuspended)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${u.isSuspended ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'}`}
                            >
                              {u.isSuspended ? 'Reinstate' : 'Suspend'}
                            </button>

                            <button
                              onClick={() => setResetUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-sky-300 text-[11px] font-bold"
                              title="Reset Password"
                            >
                              <KeyRound className="w-3.5 h-3.5 inline" />
                            </button>

                            {u.id !== data?.adminContext?.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLATFORM CONTROLS & WEB TOGGLES */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {settingsSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{settingsSuccess}</span>
                  </div>
                )}

                {/* Global Announcement Banner */}
                <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Global Broadcast Announcement</h2>
                      <p className="text-xs text-[#8E98A0]">Sticky banner displayed on all member dashboards</p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-mono text-[#8E98A0]">ACTIVE:</span>
                      <input
                        type="checkbox"
                        checked={broadcastActive}
                        onChange={e => setBroadcastActive(e.target.checked)}
                        className="w-4 h-4 accent-[#D8F224]"
                      />
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    value={broadcastMsg}
                    onChange={e => setBroadcastMsg(e.target.value)}
                    placeholder="Enter broadcast message (e.g. New Blueprint Spring modules updated!)..."
                    className="w-full bg-[#141A1F] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                  />
                </div>

                {/* System Toggles */}
                <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
                  <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">
                    Platform Master Switches
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Open Registration / Signups</p>
                        <p className="text-[10px] text-[#8E98A0]">Allow new members to sign up from landing page</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={allowSignups}
                        onChange={e => setAllowSignups(e.target.checked)}
                        className="w-5 h-5 accent-[#D8F224]"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Maintenance Mode</p>
                        <p className="text-[10px] text-[#8E98A0]">Block non-admin logins for server maintenance</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={e => setMaintenanceMode(e.target.checked)}
                        className="w-5 h-5 accent-[#D8F224]"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">AI Health Assistant</p>
                        <p className="text-[10px] text-[#8E98A0]">Enable interactive assistant drawer across web app</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiEnabled}
                        onChange={e => setAiEnabled(e.target.checked)}
                        className="w-5 h-5 accent-[#D8F224]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-3 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 transition-all shadow-md"
                >
                  {savingSettings ? 'Saving Settings...' : 'Apply Live Platform Settings'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SYSTEM AUDIT & SECURITY STREAM */}
          {activeTab === 'audit' && (
            <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h2 className="text-base font-bold text-white">System Security & Audit Stream</h2>
                  <p className="text-xs text-[#8E98A0]">Real-time trail of administrative actions & admissions</p>
                </div>
                <span className="text-xs font-mono text-[#D8F224]">Live Audit Engine</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {data?.auditLogs?.map((log: any) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#D8F224] font-bold">{log.action}</span>
                        <span className="text-[10px] text-[#8E98A0]">By: {log.userId?.slice(-6) || 'System'}</span>
                      </div>
                      <p className="text-white/80 font-sans text-xs">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-[#8E98A0] shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: MANUAL USER ADMISSION */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[#0F1418] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-bold text-white">Manually Admit Member</h2>
              <button onClick={() => setShowAdmitModal(false)} className="text-[#8E98A0] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdmitUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-[#8E98A0] block mb-1">MEMBER FULL NAME</label>
                <input
                  type="text"
                  required
                  value={admitName}
                  onChange={e => setAdmitName(e.target.value)}
                  placeholder="e.g. Anand Varma"
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8E98A0] block mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={admitEmail}
                  onChange={e => setAdmitEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8E98A0] block mb-1">PLAN ENROLLED</label>
                <select
                  value={admitPlan}
                  onChange={e => setAdmitPlan(e.target.value)}
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#D8F224]"
                >
                  <option value="The 20 KG Blueprint + Lifetime App Access">The 20 KG Blueprint + Lifetime App Access (₹4,999)</option>
                  <option value="The 20 KG Blueprint Book & Guide">The 20 KG Blueprint Book & Guide (₹1,999)</option>
                  <option value="SHIFT Annual VIP Masterclass Bundle">SHIFT Annual VIP Masterclass Bundle (₹8,999)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-[#8E98A0] block mb-1">FEE (₹ INR)</label>
                  <input
                    type="number"
                    value={admitAmount}
                    onChange={e => setAdmitAmount(e.target.value)}
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#8E98A0] block mb-1">PAYMENT METHOD</label>
                  <input
                    type="text"
                    value={admitMethod}
                    onChange={e => setAdmitMethod(e.target.value)}
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={admitLoading}
                className="w-full py-2.5 rounded-xl bg-[#D8F224] text-black font-black text-xs hover:scale-[1.01] transition-all shadow-md"
              >
                {admitLoading ? 'Enrolling...' : 'Complete Admission'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-[#0F1418] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-bold text-white">Reset Password</h2>
              <button onClick={() => setResetUser(null)} className="text-[#8E98A0] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8E98A0]">
              Issuing a password reset for <span className="text-white font-bold">{resetUser.email}</span>.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new temporary password..."
                className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#D8F224]"
              />

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2.5 rounded-xl bg-[#D8F224] text-black font-black text-xs hover:scale-[1.01] transition-all shadow-md"
              >
                {resetLoading ? 'Resetting...' : 'Confirm Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: USER DOSSIER VIEW */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0F1418] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#D8F224] uppercase">ACCOUNT DOSSIER</span>
                <h2 className="text-lg font-bold text-white">{inspectedUser.fullName}</h2>
                <p className="text-xs text-[#8E98A0]">{inspectedUser.email}</p>
              </div>
              <button onClick={() => setInspectedUser(null)} className="text-[#8E98A0] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-[#8E98A0] block">ROLE</span>
                <span className="font-bold text-white uppercase font-mono">{inspectedUser.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-[#8E98A0] block">STATUS</span>
                <span className={`font-bold font-mono ${inspectedUser.isSuspended ? 'text-red-400' : 'text-emerald-400'}`}>
                  {inspectedUser.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-[#8E98A0] block">CITY / REGION</span>
                <span className="font-bold text-white">{inspectedUser.city || 'India'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-[#8E98A0] block">OCCUPATION</span>
                <span className="font-bold text-white">{inspectedUser.occupation || 'Professional'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => handleChangeRole(inspectedUser.id, inspectedUser.role)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white"
              >
                Toggle Admin Role
              </button>
              <button
                onClick={() => handleToggleStatus(inspectedUser.id, inspectedUser.isSuspended)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${inspectedUser.isSuspended ? 'bg-emerald-500 text-black' : 'bg-amber-400 text-black'}`}
              >
                {inspectedUser.isSuspended ? 'Reinstate' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
