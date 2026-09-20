'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Utensils,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shuffle,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { MealRecommendation } from '@/lib/personalization/engine';

function MealsPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'recommend' ? 'recommend' : 'log';
  const [activeTab, setActiveTab] = useState<'log' | 'recommend'>(initialTab);

  const [meals, setMeals] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<MealRecommendation[]>([]);
  const [targetMealType, setTargetMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [activeAllergies, setActiveAllergies] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string>('Kerala / Indian');
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Meal Log Form State
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [foodItems, setFoodItems] = useState('');
  const [portionDesc, setPortionDesc] = useState('1 cup rice, 1 palm chicken, 1 bowl thoran');
  const [proteinPresent, setProteinPresent] = useState(true);
  const [plantsPresent, setPlantsPresent] = useState(true);
  const [hungerBefore, setHungerBefore] = useState(3);
  const [fullnessAfter, setFullnessAfter] = useState(4);
  const [notes, setNotes] = useState('');
  const [submittingMeal, setSubmittingMeal] = useState(false);

  async function loadMeals() {
    try {
      const res = await fetch('/api/meals');
      const data = await res.json();
      if (data.meals) {
        setMeals(data.meals);
      }
    } catch (err) {
      console.error('Failed to load meals:', err);
    }
  }

  async function fetchRecommendations(type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') {
    setLoadingRecs(true);
    try {
      const res = await fetch('/api/meals/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealType: type }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setActiveAllergies(data.activeAllergies || []);
      setCuisine(data.cuisine || 'Kerala / Indian');
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoadingRecs(false);
    }
  }

  useEffect(() => {
    loadMeals();
    fetchRecommendations(targetMealType);
  }, []);

  async function handleLogMeal(e: React.FormEvent) {
    e.preventDefault();
    if (!foodItems.trim()) return;
    setSubmittingMeal(true);

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType,
          foodItems,
          portionDesc,
          proteinPresent,
          plantsPresent,
          hungerBefore,
          fullnessAfter,
          notes,
        }),
      });

      if (res.ok) {
        setFoodItems('');
        setNotes('');
        loadMeals();
      }
    } catch (err) {
      console.error('Failed to log meal:', err);
    } finally {
      setSubmittingMeal(false);
    }
  }

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D8F224] uppercase tracking-widest">
            PLATE DIAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Nutrition & Meals</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Zero forbidden foods. Prioritize meal structure, protein density, and plants.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-2xl bg-white/[0.04] border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'log'
                ? 'bg-[#D8F224] text-black shadow-md'
                : 'text-[#8E98A0] hover:text-white'
            }`}
          >
            My Meal Logs
          </button>
          <button
            onClick={() => {
              setActiveTab('recommend');
              fetchRecommendations(targetMealType);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'recommend'
                ? 'bg-[#D8F224] text-black shadow-md'
                : 'text-[#8E98A0] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>What Should I Eat?</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MEAL LOGGING & HISTORY */}
      {activeTab === 'log' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Meal Logging Form */}
          <div className="lg:col-span-1 p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Plus className="w-4 h-4 text-[#D8F224]" />
              <h2 className="text-base font-bold text-white">Log a Meal</h2>
            </div>

            <form onSubmit={handleLogMeal} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E98A0] block mb-1">Meal Type</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['Breakfast', 'Lunch', 'Snack', 'Dinner'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMealType(t)}
                      className={`py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                        mealType === t
                          ? 'bg-[#D8F224] text-black font-bold border-[#D8F224]'
                          : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8E98A0] block mb-1">Food Items</label>
                <input
                  type="text"
                  required
                  value={foodItems}
                  onChange={e => setFoodItems(e.target.value)}
                  placeholder="e.g. 2 Dosas, 2 Boiled eggs, Sambar"
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E98A0] block mb-1">Portion Awareness</label>
                <input
                  type="text"
                  value={portionDesc}
                  onChange={e => setPortionDesc(e.target.value)}
                  placeholder="e.g. 1 cup cooked rice, 1 palm chicken"
                  className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              {/* 20 KG Blueprint Balanced Plate Checkers */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-[#8E98A0] uppercase block">
                  Blueprint Plate Checks
                </span>
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proteinPresent}
                    onChange={e => setProteinPresent(e.target.checked)}
                    className="w-4 h-4 accent-[#D8F224]"
                  />
                  <span>Protein anchor present (Eggs, Chicken, Kadala, etc.)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plantsPresent}
                    onChange={e => setPlantsPresent(e.target.checked)}
                    className="w-4 h-4 accent-[#2DD4BF]"
                  />
                  <span>Vegetables / Thoran / Fiber present</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#8E98A0] block mb-1">Hunger Before (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={hungerBefore}
                    onChange={e => setHungerBefore(parseInt(e.target.value))}
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#8E98A0] block mb-1">Fullness After (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={fullnessAfter}
                    onChange={e => setFullnessAfter(parseInt(e.target.value))}
                    className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingMeal}
                className="w-full py-2.5 rounded-xl bg-[#D8F224] text-black font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(216,242,36,0.2)]"
              >
                {submittingMeal ? 'Logging Meal...' : 'Save Meal Entry'}
              </button>
            </form>
          </div>

          {/* Today & Recent Logged Meals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white">Logged Meals</h2>
              <span className="text-xs font-mono text-[#8E98A0]">
                {meals.length} meals recorded
              </span>
            </div>

            {meals.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#0E1317] border border-white/5 text-center space-y-3">
                <span className="text-3xl">🍲</span>
                <h3 className="text-base font-bold text-white">No meals logged yet today</h3>
                <p className="text-xs text-[#8E98A0] max-w-sm mx-auto">
                  Your first logged meal establishes your daily nutritional baseline.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {meals.map((m: any) => (
                  <div
                    key={m.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0E1317] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono uppercase text-[#D8F224] font-bold">
                          {m.meal_type}
                        </span>
                        <span className="text-xs text-[#8E98A0] font-mono">{m.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{m.food_items}</h3>
                      <p className="text-xs text-[#8E98A0]">{m.portion_desc}</p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono self-start sm:self-auto">
                      {m.protein_present ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#D8F224]/10 text-[#D8F224]">
                          ✓ Protein
                        </span>
                      ) : null}
                      {m.plants_present ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                          ✓ Plants
                        </span>
                      ) : null}
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#8E98A0]">
                        Fullness {m.fullness_after}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: "WHAT SHOULD I EAT?" RECOMMENDATION ENGINE */}
      {activeTab === 'recommend' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Allergen Filter Banner */}
          <div className="p-4 rounded-2xl bg-[#0F1418] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8E98A0]">Safety Guarantee</span>
                <p className="text-xs font-semibold text-white">
                  Active Allergen Exclusions:{' '}
                  <span className="text-red-400">
                    {activeAllergies.length > 0 ? activeAllergies.join(', ') : 'None Reported'}
                  </span>
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-[#D8F224] bg-[#D8F224]/10 px-3 py-1 rounded-full border border-[#D8F224]/20 self-start sm:self-auto">
              Cuisine: {cuisine}
            </div>
          </div>

          {/* Meal Type Selector Buttons */}
          <div className="flex gap-2">
            {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTargetMealType(t);
                  fetchRecommendations(t);
                }}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                  targetMealType === t
                    ? 'bg-[#D8F224] text-black border-[#D8F224] shadow-md scale-105'
                    : 'bg-[#0E1317] border-white/10 text-[#8E98A0] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Recommendation Cards */}
          {loadingRecs ? (
            <div className="p-12 text-center text-xs text-[#8E98A0] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D8F224] animate-spin" />
              <span>Checking allergens and tailoring meal options...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D8F224]/10 text-[#D8F224] text-[10px] font-mono font-bold">
                        OPTION {i + 1} • {rec.cuisine}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Allergen Check Passed</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{rec.title}</h3>
                    <p className="text-xs text-[#8E98A0] leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-white/5 font-mono">
                    <div className="flex items-center justify-between text-white/90">
                      <span className="text-[#8E98A0]">PROTEIN SOURCE:</span>
                      <span className="text-[#D8F224] font-bold">{rec.proteinSource}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90">
                      <span className="text-[#8E98A0]">FIBER / PLANTS:</span>
                      <span className="text-emerald-400 font-bold">{rec.plantSource}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-[#8E98A0] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-white font-semibold block">
                      Visual Portion Guide
                    </span>
                    <p>{rec.portionGuide}</p>
                  </div>

                  {rec.blueprintTip && (
                    <div className="text-[11px] text-[#8E98A0] italic">
                      💡 {rec.blueprintTip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex items-center gap-2 text-sm text-[#8E98A0]">
            <Sparkles className="w-4 h-4 text-[#D8F224] animate-spin" />
            <span>Loading meals & recommendations...</span>
          </div>
        </div>
      }
    >
      <MealsPageContent />
    </Suspense>
  );
}
