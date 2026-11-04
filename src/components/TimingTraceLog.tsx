import React from 'react';
import { Clock, Trash2, Download, ArrowRight, Cake, Gamepad2, Cpu, Sparkles } from 'lucide-react';
import { TraceStep } from '../types/sap1';
import { AppTheme } from '../types/theme';
import { toHex4, toHexByte } from '../utils/sap1Core';

interface TimingTraceLogProps {
  traceLog: TraceStep[];
  onClearLog: () => void;
  currentTheme?: AppTheme;
}

export const TimingTraceLog: React.FC<TimingTraceLogProps> = ({
  traceLog,
  onClearLog,
  currentTheme = 'balatro',
}) => {
  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  const handleExportText = () => {
    if (traceLog.length === 0) return;
    const titlePrefix = isBalatro
      ? 'Balatro Roguelike Poker - SAP-1 Hand Execution Log'
      : isPurble
      ? 'Purble Place Comfy Cakes - SAP-1 Baking Trace Log'
      : 'Albert Malvino SAP-1 Microprogram Execution Trace Log';

    const lines = [
      titlePrefix,
      '='.repeat(titlePrefix.length),
      ...traceLog.map(
        (t, i) =>
          `[Pulse #${i + 1}] ${t.tState} | PC:${toHex4(t.pc)}H | MAR:${toHex4(
            t.mar
          )}H | IR:${toHexByte(t.ir)}H (${t.instructionName}) | A:${toHexByte(
            t.a
          )}H | B:${toHexByte(t.b)}H | OUT:${toHexByte(t.out)}H | W-BUS:${toHexByte(
            t.wBus
          )}H | SIGNALS: [${t.activeSignals.join(', ')}] | ${t.description}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sap1-${currentTheme}-trace-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 transition-all ${
        isBalatro
          ? 'bg-[#181d26] border-4 border-[#2f3847] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#58063f]/25 border-2 border-[#912e73] text-[#f9d9ef]'
          : 'bg-[#0f172a] border-4 border-slate-700 text-slate-100'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between pb-3 border-b flex-wrap gap-2 ${
          isBalatro
            ? 'border-[#2f3847]'
            : isPurble
            ? 'border-[#912e73]/60'
            : 'border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          {isBalatro ? (
            <Gamepad2 className="w-4 h-4 text-[#e84118]" />
          ) : isPurble ? (
            <Clock className="w-4 h-4 text-[#c56eab]" />
          ) : (
            <Cpu className="w-4 h-4 text-cyan-400" />
          )}
          <h3
            className={`text-sm font-black uppercase tracking-wider font-sans ${
              isBalatro
                ? 'text-[#f5f6fa]'
                : isPurble
                ? 'text-[#f9d9ef]'
                : 'text-slate-100'
            }`}
          >
            {isBalatro
              ? 'Balatro Hand Execution Trace Log'
              : isPurble
              ? 'Kitchen Baking Step Trace Log'
              : 'SAP-1 Timing & Control Trace Log'}
          </h3>
          <span
            className={`text-xs font-mono opacity-70 ${
              isBalatro ? 'text-slate-400' : isPurble ? 'text-[#c56eab]' : 'text-slate-400'
            }`}
          >
            ({traceLog.length} {isBalatro ? 'Card Deals & Pulses' : isPurble ? 'Conveyor pulses' : 'Clock Cycles'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportText}
            disabled={traceLog.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all border cursor-pointer ${
              isBalatro
                ? 'bg-[#1e2533] hover:bg-[#283244] text-[#fbc531] border-[#384556]'
                : isPurble
                ? 'bg-[#58063f] hover:bg-[#912e73] text-[#f9d9ef] border-[#c56eab]'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-600'
            }`}
            title="Download trace log as text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBalatro ? 'Export Game Log' : isPurble ? 'Export Recipe' : 'Export Log'}</span>
          </button>
          <button
            onClick={onClearLog}
            disabled={traceLog.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all border cursor-pointer ${
              isBalatro
                ? 'bg-[#10131a] hover:bg-[#181d26] text-slate-400 hover:text-white border-[#2f3847]'
                : isPurble
                ? 'bg-[#0d0009] hover:bg-[#58063f] text-[#c56eab] hover:text-[#f9d9ef] border-[#912e73]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Clear trace history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs">
        {traceLog.length === 0 ? (
          <div
            className={`py-12 text-center font-sans ${
              isBalatro
                ? 'text-slate-400'
                : isPurble
                ? 'text-[#c56eab]'
                : 'text-slate-400'
            }`}
          >
            {isBalatro ? (
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#e84118]" />
            ) : isPurble ? (
              <Cake className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#c56eab]" />
            ) : (
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50 text-cyan-400" />
            )}
            {isBalatro ? (
              <>
                No poker card deals executed yet. Click <strong className="text-white">Draw Card (Step Cycle)</strong> or{' '}
                <strong className="text-white">Auto Deal (Run)</strong> to deal the cards.
              </>
            ) : isPurble ? (
              <>
                No bakery cycles executed yet. Click <strong className="text-[#f9d9ef]">Step Cycle</strong> or{' '}
                <strong className="text-[#f9d9ef]">Start Baking</strong> to start the Comfy Cakes conveyor belt.
              </>
            ) : (
              <>
                No clock cycles executed yet. Click <strong className="text-white">Step T-State</strong> or{' '}
                <strong className="text-white">Run Clock</strong> to begin execution.
              </>
            )}
          </div>
        ) : (
          [...traceLog].reverse().map((step, idx) => {
            const stepNum = traceLog.length - idx;
            const isT1 = step.tState === 'T1';

            let entryClass = '';
            let tBadgeClass = '';

            if (isBalatro) {
              entryClass = isT1
                ? 'bg-[#1e2533] border-2 border-[#384556] shadow-md'
                : 'bg-[#10131a] border border-[#232a36]';
              tBadgeClass = isT1
                ? 'bg-[#e84118] text-white'
                : 'bg-[#242b38] text-[#fbc531] border border-[#384556]';
            } else if (isPurble) {
              entryClass = isT1
                ? 'bg-[#58063f]/50 border-[#c56eab] shadow-md'
                : 'bg-[#0d0009]/90 border-[#912e73]';
              tBadgeClass = isT1
                ? 'bg-[#c56eab] text-[#0d0009]'
                : 'bg-[#58063f] text-[#f9d9ef]';
            } else {
              entryClass = isT1
                ? 'bg-slate-900 border-2 border-cyan-800'
                : 'bg-slate-950 border border-slate-800';
              tBadgeClass = isT1
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-cyan-300';
            }

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all ${entryClass}`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b text-[11px] ${
                    isBalatro
                      ? 'border-[#2f3847]'
                      : isPurble
                      ? 'border-[#912e73]/50'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#c56eab]' : 'text-slate-400'
                      }`}
                    >
                      #{stepNum}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${tBadgeClass}`}>
                      {step.tState}
                    </span>
                    <span
                      className={`font-sans ${
                        isBalatro ? 'text-slate-300' : isPurble ? 'text-[#c56eab]' : 'text-slate-400'
                      }`}
                    >
                      {isBalatro ? 'Card Joker: ' : isPurble ? 'Directive: ' : 'Instruction: '}
                      <strong
                        className={
                          isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#f9d9ef]' : 'text-white'
                        }
                      >
                        {step.instructionName}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {step.activeSignals.length > 0 ? (
                      <span
                        className={`font-bold ${
                          isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-amber-300' : 'text-cyan-400'
                        }`}
                      >
                        [{step.activeSignals.join(', ')}]
                      </span>
                    ) : (
                      <span className="opacity-40 italic">
                        {isBalatro ? 'Deck idle' : isPurble ? 'Conveyor coasting' : 'Clock idle'}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`pt-2 font-sans text-xs leading-relaxed ${
                    isBalatro ? 'text-slate-200' : isPurble ? 'text-[#f9d9ef]' : 'text-slate-300'
                  }`}
                >
                  {step.description}
                </div>

                {/* State Snapshot at this cycle */}
                <div
                  className={`grid grid-cols-4 sm:grid-cols-8 gap-1.5 mt-2 pt-2 border-t text-[10px] ${
                    isBalatro
                      ? 'border-[#2f3847] text-slate-400'
                      : isPurble
                      ? 'border-[#912e73]/40 text-[#c56eab]'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  <div>
                    {isBalatro ? 'Card:' : isPurble ? 'Ticket:' : 'PC:'}{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-[#f9d9ef]' : 'text-slate-200'
                      }`}
                    >
                      {toHex4(step.pc)}H
                    </span>
                  </div>
                  <div>
                    {isBalatro ? 'Slot:' : isPurble ? 'Shelf:' : 'MAR:'}{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-amber-300' : 'text-cyan-400'
                      }`}
                    >
                      {toHex4(step.mar)}H
                    </span>
                  </div>
                  <div>
                    IR:{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-emerald-400' : isPurble ? 'text-[#c56eab]' : 'text-amber-400'
                      }`}
                    >
                      {toHexByte(step.ir)}H
                    </span>
                  </div>
                  <div>
                    {isBalatro ? 'Chips(A):' : isPurble ? 'Bowl:' : 'A:'}{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#f9d9ef]' : 'text-cyan-400'
                      }`}
                    >
                      {toHexByte(step.a)}H
                    </span>
                  </div>
                  <div>
                    {isBalatro ? 'Mult(B):' : isPurble ? 'Cup:' : 'B:'}{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-[#e84118]' : isPurble ? 'text-emerald-300' : 'text-amber-400'
                      }`}
                    >
                      {toHexByte(step.b)}H
                    </span>
                  </div>
                  <div>
                    {isBalatro ? 'Tally:' : isPurble ? 'Cake:' : 'OUT:'}{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-[#fbc531]' : isPurble ? 'text-amber-300' : 'text-emerald-400'
                      }`}
                    >
                      {toHexByte(step.out)}H
                    </span>
                  </div>
                  <div className="col-span-2">
                    {isBalatro ? 'FELT:' : isPurble ? 'BELT:' : 'BUS:'}{' '}
                    <span
                      className={`font-bold ${
                        isBalatro ? 'text-white' : isPurble ? 'text-[#f9d9ef]' : 'text-slate-200'
                      }`}
                    >
                      {toHexByte(step.wBus)}H ({step.busDriver} <ArrowRight className="inline w-2.5 h-2.5" />{' '}
                      {step.busReceiver})
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
