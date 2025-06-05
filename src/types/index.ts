export type TimerMode = 'work' | 'short_break' | 'long_break'
export type TimerState = 'idle' | 'running' | 'paused' | 'completed'

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
  user_id?: string
  created_at: string
  updated_at: string
}

export interface PomodoroSession {
  id: string
  user_id?: string
  category_id?: string
  type: TimerMode
  duration: number
  completed: boolean
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  auto_start_breaks: boolean
  auto_start_pomodoros: boolean
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}

export interface SystemInfo {
  cpu: {
    usage: number
    temperature?: number
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  timestamp: number
}

export interface DailyStats {
  date: string
  sessions: number
  workTime: number
  categories: Record<string, number>
}

export interface WeeklyStats {
  week: string
  totalSessions: number
  totalWorkTime: number
  averageSessionsPerDay: number
  streakDays: number
}

export interface NotificationPermission {
  granted: boolean
  permission: NotificationPermission | null
}