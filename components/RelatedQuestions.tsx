import React, { useState } from 'react';
import { Card } from './Card';

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isLoading?: boolean;
}

export const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
  questions,
  onQuestionClick,
  isLoading = false,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleQuestionClick = (question: string, index: number) => {
    setSelectedQuestion(index);
    onQuestionClick(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent, question: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleQuestionClick(question, index);
    }
  };

  if (questions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card
      variant="elevated"
      className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 dark:from-teal-500 to-teal-700 dark:to-teal-600 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Related Questions</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-300">
            Explore different aspects of this topic
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gradient-to-r from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-600 rounded-lg animate-pulse transition-colors duration-300"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question, index)}
              onKeyDown={(e) => handleKeyDown(e, question, index)}
              disabled={selectedQuestion !== null}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${
                  selectedQuestion === index
                    ? 'border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/30 shadow-md dark:shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-sm dark:hover:shadow-md'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 dark:focus:ring-offset-slate-800
              `}
              style={{
                animation: isLoading ? 'none' : `slideIn 0.3s ease-out ${index * 50}ms backwards`,
                animationFillMode: 'both',
              }}
              tabIndex={0}
              role="button"
              aria-label={`Search for: ${question}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm font-semibold mt-0.5 transition-colors duration-300">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    {question}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      selectedQuestion === index
                        ? 'text-teal-600 dark:text-teal-400 rotate-45'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center transition-colors duration-300">
          💡 Click any question to explore it with a new search
        </p>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
};
