import axios from 'axios';

const LRCLIB_URL = 'https://lrclib.net/api/search';

const getAsciiScore = (text) => {
    if (!text) return 0;
    const asciiMatches = text.match(/[\x00-\x7F]/g);
    return asciiMatches ? asciiMatches.length / text.length : 0;
};

async function test() {
    try {
        const query = "Tum Hi Ho Arijit Singh";
        console.log(`Searching for: ${query}`);
        const response = await axios.get(LRCLIB_URL, { params: { q: query } });
        const results = response.data;

        console.log(`Found ${results.length} results.`);

        results.forEach((item, index) => {
            const text = item.plainLyrics || item.syncedLyrics || "";
            const score = getAsciiScore(text);
            console.log(`\n--- Result ${index + 1} ---`);
            console.log(`ID: ${item.id}`);
            console.log(`Track: ${item.trackName}`);
            console.log(`Artist: ${item.artistName}`);
            console.log(`ASCII Score: ${score.toFixed(2)}`);
            console.log(`Snippet: ${text.substring(0, 100).replace(/\n/g, ' ')}...`);
        });

    } catch (error) {
        console.error(error);
    }
}

test();
