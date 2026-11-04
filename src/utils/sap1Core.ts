import {
  ControlSignals,
  CpuFlags,
  CpuState,
  MemoryEntry,
  SampleProgramPreset,
  TraceStep,
  TState,
} from '../types/sap1';

// Number Formatting Helpers
export const toHex4 = (n: number): string =>
  (n & 0x0f).toString(16).toUpperCase();

export const toHex8 = (n: number): string =>
  (n & 0xff).toString(16).toUpperCase().padStart(2, '0') + 'H';

export const toHexByte = (n: number): string =>
  (n & 0xff).toString(16).toUpperCase().padStart(2, '0');

export const toBin4 = (n: number): string =>
  (n & 0x0f).toString(2).padStart(4, '0');

export const toBin8 = (n: number): string => {
  const b = (n & 0xff).toString(2).padStart(8, '0');
  return `${b.slice(0, 4)} ${b.slice(4, 8)}`;
};

export const toBin8Compact = (n: number): string =>
  (n & 0xff).toString(2).padStart(8, '0');

export const toSignedDec = (n: number): number => {
  const byte = n & 0xff;
  return byte > 127 ? byte - 256 : byte;
};

// Initial default control signals
export const defaultControlSignals: ControlSignals = {
  Cp: false,
  Ep: false,
  Lm: false,
  CE: false,
  Li: false,
  Ei: false,
  La: false,
  Ea: false,
  Su: false,
  Eu: false,
  Lb: false,
  Lo: false,
};

// Control line keys order for Malvino's 12-bit CON Word:
// Cp Ep Lm CE Li Ei La Ea Su Eu Lb Lo
export const CONTROL_KEYS: (keyof ControlSignals)[] = [
  'Cp',
  'Ep',
  'Lm',
  'CE',
  'Li',
  'Ei',
  'La',
  'Ea',
  'Su',
  'Eu',
  'Lb',
  'Lo',
];

/**
 * Returns formatted 12-bit CON word in binary and hex.
 * In classic TTL logic, signals like ~Lm, ~CE, ~Li, ~La, ~Lb, ~Lo are active-low (0 when active).
 * Logical mode treats active signals as 1 for visual clarity.
 */
export const formatConWord = (
  signals: ControlSignals,
  mode: 'logical' | 'active_low' = 'logical'
): { binary: string; hex: string } => {
  const bits = CONTROL_KEYS.map((k) => {
    const isActive = signals[k];
    if (mode === 'logical') {
      return isActive ? '1' : '0';
    } else {
      // Malvino TTL active-low signals
      const isActiveLow = ['Lm', 'CE', 'Li', 'La', 'Lb', 'Lo'].includes(k);
      if (isActiveLow) {
        return isActive ? '0' : '1';
      }
      return isActive ? '1' : '0';
    }
  });

  const binStr = bits.join('');
  const num = parseInt(binStr, 2);
  const hex = num.toString(16).toUpperCase().padStart(3, '0') + 'H';
  const formattedBin = `${binStr.slice(0, 4)} ${binStr.slice(4, 8)} ${binStr.slice(8, 12)}`;
  return { binary: formattedBin, hex };
};

// Disassembler: Decode 8-bit byte into SAP-1 Mnemonic
export const decodeByte = (byte: number): { mnemonic: string; isInstruction: boolean } => {
  const opcode = (byte >> 4) & 0x0f;
  const operand = byte & 0x0f;
  const operandHex = toHex4(operand) + 'H';

  switch (opcode) {
    case 0x0:
      return { mnemonic: `LDA ${operandHex}`, isInstruction: true };
    case 0x1:
      return { mnemonic: `ADD ${operandHex}`, isInstruction: true };
    case 0x2:
      return { mnemonic: `SUB ${operandHex}`, isInstruction: true };
    case 0x3:
      // Extended SAP-2 JMP instruction
      return { mnemonic: `JMP ${operandHex}`, isInstruction: true };
    case 0x5:
      return { mnemonic: 'NOP', isInstruction: true };
    case 0xe:
      return { mnemonic: 'OUT', isInstruction: true };
    case 0xf:
      return { mnemonic: 'HLT', isInstruction: true };
    default:
      return { mnemonic: `${toHexByte(byte)}H`, isInstruction: false };
  }
};

