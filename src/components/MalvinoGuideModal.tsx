import React from 'react';
import { X, BookOpen, Cake, Layers, HardDrive, CheckCircle2, Sparkles } from 'lucide-react';

interface MalvinoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MalvinoGuideModal: React.FC<MalvinoGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0009]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d0009] border-2 border-[#912e73] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b-2 border-[#912e73] bg-[#58063f]/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#912e73] text-[#f9d9ef] border border-[#c56eab]">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#f9d9ef] font-sans">
                Purble Place · Comfy Cakes & SAP-1 Architecture
              </h2>
              <p className="text-xs text-[#c56eab]">
                Mapping Albert Malvino's SAP-1 breadboard computer to the classic Windows cake bakery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#c56eab] hover:text-[#f9d9ef] hover:bg-[#58063f] transition-colors"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#f9d9ef] leading-relaxed">
          {/* Section 1: The Conveyor Belt & W-Bus */}
          <div>
            <h3 className="text-sm font-extrabold text-[#f9d9ef] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c56eab]" />
              1. The Conveyor Belt as the Central W-Bus
            </h3>
            <p className="text-[#c56eab] text-xs sm:text-sm">
              In Microsoft's <em>Purble Place: Comfy Cakes</em>, a motorized conveyor belt carries a cake pan
              past multiple preparation stations. In computer engineering, this is identical to the{' '}
              <strong className="text-[#f9d9ef]">Central W-Bus (8-Bit Common Bus)</strong> in Albert Malvino's
              classic SAP-1! Just as only one bakery dispenser pours batter or icing onto the belt at a time,
              only one computer register activates its tri-state buffer to drive the W-Bus.
            </p>
          </div>

          {/* Section 2: Mapping Table */}
          <div>
            <h3 className="text-sm font-extrabold text-[#f9d9ef] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              2. Computer Register to Bakery Station Analog
            </h3>
            <div className="border-2 border-[#912e73] rounded-xl overflow-x-auto bg-[#0d0009]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#58063f] text-[#f9d9ef] border-b border-[#912e73]">
                  <tr>
                    <th className="p-2.5">Hardware Module</th>
                    <th className="p-2.5">Signals</th>
                    <th className="p-2.5">Comfy Cakes Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#58063f]/60 text-[#f9d9ef]">
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">Program Counter (PC)</td>
                    <td className="p-2.5 text-[#c56eab]">Cp, Ep</td>
                    <td className="p-2.5">Recipe Order Ticket Tracker (Advances to next step)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">Memory Address (MAR)</td>
                    <td className="p-2.5 text-[#c56eab]">Lm</td>
                    <td className="p-2.5">Pantry Shelf Selector (Points to which ingredient jar to open)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">16×8 RAM Memory</td>
                    <td className="p-2.5 text-[#c56eab]">CE</td>
                    <td className="p-2.5">Ingredient Storeroom (Stores 16 recipe instructions & ingredients)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">Instruction Register (IR)</td>
                    <td className="p-2.5 text-[#c56eab]">Li, Ei</td>
                    <td className="p-2.5">Master Baker Directive Card (Opcode: Action, Operand: Target Shelf)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">Accumulator (A)</td>
                    <td className="p-2.5 text-[#c56eab]">La, Ea</td>
                    <td className="p-2.5">Main Mixing Bowl / Cake Base (Accumulates cake batter and layers)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">Adder/Subtractor (ALU)</td>
                    <td className="p-2.5 text-[#c56eab]">Su, Eu</td>
                    <td className="p-2.5">Frosting Blender & Pastry Knife (Adds cream layers or trims excess)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">B Register</td>
                    <td className="p-2.5 text-[#c56eab]">Lb</td>
                    <td className="p-2.5">Measuring Cup (Holds the ingredient before blending into bowl)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-300">Output Register & LEDs</td>
                    <td className="p-2.5 text-[#c56eab]">Lo</td>
                    <td className="p-2.5">Inspection Stand & Cherry Candlestick Diodes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: The 6 T-States */}
          <div>
            <h3 className="text-sm font-extrabold text-[#f9d9ef] uppercase tracking-wider mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#c56eab]" />
              3. The 6-State Ring Counter Baking Cycle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="bg-[#58063f]/30 p-3 rounded-xl border border-[#912e73]">
                <span className="text-[#f9d9ef] font-bold">T1: Address State</span>
                <p className="text-[#c56eab] mt-1">
                  <strong>Ep, Lm:</strong> Program counter puts recipe ticket on conveyor; MAR latches shelf address.
                </p>
              </div>
              <div className="bg-[#58063f]/30 p-3 rounded-xl border border-[#912e73]">
                <span className="text-[#f9d9ef] font-bold">T2: Increment State</span>
                <p className="text-[#c56eab] mt-1">
                  <strong>Cp:</strong> Ticket counter advances PC = PC + 1. Conveyor motor resets.
                </p>
              </div>
              <div className="bg-[#58063f]/30 p-3 rounded-xl border border-[#912e73]">
                <span className="text-[#f9d9ef] font-bold">T3: Memory State</span>
                <p className="text-[#c56eab] mt-1">
                  <strong>CE, Li:</strong> RAM jar placed on conveyor; Baker IR loads the recipe instruction.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Sample Program */}
          <div>
            <h3 className="text-sm font-extrabold text-[#f9d9ef] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              4. Malvino Gateau Verification
            </h3>
            <p className="text-[#c56eab] text-xs sm:text-sm">
              The default sample recipe prepares:
              <br />
              <strong className="text-[#f9d9ef]">Shelf 9H (25H / 37g sponge base) + Shelf AH (05H / 5g strawberry cream) - Shelf BH (23H / 35g trim) = 07H (7g)</strong>.
              <br />
              When executed, the Output Register latches <strong className="text-amber-300">07H</strong> and illuminates the last 3 cherry candlestick LEDs (<strong className="text-[#f9d9ef]">0000 0111</strong>)!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t-2 border-[#912e73] bg-[#58063f]/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#912e73] to-[#c56eab] hover:opacity-90 text-[#0d0009] transition-all shadow-md"
          >
            Back to Bakery
          </button>
        </div>
      </div>
    </div>
  );
};
