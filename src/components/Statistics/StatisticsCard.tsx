'use client'

import { ReactNode } from 'react'

interface StatisticsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export default function StatisticsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
}: StatisticsCardProps) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && (
              <div className="text-slate-600 dark:text-slate-400">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {value}
          </div>
          
          {subtitle && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </div>
          )}
        </div>

        {trend && (
          <div className={`text-sm font-medium ${
            trend.isPositive 
              ? 'text-success-600 dark:text-success-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            <span className="inline-flex items-center">
              {trend.isPositive ? '↗' : '↘'}
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}