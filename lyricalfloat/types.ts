export interface LyricLine {
  en: string;
  ko: string;
}

export interface LyricSection {
  section: string;
  lines: LyricLine[];
}

export interface SongInfo {
  title: string;
  artist: string;
  genre?: string;
}

export interface Song {
  id: string; // Internal ID for React keys
  song_info: SongInfo;
  order?: number;
  lyrics: LyricSection[];
}

// For JSON Import (User provided structure might not have ID)
export interface ImportedSong {
  song_info: SongInfo;
  order?: number;
  lyrics: LyricSection[];
}