import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Disc, Music2, Copy, Check, Mic2, Play, Pause, RotateCcw, Upload, Sliders } from 'lucide-react';
import * as Tone from 'tone';

// Helper to parse LRC format: "[mm:ss.xx] Lyrics" -> { time: 12.34, text: "Lyrics" }
const parseLRC = (lrcString) => {
  if (!lrcString) return [];
  const lines = lrcString.split('\n');
  const result = [];

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach(line => {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      const totalSeconds = minutes * 60 + seconds + milliseconds / 100;
      const text = line.replace(timeRegex, '').trim();
      if (text) {
        result.push({ time: totalSeconds, text });
      }
    }
  });
  return result;
};

const LyricsDisplay = ({ data, theme }) => {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('text'); // 'text' or 'karaoke'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [pitch, setPitch] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  const playerRef = useRef(null);
  const pitchShiftRef = useRef(null);
  const scrollRef = useRef(null);

  // Destructure safely, but don't return yet
  const { lyrics, syncedLyrics, title, artist, artwork, youtubeUrl } = data || {};

  // Parse synced lyrics when data changes
  useEffect(() => {
    if (syncedLyrics) {
      setParsedLyrics(parseLRC(syncedLyrics));
    } else {
      setParsedLyrics([]);
    }
    // Reset state on new song
    setMode('text');
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioFile(null);
    setIsAudioLoaded(false);
    setPitch(0);

    // Cleanup old audio
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    if (pitchShiftRef.current) {
      pitchShiftRef.current.dispose();
      pitchShiftRef.current = null;
    }
  }, [syncedLyrics, title]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) playerRef.current.dispose();
      if (pitchShiftRef.current) pitchShiftRef.current.dispose();
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("🎤 Audio file selected:", file.name);
      setAudioFile(file);
      setIsAudioLoaded(false);

      await Tone.start();

      const url = URL.createObjectURL(file);

      if (playerRef.current) playerRef.current.dispose();
      if (pitchShiftRef.current) pitchShiftRef.current.dispose();

      const newPitchShift = new Tone.PitchShift(pitch).toDestination();
      const newPlayer = new Tone.Player(url).connect(newPitchShift);

      // Sync player state
      newPlayer.autostart = false;
      await newPlayer.loaded;

      playerRef.current = newPlayer;
      pitchShiftRef.current = newPitchShift;
      setIsAudioLoaded(true);
      console.log("✅ Audio loaded and ready");

      // Auto-switch to karaoke mode and play
      setMode('karaoke');
      setIsPlaying(true);
    }
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      // If audio is loaded, we should try to sync with it, but Tone.Player doesn't emit time events easily.
      // We'll stick to the interval for UI updates.
      // Ideally, we'd check playerRef.current.now() but that's AudioContext time.

      const startTime = Date.now() - currentTime * 1000;
      interval = setInterval(() => {
        // If audio is playing, we could try to re-sync if drifted, but for now simple timer is okay.
        setCurrentTime((Date.now() - startTime) / 1000);
      }, 100);

      if (playerRef.current && isAudioLoaded && playerRef.current.state !== 'started') {
        playerRef.current.start(undefined, currentTime);
      }
    } else {
      clearInterval(interval);
      if (playerRef.current && playerRef.current.state === 'started') {
        playerRef.current.stop();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, isAudioLoaded]); // Removed currentTime from dependency to avoid re-triggering start()

  // Pitch Effect Update
  useEffect(() => {
    if (pitchShiftRef.current) {
      console.log("🎚️ Pitch changed to:", pitch);
      pitchShiftRef.current.pitch = pitch;
    }
  }, [pitch]);

  // Auto-scroll logic
  useEffect(() => {
    if (mode === 'karaoke' && isPlaying && scrollRef.current) {
      const activeIndex = parsedLyrics.findIndex(line => line.time > currentTime) - 1;
      if (activeIndex >= 0) {
        const activeElement = scrollRef.current.children[activeIndex];
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentTime, mode, isPlaying, parsedLyrics]);


  const handleCopy = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const togglePlay = async () => {
    if (!isPlaying && !isAudioLoaded && !audioFile) {
      // Just timer mode
    }

    // Resume AudioContext if needed (browser policy)
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }

    setIsPlaying(!isPlaying);
    console.log("⏯️ Playback state:", !isPlaying ? "Playing" : "Paused");
  };

  const resetKaraoke = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  // NOW we can return null if no data
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mt-12 flex flex-col md:flex-row gap-10 items-start"
    >
      {/* Album Art & Metadata Panel */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 sticky top-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square"
        >
          {artwork ? (
            <img src={artwork} alt={`${title} Album Art`} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${theme.glass}`}>
              <Disc size={80} className="text-white/20" />
            </div>
          )}
        </motion.div>

        <div className={`p-8 rounded-3xl shadow-xl text-center ${theme.glass}`}>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight mb-2">{title}</h2>
          <p className="text-white/70 font-medium text-lg mb-6">{artist}</p>

          <div className="flex flex-col gap-3">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-red-600/40"
            >
              <Youtube size={20} className="fill-white" />
              <span className="text-sm tracking-wide">WATCH VIDEO</span>
            </a>

            <a
              href="https://pixabay.com/music/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-green-600/40"
            >
              <Music2 size={20} className="fill-white" />
              <span className="text-sm tracking-wide">FREE MUSIC</span>
            </a>

            <div className="flex gap-2">
              <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all backdrop-blur-md cursor-pointer">
                <Upload size={18} />
                <span className="text-xs tracking-wide">LOAD AUDIO</span>
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={handleCopy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all backdrop-blur-md"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                <span className="text-xs tracking-wide">{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {syncedLyrics ? (
              <button
                onClick={() => setMode(mode === 'text' ? 'karaoke' : 'text')}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-full transition-all backdrop-blur-md ${mode === 'karaoke' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                <Mic2 size={18} />
                <span className="text-xs tracking-wide">KARAOKE MODE</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/30 font-bold rounded-full cursor-not-allowed"
                title="Karaoke not available for this song"
              >
                <Mic2 size={18} />
                <span className="text-xs tracking-wide">NO KARAOKE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics Panel */}
      <div className={`w-full md:w-2/3 p-10 md:p-14 rounded-3xl shadow-2xl min-h-[60vh] max-h-[80vh] relative overflow-hidden flex flex-col ${theme.glass}`}>

        {/* Decorative Icon */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
          <Music2 size={100} />
        </div>

        {/* Karaoke Controls */}
        {mode === 'karaoke' && (
          <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-white/10 z-20">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold font-mono text-white/80">
                {new Date(currentTime * 1000).toISOString().substr(14, 5)}
              </div>
              <div className="flex gap-4">
                <button onClick={togglePlay} className="p-4 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-lg">
                  {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                </button>
                <button onClick={resetKaraoke} className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex flex-col gap-2 bg-black/20 p-4 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Sliders size={16} className="text-white/60" />
                  <span className="text-xs font-bold text-white/60">PITCH: {pitch > 0 ? `+${pitch}` : pitch}</span>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={pitch}
                    onChange={(e) => setPitch(parseInt(e.target.value))}
                    className="flex-1 accent-purple-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lyrics Content */}
        <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
          {mode === 'text' ? (
            <div className="text-white/90 whitespace-pre-wrap leading-loose font-serif text-xl md:text-2xl text-center tracking-wide pb-10">
              {lyrics}
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-10 text-center px-4">
              {parsedLyrics.map((line, index) => {
                const isActive = currentTime >= line.time && (index === parsedLyrics.length - 1 || currentTime < parsedLyrics[index + 1].time);
                const isPast = currentTime > line.time;

                return (
                  <motion.div
                    key={index}
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      opacity: isActive ? 1 : isPast ? 0.3 : 0.5,
                      color: isActive ? '#ffffff' : '#a3a3a3',
                      filter: isActive ? 'blur(0px)' : 'blur(0.5px)'
                    }}
                    className={`font-bold text-xl md:text-3xl transition-all duration-300 leading-relaxed break-words max-w-4xl mx-auto ${isActive ? 'font-sans tracking-wide' : 'font-serif'}`}
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    {line.text}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-center text-white/40 text-xs font-bold uppercase tracking-widest">
          Lyrics provided by LRCLIB
        </div>
      </div>
    </motion.div>
  );
};

export default LyricsDisplay;
