import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Music, User, Disc, Play } from 'lucide-react';
import axios from 'axios';

const ITUNES_URL = 'https://itunes.apple.com/search';

// SongCard fetches artwork on hover to avoid loading all at once
const SongCard = ({ song, index, onSelect, theme }) => {
    const [artwork, setArtwork] = useState(null);

    const fetchArtwork = async () => {
        if (artwork) return;
        try {
            if (song.artwork) {
                setArtwork(song.artwork);
                return;
            }
            const iTunesQuery = `${song.artistName} ${song.trackName}`;
            const response = await axios.get(ITUNES_URL, {
                params: { term: iTunesQuery, entity: 'song', limit: 1 },
            });
            if (response.data.resultCount > 0) {
                const track = response.data.results[0];
                setArtwork(track.artworkUrl100?.replace('100x100', '300x300'));
            }
        } catch (err) {
            // ignore errors
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSelect(song)}
            onMouseEnter={fetchArtwork}
            className={`relative p-5 rounded-2xl cursor-pointer hover:scale-[1.03] transition-all group ${theme.glass} hover:bg-white/15 overflow-hidden`}
        >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300 rounded-2xl" />
            <div className="relative flex flex-col gap-3">
                {/* Album art */}
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden relative group-hover:shadow-2xl transition-shadow">
                    {artwork ? (
                        <img src={artwork} alt={song.trackName} className="w-full h-full object-cover animate-fade-in" loading="lazy" />
                    ) : (
                        <Disc size={48} className="text-white/30 group-hover:text-white/50 transition-colors" />
                    )}
                    {/* Play button overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
                            <Play size={24} fill="black" className="text-black ml-1" />
                        </div>
                    </div>
                </div>
                {/* Song info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white truncate group-hover:text-purple-200 transition-colors mb-1">
                        {song.trackName || song.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/60 text-sm mb-1">
                        <User size={11} />
                        <span className="truncate">{song.artistName}</span>
                    </div>
                    {song.albumName && (
                        <div className="text-white/40 text-xs truncate">{song.albumName}</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const SongList = ({ songs, onSelect, theme }) => {
    if (!songs || songs.length === 0) {
        return (
            <div className="text-center text-white/50 mt-10">
                <p>No songs found. Try a different search.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mt-8">
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold mb-6 text-white/90"
            >
                Choose a song
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {songs.map((song, index) => (
                    <SongCard
                        key={song.id || index}
                        song={song}
                        index={index}
                        onSelect={onSelect}
                        theme={theme}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default SongList;
