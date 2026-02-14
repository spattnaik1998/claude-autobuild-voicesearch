'use client';

import { useState, useCallback } from 'react';
import { generateShareUrl, copyUrlToClipboard } from '@/lib/url-state';
import { Button } from './Button';

interface ShareButtonProps {
  query: string;
}

export function ShareButton({ query }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const shareUrl = generateShareUrl({ query });
      const success = await copyUrlToClipboard(shareUrl);

      if (success) {
        setCopied(true);
        // Reset after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleShare}
      disabled={isLoading || !query.trim()}
      className={`relative transition-all duration-200 ${
        copied ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : ''
      }`}
    >
      <span className="flex items-center gap-2">
        {copied ? (
          <>
            <svg
              className="w-4 h-4 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Copied!
          </>
        ) : (
          <>
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
                d="M8.684 13.342C9.589 12.938 10 12.07 10 11.25c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .82.411 1.688 1.316 2.092m0 0a9 9 0 019.999-1.464m0 0A8.997 8.997 0 0012 20.1a8.997 8.997 0 01.001-7.08m0 0H12m0 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Share
          </>
        )}
      </span>

      {/* Toast Notification */}
      {copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
          Link copied to clipboard!
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-600" />
        </div>
      )}
    </Button>
  );
}
