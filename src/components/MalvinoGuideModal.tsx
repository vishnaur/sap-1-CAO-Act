import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Cake,
  Layers,
  HardDrive,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Cpu,
  Calculator,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AppTheme, THEME_CONFIGS } from '../types/theme';

interface MalvinoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: AppTheme;
}

type HardwareModuleId =
  | 'wbus'
  | 'pc'
  | 'mar'
  | 'ram'
  | 'ir'
  | 'acc'
  | 'alu'
  | 'breg'
  | 'out'
  | 'ring'
  | 'con';

interface ModuleDetail {
  id: HardwareModuleId;
  name: string;
  signals: string;
  ttlChip: string;
  balatroAnalog: string;
  purbleAnalog: string;
  classicAnalog: string;
  functionDesc: string;
  mathExample: string;
}

const HARDWARE_MODULES: ModuleDetail[] = [
  {
    id: 'wbus',
    name: 'Common W-Bus (8-Bit Trunk)',
    signals: 'Tri-state controlled by Ep, CE, Ei, Ea, Eu',
    ttlChip: '8-Bit Bi-Directional Bus (74LS245)',
    balatroAnalog: 'The Green Poker Felt Table where cards and chips are slid between players and dealer.',
    purbleAnalog: 'The Central Motorized Conveyor Belt carrying the cake pan past dispensers.',
    classicAnalog: 'The central copper trace bus linking all register inputs and outputs with high-impedance (High-Z).',
    functionDesc: 'The shared 8-bit highway of SAP-1. Only ONE module drives the bus at any moment to prevent bus contention.',
    mathExample: 'Carries operand 25H to Accumulator, 05H to B Register, and transmits result 07H to Output Register.',
  },
  {
    id: 'pc',
    name: 'Program Counter (PC)',
    signals: 'Cp (Increment), Ep (Enable to Bus)',
    ttlChip: '4-Bit Synchronous Counter (74LS161)',
    balatroAnalog: 'Next Hand Card Pointer (Points to the active card rule in the poker deck).',
    purbleAnalog: 'Recipe Order Ticket Tracker (Advances to the next baking ticket step).',
    classicAnalog: '4-bit binary program counter keeping track of the next instruction address to execute.',
    functionDesc: 'Starts at 0000 (0H) and increments during T2 clock cycle to point to successive program instructions in memory.',
    mathExample: 'Advances 0H (LDA 9H) → 1H (ADD AH) → 2H (SUB BH) → 3H (OUT) → 4H (HLT).',
  },
  {
    id: 'mar',
    name: 'Memory Address Register (MAR)',
    signals: 'Lm (Load from Bus)',
    ttlChip: '4-Bit Register (74LS173)',
    balatroAnalog: 'Card Slot Selector (Latches which card position in the 16-card deck is selected).',
    purbleAnalog: 'Pantry Shelf Selector (Points to which ingredient jar on shelves 0H–FH to open).',
    classicAnalog: '4-bit address latch directly addressing the 16 memory locations in the RAM matrix.',
    functionDesc: 'Latches 4 address bits from the W-Bus during T1 or T4, isolating RAM address lines from CPU transients.',
    mathExample: 'Latches 9H during LDA, AH during ADD, and BH during SUB.',
  },
  {
    id: 'ram',
    name: '16×8 RAM Memory Matrix',
    signals: 'CE (Chip Enable / Output to Bus)',
    ttlChip: '16×4 Static RAMs (Dual 74LS189s)',
    balatroAnalog: 'The 16-Card Deck (Holds the 5 game instructions and the 3 card chips: 25H, 05H, 23H).',
    purbleAnalog: 'Recipe Storeroom (16 Jars holding instructions and ingredient grams: 37g, 5g, 35g).',
    classicAnalog: '16 bytes of asynchronous read/write memory storing machine program and numerical data.',
    functionDesc: 'Outputs the 8-bit byte at RAM[MAR] to the W-Bus whenever the CE control signal goes active.',
    mathExample: 'Stores LDA 9H at 0H, ADD AH at 1H, SUB BH at 2H, and raw values 25H at 9H, 05H at AH, 23H at BH.',
  },
  {
    id: 'ir',
    name: 'Instruction Register (IR)',
    signals: 'Li (Load from Bus), Ei (Enable Operand to Bus)',
    ttlChip: 'Dual 4-Bit Registers (74LS173s)',
    balatroAnalog: 'Joker Rule Card (Upper 4 bits = Joker Action, Lower 4 bits = Target Card Slot).',
    purbleAnalog: 'Master Baker Directive Card (Opcode: Action, Operand: Target Ingredient Shelf).',
    classicAnalog: '8-bit register splitting opcode (bits 7-4) for the controller and operand address (bits 3-0) for the bus.',
    functionDesc: 'Latches instruction byte during T3 (Fetch). During T4, bits 3-0 drive the W-Bus via Ei.',
    mathExample: 'Holds 0001 1010 (1AH = ADD AH). Opcode 1H activates ADD sequence; operand AH routes to MAR.',
  },
  {
    id: 'acc',
    name: 'Accumulator (A Register)',
    signals: 'La (Load from Bus), Ea (Enable to Bus)',
    ttlChip: '8-Bit Register (74LS173s)',
    balatroAnalog: 'Active Hand Chips Tally (Accumulates chips as cards are scored).',
    purbleAnalog: 'Main Mixing Bowl / Cake Base (Accumulates sponge batter and cream layers).',
    classicAnalog: '8-bit primary accumulator register directly wired into ALU input port A.',
    functionDesc: 'Holds intermediate calculation results. Loaded via La and can drive the W-Bus via Ea.',
    mathExample: 'Starts with 25H (37), increases to 2AH (42) after addition, ends at 07H (7) after subtraction.',
  },
  {
    id: 'alu',
    name: 'Arithmetic Logic Unit (ALU)',
    signals: 'Su (0=ADD, 1=SUB), Eu (Enable Result to Bus)',
    ttlChip: '4-Bit Full Adders (Dual 74LS283s with XOR inverters)',
    balatroAnalog: 'Chips Adder & Mult Modifier (Computes chip additions and mult subtractions).',
    purbleAnalog: 'Frosting Blender & Pastry Knife (Whips frosting layers or trims cake height).',
    classicAnalog: '8-bit 2’s complement adder/subtractor with carry and zero flag logic.',
    functionDesc: 'Continuously calculates A + B (when Su=0) or A - B (when Su=1). Drives W-Bus when Eu is active.',
    mathExample: '25H + 05H = 2AH (T6 of ADD). Then 2AH - 23H = 07H (T6 of SUB).',
  },
  {
    id: 'breg',
    name: 'B Register (Operand Register)',
    signals: 'Lb (Load from Bus)',
    ttlChip: '8-Bit Register (74LS173s)',
    balatroAnalog: 'Score Multiplier / Secondary Bet Card (Feeds the second operand to the ALU).',
    purbleAnalog: 'Ingredient Measuring Cup (Holds portion before blending into bowl).',
    classicAnalog: '8-bit buffer register feeding input port B of the ALU adder/subtractor.',
    functionDesc: 'Latches the second operand from the W-Bus during T5 so the ALU has stable inputs.',
    mathExample: 'Latches 05H (5) during ADD AH; latches 23H (35) during SUB BH.',
  },
  {
    id: 'out',
    name: 'Output Register & Diodes',
    signals: 'Lo (Load from Bus)',
    ttlChip: '8-Bit Register & Drivers (74LS173 / LEDs)',
    balatroAnalog: 'Final Casino Chips Payout & Mult Diodes (Displays winning chips 07H).',
    purbleAnalog: 'Cake Quality Inspection Stand & Cherry Candlestick Diodes (Validates 7g cake).',
    classicAnalog: '8-bit display register with binary LEDs showing the final computed result to the user.',
    functionDesc: 'Latches the Accumulator output during the OUT instruction (T4) so results persist after halt.',
    mathExample: 'Displays 07H (0000 0111 in binary), signifying exact match with expected target 7!',
  },
  {
    id: 'ring',
    name: '6-State Ring Counter (T1–T6)',
    signals: 'T1, T2, T3 (Fetch) | T4, T5, T6 (Execute)',
    ttlChip: 'Ring Counter / Johnson Counter (74LS107)',
    balatroAnalog: 'Round Dealer Phases: Deal → Advance → Read Hand → Inspect Bet → Tally Chips → Mult Scoring.',
    purbleAnalog: 'Conveyor Stations: Pan Start → Belt Pulse → Read Recipe → Dispense → Pour → Frost.',
    classicAnalog: 'Electronic sequencer generating 6 non-overlapping timing pulses for micro-operations.',
    functionDesc: 'Controls the CPU heartbeats: T1–T3 always fetch the instruction; T4–T6 execute the specific opcode.',
    mathExample: 'Takes 6 clock cycles per instruction (18 cycles total to compute 25H + 05H - 23H).',
  },
];

