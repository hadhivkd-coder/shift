'use client';

import React, { useState } from 'react';
import { X, Check, Droplets, Moon, Footprints, Utensils, Heart, Sparkles } from 'lucide-react';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function DailyCheckInModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DailyCheckInModalProps) {
  const [sleepHours, setSleepHours] = useState<number>(initialData?.sleep_hours || 7.0);
  const [sleepQuality, setSleepQuality] = useState<string>(initialData?.sleep_quality || 'Restful');
  const [waterMl, setWaterMl] = useState<number>(initialData?.water_ml || 2500);
  const [movementMins, setMovementMins] = useState<number>(initialData?.movement_duration_mins || 20);
  const [movementType, setMovementType] = useState<string>(initialData?.movement_type || 'Brisk Walking');
  const [mealsFollowedPlan, setMealsFollowedPlan] = useState<string>(initialData?.meals_followed_plan || 'Mostly');
  const [energyLevel, setEnergyLevel] = useState<number>(initialData?.energy_level || 4);
  const [stressLevel, setStressLevel] = useState<number>(initialData?.stress_level || 2);
  const [weightKg, setWeightKg] = useState<string>(initialData?.weight_kg ? String(initialData.weight_kg) : '');
  const [waistCm, setWaistCm] = useState<string>(initialData?.waist_cm ? String(initialData.waist_cm) : '');
  const [skippedWeight, setSkippedWeight] = useState<boolean>(!initialData?.weight_kg);
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sleepHours,
          sleepQuality,
          waterMl,
          movementType,
          movementDurationMins: movementMins,
          mealsFollowedPlan,
          energyLevel,
          stressLevel,
          weightKg: skippedWeight ? null : weightKg ? parseFloat(weightKg) : null,
          waistCm: skippedWeight ? null : waistCm ? parseFloat(waistCm) : null,
          notes,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Checkin submission error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0E1317] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F224] text-black flex items-center justify-center font-bold text-sm">
              60s
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Daily Check-in</h2>
              <p className="text-xs text-[#8E98A0]">Quick calibration for your Five Dials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8E98A0] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Sleep */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Moon className="w-4 h-4 text-[#2DD4BF]" /> Sleep Hours
              </span>
              <span className="font-mono text-[#2DD4BF] font-bold">{sleepHours} hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={e => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-[#2DD4BF]"
            />
            <div className="flex gap-2">
              {['Restful', 'Moderate', 'Interrupted'].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSleepQuality(q)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    sleepQuality === q
                      ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF]'
                      : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Water Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Droplets className="w-4 h-4 text-sky-400" /> Hydration
              </span>
              <span className="font-mono text-sky-400 font-bold">{(waterMl / 1000).toFixed(1)} Liters</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWaterMl(prev => Math.max(500, prev - 250))}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-white text-xs font-mono font-bold"
              >
                -250ml
              </button>
              <div className="flex-1 bg-white/[0.04] rounded-xl h-9 flex items-center justify-center font-mono text-xs text-white">
                {waterMl} ml
              </div>
              <button
                type="button"
                onClick={() => setWaterMl(prev => prev + 250)}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold hover:bg-sky-500/30"
              >
                +250ml 💧
              </button>
            </div>
          </div>

          {/* Movement */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Footprints className="w-4 h-4 text-[#D8F224]" /> Movement
              </span>
              <span className="font-mono text-[#D8F224] font-bold">{movementMins} mins</span>
            </div>
            <div className="flex gap-2">
              {[15, 20, 30, 45].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setMovementMins(mins)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    movementMins === mins
                      ? 'bg-[#D8F224] text-black font-bold border-[#D8F224]'
                      : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Meals Followed Plan */}
          <div className="space-y-2">
            <span className="flex items-center gap-1.5 text-xs text-white font-semibold">
              <Utensils className="w-4 h-4 text-emerald-400" /> Meal Structure Today
            </span>
            <div className="flex gap-2">
              {[
                { label: 'Yes (On Plan)', value: 'Yes' },
                { label: 'Mostly (80%)', value: 'Mostly' },
                { label: 'Off-Plan (Reset Next)', value: 'Off-plan' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMealsFollowedPlan(opt.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    mealsFollowedPlan === opt.value
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                      : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Weight / Waist without guilt */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Body Measurements (Optional)</span>
              <button
                type="button"
                onClick={() => setSkippedWeight(prev => !prev)}
                className="text-[11px] text-[#8E98A0] hover:text-[#D8F224] underline"
              >
                {skippedWeight ? 'Enter weight today' : 'Skip today without guilt'}
              </button>
            </div>

            {!skippedWeight && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#8E98A0] block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                    placeholder="e.g. 84.5"
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8E98A0] block mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={e => setWaistCm(e.target.value)}
                    placeholder="e.g. 92"
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>
            )}
            {skippedWeight && (
              <p className="text-[11px] text-[#8E98A0]/80 italic">
                Skipping today is completely normal. Daily fluctuations reflect water and sodium, not body fat.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-[#D8F224] text-black font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)] flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'Saving Check-in...' : 'Complete Check-in'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
