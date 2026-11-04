import React, { useState } from 'react';
import {
  HardDrive,
  Edit2,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sliders,
  Cake,
} from 'lucide-react';
import { MemoryEntry, SampleProgramPreset } from '../types/sap1';
import {
  assembleLine,
  SAMPLE_PROGRAM_PRESETS,
  toBin4,
  toBin8,
  toHex4,
  toHexByte,
} from '../utils/sap1Core';

interface RamTableProps {
  memoryEntries: MemoryEntry[];
  memory: number[];
  currentMar: number;
  currentPc: number;
  onUpdateMemoryCell: (address: number, byteVal: number) => void;
  onLoadPreset: (preset: SampleProgramPreset) => void;
  onReset: () => void;
  dataInputs: {
    addr9: number;
    addrA: number;
    addrB: number;
  };
  onUpdateDataInput: (addr: 0x9 | 0xa | 0xb, val: number) => void;
}

export const RamTable: React.FC<RamTableProps> = ({
  memoryEntries,
  memory,
  currentMar,
  currentPc,
  onUpdateMemoryCell,
  onLoadPreset,
  onReset,
  dataInputs,
  onUpdateDataInput,
}) => {
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);

  const startEditing = (entry: MemoryEntry) => {
    setEditingAddress(entry.address);
    setEditValue(entry.isData ? toHexByte(entry.value) : entry.mnemonic);
    setEditError(null);
  };

  const handleSaveEdit = (address: number) => {
    const result = assembleLine(editValue);
    if (!result.valid) {
      setEditError(result.error || 'Invalid instruction or byte');
      return;
    }
    onUpdateMemoryCell(address, result.byte);
    setEditingAddress(null);
    setEditError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, address: number) => {
    if (e.key === 'Enter') {
      handleSaveEdit(address);
    } else if (e.key === 'Escape') {
      setEditingAddress(null);
      setEditError(null);
    }
  };

  return (
    <div className="bg-[#bde5f3] border-4 border-[#86c5dc] rounded-2xl p-4 sm:p-5 shadow-xl text-[#2c1b3d] flex flex-col gap-4">
      {/* Table Header & Recipe Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#86c5dc]">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#58063f]" />
          <h3 className="text-sm font-black text-[#58063f] uppercase tracking-wider font-sans">
            Recipe Storeroom (16 × 8 RAM)
          </h3>
          <span className="text-xs text-slate-600 font-mono">
            Pantry Shelves 0H to FH (16 Jars)
          </span>
        </div>

        {/* Preset Select & Action */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              onLoadPreset(SAMPLE_PROGRAM_PRESETS[0]);
              onReset();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] text-white shadow transition-all active:scale-95 border-2 border-white cursor-pointer"
            title="Load the standard Purble Place Cake Recipe: 25H + 05H - 23H = 07H"
          >
            <Cake className="w-3.5 h-3.5 fill-current" />
            <span>Load Malvino Recipe</span>
          </button>

          <select
            onChange={(e) => {
              const preset = SAMPLE_PROGRAM_PRESETS.find((p) => p.id === e.target.value);
              if (preset) {
                onLoadPreset(preset);
                onReset();
              }
            }}
            className="bg-white border-2 border-[#86c5dc] text-[#58063f] text-xs font-bold rounded-xl px-2.5 py-1.5 font-sans focus:outline-none focus:border-[#58063f]"
            defaultValue="malvino_standard"
            aria-label="Preset Program Selector"
          >
            {SAMPLE_PROGRAM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Editable Ingredient Quantities (9H, AH, BH) */}
      <div className="bg-white/90 border border-[#86c5dc] rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#58063f]">
            <Sliders className="w-3.5 h-3.5 text-[#912e73]" />
            <span>Pantry Ingredient Jars (Shelves 9H, AH, BH)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Default: 25H (37g) + 05H (5g) - 23H (35g) = 07H (7g)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Address 9H */}
          <div className="bg-[#fffcf2] border border-[#e2be75] rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#58063f] font-bold">
                SHELF 9H (Sponge)
              </div>
              <div className="text-xs text-slate-600">Grams: {dataInputs.addr9}g</div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={toHexByte(dataInputs.addr9)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 16);
                  if (!isNaN(val) && val >= 0 && val <= 255) {
                    onUpdateDataInput(0x9, val);
                  }
                }}
                className="w-14 bg-white border border-[#caa052] text-[#58063f] font-mono font-bold text-center text-xs px-1.5 py-1 rounded-lg focus:border-[#58063f] focus:outline-none"
                title="Hex value for memory address 9H"
                aria-label="Memory address 9H hex value"
              />
              <span className="text-xs font-mono text-slate-500">H</span>
            </div>
          </div>

          {/* Address AH */}
          <div className="bg-[#fffcf2] border border-[#e2be75] rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#2f855a] font-bold">
                SHELF AH (Cream)
              </div>
              <div className="text-xs text-slate-600">Grams: {dataInputs.addrA}g</div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={toHexByte(dataInputs.addrA)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 16);
                  if (!isNaN(val) && val >= 0 && val <= 255) {
                    onUpdateDataInput(0xa, val);
                  }
                }}
                className="w-14 bg-white border border-[#caa052] text-[#2f855a] font-mono font-bold text-center text-xs px-1.5 py-1 rounded-lg focus:border-[#2f855a] focus:outline-none"
                title="Hex value for memory address AH"
                aria-label="Memory address AH hex value"
              />
              <span className="text-xs font-mono text-slate-500">H</span>
            </div>
          </div>

          {/* Address BH */}
          <div className="bg-[#fffcf2] border border-[#e2be75] rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#e6194b] font-bold">
                SHELF BH (Trim)
              </div>
              <div className="text-xs text-slate-600">Grams: {dataInputs.addrB}g</div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={toHexByte(dataInputs.addrB)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 16);
                  if (!isNaN(val) && val >= 0 && val <= 255) {
                    onUpdateDataInput(0xb, val);
                  }
                }}
                className="w-14 bg-white border border-[#caa052] text-[#e6194b] font-mono font-bold text-center text-xs px-1.5 py-1 rounded-lg focus:border-[#e6194b] focus:outline-none"
                title="Hex value for memory address BH"
                aria-label="Memory address BH hex value"
              />
              <span className="text-xs font-mono text-slate-500">H</span>
            </div>
          </div>
        </div>
      </div>

      {/* 16-Row Table */}
      <div className="border-2 border-[#86c5dc] rounded-xl overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-[#d2ecf7] text-[#58063f] border-b border-[#86c5dc] uppercase tracking-wider text-[11px] font-black">
              <th className="py-2 px-3">Shelf</th>
              <th className="py-2 px-3">Binary</th>
              <th className="py-2 px-3">Hex</th>
              <th className="py-2 px-3">8-Bit Binary</th>
              <th className="py-2 px-3">Directive</th>
              <th className="py-2 px-3 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {memoryEntries.map((entry) => {
              const isMarTarget = currentMar === entry.address;
              const isPcTarget = currentPc === entry.address;
              const isEditing = editingAddress === entry.address;

              return (
                <tr
                  key={entry.address}
                  className={`transition-colors ${
                    isMarTarget
                      ? 'bg-[#ffebee] border-l-4 border-[#e6194b] font-bold text-[#e6194b]'
                      : isPcTarget
                      ? 'bg-[#e0f7fa] text-[#006064]'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {/* Address */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{toHex4(entry.address)}H</span>
                      {isMarTarget && (
                        <span className="text-[9px] bg-[#e6194b] text-white px-1.5 py-0.2 rounded font-sans font-bold">
                          MAR
                        </span>
                      )}
                      {isPcTarget && !isMarTarget && (
                        <span className="text-[9px] bg-[#00acc1] text-white px-1.5 py-0.2 rounded font-sans font-bold">
                          PC
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Binary Addr */}
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {toBin4(entry.address)}
                  </td>

                  {/* Hex Value */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, entry.address)}
                          placeholder="e.g. LDA 9H"
                          className="bg-white border-2 border-[#58063f] text-[#58063f] px-2 py-0.5 rounded text-xs w-28 focus:outline-none"
                          autoFocus
                          aria-label={`Edit value for address ${toHex4(entry.address)}H`}
                        />
                        <button
                          onClick={() => handleSaveEdit(entry.address)}
                          className="p-1 rounded bg-[#58063f] text-white"
                          title="Save"
                          aria-label="Save RAM edit"
                        >
                          <Check className="w-3 h-3 font-bold" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-bold text-[#58063f]">
                        {toHexByte(entry.value)}H
                      </span>
                    )}
                    {isEditing && editError && (
                      <div className="text-[10px] text-red-600 font-sans mt-0.5">
                        {editError}
                      </div>
                    )}
                  </td>

                  {/* Binary Value */}
                  <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                    {toBin8(entry.value)}
                  </td>

                  {/* Decoded Mnemonic */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        entry.isData
                          ? 'text-slate-600 bg-slate-100'
                          : 'text-[#58063f] bg-[#fff4d4] border border-[#f6d186] font-bold'
                      }`}
                    >
                      {entry.mnemonic}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-3 text-right whitespace-nowrap">
                    {isEditing ? (
                      <button
                        onClick={() => setEditingAddress(null)}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(entry)}
                        className="p-1 rounded text-slate-500 hover:text-[#58063f] hover:bg-slate-100 transition-colors"
                        title="Edit cell"
                        aria-label={`Edit address ${toHex4(entry.address)}H`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
