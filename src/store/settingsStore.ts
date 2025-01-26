import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  measurementSystem: 'metric' | 'imperial';
  language: string;
  setMeasurementSystem: (system: 'metric' | 'imperial') => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      measurementSystem: 'metric',
      language: 'en',
      setMeasurementSystem: (system) => set({ measurementSystem: system }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
    }
  )
);