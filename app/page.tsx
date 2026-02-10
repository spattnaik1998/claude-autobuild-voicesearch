'use client';

import { useState } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { SummaryCard } from '@/components/SummaryCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/Button';
import type { SearchResult, SummaryResponse, TTSResponse } from '@/types';

type Stage = 'input' | 'results' | 'summary' | 'audio';

export default function Home() {
  const [stage, setStage] = useState<Stage>('input');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [audioData, setAudioData] = useState<TTSResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setError(null);
    setIsSearching(true);
    setQuery(searchQuery);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results);
      setStage('results');

      // Auto-summarize
      await handleSummarize(data.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to perform search'
      );
      setStage('input');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSummarize = async (results: SearchResult[]) => {
    setIsSummarizing(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Summarization failed');
      }

      const data = await response.json();
      setSummary(data);
      setStage('summary');

      // Auto-generate audio
      await handleGenerateAudio(data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to summarize results'
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateAudio = async (summaryText: string) => {
    setIsGeneratingAudio(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summaryText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Audio generation failed');
      }

      const data = await response.json();
      setAudioData(data);
      setStage('audio');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate audio'
      );
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleReset = () => {
    setStage('input');
    setQuery('');
    setSearchResults(null);
    setSummary(null);
    setAudioData(null);
    setError(null);
  };

  const stageIndicators = [
    { label: 'Search', icon: '🔍', active: stage === 'input' },
    {
      label: 'Results',
      icon: '📋',
      active: ['results', 'summary', 'audio'].includes(stage),
    },
    {
      label: 'Summary',
      icon: '✨',
      active: ['summary', 'audio'].includes(stage),
    },
    { label: 'Audio', icon: '🔊', active: stage === 'audio' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            VoiceSearch Insights
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Search any topic, get AI-powered summaries, and listen to them
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <ErrorMessage
              title="Something went wrong"
              message={error}
              onRetry={() => setError(null)}
              dismissible
            />
          </div>
        )}

        {/* Progress Indicator */}
        {stage !== 'input' && (
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {stageIndicators.map((item, idx) => (
                <div key={idx} className="flex items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      font-semibold text-lg transition-all
                      ${
                        item.active
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-slate-200 text-slate-600'
                      }
                    `}
                  >
                    {item.icon}
                  </div>
                  <p className="text-xs font-medium text-slate-600 ml-2 hidden sm:block">
                    {item.label}
                  </p>
                  {idx < stageIndicators.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2 rounded-full
                        ${item.active ? 'bg-blue-500' : 'bg-slate-200'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Stages */}
        <div className="relative">
          {/* Stage 1: Search Input */}
          {stage === 'input' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <SearchInput onSubmit={handleSearch} isLoading={isSearching} />
            </div>
          )}

          {/* Stage 2: Results */}
          {stage === 'results' && searchResults && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Search Results for &quot;{query}&quot;
                </h2>
                <SearchResults results={searchResults} isLoading={false} />
              </div>
              {isSummarizing && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner message="Creating summary..." />
                </div>
              )}
            </div>
          )}

          {/* Stage 3: Summary */}
          {stage === 'summary' && summary && (
            <div className="space-y-8">
              {isGeneratingAudio && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner message="Generating audio..." />
                </div>
              )}
              {!isGeneratingAudio && <SummaryCard summary={summary} />}
            </div>
          )}

          {/* Stage 4: Audio */}
          {stage === 'audio' && audioData && summary && (
            <AudioPlayer
              audioUrl={audioData.audioUrl}
              duration={audioData.duration}
              title="AI Summary Audio"
            />
          )}
        </div>

        {/* Reset Button */}
        {stage !== 'input' && (
          <div className="flex justify-center mt-12">
            <Button variant="ghost" size="md" onClick={handleReset}>
              ← New Search
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
