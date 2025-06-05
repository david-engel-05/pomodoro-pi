'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import useStatistics from '@/hooks/useStatistics'
import Heatmap from '@/components/Statistics/Heatmap'
import StatisticsCard from '@/components/Statistics/StatisticsCard'
import CategoryChart from '@/components/Statistics/CategoryChart'

export default function Statistics() {
  const {
    dailyStats,
    categoryStats,
    totalSessions,
    totalWorkTime,
    currentStreak,
    loading,
    error
  } = useStatistics()

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
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
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
            <ArrowLeftIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            📊 Statistics
          </h1>
        </div>
      </header>

      {/* Statistics Content */}
      <main className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {error && (
            <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-300 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatisticsCard
              title="Total Sessions"
              value={totalSessions}
              subtitle="Completed pomodoros"
              icon={<span className="text-2xl">🍅</span>}
            />
            <StatisticsCard
              title="Total Focus Time"
              value={formatTime(totalWorkTime)}
              subtitle="Time spent working"
              icon={<span className="text-2xl">⏰</span>}
            />
            <StatisticsCard
              title="Current Streak"
              value={`${currentStreak} days`}
              subtitle="Consecutive active days"
              icon={<span className="text-2xl">🔥</span>}
            />
          </div>

          {/* Activity Heatmap */}
          <div className="card p-6">
            <Heatmap data={dailyStats} />
          </div>

          {/* Category Breakdown */}
          {categoryStats.length > 0 && (
            <CategoryChart
              data={categoryStats}
              categories={[]}
            />
          )}

          {/* No Data State */}
          {totalSessions === 0 && (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">🍅</div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                No sessions yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Complete your first Pomodoro session to see statistics here.
              </p>
              <Link href="/" className="btn-primary">
                Start Your First Session
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          {totalSessions > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  {Math.round(totalWorkTime / totalSessions / 60)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Avg. session (min)
                </div>
              </div>
              
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  {dailyStats.filter(day => day.sessions > 0).length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Active days
                </div>
              </div>
              
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  {Math.max(...dailyStats.map(day => day.sessions), 0)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Best day
                </div>
              </div>
              
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  {categoryStats.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Categories used
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}