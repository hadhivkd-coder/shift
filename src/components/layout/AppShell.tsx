'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  User,
  MessageSquare,
  Shield,
  Utensils,
  Sparkles,
  ShoppingBag,
  BookOpen,
  LogOut,
  AlertTriangle,
  Flame,
  Users,
} from 'lucide-react';
import ShiftAssistantDrawer from '../assistant/ShiftAssistantDrawer';
import ThemeToggle from '../theme/ThemeToggle';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dials, setDials] = useState<any>(null);
  const [safetyStatus, setSafetyStatus] = useState<string>('NORMAL');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Skip consumer AppShell chrome on landing page, onboarding, auth, and dedicated /admin master console
  const isStandalonePage = pathname === '/' || pathname.startsWith('/onboarding') || pathname === '/login' || pathname.startsWith('/admin') || pathname.startsWith('/operator');

  useEffect(() => {
    if (isStandalonePage) {
      setLoading(false);
      return;
    }

    async function loadUserData() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) {
          router.push('/');
          return;
        }
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setDials(data.dials);
          if (data.healthScreen) {
            setSafetyStatus(data.healthScreen.safety_status || 'NORMAL');
          }
        }
      } catch (err) {
        console.error('Failed to load user in shell:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [pathname, isStandalonePage, router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (isStandalonePage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Track', href: '/track', icon: CheckSquare },
    { label: 'Journey', href: '/journey', icon: Calendar },
    { label: 'Meals', href: '/meals', icon: Utensils },
    { label: 'Insights', href: '/insights', icon: BarChart3 },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#07090A] text-[#F3F4F6] flex flex-col md:flex-row antialiased selection:bg-[#D8F224] selection:text-black">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B0F12] border-r border-white/5 p-5 shrink-0 justify-between">
        <div>
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 mb-8 group">
            <div className="w-9 h-9 rounded-xl bg-[#D8F224] flex items-center justify-center text-black font-black text-lg tracking-tighter shadow-[0_0_15px_rgba(216,242,36,0.3)] group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-black tracking-widest text-lg text-white">SHIFT</span>
              <span className="block text-[9px] uppercase tracking-widest text-[#D8F224] font-mono font-semibold">
                Blueprint OS
              </span>
            </div>
          </Link>

          {/* User Mini Profile */}
          {user && (
            <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs text-[#8E98A0] uppercase font-mono">Signed in as</p>
                <p className="font-semibold text-sm truncate text-white">{user.preferredName || user.name || 'Member'}</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#D8F224]/10 text-[#D8F224] flex items-center justify-center font-bold text-xs">
                {(user.preferredName || user.name || 'M')[0]}
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#D8F224] text-black font-semibold shadow-[0_0_15px_rgba(216,242,36,0.2)]'
                      : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 pb-2">
              <p className="px-3 text-[10px] uppercase font-mono tracking-wider text-white/30">More Modules</p>
            </div>

            <Link
              href="/skin"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/skin' ? 'bg-[#D8F224] text-black font-semibold' : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              <span>Skin Wellness</span>
            </Link>

            <Link
              href="/grocery"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/grocery' ? 'bg-[#D8F224] text-black font-semibold' : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#2DD4BF]" />
              <span>Smart Grocery</span>
            </Link>

            <Link
              href="/library"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/library' ? 'bg-[#D8F224] text-black font-semibold' : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#F59E0B]" />
              <span>Blueprint Library</span>
            </Link>

            <Link
              href="/privacy"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/privacy' ? 'bg-[#D8F224] text-black font-semibold' : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Shield className="w-4 h-4 text-white/70" />
              <span>Privacy Center</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/admin' ? 'bg-[#D8F224] text-black font-semibold' : 'text-[#8E98A0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#D8F224]" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom Theme, Assistant Trigger & Logout */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <ThemeToggle showLabel className="w-full justify-center" />

          <button
            onClick={() => setIsAssistantOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#D8F224] border border-[#D8F224]/20 font-medium text-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open SHIFT Assistant</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#8E98A0] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#07090A]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D8F224] flex items-center justify-center text-black font-black text-sm">
                S
              </div>
              <span className="font-black tracking-widest text-sm text-white">SHIFT</span>
            </Link>

            {/* Five Dials Mini Badge */}
            {dials && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs">
                <span className="text-[#8E98A0] font-mono text-[10px] uppercase">5 DIALS:</span>
                <span className="text-[#D8F224] font-mono font-bold">P{dials.dial_plate}</span>
                <span className="text-sky-400 font-mono font-bold">M{dials.dial_move}</span>
                <span className="text-amber-400 font-mono font-bold">L{dials.dial_lift}</span>
                <span className="text-teal-400 font-mono font-bold">R{dials.dial_rest}</span>
                <span className="text-[#D8F224] font-mono font-bold">↺{dials.dial_repeat}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Safety Indicator */}
            {safetyStatus === 'DOCTOR_RECOMMENDED' && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                <span>Clinical Guidance Active</span>
              </span>
            )}

            {/* Floating Assistant Button */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D8F224] text-black font-semibold text-xs hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(216,242,36,0.3)]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask SHIFT</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Body */}
        <main className="flex-1 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D10]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive ? 'text-[#D8F224] scale-105' : 'text-[#8E98A0] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Embedded SHIFT Assistant Drawer */}
      <ShiftAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userContext={{
          name: user?.preferredName || user?.name || 'Member',
        }}
      />
    </div>
  );
}
