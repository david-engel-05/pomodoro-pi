'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { DailyStats, WeeklyStats, Category, PomodoroSession } from '@/types'
import { startOfDay, endOfDay, subDays, format, startOfWeek, endOfWeek } from 'date-fns'

interface UseStatisticsReturn {
  dailyStats: DailyStats[]
  weeklyStats: WeeklyStats[]
  categoryStats: Array<{
    categoryId: string
    categoryName: string
    sessions: number
    workTime: number
    color: string
  }>
  totalSessions: number
  totalWorkTime: number
  currentStreak: number
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

export default function useStatistics(): UseStatisticsReturn {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [categoryStats, setCategoryStats] = useState<Array<{
    categoryId: string
    categoryName: string
    sessions: number
    workTime: number
    color: string
  }>>([])
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalWorkTime, setTotalWorkTime] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      let sessions: PomodoroSession[] = []
      let categories: Category[] = []

      if (user) {
        // Load from Supabase
        const [sessionsResult, categoriesResult] = await Promise.all([
          supabase
            .from('pomodoro_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', true)
            .order('started_at', { ascending: false }),
          supabase
            .from('categories')
            .select('*')
            .or(`user_id.eq.${user.id},user_id.is.null`)
        ])

        if (sessionsResult.error) throw sessionsResult.error
        if (categoriesResult.error) throw categoriesResult.error

        sessions = sessionsResult.data || []
        categories = categoriesResult.data || []
      } else {
        // Load from local storage for anonymous users
        const storedSessions = localStorage.getItem('pomodoro_sessions')
        const storedCategories = localStorage.getItem('pomodoro_categories')
        
        sessions = storedSessions ? JSON.parse(storedSessions) : []
        categories = storedCategories ? JSON.parse(storedCategories) : []
      }

      // Calculate daily stats for the last 365 days
      const dailyStatsMap = new Map<string, DailyStats>()
      const today = new Date()
      
      // Initialize all days with zero stats
      for (let i = 0; i < 365; i++) {
        const date = subDays(today, i)
        const dateKey = format(date, 'yyyy-MM-dd')
        dailyStatsMap.set(dateKey, {
          date: dateKey,
          sessions: 0,
          workTime: 0,
          categories: {},
        })
      }

      // Populate with actual data
      sessions.forEach(session => {
        const sessionDate = format(new Date(session.started_at), 'yyyy-MM-dd')
        const existing = dailyStatsMap.get(sessionDate)
        
        if (existing) {
          existing.sessions += 1
          if (session.type === 'work') {
            existing.workTime += session.duration
          }
          
          if (session.category_id) {
            existing.categories[session.category_id] = (existing.categories[session.category_id] || 0) + 1
          }
        }
      })

      const dailyStatsArray = Array.from(dailyStatsMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setDailyStats(dailyStatsArray)

      // Calculate weekly stats
      const weeklyStatsMap = new Map<string, WeeklyStats>()
      
      dailyStatsArray.forEach(day => {
        const date = new Date(day.date)
        const weekStart = startOfWeek(date, { weekStartsOn: 0 })
        const weekKey = format(weekStart, 'yyyy-MM-dd')
        
        const existing = weeklyStatsMap.get(weekKey) || {
          week: weekKey,
          totalSessions: 0,
          totalWorkTime: 0,
          averageSessionsPerDay: 0,
          streakDays: 0,
        }
        
        existing.totalSessions += day.sessions
        existing.totalWorkTime += day.workTime
        
        weeklyStatsMap.set(weekKey, existing)
      })

      const weeklyStatsArray = Array.from(weeklyStatsMap.values())
        .map(week => ({
          ...week,
          averageSessionsPerDay: week.totalSessions / 7,
        }))
        .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())

      setWeeklyStats(weeklyStatsArray)

      // Calculate category stats
      const categoryStatsMap = new Map<string, { sessions: number; workTime: number }>()
      
      sessions.forEach(session => {
        if (session.category_id) {
          const existing = categoryStatsMap.get(session.category_id) || { sessions: 0, workTime: 0 }
          existing.sessions += 1
          if (session.type === 'work') {
            existing.workTime += session.duration
          }
          categoryStatsMap.set(session.category_id, existing)
        }
      })

      const categoryStatsArray = Array.from(categoryStatsMap.entries()).map(([categoryId, stats]) => {
        const category = categories.find(c => c.id === categoryId)
        return {
          categoryId,
          categoryName: category?.name || 'Unknown',
          sessions: stats.sessions,
          workTime: stats.workTime,
          color: category?.color || '#64748b',
        }
      })

      setCategoryStats(categoryStatsArray)

      // Calculate total stats
      const workSessions = sessions.filter(s => s.type === 'work')
      setTotalSessions(workSessions.length)
      setTotalWorkTime(workSessions.reduce((sum, s) => sum + s.duration, 0))

      // Calculate current streak
      let streak = 0
      const sortedDays = dailyStatsArray
        .slice()
        .reverse() // Start from today
        .filter(day => new Date(day.date) <= today)

      for (const day of sortedDays) {
        if (day.sessions > 0) {
          streak++
        } else {
          break
        }
      }

      setCurrentStreak(streak)
    } catch (err) {
      console.error('Error loading statistics:', err)
      setError(err instanceof Error ? err.message : 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStatistics()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadStatistics()
      }
    })

    return () => subscription.unsubscribe()
  }, [loadStatistics])

  return {
    dailyStats,
    weeklyStats,
    categoryStats,
    totalSessions,
    totalWorkTime,
    currentStreak,
    loading,
    error,
    refreshStats: loadStatistics,
  }
}