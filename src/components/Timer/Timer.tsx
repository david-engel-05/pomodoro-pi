'use client'

import { useState, useEffect, useCallback } from 'react'
import { TimerMode, TimerState } from '@/types'
import CircularProgress from './CircularProgress'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'

interface TimerProps {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  onSessionComplete: (mode: TimerMode, duration: number) => void
  selectedCategoryId?: string
  autoStartBreaks?: boolean
  autoStartPomodoros?: boolean
  notificationsEnabled?: boolean
}

export default function Timer({
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  onSessionComplete,
  selectedCategoryId,
  autoStartBreaks = false,
  autoStartPomodoros = false,
  notificationsEnabled = true
}: TimerProps) {
  const [mode, setMode] = useState<TimerMode>('work')
  const [state, setState] = useState<TimerState>('idle')
  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [totalTime, setTotalTime] = useState(workDuration)
  const [pomodoroCount, setPomodoroCount] = useState(0)

  const getCurrentDuration = useCallback((currentMode: TimerMode) => {
    switch (currentMode) {
      case 'work': return workDuration
      case 'short_break': return shortBreakDuration
      case 'long_break': return longBreakDuration
    }
  }, [workDuration, shortBreakDuration, longBreakDuration])

  const nextMode = useCallback((): TimerMode => {
    if (mode === 'work') {
      const nextPomodoroCount = pomodoroCount + 1
      return nextPomodoroCount % 4 === 0 ? 'long_break' : 'short_break'
    }
    return 'work'
  }, [mode, pomodoroCount])

  const showNotification = useCallback((title: string, body: string) => {
    if (!notificationsEnabled) return
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
      })
    }
  }, [notificationsEnabled])

  const handleSessionComplete = useCallback(() => {
    setState('completed')
    onSessionComplete(mode, totalTime)
    
    if (mode === 'work') {
      setPomodoroCount(prev => prev + 1)
      showNotification(
        'Pomodoro Complete! 🍅',
        'Great work! Time for a break.'
      )
    } else {
      showNotification(
        'Break Complete!',
        'Ready to get back to work?'
      )
    }

    // Auto-transition logic
    const next = nextMode()
    const shouldAutoStart = (next === 'work' && autoStartPomodoros) || 
                           (next !== 'work' && autoStartBreaks)

    setTimeout(() => {
      setMode(next)
      const nextDuration = getCurrentDuration(next)
      setTimeLeft(nextDuration)
      setTotalTime(nextDuration)
      
      if (shouldAutoStart) {
        setState('running')
      } else {
        setState('idle')
      }
    }, 1000)
  }, [mode, totalTime, onSessionComplete, nextMode, getCurrentDuration, autoStartBreaks, autoStartPomodoros, showNotification])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (state === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [state, timeLeft, handleSessionComplete])

  // Update timer when durations change
  useEffect(() => {
    if (state === 'idle') {
      const newDuration = getCurrentDuration(mode)
      setTimeLeft(newDuration)
      setTotalTime(newDuration)
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, mode, state, getCurrentDuration])

  const handleStart = () => {
    setState('running')
  }

  const handlePause = () => {
    setState('paused')
  }

  const handleStop = () => {
    setState('idle')
    const duration = getCurrentDuration(mode)
    setTimeLeft(duration)
    setTotalTime(duration)
  }

  const handleReset = () => {
    setState('idle')
    setMode('work')
    setPomodoroCount(0)
    const duration = getCurrentDuration('work')
    setTimeLeft(duration)
    setTotalTime(duration)
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Circular progress */}
      <div className="relative">
        <CircularProgress 
          progress={progress} 
          mode={mode}
          size={320}
          strokeWidth={12}
        />
        
        {/* Timer display overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <TimerDisplay 
            timeLeft={timeLeft}
            mode={mode}
            state={state}
          />
        </div>
      </div>

      {/* Controls */}
      <TimerControls
        state={state}
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onReset={handleReset}
      />

      {/* Pomodoro counter */}
      <div className="text-center">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
          Pomodoros Completed Today
        </div>
        <div className="flex items-center justify-center space-x-1">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < pomodoroCount % 4
                  ? 'bg-primary-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
          <span className="ml-3 text-lg font-semibold text-slate-700 dark:text-slate-200">
            {pomodoroCount}
          </span>
        </div>
      </div>
    </div>
  )
}