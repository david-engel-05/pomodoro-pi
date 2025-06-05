# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A production-ready Pomodoro timer web application optimized for Raspberry Pi deployment. Features real-time system monitoring, statistics tracking, PWA support, and Docker containerization with multi-architecture builds.

## Architecture & Key Patterns

### Dual-Mode Data Architecture
The application implements a **hybrid data storage pattern** that automatically switches between Supabase (cloud) and localStorage (local) based on availability:

- **With Supabase**: Full cloud sync, user accounts, cross-device data
- **Without Supabase**: Fully functional local-only mode with localStorage fallback
- **Automatic fallback**: Seamless transition when Supabase is unavailable

Key implementation in `src/hooks/usePomodoro.ts` and `src/hooks/useStatistics.ts`.

### Component Architecture
- **Timer System**: State machine pattern with `TimerState` enum managing transitions
- **Statistics**: Reactive data flow using custom hooks that aggregate session data
- **System Monitor**: Real-time polling of system metrics via `/api/system/info`
- **PWA Integration**: Service worker handles offline caching and background sync

### State Management
- **No global state library**: Uses React's built-in state + custom hooks
- **Data persistence**: Automatic sync between memory, localStorage, and Supabase
- **Error boundaries**: Graceful degradation when external services fail

## Development Commands

```bash
# Development
npm run dev          # Development server on :3000
npm run build        # Production build with standalone output
npm run lint         # ESLint with Next.js config
npm run type-check   # TypeScript compilation check

# Docker (Multi-architecture)
docker-compose up -d                              # Local development
docker-compose -f docker-compose.prod.yml up -d  # Production with GitHub image

# Raspberry Pi Deployment
./deploy-raspberry-pi.sh                         # One-click deployment script
```

## Critical Environment Setup

The app works in three modes based on environment configuration:

1. **Full Cloud Mode** (recommended for production):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. **Local-Only Mode** (development/offline):
```bash
# No Supabase variables needed
```

3. **Hybrid Mode** (graceful fallback):
- Tries Supabase first, falls back to localStorage on failure

## Database Schema (Supabase)

**Tables**: `users`, `categories`, `pomodoro_sessions`, `user_settings`
**Key relationships**: Users → Settings (1:1), Sessions → Categories (N:1)
**RLS policies**: Row-level security enabled for multi-tenant data isolation
**Schema file**: `supabase/schema.sql` contains complete setup

## Docker & Deployment

### Multi-Architecture Builds
- **Platforms**: `linux/amd64,linux/arm64` (Raspberry Pi compatible)
- **Registry**: `ghcr.io/david-engel-05/pomodoro-pi:latest`
- **Build triggers**: GitHub Actions on push to main branch
- **Optimization**: Next.js standalone output + multi-stage Docker build

### Resource Constraints (Raspberry Pi)
```yaml
# Docker Compose resource limits
memory: 512M
cpus: '1.0'
```

## System Monitoring Integration

**API endpoint**: `/api/system/info` uses `systeminformation` package
**Metrics collected**: CPU usage, memory consumption, temperature (when available)
**Update frequency**: 5-second intervals via React polling
**Fallback behavior**: Gracefully disables if system info unavailable

## PWA Configuration

- **Manifest**: `/public/manifest.json` with app shortcuts
- **Service Worker**: `/public/sw.js` handles offline caching
- **Install triggers**: Browser install prompts + manual install buttons
- **Offline strategy**: Cache-first for static assets, network-first for data

## Testing & Quality

**CI Pipeline**: GitHub Actions runs lint → type-check → build
**Type safety**: Strict TypeScript with custom type definitions in `src/types/`
**Code quality**: ESLint with Next.js recommended rules
**Manual testing**: Raspberry Pi hardware validation

## Navigation Architecture

**App Router structure**:
- `/` - Main timer interface
- `/settings` - Timer configuration and preferences  
- `/statistics` - Analytics dashboard with heatmap
- `/auth` - Login/signup with Supabase Auth

**Navigation pattern**: Icon-based header navigation with Link components

## Performance Optimizations

- **Bundle optimization**: Next.js standalone build reduces container size
- **Caching strategy**: GitHub Actions cache for Docker layers
- **Resource monitoring**: Built-in system monitor prevents resource exhaustion
- **Lazy loading**: Components loaded on-demand via dynamic imports

## Data Patterns

**Session tracking**: Immutable session records with completion timestamps
**Statistics aggregation**: Client-side computation of daily/weekly metrics  
**Category management**: User-scoped categories with color/emoji metadata
**Settings persistence**: Real-time updates with optimistic UI patterns