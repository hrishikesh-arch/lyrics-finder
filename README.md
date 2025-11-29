# 🎵 Lyrics Finder & Karaoke

A modern, beautiful, and feature-rich lyrics finder and karaoke application built with React.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://hrishikesh-arch.github.io/lyrics-finder/) 
*(Note: Replace the link above with your actual deployed URL if different)*

![Karaoke Mode](https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

-   **🔍 Smart Lyrics Search**: Instantly find lyrics for your favorite songs using the LRCLIB API.
-   **🎤 Karaoke Mode**: Time-synced lyrics that scroll automatically with the music.
-   **🔤 Intelligent Transliteration**:
    -   **"Gaana-like" Quality**: Automatically converts Tamil, Malayalam, and other Indian scripts into readable Romanized English.
    -   **Context-Aware**: Distinguishes between sounds (e.g., 'ch' vs 's' in Tamil) for natural pronunciation.
    -   **Native Script Toggle**: Switch between original script and Romanized lyrics with a single click.
-   **🎹 Pitch Control**: Adjust the pitch of the audio in real-time for perfect singing.
-   **🎨 Immersive UI**: Glassmorphism design, dynamic background gradients based on album art, and smooth animations.
-   **📱 Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/hrishikesh-arch/lyrics-finder.git
    cd lyrics-finder
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion
-   **Audio Processing**: Tone.js
-   **APIs**: LRCLIB (Lyrics), iTunes Search API (Metadata)
-   **Transliteration**: `@indic-transliteration/sanscript` with custom post-processing rules.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