// Assembler: Convert string mnemonic/hex to 8-bit byte
export const assembleLine = (input: string): { byte: number; valid: boolean; error?: string } => {
  const text = input.trim().toUpperCase();
  if (!text) return { byte: 0, valid: true };

  // Check simple instructions without operand
  if (text === 'OUT') return { byte: 0xe0, valid: true };
  if (text === 'HLT') return { byte: 0xff, valid: true };
  if (text === 'NOP') return { byte: 0x50, valid: true };

  // Match LDA, ADD, SUB, JMP with operand (e.g. LDA 9H, ADD 0AH, SUB B, LDA 9)
  const instrMatch = text.match(/^(LDA|ADD|SUB|JMP)\s+([0-9A-F]{1,2})H?$/i);
  if (instrMatch) {
    const [, op, operandStr] = instrMatch;
    const operand = parseInt(operandStr, 16);
    if (isNaN(operand) || operand < 0 || operand > 15) {
      return { byte: 0, valid: false, error: 'Operand must be 0H to FH (0 to 15)' };
    }
    let opcode = 0;
    if (op === 'LDA') opcode = 0x0;
    else if (op === 'ADD') opcode = 0x1;
    else if (op === 'SUB') opcode = 0x2;
    else if (op === 'JMP') opcode = 0x3;
    return { byte: (opcode << 4) | operand, valid: true };
  }

  // Check pure hex byte (e.g., "25H" or "25")
  const hexMatch = text.match(/^([0-9A-F]{1,2})H?$/i);
  if (hexMatch) {
    const val = parseInt(hexMatch[1], 16);
    if (!isNaN(val) && val >= 0 && val <= 255) {
      return { byte: val, valid: true };
    }
  }

  // Check pure binary (e.g. "0010 0101" or "00100101")
  const cleanBin = text.replace(/\s+/g, '');
  if (/^[01]{1,8}$/.test(cleanBin)) {
    const val = parseInt(cleanBin, 2);
    return { byte: val, valid: true };
  }

  return { byte: 0, valid: false, error: 'Unrecognized instruction or hex format' };
};

// Initial CPU State
export const createInitialCpuState = (): CpuState => ({
  pc: 0,
  mar: 0,
  ir: 0,
  a: 0,
  b: 0,
  out: 0,
  wBus: 0,
  busActive: false,
  busDriver: 'NONE',
  busReceiver: 'NONE',
  tState: 'T1',
  isHalted: false,
  flags: { carry: false, zero: true },
  controlSignals: { ...defaultControlSignals },
  cycleCount: 0,
  instructionCount: 0,
});

/**
 * Malvino Standard Sample Program Preset
 * 0H: LDA 9H (09H)
 * 1H: ADD AH (1AH)
 * 2H: SUB BH (2BH)
 * 3H: OUT    (EFH)
 * 4H: HLT    (FFH)
 * 9H: 25H (37 decimal)
 * AH: 05H (5 decimal)
 * BH: 23H (35 decimal)
 * Expected Output: 25H + 05H - 23H = 2AH - 23H = 07H (7)
 */
