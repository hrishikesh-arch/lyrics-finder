import axios from 'axios';

const LRCLIB_URL = 'https://lrclib.net/api/search';
const ITUNES_URL = 'https://itunes.apple.com/search';

/**
 * Helper to calculate the percentage of ASCII characters in a string.
 * Used to detect Romanized/English lyrics vs native scripts.
 */
const getAsciiScore = (text) => {
    if (!text) return 0;
    // Remove LRC timestamps [mm:ss.xx] and whitespace to get pure text content
    const cleanText = text.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').replace(/\s/g, '');
    if (cleanText.length === 0) return 0;

    const asciiMatches = cleanText.match(/[\x00-\x7F]/g);
    return asciiMatches ? asciiMatches.length / cleanText.length : 0;
};

/**
 * Searches for songs matching the query.
 * @param {string} query - The search query (song name, artist, etc.)
 * @returns {Promise<Array>} - List of song objects.
 */
export const searchSongs = async (query) => {
    try {
        const response = await axios.get(LRCLIB_URL, { params: { q: query } });
        return response.data || [];
    } catch (error) {
        console.error("Search API Error:", error);
        return [];
    }
};

/**
 * Fetches lyrics and metadata for a given artist and song.
 * Prioritizes Romanized/English lyrics and fetches album art from iTunes.
 * @param {string} artist - The name of the artist.
 * @param {string} song - The name of the song.
 * @returns {Promise<Object>} - { lyrics, artwork, youtubeUrl, title, artist }
 * @throws {Error} - If lyrics are not found or an error occurs.
 */
export const fetchLyrics = async (artist, song, cachedSong = null) => {
    try {
        const query = `${artist} ${song}`;
        const romanizedQuery = `${query} romanized`;

        // 1. Initiate BOTH searches in parallel for maximum speed
        let standardSearchPromise;
        if (cachedSong && (cachedSong.plainLyrics || cachedSong.syncedLyrics)) {
            standardSearchPromise = Promise.resolve({ data: [cachedSong] });
        } else {
            standardSearchPromise = axios.get(LRCLIB_URL, { params: { q: query } });
        }

        // Always fire the romanized search in background
        const romanizedSearchPromise = axios.get(LRCLIB_URL, { params: { q: romanizedQuery } })
            .catch(err => ({ data: [] })); // Catch errors silently

        // 2. Fetch Metadata from iTunes (also in parallel)
        const metadataPromise = axios.get(ITUNES_URL, {
            params: { term: query, entity: 'song', limit: 1 }
        }).catch(err => {
            console.warn("iTunes API failed:", err);
            return { data: { resultCount: 0, results: [] } };
        });

        // 3. Wait for the STANDARD search first
        const [standardRes, metadataRes] = await Promise.all([standardSearchPromise, metadataPromise]);

        // --- Process Standard Lyrics ---
        const standardResults = standardRes.data || [];
        const candidates = standardResults.filter(item => item.plainLyrics || item.syncedLyrics);

        if (candidates.length === 0) {
            throw new Error('Lyrics not found');
        }

        // Sort by ASCII score
        candidates.sort((a, b) => {
            const scoreA = getAsciiScore(a.plainLyrics || a.syncedLyrics);
            const scoreB = getAsciiScore(b.plainLyrics || b.syncedLyrics);
            return scoreB - scoreA;
        });

        let bestRomanized = candidates[0];
        let bestOriginal = null;

        // Check quality of our best standard result
        const bestScore = getAsciiScore(bestRomanized.plainLyrics || bestRomanized.syncedLyrics);

        // 4. DECISION POINT: Do we need the romanized search result?
        if (bestScore < 0.5) {
            console.log("⚠️ Standard result is native script. Checking background romanized search...");

            const romanizedRes = await romanizedSearchPromise;
            const romanizedResults = romanizedRes.data || [];

            const romanizedCandidates = romanizedResults.filter(item => item.plainLyrics || item.syncedLyrics);
            romanizedCandidates.sort((a, b) => {
                const scoreA = getAsciiScore(a.plainLyrics || a.syncedLyrics);
                const scoreB = getAsciiScore(b.plainLyrics || b.syncedLyrics);
                return scoreB - scoreA;
            });

            if (romanizedCandidates.length > 0) {
                const bestSecondary = romanizedCandidates[0];
                const secondaryScore = getAsciiScore(bestSecondary.plainLyrics || bestSecondary.syncedLyrics);

                if (secondaryScore > 0.8) {
                    console.log("✅ Background romanized search provided better lyrics!");
                    bestOriginal = bestRomanized;
                    bestRomanized = bestSecondary;
                }
            }
        } else {
            // Standard search was good! Check for native script version for toggle.
            const potentialOriginal = candidates[candidates.length - 1];
            const originalScore = getAsciiScore(potentialOriginal.plainLyrics || potentialOriginal.syncedLyrics);

            if (bestScore > 0.8 && originalScore < 0.6) {
                bestOriginal = potentialOriginal;
            }
        }

        // Helper to clean synced lyrics
        const cleanLyrics = (item) => {
            if (!item) return null;
            let text = item.plainLyrics || item.syncedLyrics;
            if (!item.plainLyrics && item.syncedLyrics) {
                text = text.replace(/^\[\d{2}:\d{2}\.\d{2}\]/gm, '');
            }
            return text;
        };

        const finalLyrics = cleanLyrics(bestRomanized);
        const originalLyrics = cleanLyrics(bestOriginal);

        // --- Process Metadata ---
        let artwork = null;
        let trackTitle = bestRomanized.trackName;
        let artistName = bestRomanized.artistName;
        let genre = 'Unknown';

        if (metadataRes && metadataRes.data && metadataRes.data.resultCount > 0) {
            const track = metadataRes.data.results[0];
            artwork = track.artworkUrl100 ? track.artworkUrl100.replace('100x100', '600x600') : null;
            trackTitle = track.trackName;
            artistName = track.artistName;
            genre = track.primaryGenreName;
        }

        // --- Generate YouTube Link ---
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        return {
            lyrics: finalLyrics,
            syncedLyrics: bestRomanized.syncedLyrics,

            // Dual Lyrics Data
            hasDualLyrics: !!bestOriginal,
            originalLyrics: originalLyrics,
            originalSyncedLyrics: bestOriginal ? bestOriginal.syncedLyrics : null,

            artwork,
            youtubeUrl,
            title: trackTitle,
            artist: artistName,
            genre
        };

    } catch (error) {
        console.error("API Error:", error);
        if (error.response && error.response.status === 404) {
            throw new Error('Lyrics not found');
        }
        throw new Error(error.message || 'Failed to fetch lyrics.');
    }
};
