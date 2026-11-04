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
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { MemoryEntry, SampleProgramPreset } from '../types/sap1';
import { AppTheme } from '../types/theme';
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
  currentTheme?: AppTheme;
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
  currentTheme = 'balatro',
}) => {
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);

  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

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
    <div
      className={`rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 transition-all ${
        isBalatro
          ? 'bg-[#181d26] border-4 border-[#2f3847] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#bde5f3] border-4 border-[#86c5dc] text-[#2c1b3d]'
          : 'bg-[#0f172a] border-4 border-slate-700 text-slate-100'
      }`}
    >
      {/* Table Header & Preset Controls */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 ${
          isBalatro
            ? 'border-[#2f3847]'
            : isPurble
            ? 'border-[#86c5dc]'
            : 'border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          {isBalatro ? (
            <Gamepad2 className="w-4 h-4 text-[#e84118]" />
          ) : isPurble ? (
            <Cake className="w-4 h-4 text-[#58063f]" />
          ) : (
            <HardDrive className="w-4 h-4 text-cyan-400" />
          )}
          <h3
            className={`text-sm font-black uppercase tracking-wider font-sans ${
              isBalatro
                ? 'text-[#f5f6fa]'
                : isPurble
                ? 'text-[#58063f]'
                : 'text-slate-100'
            }`}
          >
            {isBalatro
              ? '16-Card Deck (16 × 8 RAM Table)'
              : isPurble
              ? 'Recipe Storeroom (16 × 8 RAM)'
              : '16 × 8 RAM Memory Table'}
          </h3>
          <span
            className={`text-xs font-mono opacity-70 ${
              isBalatro ? 'text-slate-400' : isPurble ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {isBalatro
              ? 'Card Slots 0H to FH (16 Deck Positions)'
              : isPurble
              ? 'Pantry Shelves 0H to FH (16 Jars)'
              : 'Addresses 0000 to 1111 (16 Bytes)'}
          </span>
        </div>

        {/* Preset Select & Action */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              onLoadPreset(SAMPLE_PROGRAM_PRESETS[0]);
              onReset();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl text-white shadow transition-all active:scale-95 border-2 cursor-pointer ${
              isBalatro
                ? 'bg-gradient-to-b from-[#e84118] to-[#c0392b] border-[#fbc531]'
                : isPurble
                ? 'bg-gradient-to-b from-[#ff85a2] to-[#ff2a5f] border-white'
                : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400'
            }`}
            title="Load the standard SAP-1 Math routine: 25H + 05H - 23H = 07H"
          >
            {isBalatro ? (
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            ) : isPurble ? (
              <Cake className="w-3.5 h-3.5 fill-current" />
            ) : (
              <HardDrive className="w-3.5 h-3.5" />
            )}
            <span>{isBalatro ? 'Deal Malvino Hand' : isPurble ? 'Load Malvino Recipe' : 'Load Malvino Preset'}</span>
          </button>

          <select
            onChange={(e) => {
              const preset = SAMPLE_PROGRAM_PRESETS.find((p) => p.id === e.target.value);
              if (preset) {
                onLoadPreset(preset);
                onReset();
              }
            }}
            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 font-sans focus:outline-none cursor-pointer border-2 ${
              isBalatro
                ? 'bg-[#10131a] border-[#2f3847] text-[#f5f6fa] focus:border-[#fbc531]'
                : isPurble
                ? 'bg-white border-[#86c5dc] text-[#58063f] focus:border-[#58063f]'
                : 'bg-slate-900 border-slate-700 text-slate-100 focus:border-cyan-400'
            }`}
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

      {/* Quick Editable Data Values (9H, AH, BH) */}
      <div
        className={`rounded-xl p-3 shadow-sm border ${
          isBalatro
            ? 'bg-[#10131a] border-[#2f3847] text-slate-200'
            : isPurble
            ? 'bg-white/90 border-[#86c5dc] text-[#2c1b3d]'
            : 'bg-slate-900 border-slate-700 text-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div
            className={`flex items-center gap-1.5 text-xs font-bold ${
              isBalatro ? 'text-[#f5f6fa]' : isPurble ? 'text-[#58063f]' : 'text-slate-100'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#912e73]' : 'text-cyan-400'}`} />
            <span>
              {isBalatro
                ? 'Active Hand Cards / Chips (Slots 9H, AH, BH)'
                : isPurble
                ? 'Pantry Ingredient Jars (Shelves 9H, AH, BH)'
                : 'Data Memory Operands (Addresses 9H, AH, BH)'}
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-70">
            Default: 25H + 05H - 23H = 07H (7)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Address 9H */}
          <div
            className={`rounded-xl p-2.5 flex items-center justify-between border ${
              isBalatro
                ? 'bg-[#181d26] border-[#2f3847]'
                : isPurble
                ? 'bg-[#fffcf2] border-[#e2be75]'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div>
              <div
                className={`text-[10px] font-mono font-bold ${
                  isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'
                }`}
              >
                {isBalatro ? 'CARD 9H (Base Hand)' : isPurble ? 'SHELF 9H (Sponge)' : 'ADDR 9H (Val A)'}
              </div>
              <div className="text-xs opacity-80">
                {isBalatro ? `Chips: ${dataInputs.addr9}` : isPurble ? `Grams: ${dataInputs.addr9}g` : `Dec: ${dataInputs.addr9}`}
              </div>
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
                className={`w-14 font-mono font-bold text-center text-xs px-1.5 py-1 rounded-lg border focus:outline-none ${
                  isBalatro
                    ? 'bg-[#10131a] border-[#2f3847] text-[#00a8ff] focus:border-[#00a8ff]'
                    : isPurble
                    ? 'bg-white border-[#caa052] text-[#58063f] focus:border-[#58063f]'
                    : 'bg-slate-900 border-slate-700 text-cyan-400 focus:border-cyan-400'
                }`}
                title="Hex value for memory address 9H"
                aria-label="Memory address 9H hex value"
              />
              <span className="text-xs font-mono opacity-60">H</span>
            </div>
          </div>

          {/* Address AH */}
          <div
            className={`rounded-xl p-2.5 flex items-center justify-between border ${
              isBalatro
                ? 'bg-[#181d26] border-[#2f3847]'
                : isPurble
                ? 'bg-[#fffcf2] border-[#e2be75]'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div>
              <div
                className={`text-[10px] font-mono font-bold ${
                  isBalatro ? 'text-emerald-400' : isPurble ? 'text-[#2f855a]' : 'text-emerald-400'
                }`}
              >
                {isBalatro ? 'CARD AH (Bonus Card)' : isPurble ? 'SHELF AH (Cream)' : 'ADDR AH (Val B)'}
              </div>
              <div className="text-xs opacity-80">
                {isBalatro ? `Chips: ${dataInputs.addrA}` : isPurble ? `Grams: ${dataInputs.addrA}g` : `Dec: ${dataInputs.addrA}`}
              </div>
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
                className={`w-14 font-mono font-bold text-center text-xs px-1.5 py-1 rounded-lg border focus:outline-none ${
                  isBalatro
                    ? 'bg-[#10131a] border-[#2f3847] text-emerald-400 focus:border-emerald-400'
                    : isPurble
                    ? 'bg-white border-[#caa052] text-[#2f855a] focus:border-[#2f855a]'
                    : 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-emerald-400'
                }`}
                title="Hex value for memory address AH"
                aria-label="Memory address AH hex value"
              />
              <span className="text-xs font-mono opacity-60">H</span>
            </div>
          </div>

          {/* Address BH */}
          <div
            className={`rounded-xl p-2.5 flex items-center justify-between border ${
              isBalatro
                ? 'bg-[#181d26] border-[#2f3847]'
                : isPurble
                ? 'bg-[#fffcf2] border-[#e2be75]'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div>
              <div
                className={`text-[10px] font-mono font-bold ${
                  isBalatro ? 'text-[#e84118]' : isPurble ? 'text-[#e6194b]' : 'text-red-400'
                }`}
              >
                {isBalatro ? 'CARD BH (Cut / Sub)' : isPurble ? 'SHELF BH (Trim)' : 'ADDR BH (Val C)'}
              </div>
              <div className="text-xs opacity-80">
                {isBalatro ? `Chips: ${dataInputs.addrB}` : isPurble ? `Grams: ${dataInputs.addrB}g` : `Dec: ${dataInputs.addrB}`}
              </div>
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
                className={`w-14 font-mono font-bold text-center text-xs px-1.5 py-1 rounded-lg border focus:outline-none ${
                  isBalatro
                    ? 'bg-[#10131a] border-[#2f3847] text-[#e84118] focus:border-[#e84118]'
                    : isPurble
                    ? 'bg-white border-[#caa052] text-[#e6194b] focus:border-[#e6194b]'
                    : 'bg-slate-900 border-slate-700 text-red-400 focus:border-red-400'
                }`}
                title="Hex value for memory address BH"
                aria-label="Memory address BH hex value"
              />
              <span className="text-xs font-mono opacity-60">H</span>
            </div>
          </div>
        </div>
      </div>

      {/* 16-Row Table */}
      <div
        className={`rounded-xl overflow-x-auto shadow-sm border-2 ${
          isBalatro
            ? 'border-[#2f3847] bg-[#10131a]'
            : isPurble
            ? 'border-[#86c5dc] bg-white'
            : 'border-slate-800 bg-slate-950'
        }`}
      >
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr
              className={`border-b uppercase tracking-wider text-[11px] font-black ${
                isBalatro
                  ? 'bg-[#181d26] text-slate-300 border-[#2f3847]'
                  : isPurble
                  ? 'bg-[#d2ecf7] text-[#58063f] border-[#86c5dc]'
                  : 'bg-slate-900 text-cyan-300 border-slate-800'
              }`}
            >
              <th className="py-2 px-3">{isBalatro ? 'Card Slot' : isPurble ? 'Shelf' : 'Address'}</th>
              <th className="py-2 px-3">Binary</th>
              <th className="py-2 px-3">Hex Byte</th>
              <th className="py-2 px-3">8-Bit Binary</th>
              <th className="py-2 px-3">Directive / Hand</th>
              <th className="py-2 px-3 text-right">Edit</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isBalatro ? 'divide-[#232a36]' : isPurble ? 'divide-slate-200' : 'divide-slate-800'
            }`}
          >
            {memoryEntries.map((entry) => {
              const isMarTarget = currentMar === entry.address;
              const isPcTarget = currentPc === entry.address;
              const isEditing = editingAddress === entry.address;

              let rowClass = '';
              if (isBalatro) {
                if (isMarTarget) {
                  rowClass = 'bg-[#00a8ff]/20 border-l-4 border-l-[#00a8ff] font-bold text-white';
                } else if (isPcTarget) {
                  rowClass = 'bg-[#e84118]/20 border-l-4 border-l-[#e84118] font-bold text-white';
                } else {
                  rowClass = 'hover:bg-[#181d26] text-slate-200';
                }
              } else if (isPurble) {
                if (isMarTarget) {
                  rowClass = 'bg-[#ffebee] border-l-4 border-[#e6194b] font-bold text-[#e6194b]';
                } else if (isPcTarget) {
                  rowClass = 'bg-[#e0f7fa] text-[#006064]';
                } else {
                  rowClass = 'hover:bg-slate-50 text-slate-800';
                }
              } else {
                if (isMarTarget) {
                  rowClass = 'bg-cyan-950/60 border-l-4 border-l-cyan-400 font-bold text-cyan-200';
                } else if (isPcTarget) {
                  rowClass = 'bg-amber-950/60 border-l-4 border-l-amber-400 font-bold text-amber-200';
                } else {
                  rowClass = 'hover:bg-slate-900 text-slate-300';
                }
              }

              return (
                <tr key={entry.address} className={`transition-colors ${rowClass}`}>
                  {/* Address */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{toHex4(entry.address)}H</span>
                      {isMarTarget && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-sans font-bold text-white ${
                            isBalatro
                              ? 'bg-[#00a8ff]'
                              : isPurble
                              ? 'bg-[#e6194b]'
                              : 'bg-cyan-600'
                          }`}
                        >
                          MAR
                        </span>
                      )}
                      {isPcTarget && !isMarTarget && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-sans font-bold text-white ${
                            isBalatro
                              ? 'bg-[#e84118]'
                              : isPurble
                              ? 'bg-[#00acc1]'
                              : 'bg-amber-600'
                          }`}
                        >
                          PC
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Binary Addr */}
                  <td className="py-2 px-3 opacity-60 whitespace-nowrap">
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
                          className={`px-2 py-0.5 rounded text-xs w-28 focus:outline-none border-2 ${
                            isBalatro
                              ? 'bg-[#1e2533] border-[#fbc531] text-white'
                              : isPurble
                              ? 'bg-white border-[#58063f] text-[#58063f]'
                              : 'bg-slate-900 border-cyan-400 text-slate-100'
                          }`}
                          autoFocus
                          aria-label={`Edit value for address ${toHex4(entry.address)}H`}
                        />
                        <button
                          onClick={() => handleSaveEdit(entry.address)}
                          className={`p-1 rounded text-white ${
                            isBalatro ? 'bg-[#e84118]' : isPurble ? 'bg-[#58063f]' : 'bg-cyan-600'
                          }`}
                          title="Save"
                          aria-label="Save RAM edit"
                        >
                          <Check className="w-3 h-3 font-bold" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`font-bold ${
                          isBalatro
                            ? 'text-[#fbc531]'
                            : isPurble
                            ? 'text-[#58063f]'
                            : 'text-cyan-400'
                        }`}
                      >
                        {toHexByte(entry.value)}H
                      </span>
                    )}
                    {isEditing && editError && (
                      <div className="text-[10px] text-red-500 font-sans mt-0.5">
                        {editError}
                      </div>
                    )}
                  </td>

                  {/* Binary Value */}
                  <td className="py-2 px-3 opacity-75 whitespace-nowrap">
                    {toBin8(entry.value)}
                  </td>

                  {/* Decoded Mnemonic */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full border ${
                        isBalatro
                          ? entry.isData
                            ? 'text-slate-300 bg-[#1e2533] border-[#2f3847]'
                            : 'text-[#fbc531] bg-[#181d26] border-[#fbc531]/60 font-bold'
                          : isPurble
                          ? entry.isData
                            ? 'text-slate-600 bg-slate-100 border-transparent'
                            : 'text-[#58063f] bg-[#fff4d4] border-[#f6d186] font-bold'
                          : entry.isData
                          ? 'text-slate-400 bg-slate-900 border-slate-800'
                          : 'text-cyan-300 bg-cyan-950 border-cyan-800 font-bold'
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
                        className="text-[11px] opacity-60 hover:opacity-100"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(entry)}
                        className="p-1 rounded opacity-60 hover:opacity-100 transition-colors cursor-pointer"
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
