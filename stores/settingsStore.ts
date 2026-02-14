import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'auto';
export type AccentColor = 'teal' | 'purple' | 'blue' | 'green';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type SearchProvider = 'serper' | 'google' | 'bing';
export type ExportFormat = 'markdown' | 'json' | 'pdf' | 'csv';

interface SettingsState {
  // Appearance
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  animationsEnabled: boolean;

  // Search & History
  autoSummarize: boolean;
  autoGenerateQuestions: boolean;
  historyLimit: number;
  autoClearHistory: 'never' | '7' | '30' | '90';
  searchProvider: SearchProvider;

  // Workspaces
  defaultWorkspace: string;
  rememberLastWorkspace: boolean;
  showArchivedWorkspaces: boolean;

  // Notifications
  enableToasts: boolean;
  toastDuration: number; // milliseconds
  enableSound: boolean;
  showBadgeCount: boolean;

  // Keyboard
  enableVimMode: boolean;

  // Export & Sharing
  defaultExportFormat: ExportFormat;
  includeTimestamps: boolean;
  includeSources: boolean;
  autoCopyShareUrl: boolean;

  // Privacy
  enableAnalytics: boolean;
}

interface SettingsActions {
  // Appearance
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
  setAnimationsEnabled: (enabled: boolean) => void;

  // Search & History
  setAutoSummarize: (enabled: boolean) => void;
  setAutoGenerateQuestions: (enabled: boolean) => void;
  setHistoryLimit: (limit: number) => void;
  setAutoClearHistory: (days: 'never' | '7' | '30' | '90') => void;
  setSearchProvider: (provider: SearchProvider) => void;

  // Workspaces
  setDefaultWorkspace: (id: string) => void;
  setRememberLastWorkspace: (remember: boolean) => void;
  setShowArchivedWorkspaces: (show: boolean) => void;

  // Notifications
  setEnableToasts: (enabled: boolean) => void;
  setToastDuration: (duration: number) => void;
  setEnableSound: (enabled: boolean) => void;
  setShowBadgeCount: (show: boolean) => void;

  // Keyboard
  setEnableVimMode: (enabled: boolean) => void;

  // Export & Sharing
  setDefaultExportFormat: (format: ExportFormat) => void;
  setIncludeTimestamps: (include: boolean) => void;
  setIncludeSources: (include: boolean) => void;
  setAutoCopyShareUrl: (auto: boolean) => void;

  // Privacy
  setEnableAnalytics: (enabled: boolean) => void;

  // Reset
  resetToDefaults: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'auto',
  accentColor: 'teal',
  fontSize: 'medium',
  animationsEnabled: true,

  autoSummarize: true,
  autoGenerateQuestions: true,
  historyLimit: 100,
  autoClearHistory: 'never',
  searchProvider: 'serper',

  defaultWorkspace: 'default',
  rememberLastWorkspace: true,
  showArchivedWorkspaces: false,

  enableToasts: true,
  toastDuration: 3000,
  enableSound: false,
  showBadgeCount: true,

  enableVimMode: false,

  defaultExportFormat: 'markdown',
  includeTimestamps: true,
  includeSources: true,
  autoCopyShareUrl: false,

  enableAnalytics: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      // Appearance
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      setFontSize: (size) => set({ fontSize: size }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),

      // Search & History
      setAutoSummarize: (enabled) => set({ autoSummarize: enabled }),
      setAutoGenerateQuestions: (enabled) => set({ autoGenerateQuestions: enabled }),
      setHistoryLimit: (limit) => set({ historyLimit: Math.min(Math.max(limit, 25), 500) }),
      setAutoClearHistory: (days) => set({ autoClearHistory: days }),
      setSearchProvider: (provider) => set({ searchProvider: provider }),

      // Workspaces
      setDefaultWorkspace: (id) => set({ defaultWorkspace: id }),
      setRememberLastWorkspace: (remember) => set({ rememberLastWorkspace: remember }),
      setShowArchivedWorkspaces: (show) => set({ showArchivedWorkspaces: show }),

      // Notifications
      setEnableToasts: (enabled) => set({ enableToasts: enabled }),
      setToastDuration: (duration) => set({ toastDuration: Math.max(duration, 1000) }),
      setEnableSound: (enabled) => set({ enableSound: enabled }),
      setShowBadgeCount: (show) => set({ showBadgeCount: show }),

      // Keyboard
      setEnableVimMode: (enabled) => set({ enableVimMode: enabled }),

      // Export & Sharing
      setDefaultExportFormat: (format) => set({ defaultExportFormat: format }),
      setIncludeTimestamps: (include) => set({ includeTimestamps: include }),
      setIncludeSources: (include) => set({ includeSources: include }),
      setAutoCopyShareUrl: (auto) => set({ autoCopyShareUrl: auto }),

      // Privacy
      setEnableAnalytics: (enabled) => set({ enableAnalytics: enabled }),

      // Reset
      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'settings-storage',
    }
  )
);
