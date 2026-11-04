import React from 'react';
import { AppTheme, THEME_CONFIGS } from '../types/theme';

interface ThemeSwitcherProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: AppTheme[] = ['balatro', 'purble', 'classic'];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/20 backdrop-blur-md shadow-md">
      {themes.map((th) => {
        const config = THEME_CONFIGS[th];
        const isActive = currentTheme === th;

        return (
          <button
            key={th}
            onClick={() => onThemeChange(th)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? th === 'balatro'
                  ? 'bg-[#e84118] text-white shadow-md scale-105 border border-[#ff794d]'
                  : th === 'purble'
                  ? 'bg-[#912e73] text-[#f9d9ef] shadow-md scale-105 border border-[#c56eab]'
                  : 'bg-[#0ea5e9] text-white shadow-md scale-105 border border-[#38bdf8]'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{config.icon}</span>
            <span className="whitespace-nowrap">{config.name}</span>
          </button>
        );
      })}
    </div>
  );
};
