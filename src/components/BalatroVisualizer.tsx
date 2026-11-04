import React, { useState } from 'react';
import {
  Sparkles,
  Coins,
  Flame,
  Tv,
  RotateCcw,
  SkipForward,
  FastForward,
  Play,
  Pause,
  Award,
  CircleDot,
  Dices,
} from 'lucide-react';
import { CpuState } from '../types/sap1';
import { toBin8Compact, toHex4, toHexByte } from '../utils/sap1Core';

interface BalatroVisualizerProps {
  cpuState: CpuState;
  onStepTState?: () => void;
  onStepInstruction?: () => void;
  onToggleRun?: () => void;
  onReset?: () => void;
  isRunning?: boolean;
}

export const BalatroVisualizer: React.FC<BalatroVisualizerProps> = ({
  cpuState,
  onStepTState,
  onStepInstruction,
  onToggleRun,
  onReset,
  isRunning = false,
}) => {
  const [enableCrt, setEnableCrt] = useState<boolean>(true);
  const { a, b, out, tState, ir, isHalted, busActive, busDriver, busReceiver, wBus, cycleCount, instructionCount } = cpuState;
  const opcode = (ir >> 4) & 0x0f;
  const operand = ir & 0x0f;
  const binOut = toBin8Compact(out);

  // Target score to beat for the blind
  const targetScore = 7;
  const currentHandScore = out;
  const beatBlind = isHalted && out === targetScore;

  // Active Joker based on T-State
  const activeJokerIndex =
    tState === 'T1' ? 0 : tState === 'T2' ? 1 : tState === 'T3' ? 2 : tState === 'T4' ? 3 : tState === 'T5' ? 4 : 4;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-4 border-[#2b3543] shadow-2xl select-none balatro-swirl-bg">
      {/* Optional CRT Scanlines Layer */}
      {enableCrt && <div className="absolute inset-0 balatro-crt-overlay z-30 pointer-events-none" />}

      {/* Top Bar: Balatro Branding, Ante & CRT Toggle */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#181d26]/90 border-b-2 border-[#2f3847] text-[#f5f6fa]">
        <div className="flex items-center gap-2.5">
          <div className="px-2 py-0.5 rounded bg-[#e84118] text-white font-black text-xs uppercase tracking-wider font-mono">
            BALATRO CASINO
          </div>
          <span className="text-xs text-slate-300 font-bold hidden sm:inline">
            SAP-1 Roguelike Poker Edition
          </span>
          <span className="text-[11px] text-amber-400 font-mono font-bold">
            ANTE 1/8 · ROUND 1
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#0e1117] px-2.5 py-1 rounded border border-[#2f3847]">
            <span className="text-amber-400 font-bold">$</span>
            <span className="text-white font-bold">{25 + instructionCount * 4}</span>
          </div>
          <button
            onClick={() => setEnableCrt((prev) => !prev)}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
              enableCrt
                ? 'bg-[#00a8ff]/20 border-[#00a8ff] text-[#00a8ff]'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Tv className="w-3 h-3" />
            <span>CRT {enableCrt ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* ================= THE JOKER TRAY (5 JOKER CARDS ROW) ================= */}
      <div className="relative z-10 px-4 pt-3 pb-2 bg-[#12161f]/85 border-b-2 border-[#2b3543]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wide">
            <span>Jokers (Active Micro-Modifiers):</span>
            <span className="text-amber-400 font-mono">5/5</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            T-State: <strong className="text-amber-300">{tState}</strong>
          </span>
        </div>

        {/* 5 Pixel Joker Cards matching screenshot image_ae51533e.png */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto">
          {/* Joker 1: The Malvino Jester */}
          <div
            className={`balatro-card rounded-xl p-1.5 flex flex-col justify-between items-center text-center h-28 sm:h-32 transition-all ${
              activeJokerIndex === 0 ? 'balatro-card-active' : 'opacity-90'
            }`}
          >
            <div className="w-full flex justify-between text-[9px] font-bold font-mono text-[#c0392b] leading-none">
              <span>J</span>
              <span>1</span>
            </div>
            {/* Pixel Art Artwork */}
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl">🃏</span>
              <span className="text-[9px] font-black text-slate-800 font-sans uppercase mt-0.5">
                Malvino
              </span>
            </div>
            <div className="bg-[#e84118] text-white text-[8px] font-bold px-1 rounded w-full truncate">
              [Ep, Lm] Fetch
            </div>
          </div>

          {/* Joker 2: Fibonacci Joker (From screenshot) */}
          <div
            className={`balatro-card rounded-xl p-1.5 flex flex-col justify-between items-center text-center h-28 sm:h-32 transition-all ${
              activeJokerIndex === 1 ? 'balatro-card-active' : 'opacity-90'
            }`}
          >
            <div className="w-full flex justify-between text-[9px] font-bold font-mono text-[#00a8ff] leading-none">
              <span>J</span>
              <span>2</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-[10px] font-bold text-red-600 bg-blue-100">
                🌀
              </div>
              <span className="text-[9px] font-black text-slate-800 font-sans uppercase mt-0.5">
                Fibonacci
              </span>
            </div>
            <div className="bg-[#00a8ff] text-white text-[8px] font-bold px-1 rounded w-full truncate">
              [Cp] +1 Count
            </div>
          </div>

          {/* Joker 3: Gros Michel Banana (From screenshot) */}
          <div
            className={`balatro-card rounded-xl p-1.5 flex flex-col justify-between items-center text-center h-28 sm:h-32 transition-all ${
              activeJokerIndex === 2 ? 'balatro-card-active' : 'opacity-90'
            }`}
          >
            <div className="w-full flex justify-between text-[9px] font-bold font-mono text-[#fbc531] leading-none">
              <span>J</span>
              <span>3</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl">🍌</span>
              <span className="text-[9px] font-black text-slate-800 font-sans uppercase mt-0.5">
                Banana
              </span>
            </div>
            <div className="bg-[#fbc531] text-slate-900 text-[8px] font-black px-1 rounded w-full truncate">
              [CE] RAM Read
            </div>
          </div>

          {/* Joker 4: Blueprint Joker (From screenshot) */}
          <div
            className={`balatro-card rounded-xl p-1.5 flex flex-col justify-between items-center text-center h-28 sm:h-32 transition-all ${
              activeJokerIndex === 3 ? 'balatro-card-active' : 'opacity-90'
            }`}
          >
            <div className="w-full flex justify-between text-[9px] font-bold font-mono text-[#00a8ff] leading-none">
              <span>J</span>
              <span>4</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl">🎭</span>
              <span className="text-[9px] font-black text-slate-800 font-sans uppercase mt-0.5">
                Blueprint
              </span>
            </div>
            <div className="bg-[#8e44ad] text-white text-[8px] font-bold px-1 rounded w-full truncate">
              [Ei] Target
            </div>
          </div>

          {/* Joker 5: Red Baron Multiplier */}
          <div
            className={`balatro-card rounded-xl p-1.5 flex flex-col justify-between items-center text-center h-28 sm:h-32 transition-all ${
              activeJokerIndex === 4 ? 'balatro-card-active' : 'opacity-90'
            }`}
          >
            <div className="w-full flex justify-between text-[9px] font-bold font-mono text-[#e84118] leading-none">
              <span>J</span>
              <span>5</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl">👑</span>
              <span className="text-[9px] font-black text-slate-800 font-sans uppercase mt-0.5">
                ALU Baron
              </span>
            </div>
            <div className="bg-[#e84118] text-white text-[8px] font-bold px-1 rounded w-full truncate">
              [Eu, Su] Mult
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CASINO POKER TABLE STAGE ================= */}
      <div className="relative z-10 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left HUD: The Blind Target & Score Calculator */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Blind Card */}
          <div className="bg-[#1b222c] border-2 border-[#384556] rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#2f3b4c]">
              <span className="text-[10px] font-black text-[#e84118] uppercase tracking-wider">
                Current Blind: BIG BLIND
              </span>
              <span className="text-[10px] font-mono text-slate-400">Score to Beat</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#e84118] animate-pulse" />
                <div>
                  <div className="text-2xl font-black text-white font-mono leading-none">
                    {targetScore} Chips
                  </div>
                  <div className="text-[10px] text-amber-300 font-mono">Hex: 07H</div>
                </div>
              </div>

              {beatBlind && (
                <div className="bg-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 animate-bounce">
                  <Award className="w-3.5 h-3.5" /> BEATEN!
                </div>
              )}
            </div>
          </div>

          {/* Balatro CHIPS × MULT Score Display */}
          <div className="bg-[#12161f] border-2 border-[#2b3543] rounded-xl p-3 shadow-inner">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Active Hand Score:</span>
              <span className="text-amber-400 font-mono">Malvino 3-Tier</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              {/* Blue Chips Pill */}
              <div className="bg-[#00a8ff] border-2 border-[#90e0ef] rounded-xl p-2 text-white shadow-md">
                <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">
                  Chips (Accumulator A)
                </span>
                <span className="text-xl font-black font-mono leading-tight">
                  {a}
                </span>
                <span className="text-[9px] font-mono block opacity-80">
                  {toHexByte(a)}H
                </span>
              </div>

              {/* Red Mult Pill */}
              <div className="bg-[#e84118] border-2 border-[#ff794d] rounded-xl p-2 text-white shadow-md">
                <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">
                  Mult (B Register)
                </span>
                <span className="text-xl font-black font-mono leading-tight">
                  {b}
                </span>
                <span className="text-[9px] font-mono block opacity-80">
                  {toHexByte(b)}H
                </span>
              </div>
            </div>

            {/* Total Hand Score Bar */}
            <div className="mt-2.5 bg-[#1b222c] border border-[#2f3b4c] rounded-lg p-2 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total Output (OUT):</span>
              <span className="text-lg font-black text-amber-300">
                {out} Chips ({toHexByte(out)}H)
              </span>
            </div>
          </div>

          {/* Hands & Discards Count */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="bg-[#1b222c] border border-[#2f3b4c] rounded-lg p-1.5">
              <span className="text-[10px] text-slate-400 block">Cycles Run</span>
              <strong className="text-cyan-400 text-sm">{cycleCount}</strong>
            </div>
            <div className="bg-[#1b222c] border border-[#2f3b4c] rounded-lg p-1.5">
              <span className="text-[10px] text-slate-400 block">Hands Played</span>
              <strong className="text-emerald-400 text-sm">{instructionCount}</strong>
            </div>
          </div>
        </div>

        {/* Center / Right: The Poker Felt Table (Central W-Bus) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Poker Felt Oval Table */}
          <div className="w-full casino-felt border-8 border-[#3c2a1a] rounded-3xl p-5 shadow-2xl flex flex-col items-center justify-between min-h-[260px] relative">
            {/* Table Header */}
            <div className="flex items-center justify-between w-full pb-2 border-b border-white/20 text-xs font-bold text-white/90">
              <div className="flex items-center gap-1.5">
                <span>♠ ♥ THE W-BUS POKER FELT ♦ ♣</span>
              </div>
              <span className="text-amber-300 font-mono">
                {busActive ? `TRANSMITTING: ${toHexByte(wBus)}H` : 'WAITING FOR DEAL'}
              </span>
            </div>

            {/* Active Played Card on the Felt */}
            <div className="my-auto flex flex-col items-center">
              <div
                className={`balatro-card rounded-2xl p-3 w-36 sm:w-44 h-48 sm:h-56 flex flex-col justify-between transition-all duration-200 ${
                  busActive ? 'balatro-card-active scale-110 shadow-2xl' : 'scale-100'
                }`}
              >
                {/* Card Top Left */}
                <div className="flex items-center justify-between text-xs font-black font-mono">
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[#e84118] text-base">A</span>
                    <span className="text-[#e84118]">♥</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {busActive ? busDriver : 'IDLE'}
                  </span>
                </div>

                {/* Card Center Illustration */}
                <div className="flex flex-col items-center my-auto">
                  <span className="text-3xl sm:text-4xl mb-1">
                    {busActive ? '🎴' : '🃏'}
                  </span>
                  <div className="text-xs font-black text-slate-900 font-mono text-center">
                    {busActive ? `${toHexByte(wBus)}H` : '---'}
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono mt-0.5 font-bold">
                    {busActive ? `${wBus} Chips` : 'Common Bus'}
                  </div>
                  {busActive && (
                    <div className="text-[9px] text-[#00a8ff] font-mono font-bold mt-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {busDriver} → {busReceiver}
                    </div>
                  )}
                </div>

                {/* Card Bottom Right */}
                <div className="flex items-center justify-between text-xs font-black font-mono">
                  <span className="text-[9px] text-slate-400 font-sans">SAP-1</span>
                  <div className="flex flex-col items-center leading-tight rotate-180">
                    <span className="text-[#e84118] text-base">A</span>
                    <span className="text-[#e84118]">♥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Footer with 8 Poker Chip Bulbs */}
            <div className="flex items-center justify-between w-full pt-2 border-t border-white/20">
              <span className="text-[10px] text-white/80 font-mono">Output Chips (Lo):</span>
              <div className="flex items-center gap-1.5">
                {binOut.split('').map((bit, idx) => (
                  <div
                    key={idx}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono font-black text-[9px] shadow transition-all ${
                      bit === '1'
                        ? 'bg-[#fbc531] border-yellow-200 text-slate-900 scale-110 shadow-[0_0_8px_#fbc531]'
                        : 'bg-[#0f2416] border-[#1d4c2d] text-slate-600'
                    }`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Balatro Big Buttons (Play Hand, Draw Card, Cash Out, Fold) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
            {/* Draw Card (Step T-State) */}
            <button
              onClick={onStepTState}
              disabled={isRunning || isHalted}
              className="balatro-btn-chips px-4 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Advance single clock pulse (T1 -> T2 -> ...)"
            >
              <SkipForward className="w-4 h-4" />
              <span>Draw Card (Step Cycle)</span>
            </button>

            {/* Play Hand (Step Instruction) */}
            <button
              onClick={onStepInstruction}
              disabled={isRunning || isHalted}
              className="balatro-btn-mult px-5 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Play entire instruction hand (T1-T6)"
            >
              <FastForward className="w-4 h-4" />
              <span>Play Hand (Step Layer)</span>
            </button>

            {/* Auto Play / Cash Out (Run / Pause) */}
            <button
              onClick={onToggleRun}
              disabled={isHalted}
              className={`balatro-btn-gold px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Hand</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Auto Deal (Run)</span>
                </>
              )}
            </button>

            {/* Fold Hand (Reset) */}
            <button
              onClick={onReset}
              className="bg-[#2f3542] hover:bg-[#404857] text-[#f5f6fa] border-2 border-[#57606f] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              title="Reset table and registers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fold / Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
