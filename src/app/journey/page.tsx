'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Lock,
  Flame,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { JourneyDayContent } from '@/lib/content/journey30';

export default function JourneyPage() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [days, setDays] = useState<JourneyDayContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Active day view
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [reflectionInput, setReflectionInput] = useState('');
  const [completing, setCompleting] = useState(false);
  const [congratsMsg, setCongratsMsg] = useState('');

  async function loadJourney() {
    try {
      const res = await fetch('/api/journey');
      const data = await res.json();
      setCurrentDay(data.currentDay || 1);
      setCompletedDays(data.completedDays || []);
      setStreak(data.streak || 0);
      setReflections(data.reflections || {});
      setDays(data.days || []);
      setSelectedDayNum(data.currentDay || 1);
    } catch (err) {
      console.error('Failed to load journey:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJourney();
  }, []);

  const selectedDay = days.find(d => d.day === selectedDayNum) || days[0];
  const isSelectedCompleted = completedDays.includes(selectedDayNum);
  const isLocked = selectedDayNum > currentDay;

  async function handleCompleteDay() {
    if (!selectedDay) return;
    setCompleting(true);
    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: selectedDayNum,
          reflection: reflectionInput || reflections[selectedDayNum] || '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedDays(data.completedDays);
        setCurrentDay(data.currentDay);
        setStreak(data.streak);
        setCongratsMsg(data.message);
        setTimeout(() => setCongratsMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to complete day:', err);
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-2 text-sm text-[#8E98A0]">
          <Sparkles className="w-4 h-4 text-[#D8F224] animate-spin" />
          <span>Opening your 30-day transformation pathway...</span>
        </div>
      </div>
    );
  }

  const completionPct = Math.round((completedDays.length / 30) * 100);

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header & Progress Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D8F224] uppercase tracking-widest">
            THE 20 KG BLUEPRINT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            30-Day Transformation Journey
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            One micro-habit card per day. Missed a day?{' '}
            <span className="text-white font-medium">You didn&apos;t fail. Continue right from here.</span>
          </p>
        </div>

        {/* Momentum Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 font-mono text-xs flex items-center gap-2">
            <span className="text-[#8E98A0]">PROGRESS:</span>
            <span className="text-[#D8F224] font-bold">{completionPct}%</span>
            <span className="text-white/40">({completedDays.length}/30 Days)</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-current" />
            <span>{streak}-Day Streak</span>
          </div>
        </div>
      </div>

      {congratsMsg && (
        <div className="p-4 rounded-2xl bg-[#D8F224]/10 border border-[#D8F224]/30 text-[#D8F224] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4" />
          <span>{congratsMsg}</span>
        </div>
      )}

      {/* Main Layout: Selected Day Card + 30-Day Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Day Interactive Card */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDay && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1317] border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D8F224] text-black font-black flex items-center justify-center text-lg">
                    {selectedDay.day}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8E98A0] uppercase">
                      DAY {selectedDay.day} OF 30 • {selectedDay.dial} DIAL
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {selectedDay.title}
                    </h2>
                  </div>
                </div>

                {isSelectedCompleted ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : isLocked ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#8E98A0] border border-white/10 text-xs font-mono">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-[#D8F224]/10 text-[#D8F224] border border-[#D8F224]/30 text-xs font-mono font-bold">
                    Active Mission
                  </div>
                )}
              </div>

              {/* Mission Content */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider block mb-1">
                    Today&apos;s Mission
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white leading-snug">
                    {selectedDay.mission}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-mono text-[#8E98A0] block">
                    Why It Matters
                  </span>
                  <p className="text-white/80 leading-relaxed">{selectedDay.whyItMatters}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#D8F224]/5 border border-[#D8F224]/20 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-mono text-[#D8F224] font-bold block">
                    Action to Take
                  </span>
                  <p className="text-white font-medium leading-relaxed">{selectedDay.action}</p>
                </div>

                {/* Reflection Prompt */}
                <div className="pt-2">
                  <label className="text-xs font-mono text-[#8E98A0] block mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D8F224]" />
                    <span>Daily Reflection: {selectedDay.reflectionPrompt}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={reflectionInput || reflections[selectedDay.day] || ''}
                    onChange={e => setReflectionInput(e.target.value)}
                    placeholder="Write a brief note or reflection on today..."
                    className="w-full bg-[#13191E] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                  />
                </div>

                {/* Complete Button */}
                <button
                  onClick={handleCompleteDay}
                  disabled={completing || isLocked}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                    isSelectedCompleted
                      ? 'bg-white/5 text-white/70 hover:bg-white/10'
                      : 'bg-[#D8F224] text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(216,242,36,0.3)]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completing
                      ? 'Recording...'
                      : isSelectedCompleted
                      ? 'Update Reflection'
                      : `Complete Day ${selectedDay.day}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 30-Day Mini Matrix Navigator */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-black text-white">All 30 Days</h3>
            <span className="text-xs font-mono text-[#8E98A0]">Tap to inspect</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {days.map(d => {
              const isCompleted = completedDays.includes(d.day);
              const isCurrent = d.day === currentDay;
              const isSelected = d.day === selectedDayNum;
              return (
                <button
                  key={d.day}
                  onClick={() => {
                    setSelectedDayNum(d.day);
                    setReflectionInput(reflections[d.day] || '');
                  }}
                  className={`h-11 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center border ${
                    isSelected
                      ? 'border-[#D8F224] scale-105 shadow-md'
                      : 'border-white/5'
                  } ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : isCurrent
                      ? 'bg-[#D8F224] text-black shadow-[0_0_10px_rgba(216,242,36,0.3)]'
                      : 'bg-white/[0.02] text-[#8E98A0] hover:text-white'
                  }`}
                >
                  {isCompleted ? '✓' : d.day}
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-[#8E98A0] space-y-1.5 border-t border-white/5">
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D8F224]" /> Active Day
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed Day
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" /> Upcoming Card
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
