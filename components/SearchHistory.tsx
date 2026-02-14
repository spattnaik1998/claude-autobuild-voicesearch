'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { getGroupedHistory, clearSearchHistory, deleteHistoryEntry, formatTime } from '@/lib/storage';
import type { SearchHistoryEntry } from '@/types';
import { Button } from './Button';

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntry: (entry: SearchHistoryEntry) => void;
  currentQuery?: string;
}

export function SearchHistory({
  isOpen,
  onClose,
  onSelectEntry,
  currentQuery,
}: SearchHistoryProps) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const [groupedHistory, setGroupedHistory] = useState<Record<string, SearchHistoryEntry[]>>({});
  const [searchFilter, setSearchFilter] = useState('');

  const loadHistory = useCallback(() => {
    try {
      const grouped = getGroupedHistory(activeWorkspaceId || 'default');
      setGroupedHistory(grouped);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, [activeWorkspaceId]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, activeWorkspaceId, loadHistory]);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all search history for this workspace?')) {
      clearSearchHistory(activeWorkspaceId || 'default');
      setGroupedHistory({});
    }
  };

  const handleDeleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryEntry(id, activeWorkspaceId || 'default');
    loadHistory();
  };

  const handleSelectEntry = (entry: SearchHistoryEntry) => {
    onSelectEntry(entry);
    onClose();
  };

  // Filter history based on search input
  const filteredGroupedHistory = Object.entries(groupedHistory).reduce(
    (acc, [group, entries]) => {
      const filtered = entries.filter(entry =>
        entry.query.toLowerCase().includes(searchFilter.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[group] = filtered;
      }
      return acc;
    },
    {} as Record<string, SearchHistoryEntry[]>
  );

  const isEmpty = Object.values(filteredGroupedHistory).every(group => group.length === 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 z-40 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                📜 History
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close history"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Filter */}
            <input
              type="text"
              placeholder="Search history..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
                <svg
                  className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {searchFilter ? 'No matching searches' : 'No search history yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-6 px-4 py-6">
                {/* Timeline with groups */}
                {Object.entries(filteredGroupedHistory).map(([groupName, entries]) => (
                  <div key={groupName}>
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">
                      {groupName}
                    </h3>

                    <div className="relative pl-6 space-y-2">
                      {/* Vertical timeline line */}
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 to-transparent dark:from-teal-500" />

                      {/* Timeline entries */}
                      {entries.map((entry) => (
                        <div key={entry.id} className="group relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-4 top-2 w-4 h-4 bg-teal-400 dark:bg-teal-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />

                          {/* Entry card */}
                          <button
                            onClick={() => handleSelectEntry(entry)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                              currentQuery === entry.query
                                ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent'
                            }`}
                          >
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {entry.query}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {formatTime(entry.timestamp)}
                            </p>
                          </button>

                          {/* Delete button (appears on hover) */}
                          <button
                            onClick={(e) => handleDeleteEntry(entry.id, e)}
                            className="absolute right-2 top-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all duration-200"
                            aria-label="Delete entry"
                          >
                            <svg
                              className="w-4 h-4 text-red-500 dark:text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isEmpty && (
            <div className="px-4 py-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                🗑️ Clear All History
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
