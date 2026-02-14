import React, { useState } from 'react';
import { Button } from './Button';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask anything... (e.g., What is quantum computing?)',
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('Please enter a search query');
      return;
    }

    if (trimmedQuery.length < 2) {
      setError('Query must be at least 2 characters');
      return;
    }

    setError('');
    onSubmit(trimmedQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();

      // Inline validation (extracted from handleSubmit)
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setError('Please enter a search query');
        return;
      }
      if (trimmedQuery.length < 2) {
        setError('Query must be at least 2 characters');
        return;
      }

      setError('');
      onSubmit(trimmedQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            w-full px-5 py-3.5 pr-14
            bg-white dark:bg-slate-800 border-2 rounded-xl
            text-base font-medium text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            transition-all duration-200
            ${
              error
                ? 'border-red-300 dark:border-red-700 focus:border-red-400 dark:focus:border-red-600 focus:ring-red-100 dark:focus:ring-red-900/30'
                : 'border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/30'
            }
            focus:outline-none disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed
          `}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          disabled={isLoading}
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          aria-label="Search"
        >
          {!isLoading && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </Button>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2 transition-colors duration-200">{error}</p>}
    </form>
  );
};
