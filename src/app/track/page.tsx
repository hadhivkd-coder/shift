'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Droplets,
  Moon,
  Footprints,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import DailyCheckInModal from '@/components/tracking/DailyCheckInModal';

export default function TrackPage() {
  const [data, setData] = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [waterMl, setWaterMl] = useState<number | null>(null);

  async function loadData() {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      setData(json);
      if (json.todaysCheckin && json.todaysCheckin.water_ml != null) {
        setWaterMl(json.todaysCheckin.water_ml);
      } else {
        setWaterMl(null);
      }

      // Fetch export/history for checkins
      const privRes = await fetch('/api/privacy?action=export');
      const privData = await privRes.json();
      if (privData.trackingHistory?.checkins) {
        setCheckins(privData.trackingHistory.checkins);
      }
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addWater(amount: number) {
    const current = waterMl || 0;
    const newWater = current + amount;
    setWaterMl(newWater);
    try {
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waterMl: newWater,
        }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to update water:', err);
    }
  }

  const hasCheckinToday = Boolean(data?.todaysCheckin);

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D8F224] uppercase tracking-widest">
            Daily Execution
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Health Journal</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Track daily dials in under 60 seconds. Consistency over intensity.
          </p>
        </div>

        <button
          onClick={() => setIsCheckInOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)] flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          <span>{hasCheckinToday ? 'Update Today\'s Check-in' : 'Complete 60s Check-in'}</span>
        </button>
      </div>

      {/* Quick Interactive Day Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Hydration Ring */}
        <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#8E98A0]">Quick Water Log</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>

          <div className="text-center py-2">
            <span className="text-3xl font-black text-white font-mono">
              {waterMl != null ? `${(waterMl / 1000).toFixed(1)} L` : '—'}
            </span>
            <span className="text-xs text-[#8E98A0] block mt-0.5">
              {waterMl != null ? 'Target: 2.8 L / day' : 'Not logged yet today'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addWater(250)}
              className="py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-bold font-mono transition-colors"
            >
              +250 ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-bold font-mono transition-colors"
            >
              +500 ml 💧
            </button>
          </div>
        </div>

        {/* Movement Dial Quick Summary */}
        <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#8E98A0]">Movement Baseline</span>
            <Footprints className="w-4 h-4 text-[#D8F224]" />
          </div>

          <div className="text-center py-2">
            <span className="text-3xl font-black text-white font-mono">
              {data?.todaysCheckin?.movement_duration_mins != null
                ? `${data.todaysCheckin.movement_duration_mins} mins`
                : '—'}
            </span>
            <span className="text-xs text-[#8E98A0] block mt-0.5">
              {data?.todaysCheckin?.movement_type || 'Not logged yet today'}
            </span>
          </div>

          <p className="text-[11px] text-[#8E98A0] text-center">
            Contracting leg muscles right after meals absorbs postprandial glucose directly.
          </p>
        </div>

        {/* Sleep & Rest Status */}
        <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#8E98A0]">Rest & Recovery</span>
            <Moon className="w-4 h-4 text-[#2DD4BF]" />
          </div>

          <div className="text-center py-2">
            <span className="text-3xl font-black text-white font-mono">
              {data?.todaysCheckin?.sleep_hours != null
                ? `${data.todaysCheckin.sleep_hours}h`
                : '—'}
            </span>
            <span className="text-xs text-[#2DD4BF] font-mono block mt-0.5">
              {data?.todaysCheckin?.sleep_quality || 'Not logged yet today'}
            </span>
          </div>

          <p className="text-[11px] text-[#8E98A0] text-center">
            Consistent sleep suppresses daytime ghrelin spikes and protects metabolic rate.
          </p>
        </div>
      </div>

      {/* Recent Daily Logs Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Recent Daily Logs</h2>
            <p className="text-xs text-[#8E98A0]">Historical check-in log and habit trends</p>
          </div>
          <span className="text-xs font-mono text-[#8E98A0]">
            {checkins.length} check-ins recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#8E98A0] font-mono">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">SLEEP</th>
                <th className="py-2.5 px-3">WATER</th>
                <th className="py-2.5 px-3">MOVEMENT</th>
                <th className="py-2.5 px-3">MEALS</th>
                <th className="py-2.5 px-3">WEIGHT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {checkins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#8E98A0]">
                    No daily check-ins recorded yet. Click &ldquo;Complete 60s Check-in&rdquo; to log today.
                  </td>
                </tr>
              ) : (
                checkins.slice(0, 10).map((chk: any) => (
                  <tr key={chk.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-[#8E98A0]">{chk.date}</td>
                    <td className="py-3 px-3 font-mono">{chk.sleep_hours ? `${chk.sleep_hours}h` : '—'}</td>
                    <td className="py-3 px-3 font-mono text-sky-400">
                      {chk.water_ml ? `${(chk.water_ml / 1000).toFixed(1)}L` : '—'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#D8F224]">
                      {chk.movement_duration_mins ? `${chk.movement_duration_mins}m` : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-[11px]">
                        {chk.meals_followed_plan || 'On plan'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {chk.weight_kg ? `${chk.weight_kg} kg` : <span className="text-[#8E98A0]/60 italic">Skipped</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DailyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={() => loadData()}
        initialData={data?.todaysCheckin}
      />
    </div>
  );
}
