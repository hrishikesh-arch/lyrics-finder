import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchForm = ({ onSearch, loading, theme }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            console.log("🔍 SearchForm: Submitting query:", query);
            onSearch(query);
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
                <div className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2 ml-1">Search Song</label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. Yellow Coldplay"
                        className="w-full px-5 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-white/30 transition-all font-medium"
                        required
                    />
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
