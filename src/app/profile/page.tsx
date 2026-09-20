'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Scale,
  Shield,
  Utensils,
  Moon,
  Sparkles,
  Edit3,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-2 text-sm text-[#8E98A0]">
          <Sparkles className="w-4 h-4 text-[#D8F224] animate-spin" />
          <span>Loading your digital health profile...</span>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const body = data?.bodyProfile;
  const health = data?.healthScreen;
  const allergy = data?.allergyProfile;
  const food = data?.foodProfile;
  const lifestyle = data?.lifestyle;
  const skin = data?.skin;

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D8F224] uppercase tracking-widest">
            DIGITAL HEALTH IDENTITY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">My Profile</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Independently manage your body metrics, food culture, allergies, and lifestyle baseline.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="px-5 py-2.5 rounded-2xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(216,242,36,0.25)] flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Re-run Full Consultation</span>
        </Link>
      </div>

      {/* Digital Health Identity Card (Hero Identity) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#11161B] to-[#0A0D10] border-2 border-[#D8F224]/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {profile?.name || data?.user?.name || 'Hadhi Rahman'}
            </h2>
            <p className="text-xs text-[#D8F224] font-mono mt-0.5">
              {profile?.occupation || 'Member'} • {profile?.city || 'Kochi'}, {profile?.country || 'India'}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#D8F224] text-black font-black flex items-center justify-center text-xl shadow-[0_0_15px_rgba(216,242,36,0.3)]">
            S
          </div>
        </div>

        {/* Core Measurements Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-[#8E98A0] block">CURRENT WEIGHT</span>
            <span className="text-base font-bold text-white">{body?.weight_kg || 84.5} kg</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-[#8E98A0] block">HEIGHT</span>
            <span className="text-base font-bold text-white">{body?.height_cm || 176} cm</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-[#8E98A0] block">WAIST MEASUREMENT</span>
            <span className="text-base font-bold text-white">{body?.waist_cm || 92} cm</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-[#8E98A0] block">SCREENING REFERENCE</span>
            <span className="text-base font-bold text-[#D8F224]">BMI {body?.bmi || 27.3}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#8E98A0]">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
            Goal: {body?.weight_goal || 'Fat-loss & sustainable recomposition'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
            Activity: {body?.activity_level || 'Moderate'}
          </span>
          <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-semibold">
            Allergen Guard: {allergy?.allergies?.join(', ') || 'Fish, Shellfish'}
          </span>
        </div>
      </div>

      {/* Profile Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Food Profile */}
        <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#D8F224]" />
              <h3 className="text-sm font-bold text-white">Food Culture & Dining</h3>
            </div>
            <span className="text-xs font-mono text-[#8E98A0]">Section 01</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[#8E98A0]">
              <strong className="text-white">Cuisines:</strong>{' '}
              {food?.cuisine_preferences?.join(', ') || 'Kerala, South Indian, Continental'}
            </p>
            <p className="text-[#8E98A0]">
              <strong className="text-white">Staple Favorites:</strong>{' '}
              {food?.favorite_foods?.join(', ') || 'Rice, Dosa, Appam, Chicken, Kadala, Thoran'}
            </p>
            <p className="text-[#8E98A0]">
              <strong className="text-white">Dining Locations:</strong>{' '}
              {food?.dining_locations?.join(', ') || 'Home, Office'}
            </p>
          </div>
        </div>

        {/* Lifestyle & Sleep */}
        <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#2DD4BF]" />
              <h3 className="text-sm font-bold text-white">Lifestyle & Rest</h3>
            </div>
            <span className="text-xs font-mono text-[#8E98A0]">Section 02</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[#8E98A0]">
              <strong className="text-white">Sleep Hours:</strong> {lifestyle?.sleep_hours || 6.5}h (Bedtime: {lifestyle?.bedtime || '23:15'})
            </p>
            <p className="text-[#8E98A0]">
              <strong className="text-white">Daily Water Target:</strong> {lifestyle?.water_liters || 2.6} Liters
            </p>
            <p className="text-[#8E98A0]">
              <strong className="text-white">Stress Level:</strong> {lifestyle?.stress_level || 'Moderate'}
            </p>
          </div>
        </div>

        {/* Skin Wellness Profile */}
        <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              <h3 className="text-sm font-bold text-white">Skin Wellness</h3>
            </div>
            <span className="text-xs font-mono text-[#8E98A0]">Section 03</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[#8E98A0]">
              <strong className="text-white">Skin Type:</strong> {skin?.perceived_type || 'Combination'}
            </p>
            <p className="text-[#8E98A0]">
              <strong className="text-white">Concerns:</strong> {skin?.concerns?.join(', ') || 'Mild breakouts, Afternoon oiliness'}
            </p>
            <p className="text-[#8E98A0]">
              <strong className="text-white">Sunscreen:</strong> {skin?.sunscreen_use || 'Daily in morning'}
            </p>
          </div>
        </div>

        {/* Privacy & Sovereignty */}
        <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white/70" />
              <h3 className="text-sm font-bold text-white">Privacy & Control</h3>
            </div>
            <Link href="/privacy" className="text-xs font-mono text-[#D8F224] flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-[#8E98A0] leading-relaxed">
            Zero advertising. Zero selling of health information. Export full JSON or erase your account anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
