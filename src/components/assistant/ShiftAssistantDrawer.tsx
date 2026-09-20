'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, PhoneCall, ShieldAlert, Bot } from 'lucide-react';

interface ShiftAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userContext: {
    name?: string;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isMedicalRefusal?: boolean;
  isUrgentAlert?: boolean;
  emergencyNumber?: string;
  suggestedFollowUps?: string[];
}

export default function ShiftAssistantDrawer({
  isOpen,
  onClose,
  userContext,
}: ShiftAssistantDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${userContext.name || 'there'}! I am your **SHIFT Companion** for *The 20 KG Blueprint*.\n\nI can help tailor your meals, troubleshoot cravings, suggest gentle workout swaps, or optimize your evening wind-down.\n\n*Note: I provide evidence-based lifestyle guidance and cannot diagnose medical conditions or prescribe medications.*`,
      suggestedFollowUps: [
        'What should I eat tonight?',
        'I am craving sweets right now',
        'I missed my workout today',
        'Help me with sleep wind-down',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSend(textToSend?: string) {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const userMsgId = `usr_${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, role: 'user', content: query },
    ];

    setMessages(newMessages);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'I am ready to help you navigate your habits.',
          isMedicalRefusal: data.isMedicalRefusal,
          isUrgentAlert: data.isUrgentAlert,
          emergencyNumber: data.emergencyNumber,
          suggestedFollowUps: data.suggestedFollowUps,
        },
      ]);
    } catch (err) {
      console.error('Assistant chat error:', err);
      setMessages([
        ...newMessages,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach the assistant service right now. Please check your connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg bg-[#0C1013] border-l border-white/10 h-full flex flex-col shadow-2xl z-10">
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#080B0D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D8F224] text-black flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">SHIFT Assistant</span>
                <span className="text-[10px] bg-[#D8F224]/10 text-[#D8F224] border border-[#D8F224]/30 px-1.5 py-0.2 rounded font-mono font-semibold">
                  GUARDED
                </span>
              </div>
              <p className="text-[11px] text-[#8E98A0]">Personalized to The 20 KG Blueprint</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8E98A0] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[#D8F224] text-black font-medium rounded-tr-none'
                    : msg.isUrgentAlert
                    ? 'bg-red-950/40 border border-red-500/50 text-red-200 rounded-tl-none'
                    : msg.isMedicalRefusal
                    ? 'bg-amber-950/30 border border-amber-500/30 text-amber-200 rounded-tl-none'
                    : 'bg-[#151B20] text-[#F3F4F6] border border-white/5 rounded-tl-none'
                }`}
              >
                {msg.isUrgentAlert && (
                  <div className="flex items-center gap-2 text-red-400 font-bold mb-2 pb-1 border-b border-red-500/20 text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>URGENT MEDICAL NOTICE</span>
                  </div>
                )}

                {msg.isMedicalRefusal && !msg.isUrgentAlert && (
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-2 pb-1 border-b border-amber-500/20 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>CLINICAL CONSULTATION BOUNDARY</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {msg.content}
                </div>

                {msg.emergencyNumber && (
                  <div className="mt-3 p-2 bg-red-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-red-300">
                    <PhoneCall className="w-4 h-4" />
                    <span>Emergency Hotline: {msg.emergencyNumber}</span>
                  </div>
                )}
              </div>

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#D8F224] border border-[#D8F224]/20 transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#8E98A0] p-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D8F224] animate-spin" />
              <span>Analyzing against your Blueprint profile...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#080B0D]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask about meals, cravings, workouts..."
              className="flex-1 bg-[#13191E] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#8E98A0] focus:outline-none focus:border-[#D8F224] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="w-10 h-10 rounded-xl bg-[#D8F224] text-black disabled:opacity-40 flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-[#8E98A0]/70 mt-2">
            SHIFT is a wellness companion and never replaces medical advice or diagnoses.
          </p>
        </div>
      </div>
    </div>
  );
}
