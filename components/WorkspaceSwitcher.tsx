'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useToast } from '@/lib/hooks';

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceIcon, setNewWorkspaceIcon] = useState('📁');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
    createWorkspace,
    deleteWorkspace,
    toggleFavorite,
  } = useWorkspaceStore();

  const activeWorkspace = workspaces.find((ws) => ws.id === activeWorkspaceId);
  const favoriteWorkspaces = workspaces.filter((ws) => ws.isFavorite && !ws.isArchived);
  const otherWorkspaces = workspaces.filter(
    (ws) => !ws.isFavorite && !ws.isArchived
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { success: showSuccess, error: showError } = useToast();

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      showError('Workspace name is required');
      return;
    }

    createWorkspace(newWorkspaceName, newWorkspaceIcon);
    setNewWorkspaceName('');
    setNewWorkspaceIcon('📁');
    setShowCreateDialog(false);
    setIsOpen(false);
    showSuccess(`Created workspace "${newWorkspaceName}"`);
  };

  const handleDeleteWorkspace = (id: string) => {
    const workspace = workspaces.find((ws) => ws.id === id);
    if (workspace) {
      deleteWorkspace(id);
      showSuccess(`Deleted workspace "${workspace.name}"`);
    }
  };

  const iconEmojis = ['📁', '🏠', '💼', '🎓', '📚', '🔬', '🎯', '🚀', '💡'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Workspace Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="text-lg">{activeWorkspace?.icon}</span>
        <span className="font-medium text-sm text-slate-900 dark:text-white hidden sm:inline max-w-[120px] truncate">
          {activeWorkspace?.name}
        </span>
        <span className="text-slate-400 dark:text-slate-500">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Favorites Section */}
          {favoriteWorkspaces.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                Favorites
              </div>
              {favoriteWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    activeWorkspaceId === ws.id
                      ? 'bg-teal-50 dark:bg-teal-900/20'
                      : ''
                  }`}
                >
                  <span className="text-lg">{ws.icon}</span>
                  <span className="flex-1 font-medium text-sm text-slate-900 dark:text-white">
                    {ws.name}
                  </span>
                  {activeWorkspaceId === ws.id && (
                    <span className="text-teal-600 dark:text-teal-400">✓</span>
                  )}
                </button>
              ))}
            </>
          )}

          {/* Other Workspaces Section */}
          {otherWorkspaces.length > 0 && (
            <>
              {favoriteWorkspaces.length > 0 && (
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
              )}
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                Workspaces
              </div>
              {otherWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <button
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left flex items-center gap-3"
                  >
                    <span className="text-lg">{ws.icon}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {ws.name}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(ws.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    title="Add to favorites"
                  >
                    ★
                  </button>
                  <button
                    onClick={() => handleDeleteWorkspace(ws.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                    title="Delete workspace"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* Create New Workspace */}
          <button
            onClick={() => setShowCreateDialog(!showCreateDialog)}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-teal-600 dark:text-teal-400 font-medium text-sm"
          >
            <span>➕</span>
            <span>New Workspace</span>
          </button>

          {/* Create Workspace Dialog */}
          {showCreateDialog && (
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <div className="mb-3">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g., AI Research"
                  className="w-full px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {iconEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewWorkspaceIcon(emoji)}
                      className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
                        newWorkspaceIcon === emoji
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-teal-400'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreateWorkspace}
                  className="flex-1 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded font-medium transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-sm rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
