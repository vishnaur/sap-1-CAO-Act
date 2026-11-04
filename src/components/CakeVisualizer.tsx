import React from 'react';
import {
  Sparkles,
  RotateCcw,
  SkipForward,
  FastForward,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { CpuState } from '../types/sap1';
import { toBin8Compact, toHex4, toHexByte } from '../utils/sap1Core';

interface CakeVisualizerProps {
  cpuState: CpuState;
  onStepTState?: () => void;
  onStepInstruction?: () => void;
  onToggleRun?: () => void;
  onReset?: () => void;
  isRunning?: boolean;
}

export const CakeVisualizer: React.FC<CakeVisualizerProps> = ({
  cpuState,
  onStepTState,
  onStepInstruction,
  onToggleRun,
  onReset,
  isRunning = false,
}) => {
  const { a, b, out, tState, ir, isHalted, busActive, busDriver, busReceiver, wBus } = cpuState;
  const opcode = (ir >> 4) & 0x0f;
  const binOut = toBin8Compact(out);

  // Cake layer activation states
  const hasBaseLayer = a > 0 || out > 0;
  const hasMiddleLayer = b > 0 || out > 0;
  const hasTopFrosting = (b > 0 && opcode === 0x1) || out > 0;
  const hasToppingCherries = out > 0;

  // Overhead dispenser nozzle active states (T1 to T6)
  const isDispenserActive = (stateName: string) => tState === stateName;

  return (
    <div className="w-full rounded-2xl overflow-hidden border-4 border-[#58063f] shadow-2xl relative select-none">
      {/* ================= STAGE TOP HALF: BAKERY PINK WALL & OVERHEAD DISPENSERS ================= */}
      <div className="bakery-wallpaper relative p-4 sm:p-6 pb-2 min-h-[300px] flex flex-col justify-between border-b-4 border-[#3a2046]">
        {/* Subtle cake silhouettes in the background wall */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-around items-center px-8">
          <div className="w-32 h-36 rounded-t-full border-4 border-dashed border-white" />
          <div className="w-40 h-44 rounded-t-full border-4 border-dashed border-white" />
          <div className="w-32 h-36 rounded-t-full border-4 border-dashed border-white" />
        </div>

        {/* Top Machinery Row: Order TV | 6 Ceiling Dispensers (T1-T6) | Digital Scorebox */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          {/* 1. Left Order Monitor (TV Screen with target cake order) */}
          <div className="bg-[#4a86b8] border-4 border-[#2b5579] rounded-xl p-1.5 shadow-lg flex flex-col items-center w-28 sm:w-32 shrink-0">
            <div className="bg-[#1e344a] text-white text-[10px] font-bold px-2 py-0.5 rounded w-full text-center flex items-center justify-between">
              <span>ORDER</span>
              <span className="text-amber-300 font-mono">07H</span>
            </div>
            {/* Target Cake Preview (Matches screenshot: Red base, green mid, chocolate, pink top) */}
            <div className="w-full bg-white rounded-lg p-1.5 my-1 flex flex-col items-center justify-center shadow-inner">
              <div className="flex gap-1 mb-0.5">
                <span className="text-[10px]">🍒</span>
                <span className="text-[10px]">🍒</span>
                <span className="text-[10px]">🍒</span>
              </div>
              <div className="w-16 h-3 rounded-t-md bg-[#ff2a6d] border border-[#b30030]" />
              <div className="w-18 h-3 bg-[#58063f] border border-[#3b0229]" />
              <div className="w-20 h-3 bg-[#88d926] border border-[#528711]" />
              <div className="w-22 h-3.5 rounded-b-md bg-[#e63946] border border-[#9b1c28]" />
            </div>
            <div className="text-[9px] font-mono text-[#d0e5f5] text-center font-bold">
              Target: 7g (07H)
            </div>
          </div>

          {/* 2. Six Overhead Ceiling Dispensers (Mapping to T1 - T6 Micro-operations) */}
          <div className="flex-1 flex justify-center items-start gap-1 sm:gap-3 max-w-xl mx-auto">
            {/* T1: Pan / Shape Dispenser */}
            <div className="flex flex-col items-center transition-transform">
              <div className="w-1.5 h-6 bg-slate-600" />
              <div
                className={`w-9 sm:w-11 h-12 rounded-t-full rounded-b-lg border-2 flex flex-col items-center justify-center p-0.5 shadow-md transition-all ${
                  isDispenserActive('T1')
                    ? 'bg-amber-300 border-amber-500 scale-110 -translate-y-1 ring-2 ring-white'
                    : 'bg-[#912e73] border-[#58063f] opacity-80'
                }`}
                title="T1: Address State (Order Ticket → MAR)"
              >
                <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600 mb-0.5" />
                <span className="text-[9px] font-bold text-white font-mono">T1</span>
                <span className="text-[7px] text-amber-100 font-sans leading-none">PAN</span>
              </div>
              {isDispenserActive('T1') && <div className="w-1.5 h-4 bg-amber-300 animate-pulse" />}
            </div>

            {/* T2: Conveyor Piston Motor */}
            <div className="flex flex-col items-center transition-transform">
              <div className="w-1.5 h-6 bg-slate-600" />
              <div
                className={`w-9 sm:w-11 h-12 rounded-t-full rounded-b-lg border-2 flex flex-col items-center justify-center p-0.5 shadow-md transition-all ${
                  isDispenserActive('T2')
                    ? 'bg-cyan-300 border-cyan-500 scale-110 -translate-y-1 ring-2 ring-white'
                    : 'bg-[#7a185e] border-[#58063f] opacity-80'
                }`}
                title="T2: Counter Increment (PC = PC + 1)"
              >
                <div className="w-4 h-4 rounded-full bg-cyan-400 border border-cyan-600 mb-0.5" />
                <span className="text-[9px] font-bold text-white font-mono">T2</span>
                <span className="text-[7px] text-cyan-100 font-sans leading-none">PULSE</span>
              </div>
              {isDispenserActive('T2') && <div className="w-1.5 h-4 bg-cyan-300 animate-pulse" />}
            </div>

            {/* T3: Recipe Read Glass Tank */}
            <div className="flex flex-col items-center transition-transform">
              <div className="w-1.5 h-6 bg-slate-600" />
              <div
                className={`w-9 sm:w-11 h-12 rounded-t-full rounded-b-lg border-2 flex flex-col items-center justify-center p-0.5 shadow-md transition-all ${
                  isDispenserActive('T3')
                    ? 'bg-purple-300 border-purple-500 scale-110 -translate-y-1 ring-2 ring-white'
                    : 'bg-[#58063f] border-[#3b0229] opacity-80'
                }`}
                title="T3: Memory State (RAM[MAR] → IR)"
              >
                <div className="w-4 h-4 rounded-full bg-purple-400 border border-purple-600 mb-0.5" />
                <span className="text-[9px] font-bold text-white font-mono">T3</span>
                <span className="text-[7px] text-purple-100 font-sans leading-none">READ</span>
              </div>
              {isDispenserActive('T3') && <div className="w-1.5 h-4 bg-purple-300 animate-pulse" />}
            </div>

            {/* T4: Ingredient Dispatch Nozzle */}
            <div className="flex flex-col items-center transition-transform">
              <div className="w-1.5 h-6 bg-slate-600" />
              <div
                className={`w-9 sm:w-11 h-12 rounded-t-full rounded-b-lg border-2 flex flex-col items-center justify-center p-0.5 shadow-md transition-all ${
                  isDispenserActive('T4')
                    ? 'bg-rose-300 border-rose-500 scale-110 -translate-y-1 ring-2 ring-white'
                    : 'bg-[#912e73] border-[#58063f] opacity-80'
                }`}
                title="T4: Opcode Decode & Shelf Dispatch"
              >
                <div className="w-4 h-4 rounded-full bg-rose-400 border border-rose-600 mb-0.5" />
                <span className="text-[9px] font-bold text-white font-mono">T4</span>
                <span className="text-[7px] text-rose-100 font-sans leading-none">TARGET</span>
              </div>
              {isDispenserActive('T4') && <div className="w-1.5 h-4 bg-rose-300 animate-pulse" />}
            </div>

            {/* T5: Pouring Batter Dispenser */}
            <div className="flex flex-col items-center transition-transform">
              <div className="w-1.5 h-6 bg-slate-600" />
              <div
                className={`w-9 sm:w-11 h-12 rounded-t-full rounded-b-lg border-2 flex flex-col items-center justify-center p-0.5 shadow-md transition-all ${
                  isDispenserActive('T5')
                    ? 'bg-emerald-300 border-emerald-500 scale-110 -translate-y-1 ring-2 ring-white'
                    : 'bg-[#58063f] border-[#3b0229] opacity-80'
                }`}
                title="T5: Pouring Batter into Mixing Bowl (RAM → ACC/B)"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-400 border border-emerald-600 mb-0.5" />
                <span className="text-[9px] font-bold text-white font-mono">T5</span>
                <span className="text-[7px] text-emerald-100 font-sans leading-none">POUR</span>
              </div>
              {isDispenserActive('T5') && <div className="w-1.5 h-4 bg-emerald-300 animate-pulse" />}
            </div>

            {/* T6: Swirling Striped Icing Nozzle (Matches screenshot spiral candy nozzle!) */}
            <div className="flex flex-col items-center transition-transform relative">
              <div className="w-1.5 h-6 bg-slate-600" />
              <div
                className={`w-10 sm:w-12 h-14 rounded-t-full rounded-b-xl border-2 flex flex-col items-center justify-center p-0.5 shadow-md transition-all ${
                  isDispenserActive('T6')
                    ? 'bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] border-white scale-115 -translate-y-1 ring-2 ring-yellow-300'
                    : 'bg-gradient-to-b from-[#c56eab] to-[#912e73] border-[#58063f]'
                }`}
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #f9d9ef, #f9d9ef 4px, #ff2a6d 4px, #ff2a6d 8px)',
                }}
                title="T6: Blending & Swirling Frosting (ALU → ACC)"
              >
                <span className="text-[9px] font-black text-white font-mono bg-[#58063f]/90 px-1 rounded shadow">
                  T6
                </span>
                <span className="text-[7px] text-white font-extrabold font-sans leading-none bg-[#0d0009]/80 px-1 rounded mt-0.5">
                  FROST
                </span>
              </div>

              {/* Sparkling icing drip when T6 is active */}
              {isDispenserActive('T6') && (
                <div className="absolute top-20 flex flex-col items-center z-30">
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-pink-500 rounded-full animate-pulse shadow-sm" />
                  <div className="flex gap-1 text-[10px] animate-bounce">
                    <span>✨</span>
                    <span>✨</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Right Score / Digital Box (Matches screenshot top right counter) */}
          <div className="bg-[#4a86b8] border-4 border-[#2b5579] rounded-xl p-2 shadow-lg flex flex-col items-center w-28 sm:w-32 shrink-0">
            <div className="flex items-center justify-between w-full pb-1 border-b border-[#2b5579] text-xs font-bold">
              <span className="text-rose-400">❌</span>
              <span className="text-emerald-300">🎂</span>
              <span className="text-cyan-200">_</span>
            </div>
            <div className="bg-[#1e344a] w-full rounded p-1.5 mt-1 text-center font-mono">
              <div className="text-[9px] text-[#9fc4e2] uppercase">Cake Weight</div>
              <div className="text-sm font-black text-emerald-300">
                {out > 0 ? `${out}g` : `${a}g`}
              </div>
              <div className="text-[9px] text-amber-300">
                {out > 0 ? `${toHexByte(out)}H` : `${toHexByte(a)}H`}
              </div>
            </div>
          </div>
        </div>

        {/* Central Conveyor Belt Floor with the Cake Pan traveling across */}
        <div className="relative mt-6 mb-2">
        

          {/* Conveyor Belt Platform (Metallic curved slats like screenshot) */}
          <div className="relative w-full h-16 rounded-xl border-4 border-[#2b2d32] shadow-2xl overflow-hidden flex items-center justify-between px-4 conveyor-slats-animated">
            {/* Belt Edge Rollers */}
            <div className="w-3 h-10 rounded-full bg-slate-800 border border-slate-600" />
            <div className="w-3 h-10 rounded-full bg-slate-800 border border-slate-600" />
          </div>

          {/* Blue Star Delivery Exit Pad (Right side of belt from screenshot) */}
          <div className="absolute right-0 top-1 w-16 h-14 bg-[#48a9e6] border-2 border-[#267db5] rounded-r-xl shadow-md flex items-center justify-center">
            <span className="text-yellow-300 text-2xl filter drop-shadow">⭐</span>
          </div>

          {/* The Multi-Tier Cake on Wax Paper (Centered on conveyor belt) */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            {/* Top Cherry / Candle Layer (Output Register) */}
            {hasToppingCherries && (
              <div className="flex items-center gap-1 mb-0.5 animate-in fade-in duration-200">
                {binOut.split('').map((bit, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span
                      className={`text-sm transition-transform ${
                        bit === '1' ? 'scale-125' : 'opacity-30 grayscale scale-75'
                      }`}
                    >
                      🍒
                    </span>
                    <div
                      className={`w-1.5 h-2 rounded-full ${
                        bit === '1' ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Layer 3: Pink Berry Glaze Frosting Top with Drips */}
            <div
              className={`w-32 sm:w-36 h-8 rounded-t-2xl bg-gradient-to-r from-[#ff5388] via-[#ff2a6d] to-[#ff5388] border-2 border-[#b30030] shadow-md flex items-center justify-center relative transition-all duration-300 ${
                hasTopFrosting ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
              }`}
            >
              {/* Dripping Glaze Scallops */}
              <div className="absolute -bottom-1.5 left-2 right-2 flex justify-around">
                <div className="w-3 h-2.5 bg-[#ff2a6d] rounded-b-full shadow-sm" />
                <div className="w-4 h-3 bg-[#ff5388] rounded-b-full shadow-sm" />
                <div className="w-3.5 h-2.5 bg-[#ff2a6d] rounded-b-full shadow-sm" />
                <div className="w-4 h-3 bg-[#ff5388] rounded-b-full shadow-sm" />
              </div>
              <span className="text-[10px] font-bold text-white font-sans">
                {hasTopFrosting ? 'Berry Glaze Layer' : 'Awaiting Glaze'}
              </span>
            </div>

            {/* Layer 2: Chocolate / Caramel Middle Sponge (Adder result) */}
            <div
              className={`w-36 sm:w-42 h-9 bg-gradient-to-r from-[#58063f] via-[#751257] to-[#58063f] border-x-2 border-t-2 border-[#3b0229] rounded-t-lg shadow-md flex items-center justify-center text-xs font-mono font-bold text-[#f9d9ef] transition-all duration-300 ${
                hasMiddleLayer ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <span>{hasMiddleLayer ? `Frosting Layer: ${b}g` : 'Filling...'}</span>
            </div>

            {/* Layer 1: Vibrant Strawberry Sponge with Lime Trim (Accumulator Base) */}
            <div
              className={`w-42 sm:w-48 h-10 bg-gradient-to-r from-[#e63946] via-[#f25c69] to-[#e63946] border-2 border-[#9b1c28] rounded-t-lg shadow-lg flex items-center justify-center text-xs font-mono font-bold text-white transition-all duration-300 ${
                hasBaseLayer ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>🎂 Sponge Base:</span>
                <span className="text-yellow-200">{hasBaseLayer ? `${a}g (${toHexByte(a)}H)` : 'Empty Pan'}</span>
              </div>
            </div>

            {/* White Greaseproof / Wax Paper Sheet under the cake (matches screenshot) */}
            <div className="w-46 sm:w-52 h-3 bg-white/95 border-b-2 border-slate-300 shadow-md flex items-center justify-center">
              <span className="text-[9px] font-mono text-slate-700 font-bold uppercase tracking-wider">
                W-BUS: {busActive ? `${toHexByte(wBus)}H (${wBus}g)` : 'IDLE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STAGE BOTTOM HALF: CHECKERED FLOOR, FOOT PEDALS & TRASH CAN ================= */}
      <div className="bakery-checker-floor p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-t-4 border-[#2b183a] relative">
        {/* Floor Foot Pedals (Big green arrow buttons from screenshot) */}
        <div className="bg-[#bde5f3] border-4 border-[#86c5dc] rounded-2xl p-2.5 shadow-xl flex items-center gap-3">
          <div className="text-[10px] font-black text-[#2c1b3d] uppercase font-sans tracking-wide">
            Foot Pedals:
          </div>

          {/* Left Pedal: Step T-State */}
          <button
            onClick={onStepTState}
            disabled={isRunning || isHalted}
            className="foot-pedal-green w-14 h-12 rounded-2xl flex items-center justify-center text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            title="Step T-State Cycle (Left Pedal)"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Right Pedal: Step Instruction */}
          <button
            onClick={onStepInstruction}
            disabled={isRunning || isHalted}
            className="foot-pedal-green w-14 h-12 rounded-2xl flex items-center justify-center text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            title="Step Instruction Layer (Right Pedal)"
          >
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Run / Bake Lever */}
          <button
            onClick={onToggleRun}
            disabled={isHalted}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 border-2 ${
              isRunning
                ? 'bg-[#58063f] text-white border-[#f9d9ef]'
                : 'bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] text-white border-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <span className="flex items-center gap-1.5">
                <Pause className="w-4 h-4 fill-current" /> Stop Conveyor
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Play className="w-4 h-4 fill-current" /> Bake Cake!
              </span>
            )}
          </button>
        </div>

        {/* Current Bakery Stage Callout */}
        <div className="bg-white/90 border-2 border-[#58063f] rounded-xl px-4 py-2 shadow-md">
          <span className="text-xs text-[#58063f] font-bold">
            Active Station:{' '}
            <strong className="text-[#912e73] font-mono text-sm uppercase">
              {tState} · {opcode === 0x0 ? 'LDA (Pantry Sponge)' : opcode === 0x1 ? 'ADD (Frosting)' : opcode === 0x2 ? 'SUB (Trim)' : opcode === 0xe ? 'OUT (Inspection)' : isHalted ? 'HLT (Finished!)' : 'Fetch'}
            </strong>
          </span>
        </div>

        {/* Recycling Trash Bin (Matches screenshot purple can on the right) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="bg-[#dcd6ee] border-4 border-[#9d8cc5] rounded-3xl p-3 shadow-xl flex flex-col items-center hover:bg-[#ece8f7] transition-all active:scale-95"
            title="Clear current pan & reset recipe"
          >
            <div className="w-12 h-12 rounded-full border-4 border-[#58063f] flex items-center justify-center text-[#58063f]">
              <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black text-[#58063f] mt-1 font-sans uppercase">
              Clear Pan
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
