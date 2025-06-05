'use client'

import { TimerMode, TimerState } from '@/types'

interface TimerDisplayProps {
  timeLeft: number
  mode: TimerMode
  state: TimerState
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const modeLabels = {
  work: 'Focus Time',
  short_break: 'Short Break',
  long_break: 'Long Break',
}

const modeEmojis = {
  work: '🍅',
  short_break: '☕',
  long_break: '🛋️',
}

export default function TimerDisplay({ timeLeft, mode, state }: TimerDisplayProps) {
  return (
    <div className="text-center space-y-4">
      {/* Mode indicator */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-2xl">{modeEmojis[mode]}</span>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          {modeLabels[mode]}
        </h2>
      </div>
      
      {/* Timer display */}
      <div className="space-y-2">
        <div 
          className="text-6xl md:text-7xl font-mono font-bold tracking-tight"
          style={{
            color: state === 'running' ? 
              (mode === 'work' ? '#e85d5d' : 
               mode === 'short_break' ? '#22c55e' : '#3b82f6') : 
              '#64748b'
          }}
        >
          {formatTime(timeLeft)}
        </div>
        
        {/* State indicator */}
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {state === 'running' && '● Running'}
          {state === 'paused' && '⏸ Paused'}
          {state === 'idle' && '⏸ Ready'}
          {state === 'completed' && '✓ Completed'}
        </div>
      </div>
    </div>
  )
}