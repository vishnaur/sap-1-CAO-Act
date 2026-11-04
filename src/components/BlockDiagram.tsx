import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Calculator,
  HardDrive,
  Tv,
  Cake,
  ChefHat,
  Sparkles,
  Gamepad2,
  Club,
  Heart,
  Spade,
  Diamond,
} from 'lucide-react';
import { CpuState, MemoryEntry } from '../types/sap1';
import { AppTheme } from '../types/theme';
import {
  toBin4,
  toBin8,
  toHex4,
  toHexByte,
  toSignedDec,
  computeAluResult,
  decodeByte,
} from '../utils/sap1Core';
import { LedDisplay } from './LedDisplay';

interface BlockDiagramProps {
  cpuState: CpuState;
  memoryEntries: MemoryEntry[];
  memory: number[];
  currentTheme?: AppTheme;
}

export const BlockDiagram: React.FC<BlockDiagramProps> = ({
  cpuState,
  memoryEntries,
  memory,
  currentTheme = 'balatro',
}) => {
  const {
    pc,
    mar,
    ir,
    a,
    b,
    out,
    wBus,
    busActive,
    busDriver,
    busReceiver,
    controlSignals,
    flags,
    tState,
  } = cpuState;

  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  // Active micro-control signals
  const { Cp, Ep, Lm, CE, Li, Ei, La, Ea, Su, Eu, Lb, Lo } = controlSignals;

  // Calculate live ALU result based on registers A and B and Su mode
  const alu = computeAluResult(a, b, Su);
  const aluVal = alu.result;

  // IR Opcode & Operand
  const irOpcode = (ir >> 4) & 0x0f;
  const irOperand = ir & 0x0f;
  const decodedIR = decodeByte(ir);

  // Current RAM byte pointed by MAR
  const currentRamByte = (memory[mar] ?? 0) & 0xff;
  const currentRamEntry = memoryEntries[mar];

  // Helper for card styling
  const getCardClasses = (isActive: boolean, isHighPriority = false) => {
    if (isBalatro) {
      if (isActive) {
        return isHighPriority
          ? 'bg-[#2a1719] border-2 border-[#e84118] ring-2 ring-[#e84118]/50 shadow-lg text-white'
          : 'bg-[#142334] border-2 border-[#00a8ff] ring-2 ring-[#00a8ff]/50 shadow-lg text-white';
      }
      return 'bg-[#1e2533] border-2 border-[#2f3847] text-[#f5f6fa] shadow-sm hover:border-[#384556]';
    }
    if (isPurble) {
      if (isActive) return 'comfy-button-active shadow-md';
      return 'comfy-button text-[#2c1b3d]';
    }
    // Classic
    if (isActive) return 'bg-cyan-950/60 border-2 border-cyan-400 text-white shadow-lg shadow-cyan-950';
    return 'bg-slate-900 border-2 border-slate-700 text-slate-100';
  };

  // Helper for control chip badge
  const getSignalBadge = (active: boolean) => {
    if (isBalatro) {
      return active
        ? 'bg-[#e84118] text-white border-[#fbc531] font-black shadow-sm'
        : 'bg-[#10131a] text-slate-400 border-[#2f3847]';
    }
    if (isPurble) {
      return active
        ? 'bg-[#58063f] text-white border-[#3b0229] font-black'
        : 'bg-white text-slate-700 border-[#e2be75]';
    }
    return active
      ? 'bg-cyan-600 text-white border-cyan-400 font-black'
      : 'bg-slate-950 text-slate-500 border-slate-700';
  };

  // Inner readout box styling
  const innerBoxClass = isBalatro
    ? 'bg-[#10131a] border border-[#2f3847] text-slate-200'
    : isPurble
    ? 'bg-white border border-[#e2be75] text-[#2c1b3d]'
    : 'bg-slate-950 border border-slate-800 text-slate-200';

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden p-4 sm:p-6 shadow-2xl transition-all ${
        isBalatro
          ? 'bg-[#181d26] border-4 border-[#2f3847] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#bde5f3] border-4 border-[#86c5dc] text-[#2c1b3d]'
          : 'bg-[#0f172a] border-4 border-slate-700 text-slate-100'
      }`}
    >
      {/* Console Header Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b-2 ${
          isBalatro
            ? 'border-[#2f3847]'
            : isPurble
            ? 'border-[#86c5dc]'
            : 'border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow ${
              isBalatro
                ? 'bg-[#e84118] text-white'
                : isPurble
                ? 'bg-[#58063f] text-[#f9d9ef]'
                : 'bg-cyan-900 text-cyan-300'
            }`}
          >
            {isBalatro ? (
              <Gamepad2 className="w-5 h-5" />
            ) : isPurble ? (
              <Cake className="w-5 h-5" />
            ) : (
              <Cpu className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2
              className={`text-sm sm:text-base font-extrabold tracking-wide uppercase ${
                isBalatro
                  ? 'text-[#f5f6fa]'
                  : isPurble
                  ? 'text-[#58063f]'
                  : 'text-slate-100'
              }`}
            >
              {isBalatro
                ? 'Balatro Casino Console · SAP-1 Hardware Registers'
                : isPurble
                ? 'Comfy Cakes Control Console · SAP-1 Registers'
                : 'Albert Malvino SAP-1 Hardware Register Console'}
            </h2>
            <p
              className={`text-xs ${
                isBalatro
                  ? 'text-slate-400'
                  : isPurble
                  ? 'text-[#58063f]/80'
                  : 'text-slate-400'
              }`}
            >
              {isBalatro
                ? 'Playing card hardware registers synced with the central W-Bus poker felt'
                : isPurble
                ? 'Machine button modules corresponding to the hardware registers and central W-Bus'
                : '8-bit computer architecture modules interfacing with the common W-Bus'}
            </p>
          </div>
        </div>

        {/* Central W-Bus Monitor Tag */}
        <div
          className={`px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-2.5 font-mono text-xs border-2 ${
            isBalatro
              ? 'bg-[#10131a] border-[#384556] text-white'
              : isPurble
              ? 'bg-white/90 border-[#58063f] text-[#58063f]'
              : 'bg-slate-900 border-slate-700 text-slate-100'
          }`}
        >
          <span className="font-bold">W-BUS DATA:</span>
          {busActive ? (
            <span
              className={`font-black flex items-center gap-1.5 ${
                isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#912e73]' : 'text-cyan-400'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  isBalatro ? 'bg-[#fbc531]' : isPurble ? 'bg-[#ff2a6d]' : 'bg-cyan-400'
                }`}
              />
              {toHexByte(wBus)}H ({wBus}
              {isBalatro ? ' Chips' : isPurble ? 'g' : ''}) [{toBin8(wBus)}]
            </span>
          ) : (
            <span className="opacity-50 italic">
              {isBalatro ? 'Felt Idle (High-Z)' : isPurble ? 'Conveyor Idle' : 'Floating (High-Z)'}
            </span>
          )}
          {busActive && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-sans font-bold ${
                isBalatro
                  ? 'bg-[#e84118] text-white'
                  : isPurble
                  ? 'bg-[#58063f] text-[#f9d9ef]'
                  : 'bg-cyan-600 text-white'
              }`}
            >
              {busDriver} → {busReceiver}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Register Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
        {/* ================= LEFT COLUMN: PC, MAR, RAM, IR ================= */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* 1. Program Counter (PC) */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(Ep || Cp, Ep)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? 'Program Counter (Card Pointer)' : 'Program Counter (PC)'}
                </span>
                <span className="text-[10px] opacity-60 font-mono">4-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Cp)}`} title="Cp: Increment PC">
                  [Cp]
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Ep)}`} title="Ep: Enable PC to Bus">
                  [Ep]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-lg border shadow-inner ${innerBoxClass}`}>
                  <span className="text-xs opacity-60 font-mono">HEX: </span>
                  <span className={`text-sm font-bold font-mono ${isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}`}>
                    {toHex4(pc)}H
                  </span>
                </div>
                <div className={`px-2.5 py-1 rounded-lg border shadow-inner ${innerBoxClass}`}>
                  <span className="text-xs opacity-60 font-mono">BIN: </span>
                  <span className="text-sm font-bold font-mono">
                    {toBin4(pc)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold">
                {Ep ? (
                  <span className={isBalatro ? 'text-[#fbc531] flex items-center' : 'text-[#912e73] flex items-center'}>
                    DRIVING BUS <ArrowRight className="w-3.5 h-3.5 inline ml-0.5" />
                  </span>
                ) : (
                  <span className="opacity-50 font-normal">
                    {isBalatro ? 'Next Card Hand' : isPurble ? 'Holding Ticket' : 'Standing By'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Memory Address Register (MAR) */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(Lm, Lm)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? 'Memory Address (Deck Selector)' : 'Memory Address (MAR)'}
                </span>
                <span className="text-[10px] opacity-60 font-mono">4-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Lm)}`} title="Lm: Load MAR from Bus">
                  [Lm]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-lg border shadow-inner ${innerBoxClass}`}>
                  <span className="text-xs opacity-60 font-mono">{isBalatro ? 'SLOT: ' : 'SHELF: '}</span>
                  <span className={`text-sm font-bold font-mono ${isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}`}>
                    {toHex4(mar)}H
                  </span>
                </div>
                <div className={`px-2.5 py-1 rounded-lg border shadow-inner ${innerBoxClass}`}>
                  <span className="text-xs opacity-60 font-mono">BIN: </span>
                  <span className="text-sm font-bold font-mono">
                    {toBin4(mar)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold">
                {Lm ? (
                  <span className={isBalatro ? 'text-[#00a8ff] flex items-center' : 'text-[#912e73] flex items-center'}>
                    <ArrowLeft className="w-3.5 h-3.5 inline mr-0.5" /> LATCHING
                  </span>
                ) : (
                  <span className="opacity-50 font-normal">
                    {isBalatro ? 'Holding Card Slot' : isPurble ? 'Holding Shelf' : 'Address Latched'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. 16×8 RAM Matrix */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(CE, CE)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <HardDrive className={`w-3.5 h-3.5 ${isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}`} />
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? '16-Card Deck (16 × 8 RAM)' : isPurble ? 'Pantry Storeroom (16 × 8 RAM)' : '16 × 8 RAM Matrix'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(CE)}`} title="CE: Output RAM[MAR] to Bus">
                  [CE]
                </span>
              </div>
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between ${innerBoxClass}`}>
              <div>
                <div className="text-[10px] opacity-70 font-mono">
                  {isBalatro ? 'TARGET CARD:' : isPurble ? 'POINTED JAR:' : 'ADDRESSED CELL:'}{' '}
                  <strong className={isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}>
                    RAM[{toHex4(mar)}H]
                  </strong>
                </div>
                <div className={`text-xs font-mono font-bold ${isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#912e73]' : 'text-emerald-400'}`}>
                  {toHexByte(currentRamByte)}H ({toBin8(currentRamByte)})
                </div>
                <div className="text-[10px] opacity-80 font-mono mt-0.5 truncate max-w-[200px]">
                  {currentRamEntry?.mnemonic || 'Data'}
                </div>
              </div>

              <div className="text-right">
                {CE ? (
                  <span className={`text-xs font-mono font-bold flex items-center justify-end ${isBalatro ? 'text-[#fbc531]' : 'text-[#912e73]'}`}>
                    DISPENSING <ArrowRight className="w-3.5 h-3.5 inline ml-0.5" />
                  </span>
                ) : (
                  <span className="opacity-50 text-xs font-mono">
                    {isBalatro ? 'Deck Latched' : isPurble ? 'Pantry Latched' : 'Chip Enabled'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4. Instruction Register (IR) */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(Li || Ei, Ei)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Database className={`w-3.5 h-3.5 ${isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#58063f]' : 'text-amber-400'}`} />
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? 'Instruction Register (Joker / Rule)' : 'Instruction Register (IR)'}
                </span>
                <span className="text-[10px] opacity-60 font-mono">8-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Li)}`} title="Li: Load IR from Bus">
                  [Li]
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Ei)}`} title="Ei: Enable IR operand to Bus">
                  [Ei]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2 rounded-lg border ${innerBoxClass}`}>
                <div className="text-[9px] opacity-60 font-mono uppercase">Opcode (7-4)</div>
                <div className={`text-xs font-bold font-mono ${isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}`}>
                  {toBin4(irOpcode)} ({toHex4(irOpcode)}H)
                </div>
                <div className="text-[10px] font-mono font-bold mt-0.5">
                  {decodedIR.mnemonic.split(' ')[0]}
                </div>
              </div>

              <div className={`p-2 rounded-lg border ${innerBoxClass}`}>
                <div className="text-[9px] opacity-60 font-mono uppercase">Operand (3-0)</div>
                <div className={`text-xs font-bold font-mono ${isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#912e73]' : 'text-amber-400'}`}>
                  {toBin4(irOperand)} ({toHex4(irOperand)}H)
                </div>
                <div className="text-[10px] font-mono opacity-70 mt-0.5">
                  {isBalatro ? `Card #${toHex4(irOperand)}H` : isPurble ? `Shelf ${toHex4(irOperand)}H` : `Addr ${toHex4(irOperand)}H`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: W-BUS TRUNK ================= */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center relative py-2 lg:py-0">
          <div
            className={`w-14 sm:w-16 h-full min-h-[460px] rounded-2xl flex flex-col items-center justify-between py-6 shadow-inner relative overflow-hidden border-4 ${
              isBalatro
                ? 'bg-[#0c3b1e] border-[#1e5c33]'
                : isPurble
                ? 'bg-[#4a4e56] border-[#2b2d32]'
                : 'bg-slate-950 border-cyan-900/60'
            }`}
          >
            {/* Bus tracks */}
            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[1px] h-full ${isBalatro ? 'bg-[#55efc4]' : 'bg-slate-300'}`}
                />
              ))}
            </div>

            <div
              className={`z-10 px-2 py-0.5 rounded text-center shadow border-2 ${
                isBalatro
                  ? 'bg-[#1b222c] border-[#fbc531] text-[#fbc531]'
                  : isPurble
                  ? 'bg-[#fff4d4] border-[#e2be75] text-[#58063f]'
                  : 'bg-slate-900 border-cyan-700 text-cyan-300'
              }`}
            >
              <span className="text-[9px] font-mono font-black">W-BUS</span>
            </div>

            <div
              className={`z-10 flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
                busActive
                  ? isBalatro
                    ? 'bg-[#e84118] border-[#fbc531] text-white shadow-xl scale-105'
                    : isPurble
                    ? 'bg-[#c56eab] border-white text-white shadow-md scale-105'
                    : 'bg-cyan-500 border-white text-slate-950 font-black shadow-md scale-105'
                  : isBalatro
                  ? 'bg-[#141822] border-[#2f3847] text-slate-500'
                  : isPurble
                  ? 'bg-white/80 border-slate-400 text-slate-600'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}
            >
              <span className="text-[8px] font-mono uppercase">BYTE</span>
              <span className="text-xs font-mono font-black">
                {busActive ? `${toHexByte(wBus)}H` : '---'}
              </span>
              <span className="text-[8px] font-mono mt-0.5">
                {busActive ? `${wBus}${isBalatro ? 'c' : isPurble ? 'g' : ''}` : 'Z'}
              </span>
            </div>

            <div
              className={`z-10 px-2 py-0.5 rounded text-center shadow border-2 ${
                isBalatro
                  ? 'bg-[#1b222c] border-[#fbc531] text-[#fbc531]'
                  : isPurble
                  ? 'bg-[#fff4d4] border-[#e2be75] text-[#58063f]'
                  : 'bg-slate-900 border-cyan-700 text-cyan-300'
              }`}
            >
              <span className="text-[8px] font-mono font-bold">
                {isBalatro ? 'FELT' : isPurble ? 'BELT' : '8-BIT'}
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Accumulator, ALU, B-Register, Output ================= */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* 1. Accumulator (A Register) */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(La || Ea, Ea)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? 'Accumulator (Chips A Tally)' : isPurble ? 'Accumulator (Mixing Bowl)' : 'Accumulator (A Register)'}
                </span>
                <span className="text-[10px] opacity-60 font-mono">8-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(La)}`} title="La: Load Accumulator from Bus">
                  [La]
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Ea)}`} title="Ea: Enable Accumulator to Bus">
                  [Ea]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className={`px-2.5 py-1.5 rounded-lg border ${innerBoxClass}`}>
                <span className="text-[9px] opacity-60 font-mono">HEX: </span>
                <span className={`text-sm font-bold font-mono ${isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}`}>
                  {toHexByte(a)}H
                </span>
              </div>
              <div className={`px-2.5 py-1.5 rounded-lg border ${innerBoxClass}`}>
                <span className="text-[9px] opacity-60 font-mono">{isBalatro ? 'CHIPS: ' : isPurble ? 'GRAMS: ' : 'DEC: '}</span>
                <span className="text-sm font-bold font-mono tabular-nums">
                  {a}
                  {isBalatro ? ' 🪙' : isPurble ? 'g' : ''}
                </span>
              </div>
              <div className={`px-2.5 py-1.5 rounded-lg border ${innerBoxClass}`}>
                <span className="text-[9px] opacity-60 font-mono">SIGNED: </span>
                <span className="text-sm font-bold font-mono opacity-80 tabular-nums">
                  {toSignedDec(a)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Adder / Subtractor (ALU) */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(Eu, Eu)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calculator className={`w-3.5 h-3.5 ${isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'}`} />
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? 'ALU (Mult Adder & Subtractor)' : isPurble ? 'Frosting Mixer & Trimmer (ALU)' : 'Adder / Subtractor (ALU)'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Su)}`} title="Su: Subtract Mode (0=ADD, 1=SUB)">
                  [{Su ? 'Su: SUB' : 'Su: ADD'}]
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Eu)}`} title="Eu: Enable ALU result to Bus">
                  [Eu]
                </span>
              </div>
            </div>

            <div className={`p-2 rounded-lg border flex items-center justify-between font-mono text-xs ${innerBoxClass}`}>
              <div>
                <span className="opacity-70 text-[10px]">
                  {a} {Su ? '-' : '+'} {b} {isBalatro ? 'Chips' : isPurble ? 'g' : ''}:
                </span>
                <div className={`text-sm font-bold ${isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#912e73]' : 'text-emerald-400'}`}>
                  = {toHexByte(aluVal)}H ({aluVal}
                  {isBalatro ? ' 🪙' : isPurble ? 'g' : ''})
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold opacity-80 block">
                  CY: {flags.carry ? '1' : '0'} · Z: {flags.zero ? '1' : '0'}
                </span>
                {Eu && (
                  <span className={`text-[10px] font-bold ${isBalatro ? 'text-[#fbc531]' : 'text-[#912e73]'}`}>
                    DISPENSING TO BUS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. B Register */}
          <div className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${getCardClasses(Lb, Lb)}`}>
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-black uppercase ${
                    isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                  }`}
                >
                  {isBalatro ? 'B Register (Score Mult Operand)' : isPurble ? 'B Register (Measuring Cup)' : 'B Register (Operand)'}
                </span>
                <span className="text-[10px] opacity-60 font-mono">8-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${getSignalBadge(Lb)}`} title="Lb: Load B Register from Bus">
                  [Lb]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-lg border ${innerBoxClass}`}>
                  <span className="text-xs opacity-60 font-mono">HEX: </span>
                  <span className={`text-sm font-bold font-mono ${isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#58063f]' : 'text-amber-400'}`}>
                    {toHexByte(b)}H
                  </span>
                </div>
                <div className={`px-2.5 py-1 rounded-lg border ${innerBoxClass}`}>
                  <span className="text-xs opacity-60 font-mono">{isBalatro ? 'MULT: ' : isPurble ? 'GRAMS: ' : 'DEC: '}</span>
                  <span className="text-sm font-bold font-mono">
                    {b}
                    {isBalatro ? 'x' : isPurble ? 'g' : ''}
                  </span>
                </div>
              </div>
              {Lb ? (
                <span className={`text-[11px] font-mono font-bold ${isBalatro ? 'text-[#00a8ff]' : 'text-[#912e73]'}`}>
                  LATCHING
                </span>
              ) : (
                <span className="opacity-50 text-[11px]">
                  {isBalatro ? 'Feeds ALU Mult' : isPurble ? 'Feeds Mixer B' : 'Feeds ALU B'}
                </span>
              )}
            </div>
          </div>

          {/* 4. Output Register & LED Display */}
          <div
            className={`rounded-xl border-2 p-2 shadow-sm ${
              isBalatro
                ? 'bg-[#10131a] border-[#2f3847]'
                : isPurble
                ? 'bg-[#fffcf2] border-[#e2be75]'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-1 px-1 mb-1 border-b ${
                isBalatro ? 'border-[#2f3847]' : isPurble ? 'border-[#e2be75]' : 'border-slate-800'
              }`}
            >
              <span
                className={`text-xs font-black uppercase ${
                  isBalatro ? 'text-white' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
                }`}
              >
                {isBalatro ? 'Output Register & Poker Chips' : isPurble ? 'Output Register & Diodes' : 'Output Register (OUT)'}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${
                  Lo
                    ? isBalatro
                      ? 'bg-[#e84118] text-white'
                      : 'bg-[#ff2a6d] text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                [Lo]
              </span>
            </div>
            <LedDisplay
              value={out}
              label={isBalatro ? 'Casino Output Chips' : isPurble ? 'Cake Inspection Diodes' : 'Binary Output Diodes'}
              isLatched={Lo}
              currentTheme={currentTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
