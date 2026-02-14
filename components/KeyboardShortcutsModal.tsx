'use client';

import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS } from '@/lib/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group shortcuts by category
  const grouped = KEYBOARD_SHORTCUTS.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, typeof KEYBOARD_SHORTCUTS>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 px-4 animate-in fade-in scale-in-95 duration-200">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 px-8 py-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                ⌨️ Keyboard Shortcuts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Master the keyboard for lightning-fast navigation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(grouped).map(([category, shortcuts]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b-2 border-teal-500">
                    {category}
                  </h3>

                  <div className="space-y-3">
                    {shortcuts.map((shortcut, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {/* Keys */}
                        <div className="flex-shrink-0 flex flex-wrap gap-1.5">
                          {shortcut.keys.map((key, i) => (
                            <span key={i}>
                              <kbd className="inline-flex items-center gap-0.5 px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded border border-slate-300 dark:border-slate-600 shadow-sm whitespace-nowrap">
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className="text-slate-400 text-xs mx-0.5">+</span>
                              )}
                            </span>
                          ))}
                        </div>

                        {/* Description */}
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {shortcut.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  💡 <strong>Pro Tip:</strong> Most shortcuts use <kbd className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded text-xs">Cmd</kbd> on Mac and <kbd className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded text-xs">Ctrl</kbd> on Windows/Linux. Press <kbd className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded text-xs">?</kbd> anytime to open this modal!
                </p>
              </div>
            </div>

            {/* Close Instructions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Press <kbd className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-xs">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
