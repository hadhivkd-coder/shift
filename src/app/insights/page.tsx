'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Weekly review form modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [wins, setWins] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [dialImprovements, setDialImprovements] = useState('');
  const [dialNeedsAttention, setDialNeedsAttention] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  async function loadInsights() {
    try {
      const res = await fetch('/api/privacy?action=export');
      const json = await res.json();
      setData(json);
      if (json.trackingHistory?.checkins) {
        setCheckins(json.trackingHistory.checkins);
      }

      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();
      if (revData.reviews) {
        setReviews(revData.reviews);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInsights();
  }, []);

  async function handleSaveReview(e: React.FormEvent) {
    e.preventDefault();
    setSavingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wins,
          difficulties,
          dialImprovements,
          dialNeedsAttention,
          nextWeekFocus1: 'Keep 1/2 plate vegetables at lunch',
          nextWeekFocus2: '15-minute post-meal walk',
          nextWeekFocus3: 'Consistent bedtime light curfew',
        }),
      });
      if (res.ok) {
        setShowReviewModal(false);
        setWins('');
        setDifficulties('');
        setDialImprovements('');
        setDialNeedsAttention('');
        loadInsights();
      }
    } catch (err) {
      console.error('Save review error:', err);
    } finally {
      setSavingReview(false);
    }
  }

  // Weight entries (filter out nulls, sorted chronologically)
  const weightEntries = checkins
    .filter(c => c.weight_kg != null && !isNaN(parseFloat(c.weight_kg)))
    .slice(0, 14)
    .reverse();

  // Dynamic calculations from real logs
  const totalCheckins = checkins.length;
  const movementDays = checkins.filter(c => Number(c.movement_duration_mins) > 0).length;
  const avgSleep = totalCheckins > 0
    ? (checkins.reduce((acc, c) => acc + (parseFloat(c.sleep_hours) || 0), 0) / totalCheckins).toFixed(1)
    : '0.0';
  const plateComplianceCount = checkins.filter(c => c.meals_followed_plan === 'Yes' || c.meals_followed_plan === 'Mostly').length;

  const avgWeight = weightEntries.length > 0
    ? (weightEntries.reduce((acc, c) => acc + parseFloat(c.weight_kg), 0) / weightEntries.length).toFixed(1)
    : null;

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D8F224] uppercase tracking-widest">
            FEEDBACK LOOPS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Insights & Adaptation
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Data-driven patterns, neutral moving averages, and smart system calibrations.
          </p>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)] flex items-center gap-2 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Complete 7-Day Review</span>
        </button>
      </div>

      {/* SMART ADAPTATION NOTICES */}
      {totalCheckins >= 3 ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1317] border border-[#D8F224]/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D8F224] uppercase">
            <Lightbulb className="w-4 h-4" />
            <span>Habit Pattern Detected from Your Check-Ins</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            &ldquo;You logged movement on {movementDays} of your last {totalCheckins} check-ins.&rdquo;
          </h3>
          <p className="text-xs sm:text-sm text-[#8E98A0] leading-relaxed">
            Across your recorded check-ins, your average sleep was {avgSleep} hours, and nutrition structure was maintained on {plateComplianceCount} days. Consistent small actions create lasting metabolic momentum without restrictive deprivation.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-[#D8F224] font-medium">
            <span>Next calibration: Keep prioritizing consistent post-meal walking and steady bedtime habits.</span>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1317] border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D8F224]/10 text-[#D8F224] flex items-center justify-center mx-auto">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Log at least 3 daily check-ins to unlock your first trend insight
            </h3>
            <p className="text-xs sm:text-sm text-[#8E98A0] max-w-md mx-auto leading-relaxed">
              SHIFT analyzes your consistency patterns across the Five Dials to highlight what is working and where friction occurs. Check in over the next few days to generate your personalized adaptation report.
            </p>
          </div>
          <Link
            href="/track"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D8F224] text-black font-bold text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(216,242,36,0.25)]"
          >
            <span>Log Today&apos;s Check-in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* NEUTRAL WEIGHT & WAIST TREND */}
      <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">Weight Trend (14-Day Baseline)</h2>
            <p className="text-xs text-[#8E98A0]">
              Presented neutrally as a moving average. Daily water fluctuations do not reflect body fat.
            </p>
          </div>
          {weightEntries.length >= 2 && avgWeight && (
            <span className="text-xs font-mono text-[#D8F224]">
              Recent moving average: ~{avgWeight} kg
            </span>
          )}
        </div>

        {/* Visual Bar Chart or Explicit Empty State */}
        {weightEntries.length >= 2 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 items-end h-36 pt-6 px-2">
              {weightEntries.map((w, idx) => {
                const val = parseFloat(w.weight_kg);
                const minWeight = Math.min(...weightEntries.map(e => parseFloat(e.weight_kg)));
                const maxWeight = Math.max(...weightEntries.map(e => parseFloat(e.weight_kg)));
                const range = Math.max(1, maxWeight - minWeight);
                const heightPct = Math.min(100, Math.max(25, ((val - minWeight) / range) * 60 + 35));
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] font-mono text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-[#D8F224] hover:bg-white transition-colors"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[8px] font-mono text-[#8E98A0] truncate max-w-full">
                      {w.date ? w.date.slice(5) : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 border border-dashed border-white/10 rounded-2xl p-6">
            <p className="text-sm font-semibold text-white">Insufficient data for trend visualization</p>
            <p className="text-xs text-[#8E98A0] max-w-sm mx-auto">
              Log at least 2 weight entries in your daily check-in to begin tracking your neutral 14-day moving average.
            </p>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-[#8E98A0] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D8F224] shrink-0" />
          <span>
            The 20 KG Blueprint Rule: We do not judge success or failure by a daily scale number. Look at clothing comfort, sustained energy, and your Five Dials.
          </span>
        </div>
      </div>

      {/* 7-DAY WEEKLY REVIEWS HISTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Weekly Review Log</h2>
          <span className="text-xs font-mono text-[#8E98A0]">
            {reviews.length} weekly reviews saved
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/5 text-center space-y-2">
            <p className="text-sm font-semibold text-white">No weekly reviews recorded yet</p>
            <p className="text-xs text-[#8E98A0]">
              Every 7 days, complete a fast 2-minute review to reset your focus for the upcoming week.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev: any) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#0E1317] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#D8F224] font-bold">
                    WEEK OF {rev.week_start_date}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">
                    Improved: {rev.dial_improvements}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] uppercase font-mono text-[#8E98A0] block">
                      What Went Well
                    </span>
                    <p className="text-white mt-0.5">{rev.wins}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] uppercase font-mono text-[#8E98A0] block">
                      Friction Point
                    </span>
                    <p className="text-white mt-0.5">{rev.difficulties}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <span className="text-[10px] uppercase font-mono text-[#D8F224] block">
                    Next Week&apos;s Focus
                  </span>
                  <ul className="list-disc list-inside text-[#8E98A0] mt-1 space-y-0.5">
                    {rev.next_week_focus_1 && <li>{rev.next_week_focus_1}</li>}
                    {rev.next_week_focus_2 && <li>{rev.next_week_focus_2}</li>}
                    {rev.next_week_focus_3 && <li>{rev.next_week_focus_3}</li>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0E1317] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-black text-white mb-1">7-Day Weekly Review</h2>
            <p className="text-xs text-[#8E98A0] mb-4">
              Reflect on the past week and calibrate your next 1–3 priorities.
            </p>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8E98A0] block mb-1">What went well this week?</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Consistently added protein to morning meals, walked after dinner..."
                  value={wins}
                  onChange={e => setWins(e.target.value)}
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div>
                <label className="text-[#8E98A0] block mb-1">What felt difficult or friction-heavy?</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Late work meetings delayed sleep, skipped water during travel..."
                  value={difficulties}
                  onChange={e => setDifficulties(e.target.value)}
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8E98A0] block mb-1">Which dial improved most?</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plate & Move"
                    value={dialImprovements}
                    onChange={e => setDialImprovements(e.target.value)}
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-[#8E98A0] block mb-1">Which dial needs attention?</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rest"
                    value={dialNeedsAttention}
                    onChange={e => setDialNeedsAttention(e.target.value)}
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="flex-1 py-2.5 rounded-xl bg-[#D8F224] text-black font-black hover:scale-105 transition-all shadow-[0_0_15px_rgba(216,242,36,0.3)]"
                >
                  {savingReview ? 'Saving...' : 'Save Weekly Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
