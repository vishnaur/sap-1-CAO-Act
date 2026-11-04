import React, { useState } from 'react';
import { toBin8Compact, toHexByte, toSignedDec } from '../utils/sap1Core';

interface LedDisplayProps {
  value: number;
  label?: string;
  isLatched?: boolean;
}

type LedStyle = 'cherry' | 'sugar' | 'mint';

export const LedDisplay: React.FC<LedDisplayProps> = ({
  value,
  label = 'OUTPUT REGISTER DISPLAY',
  isLatched = false,
}) => {
  const [ledStyle, setLedStyle] = useState<LedStyle>('cherry');
  const binStr = toBin8Compact(value);
  const hexVal = toHexByte(value) + 'H';
  const decVal = value & 0xff;
  const signedDec = toSignedDec(value);

  // Soft candy styles (tactile, non-neon, cheerful Purble Place)
  const styleConfigs = {
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
  }[ledStyle];

  return (
    <div className="bg-[#fffcf2] border-2 border-[#e2be75] rounded-xl p-3 shadow-md text-[#2c1b3d]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e2be75]/60">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isLatched ? 'bg-[#e6194b] animate-ping' : 'bg-slate-400'
            }`}
          />
          <span className="text-[11px] font-black tracking-wider uppercase text-[#58063f] font-sans">
            {label}
          </span>
          {isLatched && (
            <span className="text-[9px] text-[#58063f] font-bold px-1.5 py-0.2 rounded bg-amber-200 border border-amber-400">
              [Lo LATCHED]
            </span>
          )}
        </div>

        {/* LED Style Selector */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setLedStyle('cherry')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
              ledStyle === 'cherry'
                ? 'bg-[#e6194b] text-white border-[#b30030]'
                : 'bg-white text-slate-600 border-[#e2be75]'
            }`}
          >
            🍒 Cherries
          </button>
          <button
            onClick={() => setLedStyle('sugar')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
              ledStyle === 'sugar'
                ? 'bg-[#ff9f1a] text-white border-[#c97400]'
                : 'bg-white text-slate-600 border-[#e2be75]'
            }`}
          >
            ⭐ Stars
          </button>
          <button
            onClick={() => setLedStyle('mint')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
              ledStyle === 'mint'
                ? 'bg-[#2f855a] text-white border-[#1c5337]'
                : 'bg-white text-slate-600 border-[#e2be75]'
            }`}
          >
            🍬 Mint
          </button>
        </div>
      </div>

      {/* 8-Bit Circular Candlestick Array */}
      <div className="py-2.5 px-2 bg-[#fffaed] border border-[#e2be75] rounded-lg my-2">
        <div className="grid grid-cols-8 gap-1.5 sm:gap-3 max-w-md mx-auto">
          {binStr.split('').map((bit, idx) => {
            const bitIndex = 7 - idx; // D7 down to D0
            const isOn = bit === '1';

            return (
              <div key={bitIndex} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-slate-500">
                  D{bitIndex}
                </span>

                {/* Circular Diode */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all flex items-center justify-center relative ${
                    isOn ? `${styleConfigs.on} scale-105` : `${styleConfigs.off}`
                  }`}
                >
                  {/* Subtle specular glint */}
                  <div className="absolute top-0.5 left-1 w-2 h-1 rounded-full bg-white/70" />
                  <span
                    className={`text-[11px] font-mono font-black ${
                      isOn ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {bit}
                  </span>
                </div>

                <span className="text-[8px] font-mono text-slate-400">
                  {Math.pow(2, bitIndex)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values Readout */}
      <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
        <div className="bg-white border border-[#e2be75] rounded p-1.5">
          <div className="text-[9px] text-slate-500 font-sans font-bold">HEX OUTPUT</div>
          <div className={`text-base font-black ${styleConfigs.textActive}`}>
            {hexVal}
          </div>
        </div>
        <div className="bg-white border border-[#e2be75] rounded p-1.5">
          <div className="text-[9px] text-slate-500 font-sans font-bold">CAKE GRAMS</div>
          <div className="text-base font-black text-[#58063f]">{decVal}g</div>
        </div>
        <div className="bg-white border border-[#e2be75] rounded p-1.5">
          <div className="text-[9px] text-slate-500 font-sans font-bold">SIGNED TRIM</div>
          <div className="text-base font-black text-slate-700">
            {signedDec >= 0 ? `+${signedDec}` : signedDec}
          </div>
        </div>
      </div>
    </div>
  );
};
