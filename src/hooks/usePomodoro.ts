'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { TimerMode, PomodoroSession, UserSettings } from '@/types'

interface UsePomodoroReturn {
  settings: UserSettings | null
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>
  saveSession: (mode: TimerMode, duration: number, categoryId?: string) => Promise<void>
  loading: boolean
  error: string | null
}

const DEFAULT_SETTINGS: Partial<UserSettings> = {
  work_duration: 1500, // 25 minutes
  short_break_duration: 300, // 5 minutes
  long_break_duration: 900, // 15 minutes
  auto_start_breaks: false,
  auto_start_pomodoros: false,
  notifications_enabled: true,
}

export default function usePomodoro(): UsePomodoroReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Load user settings from Supabase
        const { data, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError
        }

        if (data) {
          setSettings(data)
        } else {
          // Create default settings for new user
          const newSettings = {
            user_id: user.id,
            ...DEFAULT_SETTINGS,
          }

          const { data: createdSettings, error: createError } = await supabase
            .from('user_settings')
            .insert(newSettings)
            .select()
            .single()

          if (createError) throw createError
          setSettings(createdSettings)
        }
      } else {
        // Use local storage for anonymous users
        const stored = localStorage.getItem('pomodoro_settings')
        if (stored) {
          setSettings(JSON.parse(stored))
        } else {
          const anonymousSettings = {
            id: 'anonymous',
            user_id: 'anonymous',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...DEFAULT_SETTINGS,
          } as UserSettings
          
          localStorage.setItem('pomodoro_settings', JSON.stringify(anonymousSettings))
          setSettings(anonymousSettings)
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      
      // Fallback to default settings
      const fallbackSettings = {
        id: 'fallback',
        user_id: 'fallback',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...DEFAULT_SETTINGS,
      } as UserSettings
      
      setSettings(fallbackSettings)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    if (!settings) return

    try {
      setError(null)
      
      const updatedSettings = {
        ...settings,
        ...updates,
        updated_at: new Date().toISOString(),
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && settings.user_id !== 'anonymous' && settings.user_id !== 'fallback') {
        // Update in Supabase
        const { error: updateError } = await supabase
          .from('user_settings')
          .update(updates)
          .eq('user_id', user.id)

        if (updateError) throw updateError
      } else {
        // Update in local storage
        localStorage.setItem('pomodoro_settings', JSON.stringify(updatedSettings))
      }

      setSettings(updatedSettings)
    } catch (err) {
      console.error('Error updating settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    }
  }, [settings])

  const saveSession = useCallback(async (mode: TimerMode, duration: number, categoryId?: string) => {
    try {
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      const sessionData = {
        user_id: user?.id || null,
        category_id: categoryId || null,
        type: mode,
        duration,
        completed: true,
        started_at: new Date(Date.now() - duration * 1000).toISOString(),
        completed_at: new Date().toISOString(),
      }

      if (user) {
        // Save to Supabase
        const { error: saveError } = await supabase
          .from('pomodoro_sessions')
          .insert(sessionData)

        if (saveError) throw saveError
      } else {
        // Save to local storage for anonymous users
        const stored = localStorage.getItem('pomodoro_sessions')
        const sessions = stored ? JSON.parse(stored) : []
        
        const sessionWithId = {
          ...sessionData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        sessions.push(sessionWithId)
        
        // Keep only last 100 sessions in local storage
        if (sessions.length > 100) {
          sessions.splice(0, sessions.length - 100)
        }
        
        localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions))
      }
    } catch (err) {
      console.error('Error saving session:', err)
      setError(err instanceof Error ? err.message : 'Failed to save session')
    }
  }, [])

  useEffect(() => {
    loadSettings()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadSettings()
      }
    })

    return () => subscription.unsubscribe()
  }, [loadSettings])

  return {
    settings,
    updateSettings,
    saveSession,
    loading,
    error,
  }
}