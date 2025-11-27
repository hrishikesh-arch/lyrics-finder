# 🎵 Lyrics Finder

A stunning, modern web application that helps you discover song lyrics with an immersive karaoke experience. Built with React and powered by real-time lyrics APIs.

## 🌐 Live Demo

**Try it now:** [https://hrishikesh-arch.github.io/lyrics-finder/](https://hrishikesh-arch.github.io/lyrics-finder/)

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.24-ff0055)

## ✨ Features

### 🎤 **Karaoke Mode**
- **Time-synced lyrics highlighting** - Words light up in perfect sync with the music
- **Auto-scrolling** - Lyrics automatically scroll as the song progresses
- **Pitch/Key Control** - Adjust the song's key with a user-friendly "Key Change" interface
- **Beautiful typography** - Optimized font sizes and word wrapping for maximum readability
- **Immersive experience** - Full-screen karaoke mode with elegant animations and "pop" effects for active lyrics

### 🎨 **Dynamic Theming**
- **Genre-based color schemes** - UI adapts to the music genre (Pop, Rock, Hip-Hop, Jazz, Electronic, etc.)
- **Album art backgrounds** - Blurred album artwork creates an immersive atmosphere
- **Smooth transitions** - Elegant color transitions between songs
- **Abstract music visualizations** - Beautiful SVG illustrations when no song is playing

### 🔍 **Smart Search**
- Search by **artist** and **song title**
- Fetches lyrics from multiple sources (LRCLIB, iTunes)
- Displays **album artwork**, **genre**, and **release year**
- **Direct Music Download** - Get tracks easily via integrated links
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
- **Audio Processing:** Tone.js 15.1.22
- **HTTP Client:** Axios 1.13.2
- **Icons:** Lucide React 0.554.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hrishikesh-arch/lyrics-finder.git
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

## 🚀 Deployment

### **GitHub Pages Deployment**

This project is configured for automatic deployment to GitHub Pages.

**Deploy commands:**
```bash
# Build and deploy to GitHub Pages
npm run deploy

# This runs:
# 1. npm run build (creates production build in dist/)
# 2. gh-pages -d dist (deploys dist folder to gh-pages branch)
```

**First-time setup:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Ensure `vite.config.js` has `base: '/lyrics-finder/'`
3. Run `npm run deploy`
4. Go to GitHub repo → Settings → Pages
5. Set source to `gh-pages` branch
6. Wait 1-2 minutes for deployment

**Updating the live site:**
```bash
# Make your changes, then:
git add .
git commit -m "Your update message"
git push

# Deploy to GitHub Pages
npm run deploy
```

### **Troubleshooting**

**Background images not showing on GitHub Pages:**
- Clear browser cache with hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Wait 2-3 minutes after deployment for GitHub Pages to update
- Verify images exist at: `https://hrishikesh-arch.github.io/lyrics-finder/music-left.svg`

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` to check for errors

**Local development issues:**
- Ensure dev server is running: `npm run dev`
- Check console for errors: Press F12 in browser
- Verify you're accessing `http://localhost:5173/lyrics-finder/`



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
