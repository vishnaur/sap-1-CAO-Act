# SAP-1 (Simple-As-Possible 1) Computer Architecture Simulator by Group 6
1. Dulfo, Ranz Norvin E.
2. Salazar, Rinwell Jake DG.
3. Ignacio, Clint Kelvin H.
4. Bernardo, Albert
5. Pascual, John Exequiel 
6. Negapatan, Kalvin Vishnu M. 

A web-based interactive graphical simulator of Albert Malvino's classic **SAP-1 (Simple-As-Possible 1)**

The simulator runs entirely in a web browser, providing a visual representation of internal registers, the 8-bit common W-Bus, tri-state control signals, the 6-state ring counter, and memory cells using graphical components rather than a text terminal.

---

## I. Framework & Language Justification (Deliverable Requirement)

* **Language**: **TypeScript** (compiled to modern JavaScript)
  * *Justification*: Hardware simulation requires strict bit-width and data boundary management. 
* **Web Framework**: **React 18** with **Vite**
  * *Justification*: React's deterministic, unidirectional data flow mirrors synchronous digital clock pulses. Each clock edge cleanly triggers state transitions across registers, bus latches, and the 6-state ring counter (`T1`–`T6`), allowing real-time reactive visual updates to all register panels and LED diodes simultaneously.
* **Styling**: **Tailwind CSS**
  * *Justification*: Provides utility-first styling for themes (Balatro Casino, Purble Place, and Classic Malvino) with zero runtime CSS overhead and crisp hardware panel layouts.

---

## II. Getting Started & Installation Instructions
** STEPS NEEDED BEFORE RUNNING ^^ **

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (comes with Node.js)

### Installation Steps
1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
5. To build for production:
   ```bash
   npm run build
   ```

---


## III. Supported Instruction Set

The SAP-1 instruction set is fully implemented:

| Instruction | Opcode (Binary) | Opcode (Hex) | Micro-Operation Function |
| :--- | :---: | :---: | :--- |
| **LDA** | `0000` | `0H` | Load Accumulator from memory: |
| **ADD** | `0001` | `1H` | Add memory value to Accumulator: |
| **SUB** | `0010` | `2H` | Subtract memory value from Accumulator (2's complement):|
| **OUT** | `1110` | `EH` | Output Accumulator value to Output Register: |
| **HLT** | `1111` | `FH` | Halt clock execution: disables clock pulses |

---

## IV. Sample Benchmark Program ($25\text{H} + 05\text{H} - 23\text{H} = 07\text{H}$)

The benchmark program is pre-loaded as the default preset:

### Memory Layout
* Address `0H`: `09H` (`0000 1001`) $\rightarrow$ `LDA 9H`
* Address `1H`: `1AH` (`0001 1010`) $\rightarrow$ `ADD AH`
* Address `2H`: `2BH` (`0010 1011`) $\rightarrow$ `SUB BH`
* Address `3H`: `EFH` (`1110 1111`) $\rightarrow$ `OUT`
* Address `4H`: `FFH` (`1111 1111`) $\rightarrow$ `HLT`
* ...
* Address `9H`: `25H` (`0010 0101` = 37 decimal)
* Address `AH`: `05H` (`0000 0101` = 5 decimal)
* Address `BH`: `23H` (`0010 0011` = 35 decimal)

### Execution Trace & Verification
1. **LDA 9H**: Loads Accumulator with $25\text{H}$ ($37$).
2. **ADD AH**: Loads B-Register with $05\text{H}$ ($5$). ALU computes $25\text{H} + 05\text{H} = 2\text{A}\text{H}$ ($42$) and stores into Accumulator.
3. **SUB BH**: Loads B-Register with $23\text{H}$ ($35$). ALU computes $2\text{A}\text{H} - 23\text{H} = 07\text{H}$ ($7$) using 2's complement subtraction.
4. **OUT**: Latches Accumulator ($07\text{H}$) into Output Register.
5. **HLT**: Halts execution.
6. **Expected LED Output**: `0000 0111` ($07\text{H}$, decimal 7).

---
