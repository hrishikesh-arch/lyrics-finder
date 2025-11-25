/**
 * Maps music genres to visual themes.
 * Each theme defines the background gradient, accent colors, and overall vibe.
 */
export const getTheme = (genre) => {
    const normalizedGenre = genre ? genre.toLowerCase() : 'unknown';

    // Default / Unknown Theme (Aurora)
    const defaultTheme = {
        name: 'Aurora',
        background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        accent: 'text-purple-400',
        button: 'bg-white/10 hover:bg-white/20',
        glass: 'bg-white/5 backdrop-blur-xl border-white/10',
        vibe: 'Ethereal & Dreamy'
    };

    // Pop (Vibrant, Pink/Orange)
    if (normalizedGenre.includes('pop') || normalizedGenre.includes('dance')) {
        return {
            name: 'Pop',
            background: 'bg-gradient-to-br from-pink-500 via-rose-500 to-yellow-500',
            accent: 'text-white',
            button: 'bg-white/20 hover:bg-white/30',
            glass: 'bg-white/10 backdrop-blur-xl border-white/20',
            vibe: 'Energetic & Vibrant'
        };
    }

    // Rock / Metal (Dark, Red/Black)
    if (normalizedGenre.includes('rock') || normalizedGenre.includes('metal') || normalizedGenre.includes('alternative')) {
        return {
            name: 'Rock',
            background: 'bg-gradient-to-br from-red-900 via-gray-900 to-black',
            accent: 'text-red-500',
            button: 'bg-red-600/20 hover:bg-red-600/40',
            glass: 'bg-black/40 backdrop-blur-xl border-red-500/20',
            vibe: 'Intense & Bold'
        };
    }

    // Hip-Hop / Rap (Urban, Gold/Purple)
    if (normalizedGenre.includes('hip-hop') || normalizedGenre.includes('rap') || normalizedGenre.includes('r&b')) {
        return {
            name: 'Hip-Hop',
            background: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900',
            accent: 'text-yellow-400',
            button: 'bg-yellow-400/20 hover:bg-yellow-400/30',
            glass: 'bg-black/30 backdrop-blur-xl border-yellow-400/10',
            vibe: 'Urban & Cool'
        };
    }

    // Classical / Jazz (Elegant, Gold/Cream)
    if (normalizedGenre.includes('classical') || normalizedGenre.includes('jazz') || normalizedGenre.includes('instrumental')) {
        return {
            name: 'Classical',
            background: 'bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#3d3d3d]', // Sophisticated dark gray
            accent: 'text-amber-200',
            button: 'bg-amber-200/10 hover:bg-amber-200/20',
            glass: 'bg-white/5 backdrop-blur-md border-amber-200/10',
            vibe: 'Timeless & Elegant'
        };
    }

    // Electronic (Neon, Cyan/Blue)
    if (normalizedGenre.includes('electronic') || normalizedGenre.includes('techno') || normalizedGenre.includes('house')) {
        return {
            name: 'Electronic',
            background: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900',
            accent: 'text-cyan-400',
            button: 'bg-cyan-500/20 hover:bg-cyan-500/30',
            glass: 'bg-black/40 backdrop-blur-xl border-cyan-500/30',
            vibe: 'Futuristic & Electric'
        };
    }

    // Bollywood / World (Warm, Saffron/Maroon)
    if (normalizedGenre.includes('bollywood') || normalizedGenre.includes('world') || normalizedGenre.includes('indian')) {
        return {
            name: 'World',
            background: 'bg-gradient-to-br from-orange-700 via-red-800 to-purple-900',
            accent: 'text-orange-300',
            button: 'bg-orange-500/20 hover:bg-orange-500/30',
            glass: 'bg-black/20 backdrop-blur-xl border-orange-500/20',
            vibe: 'Warm & Rich'
        };
    }

    return defaultTheme;
};