export const SAMPLE_PROGRAM_PRESETS: SampleProgramPreset[] = [
  {
    id: 'malvino_standard',
    name: 'Malvino Math: (9H) + (AH) - (BH)',
    description: 'Standard textbook program: Loads 25H, adds 05H, subtracts 23H, and displays 07H on LEDs.',
    dataInputs: [
      { addr: 0x9, label: 'Data Address 9H', defaultValue: 0x25 },
      { addr: 0xa, label: 'Data Address AH', defaultValue: 0x05 },
      { addr: 0xb, label: 'Data Address BH', defaultValue: 0x23 },
    ],
    memory: [
      0x09, // 0H: LDA 9H
      0x1a, // 1H: ADD AH
      0x2b, // 2H: SUB BH
      0xef, // 3H: OUT
      0xff, // 4H: HLT
      0x00, // 5H
      0x00, // 6H
      0x00, // 7H
      0x00, // 8H
      0x25, // 9H: 37 (25H)
      0x05, // AH: 5  (05H)
      0x23, // BH: 35 (23H)
      0x00, // CH
      0x00, // DH
      0x00, // EH
      0x00, // FH
    ],
  },
  {
    id: 'multi_adder',
    name: 'Three-Number Accumulator',
    description: 'Computes sum of three numbers: 12H + 34H + 56H = 9CH (156 decimal).',
    dataInputs: [
      { addr: 0x9, label: 'Value A (9H)', defaultValue: 0x12 },
      { addr: 0xa, label: 'Value B (AH)', defaultValue: 0x34 },
      { addr: 0xb, label: 'Value C (BH)', defaultValue: 0x56 },
    ],
    memory: [
      0x09, // 0H: LDA 9H
      0x1a, // 1H: ADD AH
      0x1b, // 2H: ADD BH
      0xef, // 3H: OUT
      0xff, // 4H: HLT
      0x00, // 5H
      0x00, // 6H
      0x00, // 7H
      0x00, // 8H
      0x12, // 9H: 18
      0x34, // AH: 52
      0x56, // BH: 86
      0x00, // CH
      0x00, // DH
      0x00, // EH
      0x00, // FH
    ],
  },
  {
    id: 'underflow_twos_comp',
    name: "Two's Complement Negative Result",
    description: 'Subtracts larger number from smaller: 10H - 25H = -21 (EBH, 235 unsigned). Tests carry/borrow flags.',
    dataInputs: [
      { addr: 0x9, label: 'Minuend (9H)', defaultValue: 0x10 },
      { addr: 0xa, label: 'Subtrahend (AH)', defaultValue: 0x25 },
    ],
    memory: [
      0x09, // 0H: LDA 9H
      0x2a, // 1H: SUB AH
      0xef, // 2H: OUT
      0xff, // 3H: HLT
      0x00, // 4H
      0x00, // 5H
      0x00, // 6H
      0x00, // 7H
      0x00, // 8H
      0x10, // 9H: 16 (10H)
      0x25, // AH: 37 (25H)
      0x00, // BH
      0x00, // CH
      0x00, // DH
      0x00, // EH
      0x00, // FH
    ],
  },
  {
    id: 'load_and_display',
    name: 'Direct Load & Output',
    description: 'Simple demonstration loading FFH (all 8 LEDs ON) and outputting.',
    dataInputs: [
      { addr: 0x9, label: 'Display Byte (9H)', defaultValue: 0xff },
    ],
    memory: [
      0x09, // 0H: LDA 9H
      0xef, // 1H: OUT
      0xff, // 2H: HLT
      0x00, // 3H
      0x00, // 4H
      0x00, // 5H
      0x00, // 6H
      0x00, // 7H
      0x00, // 8H
      0xff, // 9H: 255 (FFH)
      0x00, // AH
      0x00, // BH
      0x00, // CH
      0x00, // DH
      0x00, // EH
      0x00, // FH
    ],
  },
];

/**
 * Creates MemoryEntry objects from a raw 16-byte array.
 */
export const buildMemoryEntries = (rawBytes: number[]): MemoryEntry[] => {
  return Array.from({ length: 16 }, (_, i) => {
    const val = (rawBytes[i] ?? 0) & 0xff;
    const opcode = (val >> 4) & 0x0f;
    const operand = val & 0x0f;
    const { mnemonic, isInstruction } = decodeByte(val);
    const isData = !isInstruction || i >= 8;

    return {
      address: i,
      value: val,
      mnemonic: isData ? `${toHexByte(val)}H` : mnemonic,
      opcode,
      operand,
      isData,
      description: isData
        ? `Data: ${val} (Dec)`
        : mnemonic.startsWith('LDA')
        ? `Load RAM[${toHex4(operand)}H] into Accumulator`
        : mnemonic.startsWith('ADD')
        ? `Add RAM[${toHex4(operand)}H] to Accumulator`
        : mnemonic.startsWith('SUB')
        ? `Subtract RAM[${toHex4(operand)}H] from Accumulator`
        : mnemonic.startsWith('OUT')
        ? 'Transfer Accumulator to Output Display'
        : mnemonic.startsWith('HLT')
        ? 'Halt Clock Generator'
        : 'Instruction',
    };
  });
};

