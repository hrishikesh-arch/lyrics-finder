# 🎵 Lyrics Finder

A stunning, modern web application that helps you discover song lyrics with an immersive karaoke experience. Built with React and powered by real-time lyrics APIs.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.24-ff0055)

## ✨ Features

### 🎤 **Karaoke Mode**
- **Time-synced lyrics highlighting** - Words light up in perfect sync with the music
- **Auto-scrolling** - Lyrics automatically scroll as the song progresses
- **Beautiful typography** - Optimized font sizes and word wrapping for maximum readability
- **Immersive experience** - Full-screen karaoke mode with elegant animations

### 🎨 **Dynamic Theming**
- **Genre-based color schemes** - UI adapts to the music genre (Pop, Rock, Hip-Hop, Jazz, Electronic, etc.)
- **Album art backgrounds** - Blurred album artwork creates an immersive atmosphere
- **Smooth transitions** - Elegant color transitions between songs
- **Abstract music visualizations** - Beautiful SVG illustrations when no song is playing

### 🔍 **Smart Search**
- Search by **artist** and **song title**
- Fetches lyrics from multiple sources (LRCLIB, iTunes)
- Displays **album artwork**, **genre**, and **release year**
- Error handling with helpful feedback

### 🎭 **Premium UI/UX**
- **Glassmorphism effects** - Modern frosted glass aesthetics
- **Smooth animations** - Powered by Framer Motion
- **Responsive design** - Works beautifully on all devices
- **Ambient backgrounds** - Dynamic gradient orbs and music-themed illustrations

## 🚀 Tech Stack

- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** TailwindCSS 4.1.17
- **Animations:** Framer Motion 12.23.24
- **HTTP Client:** Axios 1.13.2
- **Icons:** Lucide React 0.554.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lyrics-finder.git
   cd lyrics-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 🎯 Usage

1. **Search for a song** - Enter the artist name and song title
2. **View lyrics** - Browse through the complete lyrics with album art
3. **Enable karaoke mode** - Click the karaoke button to start time-synced playback
4. **Enjoy the experience** - Watch lyrics highlight in real-time with beautiful animations

## 🌈 Supported Genres

The app dynamically themes itself based on the song's genre:

- 🎸 **Rock** - Fiery reds and oranges
- 🎤 **Pop** - Vibrant pinks and purples
- 🎧 **Hip-Hop** - Bold yellows and oranges
- 🎺 **Jazz** - Warm ambers and golds
- 🎹 **Electronic** - Cool cyans and blues
- 🎻 **Classical** - Elegant purples and violets
- 🌍 **World** - Earthy greens and teals
- And many more!

## 📁 Project Structure

```
lyrics-finder/
├── public/              # Static assets (SVG illustrations)
├── src/
│   ├── api/            # API integration (LRCLIB, iTunes)
│   ├── components/     # React components
│   │   ├── SearchForm.jsx
│   │   └── LyricsDisplay.jsx
│   ├── utils/          # Utility functions (themes)
│   ├── App.jsx         # Main application component
│   ├── index.css       # Global styles
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Design Philosophy

This project prioritizes **visual excellence** and **user experience**:

- ✅ Premium, modern aesthetics that WOW users
- ✅ Smooth, delightful animations
- ✅ Responsive and accessible design
- ✅ Performance-optimized for fast load times
- ✅ Clean, maintainable code structure

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **LRCLIB** - For providing time-synced lyrics data
- **iTunes API** - For album artwork and metadata
- **Framer Motion** - For beautiful animations
- **TailwindCSS** - For rapid UI development

## 📧 Contact

Created for a hackathon project. Feel free to reach out with questions or suggestions!

---

**Made with ❤️ and React**
