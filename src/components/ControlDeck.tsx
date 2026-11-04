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
  Gamepad2,
  Cpu,
} from 'lucide-react';
import { ControlSignals, TState } from '../types/sap1';
import { AppTheme } from '../types/theme';
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
  currentTheme?: AppTheme;
}

const T_STATES: TState[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

const CAKE_T_DESCRIPTIONS: Record<TState, string> = {
  T1: 'T1 (Pan State): Order Ticket → Shelf Selector [Ep, Lm]',
  T2: 'T2 (Belt Pulse): Advancing to Next Ticket [Cp]',
  T3: 'T3 (Recipe Read): Read Recipe Instruction [CE, Li]',
  T4: 'T4 (Pantry Fetch): Dispatch Ingredient Shelf [Ei, Lm]',
  T5: 'T5 (Dispense): Pour Batter / Cream into Bowl [CE, La/Lb]',
  T6: 'T6 (Mix / Trim): Whip, Blend or Trim Layers [Eu, La]',
};

const BALATRO_T_DESCRIPTIONS: Record<TState, string> = {
  T1: 'T1 (Deal Card): Program Counter → Memory Address [Ep, Lm]',
  T2: 'T2 (Advance Deck): Increment Next Card [Cp]',
  T3: 'T3 (Read Hand): Fetch Instruction from Deck [CE, Li]',
  T4: 'T4 (Inspect Bet): Dispatch Target Card Address [Ei, Lm]',
  T5: 'T5 (Chip Tally): Load Chips into Accumulator / B [CE, La/Lb]',
  T6: 'T6 (Calculate Mult): Add / Subtract Mult Score [Eu, La]',
};

const CLASSIC_T_DESCRIPTIONS: Record<TState, string> = {
  T1: 'T1 (Address State): PC drives MAR via W-Bus [Ep, Lm]',
  T2: 'T2 (Increment State): PC increments by 1 [Cp]',
  T3: 'T3 (Memory State): RAM outputs instruction to IR [CE, Li]',
  T4: 'T4 (Execute State 1): IR operand address to MAR [Ei, Lm]',
  T5: 'T5 (Execute State 2): RAM operand loaded to A/B [CE, La/Lb]',
  T6: 'T6 (Execute State 3): ALU computes & latches to A [Eu, La]',
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
  currentTheme = 'balatro',
}) => {
  const { binary: conBinary, hex: conHex } = formatConWord(controlSignals, 'logical');
  const clockHz = (1000 / clockSpeedMs).toFixed(1);

  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  const tDescription = isBalatro
    ? BALATRO_T_DESCRIPTIONS[tState]
    : isPurble
    ? CAKE_T_DESCRIPTIONS[tState]
    : CLASSIC_T_DESCRIPTIONS[tState];

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 shadow-xl transition-all ${
        isBalatro
          ? 'bg-[#181d26] border-4 border-[#2f3847] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#bde5f3] border-4 border-[#86c5dc] text-[#2c1b3d]'
          : 'bg-[#0f172a] border-4 border-slate-700 text-slate-100'
      }`}
    >
      {/* Top Controls Row */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 ${
          isBalatro
            ? 'border-[#2f3847]'
            : isPurble
            ? 'border-[#86c5dc]'
            : 'border-slate-700'
        }`}
      >
        {/* Main Execution Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Step T-State */}
          <button
            onClick={onStepTState}
            disabled={isRunning || isHalted}
            className={`px-3.5 py-2 text-xs font-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm ${
              isBalatro
                ? 'bg-[#1e2533] hover:bg-[#252f40] text-[#00a8ff] border-2 border-[#00a8ff]/60'
                : isPurble
                ? 'comfy-button text-[#58063f]'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-600'
            }`}
            title="Step T-State Clock Cycle"
          >
            <SkipForward
              className={`w-4 h-4 ${
                isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#912e73]' : 'text-cyan-400'
              }`}
            />
            <span>{isBalatro ? 'Draw Card (Step Cycle)' : isPurble ? 'Step Cycle' : 'Step T-State'}</span>
          </button>

          {/* Step Instruction */}
          <button
            onClick={onStepInstruction}
            disabled={isRunning || isHalted}
            className={`px-3.5 py-2 text-xs font-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm ${
              isBalatro
                ? 'bg-[#1e2533] hover:bg-[#252f40] text-[#e84118] border-2 border-[#e84118]/60'
                : isPurble
                ? 'comfy-button text-[#58063f]'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600'
            }`}
            title="Complete full instruction step"
          >
            <FastForward
              className={`w-4 h-4 ${
                isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#58063f]' : 'text-amber-400'
              }`}
            />
            <span>{isBalatro ? 'Play Hand (Step Layer)' : isPurble ? 'Finish Layer' : 'Step Instruction'}</span>
          </button>

          {/* Run / Bake Button */}
          <button
            onClick={onToggleRun}
            disabled={isHalted}
            className={`px-4 py-2 text-xs font-black rounded-xl border-2 transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer ${
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
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{isBalatro ? 'Pause Deal' : isPurble ? 'Pause Conveyor' : 'Halt Clock'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isBalatro ? 'Auto Deal (Run)' : isPurble ? 'Start Baking' : 'Run Clock'}</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border-2 shadow-sm ${
              isBalatro
                ? 'bg-[#1b222c] hover:bg-[#242b38] text-slate-200 border-[#384556]'
                : isPurble
                ? 'bg-white hover:bg-slate-100 text-[#58063f] border-[#caa052]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title="Reset pan, registers and ingredients"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBalatro ? 'Fold / Reset' : 'Reset'}</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div
          className={`flex items-center gap-3 rounded-xl px-3 py-1.5 shadow-sm border ${
            isBalatro
              ? 'bg-[#10131a] border-[#2f3847] text-slate-300'
              : isPurble
              ? 'bg-white/90 border-[#86c5dc] text-[#58063f]'
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}
        >
          <Activity
            className={`w-4 h-4 shrink-0 ${
              isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#912e73]' : 'text-cyan-400'
            }`}
          />
          <div className="flex flex-col">
            <span
              className={`text-[9px] font-bold uppercase ${
                isBalatro ? 'text-slate-400' : isPurble ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {isBalatro ? 'Deal Speed' : isPurble ? 'Conveyor Speed' : 'Clock Speed'}
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#58063f]' : 'text-cyan-300'
              }`}
            >
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
            className={`w-24 sm:w-28 cursor-pointer ${
              isBalatro
                ? 'accent-[#e84118]'
                : isPurble
                ? 'accent-[#912e73]'
                : 'accent-cyan-400'
            }`}
            aria-label="Clock speed slider"
          />
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div
            className={`px-2.5 py-1 rounded-lg border ${
              isBalatro
                ? 'bg-[#10131a] border-[#2f3847] text-slate-300'
                : isPurble
                ? 'bg-white border-[#86c5dc] text-slate-500'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <span className="opacity-70">Cycles:</span>{' '}
            <strong
              className={
                isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'
              }
            >
              {cycleCount}
            </strong>
          </div>
          <div
            className={`px-2.5 py-1 rounded-lg border ${
              isBalatro
                ? 'bg-[#10131a] border-[#2f3847] text-slate-300'
                : isPurble
                ? 'bg-white border-[#86c5dc] text-slate-500'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <span className="opacity-70">{isBalatro ? 'Hands:' : isPurble ? 'Layers:' : 'Insts:'}</span>{' '}
            <strong
              className={
                isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#58063f]' : 'text-amber-400'
              }
            >
              {instructionCount}
            </strong>
          </div>
          {isHalted && (
            <div
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm ${
                isBalatro
                  ? 'bg-[#e84118] text-white border border-[#fbc531]'
                  : isPurble
                  ? 'bg-[#ff2a6d] text-white'
                  : 'bg-amber-500 text-slate-950 font-black'
              }`}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{isBalatro ? 'BLIND CLEARED' : isPurble ? 'CAKE READY' : 'CPU HALTED'}</span>
            </div>
          )}
        </div>
      </div>

      {/* 6-State Ring Counter */}
      <div className="pt-2.5 pb-2">
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {isBalatro ? (
              <Gamepad2 className="w-4 h-4 text-[#e84118]" />
            ) : isPurble ? (
              <Cake className="w-4 h-4 text-[#58063f]" />
            ) : (
              <Cpu className="w-4 h-4 text-cyan-400" />
            )}
            <span
              className={`text-xs font-black uppercase font-sans ${
                isBalatro
                  ? 'text-[#f5f6fa]'
                  : isPurble
                  ? 'text-[#58063f]'
                  : 'text-slate-100'
              }`}
            >
              {isBalatro
                ? '6-Stage Ring Counter (Blind / Hand Phases)'
                : isPurble
                ? '6-Stage Ring Counter (Conveyor Stations)'
                : '6-Stage Ring Counter (T1 - T6 Generator)'}
            </span>
          </div>
          <span
            className={`text-xs font-mono font-bold ${
              isBalatro
                ? 'text-[#fbc531]'
                : isPurble
                ? 'text-[#912e73]'
                : 'text-cyan-400'
            }`}
          >
            {tDescription}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {T_STATES.map((state) => {
            const isActive = tState === state;
            const isFetch = state === 'T1' || state === 'T2' || state === 'T3';

            let activeClass = '';
            let inactiveClass = '';

            if (isBalatro) {
              activeClass =
                'bg-gradient-to-b from-[#e84118] to-[#992d13] text-white border-2 border-[#fbc531] scale-105 shadow-lg shadow-red-950/50';
              inactiveClass = 'bg-[#10131a] border-2 border-[#2f3847] text-slate-400 hover:border-slate-500';
            } else if (isPurble) {
              activeClass = 'comfy-button-active scale-105 shadow-md';
              inactiveClass = 'bg-white/80 border-[#e2be75] text-slate-700';
            } else {
              activeClass = 'bg-cyan-600 text-white border-2 border-cyan-400 scale-105 shadow-lg shadow-cyan-950';
              inactiveClass = 'bg-slate-900 border-2 border-slate-700 text-slate-400';
            }

            return (
              <div
                key={state}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <span className="text-xs font-mono font-black">{state}</span>
                <span className="text-[9px] font-bold mt-0.5 opacity-80 uppercase">
                  {isFetch
                    ? 'FETCH'
                    : isBalatro
                    ? 'PLAY'
                    : isPurble
                    ? 'BAKE'
                    : 'EXEC'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12-Bit Control Word (CON) */}
      <div
        className={`mt-2.5 pt-2.5 border-t-2 ${
          isBalatro
            ? 'border-[#2f3847]'
            : isPurble
            ? 'border-[#86c5dc]'
            : 'border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
          <span
            className={`text-xs font-black uppercase font-sans ${
              isBalatro
                ? 'text-[#f5f6fa]'
                : isPurble
                ? 'text-[#58063f]'
                : 'text-slate-100'
            }`}
          >
            12-Bit Control Word (CON)
          </span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              isBalatro
                ? 'bg-[#10131a] text-[#fbc531] border-[#2f3847]'
                : isPurble
                ? 'bg-white text-[#58063f] border-[#86c5dc]'
                : 'bg-slate-900 text-cyan-300 border-slate-700'
            }`}
          >
            {conHex} ({conBinary})
          </span>
        </div>

        {/* 12 Control Line Chips */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {CONTROL_KEYS.map((key) => {
            const active = controlSignals[key];

            let chipActiveClass = '';
            let chipInactiveClass = '';

            if (isBalatro) {
              chipActiveClass = 'bg-[#e84118] text-white border-[#fbc531] font-black shadow-md';
              chipInactiveClass = 'bg-[#10131a] border-[#2f3847] text-slate-500 font-medium';
            } else if (isPurble) {
              chipActiveClass = 'bg-[#58063f] text-white border-[#3b0229] font-black shadow-sm';
              chipInactiveClass = 'bg-white/70 border-[#e2be75] text-slate-600 font-medium';
            } else {
              chipActiveClass = 'bg-cyan-600 text-white border-cyan-400 font-black shadow-sm';
              chipInactiveClass = 'bg-slate-900 border-slate-800 text-slate-500 font-medium';
            }

            return (
              <div
                key={key}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-center transition-all ${
                  active ? chipActiveClass : chipInactiveClass
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
