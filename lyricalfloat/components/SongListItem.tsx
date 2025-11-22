import React from 'react';
import { Song } from '../types';

interface SongListItemProps {
  song: Song;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onMoveUp: (e: React.MouseEvent) => void;
  onMoveDown: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SongListItem: React.FC<SongListItemProps> = ({
  song,
  index,
  isActive,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast
}) => {
  return (
    <div 
      onClick={onSelect}
      className={`
        group relative flex items-center p-4 mb-3 rounded-xl border transition-all cursor-pointer
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900' 
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow'
        }
      `}
    >
      {/* Track Number */}
      <div className={`
        w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4 shrink-0 transition-colors
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }
      `}>
        {index + 1}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 mr-4">
        <h3 className={`font-semibold truncate transition-colors ${
          isActive 
            ? 'text-blue-900 dark:text-blue-100' 
            : 'text-gray-900 dark:text-white'
        }`}>
          {song.song_info.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {song.song_info.artist}
        </p>
      </div>

      {/* Controls - Visible on hover/active or always on mobile */}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1 mr-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onMoveUp(e); }}
            disabled={isFirst}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-0"
            title="Move Up"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMoveDown(e); }}
            disabled={isLast}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-0"
            title="Move Down"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(e); }}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors"
          title="Delete"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
  );
};