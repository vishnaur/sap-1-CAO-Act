import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SAMPLE_PROGRAM_PRESETS,
  buildMemoryEntries,
  createInitialCpuState,
  stepClock,
  stepInstruction,
  toHex4,
  toHexByte,
  toBin8,
} from './utils/sap1Core';
import { CpuState, SampleProgramPreset, TraceStep } from './types/sap1';
import { AppTheme, THEME_CONFIGS } from './types/theme';
import { Sidebar } from './components/Sidebar';
import { ControlDeck } from './components/ControlDeck';
import { BlockDiagram } from './components/BlockDiagram';
import { CakeVisualizer } from './components/CakeVisualizer';
import { BalatroVisualizer } from './components/BalatroVisualizer';
import { RamTable } from './components/RamTable';
import { TimingTraceLog } from './components/TimingTraceLog';
import { MalvinoGuideModal } from './components/MalvinoGuideModal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import {
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Tv,
} from 'lucide-react';

export default function App() {
  // Theme state: defaults to Balatro Casino!
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('balatro');

  // Preset 0 is Malvino Standard: 25H + 05H - 23H = 07H
  const defaultPreset = SAMPLE_PROGRAM_PRESETS[0];

  const [memory, setMemory] = useState<number[]>([...defaultPreset.memory]);
  const [dataInputs, setDataInputs] = useState({
    addr9: 0x25,
    addrA: 0x05,
    addrB: 0x23,
  });

  const [cpuState, setCpuState] = useState<CpuState>(createInitialCpuState);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [clockSpeedMs, setClockSpeedMs] = useState<number>(600);
  const [traceLog, setTraceLog] = useState<TraceStep[]>([]);
  const [activeTab, setActiveTab] = useState<'diagram' | 'ram' | 'trace'>('diagram');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Derived memory entries
  const memoryEntries = buildMemoryEntries(memory);

  // Auto-running clock cycle loop
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const cpuStateRef = useRef(cpuState);
  cpuStateRef.current = cpuState;
  const memoryRef = useRef(memory);
  memoryRef.current = memory;

  // Step T-State callback
  const handleStepTState = useCallback(() => {
    setCpuState((prev) => {
      if (prev.isHalted) {
        setIsRunning(false);
        return prev;
      }
      const { nextState, traceStep } = stepClock(prev, memoryRef.current);
      setTraceLog((logs) => [...logs.slice(-199), traceStep]); // Keep last 200 logs
      if (nextState.isHalted) {
        setIsRunning(false);
      }
      return nextState;
    });
  }, []);

  // Step Instruction callback
  const handleStepInstruction = useCallback(() => {
    setCpuState((prev) => {
      if (prev.isHalted) {
        setIsRunning(false);
        return prev;
      }
      const { nextState, steps } = stepInstruction(prev, memoryRef.current);
      setTraceLog((logs) => [...logs.slice(-(200 - steps.length)), ...steps]);
      if (nextState.isHalted) {
        setIsRunning(false);
      }
      return nextState;
    });
  }, []);

  // Reset CPU callback
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCpuState(createInitialCpuState());
  }, []);

  // Run/Pause Toggle
  const handleToggleRun = useCallback(() => {
    if (cpuState.isHalted) return;
    setIsRunning((prev) => !prev);
  }, [cpuState.isHalted]);

  // Clock timer loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (!isRunningRef.current || cpuStateRef.current.isHalted) {
        setIsRunning(false);
        return;
      }
      handleStepTState();
    }, clockSpeedMs);

    return () => clearInterval(interval);
  }, [isRunning, clockSpeedMs, handleStepTState]);

  // Load Preset
  const handleLoadPreset = (preset: SampleProgramPreset) => {
    setIsRunning(false);
    setMemory([...preset.memory]);
    if (preset.id === 'malvino_standard') {
      setDataInputs({
        addr9: preset.memory[0x9] ?? 0x25,
        addrA: preset.memory[0xa] ?? 0x05,
        addrB: preset.memory[0xb] ?? 0x23,
      });
    } else {
      setDataInputs({
        addr9: preset.memory[0x9] ?? 0,
        addrA: preset.memory[0xa] ?? 0,
        addrB: preset.memory[0xb] ?? 0,
      });
    }
    setCpuState(createInitialCpuState());
  };

  // Update a single memory cell
  const handleUpdateMemoryCell = (address: number, byteVal: number) => {
    setMemory((prev) => {
      const next = [...prev];
      next[address] = byteVal & 0xff;
      return next;
    });

    if (address === 0x9) {
      setDataInputs((d) => ({ ...d, addr9: byteVal }));
    } else if (address === 0xa) {
      setDataInputs((d) => ({ ...d, addrA: byteVal }));
    } else if (address === 0xb) {
      setDataInputs((d) => ({ ...d, addrB: byteVal }));
    }
  };

  // Quick Data Input Handlers
  const handleUpdateDataInput = (addr: 0x9 | 0xa | 0xb, val: number) => {
    const clamped = val & 0xff;
    if (addr === 0x9) setDataInputs((d) => ({ ...d, addr9: clamped }));
    if (addr === 0xa) setDataInputs((d) => ({ ...d, addrA: clamped }));
    if (addr === 0xb) setDataInputs((d) => ({ ...d, addrB: clamped }));

    setMemory((prev) => {
      const next = [...prev];
      next[addr] = clamped;
      return next;
    });
  };

  // Expected math result: 25H + 05H - 23H = 07H (7)
  const expectedSampleSum = (dataInputs.addr9 + dataInputs.addrA - dataInputs.addrB) & 0xff;

  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  return (
    <div
      className={`min-h-screen flex flex-row font-sans transition-colors ${
        isBalatro
          ? 'bg-[#0f111a] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#2e1d40] text-[#2c1b3d]'
          : 'bg-[#0b0f19] text-slate-100'
      }`}
    >
      {/* Left Collapsible Sidebar Menu (Top Header moved to left side) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        isRunning={isRunning}
        onToggleRun={handleToggleRun}
        onReset={handleReset}
        isHalted={cpuState.isHalted}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        cycleCount={cpuState.cycleCount}
        instructionCount={cpuState.instructionCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Banner with Theme Context & Target Calculation */}
        <div
          className={`border-4 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 transition-all ${
            isBalatro
              ? 'bg-[#181d26] border-[#2f3847] text-white'
              : isPurble
              ? 'bg-[#bde5f3] border-[#86c5dc] text-[#58063f]'
              : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              {isBalatro ? (
                <img
                  src="/assets/aistudio/image_ae51533e.png"
                  alt="Balatro Cards Reference"
                  className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-xl border-2 border-[#e84118] shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : isPurble ? (
                <img
                  src="/assets/aistudio/image_d8c87c8e.png"
                  alt="Purble Place Bakery"
                  className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-xl border-2 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-2xl">
                  ⚡
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                    isBalatro
                      ? 'bg-[#e84118] text-white'
                      : isPurble
                      ? 'bg-[#58063f] text-white'
                      : 'bg-cyan-600 text-white'
                  }`}
                >
                  {THEME_CONFIGS[currentTheme].name}
                </span>
                <span className="text-xs font-mono font-bold opacity-80">
                  {THEME_CONFIGS[currentTheme].tagline}
                </span>
              </div>

              <h1 className="text-base sm:text-lg font-black mt-0.5">
                {isBalatro
                  ? 'Balatro Roguelike Poker · SAP-1 Calculator'
                  : isPurble
                  ? 'Purble Place · Comfy Cakes Architecture'
                  : 'Albert Malvino SAP-1 Computer Simulator'}
              </h1>

              <p className="text-xs opacity-90">
                Active Math Target:{' '}
                <strong className="font-mono">
                  {toHexByte(dataInputs.addr9)}H ({dataInputs.addr9})
                </strong>{' '}
                +{' '}
                <strong className="font-mono">
                  {toHexByte(dataInputs.addrA)}H ({dataInputs.addrA})
                </strong>{' '}
                -{' '}
                <strong className="font-mono">
                  {toHexByte(dataInputs.addrB)}H ({dataInputs.addrB})
                </strong>{' '}
                ={' '}
                <strong className="font-mono text-amber-400">
                  {toHexByte(expectedSampleSum)}H ({expectedSampleSum})
                </strong>
                {cpuState.isHalted && cpuState.out === expectedSampleSum && (
                  <span className="ml-2 inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isBalatro ? 'Blind Defeated!' : 'Order Verified!'}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleLoadPreset(SAMPLE_PROGRAM_PRESETS[0]);
                handleReset();
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 shadow-sm transition-all cursor-pointer"
            >
              Default Values
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#e84118] text-white hover:bg-[#c0392b] transition-all shadow-sm cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Theory Guide</span>
            </button>
          </div>
        </div>

        {/* Dynamic Visualizer based on Theme */}
        {isBalatro ? (
          <BalatroVisualizer
            cpuState={cpuState}
            onStepTState={handleStepTState}
            onStepInstruction={handleStepInstruction}
            onToggleRun={handleToggleRun}
            onReset={handleReset}
            isRunning={isRunning}
          />
        ) : isPurble ? (
          <CakeVisualizer
            cpuState={cpuState}
            onStepTState={handleStepTState}
            onStepInstruction={handleStepInstruction}
            onToggleRun={handleToggleRun}
            onReset={handleReset}
            isRunning={isRunning}
          />
        ) : null}

        {/* Control Deck: Clock Slider, 6 T-State Ring Counter & 12-Bit CON Word */}
        <ControlDeck
          isRunning={isRunning}
          isHalted={cpuState.isHalted}
          tState={cpuState.tState}
          controlSignals={cpuState.controlSignals}
          clockSpeedMs={clockSpeedMs}
          onClockSpeedChange={setClockSpeedMs}
          onStepTState={handleStepTState}
          onStepInstruction={handleStepInstruction}
          onToggleRun={handleToggleRun}
          onReset={handleReset}
          cycleCount={cpuState.cycleCount}
          instructionCount={cpuState.instructionCount}
          currentTheme={currentTheme}
        />

        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-slate-700/60 pb-2">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'diagram'
                ? isBalatro
                  ? 'bg-[#e84118] text-white shadow-md'
                  : isPurble
                  ? 'bg-[#bde5f3] text-[#58063f] border-2 border-[#86c5dc] shadow-md'
                  : 'bg-cyan-600 text-white shadow-md'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {isBalatro ? 'Hardware Registers (Casino Console)' : 'Hardware Register Console'}
          </button>
          <button
            onClick={() => setActiveTab('ram')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'ram'
                ? isBalatro
                  ? 'bg-[#e84118] text-white shadow-md'
                  : isPurble
                  ? 'bg-[#bde5f3] text-[#58063f] border-2 border-[#86c5dc] shadow-md'
                  : 'bg-cyan-600 text-white shadow-md'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {isBalatro ? '16-Card Deck (RAM Table)' : 'Recipe Storeroom (16×8 RAM)'}
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'trace'
                ? isBalatro
                  ? 'bg-[#e84118] text-white shadow-md'
                  : isPurble
                  ? 'bg-[#bde5f3] text-[#58063f] border-2 border-[#86c5dc] shadow-md'
                  : 'bg-cyan-600 text-white shadow-md'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Execution Trace Log ({traceLog.length})
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'diagram' && (
          <div className="flex flex-col gap-6">
            {/* Collapsible Header Toggle */}
            <div className="flex justify-end -mb-2">
              <button
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-md ${
                  isBalatro
                    ? 'bg-[#1b222c] text-white border-[#384556] hover:bg-[#283241]'
                    : isPurble
                    ? 'bg-[#58063f] text-[#f9d9ef] border-[#c56eab] hover:bg-[#912e73]'
                    : 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isConsoleOpen ? '▲ Collapse Register Console' : '▼ Expand Register Console'}
              </button>
            </div>

            {/* Collapsible Block Diagram */}
            {isConsoleOpen && (
              <BlockDiagram
                cpuState={cpuState}
                memoryEntries={memoryEntries}
                memory={memory}
                currentTheme={currentTheme}
              />
            )}

            {/* RAM Table and Trace Log side by side below diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RamTable
                memoryEntries={memoryEntries}
                memory={memory}
                currentMar={cpuState.mar}
                currentPc={cpuState.pc}
                onUpdateMemoryCell={handleUpdateMemoryCell}
                onLoadPreset={handleLoadPreset}
                onReset={handleReset}
                dataInputs={dataInputs}
                onUpdateDataInput={handleUpdateDataInput}
                currentTheme={currentTheme}
              />
              <TimingTraceLog
                traceLog={traceLog}
                onClearLog={() => setTraceLog([])}
                currentTheme={currentTheme}
              />
            </div>
          </div>
        )}

        {activeTab === 'ram' && (
          <RamTable
            memoryEntries={memoryEntries}
            memory={memory}
            currentMar={cpuState.mar}
            currentPc={cpuState.pc}
            onUpdateMemoryCell={handleUpdateMemoryCell}
            onLoadPreset={handleLoadPreset}
            onReset={handleReset}
            dataInputs={dataInputs}
            onUpdateDataInput={handleUpdateDataInput}
            currentTheme={currentTheme}
          />
        )}

        {activeTab === 'trace' && (
          <TimingTraceLog
            traceLog={traceLog}
            onClearLog={() => setTraceLog([])}
            currentTheme={currentTheme}
          />
        )}
        </main>
        {/* Footer */}
        <footer className="border-t-2 border-slate-800 bg-black/40 py-4 px-6 text-center text-xs opacity-70">
          Changeable Theme System: 🃏 Balatro Roguelike Casino · 🧁 Purble Place Comfy Cakes · ⚡ Albert Malvino TTL Lab
        </footer>
      </div>

      {/* Architecture Theory Modal */}
      <MalvinoGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
