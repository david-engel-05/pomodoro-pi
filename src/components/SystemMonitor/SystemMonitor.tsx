'use client'

import { useState, useEffect } from 'react'
import { CpuChipIcon, CircleStackIcon } from '@heroicons/react/24/outline'
import { SystemInfo } from '@/types'

interface SystemMonitorProps {
  className?: string
}

export default function SystemMonitor({ className = '' }: SystemMonitorProps) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch('/api/system/info')
        if (!response.ok) {
          throw new Error('Failed to fetch system info')
        }
        const data = await response.json()
        setSystemInfo(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching system info:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchSystemInfo()

    // Set up interval for updates
    const interval = setInterval(fetchSystemInfo, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={`glass p-4 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`glass p-4 rounded-lg ${className}`}>
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <CpuChipIcon className="w-5 h-5 mx-auto mb-1" />
          <div>System monitor</div>
          <div className="text-xs">unavailable</div>
        </div>
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <div className={`glass p-4 rounded-lg ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <CpuChipIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            System Monitor
          </span>
        </div>

        {/* CPU Usage */}
        {systemInfo && (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">CPU</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">
                  {systemInfo.cpu.usage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(systemInfo.cpu.usage, 100)}%` }}
                />
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Memory</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">
                  {systemInfo.memory.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-success-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(systemInfo.memory.percentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {formatBytes(systemInfo.memory.used)} / {formatBytes(systemInfo.memory.total)}
              </div>
            </div>

            {/* Temperature (if available) */}
            {systemInfo.cpu.temperature && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Temp</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">
                    {systemInfo.cpu.temperature.toFixed(1)}°C
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      systemInfo.cpu.temperature > 70 ? 'bg-red-500' :
                      systemInfo.cpu.temperature > 50 ? 'bg-warning-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((systemInfo.cpu.temperature / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Last updated */}
        <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
          {systemInfo && (
            <>
              Updated {new Date(systemInfo.timestamp).toLocaleTimeString()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}