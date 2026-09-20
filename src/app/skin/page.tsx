'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Check,
  Shield,
} from 'lucide-react';

export default function SkinPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Today's routine checklist state
  const [amCleanse, setAmCleanse] = useState(false);
  const [amMoisturize, setAmMoisturize] = useState(false);
  const [amSunscreen, setAmSunscreen] = useState(false);

  const [pmCleanse, setPmCleanse] = useState(false);
  const [pmTreatment, setPmTreatment] = useState(false);
  const [pmMoisturize, setPmMoisturize] = useState(false);

  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [drynessLevel, setDrynessLevel] = useState<number | null>(null);
  const [oilinessLevel, setOilinessLevel] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  async function loadSkinData() {
    try {
      const res = await fetch('/api/skin');
      const json = await res.json();
      setData(json);

      if (json.todayLog) {
        setHasLoggedToday(true);
        setAmCleanse(Boolean(json.todayLog.am_cleanse));
        setAmMoisturize(Boolean(json.todayLog.am_moisturize));
        setAmSunscreen(Boolean(json.todayLog.am_sunscreen));
        setPmCleanse(Boolean(json.todayLog.pm_cleanse));
        setPmTreatment(Boolean(json.todayLog.pm_treatment));
        setPmMoisturize(Boolean(json.todayLog.pm_moisturize));
        setDrynessLevel(json.todayLog.dryness_level ?? 2);
        setOilinessLevel(json.todayLog.oiliness_level ?? 2);
      } else {
        setHasLoggedToday(false);
        setDrynessLevel(null);
        setOilinessLevel(null);
      }
    } catch (err) {
      console.error('Failed to load skin data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkinData();
  }, []);

  async function handleSaveRoutine() {
    setSaving(true);
    try {
      const res = await fetch('/api/skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amCleanse,
          amMoisturize,
          amSunscreen,
          pmCleanse,
          pmTreatment,
          pmMoisturize,
          drynessLevel: drynessLevel ?? 2,
          oilinessLevel: oilinessLevel ?? 2,
        }),
      });

      if (res.ok) {
        setSavedMsg(true);
        setHasLoggedToday(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save skin routine:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#A78BFA] uppercase tracking-widest">
            BARRIER & HYDRATION COMPANION
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Skin & Barrier Care</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Gentle cosmetic habits, hydration tracking, and daily sun protection.
          </p>
        </div>

        {savedMsg && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Check className="w-3.5 h-3.5" />
            <span>Habits Synced</span>
          </div>
        )}
      </div>

      {/* AM & PM Daily Routine Checkers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Morning AM Routine */}
        <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Morning Routine (AM)</h2>
            </div>
            <span className="text-xs font-mono text-amber-400">Protect & Hydrate</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Gentle Non-Stripping Cleanser', state: amCleanse, setter: setAmCleanse, hint: 'Lukewarm water wash or gentle barrier cleanser' },
              { label: 'Lightweight Moisturizer', state: amMoisturize, setter: setAmMoisturize, hint: 'Supports moisture barrier before sun exposure' },
              { label: 'Broad-Spectrum Sunscreen (SPF 30+)', state: amSunscreen, setter: setAmSunscreen, hint: 'Adequate daily coverage for face and neck' },
            ].map((step, idx) => (
              <div
                key={idx}
                onClick={() => step.setter(!step.state)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  step.state
                    ? 'bg-amber-500/10 border-amber-500/30 text-white'
                    : 'bg-white/[0.02] border-white/5 text-[#8E98A0] hover:text-white'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-white">{step.label}</p>
                  <p className="text-[11px] text-[#8E98A0]">{step.hint}</p>
                </div>
                {step.state ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evening PM Routine */}
        <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-[#2DD4BF]" />
              <h2 className="text-base font-bold text-white">Evening Routine (PM)</h2>
            </div>
            <span className="text-xs font-mono text-[#2DD4BF]">Cleanse & Repair</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Thorough Evening Cleanser', state: pmCleanse, setter: setPmCleanse, hint: 'Cleanses sunscreen, sweat, and environmental residue' },
              { label: 'Gentle Hydrating Serum (Optional)', state: pmTreatment, setter: setPmTreatment, hint: 'Hyaluronic acid or gentle niacinamide' },
              { label: 'Barrier Restorative Night Cream', state: pmMoisturize, setter: setPmMoisturize, hint: 'Locks in hydration while sleeping' },
            ].map((step, idx) => (
              <div
                key={idx}
                onClick={() => step.setter(!step.state)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  step.state
                    ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-white'
                    : 'bg-white/[0.02] border-white/5 text-[#8E98A0] hover:text-white'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-white">{step.label}</p>
                  <p className="text-[11px] text-[#8E98A0]">{step.hint}</p>
                </div>
                {step.state ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2DD4BF]" />
                ) : (
                  <Circle className="w-5 h-5 text-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Skin Barrier Comfort Check */}
      <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Daily Barrier Sensation</h3>
            <p className="text-xs text-[#8E98A0]">Subjective comfort tracking to monitor daily hydration balance</p>
          </div>
          {!hasLoggedToday && (
            <span className="text-xs font-mono text-[#8E98A0] italic">Not logged yet today</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between">
              <label className="text-[#8E98A0] block font-medium">Hydration / Dryness Sensation</label>
              <span className="font-mono text-[11px] text-white">
                {drynessLevel != null ? `${drynessLevel} / 5` : '—'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={drynessLevel ?? 2}
              onChange={e => setDrynessLevel(parseInt(e.target.value))}
              className="w-full accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-[#8E98A0]/70 font-mono">
              <span>1 = Plump & Hydrated</span>
              <span>5 = Tight & Parched</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between">
              <label className="text-[#8E98A0] block font-medium">Oiliness / Shine Balance</label>
              <span className="font-mono text-[11px] text-white">
                {oilinessLevel != null ? `${oilinessLevel} / 5` : '—'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={oilinessLevel ?? 2}
              onChange={e => setOilinessLevel(parseInt(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-[#8E98A0]/70 font-mono">
              <span>1 = Balanced & Matte</span>
              <span>5 = Heavy Midday Shine</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveRoutine}
          disabled={saving}
          className="w-full py-3 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(216,242,36,0.25)]"
        >
          {saving ? 'Updating Routine...' : 'Save Today\'s Barrier Log'}
        </button>
      </div>

      {/* Non-Diagnostic Disclaimer Banner */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex items-start gap-3.5 text-xs text-[#8E98A0]">
        <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">Non-Diagnostic Disclaimer</p>
          <p className="leading-relaxed text-[11px]">
            Skin habit tracking in SHIFT is strictly a personal barrier care and cosmetic hygiene companion. SHIFT does not evaluate, diagnose, or treat dermatological conditions, acne vulgaris, dermatitis, eczema, suspicious lesions, or infections. Always consult a licensed, board-certified dermatologist for clinical medical evaluations, diagnostic assessments, or prescription skincare.
          </p>
        </div>
      </div>
    </div>
  );
}
