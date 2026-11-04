export type AppTheme = 'balatro' | 'purble' | 'classic';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  icon: string;
  tagline: string;
  bodyBg: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  accentColor: string;
  wBusLabel: string;
}

export const THEME_CONFIGS: Record<AppTheme, ThemeConfig> = {
  balatro: {
    id: 'balatro',
    name: 'Balatro Casino',
    icon: '🃏',
    tagline: 'Roguelike Poker & Hypnotic CRT Deck',
    bodyBg: 'bg-[#0f111a]',
    cardBg: 'bg-[#1e232e]',
    cardBorder: 'border-[#384252]',
    textColor: 'text-[#f5f6fa]',
    accentColor: '#e84118',
    wBusLabel: 'POKER TABLE FELT (W-BUS)',
  },
  purble: {
    id: 'purble',
    name: 'Purble Place',
    icon: '🧁',
    tagline: 'Comfy Cakes Bakery Factory',
    bodyBg: 'bg-[#2e1d40]',
    cardBg: 'bg-[#bde5f3]',
    cardBorder: 'border-[#86c5dc]',
    textColor: 'text-[#2c1b3d]',
    accentColor: '#912e73',
    wBusLabel: 'CONVEYOR BELT (W-BUS)',
  },
  classic: {
    id: 'classic',
    name: 'Classic Malvino',
    icon: '⚡',
    tagline: '8-Bit TTL Electronics Lab',
    bodyBg: 'bg-[#0b0f19]',
    cardBg: 'bg-[#111827]',
    cardBorder: 'border-[#1f2937]',
    textColor: 'text-slate-100',
    accentColor: '#0ea5e9',
    wBusLabel: 'CENTRAL 8-BIT W-BUS',
  },
};
