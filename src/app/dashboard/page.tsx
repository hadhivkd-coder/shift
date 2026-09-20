'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Flame,
  Droplets,
  Moon,
  Footprints,
  Utensils,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import FiveDialsWidget from '@/components/dashboard/FiveDialsWidget';
import DailyCheckInModal from '@/components/tracking/DailyCheckInModal';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  async function loadDashboard() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        router.push('/');
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function toggleAction(id: string) {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-2 text-sm text-[#8E98A0]">
          <Sparkles className="w-4 h-4 text-[#D8F224] animate-spin" />
          <span>Synchronizing your Blueprint system...</span>
        </div>
      </div>
    );
  }

  const user = data?.user;
  const profile = data?.profile;
  const dials = data?.dials;
  const todaysShift = data?.todaysShift || [];
  const todaysCheckin = data?.todaysCheckin;
  const journey = data?.journey;

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Editorial Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#D8F224]">
            Personal Health Operating System
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Good Morning,{' '}
            <span className="text-[#D8F224]">
              {profile?.preferred_name || profile?.name || user?.preferredName || 'Member'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1 font-medium">
            Let&apos;s make today easier. Focus on steady decisions, not frantic restriction.
          </p>
        </div>

        {/* Quick Day & Check-in Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono flex items-center gap-2">
            <span className="text-[#8E98A0]">JOURNEY:</span>
            <span className="text-[#D8F224] font-bold">Day {journey?.current_day || 1} / 30</span>
          </div>

          <button
            onClick={() => setIsCheckInOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(216,242,36,0.3)] flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{todaysCheckin ? 'Edit Check-in' : '60s Check-in'}</span>
          </button>
        </div>
      </div>

      {/* Global Broadcast Announcement from Admin */}
      {data?.globalBroadcast && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#D8F224]/10 border border-[#D8F224]/30 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#D8F224] text-black flex items-center justify-center font-bold shrink-0 mt-0.5 text-sm">
            📢
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-[#D8F224] font-bold">
              PLATFORM BROADCAST
            </span>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              {data.globalBroadcast}
            </p>
          </div>
        </div>
      )}

      {/* Latest Personal Nudge from Blueprint Companion */}
      {data?.latestNudge && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#D8F224]/10 via-white/[0.03] to-transparent border border-[#D8F224]/30 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#D8F224] text-black flex items-center justify-center font-bold shrink-0 mt-0.5">
            ⚡
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-[#D8F224] font-bold">
                SHIFT BLUEPRINT NUDGE
              </span>
              <span className="text-[10px] text-[#8E98A0] font-mono">
                {data.latestNudge.created_at?.split(' ')[0] || 'Recently'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              &ldquo;{data.latestNudge.message}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* TODAY'S SHIFT: 3 Personalized Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-[#8E98A0] uppercase tracking-widest">
              Daily Guidance
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Today&apos;s Shift</h2>
          </div>
          <span className="text-xs font-mono text-[#8E98A0]">3 Micro-Actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {todaysShift.map((action: any) => {
            const isDone = completedActions[action.id];
            return (
              <div
                key={action.id}
                onClick={() => toggleAction(action.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-[#0E1317] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{action.emoji}</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E98A0]">
                        {action.dial} DIAL
                      </span>
                    </div>

                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/30" />
                    )}
                  </div>

                  <h3
                    className={`text-base font-bold transition-colors ${
                      isDone ? 'line-through text-white/50' : 'text-white'
                    }`}
                  >
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#8E98A0] mt-1 leading-relaxed">
                    {action.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#8E98A0]">
                  <span className="text-white font-medium">Why:</span> {action.whyItMatters}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE FIVE DIALS INTERACTIVE GAUGE */}
      <FiveDialsWidget dials={dials} />

      {/* TODAY'S VITALS & CHECK-IN SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sleep Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1317] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/15 text-[#2DD4BF] flex items-center justify-center font-bold">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8E98A0]">Sleep</span>
              <p className="text-lg font-black text-white">
                {todaysCheckin?.sleep_hours ? `${todaysCheckin.sleep_hours}h` : '6.5h'}
              </p>
              <span className="text-[10px] text-[#2DD4BF] font-mono">
                {todaysCheckin?.sleep_quality || 'Restful'}
              </span>
            </div>
          </div>
        </div>

        {/* Water Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1317] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8E98A0]">Hydration</span>
              <p className="text-lg font-black text-white">
                {todaysCheckin?.water_ml
                  ? `${(todaysCheckin.water_ml / 1000).toFixed(1)} L`
                  : '2.5 L'}
              </p>
              <span className="text-[10px] text-sky-400 font-mono">Paced daylight</span>
            </div>
          </div>
        </div>

        {/* Movement Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1317] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8F224]/15 text-[#D8F224] flex items-center justify-center font-bold">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8E98A0]">Movement</span>
              <p className="text-lg font-black text-white">
                {todaysCheckin?.movement_duration_mins
                  ? `${todaysCheckin.movement_duration_mins} mins`
                  : '35 mins'}
              </p>
              <span className="text-[10px] text-[#D8F224] font-mono">Post-meal walk</span>
            </div>
          </div>
        </div>
      </div>

      {/* "WHAT DO YOU NEED?" INTELLIGENT QUICK ACTIONS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#11171C] to-[#0A0D10] border border-white/10">
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8F224]">
            On-Demand Support
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">What do you need right now?</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <Link
            href="/meals?tab=recommend"
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex flex-col items-center text-center group"
          >
            <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🍽️</span>
            <span className="text-xs font-bold text-white">What should I eat?</span>
            <span className="text-[10px] text-[#8E98A0] mt-0.5">Kerala & safe meals</span>
          </Link>

          <Link
            href="/track"
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex flex-col items-center text-center group"
          >
            <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🏃</span>
            <span className="text-xs font-bold text-white">What to do today?</span>
            <span className="text-[10px] text-[#8E98A0] mt-0.5">NEAT & movement</span>
          </Link>

          <Link
            href="/library"
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex flex-col items-center text-center group"
          >
            <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">😴</span>
            <span className="text-xs font-bold text-white">Help with sleep</span>
            <span className="text-[10px] text-[#8E98A0] mt-0.5">Wind-down protocol</span>
          </Link>

          <Link
            href="/skin"
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex flex-col items-center text-center group"
          >
            <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🧴</span>
            <span className="text-xs font-bold text-white">Skin routine</span>
            <span className="text-[10px] text-[#8E98A0] mt-0.5">AM/PM checklist</span>
          </Link>

          <Link
            href="/library"
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex flex-col items-center text-center group col-span-2 sm:col-span-1"
          >
            <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🧠</span>
            <span className="text-xs font-bold text-white">I&apos;m struggling</span>
            <span className="text-[10px] text-[#8E98A0] mt-0.5">Craving & reset</span>
          </Link>
        </div>
      </div>

      {/* Fast Check-In Modal */}
      <DailyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={() => {
          loadDashboard();
        }}
        initialData={todaysCheckin}
      />
    </div>
  );
}
