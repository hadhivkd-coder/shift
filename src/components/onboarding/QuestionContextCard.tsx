'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuestionContextCardProps {
  title: string;
  whyWeAsk: string;
  howToAnswer: string;
  confusionsBusted?: string[];
  mythBuster?: string;
}

export default function QuestionContextCard({
  title,
  whyWeAsk,
  howToAnswer,
  confusionsBusted = [],
  mythBuster,
}: QuestionContextCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#D8F224]/10 text-[#D8F224] flex items-center justify-center font-bold text-xs">
            ?
          </div>
          <div>
            <span className="text-xs font-semibold text-white/90">{title}</span>
            <span className="block text-[10px] text-[#8E98A0]">
              {isOpen ? 'Tap to collapse explanation' : 'Confused? Tap for detailed guidance & tips'}
            </span>
          </div>
        </div>

        <div className="text-[#8E98A0] p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 border-t border-white/5 space-y-3 text-xs animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#D8F224] font-bold block">
              Why We Ask This
            </span>
            <p className="text-[#8E98A0] leading-relaxed mt-0.5">{whyWeAsk}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-sky-400 font-bold block">
              How To Answer Accurately
            </span>
            <p className="text-white/80 leading-relaxed mt-0.5">{howToAnswer}</p>
          </div>

          {confusionsBusted.length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">
                Common Confusions Busted
              </span>
              <ul className="space-y-1 text-[11px] text-[#8E98A0]">
                {confusionsBusted.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#D8F224] font-bold shrink-0">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mythBuster && (
            <div className="p-2.5 rounded-xl bg-[#D8F224]/5 border border-[#D8F224]/20 text-[11px] text-[#D8F224] flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Blueprint Myth Buster:</strong> {mythBuster}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
