'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import usePomodoro from '@/hooks/usePomodoro'
import useNotifications from '@/hooks/useNotifications'
import ConnectionStatus from '@/components/ConnectionStatus/ConnectionStatus'

export default function Settings() {
  const { settings, updateSettings, loading } = usePomodoro()
  const { permission, requestPermission, granted } = useNotifications()
  
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [autoStartBreaks, setAutoStartBreaks] = useState(false)
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Update local state when settings load
  useEffect(() => {
    if (settings) {
      setWorkDuration(Math.floor(settings.work_duration / 60))
      setShortBreakDuration(Math.floor(settings.short_break_duration / 60))
      setLongBreakDuration(Math.floor(settings.long_break_duration / 60))
      setAutoStartBreaks(settings.auto_start_breaks)
      setAutoStartPomodoros(settings.auto_start_pomodoros)
      setNotificationsEnabled(settings.notifications_enabled)
    }
  }, [settings])

  const handleSave = async () => {
    await updateSettings({
      work_duration: workDuration * 60,
      short_break_duration: shortBreakDuration * 60,
      long_break_duration: longBreakDuration * 60,
      auto_start_breaks: autoStartBreaks,
      auto_start_pomodoros: autoStartPomodoros,
      notifications_enabled: notificationsEnabled,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
            <ArrowLeftIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Settings
          </h1>
        </div>
      </header>

      {/* Settings Content */}
      <main className="px-4 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Connection Status */}
          <ConnectionStatus showDetails />
          
          {/* Timer Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Timer Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Automation Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Automation
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Auto-start breaks</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Automatically start break timers</p>
                </div>
                <button
                  onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoStartBreaks ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Auto-start pomodoros</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Automatically start work timers after breaks</p>
                </div>
                <button
                  onClick={() => setAutoStartPomodoros(!autoStartPomodoros)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoStartPomodoros ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoStartPomodoros ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Browser notifications</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Status: {granted ? 'Enabled' : permission === 'denied' ? 'Denied' : 'Not granted'}
                  </p>
                </div>
                {!granted && (
                  <button
                    onClick={requestPermission}
                    className="btn-primary text-sm"
                  >
                    Enable
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Notification sounds</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Play sounds when sessions complete</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationsEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="btn-primary px-8 py-3"
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}