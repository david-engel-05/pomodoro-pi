import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          icon: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          icon?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string | null
          category_id: string | null
          type: 'work' | 'short_break' | 'long_break'
          duration: number
          completed: boolean
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          category_id?: string | null
          type: 'work' | 'short_break' | 'long_break'
          duration: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          category_id?: string | null
          type?: 'work' | 'short_break' | 'long_break'
          duration?: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          work_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          auto_start_breaks?: boolean
          auto_start_pomodoros?: boolean
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          work_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          auto_start_breaks?: boolean
          auto_start_pomodoros?: boolean
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}