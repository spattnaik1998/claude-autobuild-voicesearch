import type { SearchHistoryEntry } from '@/types';

/**
 * Validates a single history entry against the expected schema
 */
export const isValidHistoryEntry = (entry: unknown): entry is SearchHistoryEntry => {
  if (!entry || typeof entry !== 'object') return false;

  const e = entry as Record<string, unknown>;

  // Required fields with type checks
  if (typeof e.id !== 'string') return false;
  if (typeof e.query !== 'string') return false;
  if (typeof e.timestamp !== 'number') return false;
  if (!Array.isArray(e.results)) return false;

  // Optional but validated fields
  if (e.summary !== null && e.summary !== undefined && typeof e.summary !== 'object') return false;
  if (e.questions !== undefined && !Array.isArray(e.questions)) return false;
  if (e.workspaceId !== undefined && typeof e.workspaceId !== 'string') return false;

  return true;
};

/**
 * Attempts to repair a malformed history entry
 * Returns the repaired entry or null if repair is impossible
 */
export const repairEntry = (entry: unknown): SearchHistoryEntry | null => {
  if (!entry || typeof entry !== 'object') return null;

  const e = entry as Record<string, unknown>;

  // Must have minimum required fields
  if (typeof e.id !== 'string' || typeof e.query !== 'string') return null;

  // Try to repair timestamp (convert string to number if needed)
  let timestamp = e.timestamp;
  if (typeof timestamp === 'string') {
    const parsed = parseInt(timestamp, 10);
    timestamp = isNaN(parsed) ? Date.now() : parsed;
  } else if (typeof timestamp !== 'number') {
    timestamp = Date.now();
  }

  // Ensure results is an array
  const results = Array.isArray(e.results) ? e.results : [];

  // Ensure summary is valid or null
  const summary = (e.summary && typeof e.summary === 'object') ? e.summary : null;

  // Ensure questions is an array
  const questions = Array.isArray(e.questions) ? e.questions : [];

  // Ensure workspaceId is present
  const workspaceId = typeof e.workspaceId === 'string' ? e.workspaceId : 'default';

  return {
    id: e.id as string,
    query: e.query as string,
    timestamp: timestamp as number,
    results,
    summary: summary as any,
    questions,
    workspaceId,
  };
};

interface DiagnosticReport {
  totalKeys: number;
  validKeys: number;
  corruptedKeys: string[];
  repairedEntries: number;
  orphanedWorkspaceIds: string[];
  totalEntries: number;
  details: {
    key: string;
    status: 'valid' | 'repaired' | 'corrupted';
    entryCount?: number;
    errorMessage?: string;
  }[];
}

/**
 * Scans all localStorage history keys and reports data integrity
 * Returns a detailed diagnostic report
 */
export const diagnoseStorage = (): DiagnosticReport => {
  const report: DiagnosticReport = {
    totalKeys: 0,
    validKeys: 0,
    corruptedKeys: [],
    repairedEntries: 0,
    orphanedWorkspaceIds: [],
    totalEntries: 0,
    details: [],
  };

  try {
    const HISTORY_KEY_PREFIX = 'voicesearch_history';

    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(HISTORY_KEY_PREFIX)) continue;

      report.totalKeys++;
      const value = localStorage.getItem(key);

      try {
        if (!value) {
          report.corruptedKeys.push(key);
          report.details.push({ key, status: 'corrupted', errorMessage: 'Empty value' });
          continue;
        }

        const entries = JSON.parse(value) as unknown;

        if (!Array.isArray(entries)) {
          report.corruptedKeys.push(key);
          report.details.push({ key, status: 'corrupted', errorMessage: 'Not an array' });
          continue;
        }

        let allValid = true;
        let repairedCount = 0;

        // Validate each entry
        const validatedEntries: SearchHistoryEntry[] = [];
        for (const entry of entries) {
          if (isValidHistoryEntry(entry)) {
            validatedEntries.push(entry);
          } else {
            // Try to repair
            const repaired = repairEntry(entry);
            if (repaired) {
              validatedEntries.push(repaired);
              repairedCount++;
              allValid = false;
            } else {
              allValid = false;
            }
          }
        }

        if (allValid) {
          report.validKeys++;
          report.details.push({ key, status: 'valid', entryCount: entries.length });
        } else if (repairedCount > 0) {
          report.validKeys++;
          report.repairedEntries += repairedCount;
          report.details.push({
            key,
            status: 'repaired',
            entryCount: validatedEntries.length,
            errorMessage: `Repaired ${repairedCount} entries`
          });
        } else {
          report.corruptedKeys.push(key);
          report.details.push({
            key,
            status: 'corrupted',
            errorMessage: 'Unable to repair entries'
          });
        }

        report.totalEntries += validatedEntries.length;
      } catch (error) {
        report.corruptedKeys.push(key);
        report.details.push({
          key,
          status: 'corrupted',
          errorMessage: error instanceof Error ? error.message : 'JSON parse error'
        });
      }
    }
  } catch (error) {
    console.error('Storage diagnostic failed:', error);
  }

  return report;
};

/**
 * Cleans up orphaned localStorage keys (e.g., for deleted workspaces)
 * @param validWorkspaceIds - List of currently valid workspace IDs
 * @param dryRun - If true, only reports what would be deleted
 * @returns List of deleted keys
 */
export const cleanupOrphanedData = (
  validWorkspaceIds: string[],
  dryRun = true
): string[] => {
  const deletedKeys: string[] = [];
  const HISTORY_KEY_PREFIX = 'voicesearch_history';

  try {
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(HISTORY_KEY_PREFIX)) continue;

      // Extract workspaceId from key format: "voicesearch_history_WORKSPACE_ID"
      const workspaceId = key.replace(HISTORY_KEY_PREFIX + '_', '');

      // Check if workspace exists
      if (workspaceId !== 'default' && !validWorkspaceIds.includes(workspaceId)) {
        keysToDelete.push(key);
      }
    }

    // Delete orphaned keys (unless dry run)
    if (!dryRun) {
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
        deletedKeys.push(key);
      });
    }

    return dryRun ? keysToDelete : deletedKeys;
  } catch (error) {
    console.error('Cleanup failed:', error);
    return [];
  }
};

/**
 * Exports all workspace history data as a backup
 * Returns JSON-serializable backup object
 */
export const exportAllHistory = (): Record<string, unknown> => {
  const backup: Record<string, unknown> = {};

  try {
    const HISTORY_KEY_PREFIX = 'voicesearch_history';

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(HISTORY_KEY_PREFIX)) continue;

      const value = localStorage.getItem(key);
      if (value) {
        backup[key] = JSON.parse(value);
      }
    }
  } catch (error) {
    console.error('Export failed:', error);
  }

  return backup;
};

/**
 * Restores history data from a backup
 * @param backup - Backup object from exportAllHistory()
 * @param overwrite - If true, overwrites existing data; if false, merges
 */
export const restoreFromBackup = (
  backup: Record<string, unknown>,
  overwrite = false
): boolean => {
  try {
    if (overwrite) {
      // Clear all existing history
      const HISTORY_KEY_PREFIX = 'voicesearch_history';
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(HISTORY_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    }

    // Restore from backup
    Object.entries(backup).forEach(([key, data]) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to restore ${key}:`, error);
      }
    });

    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
};
