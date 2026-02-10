import React, { useEffect, useRef, useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  duration,
  title = 'Generated Summary Audio',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setIsLoading(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `voicesearch-summary-${Date.now()}.mp3`;
    link.click();
  };

  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      variant="elevated"
      className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" />

      <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Play/Pause Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.75 1.5a.75.75 0 00-.75.75v15.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V2.25a.75.75 0 00-.75-.75h-1.5zm7 0a.75.75 0 00-.75.75v15.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V2.25a.75.75 0 00-.75-.75h-1.5z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                disabled={isLoading}
              />
              <div className="flex justify-between mt-2 text-sm text-slate-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <svg
                className="w-5 h-5 text-slate-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0118 10a6.972 6.972 0 01-1.929 4.95 1 1 0 01-1.414-1.414A4.972 4.972 0 0016 10c0-1.713-.732-3.231-1.929-4.243a1 1 0 010-1.415z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          disabled={isLoading}
          className="flex-1"
        >
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </Button>
      </div>
    </Card>
  );
};
