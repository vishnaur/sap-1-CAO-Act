import React from 'react';
import { Clock, Trash2, Download, ArrowRight, Cake } from 'lucide-react';
import { TraceStep } from '../types/sap1';
import { toHex4, toHexByte } from '../utils/sap1Core';

interface TimingTraceLogProps {
  traceLog: TraceStep[];
  onClearLog: () => void;
}

export const TimingTraceLog: React.FC<TimingTraceLogProps> = ({
  traceLog,
  onClearLog,
}) => {
  const handleExportText = () => {
    if (traceLog.length === 0) return;
    const lines = [
      'Purble Place Comfy Cakes - SAP-1 Baking Trace Log',
      '=================================================',
      ...traceLog.map(
        (t, i) =>
          `[Batch #${i + 1}] ${t.tState} | PC:${toHex4(t.pc)}H | MAR:${toHex4(
            t.mar
          )}H | IR:${toHexByte(t.ir)}H (${t.instructionName}) | BOWL(A):${toHexByte(
            t.a
          )}H | CUP(B):${toHexByte(t.b)}H | CAKE(OUT):${toHexByte(t.out)}H | CONVEYOR:${toHexByte(
            t.wBus
          )}H | VALVES: [${t.activeSignals.join(', ')}] | ${t.description}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purble-cakes-trace-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#58063f]/25 border-2 border-[#912e73] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#912e73]/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#c56eab]" />
          <h3 className="text-sm font-black text-[#f9d9ef] uppercase tracking-wider font-sans">
            Kitchen Baking Step Trace Log
          </h3>
          <span className="text-xs text-[#c56eab] font-mono">
            ({traceLog.length} Conveyor pulses)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportText}
            disabled={traceLog.length === 0}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-[#58063f] hover:bg-[#912e73] text-[#f9d9ef] border border-[#c56eab] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Download trace log as text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Recipe</span>
          </button>
          <button
            onClick={onClearLog}
            disabled={traceLog.length === 0}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-[#0d0009] hover:bg-[#58063f] text-[#c56eab] hover:text-[#f9d9ef] border border-[#912e73] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
          <div className="py-12 text-center text-[#c56eab] font-sans">
            <Cake className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#c56eab]" />
            No bakery cycles executed yet. Click <strong className="text-[#f9d9ef]">Step Cycle</strong> or{' '}
            <strong className="text-[#f9d9ef]">Bake Cake!</strong> to start the Comfy Cakes conveyor belt.
          </div>
        ) : (
          [...traceLog].reverse().map((step, idx) => {
            const stepNum = traceLog.length - idx;
            const isT1 = step.tState === 'T1';

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  isT1
                    ? 'bg-[#58063f]/50 border-[#c56eab] shadow-md'
                    : 'bg-[#0d0009]/90 border-[#912e73]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#912e73]/50 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#c56eab] font-bold">#{stepNum}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        isT1
                          ? 'bg-[#c56eab] text-[#0d0009]'
                          : 'bg-[#58063f] text-[#f9d9ef]'
                      }`}
                    >
                      {step.tState}
                    </span>
                    <span className="text-[#c56eab] font-sans">
                      Directive: <strong className="text-[#f9d9ef]">{step.instructionName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {step.activeSignals.length > 0 ? (
                      <span className="text-amber-300 font-bold">
                        [{step.activeSignals.join(', ')}]
                      </span>
                    ) : (
                      <span className="text-[#c56eab]/50 italic">Conveyor coasting</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[#f9d9ef] font-sans text-xs leading-relaxed">
                  {step.description}
                </div>

                {/* State Snapshot at this cycle */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mt-2 pt-2 border-t border-[#912e73]/40 text-[10px] text-[#c56eab]">
                  <div>
                    Ticket: <span className="text-[#f9d9ef] font-bold">{toHex4(step.pc)}H</span>
                  </div>
                  <div>
                    Shelf: <span className="text-amber-300 font-bold">{toHex4(step.mar)}H</span>
                  </div>
                  <div>
                    Card: <span className="text-[#c56eab] font-bold">{toHexByte(step.ir)}H</span>
                  </div>
                  <div>
                    Bowl: <span className="text-[#f9d9ef] font-bold">{toHexByte(step.a)}H</span>
                  </div>
                  <div>
                    Cup: <span className="text-emerald-300 font-bold">{toHexByte(step.b)}H</span>
                  </div>
                  <div>
                    Cake: <span className="text-amber-300 font-bold">{toHexByte(step.out)}H</span>
                  </div>
                  <div className="col-span-2">
                    BELT:{' '}
                    <span className="text-[#f9d9ef] font-bold">
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
