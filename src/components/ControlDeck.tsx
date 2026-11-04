import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  FastForward,
  Activity,
  Cake,
  Sparkles,
} from 'lucide-react';
import { ControlSignals, TState } from '../types/sap1';
import { CONTROL_KEYS, formatConWord } from '../utils/sap1Core';

interface ControlDeckProps {
  isRunning: boolean;
  isHalted: boolean;
  tState: TState;
  controlSignals: ControlSignals;
  clockSpeedMs: number;
  onClockSpeedChange: (speedMs: number) => void;
  onStepTState: () => void;
  onStepInstruction: () => void;
  onToggleRun: () => void;
  onReset: () => void;
  cycleCount: number;
  instructionCount: number;
}

const T_STATES: TState[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

const T_STATE_DESCRIPTIONS: Record<TState, string> = {
  T1: 'T1 (Pan State): Order Ticket → Shelf Selector [Ep, Lm]',
  T2: 'T2 (Belt Pulse): Advancing to Next Ticket [Cp]',
  T3: 'T3 (Recipe Read): Read Recipe Instruction [CE, Li]',
  T4: 'T4 (Pantry Fetch): Dispatch Ingredient Shelf [Ei, Lm]',
  T5: 'T5 (Dispense): Pour Batter / Cream into Bowl [CE, La/Lb]',
  T6: 'T6 (Mix / Trim): Whip, Blend or Trim Layers [Eu, La]',
};

export const ControlDeck: React.FC<ControlDeckProps> = ({
  isRunning,
  isHalted,
  tState,
  controlSignals,
  clockSpeedMs,
  onClockSpeedChange,
  onStepTState,
  onStepInstruction,
  onToggleRun,
  onReset,
  cycleCount,
  instructionCount,
}) => {
  const { binary: conBinary, hex: conHex } = formatConWord(controlSignals, 'logical');
  const clockHz = (1000 / clockSpeedMs).toFixed(1);

  return (
    <div className="w-full bg-[#bde5f3] border-4 border-[#86c5dc] rounded-2xl p-4 sm:p-5 shadow-xl text-[#2c1b3d]">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#86c5dc]">
        {/* Main Execution Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Step T-State */}
          <button
            onClick={onStepTState}
            disabled={isRunning || isHalted}
            className="comfy-button px-3.5 py-2 text-xs font-black rounded-xl text-[#58063f] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            title="Step T-State Clock Cycle"
          >
            <SkipForward className="w-4 h-4 text-[#912e73]" />
            <span>Step Cycle</span>
          </button>

          {/* Step Instruction */}
          <button
            onClick={onStepInstruction}
            disabled={isRunning || isHalted}
            className="comfy-button px-3.5 py-2 text-xs font-black rounded-xl text-[#58063f] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            title="Complete full instruction step"
          >
            <FastForward className="w-4 h-4 text-[#58063f]" />
            <span>Finish Layer</span>
          </button>

          {/* Run / Bake Button */}
          <button
            onClick={onToggleRun}
            disabled={isHalted}
            className={`px-4 py-2 text-xs font-black rounded-xl border-2 transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer ${
              isRunning
                ? 'bg-[#58063f] text-white border-[#3b0229]'
                : 'bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] text-white border-[#ffc2d1]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Conveyor</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Baking</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="px-3.5 py-2 text-xs font-black rounded-xl bg-white hover:bg-slate-100 text-[#58063f] border-2 border-[#caa052] transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset pan, registers and ingredients"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 bg-white/90 border border-[#86c5dc] rounded-xl px-3 py-1.5 shadow-sm">
          <Activity className="w-4 h-4 text-[#912e73] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Conveyor Speed</span>
            <span className="text-xs font-mono font-bold text-[#58063f]">
              {clockHz} Hz ({clockSpeedMs}ms)
            </span>
          </div>

          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={clockSpeedMs}
            onChange={(e) => onClockSpeedChange(Number(e.target.value))}
            className="w-24 sm:w-28 accent-[#912e73] cursor-pointer"
            aria-label="Conveyor speed slider"
          />
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="bg-white border border-[#86c5dc] px-2.5 py-1 rounded-lg">
            <span className="text-slate-500">Cycles:</span>{' '}
            <strong className="text-[#58063f]">{cycleCount}</strong>
          </div>
          <div className="bg-white border border-[#86c5dc] px-2.5 py-1 rounded-lg">
            <span className="text-slate-500">Layers:</span>{' '}
            <strong className="text-[#58063f]">{instructionCount}</strong>
          </div>
          {isHalted && (
            <div className="bg-[#ff2a6d] text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-yellow-300" /> CAKE READY
            </div>
          )}
        </div>
      </div>

      {/* 6-State Ring Counter */}
      <div className="pt-2.5 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Cake className="w-4 h-4 text-[#58063f]" />
            <span className="text-xs font-black uppercase text-[#58063f] font-sans">
              6-Stage Ring Counter (Conveyor Stations)
            </span>
          </div>
          <span className="text-xs font-mono text-[#912e73] font-bold">
            {T_STATE_DESCRIPTIONS[tState]}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {T_STATES.map((state) => {
            const isActive = tState === state;
            const isFetch = state === 'T1' || state === 'T2' || state === 'T3';

            return (
              <div
                key={state}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'comfy-button-active scale-105 shadow-md'
                    : 'bg-white/80 border-[#e2be75] text-slate-700'
                }`}
              >
                <span className="text-xs font-mono font-black">{state}</span>
                <span className="text-[9px] font-bold mt-0.5 opacity-80">
                  {isFetch ? 'FETCH' : 'BAKE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12-Bit Control Word (CON) */}
      <div className="mt-2.5 pt-2.5 border-t-2 border-[#86c5dc]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black uppercase text-[#58063f] font-sans">
            12-Bit Control Word (CON)
          </span>
          <span className="text-xs font-mono text-[#58063f] font-bold bg-white px-2 py-0.5 rounded border border-[#86c5dc]">
            {conHex} ({conBinary})
          </span>
        </div>

        {/* 12 Control Line Chips */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {CONTROL_KEYS.map((key) => {
            const active = controlSignals[key];
            return (
              <div
                key={key}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition-all ${
                  active
                    ? 'bg-[#58063f] text-white border-[#3b0229] font-black shadow-sm'
                    : 'bg-white/70 border-[#e2be75] text-slate-600 font-medium'
                }`}
              >
                <span className="text-[10px] font-mono leading-none">[{key}]</span>
                <span className="text-[10px] font-mono font-bold mt-0.5 leading-none">
                  {active ? '1' : '0'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
