/**
 * SAP-1 (Simple-As-Possible 1) Type Definitions
 * Based on Albert Paul Malvino's Digital Computer Electronics specification.
 */

export type TState = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';

export interface ControlSignals {
  Cp: boolean; // Counter enable (increment PC)
  Ep: boolean; // PC enable to W-bus
  Lm: boolean; // MAR load from W-bus
  CE: boolean; // RAM Chip Enable (RAM output to W-bus)
  Li: boolean; // IR load from W-bus
  Ei: boolean; // IR enable to W-bus (operand bits 3-0)
  La: boolean; // Accumulator load from W-bus
  Ea: boolean; // Accumulator enable to W-bus
  Su: boolean; // ALU subtract mode (0 = ADD, 1 = SUB)
  Eu: boolean; // ALU enable to W-bus
  Lb: boolean; // B-register load from W-bus
  Lo: boolean; // Output register load from W-bus
}

export type BusDriver = 'PC' | 'RAM' | 'IR' | 'ALU' | 'ACC' | 'NONE';
export type BusReceiver = 'MAR' | 'IR' | 'ACC' | 'B_REG' | 'OUT' | 'NONE';

export interface CpuFlags {
  carry: boolean;
  zero: boolean;
}

export interface CpuState {
  pc: number;          // 4-bit Program Counter (0 - 15)
  mar: number;         // 4-bit Memory Address Register (0 - 15)
  ir: number;          // 8-bit Instruction Register (0 - 255)
  a: number;           // 8-bit Accumulator Register (0 - 255)
  b: number;           // 8-bit B Register (0 - 255)
  out: number;         // 8-bit Output Register (0 - 255)
  wBus: number;        // 8-bit W-Bus value (0 - 255)
  busActive: boolean;  // Whether a bus transfer is active this T-state
  busDriver: BusDriver;
  busReceiver: BusReceiver;
  tState: TState;      // Current state in 6-state ring counter
  isHalted: boolean;   // Set to true by HLT instruction
  flags: CpuFlags;
  controlSignals: ControlSignals;
  cycleCount: number;  // Total clock cycles executed
  instructionCount: number; // Completed instructions
}

export interface MemoryEntry {
  address: number;     // 0 - 15 (0H - FH)
  value: number;       // 8-bit byte (0 - 255)
  mnemonic: string;    // Human-readable assembly (e.g., "LDA 9H", "ADD AH", "25H")
  opcode: number;      // High 4 bits (7-4)
  operand: number;     // Low 4 bits (3-0)
  isData: boolean;     // Whether cell is labeled as data or instruction
  description?: string;
}

export interface TraceStep {
  id: number;
  tState: TState;
  instructionName: string;
  pc: number;
  mar: number;
  ir: number;
  a: number;
  b: number;
  out: number;
  wBus: number;
  busDriver: BusDriver;
  busReceiver: BusReceiver;
  activeSignals: string[];
  description: string;
  conWord: string;
}

export interface SampleProgramPreset {
  id: string;
  name: string;
  description: string;
  memory: number[];
  dataInputs?: {
    addr: number;
    label: string;
    defaultValue: number;
  }[];
}
