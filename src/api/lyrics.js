import axios from 'axios';

const LRCLIB_URL = 'https://lrclib.net/api/search';
const ITUNES_URL = 'https://itunes.apple.com/search';

/**
 * Helper to calculate the percentage of ASCII characters in a string.
 * Used to detect Romanized/English lyrics vs native scripts.
 */
const getAsciiScore = (text) => {
    if (!text) return 0;
    const asciiMatches = text.match(/[\x00-\x7F]/g);
    return asciiMatches ? asciiMatches.length / text.length : 0;
};

/**
 * Fetches lyrics and metadata for a given artist and song.
 * Prioritizes Romanized/English lyrics and fetches album art from iTunes.
 * @param {string} artist - The name of the artist.
 * @param {string} song - The name of the song.
 * @returns {Promise<Object>} - { lyrics, artwork, youtubeUrl, title, artist }
 * @throws {Error} - If lyrics are not found or an error occurs.
 */
export const fetchLyrics = async (artist, song) => {
    try {
        const query = `${artist} ${song}`;

        // 1. Fetch Lyrics from LRCLIB
        const lyricsPromise = axios.get(LRCLIB_URL, { params: { q: query } });

        // 2. Fetch Metadata from iTunes (handle error gracefully)
        const metadataPromise = axios.get(ITUNES_URL, {
            params: { term: query, entity: 'song', limit: 1 }
        }).catch(err => {
            console.warn("iTunes API failed:", err);
            return { data: { resultCount: 0, results: [] } };
        });

        const [lyricsRes, metadataRes] = await Promise.all([lyricsPromise, metadataPromise]);

        // --- Process Lyrics ---
        const results = lyricsRes.data || [];

        // Filter for items with lyrics
        const candidates = results.filter(item => item.plainLyrics || item.syncedLyrics);

        if (candidates.length === 0) {
            throw new Error('Lyrics not found');
        }

        // Sort candidates by ASCII score (descending) to prefer English/Romanized
        candidates.sort((a, b) => {
            const scoreA = getAsciiScore(a.plainLyrics || a.syncedLyrics);
            const scoreB = getAsciiScore(b.plainLyrics || b.syncedLyrics);
            return scoreB - scoreA;
        });

        const bestMatch = candidates[0];
        let finalLyrics = bestMatch.plainLyrics || bestMatch.syncedLyrics;

        // Clean up synced lyrics if necessary
        if (!bestMatch.plainLyrics && bestMatch.syncedLyrics) {
            finalLyrics = finalLyrics.replace(/^\[\d{2}:\d{2}\.\d{2}\]/gm, '');
        }

        // --- Process Metadata ---
        let artwork = null;
        let trackTitle = bestMatch.trackName;
        let artistName = bestMatch.artistName;
        let genre = 'Unknown';

        if (metadataRes && metadataRes.data && metadataRes.data.resultCount > 0) {
            const track = metadataRes.data.results[0];
            // Get high-res artwork (replace 100x100 with 600x600)
            artwork = track.artworkUrl100 ? track.artworkUrl100.replace('100x100', '600x600') : null;
            // Use iTunes metadata as it's often cleaner
            trackTitle = track.trackName;
            artistName = track.artistName;
            genre = track.primaryGenreName;
        }

        // --- Generate YouTube Link ---
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        return {
            lyrics: finalLyrics,
            syncedLyrics: bestMatch.syncedLyrics, // Return synced lyrics for Karaoke
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
        // Return a more specific error message if possible
        throw new Error(error.message || 'Failed to fetch lyrics.');
    }
};
