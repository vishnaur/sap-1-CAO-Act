import React, { useState } from 'react';
import { toBin8Compact, toHexByte, toSignedDec } from '../utils/sap1Core';
import { AppTheme } from '../types/theme';

interface LedDisplayProps {
  value: number;
  label?: string;
  isLatched?: boolean;
  currentTheme?: AppTheme;
}

type LedStyle = 'cherry' | 'sugar' | 'mint' | 'red_chip' | 'blue_chip' | 'gold_chip' | 'ttl_red' | 'ttl_green';

export const LedDisplay: React.FC<LedDisplayProps> = ({
  value,
  label,
  isLatched = false,
  currentTheme = 'balatro',
}) => {
  const isBalatro = currentTheme === 'balatro';
  const isPurble = currentTheme === 'purble';

  const defaultStyle: LedStyle = isBalatro ? 'red_chip' : isPurble ? 'cherry' : 'ttl_red';
  const [ledStyle, setLedStyle] = useState<LedStyle>(defaultStyle);

  const binStr = toBin8Compact(value);
  const hexVal = toHexByte(value) + 'H';
  const decVal = value & 0xff;
  const signedDec = toSignedDec(value);

  // Dynamic label based on theme if not passed explicitly
  const displayLabel =
    label ??
    (isBalatro
      ? 'Casino Output Chips & Mult Diodes'
      : isPurble
      ? 'Cake Inspection Diodes'
      : 'Output Register (OUT) LEDs');

  // Palette configs per theme
  const styleConfigs: Record<
    string,
    { on: string; off: string; textActive: string; label: string }
  > = {
    // Balatro Chips
    red_chip: {
      on: 'bg-gradient-to-b from-[#ff5252] to-[#e84118] border-[#fbc531] text-white shadow-lg shadow-red-900/50',
      off: 'bg-[#1e1416] border-[#441a1c] text-[#7a3b3f]',
      textActive: 'text-[#e84118]',
      label: '🔴 Mult Chips',
    },
    blue_chip: {
      on: 'bg-gradient-to-b from-[#33b8ff] to-[#0097e6] border-[#e1f5fe] text-white shadow-lg shadow-blue-900/50',
      off: 'bg-[#121c26] border-[#1d354d] text-[#3b668c]',
      textActive: 'text-[#00a8ff]',
      label: '🔵 Score Chips',
    },
    gold_chip: {
      on: 'bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] border-[#fffbeb] text-slate-900 font-black shadow-lg shadow-amber-900/50',
      off: 'bg-[#241f14] border-[#4d3d1e] text-[#8c743b]',
      textActive: 'text-[#f59e0b]',
      label: '🟡 Gold Foil',
    },
    // Purble Place Sweets
    cherry: {
      on: 'bg-gradient-to-b from-[#ff6b8b] to-[#e6194b] border-[#ffa3be] text-white shadow-md',
      off: 'bg-[#ffd5df] border-[#e8a3b5] text-[#b36b7d]',
      textActive: 'text-[#e6194b]',
      label: '🍒 Cherries',
    },
    sugar: {
      on: 'bg-gradient-to-b from-[#ffd32a] to-[#ff9f1a] border-[#fff0ad] text-white shadow-md',
      off: 'bg-[#fcedb6] border-[#dec26b] text-[#997722]',
      textActive: 'text-[#d67b00]',
      label: '⭐ Stars',
    },
    mint: {
      on: 'bg-gradient-to-b from-[#68d391] to-[#2f855a] border-[#b2f5ea] text-white shadow-md',
      off: 'bg-[#d2f3e8] border-[#81c7b2] text-[#2c7a65]',
      textActive: 'text-[#2f855a]',
      label: '🍬 Mint',
    },
    // Classic TTL
    ttl_red: {
      on: 'bg-red-500 border-red-300 text-white shadow-lg shadow-red-500/50',
      off: 'bg-slate-900 border-slate-700 text-slate-600',
      textActive: 'text-red-400',
      label: '🔴 TTL Red',
    },
    ttl_green: {
      on: 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/50',
      off: 'bg-slate-900 border-slate-700 text-slate-600',
      textActive: 'text-emerald-400',
      label: '🟢 TTL Green',
    },
  };

  const activeConfig = styleConfigs[ledStyle] ?? (isBalatro ? styleConfigs.red_chip : styleConfigs.cherry);

  return (
    <div
      className={`rounded-xl p-3 shadow-md transition-all ${
        isBalatro
          ? 'bg-[#10131a] border-2 border-[#2f3847] text-[#f5f6fa]'
          : isPurble
          ? 'bg-[#fffcf2] border-2 border-[#e2be75] text-[#2c1b3d]'
          : 'bg-slate-950 border-2 border-slate-800 text-slate-100'
      }`}
    >
      {/* Top Header */}
      <div
        className={`flex items-center justify-between pb-2 border-b ${
          isBalatro
            ? 'border-[#2f3847]'
            : isPurble
            ? 'border-[#e2be75]/60'
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isLatched
                ? isBalatro
                  ? 'bg-[#e84118] animate-ping'
                  : 'bg-[#e6194b] animate-ping'
                : 'bg-slate-500'
            }`}
          />
          <span
            className={`text-[11px] font-black tracking-wider uppercase font-sans ${
              isBalatro
                ? 'text-[#f5f6fa]'
                : isPurble
                ? 'text-[#58063f]'
                : 'text-slate-200'
            }`}
          >
            {displayLabel}
          </span>
          {isLatched && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                isBalatro
                  ? 'bg-[#e84118] text-white border-[#fbc531]'
                  : isPurble
                  ? 'bg-amber-200 text-[#58063f] border-amber-400'
                  : 'bg-cyan-900 text-cyan-300 border-cyan-700'
              }`}
            >
              [Lo LATCHED]
            </span>
          )}
        </div>

        {/* LED Style Selector */}
        <div className="flex items-center gap-1 text-xs">
          {isBalatro ? (
            <>
              {(['red_chip', 'blue_chip', 'gold_chip'] as const).map((styleKey) => (
                <button
                  key={styleKey}
                  onClick={() => setLedStyle(styleKey)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    ledStyle === styleKey
                      ? 'bg-[#e84118] text-white border-[#fbc531]'
                      : 'bg-[#1b222c] text-slate-400 border-[#2f3847] hover:text-white'
                  }`}
                >
                  {styleConfigs[styleKey].label}
                </button>
              ))}
            </>
          ) : isPurble ? (
            <>
              {(['cherry', 'sugar', 'mint'] as const).map((styleKey) => (
                <button
                  key={styleKey}
                  onClick={() => setLedStyle(styleKey)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    ledStyle === styleKey
                      ? styleKey === 'cherry'
                        ? 'bg-[#e6194b] text-white border-[#b30030]'
                        : styleKey === 'sugar'
                        ? 'bg-[#ff9f1a] text-white border-[#c97400]'
                        : 'bg-[#2f855a] text-white border-[#1c5337]'
                      : 'bg-white text-slate-600 border-[#e2be75]'
                  }`}
                >
                  {styleConfigs[styleKey].label}
                </button>
              ))}
            </>
          ) : (
            <>
              {(['ttl_red', 'ttl_green'] as const).map((styleKey) => (
                <button
                  key={styleKey}
                  onClick={() => setLedStyle(styleKey)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    ledStyle === styleKey
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  {styleConfigs[styleKey].label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 8-Bit Circular Candlestick / Casino Chip Array */}
      <div
        className={`py-2.5 px-2 rounded-lg my-2 border ${
          isBalatro
            ? 'bg-[#141822] border-[#2f3847]'
            : isPurble
            ? 'bg-[#fffaed] border-[#e2be75]'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="grid grid-cols-8 gap-1.5 sm:gap-3 max-w-md mx-auto">
          {binStr.split('').map((bit, idx) => {
            const bitIndex = 7 - idx; // D7 down to D0
            const isOn = bit === '1';

            return (
              <div key={bitIndex} className="flex flex-col items-center gap-1">
                <span
                  className={`text-[9px] font-mono font-bold ${
                    isBalatro ? 'text-slate-400' : isPurble ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  D{bitIndex}
                </span>

                {/* Circular Diode / Poker Chip */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all flex items-center justify-center relative ${
                    isOn ? `${activeConfig.on} scale-105` : `${activeConfig.off}`
                  }`}
                >
                  {/* Specular glint */}
                  <div className="absolute top-0.5 left-1 w-2 h-1 rounded-full bg-white/60 pointer-events-none" />
                  <span
                    className={`text-[11px] font-mono font-black ${
                      isOn ? 'text-white' : 'opacity-40'
                    }`}
                  >
                    {bit}
                  </span>
                </div>

                <span
                  className={`text-[8px] font-mono ${
                    isBalatro ? 'text-slate-500' : isPurble ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {Math.pow(2, bitIndex)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values Readout */}
      <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
        <div
          className={`border rounded p-1.5 ${
            isBalatro
              ? 'bg-[#1b222c] border-[#2f3847]'
              : isPurble
              ? 'bg-white border-[#e2be75]'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="text-[9px] opacity-70 font-sans font-bold">HEX OUTPUT</div>
          <div className={`text-base font-black ${activeConfig.textActive}`}>
            {hexVal}
          </div>
        </div>
        <div
          className={`border rounded p-1.5 ${
            isBalatro
              ? 'bg-[#1b222c] border-[#2f3847]'
              : isPurble
              ? 'bg-white border-[#e2be75]'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="text-[9px] opacity-70 font-sans font-bold">
            {isBalatro ? 'SCORE CHIPS' : isPurble ? 'CAKE GRAMS' : 'DECIMAL'}
          </div>
          <div
            className={`text-base font-black ${
              isBalatro ? 'text-[#00a8ff]' : isPurble ? 'text-[#58063f]' : 'text-cyan-400'
            }`}
          >
            {decVal}
            {isBalatro ? ' 🪙' : isPurble ? 'g' : ''}
          </div>
        </div>
        <div
          className={`border rounded p-1.5 ${
            isBalatro
              ? 'bg-[#1b222c] border-[#2f3847]'
              : isPurble
              ? 'bg-white border-[#e2be75]'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="text-[9px] opacity-70 font-sans font-bold">
            {isBalatro ? 'MULT TRIM' : isPurble ? 'SIGNED TRIM' : 'SIGNED INT'}
          </div>
          <div
            className={`text-base font-black ${
              isBalatro ? 'text-[#e84118]' : isPurble ? 'text-slate-700' : 'text-amber-400'
            }`}
          >
            {signedDec >= 0 ? `+${signedDec}` : signedDec}
          </div>
        </div>
      </div>
    </div>
  );
};
