'use client';

import { useCallback } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { getSearchHistory, saveSearchToHistory, deleteHistoryEntry, clearSearchHistory, getGroupedHistory } from '@/lib/storage';
import type { SearchHistoryEntry } from '@/types';

export function useSearchHistory() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const workspaceId = activeWorkspaceId || 'default';

  const getHistory = useCallback(() => {
    return getSearchHistory(workspaceId);
  }, [workspaceId]);

  const saveSearch = useCallback(
    (entry: SearchHistoryEntry) => {
      saveSearchToHistory(entry, workspaceId);
    },
    [workspaceId]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      deleteHistoryEntry(id, workspaceId);
    },
    [workspaceId]
  );

  const clearHistory = useCallback(() => {
    clearSearchHistory(workspaceId);
  }, [workspaceId]);

  const getGrouped = useCallback(() => {
    return getGroupedHistory(workspaceId);
  }, [workspaceId]);

  return {
    getSearchHistory: getHistory,
    saveSearch,
    deleteEntry,
    clearHistory,
    getGrouped,
  };
}
