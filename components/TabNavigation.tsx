import React from 'react';

interface TabNavigationProps {
  activeTab: 'results' | 'summary' | 'questions';
  onTabChange: (tab: 'results' | 'summary' | 'questions') => void;
  hasResults: boolean;
  hasSummary: boolean;
  hasQuestions: boolean;
  resultCount?: number;
  questionCount?: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  hasResults,
  hasSummary,
  hasQuestions,
  resultCount = 0,
  questionCount = 0,
}) => {
  const tabs: Array<{
    id: 'results' | 'summary' | 'questions';
    label: string;
    icon: string;
    enabled: boolean;
    count?: number;
  }> = [
    {
      id: 'results',
      label: 'Results',
      icon: '📋',
      enabled: hasResults,
      count: resultCount,
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: '✨',
      enabled: hasSummary,
    },
    {
      id: 'questions',
      label: 'Questions',
      icon: '❓',
      enabled: hasQuestions,
      count: questionCount,
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const enabledTabs = tabs.filter((t) => t.enabled).map((t) => t.id);
    const currentIndex = enabledTabs.indexOf(tabId as any);

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex =
        currentIndex === 0 ? enabledTabs.length - 1 : currentIndex - 1;
      onTabChange(enabledTabs[prevIndex] as any);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex =
        currentIndex === enabledTabs.length - 1 ? 0 : currentIndex + 1;
      onTabChange(enabledTabs[nextIndex] as any);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tabId as any);
    }
  };

  return (
    <div className="mb-8 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            disabled={!tab.enabled}
            className={`
              px-4 py-3 font-medium text-sm transition-all duration-200
              flex items-center gap-2 relative
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 dark:focus:ring-offset-slate-800
              ${
                !tab.enabled
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : activeTab === tab.id
                    ? 'text-teal-700 dark:text-teal-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'
              }
            `}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={!tab.enabled}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }
                `}
              >
                {tab.count}
              </span>
            )}
            {/* Animated underline indicator */}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 dark:from-teal-400 to-teal-600 dark:to-teal-500 transition-all duration-300"
                style={{
                  animation: 'slideUnderline 0.3s ease-out',
                }}
              />
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideUnderline {
          from {
            opacity: 0;
            transform: scaleX(0.8);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};
