'use client'

import { useState } from 'react'
import useSupabaseConnection from '@/hooks/useSupabaseConnection'

interface ConnectionStatusProps {
  compact?: boolean
  showDetails?: boolean
}

export default function ConnectionStatus({ compact = false, showDetails = false }: ConnectionStatusProps) {
  const { isConnected, isChecking, lastChecked, error } = useSupabaseConnection()
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-500'
    if (isConnected) return 'text-green-500'
    return 'text-red-500'
  }

  const getStatusIcon = () => {
    if (isChecking) return '🔄'
    if (isConnected) return '🟢'
    return '🔴'
  }

  const getStatusText = () => {
    if (isChecking) return 'Checking...'
    if (isConnected) return 'Cloud Connected'
    return 'Local Mode'
  }

  if (compact) {
    return (
      <div 
        className={`flex items-center gap-1 text-xs ${getStatusColor()}`}
        title={isConnected ? 'Connected to Supabase' : error || 'Using local storage'}
      >
        <span className="text-xs">{getStatusIcon()}</span>
        {!isChecking && (
          <span className="hidden sm:inline">{getStatusText()}</span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <h3 className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </h3>
            {lastChecked && !isChecking && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        {showDetails && (
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
          >
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {(expanded || showDetails) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={getStatusColor()}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span>{isConnected ? 'Cloud Sync' : 'Local Storage'}</span>
            </div>
            {error && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}
            {isConnected && (
              <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                ✓ Data syncing across devices
              </div>
            )}
            {!isConnected && !error && (
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                ℹ️ Working offline - data stored locally
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}