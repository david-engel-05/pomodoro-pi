'use client'

import { useState, useEffect } from 'react'
import { Cog6ToothIcon, ChartBarIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Timer from '@/components/Timer/Timer'
import CategorySelector from '@/components/CategorySelector/CategorySelector'
import SystemMonitor from '@/components/SystemMonitor/SystemMonitor'
import ConnectionStatus from '@/components/ConnectionStatus/ConnectionStatus'
import usePomodoro from '@/hooks/usePomodoro'
import useNotifications from '@/hooks/useNotifications'

export default function Home() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>()
  const [user, setUser] = useState<any>(null)
  const { settings, saveSession, loading, error } = usePomodoro()
  const { permission, requestPermission, granted } = useNotifications()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSessionComplete = async (mode: 'work' | 'short_break' | 'long_break', duration: number) => {
    await saveSession(mode, duration, selectedCategoryId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            🍅 Pomodoro Pi
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <ConnectionStatus compact />
            
            {/* Notification permission */}
            {!granted && permission !== 'denied' && (
              <button
                onClick={requestPermission}
                className="text-sm btn-secondary"
              >
                Enable Notifications
              </button>
            )}
            
            {/* User Status */}
            {user && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                👋 {user.email}
              </div>
            )}
            
            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <Link href="/statistics" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <ChartBarIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>
              <Link href="/settings" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <Cog6ToothIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>
              <Link href="/auth" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Timer Section */}
            <div className="lg:col-span-3">
              <div className="flex flex-col items-center space-y-8">
                {/* Category Selector */}
                <div className="w-full max-w-sm">
                  <CategorySelector
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={setSelectedCategoryId}
                  />
                </div>

                {/* Timer */}
                {settings && (
                  <Timer
                    workDuration={settings.work_duration}
                    shortBreakDuration={settings.short_break_duration}
                    longBreakDuration={settings.long_break_duration}
                    onSessionComplete={handleSessionComplete}
                    selectedCategoryId={selectedCategoryId}
                    autoStartBreaks={settings.auto_start_breaks}
                    autoStartPomodoros={settings.auto_start_pomodoros}
                    notificationsEnabled={settings.notifications_enabled && granted}
                  />
                )}

                {/* Error message */}
                {error && (
                  <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* System Monitor */}
              <SystemMonitor />

              {/* Quick Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                  Today's Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Sessions Completed
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Focus Time
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      0h 0m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Current Streak
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      0 days
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                  💡 Tip
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Take breaks away from your screen. A short walk or some stretching can help refresh your mind for the next session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        <p>Built for Raspberry Pi with ❤️</p>
      </footer>
    </div>
  )
}