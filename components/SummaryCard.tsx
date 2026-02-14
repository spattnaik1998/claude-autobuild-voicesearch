import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { SummaryResponse } from '@/types';

interface SummaryCardProps {
  summary: SummaryResponse;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${summary.summary}\n\nKey Points:\n${summary.keyPoints.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      variant="elevated"
      className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300 border-l-4 border-l-teal-600 dark:border-l-teal-500"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Summary</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? (
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </Button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 md:p-6 mb-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base transition-colors duration-300">
          {summary.summary}
        </p>
      </div>

      {summary.keyPoints.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3 transition-colors duration-300">
            Key Points
          </h3>
          <ul className="space-y-2">
            {summary.keyPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300"
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 80}ms backwards`,
                }}
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold transition-colors duration-300">
                  {idx + 1}
                </span>
                <span className="flex-1 pt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM6 6a1 1 0 000 2h8a1 1 0 100-2H6zM6 10a1 1 0 000 2h8a1 1 0 100-2H6zM2 13a1 1 0 011-1h14a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1v-4z" />
          </svg>
          <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
            {summary.wordCount} words
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Card>
  );
};
