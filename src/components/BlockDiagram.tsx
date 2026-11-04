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
} from 'lucide-react';
import { CpuState, MemoryEntry } from '../types/sap1';
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
}

export const BlockDiagram: React.FC<BlockDiagramProps> = ({
  cpuState,
  memoryEntries,
  memory,
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

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#bde5f3] border-4 border-[#86c5dc] p-4 sm:p-6 shadow-2xl text-[#2c1b3d]">
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b-2 border-[#86c5dc]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#58063f] text-[#f9d9ef] flex items-center justify-center shadow">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold tracking-wide uppercase text-[#58063f]">
              Comfy Cakes Control Console · SAP-1 Registers
            </h2>
            <p className="text-xs text-[#58063f]/80">
              Machine button modules corresponding to the hardware registers and central W-Bus
            </p>
          </div>
        </div>

        {/* Central W-Bus Conveyor Monitor Tag */}
        <div className="bg-white/90 border-2 border-[#58063f] px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-2.5 font-mono text-xs">
          <span className="text-[#58063f] font-bold">W-BUS DATA:</span>
          {busActive ? (
            <span className="text-[#912e73] font-black flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a6d] animate-ping" />
              {toHexByte(wBus)}H ({wBus}g) [{toBin8(wBus)}]
            </span>
          ) : (
            <span className="text-slate-500 italic">Conveyor Idle</span>
          )}
          {busActive && (
            <span className="text-[10px] bg-[#58063f] text-[#f9d9ef] px-2 py-0.5 rounded-md font-sans font-bold">
              {busDriver} → {busReceiver}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Register Blocks (Styled like the cream-framed button stations in screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
        {/* ================= LEFT COLUMN: PC, MAR, RAM, IR, Controller ================= */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* 1. Program Counter (PC) */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              Ep
                ? 'comfy-button-active'
                : Cp
                ? 'bg-[#fff4d4] border-[#e2be75] shadow-md'
                : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#58063f]">
                  Program Counter (PC)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">4-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Cp
                      ? 'bg-[#58063f] text-white border-[#3b0229]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Cp: Increment PC"
                >
                  [Cp]
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Ep
                      ? 'bg-[#912e73] text-white border-[#58063f] animate-pulse'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Ep: Enable PC to Bus"
                >
                  [Ep]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#e2be75] shadow-inner">
                  <span className="text-xs text-slate-500 font-mono">HEX: </span>
                  <span className="text-sm font-bold font-mono text-[#58063f]">
                    {toHex4(pc)}H
                  </span>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#e2be75] shadow-inner">
                  <span className="text-xs text-slate-500 font-mono">BIN: </span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {toBin4(pc)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold">
                {Ep ? (
                  <span className="text-[#912e73] flex items-center">
                    DRIVING BUS <ArrowRight className="w-3.5 h-3.5 inline ml-0.5" />
                  </span>
                ) : (
                  <span className="text-slate-400 font-normal">Holding Ticket</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Memory Address Register (MAR) */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              Lm ? 'comfy-button-active' : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#58063f]">
                  Memory Address (MAR)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">4-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Lm
                      ? 'bg-[#58063f] text-white border-[#3b0229]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Lm: Load MAR from Bus"
                >
                  [Lm]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#e2be75] shadow-inner">
                  <span className="text-xs text-slate-500 font-mono">SHELF: </span>
                  <span className="text-sm font-bold font-mono text-[#58063f]">
                    {toHex4(mar)}H
                  </span>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#e2be75] shadow-inner">
                  <span className="text-xs text-slate-500 font-mono">BIN: </span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {toBin4(mar)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold">
                {Lm ? (
                  <span className="text-[#912e73] flex items-center">
                    <ArrowLeft className="w-3.5 h-3.5 inline mr-0.5" /> LATCHING
                  </span>
                ) : (
                  <span className="text-slate-400 font-normal">Holding Shelf</span>
                )}
              </div>
            </div>
          </div>

          {/* 3. 16×8 RAM Matrix */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              CE ? 'comfy-button-active' : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#58063f]" />
                <span className="text-xs font-black uppercase text-[#58063f]">
                  Pantry Storeroom (16 × 8 RAM)
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    CE
                      ? 'bg-[#58063f] text-white border-[#3b0229]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="CE: Output RAM[MAR] to Bus"
                >
                  [CE]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/90 p-2 rounded-lg border border-[#e2be75]">
              <div>
                <div className="text-[10px] text-slate-600 font-mono">
                  POINTED JAR: <strong className="text-[#58063f]">RAM[{toHex4(mar)}H]</strong>
                </div>
                <div className="text-xs font-mono font-bold text-[#912e73]">
                  {toHexByte(currentRamByte)}H ({toBin8(currentRamByte)})
                </div>
                <div className="text-[10px] text-slate-700 font-mono mt-0.5 truncate max-w-[200px]">
                  {currentRamEntry?.mnemonic || 'Data'}
                </div>
              </div>

              <div className="text-right">
                {CE ? (
                  <span className="text-[#912e73] text-xs font-mono font-bold flex items-center justify-end">
                    DISPENSING <ArrowRight className="w-3.5 h-3.5 inline ml-0.5" />
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs font-mono">Pantry Latched</span>
                )}
              </div>
            </div>
          </div>

          {/* 4. Instruction Register (IR) */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              Li || Ei ? 'comfy-button-active' : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#58063f]" />
                <span className="text-xs font-black uppercase text-[#58063f]">
                  Instruction Register (IR)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">8-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Li
                      ? 'bg-[#58063f] text-white border-[#3b0229]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Li: Load IR from Bus"
                >
                  [Li]
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Ei
                      ? 'bg-[#912e73] text-white border-[#58063f]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Ei: Enable IR operand to Bus"
                >
                  [Ei]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded-lg border border-[#e2be75]">
                <div className="text-[9px] text-slate-500 font-mono uppercase">Opcode (7-4)</div>
                <div className="text-xs font-bold font-mono text-[#58063f]">
                  {toBin4(irOpcode)} ({toHex4(irOpcode)}H)
                </div>
                <div className="text-[10px] font-mono text-slate-700 font-bold mt-0.5">
                  {decodedIR.mnemonic.split(' ')[0]}
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-[#e2be75]">
                <div className="text-[9px] text-slate-500 font-mono uppercase">Operand (3-0)</div>
                <div className="text-xs font-bold font-mono text-[#912e73]">
                  {toBin4(irOperand)} ({toHex4(irOperand)}H)
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Shelf {toHex4(irOperand)}H
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: CONVEYOR BELT W-BUS TRUNK ================= */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center relative py-2 lg:py-0">
          <div className="w-14 sm:w-16 h-full min-h-[460px] bg-[#4a4e56] border-4 border-[#2b2d32] rounded-2xl flex flex-col items-center justify-between py-6 shadow-inner relative overflow-hidden">
            {/* Belt tracks */}
            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-30">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[1px] h-full bg-slate-300" />
              ))}
            </div>

            <div className="z-10 bg-[#fff4d4] border-2 border-[#e2be75] px-2 py-0.5 rounded text-center shadow">
              <span className="text-[9px] font-mono font-black text-[#58063f]">W-BUS</span>
            </div>

            <div
              className={`z-10 flex flex-col items-center justify-center p-2 rounded-xl border-2 text-center transition-all ${
                busActive
                  ? 'bg-[#c56eab] border-white text-white shadow-md scale-105'
                  : 'bg-white/80 border-slate-400 text-slate-600'
              }`}
            >
              <span className="text-[8px] font-mono uppercase">BYTE</span>
              <span className="text-xs font-mono font-black">
                {busActive ? `${toHexByte(wBus)}H` : '---'}
              </span>
              <span className="text-[8px] font-mono mt-0.5">
                {busActive ? `${wBus}g` : 'Z'}
              </span>
            </div>

            <div className="z-10 bg-[#fff4d4] border-2 border-[#e2be75] px-2 py-0.5 rounded text-center shadow">
              <span className="text-[8px] font-mono text-[#58063f] font-bold">BELT</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Accumulator, ALU, B-Register, Output ================= */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* 1. Accumulator (A Register) */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              La || Ea ? 'comfy-button-active' : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#58063f]">
                  Accumulator (Mixing Bowl)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">8-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    La
                      ? 'bg-[#58063f] text-white border-[#3b0229]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="La: Load Accumulator from Bus"
                >
                  [La]
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Ea
                      ? 'bg-[#912e73] text-white border-[#58063f]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Ea: Enable Accumulator to Bus"
                >
                  [Ea]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-[#e2be75]">
                <span className="text-[9px] text-slate-500 font-mono">HEX: </span>
                <span className="text-sm font-bold font-mono text-[#58063f]">
                  {toHexByte(a)}H
                </span>
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-[#e2be75]">
                <span className="text-[9px] text-slate-500 font-mono">GRAMS: </span>
                <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                  {a}g
                </span>
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-[#e2be75]">
                <span className="text-[9px] text-slate-500 font-mono">SIGNED: </span>
                <span className="text-sm font-bold font-mono text-slate-600 tabular-nums">
                  {toSignedDec(a)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Adder / Subtractor (ALU) */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              Eu ? 'comfy-button-active' : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#58063f]" />
                <span className="text-xs font-black uppercase text-[#58063f]">
                  Frosting Mixer & Trimmer (ALU)
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Su
                      ? 'bg-[#ff2a6d] text-white border-[#b30030]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Su: Subtract/Trim mode"
                >
                  [Su: {Su ? 'SUB' : 'ADD'}]
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Eu
                      ? 'bg-[#912e73] text-white border-[#58063f]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Eu: Enable ALU to Bus"
                >
                  [Eu]
                </span>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#e2be75] mb-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600">
                  {Su ? `${a}g - ${b}g (Trim)` : `${a}g + ${b}g (Layer)`}:
                </span>
                <span className="text-[#58063f] font-bold text-sm">
                  = {toHexByte(aluVal)}H ({aluVal}g)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className={flags.carry ? 'text-[#ff2a6d] font-bold' : 'text-slate-400'}>
                  CY: {flags.carry ? '1' : '0'}
                </span>
                <span className={flags.zero ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  Z: {flags.zero ? '1' : '0'}
                </span>
              </div>
              {Eu && <span className="text-[#912e73] font-bold text-[10px]">DISPENSING TO BUS</span>}
            </div>
          </div>

          {/* 3. B Register */}
          <div
            className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
              Lb ? 'comfy-button-active' : 'comfy-button'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2be75]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#58063f]">
                  B Register (Measuring Cup)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">8-Bit</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold border text-[11px] ${
                    Lb
                      ? 'bg-[#58063f] text-white border-[#3b0229]'
                      : 'bg-white text-slate-700 border-[#e2be75]'
                  }`}
                  title="Lb: Load B Register from Bus"
                >
                  [Lb]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#e2be75]">
                  <span className="text-xs text-slate-500 font-mono">HEX: </span>
                  <span className="text-sm font-bold font-mono text-[#58063f]">
                    {toHexByte(b)}H
                  </span>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-[#e2be75]">
                  <span className="text-xs text-slate-500 font-mono">GRAMS: </span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {b}g
                  </span>
                </div>
              </div>
              {Lb ? (
                <span className="text-[#912e73] text-[11px] font-mono font-bold">LATCHING</span>
              ) : (
                <span className="text-slate-400 text-[11px]">Feeds Mixer B</span>
              )}
            </div>
          </div>

          {/* 4. Output Register & LED Display Stand */}
          <div className="rounded-xl border-2 border-[#e2be75] bg-[#fffcf2] p-2 shadow-sm">
            <div className="flex items-center justify-between pb-1 px-1 mb-1 border-b border-[#e2be75]">
              <span className="text-xs font-black uppercase text-[#58063f]">
                Output Register & Diodes
              </span>
              <span
                className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${
                  Lo ? 'bg-[#ff2a6d] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                [Lo]
              </span>
            </div>
            <LedDisplay value={out} label="Cake Inspection Diodes" isLatched={Lo} />
          </div>
        </div>
      </div>
    </div>
  );
};
