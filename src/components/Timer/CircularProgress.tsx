'use client'

import { TimerMode } from '@/types'

interface CircularProgressProps {
  progress: number
  mode: TimerMode
  size?: number
  strokeWidth?: number
}

const modeColors = {
  work: '#e85d5d',
  short_break: '#22c55e',
  long_break: '#3b82f6',
}

export default function CircularProgress({ 
  progress, 
  mode, 
  size = 280, 
  strokeWidth = 8 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={modeColors[mode]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring drop-shadow-sm"
          style={{
            filter: `drop-shadow(0 0 8px ${modeColors[mode]}30)`,
          }}
        />
      </svg>
      
      {/* Inner content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {/* Progress percentage */}
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {Math.round(progress)}%
          </div>
          
          {/* Central glow effect */}
          <div 
            className="w-4 h-4 rounded-full mx-auto opacity-80"
            style={{
              backgroundColor: modeColors[mode],
              boxShadow: `0 0 16px ${modeColors[mode]}60`,
            }}
          />
        </div>
      </div>
    </div>
  )
}