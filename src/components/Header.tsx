import React from 'react';
import { Play, Pause, RotateCcw, BookOpen } from 'lucide-react';
import { AppTheme, THEME_CONFIGS } from '../types/theme';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  activeTab: 'diagram' | 'ram' | 'trace';
  onTabChange: (tab: 'diagram' | 'ram' | 'trace') => void;
  onOpenGuide: () => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  isHalted: boolean;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenGuide,
  isRunning,
  onToggleRun,
  onReset,
  isHalted,
  currentTheme,
  onThemeChange,
}) => {
  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md shadow-lg border-b-2 transition-colors ${
        isBalatro
          ? 'bg-[#12161f]/95 border-[#2b3543] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#1a0820]/95 border-[#58063f] text-[#f9d9ef]'
          : 'bg-[#0b0f19]/95 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 h-18">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="relative">
            {isBalatro ? (
              <div className="w-10 h-10 rounded-xl bg-[#e84118] border-2 border-white/80 shadow-md flex items-center justify-center text-xl">
                🃏
              </div>
            ) : isPurble ? (
              <img
                src="/assets/aistudio/image_aff80481.png"
                alt="Purble Place"
                className="w-10 h-10 object-cover rounded-xl border-2 border-[#c56eab] shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-cyan-600 border-2 border-cyan-400 shadow-md flex items-center justify-center text-xl">
                ⚡
              </div>
            )}
          </div>

          <div>
            <a
              href="/"
              className="text-base sm:text-lg font-black tracking-wide hover:opacity-80 transition-opacity flex items-center gap-1.5 font-sans"
            >
              <span>
                {isBalatro
                  ? 'BALATRO CASINO'
                  : isPurble
                  ? 'PURBLE PALACE'
                  : 'MALVINO LAB'}
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-80">
                · {isBalatro ? 'Roguelike SAP-1' : isPurble ? 'Comfy Cakes' : '8-Bit CPU'}
              </span>
            </a>
            <div className="text-[10px] font-mono tracking-wider opacity-70">
              {isBalatro
                ? 'Poker Deck & Hypnotic CRT Architecture'
                : isPurble
                ? 'Cake Bakery Conveyor Pipeline'
                : 'Breadboard Computer Simulation'}
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Theme Switcher */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

          <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-bold opacity-80">
            <button
              onClick={() => onTabChange('diagram')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 cursor-pointer ${
                activeTab === 'diagram'
                  ? 'opacity-100 border-b-2 border-current'
                  : 'hover:opacity-100'
              }`}
            >
              {isBalatro ? 'Poker Table' : isPurble ? 'Machine Console' : 'Hardware Diagram'}
            </button>
            <button
              onClick={() => onTabChange('ram')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 cursor-pointer ${
                activeTab === 'ram'
                  ? 'opacity-100 border-b-2 border-current'
                  : 'hover:opacity-100'
              }`}
            >
              {isBalatro ? 'Card Deck (RAM)' : isPurble ? 'Recipe Storeroom' : '16×8 RAM Table'}
            </button>
            <button
              onClick={() => onTabChange('trace')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 cursor-pointer ${
                activeTab === 'trace'
                  ? 'opacity-100 border-b-2 border-current'
                  : 'hover:opacity-100'
              }`}
            >
              Trace Log
            </button>
            <button
              onClick={onOpenGuide}
              className="whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:opacity-100 transition-opacity py-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Theory Guide</span>
            </button>
          </nav>
        </div>

        {/* Zone 3: Primary Quick Actions */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <button
            onClick={onReset}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isBalatro
                ? 'bg-[#222834] text-white border-[#384252] hover:bg-[#2d3545]'
                : isPurble
                ? 'bg-[#58063f] text-[#f9d9ef] border-[#c56eab] hover:bg-[#912e73]'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Reset simulation to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onToggleRun}
            disabled={isHalted}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl border-2 transition-all active:scale-95 shadow-md cursor-pointer ${
              isRunning
                ? 'bg-[#58063f] text-white border-[#f9d9ef]'
                : isBalatro
                ? 'balatro-btn-gold'
                : 'bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] text-white border-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isBalatro ? 'Auto Deal' : isPurble ? 'Bake Cake!' : 'Run Clock'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
