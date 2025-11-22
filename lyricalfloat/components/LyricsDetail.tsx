import React from 'react';
import { Song } from '../types';
import { Button } from './Button';

interface LyricsDetailProps {
  song: Song;
  onBack: () => void;
  onToggleOverlay: () => void;
}

export const LyricsDetail: React.FC<LyricsDetailProps> = ({
  song,
  onBack,
  onToggleOverlay
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>}
          >
            Back
          </Button>
          
          <div className="text-center flex-1 px-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{song.song_info.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{song.song_info.artist}</p>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onToggleOverlay}
            title="Open Floating Window"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>}
          >
            <span className="hidden sm:inline">Float</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">
          {song.lyrics.map((section, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full transition-colors">
                  {section.section}
                </h3>
                <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1 transition-colors"></div>
              </div>

              <div className="space-y-6">
                {section.lines.map((line, j) => (
                  <div key={j} className="group">
                    <p className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-gray-100 leading-snug mb-2 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400">
                      {line.en}
                    </p>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed transition-colors">
                      {line.ko}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="h-20 flex items-center justify-center text-gray-300 dark:text-gray-700 text-sm">
            End of Lyrics
          </div>
        </div>
      </div>
    </div>
  );
};