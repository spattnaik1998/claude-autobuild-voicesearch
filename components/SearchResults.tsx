import React from 'react';
import { Card } from './Card';
import { SearchResult } from '@/types';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-3 md:gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 rounded-lg h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-12 h-12 text-slate-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-slate-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {results.map((result, idx) => (
        <Card
          key={idx}
          variant="highlighted"
          hoverable
          className="p-4 md:p-5"
          style={{
            animationDelay: `${idx * 50}ms`,
          }}
        >
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {result.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 group-hover:text-slate-700">
              {result.description || result.snippet}
            </p>
            <p className="text-xs text-blue-600 font-medium mt-3 group-hover:underline truncate">
              {new URL(result.url).hostname}
            </p>
          </a>
        </Card>
      ))}
    </div>
  );
};
