'use client';

import { useEffect, useCallback } from 'react';
import { useCommandStore } from '@/stores/commandStore';
import { useTheme } from '@/lib/theme';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface KeyboardShortcutCallbacks {
  onNewSearch?: () => void;
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
  onToggleDarkMode?: () => void;
  onOpenNotifications?: () => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardShortcutCallbacks = {}) {
  const { toggle: toggleCommand } = useCommandStore();
  const { theme, setTheme } = useTheme();
  const { workspaces, switchWorkspace } = useWorkspaceStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K: Open command palette
      if (modKey && e.key === 'k') {
        e.preventDefault();
        toggleCommand();
        return;
      }

      // Cmd/Ctrl + N: New search
      if (modKey && e.key === 'n') {
        e.preventDefault();
        callbacks.onNewSearch?.();
        return;
      }

      // Cmd/Ctrl + H: Open history
      if (modKey && e.key === 'h') {
        e.preventDefault();
        callbacks.onOpenHistory?.();
        return;
      }

      // Cmd/Ctrl + ,: Open settings
      if (modKey && e.key === ',') {
        e.preventDefault();
        callbacks.onOpenSettings?.();
        return;
      }

      // Cmd/Ctrl + /: Toggle dark mode
      if (modKey && e.key === '/') {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
        callbacks.onToggleDarkMode?.();
        return;
      }

      // Cmd/Ctrl + Shift + N: Open notifications
      if (modKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        callbacks.onOpenNotifications?.();
        return;
      }

      // Cmd/Ctrl + 1-9: Switch to workspace
      if (modKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (workspaces[index]) {
          switchWorkspace(workspaces[index].id);
        }
        return;
      }

      // ?: Show shortcuts help
      if (e.key === '?' && !modKey) {
        e.preventDefault();
        // This will be handled by a dedicated event
        window.dispatchEvent(new CustomEvent('show-shortcuts-modal'));
        return;
      }

      // Esc: Close any open modals (handled by individual components)
      if (e.key === 'Escape') {
        // Emit event for components to listen to
        window.dispatchEvent(new CustomEvent('keyboard-escape'));
      }
    },
    [
      toggleCommand,
      setTheme,
      theme,
      callbacks,
      switchWorkspace,
      workspaces,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// List of all available shortcuts
export const KEYBOARD_SHORTCUTS = [
  {
    keys: ['Cmd/Ctrl', 'K'],
    description: 'Open command palette',
    category: 'Global',
  },
  {
    keys: ['Cmd/Ctrl', 'N'],
    description: 'New search',
    category: 'Global',
  },
  {
    keys: ['Cmd/Ctrl', 'H'],
    description: 'Open search history',
    category: 'Global',
  },
  {
    keys: ['Cmd/Ctrl', ','],
    description: 'Open settings',
    category: 'Global',
  },
  {
    keys: ['Cmd/Ctrl', '/'],
    description: 'Toggle dark mode',
    category: 'Global',
  },
  {
    keys: ['Cmd/Ctrl', 'Shift', 'N'],
    description: 'Open notifications',
    category: 'Global',
  },
  {
    keys: ['Cmd/Ctrl', '1-9'],
    description: 'Switch to workspace',
    category: 'Workspace',
  },
  {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    category: 'Global',
  },
  {
    keys: ['Esc'],
    description: 'Close modal',
    category: 'Global',
  },
  {
    keys: ['Enter'],
    description: 'Submit search',
    category: 'Search',
  },
  {
    keys: ['Tab'],
    description: 'Navigate between tabs',
    category: 'Search',
  },
  {
    keys: ['Arrow Up/Down'],
    description: 'Navigate search results',
    category: 'Search',
  },
];
