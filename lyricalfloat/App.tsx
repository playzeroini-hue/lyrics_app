import React, { useState, useEffect, useCallback } from 'react';
import { Song, ImportedSong } from './types';
import { DEMO_SONG } from './constants';
import { SongListItem } from './components/SongListItem';
import { LyricsDetail } from './components/LyricsDetail';
import { FloatingLyrics } from './components/FloatingLyrics';
import { Button } from './components/Button';

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Load from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lyrical_songs');
    if (stored) {
      try {
        setSongs(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse songs", e);
        setSongs([DEMO_SONG]);
      }
    } else {
      setSongs([DEMO_SONG]);
    }
  }, []);

  // Persist to storage
  useEffect(() => {
    if (songs.length > 0) {
      localStorage.setItem('lyrical_songs', JSON.stringify(songs));
    }
  }, [songs]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          
          // Handle both single object and array input
          const importList = Array.isArray(parsed) ? parsed : [parsed];
          
          const newSongs: Song[] = importList.map((item: ImportedSong) => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            order: item.order || 0
          }));

          setSongs(prev => [...prev, ...newSongs]);
        } catch (err) {
          alert(`Error parsing file ${file.name}: Invalid JSON`);
        }
      };
      reader.readAsText(file);
    });
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === songs.length - 1) return;

    const newSongs = [...songs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSongs[targetIndex];
    newSongs[targetIndex] = newSongs[index];
    newSongs[index] = temp;
    
    setSongs(newSongs);
  };

  const deleteSong = (id: string) => {
    if (confirm('Delete this song?')) {
      setSongs(prev => prev.filter(s => s.id !== id));
      if (currentSongId === id) {
        setCurrentSongId(null);
        setViewMode('list');
        setIsOverlayOpen(false);
      }
    }
  };

  const handleSelectSong = (id: string) => {
    setCurrentSongId(id);
    setViewMode('detail');
  };

  const activeSongIndex = songs.findIndex(s => s.id === currentSongId);
  const activeSong = songs[activeSongIndex];

  const handleNext = useCallback(() => {
    if (activeSongIndex < songs.length - 1) {
      setCurrentSongId(songs[activeSongIndex + 1].id);
    }
  }, [activeSongIndex, songs]);

  const handlePrev = useCallback(() => {
    if (activeSongIndex > 0) {
      setCurrentSongId(songs[activeSongIndex - 1].id);
    }
  }, [activeSongIndex, songs]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Floating Overlay - Rendered at Root Level if active */}
      {isOverlayOpen && activeSong && (
        <FloatingLyrics
          song={activeSong}
          onClose={() => setIsOverlayOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={activeSongIndex < songs.length - 1}
          hasPrev={activeSongIndex > 0}
        />
      )}

      {/* Main Content Switcher */}
      {viewMode === 'list' ? (
        <div className="max-w-3xl mx-auto min-h-screen flex flex-col">
          {/* Playlist Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5 sticky top-0 z-10 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Playlist</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{songs.length} songs loaded</p>
              </div>
              <div className="flex items-center gap-2">
                 <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Toggle Theme"
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  )}
                </button>

                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="primary" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>}
                  >
                    Import JSON
                  </Button>
                </div>
              </div>
            </div>
            
            {activeSong && (
              <div 
                onClick={() => setViewMode('detail')}
                className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Now Playing: <span className="font-bold">{activeSong.song_info.title}</span></span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-300 font-semibold uppercase">Resume</span>
              </div>
            )}
          </div>

          {/* Song List */}
          <div className="flex-1 p-4 sm:p-6">
            {songs.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-200">No songs yet.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Import a JSON file to get started.</p>
              </div>
            ) : (
              songs.map((song, idx) => (
                <SongListItem
                  key={song.id}
                  index={idx}
                  song={song}
                  isActive={song.id === currentSongId}
                  onSelect={() => handleSelectSong(song.id)}
                  onMoveUp={(e) => { e.stopPropagation(); moveSong(idx, 'up'); }}
                  onMoveDown={(e) => { e.stopPropagation(); moveSong(idx, 'down'); }}
                  onDelete={(e) => { e.stopPropagation(); deleteSong(song.id); }}
                  isFirst={idx === 0}
                  isLast={idx === songs.length - 1}
                />
              ))
            )}
          </div>
        </div>
      ) : activeSong ? (
        <LyricsDetail 
          song={activeSong} 
          onBack={() => setViewMode('list')}
          onToggleOverlay={() => setIsOverlayOpen(!isOverlayOpen)}
        />
      ) : (
        // Fallback if state gets weird
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          <p>Song not found.</p>
          <Button onClick={() => setViewMode('list')}>Go Back</Button>
        </div>
      )}
    </div>
  );
}