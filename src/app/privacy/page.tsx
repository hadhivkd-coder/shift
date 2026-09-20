'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  EyeOff,
  UserX,
  Sparkles,
} from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();
  const [privacyInfo, setPrivacyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Consents state
  const [healthProfileConsent, setHealthProfileConsent] = useState(true);
  const [recommendationsConsent, setRecommendationsConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [savingConsent, setSavingConsent] = useState(false);
  const [consentMsg, setConsentMsg] = useState(false);

  // Deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadPrivacyData() {
    try {
      const res = await fetch('/api/privacy');
      const data = await res.json();
      setPrivacyInfo(data);
      if (data.consents) {
        setHealthProfileConsent(Boolean(data.consents.health_profile_consent));
        setRecommendationsConsent(Boolean(data.consents.recommendations_consent));
        setAnalyticsConsent(Boolean(data.consents.analytics_consent));
      }
    } catch (err) {
      console.error('Failed to load privacy info:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrivacyData();
  }, []);

  async function handleUpdateConsents() {
    setSavingConsent(true);
    try {
      await fetch('/api/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_consents',
          consents: {
            healthProfile: healthProfileConsent,
            recommendations: recommendationsConsent,
            analytics: analyticsConsent,
          },
        }),
      });
      setConsentMsg(true);
      setTimeout(() => setConsentMsg(false), 3000);
    } catch (err) {
      console.error('Failed to update consents:', err);
    } finally {
      setSavingConsent(false);
    }
  }

  async function handleExportData() {
    try {
      const res = await fetch('/api/privacy?action=export');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shift-health-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Data export failed:', err);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch('/api/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_account' }),
      });
      if (res.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error('Failed to delete account:', err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#D8F224] uppercase tracking-widest">
            DATA SOVEREIGNTY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Privacy Center</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Your health metrics are strictly private. You own your data.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold font-mono transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#D8F224]" />
          <span>Export All Data (JSON)</span>
        </button>
      </div>

      {/* Primary Privacy Charter Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0E1419] to-[#121A20] border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#D8F224]">
          <Shield className="w-4 h-4" />
          <span>THE SHIFT PRIVACY CHARTER</span>
        </div>
        <h2 className="text-lg font-bold text-white">We never monetize your biology.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-[#8E98A0]">
          <div className="space-y-1">
            <span className="text-white font-semibold block">🚫 No Advertising</span>
            <p>Your health profiles and food logs are never connected to ad networks or tracking pixels.</p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-semibold block">🔒 Private by Default</span>
            <p>No public health profiles. No identifiable metrics exposed in URLs or unauthenticated APIs.</p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-semibold block">🗑️ Complete Erasure</span>
            <p>You can export your complete structured data or delete your entire record with one click.</p>
          </div>
        </div>
      </div>

      {/* MY DATA INVENTORY */}
      <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">My Data Inventory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[#8E98A0] text-[10px] uppercase block">Check-ins Logged</span>
            <span className="text-xl font-bold text-white">
              {privacyInfo?.dataInventory?.dailyCheckins || 0} entries
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[#8E98A0] text-[10px] uppercase block">Meals Tracked</span>
            <span className="text-xl font-bold text-white">
              {privacyInfo?.dataInventory?.loggedMeals || 0} entries
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[#8E98A0] text-[10px] uppercase block">Skin Records</span>
            <span className="text-xl font-bold text-white">
              {privacyInfo?.dataInventory?.skinLogs || 0} entries
            </span>
          </div>
        </div>
      </div>

      {/* GRANULAR CONSENT SETTINGS */}
      <div className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Consent Settings</h3>
          {consentMsg && (
            <span className="text-xs font-mono text-[#D8F224]">✓ Consents saved</span>
          )}
        </div>

        <div className="space-y-3 text-xs">
          <label className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Health Profile Processing</span>
              <span className="text-[#8E98A0]">
                Permits SHIFT to store body metrics and health conditions for safety screening.
              </span>
            </div>
            <input
              type="checkbox"
              checked={healthProfileConsent}
              onChange={e => setHealthProfileConsent(e.target.checked)}
              className="w-5 h-5 accent-[#D8F224]"
            />
          </label>

          <label className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Personalized Nutrition Engine</span>
              <span className="text-[#8E98A0]">
                Uses your dietary culture and allergies to filter safe Kerala and Indian meal ideas.
              </span>
            </div>
            <input
              type="checkbox"
              checked={recommendationsConsent}
              onChange={e => setRecommendationsConsent(e.target.checked)}
              className="w-5 h-5 accent-[#D8F224]"
            />
          </label>

          <label className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Anonymous Aggregate Telemetry</span>
              <span className="text-[#8E98A0]">
                Optional non-identifiable feature retention stats to improve the app.
              </span>
            </div>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={e => setAnalyticsConsent(e.target.checked)}
              className="w-5 h-5 accent-[#D8F224]"
            />
          </label>
        </div>

        <button
          onClick={handleUpdateConsents}
          disabled={savingConsent}
          className="px-5 py-2 rounded-xl bg-[#D8F224] text-black font-bold text-xs hover:scale-105 active:scale-95 transition-all"
        >
          {savingConsent ? 'Saving...' : 'Update Consents'}
        </button>
      </div>

      {/* DANGER ZONE: PERMANENT ACCOUNT ERASURE */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-3">
        <h3 className="text-base font-bold text-red-300">Danger Zone: Permanent Erasure</h3>
        <p className="text-xs text-[#8E98A0] leading-relaxed">
          Permanently delete your account, session keys, health profiles, meal entries, and check-in history. This action cannot be reversed.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Account & Health Data</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[#0E1317] border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Confirm Permanent Erasure</h3>
            <p className="text-xs text-[#8E98A0] leading-relaxed">
              Are you sure you want to delete your entire health profile, meals, dials, and journal logs? All database rows associated with your account will be immediately deleted.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-black text-xs hover:bg-red-600 transition-colors"
              >
                {deleting ? 'Erasing...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