export const MalvinoGuideModal: React.FC<MalvinoGuideModalProps> = ({
  isOpen,
  onClose,
  currentTheme = 'balatro',
}) => {
  const [activeTheme, setActiveTheme] = useState<AppTheme>(currentTheme);
  const [selectedModuleId, setSelectedModuleId] = useState<HardwareModuleId>('wbus');

  if (!isOpen) return null;

  const isBalatro = activeTheme === 'balatro';
  const isPurble = activeTheme === 'purble';

  const selectedModule =
    HARDWARE_MODULES.find((m) => m.id === selectedModuleId) || HARDWARE_MODULES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 transition-all ${
          isBalatro
            ? 'bg-[#0f111a] border-[#2f3847] text-[#f5f6fa]'
            : isPurble
            ? 'bg-[#1a0820] border-[#912e73] text-[#f9d9ef]'
            : 'bg-[#0b0f19] border-slate-700 text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 px-6 border-b-2 flex-wrap gap-3 ${
            isBalatro
              ? 'bg-[#181d26] border-[#2f3847]'
              : isPurble
              ? 'bg-[#58063f]/60 border-[#912e73]'
              : 'bg-slate-900 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border flex items-center justify-center text-xl shadow-md ${
                isBalatro
                  ? 'bg-[#e84118] border-[#fbc531] text-white'
                  : isPurble
                  ? 'bg-[#912e73] border-[#c56eab] text-white'
                  : 'bg-cyan-600 border-cyan-400 text-white'
              }`}
            >
              {THEME_CONFIGS[activeTheme].icon}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wide uppercase font-sans">
                {isBalatro
                  ? 'Balatro Casino · Poker Deck & SAP-1 Architecture'
                  : isPurble
                  ? 'Purble Place · Comfy Cakes & SAP-1 Architecture'
                  : 'Albert Malvino SAP-1 Architecture & Theory Guide'}
              </h2>
              <p className="text-xs opacity-75 font-mono">
                {isBalatro
                  ? 'Mapping Albert Malvino’s 8-Bit SAP-1 to Roguelike Poker Scoring'
                  : isPurble
                  ? 'Mapping Albert Malvino’s 8-Bit SAP-1 to Windows Comfy Cakes'
                  : 'Digital Computer Electronics (Albert Malvino & Jerald Brown)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Pills inside Guide */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-bold ${
                isBalatro
                  ? 'bg-[#10131a] border-[#2f3847]'
                  : isPurble
                  ? 'bg-[#0d0009] border-[#912e73]'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              {(['balatro', 'purble', 'classic'] as const).map((tId) => (
                <button
                  key={tId}
                  onClick={() => setActiveTheme(tId)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeTheme === tId
                      ? isBalatro
                        ? 'bg-[#e84118] text-white shadow'
                        : isPurble
                        ? 'bg-[#58063f] text-[#f9d9ef] shadow'
                        : 'bg-cyan-600 text-white shadow'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span>{THEME_CONFIGS[tId].icon}</span>
                  <span className="hidden sm:inline text-[11px] font-sans font-bold">
                    {tId === 'balatro' ? 'Balatro' : tId === 'purble' ? 'Purble' : 'Malvino'}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl opacity-70 hover:opacity-100 transition-colors cursor-pointer"
              aria-label="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm leading-relaxed scrollbar-thin">
          {/* Section 1: Interactive Component Inspector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Layers
                  className={`w-4 h-4 ${
                    isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#c56eab]' : 'text-cyan-400'
                  }`}
                />
                <span>1. Hardware Module & Theme Analogy Inspector</span>
              </h3>
              <span className="text-[10px] font-mono opacity-70">
                Click any module below to inspect its behavior
              </span>
            </div>

            {/* Quick Horizontal Module Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {HARDWARE_MODULES.map((m) => {
                const isSelected = m.id === selectedModuleId;
                let activeStyle = '';
                if (isSelected) {
                  if (isBalatro) activeStyle = 'bg-[#e84118] text-white border-[#fbc531] shadow-md';
                  else if (isPurble) activeStyle = 'bg-[#58063f] text-[#f9d9ef] border-[#c56eab] shadow-md';
                  else activeStyle = 'bg-cyan-600 text-white border-cyan-400 shadow-md';
                } else {
                  if (isBalatro) activeStyle = 'bg-[#181d26] border-[#2f3847] text-slate-300 hover:border-slate-400';
                  else if (isPurble) activeStyle = 'bg-[#2e1d40] border-[#58063f] text-[#c56eab] hover:border-[#912e73]';
                  else activeStyle = 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700';
                }

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModuleId(m.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${activeStyle}`}
                  >
                    {m.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Selected Module Detail Card */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all mt-2 shadow-lg ${
                isBalatro
                  ? 'bg-[#181d26] border-[#384556]'
                  : isPurble
                  ? 'bg-[#58063f]/30 border-[#912e73]'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-white/10">
                <div>
                  <h4 className="text-sm font-black uppercase text-amber-300 font-sans">
                    {selectedModule.name}
                  </h4>
                  <span className="text-[10px] font-mono opacity-70">
                    TTL IC: {selectedModule.ttlChip}
                  </span>
                </div>
                <div
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    isBalatro
                      ? 'bg-[#10131a] text-[#fbc531] border-[#2f3847]'
                      : isPurble
                      ? 'bg-[#0d0009] text-[#f9d9ef] border-[#912e73]'
                      : 'bg-slate-950 text-cyan-300 border-slate-800'
                  }`}
                >
                  Signals: {selectedModule.signals}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] opacity-70 block mb-1">
                    Theme Analogy ({THEME_CONFIGS[activeTheme].name}):
                  </span>
                  <p className="leading-relaxed font-sans bg-black/25 p-2.5 rounded-xl border border-white/10">
                    {isBalatro
                      ? selectedModule.balatroAnalog
                      : isPurble
                      ? selectedModule.purbleAnalog
                      : selectedModule.classicAnalog}
                  </p>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] opacity-70 block mb-1">
                    Computer Architecture Function:
                  </span>
                  <p className="leading-relaxed font-sans bg-black/25 p-2.5 rounded-xl border border-white/10">
                    {selectedModule.functionDesc}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold shrink-0">Math Cycle (07H):</span>
                <span className="opacity-90 truncate">{selectedModule.mathExample}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Complete Hardware Mapping Table */}
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2. Full Register & Control Signal Mapping Matrix</span>
            </h3>

            <div
              className={`rounded-2xl border-2 overflow-x-auto shadow-md ${
                isBalatro
                  ? 'border-[#2f3847] bg-[#141822]'
                  : isPurble
                  ? 'border-[#912e73] bg-[#0d0009]'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead
                  className={`border-b text-[11px] font-black uppercase ${
                    isBalatro
                      ? 'bg-[#1e2533] text-slate-200 border-[#2f3847]'
                      : isPurble
                      ? 'bg-[#58063f] text-[#f9d9ef] border-[#912e73]'
                      : 'bg-slate-900 text-cyan-300 border-slate-800'
                  }`}
                >
                  <tr>
                    <th className="p-2.5">Hardware Module</th>
                    <th className="p-2.5">Micro-Signals</th>
                    <th className="p-2.5">{THEME_CONFIGS[activeTheme].name} Analog</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {HARDWARE_MODULES.slice(0, 9).map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedModuleId(m.id)}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="p-2.5 font-bold text-amber-300 whitespace-nowrap">
                        {m.name}
                      </td>
                      <td className="p-2.5 opacity-80 whitespace-nowrap">{m.signals}</td>
                      <td className="p-2.5 font-sans opacity-95">
                        {isBalatro
                          ? m.balatroAnalog
                          : isPurble
                          ? m.purbleAnalog
                          : m.classicAnalog}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: The 6 T-States Sequence */}
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
              <HardDrive
                className={`w-4 h-4 ${
                  isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#c56eab]' : 'text-cyan-400'
                }`}
              />
              <span>3. The 6-State Ring Counter Cycle</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  isBalatro
                    ? 'bg-[#181d26] border-[#2f3847]'
                    : isPurble
                    ? 'bg-[#58063f]/30 border-[#912e73]'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300">T1: Address State</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded">[Ep, Lm]</span>
                </div>
                <p className="opacity-80 text-[11px] leading-relaxed font-sans">
                  {isBalatro
                    ? 'Program Counter puts card pointer onto felt; MAR latches target card slot.'
                    : isPurble
                    ? 'Program counter puts recipe ticket on conveyor; MAR latches shelf address.'
                    : 'Program counter places address onto W-bus; MAR latches address bits.'}
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isBalatro
                    ? 'bg-[#181d26] border-[#2f3847]'
                    : isPurble
                    ? 'bg-[#58063f]/30 border-[#912e73]'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300">T2: Increment State</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded">[Cp]</span>
                </div>
                <p className="opacity-80 text-[11px] leading-relaxed font-sans">
                  {isBalatro
                    ? 'Card pointer advances PC = PC + 1. Felt bus resets to high-Z.'
                    : isPurble
                    ? 'Ticket counter advances PC = PC + 1. Conveyor motor resets.'
                    : 'Program counter increments by 1. Bus returns to high-impedance.'}
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isBalatro
                    ? 'bg-[#181d26] border-[#2f3847]'
                    : isPurble
                    ? 'bg-[#58063f]/30 border-[#912e73]'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300">T3: Memory State</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded">[CE, Li]</span>
                </div>
                <p className="opacity-80 text-[11px] leading-relaxed font-sans">
                  {isBalatro
                    ? 'RAM card deals instruction onto felt; Instruction Register latches Joker rule.'
                    : isPurble
                    ? 'RAM jar placed on conveyor; Baker IR loads the recipe instruction.'
                    : 'RAM outputs 8-bit instruction word; Instruction Register latches opcode & operand.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Target Calculation Verification */}
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Malvino Benchmark Math Verification</span>
            </h3>

            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                isBalatro
                  ? 'bg-[#181d26] border-[#2f3847]'
                  : isPurble
                  ? 'bg-[#58063f]/30 border-[#912e73]'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <p className="leading-relaxed">
                The standard Malvino SAP-1 benchmark computes:
                <br />
                <strong className="text-amber-300 font-mono">
                  25H (37) + 05H (5) - 23H (35) = 07H (7)
                </strong>
                .
                <br />
                When execution completes and the HLT instruction is reached, the Output Register
                latches <strong className="text-emerald-400 font-mono">07H</strong> and illuminates
                the lowest 3 bits (<strong className="font-mono">0000 0111</strong>).
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 px-6 border-t-2 flex items-center justify-between flex-wrap gap-3 ${
            isBalatro
              ? 'bg-[#181d26] border-[#2f3847]'
              : isPurble
              ? 'bg-[#58063f]/60 border-[#912e73]'
              : 'bg-slate-900 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-xs opacity-75 font-mono">
            <Info className="w-3.5 h-3.5" />
            <span>Viewing {THEME_CONFIGS[activeTheme].name} Mode</span>
          </div>

          <button
            onClick={onClose}
            className={`px-5 py-2 text-xs font-black rounded-xl border-2 transition-all shadow-md cursor-pointer ${
              isBalatro
                ? 'bg-gradient-to-b from-[#e84118] to-[#c0392b] text-white border-[#fbc531]'
                : isPurble
                ? 'bg-gradient-to-r from-[#912e73] to-[#c56eab] text-white border-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400'
            }`}
          >
            {isBalatro
              ? 'Back to Poker Table'
              : isPurble
              ? 'Back to Bakery'
              : 'Back to Lab Console'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MalvinoGuideModal;
