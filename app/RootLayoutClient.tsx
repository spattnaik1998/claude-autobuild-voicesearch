'use client';

import { useKeyboardShortcuts } from '@/lib/hooks';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastStack } from '@/components/ToastStack';
import { useSearchHistory } from '@/lib/hooks';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { getSearchHistory } = useSearchHistory();
  const historyEntries = getSearchHistory();

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    onNewSearch: () => {
      // Focus search input on the page
      const input = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      input?.focus();
    },
  });

  return (
    <>
      {children}
      <CommandPalette
        historyCount={historyEntries.length}
      />
      <ToastStack />
    </>
  );
}
