import React, { useRef, useEffect } from 'react';
import { Song } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface FloatingLyricsProps {
  song: Song;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const FloatingLyrics: React.FC<FloatingLyricsProps> = ({
  song,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  const { position, handleMouseDown, isDragging } = useDraggable({ x: 20, y: 100 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll on song change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [song.id]);

  return (
    <div
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 9999,
        touchAction: 'none' // Important for drag
      }}
      className={`
        fixed w-72 md:w-80 h-96 
        bg-white/95 dark:bg-gray-900/95 
        backdrop-blur-sm rounded-2xl shadow-2xl 
        border border-gray-200 dark:border-gray-700 
        flex flex-col overflow-hidden 
        text-gray-900 dark:text-white 
        transition-all duration-200
        ${isDragging ? 'shadow-none cursor-grabbing' : 'shadow-2xl cursor-auto'}
      `}
    >
      {/* Header / Drag Handle */}
      <div 
        className="h-10 bg-gray-100/90 dark:bg-gray-800/50 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none border-b border-gray-200 dark:border-gray-700 transition-colors"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
           <span>Drag</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scroll" ref={scrollRef}>
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg leading-tight">{song.song_info.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{song.song_info.artist}</p>
        </div>

        {song.lyrics.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-2 opacity-80">
              {section.section}
            </h4>
            {section.lines.map((line, lIdx) => (
              <div key={lIdx} className="mb-3 last:mb-0">
                <p className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">{line.en}</p>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mt-0.5">{line.ko}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="h-12 bg-gray-100/90 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 transition-colors">
        <button 
          onClick={onPrev}
          disabled={!hasPrev}
          className="p-2 text-gray-400 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
        </button>
        
        <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">Overlay Mode</span>

        <button 
          onClick={onNext}
          disabled={!hasNext}
          className="p-2 text-gray-400 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
        </button>
      </div>
    </div>
  );
};