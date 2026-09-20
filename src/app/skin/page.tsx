'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  ShieldAlert,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';

export default function SkinPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Today's checklist state
  const [amCleanse, setAmCleanse] = useState(false);
  const [amMoisturize, setAmMoisturize] = useState(false);
  const [amSunscreen, setAmSunscreen] = useState(false);

  const [pmCleanse, setPmCleanse] = useState(false);
  const [pmTreatment, setPmTreatment] = useState(false);
  const [pmMoisturize, setPmMoisturize] = useState(false);

  const [acneLevel, setAcneLevel] = useState(2);
  const [drynessLevel, setDrynessLevel] = useState(2);
  const [oilinessLevel, setOilinessLevel] = useState(2);
  const [irritationLevel, setIrritationLevel] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  async function loadSkinData() {
    try {
      const res = await fetch('/api/skin');
      const json = await res.json();
      setData(json);

      if (json.todayLog) {
        setAmCleanse(Boolean(json.todayLog.am_cleanse));
        setAmMoisturize(Boolean(json.todayLog.am_moisturize));
        setAmSunscreen(Boolean(json.todayLog.am_sunscreen));
        setPmCleanse(Boolean(json.todayLog.pm_cleanse));
        setPmTreatment(Boolean(json.todayLog.pm_treatment));
        setPmMoisturize(Boolean(json.todayLog.pm_moisturize));
        setAcneLevel(json.todayLog.acne_level || 2);
        setDrynessLevel(json.todayLog.dryness_level || 2);
        setOilinessLevel(json.todayLog.oiliness_level || 2);
        setIrritationLevel(json.todayLog.irritation_level || 1);
      }
    } catch (err) {
      console.error('Failed to load skin:', err);
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
          acneLevel,
          drynessLevel,
          oilinessLevel,
          irritationLevel,
        }),
      });

      if (res.ok) {
        setSavedMsg(true);
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
            BARRIER WELLNESS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Skin Wellness</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Gentle cosmetic hygiene and daily sun protection. We never diagnose skin diseases.
          </p>
        </div>

        {savedMsg && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Check className="w-3.5 h-3.5" />
            <span>Routine Synced</span>
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
              { label: 'Gentle Non-Stripping Cleanser', state: amCleanse, setter: setAmCleanse, hint: 'Lukewarm water wash or gentle gel' },
              { label: 'Barrier Moisturizer', state: amMoisturize, setter: setAmMoisturize, hint: 'Ceramides or hyaluronic acid' },
              { label: 'Broad-Spectrum SPF 50+ Sunscreen', state: amSunscreen, setter: setAmSunscreen, hint: '2 finger lengths for face and neck' },
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
            <span className="text-xs font-mono text-[#2DD4BF]">Repair & Reset</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Thorough Night Cleanser', state: pmCleanse, setter: setPmCleanse, hint: 'Rinse off sunscreen and daily pollutants' },
              { label: 'Gentle Treatment / Serum (Optional)', state: pmTreatment, setter: setPmTreatment, hint: 'Niacinamide or gentle peptide' },
              { label: 'Replenishing Night Moisturizer', state: pmMoisturize, setter: setPmMoisturize, hint: 'Seals moisture barrier during sleep' },
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

      {/* Daily Skin Symptom Scales & Save */}
      <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">Today&apos;s Skin State</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-[#8E98A0] block mb-1">Acne / Breakouts (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={acneLevel}
              onChange={e => setAcneLevel(parseInt(e.target.value))}
              className="w-full accent-[#A78BFA]"
            />
            <span className="font-mono text-[11px] text-white">Level: {acneLevel}/5</span>
          </div>

          <div>
            <label className="text-[#8E98A0] block mb-1">Dryness / Tightness (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={drynessLevel}
              onChange={e => setDrynessLevel(parseInt(e.target.value))}
              className="w-full accent-sky-400"
            />
            <span className="font-mono text-[11px] text-white">Level: {drynessLevel}/5</span>
          </div>

          <div>
            <label className="text-[#8E98A0] block mb-1">Oiliness / Shine (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={oilinessLevel}
              onChange={e => setOilinessLevel(parseInt(e.target.value))}
              className="w-full accent-amber-400"
            />
            <span className="font-mono text-[11px] text-white">Level: {oilinessLevel}/5</span>
          </div>

          <div>
            <label className="text-[#8E98A0] block mb-1">Irritation / Redness (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={irritationLevel}
              onChange={e => setIrritationLevel(parseInt(e.target.value))}
              className="w-full accent-red-400"
            />
            <span className="font-mono text-[11px] text-white">Level: {irritationLevel}/5</span>
          </div>
        </div>

        <button
          onClick={handleSaveRoutine}
          disabled={saving}
          className="w-full py-3 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(216,242,36,0.25)]"
        >
          {saving ? 'Updating Routine...' : 'Save Today&apos;s Skin Log'}
        </button>
      </div>

      {/* Safety Notice & Dermatologist Referral Guidance */}
      <div className="p-5 rounded-3xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3.5 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300">Clinical Safety Notice</p>
          <p className="leading-relaxed text-[#8E98A0]">
            SHIFT provides cosmetic habit tracking only. If you notice severe painful cysts, rapidly changing moles, intense itching, sudden widespread rashes, or non-healing lesions, please schedule a direct clinical visit with a board-certified dermatologist. Never self-prescribe prescription steroid or antibiotic creams.
          </p>
        </div>
      </div>
    </div>
  );
}
