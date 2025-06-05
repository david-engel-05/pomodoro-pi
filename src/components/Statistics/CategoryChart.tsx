'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Category } from '@/types'

interface CategoryChartProps {
  data: Array<{
    categoryId: string
    categoryName: string
    sessions: number
    workTime: number
    color: string
  }>
  categories: Category[]
  className?: string
}

export default function CategoryChart({ data, categories, className = '' }: CategoryChartProps) {
  const chartData = data.map(item => ({
    name: item.categoryName,
    value: item.sessions,
    color: item.color,
    workTime: item.workTime,
  }))

  const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0)

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sessions: {data.value}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Time: {formatTime(data.payload.workTime)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {((data.value / totalSessions) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Category Breakdown
        </h3>
        <div className="text-center text-slate-500 dark:text-slate-400 py-8">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Category Breakdown
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {data
            .sort((a, b) => b.sessions - a.sessions)
            .map((item) => {
              const percentage = (item.sessions / totalSessions) * 100
              
              return (
                <div key={item.categoryId} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {item.categoryName}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                        {item.sessions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{formatTime(item.workTime)}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
                      <div
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}