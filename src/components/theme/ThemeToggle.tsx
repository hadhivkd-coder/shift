'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Warm Light Theme'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 select-none ${
        theme === 'light'
          ? 'bg-[#EFE9DC] hover:bg-[#E5DFC8] text-[#3D372E] border border-[#DDD5C7] shadow-sm'
          : 'bg-white/5 hover:bg-white/10 text-[#D8F224] border border-white/10'
      } ${className}`}
    >
      {theme === 'light' ? (
        <>
          <Sun className="w-4 h-4 text-[#C27803] transition-transform duration-300 rotate-0" />
          {showLabel && <span className="text-xs font-mono font-bold text-[#3D372E]">Theme: Light</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#D8F224] transition-transform duration-300 -rotate-12" />
          {showLabel && <span className="text-xs font-mono font-bold text-[#F3F4F6]">Theme: Dark</span>}
        </>
      )}
    </button>
  );
}
