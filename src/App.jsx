import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import LyricsDisplay from './components/LyricsDisplay';
import SongList from './components/SongList';
import { fetchLyrics, searchSongs } from './api/lyrics';
import { getTheme } from './utils/themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [view, setView] = useState('search'); // 'search', 'list', 'lyrics'
  const [searchResults, setSearchResults] = useState([]);
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getTheme('unknown'));

  // Update theme when song data changes
  useEffect(() => {
    if (songData && songData.genre) {
      setTheme(getTheme(songData.genre));
    } else {
      setTheme(getTheme('unknown'));
    }
  }, [songData]);

  const handleSearch = async (query) => {
    console.log("🔍 App: handleSearch called with:", query);
    setLoading(true);
    setError('');
    setSongData(null);
    setSearchResults([]);

    try {
      const results = await searchSongs(query);
      console.log("🔍 App: searchSongs returned:", results);
      if (results.length === 0) {
        setError('No songs found.');
      } else {
        setSearchResults(results);
        setView('list');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = async (song) => {
    setLoading(true);
    setError('');

    try {
      // Use the selected song's artist and title to fetch full lyrics/metadata
      const data = await fetchLyrics(song.artistName, song.trackName, song);
      setSongData(data);
      setView('lyrics');
    } catch (err) {
      setError("Could not load lyrics for this song. Try another version.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (view === 'lyrics') {
      setView('list');
      setSongData(null);
    } else if (view === 'list') {
      setView('search');
      setSearchResults([]);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-4 font-sans text-white overflow-hidden relative transition-colors duration-1000 ease-in-out ${theme.background}`}>

      {/* Immersive Album Art Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence>
          {songData && songData.artwork && (
            <motion.div
              key={songData.artwork}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center blur-[100px] scale-110"
              style={{ backgroundImage: `url(${songData.artwork})` }}
            />
          )}
        </AnimatePresence>

        {/* Fallback Ambient Animation with Illustrations */}
        {!songData?.artwork && (
          <>
            {/* Gradient orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-pink-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

            {/* Abstract music waves - Left side */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[50%] max-w-2xl"
            >
              <img
                src={`${import.meta.env.BASE_URL}music-left.svg`}
                alt=""
                className="w-full h-auto"
                style={{ filter: 'drop-shadow(0 0 60px rgba(167, 139, 250, 0.4))' }}
              />
            </motion.div>

            {/* Abstract equalizer - Right side */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[50%] max-w-2xl"
            >
              <img
                src={`${import.meta.env.BASE_URL}music-right.svg`}
                alt=""
                className="w-full h-auto"
                style={{ filter: 'drop-shadow(0 0 60px rgba(251, 146, 60, 0.4))' }}
              />
            </motion.div>
          </>
        )}

        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full flex flex-col items-center max-w-5xl"
      >
        <header className="mb-12 text-center relative w-full">
          {view !== 'search' && (
            <button
              onClick={handleBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-2 drop-shadow-lg">
            Lyrics Finder
          </h1>
          <p className="text-white/80 text-lg font-light tracking-wide uppercase">
            {songData ? `${songData.genre} • ${theme.vibe}` : 'Discover the words'}
          </p>
        </header>

        {/* Search bar - always visible */}
        <SearchForm onSearch={handleSearch} loading={loading} theme={theme} />

        {/* Debug Info */}
        <div className="mt-4 p-4 bg-black/20 rounded-lg text-white text-xs">
          <div>View: {view}</div>
          <div>Results: {searchResults.length}</div>
          <div>Loading: {loading.toString()}</div>
          <button
            onClick={() => console.log({ view, searchResults, songData })}
            className="mt-2 px-3 py-1 bg-white/10 rounded"
          >
            Log State
          </button>
        </div>

        {view === 'list' && (
          <SongList songs={searchResults} onSelect={handleSelectSong} theme={theme} />
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 font-medium flex items-center gap-2 backdrop-blur-md"
            >
              <span>⚠️ {error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {view === 'lyrics' && (
          <LyricsDisplay data={songData} theme={theme} onBack={handleBack} />
        )}
      </motion.div>
    </div>
  );
}

export default App;
