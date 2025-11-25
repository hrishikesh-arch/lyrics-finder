import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchForm = ({ onSearch, loading, theme }) => {
    const [artist, setArtist] = useState('');
    const [song, setSong] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (artist.trim() && song.trim()) {
            onSearch(artist, song);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className={`w-full max-w-xl relative p-8 rounded-3xl shadow-2xl transition-all duration-500 ${theme.glass}`}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Artist Input */}
                    <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2 ml-1">Artist</label>
                        <input
                            type="text"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder="e.g. Coldplay"
                            className="w-full px-5 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-white/30 transition-all font-medium"
                            required
                        />
                    </div>

                    {/* Song Input */}
                    <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2 ml-1">Song</label>
                        <input
                            type="text"
                            value={song}
                            onChange={(e) => setSong(e.target.value)}
                            placeholder="e.g. Yellow"
                            className="w-full px-5 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-white/30 transition-all font-medium"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 font-bold rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-3 ${theme.button}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Search size={18} />
                            <span>Find Lyrics</span>
                        </>
                    )}
                </button>
            </div>
        </motion.form>
    );
};

export default SearchForm;
