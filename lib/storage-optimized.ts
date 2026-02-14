import type { SearchHistoryEntry } from '@/types';
import { saveSearchToHistory } from './storage';

const DEBOUNCE_DELAY = 300; // ms

interface PendingWrite {
  entry: SearchHistoryEntry;
  workspaceId?: string;
}

// Queue of pending writes keyed by workspace
const pendingWrites = new Map<string, PendingWrite>();
const timeoutIds = new Map<string, NodeJS.Timeout>();

/**
 * Debounced version of saveSearchToHistory
 * Batches multiple writes within a 300ms window
 * Flushes immediately on page unload
 */
export const saveSearchToHistoryDebounced = (
  entry: SearchHistoryEntry,
  workspaceId?: string
): void => {
  const wsId = workspaceId || 'default';

  // Queue the write
  pendingWrites.set(wsId, { entry, workspaceId });

  // Clear existing timeout if present
  const existingTimeout = timeoutIds.get(wsId);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Set new debounce timeout
  const timeoutId = setTimeout(() => {
    flushPendingWrites(wsId);
  }, DEBOUNCE_DELAY);

  timeoutIds.set(wsId, timeoutId);
};

/**
 * Flushes pending writes for a specific workspace
 */
const flushPendingWrites = (workspaceId: string): void => {
  const pending = pendingWrites.get(workspaceId);
  if (!pending) return;

  try {
    saveSearchToHistory(pending.entry, pending.workspaceId);
  } catch (error) {
    console.error(`Failed to flush pending writes for workspace ${workspaceId}:`, error);
  } finally {
    pendingWrites.delete(workspaceId);
    timeoutIds.delete(workspaceId);
  }
};

/**
 * Flushes all pending writes immediately
 * Called on page unload to ensure no data loss
 */
export const flushAllPendingWrites = (): void => {
  // Clear all timeouts
  timeoutIds.forEach(timeout => clearTimeout(timeout));
  timeoutIds.clear();

  // Flush all pending writes
  pendingWrites.forEach((_, workspaceId) => {
    flushPendingWrites(workspaceId);
  });
};

/**
 * Cancel pending writes for a workspace
 * Useful for cleanup or if operation is no longer needed
 */
export const cancelPendingWrites = (workspaceId: string): void => {
  const wsId = workspaceId || 'default';

  // Clear timeout
  const timeout = timeoutIds.get(wsId);
  if (timeout) {
    clearTimeout(timeout);
    timeoutIds.delete(wsId);
  }

  // Remove from queue
  pendingWrites.delete(wsId);
};

/**
 * Gets the number of pending writes (for debugging)
 */
export const getPendingWriteCount = (): number => {
  return pendingWrites.size;
};

// Setup page unload handler to flush pending writes
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushAllPendingWrites);
  window.addEventListener('unload', flushAllPendingWrites);
}

// Also handle visibility change (page minimized, tab switch, etc.)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      flushAllPendingWrites();
    }
  });
}
