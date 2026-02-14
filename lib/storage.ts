import type { SearchHistoryEntry } from '@/types';

const HISTORY_KEY_PREFIX = 'voicesearch_history';
const MAX_HISTORY_ENTRIES = 50;

/**
 * Get the storage key for a workspace
 * Defaults to 'default' workspace if not specified
 */
const getHistoryKey = (workspaceId?: string): string => {
  return `${HISTORY_KEY_PREFIX}_${workspaceId || 'default'}`;
};

/**
 * Save a search entry to localStorage history
 * Maintains chronological order (newest first)
 * Workspace-isolated storage
 */
export const saveSearchToHistory = (
  entry: SearchHistoryEntry,
  workspaceId?: string
): void => {
  try {
    const history = getSearchHistory(workspaceId);
    const entryWithWorkspace = { ...entry, workspaceId: workspaceId || 'default' };
    history.unshift(entryWithWorkspace);
    const limited = history.slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(getHistoryKey(workspaceId), JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save search to history:', error);
  }
};

/**
 * Retrieve all search history from localStorage
 * Returns empty array if no history exists
 * Workspace-isolated retrieval
 */
export const getSearchHistory = (workspaceId?: string): SearchHistoryEntry[] => {
  try {
    const data = localStorage.getItem(getHistoryKey(workspaceId));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve search history:', error);
    return [];
  }
};

/**
 * Clear all search history for a workspace
 */
export const clearSearchHistory = (workspaceId?: string): void => {
  try {
    localStorage.removeItem(getHistoryKey(workspaceId));
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
};

/**
 * Delete a specific history entry by ID
 */
export const deleteHistoryEntry = (
  id: string,
  workspaceId?: string
): void => {
  try {
    const history = getSearchHistory(workspaceId);
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(getHistoryKey(workspaceId), JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history entry:', error);
  }
};

/**
 * Get grouped history by date (Today, Yesterday, This Week, Older)
 */
export const getGroupedHistory = (
  workspaceId?: string
): Record<string, SearchHistoryEntry[]> => {
  const history = getSearchHistory(workspaceId);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const grouped: Record<string, SearchHistoryEntry[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: [],
  };

  history.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

    if (entryDay.getTime() === today.getTime()) {
      grouped.Today.push(entry);
    } else if (entryDay.getTime() === yesterday.getTime()) {
      grouped.Yesterday.push(entry);
    } else if (entryDay > weekAgo) {
      grouped['This Week'].push(entry);
    } else {
      grouped.Older.push(entry);
    }
  });

  return grouped;
};

/**
 * Format timestamp for display
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};
