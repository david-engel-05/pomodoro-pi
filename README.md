# 🍅 Pomodoro Pi - Focus Timer for Raspberry Pi

A beautiful, feature-rich Pomodoro timer web application optimized for Raspberry Pi deployment. Built with Next.js, TypeScript, Tailwind CSS, and Supabase for a modern, responsive experience.

## ✨ Features

### 🎯 Core Timer Functionality
- **Classic Pomodoro Technique**: 25-minute work sessions with 5-minute short breaks and 15-minute long breaks
- **Customizable Durations**: Adjust work and break times to fit your workflow
- **Automatic Transitions**: Optional auto-start for breaks and work sessions
- **Visual Progress**: Beautiful circular progress indicator with smooth animations
- **Session Tracking**: Complete session history with categories and statistics

### 📊 Advanced Analytics
- **Activity Heatmap**: GitHub-style calendar view of your productivity
- **Category Analytics**: Pie charts and breakdowns by project categories
- **Streak Tracking**: Monitor consecutive active days
- **Detailed Statistics**: Daily, weekly, and monthly productivity insights
- **Export Capabilities**: Download your data in various formats

### 🏷️ Organization Features
- **Category System**: Tag sessions with custom categories (Work, Study, Coding, etc.)
- **Custom Categories**: Create personalized categories with colors and emojis
- **Session Management**: Review and analyze past sessions
- **Smart Defaults**: Pre-configured categories for immediate use

### 🖥️ System Integration
- **Real-time System Monitor**: CPU usage, memory consumption, and temperature monitoring
- **Raspberry Pi Optimized**: Lightweight design for single-board computers
- **PWA Support**: Install as a native app with offline functionality
- **Browser Notifications**: Desktop alerts for session transitions
- **Responsive Design**: Works perfectly on all screen sizes

### 🔒 Data & Privacy
- **Supabase Backend**: Secure, scalable database with real-time sync
- **Anonymous Mode**: Use without account for local-only data
- **Offline Support**: Continue working even without internet connection
- **Data Export**: Full control over your productivity data

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Raspberry Pi 4 or similar (recommended minimum 2GB RAM)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pomodoro-pi.git
cd pomodoro-pi
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials (optional for local-only use)
```

### 3. Build and Run
```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f pomodoro-pi

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000` or `http://your-pi-ip:3000`.

## 🔧 Manual Installation

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Supabase Configuration (optional - app works without)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
SYSTEM_MONITOR_ENABLED=true
```

### 3. Set Up Database (Optional)
If using Supabase:
1. Create a new Supabase project
2. Run the SQL commands from `supabase/schema.sql` in your Supabase SQL editor
3. Update your `.env.local` with the Supabase URL and keys

### 4. Development
```bash
npm run dev
# or
yarn dev
```

### 5. Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📱 PWA Installation

### Mobile Devices
1. Open the app in your mobile browser
2. Tap the browser menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. Follow the prompts to install

### Desktop
1. Open the app in Chrome, Edge, or Safari
2. Look for the install icon in the address bar
3. Click "Install Pomodoro Pi"
4. The app will be available in your applications menu

## 🔄 Supabase Setup (Optional)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Set Up Database
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL commands to create tables and policies

### 3. Configure Authentication (Optional)
- Enable email authentication in Supabase Auth settings
- Configure social providers if desired
- Set up redirect URLs for your domain

## 🛠️ Configuration Options

### Timer Settings
All timer durations can be customized in the app settings:
- Work session duration (default: 25 minutes)
- Short break duration (default: 5 minutes)
- Long break duration (default: 15 minutes)
- Auto-start breaks and work sessions
- Notification preferences

### System Monitor
The system monitor widget shows real-time information:
- CPU usage percentage
- Memory usage with total/used display
- CPU temperature (when available)
- Updates every 5 seconds

### Categories
Create custom categories for better organization:
- Add custom names, colors, and emojis
- View analytics by category
- Export data filtered by category

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom components
- **Heroicons**: Beautiful SVG icons
- **Recharts**: Charts and data visualization

### Backend & Data
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Next.js API Routes**: Server-side endpoints
- **Local Storage**: Fallback for anonymous users
- **systeminformation**: Node.js system monitoring

### Infrastructure
- **Docker**: Containerized deployment
- **PWA**: Progressive Web App with service worker
- **Service Worker**: Offline support and background sync

## 📊 API Endpoints

### System Information
```
GET /api/system/info
```
Returns current system stats (CPU, memory, temperature).

### Health Check
```
GET /api/health
```
Application health status for monitoring.

## 🔧 Customization

### Themes
The app uses Tailwind CSS with custom color schemes. Modify `tailwind.config.js` to adjust:
- Primary colors (timer progress, buttons)
- Success colors (breaks, achievements)
- Warning colors (alerts, notifications)

### Timer Behavior
Customize timer logic in `src/components/Timer/Timer.tsx`:
- Session transition logic
- Notification timing
- Progress calculations

### System Monitoring
Adjust monitoring intervals and metrics in `src/pages/api/system/info.ts`.

## 🐛 Troubleshooting

### Common Issues

**Docker container won't start:**
- Check available memory (minimum 512MB recommended)
- Verify port 3000 is not in use
- Check Docker logs: `docker-compose logs pomodoro-pi`

**System monitor not working:**
- Ensure the container has access to system information
- Some metrics may not be available in Docker containers
- Check API endpoint: `curl http://localhost:3000/api/system/info`

**Notifications not working:**
- Grant notification permissions in browser settings
- Ensure HTTPS is used in production
- Check browser notification settings

**Supabase connection issues:**
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure network connectivity

### Performance Optimization

**For Raspberry Pi:**
- Use Docker to limit memory usage
- Enable swap if experiencing memory issues
- Consider using a USB 3.0 drive for faster I/O

**For better performance:**
- Enable gzip compression in your reverse proxy
- Use a CDN for static assets in production
- Monitor container resource usage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique) by Francesco Cirillo
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Supabase](https://supabase.com/) for the backend-as-a-service platform
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Heroicons](https://heroicons.com/) for the beautiful icon set

## 🚀 Future Enhancements

- [ ] ESP32 integration for hardware controls
- [ ] GPIO LED indicators for Raspberry Pi
- [ ] Hardware button support
- [ ] Multi-user support with team statistics
- [ ] Integration with productivity tools (Notion, Trello, etc.)
- [ ] Advanced analytics and insights
- [ ] Pomodoro templates and presets
- [ ] Sound customization and ambient noise
- [ ] Time tracking export to popular formats

---

**Built with ❤️ for the Raspberry Pi community**