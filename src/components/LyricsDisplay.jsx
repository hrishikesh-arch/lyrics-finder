import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Disc, Music2, Copy, Check, Mic2, Play, Pause, RotateCcw, Upload, Sliders, Languages, MicOff, Wand2, ArrowLeft } from 'lucide-react';
import * as Tone from 'tone';
import { transliterate as genericTransliterate } from 'transliteration';
import Sanscript from '@indic-transliteration/sanscript';

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

const LyricsDisplay = ({ data, theme, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('text'); // 'text' or 'karaoke'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [pitch, setPitch] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  // New Features State
  const [lyricType, setLyricType] = useState('romanized'); // 'romanized' | 'original' | 'converted'
  const [convertedLyrics, setConvertedLyrics] = useState(null);
  const [convertedSyncedLyrics, setConvertedSyncedLyrics] = useState(null);

  const playerRef = useRef(null);
  const pitchShiftRef = useRef(null);
  const scrollRef = useRef(null);

  // Destructure safely
  const {
    lyrics, syncedLyrics,
    originalLyrics, originalSyncedLyrics, hasDualLyrics,
    title, artist, artwork, youtubeUrl
  } = data || {};

  // Parse synced lyrics when data or lyricType changes
  useEffect(() => {
    let activeSynced;
    if (lyricType === 'original') {
      activeSynced = originalSyncedLyrics;
    } else if (lyricType === 'converted') {
      activeSynced = convertedSyncedLyrics;
    } else {
      activeSynced = syncedLyrics;
    }

    if (activeSynced) {
      setParsedLyrics(parseLRC(activeSynced));
    } else {
      setParsedLyrics([]);
    }
  }, [syncedLyrics, originalSyncedLyrics, convertedSyncedLyrics, lyricType, title]);

  // Reset state on new song
  useEffect(() => {
    setMode('text');
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioFile(null);
    setIsAudioLoaded(false);
    setPitch(0);
    setLyricType('romanized');
    setConvertedLyrics(null);
    setConvertedSyncedLyrics(null);

    // Cleanup old audio
    cleanupAudio();
  }, [title]);

  const cleanupAudio = () => {
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    if (pitchShiftRef.current) {
      pitchShiftRef.current.dispose();
      pitchShiftRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  // Helper to detect script
  const detectScript = (text) => {
    if (!text) return null;
    // Malayalam Unicode Range: 0D00–0D7F
    if (/[\u0D00-\u0D7F]/.test(text)) return 'malayalam';
    // Devanagari (Hindi/Sanskrit): 0900–097F
    if (/[\u0900-\u097F]/.test(text)) return 'devanagari';
    // Tamil: 0B80–0BFF
    if (/[\u0B80-\u0BFF]/.test(text)) return 'tamil';
    // Telugu: 0C00–0C7F
    if (/[\u0C00-\u0C7F]/.test(text)) return 'telugu';
    // Kannada: 0C80–0CFF
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kannada';
    // Bengali: 0980–09FF
    if (/[\u0980-\u09FF]/.test(text)) return 'bengali';

    return null;
  };

  const convertTextReadable = (text) => {
    const script = detectScript(text);
    if (script) {
      let processedText = text;
      let targetScheme = 'itrans';

      // 1. Handle Chillu Letters & Special Vowels (Malayalam)
      if (script === 'malayalam') {
        processedText = processedText
          .replace(/ൺ/g, 'N')
          .replace(/ൻ/g, 'n')
          .replace(/ർ/g, 'r')
          .replace(/ൽ/g, 'l')
          .replace(/ൾ/g, 'L')
          .replace(/ൿ/g, 'k')
          .replace(/ൗ/g, 'au')
          .replace(/ം/g, 'm');
      }

      // 2. Transliterate
      // Tamil works better with Harvard-Kyoto (HK) for 'nna' (ன)
      if (script === 'tamil') {
        targetScheme = 'hk';
      }

      let converted = Sanscript.t(processedText, script, targetScheme);

      // 3. Make it Readable (Custom Mappings)

      // Tamil Specific Fixes (HK based)
      if (script === 'tamil') {
        converted = converted
          .replace(/n2/g, 'n')   // HK 'n2' -> 'n'
          .replace(/jhjh/g, 'ch') // HK 'jhjh' -> 'ch' (adicha)
          .replace(/jh/g, 's')   // HK 'jh' -> 's' (masam)
          .replace(/S/g, 's')
          .replace(/sh/g, 'sh')
          .replace(/dh/g, 'th')
          .replace(/r2/g, 'tr')
          .replace(/gh/g, 'k')
          .replace(/bh/g, 'p')
          .replace(/w/g, 'l')
          .replace(/G/g, 'ng')
          .replace(/D/g, 't')
          .replace(/Dh/g, 't');
      }

      converted = converted
        .replace(/t/g, 'th')
        .replace(/T/g, 't')
        .replace(/d/g, 'd')
        // .replace(/D/g, 'd') // Handled specifically for Tamil
        .replace(/L/g, 'l')
        .replace(/N/g, 'n')
        .replace(/R/g, 'r')
        .replace(/S/g, 'sh')
        .replace(/sh/g, 'sh')
        .replace(/~n/g, 'n')
        .replace(/\^/g, '')
        .replace(/~/g, '')
        .replace(/aa/g, 'aa')
        .replace(/ii/g, 'ee')
        .replace(/uu/g, 'oo')

        // Final Cleanups
        .replace(/thh/g, 'th')
        .replace(/ngk/g, 'ng')
        .replace(/kg/g, 'ng');

      // Remove accents (e.g. è -> e) and lowercase
      return converted.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
    return genericTransliterate(text);
  };

  const handleTransliterate = () => {
    const sourcePlain = originalLyrics || lyrics;
    const sourceSynced = originalSyncedLyrics || syncedLyrics;

    if (sourcePlain) {
      const converted = convertTextReadable(sourcePlain);
      setConvertedLyrics(converted);
    }
    if (sourceSynced) {
      const lines = sourceSynced.split('\n');
      const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

      const convertedLines = lines.map(line => {
        const match = line.match(timeRegex);
        if (match) {
          const timestamp = match[0];
          const text = line.replace(timeRegex, '').trim();
          const convertedText = convertTextReadable(text);
          return `${timestamp} ${convertedText}`;
        }
        return line;
      });

      setConvertedSyncedLyrics(convertedLines.join('\n'));
    }
    setLyricType('converted');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("🎤 Audio file selected:", file.name);

      try {
        await Tone.start();

        const url = URL.createObjectURL(file);

        cleanupAudio();

        // --- Audio Graph Construction ---
        // Source
        const player = new Tone.Player(url);

        // Pitch Shifter
        const pitchShift = new Tone.PitchShift(pitch).toDestination();

        player.connect(pitchShift);

        // Sync player state
        player.autostart = false;
        await player.loaded;

        playerRef.current = player;
        pitchShiftRef.current = pitchShift;

        setIsAudioLoaded(true);
        console.log("✅ Audio loaded and ready");

        // Auto-switch to karaoke mode
        setMode('karaoke');
        setIsPlaying(false);
        setCurrentTime(0);
      } catch (err) {
        console.error("❌ Error loading audio:", err);
        alert("Failed to load audio file. Please try another file.");
      }
    }
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000;
      interval = setInterval(() => {
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
  }, [isPlaying, isAudioLoaded]);

  // Pitch Effect Update
  useEffect(() => {
    if (pitchShiftRef.current) {
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
    let textToCopy = lyrics;
    if (lyricType === 'original') textToCopy = originalLyrics;
    if (lyricType === 'converted') textToCopy = convertedLyrics;

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const togglePlay = async () => {
    if (!isPlaying && !isAudioLoaded && !audioFile) {
      // Just timer mode
    }

    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }

    setIsPlaying(!isPlaying);
  };

  const resetKaraoke = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  // Helper to check for non-ASCII characters (indicating native script)
  const hasNonAscii = (text) => /[^\x00-\x7F]/.test(text);

  // Determine if we should show the convert button
  // Show if: 
  // 1. We are in 'original' mode (explicitly viewing native)
  // 2. OR we are in 'romanized' mode BUT the text contains non-ASCII chars (meaning it's actually native)
  const activeText = lyricType === 'original' ? (originalLyrics || originalSyncedLyrics) : (lyrics || syncedLyrics);
  const showConvertButton = activeText && hasNonAscii(activeText) && lyricType !== 'converted';

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mt-12 flex flex-col md:flex-row gap-10 items-start"
    >
      {/* Back Button (Mobile/Desktop) */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-md z-50 shadow-lg border border-white/10"
        title="Back to Search"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Album Art & Metadata Panel */}
      <div className={`w-full flex flex-col gap-6 sticky top-8 transition-all duration-500 ${mode === 'karaoke' ? 'md:w-1/4' : 'md:w-1/3'}`}>
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
              href="https://microsafe.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-green-600/40"
            >
              <Music2 size={20} className="fill-white" />
              <span className="text-sm tracking-wide">GET TRACK</span>
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

            {syncedLyrics || originalSyncedLyrics ? (
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
      <div className={`w-full p-10 md:p-14 rounded-3xl shadow-2xl min-h-[60vh] max-h-[80vh] relative overflow-hidden flex flex-col transition-all duration-500 ${theme.glass} ${mode === 'karaoke' ? 'md:w-3/4' : 'md:w-2/3'}`}>

        {/* Decorative Icon */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
          <Music2 size={100} />
        </div>

        {/* Lyrics Panel Header & Controls */}
        <div className="flex flex-col gap-6 mb-6 z-20 relative">

          {/* Top Row: Time (Karaoke) or Title (Text) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            {mode === 'karaoke' ? (
              <div className="text-2xl font-bold font-mono text-white/80">
                {new Date(currentTime * 1000).toISOString().substr(14, 5)}
              </div>
            ) : (
              <div className="text-xl font-bold text-white/60 uppercase tracking-widest">
                Lyrics
              </div>
            )}

            <div className="flex gap-3">
              {/* Convert to English Button */}
              {showConvertButton && (
                <button
                  onClick={handleTransliterate}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${lyricType === 'converted' ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/20' : 'bg-purple-600/20 border-purple-500/30 hover:bg-purple-600/40'}`}
                >
                  <Wand2 size={16} className="text-white" />
                  <span className="text-xs font-bold tracking-wide uppercase text-white">
                    To English
                  </span>
                </button>
              )}

              {/* Dual Lyrics Toggle - ALWAYS VISIBLE if available */}
              {hasDualLyrics && (
                <button
                  onClick={() => setLyricType(lyricType === 'romanized' ? 'original' : 'romanized')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${lyricType === 'original' ? 'bg-pink-600/80 border-pink-400/50 shadow-lg shadow-pink-500/20' : 'bg-white/10 border-white/5 hover:bg-white/20'}`}
                >
                  <Languages size={16} className={lyricType === 'original' ? 'text-white' : 'text-white/70'} />
                  <span className={`text-xs font-bold tracking-wide uppercase ${lyricType === 'original' ? 'text-white' : 'text-white/70'}`}>
                    {lyricType === 'original' ? 'Original' : 'English'}
                  </span>
                </button>
              )}

              {/* Play Controls (Karaoke Only) */}
              {mode === 'karaoke' && (
                <>
                  <button onClick={togglePlay} className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-lg">
                    {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                  </button>
                  <button onClick={resetKaraoke} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <RotateCcw size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Karaoke Advanced Controls (Pitch Only) */}
          {mode === 'karaoke' && (
            <div className="flex flex-col gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/5">

              <div className="flex flex-wrap gap-3">
                {/* Pitch Control */}
                <div className="flex-1 min-w-[200px] flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <Sliders size={16} className="text-purple-300" />
                    <span className="text-xs font-bold text-white/80 uppercase">Key {pitch > 0 ? `+${pitch}` : pitch}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <button onClick={() => setPitch(p => Math.max(p - 1, -12))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white">-</button>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                      <div className="h-full bg-purple-500/50" style={{ width: `${((pitch + 12) / 24) * 100}%` }} />
                    </div>
                    <button onClick={() => setPitch(p => Math.min(p + 1, 12))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white">+</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lyrics Content */}
        <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
          {mode === 'text' ? (
            <div className="text-white/90 whitespace-pre-wrap leading-loose font-serif text-xl md:text-2xl text-center tracking-wide pb-10">
              {lyricType === 'original' && originalLyrics ? originalLyrics :
                lyricType === 'converted' && convertedLyrics ? convertedLyrics : lyrics}
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-10 text-center px-4">
              {parsedLyrics.length > 0 ? (
                parsedLyrics.map((line, index) => {
                  const isActive = currentTime >= line.time && (index === parsedLyrics.length - 1 || currentTime < parsedLyrics[index + 1].time);
                  const isPast = currentTime > line.time;

                  return (
                    <motion.div
                      key={index}
                      animate={{
                        scale: isActive ? 1.25 : 1,
                        opacity: isActive ? 1 : isPast ? 0.3 : 0.5,
                        color: isActive ? '#ffffff' : '#a3a3a3',
                        filter: isActive ? 'blur(0px)' : 'blur(0.5px)',
                        textShadow: isActive ? '0 0 20px rgba(255,255,255,0.6)' : 'none'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                })
              ) : (
                <div className="text-white/50 text-xl font-medium mt-10">
                  No synced lyrics available for this song.
                  <br />
                  <span className="text-sm opacity-70">You can still play the audio, but lyrics won't scroll.</span>
                </div>
              )}
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
