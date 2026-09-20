'use client';

import React, { useState } from 'react';
import { Utensils, Footprints, Dumbbell, Moon, Repeat, ChevronRight, Sparkles } from 'lucide-react';

interface FiveDialsWidgetProps {
  dials: {
    dial_plate: number;
    dial_move: number;
    dial_lift: number;
    dial_rest: number;
    dial_repeat: number;
    plate_action?: string;
    move_action?: string;
    lift_action?: string;
    rest_action?: string;
    repeat_action?: string;
    plate_streak?: number;
    move_streak?: number;
    lift_streak?: number;
    rest_streak?: number;
    repeat_streak?: number;
  };
}

export default function FiveDialsWidget({ dials }: FiveDialsWidgetProps) {
  const [selectedDial, setSelectedDial] = useState<string>('plate');

  const dialConfig = [
    {
      key: 'plate',
      name: 'PLATE',
      level: dials?.dial_plate || 3,
      streak: dials?.plate_streak || 0,
      action: dials?.plate_action || 'Anchor main meals with high-protein and 1/2 vegetables',
      color: '#D8F224',
      accentBg: 'rgba(216, 242, 36, 0.1)',
      icon: Utensils,
      description: 'Nutrition structure, fiber anchoring, protein density & zero forbidden foods.',
    },
    {
      key: 'move',
      name: 'MOVE',
      level: dials?.dial_move || 3,
      streak: dials?.move_streak || 0,
      action: dials?.move_action || '15-minute post-meal walk & 7,500 daily steps',
      color: '#38BDF8',
      accentBg: 'rgba(56, 189, 248, 0.1)',
      icon: Footprints,
      description: 'Non-exercise physical activity (NEAT), post-meal glucose buffering walks.',
    },
    {
      key: 'lift',
      name: 'LIFT',
      level: dials?.dial_lift || 2,
      streak: dials?.lift_streak || 0,
      action: dials?.lift_action || '3 short compound resistance sessions per week',
      color: '#F59E0B',
      accentBg: 'rgba(245, 158, 11, 0.1)',
      icon: Dumbbell,
      description: 'Muscle stimulation to safeguard resting metabolic rate during fat management.',
    },
    {
      key: 'rest',
      name: 'REST',
      level: dials?.dial_rest || 3,
      streak: dials?.rest_streak || 0,
      action: dials?.rest_action || '10:30 PM dim-lighting electronic wind-down',
      color: '#2DD4BF',
      accentBg: 'rgba(45, 212, 191, 0.1)',
      icon: Moon,
      description: 'Circadian alignment, sleep consistency, and nervous system down-regulation.',
    },
    {
      key: 'repeat',
      name: 'REPEAT',
      level: dials?.dial_repeat || 4,
      streak: dials?.repeat_streak || 0,
      action: dials?.repeat_action || '60-second daily check-in logged consistently',
      color: '#A78BFA',
      accentBg: 'rgba(167, 139, 250, 0.1)',
      icon: Repeat,
      description: 'The master dial: habit compounding, self-compassion, and never missing twice.',
    },
  ];

  const current = dialConfig.find(d => d.key === selectedDial) || dialConfig[0];
  const CurrentIcon = current.icon;

  return (
    <div className="bg-[#0E1215] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow matching active dial */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: current.color }}
      />

      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E98A0]">
            Core System
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            The Five Dials
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D8F224]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Operating System</span>
        </div>
      </div>

      {/* Interactive 5 Dials Gauge Bar */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
        {dialConfig.map(dial => {
          const isSelected = selectedDial === dial.key;
          const Icon = dial.icon;
          return (
            <button
              key={dial.key}
              onClick={() => setSelectedDial(dial.key)}
              className={`flex flex-col items-center p-2.5 sm:p-3 rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-white/[0.08] scale-105 shadow-lg'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
              }`}
              style={{ borderColor: isSelected ? dial.color : 'rgba(255, 255, 255, 0.08)' }}
            >
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform"
                style={{ backgroundColor: dial.accentBg, color: dial.color }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <span className="text-[10px] sm:text-xs font-black tracking-wider text-white">
                {dial.name}
              </span>

              {/* Dial Level Bars (1-5) */}
              <div className="flex items-center gap-0.5 mt-1.5">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div
                    key={lvl}
                    className="w-1.5 sm:w-2 h-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: lvl <= dial.level ? dial.color : 'rgba(255, 255, 255, 0.15)',
                    }}
                  />
                ))}
              </div>

              <span className="text-[9px] font-mono text-[#8E98A0] mt-1">
                Lvl {dial.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded Active Dial Card */}
      <div
        className="p-4 rounded-2xl border transition-all"
        style={{
          backgroundColor: current.accentBg,
          borderColor: `${current.color}40`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{ backgroundColor: current.color, color: '#000000' }}
            >
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{current.name} DIAL</h3>
                <span
                  className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${current.color}30`, color: current.color }}
                >
                  Level {current.level} of 5
                </span>
              </div>
              <p className="text-xs text-[#8E98A0]">{current.description}</p>
            </div>
          </div>

          {current.streak > 0 && (
            <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-white flex items-center gap-1.5">
              <span>🔥</span>
              <span>{current.streak}-day momentum</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2">
          <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: current.color }} />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-[#8E98A0]">
              Current Actionable Habit
            </span>
            <p className="text-sm font-medium text-white">{current.action}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
