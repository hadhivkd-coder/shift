'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Utensils,
  Footprints,
  Dumbbell,
  Moon,
  Repeat,
  Lock,
  CheckCircle2,
  LogIn,
  BookOpen,
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

  async function handleDemoLogin(type: 'member' | 'admin' | 'operator') {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true, demoType: type === 'member' ? 'user' : type }),
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
    <div className="min-h-screen bg-[#07090A] text-[#F3F4F6] selection:bg-[#D8F224] selection:text-black flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D8F224] flex items-center justify-center text-black font-black text-lg shadow-[0_0_20px_rgba(216,242,36,0.3)]">
            S
          </div>
          <div>
            <span className="font-black tracking-widest text-lg text-white">SHIFT</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest text-[#D8F224] font-mono font-semibold">
              part of The 20 KG Blueprint
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
            className="text-xs font-semibold text-white/90 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 md:px-12 pt-16 pb-20 max-w-5xl mx-auto text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D8F224]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#D8F224] mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Execution Companion for The 20 KG Blueprint</span>
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
              <span>Start My Profile</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleDemoLogin('member')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 border border-white/10 font-bold text-base transition-all flex items-center justify-center gap-2.5"
            >
              <UserCheck className="w-5 h-5 text-[#D8F224]" />
              <span>Explore Sample Profile</span>
            </button>
          </div>

          {/* Reassuring Microcopy */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8E98A0]/80 font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D8F224]" /> 100% Private & User-Owned
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Zero Forbidden Foods
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400" /> Non-Diagnostic Habit Guidance
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

        {/* The 20 KG Blueprint Book Companion Section */}
        <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-[#07090A] via-[#0D1217] to-[#07090A]">
          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#11161B] to-[#090C0E] border-2 border-[#D8F224]/20 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F224]/10 border border-[#D8F224]/30 text-xs font-mono text-[#D8F224]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>The Complete Guide — ₹99 Instant Digital Edition</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  The 20 KG Blueprint
                </h2>
                <p className="text-sm text-[#8E98A0] leading-relaxed">
                  Understand the science, protocols, and behavioral psychology behind sustainable fat loss without cutting cultural foods. The book gives you the knowledge; SHIFT gives you the daily execution system.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#D8F224] text-black font-black text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)] flex items-center gap-2"
                  >
                    <span>Get The Blueprint Book (₹99)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-colors"
                  >
                    Start App Assessment
                  </button>
                </div>
              </div>

              <div className="w-44 h-56 rounded-2xl bg-gradient-to-br from-[#D8F224]/20 to-transparent border border-[#D8F224]/30 flex flex-col justify-between p-5 text-center shadow-2xl">
                <span className="text-[10px] font-mono text-[#D8F224] tracking-widest uppercase">
                  Official Blueprint
                </span>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">THE 20 KG</h3>
                  <h4 className="text-sm font-bold text-[#D8F224]">BLUEPRINT</h4>
                  <p className="text-[10px] text-[#8E98A0] mt-1">Sustainable Fat Loss & Vitality</p>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/10 py-1 rounded-md">
                  ₹99
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles Section */}
        <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0F1317] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D8F224]/10 text-[#D8F224] flex items-center justify-center font-bold">
                🍛
              </div>
              <h3 className="text-lg font-bold text-white">Traditional Foods Included</h3>
              <p className="text-xs text-[#8E98A0] leading-relaxed">
                Rice, Dosa, Puttu, Kadala, and Thoran are not the enemy. SHIFT personalizes portion, protein pairing, and sequence so you love your food while reaching your goals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F1317] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center font-bold">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-white">Ethical Safety Guardrails</h3>
              <p className="text-xs text-[#8E98A0] leading-relaxed">
                We never claim to be an &ldquo;AI Doctor&rdquo;. SHIFT uses a clinical screening safety layer, flag alerts, emergency hotline links, and strictly non-diagnostic habit coaching.
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
        </section>
      </main>

      {/* Sitewide Footer */}
      <footer className="border-t border-white/10 bg-[#050708] py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D8F224] flex items-center justify-center text-black font-black text-base">
                S
              </div>
              <div>
                <span className="font-black tracking-widest text-base text-white">SHIFT</span>
                <span className="ml-2 text-xs text-[#8E98A0] font-mono">
                  part of The 20 KG Blueprint
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#8E98A0]">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy & Data Sovereignty
              </Link>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="hover:text-white transition-colors"
              >
                Member Sign In
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-[#8E98A0]/80 leading-relaxed font-mono">
            <span className="text-[#D8F224] font-semibold">Non-Diagnostic Medical Disclaimer: </span>
            SHIFT is an educational and lifestyle habit companion designed to support personal wellness, habit consistency, and healthy routines. SHIFT is not a medical device, is not licensed to provide medical advice, and does not diagnose, treat, cure, or prevent any illness, disease, or medical condition. Content generated by SHIFT or its assistant does not constitute clinical evaluation or medical guidance. Always consult a qualified physician or healthcare professional before making substantial changes to your diet, exercise, or medical regimen.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8E98A0]/60 pt-4 border-t border-white/5">
            <span>&copy; {new Date().getFullYear()} SHIFT — part of The 20 KG Blueprint. All rights reserved.</span>
            <span>Zero Advertising • Zero Data Brokering</span>
          </div>
        </div>
      </footer>

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
                    placeholder="e.g. Rahul Sharma"
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
                onClick={() => handleDemoLogin('member')}
                className="text-white/60 hover:text-white"
              >
                Or explore sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
