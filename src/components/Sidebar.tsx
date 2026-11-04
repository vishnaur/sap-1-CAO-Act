import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Cake,
  Cpu,
  HardDrive,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppTheme, THEME_CONFIGS } from '../types/theme';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeTab: 'diagram' | 'ram' | 'trace';
  onTabChange: (tab: 'diagram' | 'ram' | 'trace') => void;
  onOpenGuide: () => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  isHalted: boolean;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  cycleCount?: number;
  instructionCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenGuide,
  isRunning,
  onToggleRun,
  onReset,
  isHalted,
  currentTheme,
  onThemeChange,
  cycleCount = 0,
  instructionCount = 0,
}) => {
  // Hover state: expands automatically when mouse enters, collapses when mouse leaves
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  const isExpanded = isHovered;

  // Navigation Items
  const navTabs = [
    {
      id: 'diagram' as const,
      label: isBalatro ? 'Poker Table' : isPurble ? 'Comfy Machine' : 'Hardware Diagram',
      icon: isBalatro ? Gamepad2 : isPurble ? Cake : Cpu,
      badge: 'Main',
    },
    {
      id: 'ram' as const,
      label: isBalatro ? 'Card Deck (RAM)' : isPurble ? 'Recipe Storeroom' : '16×8 RAM Table',
      icon: HardDrive,
      badge: '16×8',
    },
    {
      id: 'trace' as const,
      label: isBalatro ? 'Hand Trace Log' : isPurble ? 'Baking Trace Log' : 'Execution Trace',
      icon: Clock,
      badge: 'Trace',
    },
  ];

  const themes: AppTheme[] = ['balatro', 'purble', 'classic'];

  return (
    <div
      className="relative z-50 shrink-0 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible anchor spacer so the main page layout never shifts when sidebar expands on hover */}
      <div className="w-18 h-screen" />

      {/* Floating Sidebar Drawer that expands on hover */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-out border-r-2 shadow-2xl backdrop-blur-md overflow-hidden ${
          isExpanded ? 'w-72 shadow-black/80' : 'w-18 shadow-black/40'
        } ${
          isBalatro
            ? 'bg-[#12161f] border-[#2b3543] text-[#f5f6fa]'
            : isPurble
            ? 'bg-[#1a0820] border-[#58063f] text-[#f9d9ef]'
            : 'bg-[#0b0f19] border-slate-800 text-slate-100'
        }`}
      >
        {/* 1. Header (No awkward toggle button - clean logo & title) */}
        <div
          className={`flex items-center p-3.5 border-b-2 transition-all ${
            isExpanded ? 'justify-start gap-3' : 'justify-center'
          } ${
            isBalatro
              ? 'border-[#2b3543]'
              : isPurble
              ? 'border-[#58063f]'
              : 'border-slate-800'
          }`}
        >
          <div className="relative shrink-0">
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

          {isExpanded && (
            <div className="overflow-hidden whitespace-nowrap animate-fadeIn">
              <h2 className="text-sm font-black tracking-wide uppercase truncate">
                {isBalatro
                  ? 'BALATRO CASINO'
                  : isPurble
                  ? 'PURBLE PALACE'
                  : 'MALVINO LAB'}
              </h2>
              <p className="text-[10px] font-mono opacity-70 truncate">
                {isBalatro
                  ? 'Roguelike SAP-1'
                  : isPurble
                  ? 'Comfy Cakes Factory'
                  : '8-Bit TTL Computer'}
              </p>
            </div>
          )}
        </div>

        {/* 2. Scrollable Menu Body */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-5 scrollbar-thin">
          {/* THEMES */}
          <div>
            {isExpanded ? (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                  Changeable Theme
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isBalatro
                      ? 'bg-[#e84118]/20 text-[#e84118]'
                      : isPurble
                      ? 'bg-[#c56eab]/20 text-[#f9d9ef]'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {THEME_CONFIGS[currentTheme].icon} Active
                </span>
              </div>
            ) : (
              <div className="text-center text-[8px] font-mono font-bold opacity-50 mb-1">
                THEME
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              {themes.map((themeId) => {
                const cfg = THEME_CONFIGS[themeId];
                const isSelected = currentTheme === themeId;

                let activeClass = '';
                if (isSelected) {
                  if (themeId === 'balatro') activeClass = 'bg-[#e84118] text-white border-[#fbc531] shadow-md';
                  else if (themeId === 'purble') activeClass = 'bg-[#58063f] text-[#f9d9ef] border-[#c56eab] shadow-md';
                  else activeClass = 'bg-cyan-600 text-white border-cyan-400 shadow-md';
                } else {
                  if (isBalatro) activeClass = 'bg-[#181d26] text-slate-300 border-[#2f3847] hover:border-slate-500';
                  else if (isPurble) activeClass = 'bg-[#2e1d40] text-[#c56eab] border-[#58063f] hover:border-[#912e73]';
                  else activeClass = 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700';
                }

                return (
                  <button
                    key={themeId}
                    onClick={() => onThemeChange(themeId)}
                    className={`w-full flex items-center rounded-xl p-2 border-2 transition-all cursor-pointer ${activeClass} ${
                      isExpanded ? 'justify-between text-left px-3' : 'justify-center'
                    }`}
                    title={cfg.name}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{cfg.icon}</span>
                      {isExpanded && (
                        <div className="truncate">
                          <div className="text-xs font-black truncate">{cfg.name}</div>
                          <div className="text-[9px] opacity-70 truncate font-mono">
                            {cfg.tagline}
                          </div>
                        </div>
                      )}
                    </div>
                    {isExpanded && isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white shrink-0 ml-1 shadow" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ARCHITECTURE VIEWS */}
          <div>
            {isExpanded ? (
              <div className="mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                  Architecture Views
                </span>
              </div>
            ) : (
              <div className="text-center text-[8px] font-mono font-bold opacity-50 mb-1">
                VIEWS
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;

                let tabClass = '';
                if (isSelected) {
                  if (isBalatro) tabClass = 'bg-[#00a8ff]/20 text-white border-2 border-[#00a8ff] shadow-md';
                  else if (isPurble) tabClass = 'bg-[#c56eab]/30 text-[#f9d9ef] border-2 border-[#c56eab] shadow-md';
                  else tabClass = 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 shadow-md';
                } else {
                  tabClass = 'border-2 border-transparent opacity-70 hover:opacity-100 hover:bg-white/5';
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full flex items-center rounded-xl p-2.5 transition-all cursor-pointer ${tabClass} ${
                      isExpanded ? 'justify-between px-3' : 'justify-center'
                    }`}
                    title={tab.label}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      {isExpanded && (
                        <span className="text-xs font-bold truncate">{tab.label}</span>
                      )}
                    </div>
                    {isExpanded && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/30 opacity-75">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* THEORY GUIDE */}
          <div>
            {isExpanded && (
              <div className="mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                  Documentation
                </span>
              </div>
            )}
            <button
              onClick={onOpenGuide}
              className={`w-full flex items-center rounded-xl p-2.5 border-2 transition-all cursor-pointer ${
                isExpanded ? 'justify-start gap-2.5 px-3' : 'justify-center'
              } ${
                isBalatro
                  ? 'bg-[#1b222c] border-[#384556] text-[#fbc531] hover:bg-[#252f40]'
                  : isPurble
                  ? 'bg-[#58063f] border-[#912e73] text-[#f9d9ef] hover:bg-[#912e73]'
                  : 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
              }`}
              title="Open Theory Guide (Albert Malvino SAP-1 Architecture)"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              {isExpanded && (
                <span className="text-xs font-bold truncate">Theory Guide (SAP-1)</span>
              )}
            </button>
          </div>

          {/* QUICK EXECUTION CONTROLS */}
          <div className="space-y-2">
            {isExpanded && (
              <div className="mb-1 text-[10px] font-black uppercase tracking-wider opacity-60">
                Quick Actions
              </div>
            )}

            {/* Run / Auto Deal Button */}
            <button
              onClick={onToggleRun}
              disabled={isHalted}
              className={`w-full flex items-center justify-center p-2.5 rounded-xl border-2 font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isRunning
                  ? isBalatro
                    ? 'bg-[#e84118] text-white border-[#fbc531]'
                    : isPurble
                    ? 'bg-[#58063f] text-white border-[#3b0229]'
                    : 'bg-red-600 text-white border-red-400'
                  : isBalatro
                  ? 'bg-gradient-to-b from-[#e84118] to-[#c0392b] text-white border-[#fbc531]'
                  : isPurble
                  ? 'bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] text-white border-[#ffc2d1]'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
              } ${isExpanded ? 'gap-2 px-3' : ''}`}
              title={isRunning ? 'Pause execution' : 'Run / Auto Deal'}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current shrink-0" />
                  {isExpanded && <span>{isBalatro ? 'Pause Deal' : isPurble ? 'Pause Conveyor' : 'Pause Clock'}</span>}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  {isExpanded && <span>{isBalatro ? 'Auto Deal (Run)' : isPurble ? 'Start Baking' : 'Run Clock'}</span>}
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className={`w-full flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                isExpanded ? 'gap-2 px-3' : ''
              } ${
                isBalatro
                  ? 'bg-[#181d26] hover:bg-[#202735] text-slate-200 border-[#2f3847]'
                  : isPurble
                  ? 'bg-white hover:bg-slate-100 text-[#58063f] border-[#caa052]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Reset CPU and registers"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              {isExpanded && <span>{isBalatro ? 'Fold / Reset' : 'Reset CPU'}</span>}
            </button>
          </div>
        </div>

        {/* 3. Footer / Status Badge */}
        <div
          className={`p-3 border-t-2 text-[10px] font-mono transition-all ${
            isBalatro
              ? 'border-[#2f3847] bg-[#0c0e14]/50'
              : isPurble
              ? 'border-[#58063f] bg-[#0d0009]/50'
              : 'border-slate-800 bg-slate-950/50'
          }`}
        >
          {isExpanded ? (
            <div className="flex items-center justify-between">
              <span className="opacity-60">Status:</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  isHalted
                    ? 'text-amber-400'
                    : isRunning
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isHalted
                      ? 'bg-amber-400'
                      : isRunning
                      ? 'bg-emerald-400 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                {isHalted ? 'HALTED' : isRunning ? 'RUNNING' : 'IDLE'}
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isHalted
                    ? 'bg-amber-400'
                    : isRunning
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-slate-500'
                }`}
                title={isHalted ? 'HALTED' : isRunning ? 'RUNNING' : 'IDLE'}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
