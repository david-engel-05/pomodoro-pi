'use client'

import { useMemo } from 'react'
import { format, startOfWeek, addDays, subDays, isSameDay } from 'date-fns'
import { DailyStats } from '@/types'

interface HeatmapProps {
  data: DailyStats[]
  className?: string
}

const getIntensity = (sessions: number): number => {
  if (sessions === 0) return 0
  if (sessions < 3) return 1
  if (sessions < 6) return 2
  if (sessions < 10) return 3
  return 4
}

const getIntensityColor = (intensity: number): string => {
  switch (intensity) {
    case 0: return 'bg-slate-100 dark:bg-slate-800'
    case 1: return 'bg-primary-100 dark:bg-primary-900'
    case 2: return 'bg-primary-300 dark:bg-primary-700'
    case 3: return 'bg-primary-500 dark:bg-primary-500'
    case 4: return 'bg-primary-700 dark:bg-primary-300'
    default: return 'bg-slate-100 dark:bg-slate-800'
  }
}

export default function Heatmap({ data, className = '' }: HeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date()
    const startDate = subDays(today, 364) // Show last 365 days
    const weeks: Array<Array<{ date: Date; sessions: number; intensity: number }>> = []
    
    let currentWeek: Array<{ date: Date; sessions: number; intensity: number }> = []
    let currentDate = startOfWeek(startDate, { weekStartsOn: 0 }) // Start on Sunday

    for (let i = 0; i < 371; i++) { // A bit more to ensure we cover full weeks
      const dayData = data.find(d => isSameDay(new Date(d.date), currentDate))
      const sessions = dayData?.sessions || 0
      const intensity = getIntensity(sessions)

      currentWeek.push({
        date: new Date(currentDate),
        sessions,
        intensity,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate = addDays(currentDate, 1)
      
      // Stop if we've gone past today
      if (currentDate > today) break
    }

    // Add any remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks.slice(-53) // Keep last 53 weeks to show full year
  }, [data])

  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; weekIndex: number }> = []
    const today = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = subDays(today, (11 - i) * 30) // Approximate month boundaries
      const weekIndex = Math.floor((heatmapData.length - 1) - (11 - i) * 4.3)
      
      if (weekIndex >= 0 && weekIndex < heatmapData.length) {
        labels.push({
          month: format(date, 'MMM'),
          weekIndex: Math.max(0, weekIndex),
        })
      }
    }
    
    return labels
  }, [heatmapData])

  const totalSessions = data.reduce((sum, day) => sum + day.sessions, 0)
  const averageSessions = data.length > 0 ? (totalSessions / data.length).toFixed(1) : '0'
  const currentStreak = useMemo(() => {
    let streak = 0
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    for (const day of sortedData) {
      if (day.sessions > 0) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }, [data])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            {totalSessions}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total Sessions
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            {averageSessions}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Daily Average
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            {currentStreak}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Current Streak
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Activity Heatmap
        </h3>
        
        <div className="flex flex-col space-y-1">
          {/* Month labels */}
          <div className="flex">
            <div className="w-8"></div> {/* Space for day labels */}
            <div className="flex-1 flex">
              {monthLabels.map(({ month, weekIndex }) => (
                <div
                  key={`${month}-${weekIndex}`}
                  className="text-xs text-slate-500 dark:text-slate-400"
                  style={{
                    marginLeft: `${weekIndex * 14}px`,
                    position: 'absolute',
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Day labels and heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col space-y-1 w-8">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div
                  key={day}
                  className={`text-xs text-slate-500 dark:text-slate-400 h-3 flex items-center ${
                    index % 2 === 0 ? '' : 'opacity-0'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex space-x-1 overflow-x-auto">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm border border-slate-200 dark:border-slate-700 ${getIntensityColor(day.intensity)} group relative cursor-pointer`}
                      title={`${format(day.date, 'MMM d, yyyy')}: ${day.sessions} sessions`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {format(day.date, 'MMM d, yyyy')}: {day.sessions} sessions
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded-sm border border-slate-200 dark:border-slate-700 ${getIntensityColor(intensity)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}