/**
 * Executes a single clock pulse (one T-state) in the SAP-1 architecture.
 * Implements Albert Malvino's exact 6-state ring counter micro-operations.
 */
export const stepClock = (
  state: CpuState,
  memory: number[]
): { nextState: CpuState; traceStep: TraceStep } => {
  if (state.isHalted) {
    const dummyTrace: TraceStep = {
      id: Date.now(),
      tState: state.tState,
      instructionName: 'HLT',
      pc: state.pc,
      mar: state.mar,
      ir: state.ir,
      a: state.a,
      b: state.b,
      out: state.out,
      wBus: state.wBus,
      busDriver: 'NONE',
      busReceiver: 'NONE',
      activeSignals: [],
      description: 'System is HALTED. Reset to run again.',
      conWord: '0000 0000 0000',
    };
    return { nextState: state, traceStep: dummyTrace };
  }

  // Clone current state
  const next: CpuState = {
    ...state,
    controlSignals: { ...defaultControlSignals },
    cycleCount: state.cycleCount + 1,
  };

  const opcode = (next.ir >> 4) & 0x0f;
  const operand = next.ir & 0x0f;
  const { mnemonic: currMnemonic } = decodeByte(next.ir);

  let activeSignalsList: string[] = [];
  let description = '';

  // Determine T-State transitions and micro-operations
  switch (next.tState) {
    case 'T1': {
      // T1 (Address State): Ep, Lm (PC -> MAR)
      next.controlSignals.Ep = true;
      next.controlSignals.Lm = true;
      next.wBus = next.pc & 0x0f;
      next.mar = next.pc & 0x0f;
      next.busActive = true;
      next.busDriver = 'PC';
      next.busReceiver = 'MAR';

      activeSignalsList = ['Ep', 'Lm'];
      description = `T1 (Address State): PC (${toHex4(next.pc)}H) placed on W-Bus [Ep] and loaded into MAR [Lm].`;
      next.tState = 'T2';
      break;
    }

    case 'T2': {
      // T2 (Increment State): Cp (PC = PC + 1)
      next.controlSignals.Cp = true;
      next.pc = (next.pc + 1) & 0x0f;
      next.busActive = false;
      next.busDriver = 'NONE';
      next.busReceiver = 'NONE';

      activeSignalsList = ['Cp'];
      description = `T2 (Increment State): Program Counter increments to ${toHex4(next.pc)}H [Cp]. Bus idle.`;
      next.tState = 'T3';
      break;
    }

    case 'T3': {
      // T3 (Memory State): CE, Li (RAM[MAR] -> IR)
      next.controlSignals.CE = true;
      next.controlSignals.Li = true;
      const memVal = (memory[next.mar] ?? 0) & 0xff;
      next.wBus = memVal;
      next.ir = memVal;
      next.busActive = true;
      next.busDriver = 'RAM';
      next.busReceiver = 'IR';

      const decoded = decodeByte(memVal);
      activeSignalsList = ['CE', 'Li'];
      description = `T3 (Memory State): RAM[${toHex4(next.mar)}H] = ${toHexByte(memVal)}H loaded into IR [CE, Li] (${decoded.mnemonic}).`;
      next.tState = 'T4';
      break;
    }

    case 'T4': {
      // Execution Phase Begins
      switch (opcode) {
        case 0x0: // LDA: Ei, Lm
        case 0x1: // ADD: Ei, Lm
        case 0x2: {
          // SUB: Ei, Lm
          next.controlSignals.Ei = true;
          next.controlSignals.Lm = true;
          next.wBus = operand;
          next.mar = operand;
          next.busActive = true;
          next.busDriver = 'IR';
          next.busReceiver = 'MAR';

          activeSignalsList = ['Ei', 'Lm'];
          description = `T4 (${currMnemonic}): IR operand (${toHex4(operand)}H) placed on W-Bus [Ei] and latched into MAR [Lm].`;
          next.tState = 'T5';
          break;
        }

        case 0x3: {
          // JMP: Ei, Cp (extended SAP: PC = operand)
          next.controlSignals.Ei = true;
          next.wBus = operand;
          next.pc = operand;
          next.busActive = true;
          next.busDriver = 'IR';
          next.busReceiver = 'NONE';

          activeSignalsList = ['Ei'];
          description = `T4 (JMP ${toHex4(operand)}H): Jump target address ${toHex4(operand)}H loaded into PC.`;
          next.tState = 'T5';
          break;
        }

        case 0xe: {
          // OUT: Ea, Lo (A -> Out)
          next.controlSignals.Ea = true;
          next.controlSignals.Lo = true;
          next.wBus = next.a;
          next.out = next.a;
          next.busActive = true;
          next.busDriver = 'ACC';
          next.busReceiver = 'OUT';

          activeSignalsList = ['Ea', 'Lo'];
          description = `T4 (OUT): Accumulator (${toHexByte(next.a)}H = ${next.a}) placed on W-Bus [Ea] and latched into Output Register [Lo].`;
          next.tState = 'T5';
          break;
        }

        case 0xf: {
          // HLT: Stops clock
          next.isHalted = true;
          next.busActive = false;
          next.busDriver = 'NONE';
          next.busReceiver = 'NONE';

          activeSignalsList = ['HLT'];
          description = `T4 (HLT): Halting clock generator. CPU state preserved.`;
          next.tState = 'T4'; // stay at T4 when halted
          break;
        }

        default: {
          // NOP or unrecognized opcode
          next.busActive = false;
          next.busDriver = 'NONE';
          next.busReceiver = 'NONE';
          description = `T4 (NOP): No operation.`;
          next.tState = 'T5';
          break;
        }
      }
      break;
    }

    case 'T5': {
      switch (opcode) {
        case 0x0: {
          // LDA: CE, La (RAM[MAR] -> Accumulator)
          next.controlSignals.CE = true;
          next.controlSignals.La = true;
          const memVal = (memory[next.mar] ?? 0) & 0xff;
          next.wBus = memVal;
          next.a = memVal;
          next.busActive = true;
          next.busDriver = 'RAM';
          next.busReceiver = 'ACC';

          // Update flags based on Accumulator
          next.flags.zero = next.a === 0;
          activeSignalsList = ['CE', 'La'];
          description = `T5 (LDA): RAM[${toHex4(next.mar)}H] = ${toHexByte(memVal)}H placed on W-Bus [CE] and loaded into Accumulator [La].`;
          next.tState = 'T6';
          break;
        }

        case 0x1: // ADD: CE, Lb (RAM[MAR] -> B Register)
        case 0x2: {
          // SUB: CE, Lb (RAM[MAR] -> B Register)
          next.controlSignals.CE = true;
          next.controlSignals.Lb = true;
          const memVal = (memory[next.mar] ?? 0) & 0xff;
          next.wBus = memVal;
          next.b = memVal;
          next.busActive = true;
          next.busDriver = 'RAM';
          next.busReceiver = 'B_REG';

          activeSignalsList = ['CE', 'Lb'];
          description = `T5 (${currMnemonic}): RAM[${toHex4(next.mar)}H] = ${toHexByte(memVal)}H loaded into B Register [CE, Lb].`;
          next.tState = 'T6';
          break;
        }

        case 0xe:
        default: {
          // OUT / NOP / JMP: T5 is NOP
          next.busActive = false;
          next.busDriver = 'NONE';
          next.busReceiver = 'NONE';
          description = `T5 (${currMnemonic}): NOP (No operation for this instruction in T5).`;
          next.tState = 'T6';
          break;
        }
      }
      break;
    }

    case 'T6': {
      switch (opcode) {
        case 0x1: {
          // ADD: Eu, La (ALU Sum -> Accumulator, Su=0)
          next.controlSignals.Eu = true;
          next.controlSignals.La = true;
          next.controlSignals.Su = false;

          const rawSum = next.a + next.b;
          const sum8 = rawSum & 0xff;
          next.wBus = sum8;
          next.a = sum8;
          next.busActive = true;
          next.busDriver = 'ALU';
          next.busReceiver = 'ACC';

          // Update ALU flags
          next.flags.carry = rawSum > 255;
          next.flags.zero = sum8 === 0;

          activeSignalsList = ['Eu', 'La'];
          description = `T6 (ADD): Adder/Subtractor sum (${toHexByte(sum8)}H) placed on W-Bus [Eu] and loaded into Accumulator [La]. Carry=${next.flags.carry ? '1' : '0'}.`;
          next.instructionCount += 1;
          next.tState = 'T1';
          break;
        }

        case 0x2: {
          // SUB: Su, Eu, La (ALU Diff -> Accumulator, Su=1)
          next.controlSignals.Su = true;
          next.controlSignals.Eu = true;
          next.controlSignals.La = true;

          const rawDiff = next.a - next.b;
          const diff8 = (rawDiff + 256) & 0xff;
          next.wBus = diff8;
          next.a = diff8;
          next.busActive = true;
          next.busDriver = 'ALU';
          next.busReceiver = 'ACC';

          // Carry flag for subtraction in 8-bit ALU: carry is 1 if A >= B (no borrow)
          next.flags.carry = next.a >= next.b;
          next.flags.zero = diff8 === 0;

          activeSignalsList = ['Su', 'Eu', 'La'];
          description = `T6 (SUB): Adder/Subtractor difference (${toHexByte(diff8)}H) placed on W-Bus [Su, Eu] and loaded into Accumulator [La].`;
          next.instructionCount += 1;
          next.tState = 'T1';
          break;
        }

        case 0x0: // LDA: T6 is NOP
        case 0xe: // OUT: T6 is NOP
        default: {
          next.busActive = false;
          next.busDriver = 'NONE';
          next.busReceiver = 'NONE';
          description = `T6 (${currMnemonic}): NOP. Instruction complete; resetting ring counter to T1.`;
          next.instructionCount += 1;
          next.tState = 'T1';
          break;
        }
      }
      break;
    }
  }

  const { binary: conWord } = formatConWord(next.controlSignals);

  const traceStep: TraceStep = {
    id: Date.now() + Math.random(),
    tState: state.tState,
    instructionName: currMnemonic,
    pc: next.pc,
    mar: next.mar,
    ir: next.ir,
    a: next.a,
    b: next.b,
    out: next.out,
    wBus: next.wBus,
    busDriver: next.busDriver,
    busReceiver: next.busReceiver,
    activeSignals: activeSignalsList,
    description,
    conWord,
  };

  return { nextState: next, traceStep };
};

