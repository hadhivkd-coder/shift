'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Shield,
  Utensils,
  Footprints,
  Dumbbell,
  Moon,
  Repeat,
  Sparkles,
  Lock,
  HeartHandshake,
  CheckCircle2,
  Play,
  LogIn,
  UserCheck,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function LandingPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleDemoLogin(type: 'hadhi' | 'admin' | 'operator') {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true, demoType: type }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(type === 'admin' ? '/admin' : type === 'operator' ? '/operator' : '/dashboard');
      } else {
        setErrorMsg(data.error || 'Demo login failed');
      }
    } catch {
      setErrorMsg('Failed to sign in. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = authMode === 'login' ? { email, password } : { email, password, name };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (authMode === 'signup') {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090A] text-[#F3F4F6] selection:bg-[#D8F224] selection:text-black">
      {/* Top Navigation */}
      <header className="border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D8F224] flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(216,242,36,0.3)]">
            S
          </div>
          <div>
            <span className="font-black tracking-widest text-lg text-white">SHIFT</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest text-[#D8F224] font-mono font-semibold">
              The 20 KG Blueprint Companion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle showLabel />
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            className="text-xs font-semibold text-white/80 hover:text-white px-3 py-2 rounded-xl transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => handleDemoLogin('admin')}
            className="hidden sm:flex text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-full transition-all items-center gap-1.5"
          >
            <Shield className="w-3 h-3 text-[#D8F224]" />
            <span>Admin Panel</span>
          </button>
          <button
            onClick={() => handleDemoLogin('hadhi')}
            className="text-xs font-bold bg-[#D8F224]/15 hover:bg-[#D8F224]/25 text-[#D8F224] border border-[#D8F224]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Member Demo</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D8F224]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#D8F224] mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Execution Layer for The 20 KG Blueprint</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
          Your health.
          <br />
          Your data.
          <br />
          <span className="text-[#D8F224]">Your system.</span>
        </h1>

        <p className="text-base sm:text-xl text-[#8E98A0] max-w-2xl mx-auto leading-relaxed mb-10">
          A personalized wellness companion that learns your routine, food culture and goals — then turns better decisions into daily habits without asking you to change everything.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D8F224] text-black font-black text-base hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(216,242,36,0.3)] flex items-center justify-center gap-3"
          >
            <span>Build My Health Profile</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleDemoLogin('hadhi')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 font-bold text-base transition-all flex items-center justify-center gap-2.5"
          >
            <UserCheck className="w-5 h-5 text-[#D8F224]" />
            <span>Demo with Hadhi&apos;s Profile</span>
          </button>
        </div>

        {/* Reassuring Microcopy */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8E98A0]/70 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D8F224]" /> 100% Private & User-Owned
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Zero Forbidden Foods
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" /> Non-Diagnostic Safety Guardrails
          </span>
        </div>
      </section>

      {/* The 5 Dials Philosophy Section */}
      <section className="px-6 md:px-12 py-16 bg-[#0A0D10] border-t border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono text-[#D8F224] uppercase tracking-widest">
              The Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              The Five Dials Framework
            </h2>
            <p className="text-sm text-[#8E98A0] max-w-xl mx-auto mt-2">
              Commercial diets fail because they demand 100% perfection on Day 1. SHIFT tunes five sustainable lifestyle dials to match your real life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'PLATE', icon: Utensils, color: '#D8F224', title: 'Nutrition Structure', desc: 'Protein anchoring, half-plate vegetables, zero forbidden foods.' },
              { name: 'MOVE', icon: Footprints, color: '#38BDF8', title: 'Daily Movement', desc: 'Post-meal walking pulses, incidental activity, steady NEAT.' },
              { name: 'LIFT', icon: Dumbbell, color: '#F59E0B', title: 'Muscle Safeguard', desc: 'Stimulate lean mass to protect resting metabolic rate.' },
              { name: 'REST', icon: Moon, color: '#2DD4BF', title: 'Recovery Rhythm', desc: 'Light curfew, sleep hygiene, nervous system regulation.' },
              { name: 'REPEAT', icon: Repeat, color: '#A78BFA', title: 'Habit Compounding', desc: 'Never missing twice, self-compassion, lifelong momentum.' },
            ].map((dial, i) => {
              const Icon = dial.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-[#0F1317] border border-white/5 flex flex-col justify-between">
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold mb-3"
                      style={{ backgroundColor: `${dial.color}15`, color: dial.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: dial.color }}>
                      {dial.name}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1 mb-1.5">{dial.title}</h3>
                    <p className="text-xs text-[#8E98A0] leading-relaxed">{dial.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0F1317] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8F224]/10 text-[#D8F224] flex items-center justify-center font-bold">
              🍛
            </div>
            <h3 className="text-lg font-bold text-white">Indian Foods as First-Class Citizens</h3>
            <p className="text-xs text-[#8E98A0] leading-relaxed">
              Rice, Dosa, Puttu, Kadala, Chicken roast, and Thoran are not the enemy. SHIFT personalizes portion, protein pairing, and sequence so you love your food while reaching your goals.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F1317] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center font-bold">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-white">Medical Honesty & Safety First</h3>
            <p className="text-xs text-[#8E98A0] leading-relaxed">
              We never claim to be an &ldquo;AI Doctor&rdquo;. SHIFT uses a multi-tier clinical screening safety layer, flag alerts, emergency hotline links, and zero-diagnosis ethics.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F1317] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              🔐
            </div>
            <h3 className="text-lg font-bold text-white">Zero Advertising & Data Sovereignty</h3>
            <p className="text-xs text-[#8E98A0] leading-relaxed">
              Your sensitive health metrics belong to you. We never sell health data, never use data for advertising, and provide 1-click full JSON export or permanent erasure.
            </p>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#11161B] to-[#171E24] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-black text-white">Ready to begin your consultation?</h3>
            <p className="text-xs text-[#8E98A0] mt-1">
              Start your 10-step intelligent health profile assessment now.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className="px-6 py-3 rounded-xl bg-[#D8F224] text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)]"
          >
            Start My Profile
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-[#0F1418] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="text-lg font-black text-white">
                {authMode === 'login' ? 'Welcome Back to SHIFT' : 'Create Your SHIFT Account'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-[#8E98A0] hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Hadhi Rahman"
                    className="w-full bg-[#151C22] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-[#8E98A0] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full bg-[#151C22] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E98A0] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#151C22] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#D8F224] text-black font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Continue to Onboarding'}</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={() => setAuthMode(prev => (prev === 'login' ? 'signup' : 'login'))}
                className="text-[#D8F224] hover:underline"
              >
                {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>

              <button
                onClick={() => handleDemoLogin('hadhi')}
                className="text-white/60 hover:text-white"
              >
                Or use Demo Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
