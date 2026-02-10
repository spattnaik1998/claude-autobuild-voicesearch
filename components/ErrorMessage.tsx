import React, { useState } from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
  dismissible?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onRetry,
  dismissible = true,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button size="sm" variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            )}
            {dismissible && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsDismissed(true)}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