/**
 * Executes one complete instruction (advances through T-states until T6 completes or CPU halts).
 */
export const stepInstruction = (
  state: CpuState,
  memory: number[]
): { nextState: CpuState; steps: TraceStep[] } => {
  let curr = state;
  const steps: TraceStep[] = [];
  let safety = 12; // At most 12 T-states to finish current instruction

  while (!curr.isHalted && safety > 0) {
    const { nextState, traceStep } = stepClock(curr, memory);
    steps.push(traceStep);
    curr = nextState;
    safety--;

    // If we just completed T6 and wrapped to T1, instruction is finished!
    if (curr.tState === 'T1' || curr.isHalted) {
      break;
    }
  }

  return { nextState: curr, steps };
};

/**
 * Computes live ALU output based on registers A and B.
 */
export const computeAluResult = (a: number, b: number, su: boolean): { result: number; carry: boolean; zero: boolean } => {
  const byteA = a & 0xff;
  const byteB = b & 0xff;

  if (su) {
    // Subtraction
    const rawDiff = byteA - byteB;
    const diff8 = (rawDiff + 256) & 0xff;
    return {
      result: diff8,
      carry: byteA >= byteB,
      zero: diff8 === 0,
    };
  } else {
    // Addition
    const rawSum = byteA + byteB;
    const sum8 = rawSum & 0xff;
    return {
      result: sum8,
      carry: rawSum > 255,
      zero: sum8 === 0,
    };
  }
};
