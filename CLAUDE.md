# Claude Development Context

This project is a **Pomodoro Timer Application** optimized for **Raspberry Pi** deployment with modern web technologies.

## Project Overview

A full-featured Pomodoro timer web application with PWA support, real-time system monitoring, statistics tracking, and Docker deployment for Raspberry Pi.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom components and glass morphism design
- **Backend**: Supabase for database and authentication (with local fallback)
- **PWA**: Progressive Web App with service worker and offline support
- **Deployment**: Docker with multi-architecture support (AMD64, ARM64)
- **CI/CD**: GitHub Actions for automated building and publishing

## Key Features

1. **Timer Functionality**
   - Circular progress timer with smooth animations
   - Customizable work/break durations (25/5/15 min defaults)
   - Automatic transitions between modes
   - Session completion tracking

2. **Category System**
   - Session tagging with custom categories
   - Pre-built categories (Work, Study, Coding, etc.)
   - Color-coded organization

3. **Statistics & Analytics**
   - GitHub-style activity heatmap
   - Category breakdown with pie charts
   - Streak tracking and daily statistics
   - Comprehensive session history

4. **System Integration**
   - Real-time CPU and memory monitoring
   - Temperature monitoring (when available)
   - Raspberry Pi optimized performance

5. **PWA Features**
   - Installable on mobile and desktop
   - Offline functionality with service worker
   - Browser notifications for session transitions

## Project Structure

```
pomodoro-pi/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   │   ├── Timer/             # Timer components
│   │   ├── Statistics/        # Analytics components
│   │   ├── CategorySelector/  # Category management
│   │   └── SystemMonitor/     # System monitoring
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and configurations
│   ├── pages/api/             # API routes
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets and PWA files
├── supabase/                  # Database schema
├── .github/workflows/         # CI/CD pipelines
└── docker files              # Container configuration
```

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking

# Docker
docker-compose up -d              # Local development
docker-compose -f docker-compose.prod.yml up -d  # Production

# Deployment
./deploy-raspberry-pi.sh         # One-click deployment script
```

## Environment Variables

```bash
# Supabase (optional - app works without)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
SYSTEM_MONITOR_ENABLED=true
SYSTEM_MONITOR_INTERVAL=5000
```

## Database Schema

The application uses Supabase with the following main tables:
- `users` - User profiles
- `categories` - Session categories/tags
- `pomodoro_sessions` - Session history
- `user_settings` - User preferences

## Docker Images

Automatically built and published to GitHub Container Registry:
- `ghcr.io/david-engel-05/pomodoro-pi:latest`
- Multi-architecture support (AMD64, ARM64)

## API Endpoints

- `GET /api/system/info` - System monitoring data
- `GET /api/health` - Application health check

## Key Components

### Timer System
- `Timer.tsx` - Main timer component with state management
- `CircularProgress.tsx` - Animated progress indicator
- `TimerDisplay.tsx` - Time display and mode indicator
- `TimerControls.tsx` - Start/pause/stop controls

### Statistics
- `Heatmap.tsx` - GitHub-style activity calendar
- `CategoryChart.tsx` - Pie charts for category analytics
- `StatisticsCard.tsx` - Metric display cards

### Data Management
- `usePomodoro.ts` - Pomodoro state and settings management
- `useStatistics.ts` - Analytics data fetching and processing
- `useNotifications.ts` - Browser notification handling

## Development Notes

### Build & Deployment
- Uses Next.js standalone output for Docker optimization
- Multi-stage Docker build for production
- GitHub Actions for automated CI/CD
- Health checks and monitoring

### Performance Optimizations
- Optimized for Raspberry Pi with limited resources
- Docker resource limits configured
- Efficient state management
- PWA caching strategies

### Error Handling
- Graceful fallback to local storage when Supabase unavailable
- Offline-first approach with sync when online
- Comprehensive error boundaries

## Testing Strategy

- TypeScript for compile-time safety
- ESLint for code quality
- GitHub Actions for automated testing
- Manual testing on Raspberry Pi hardware

## Deployment Targets

Primary: Raspberry Pi 4+ with Docker
Secondary: Any Linux system with Docker support
Tertiary: Development on macOS/Windows

## Future Enhancements

- ESP32 integration for hardware controls
- GPIO LED indicators
- Hardware button support
- Multi-user team statistics
- Integration with productivity tools

## Design Philosophy

- **Mobile-first**: Responsive design for all screen sizes
- **Offline-first**: Works without internet connection
- **Performance-first**: Optimized for resource-constrained devices
- **User-first**: Intuitive interface with minimal cognitive load

## Common Development Tasks

### Adding New Features
1. Create components in appropriate directory
2. Add TypeScript types in `src/types/`
3. Implement hooks for data management
4. Update database schema if needed
5. Add tests and update documentation

### Debugging System Monitor
- Check `systeminformation` package compatibility
- Verify Docker container permissions
- Test API endpoints directly

### Updating Dependencies
```bash
npm update
npm audit fix
# Test build and functionality
```

### Database Migrations
- Update `supabase/schema.sql`
- Test with local Supabase instance
- Document breaking changes

## Production Considerations

- Configure proper environment variables
- Set up monitoring and logging
- Enable HTTPS in production
- Configure backup strategies
- Monitor resource usage on Pi

This application demonstrates modern web development practices with a focus on performance, user experience, and deployment simplicity for edge devices like Raspberry Pi.