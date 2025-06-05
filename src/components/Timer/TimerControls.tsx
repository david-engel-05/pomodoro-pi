'use client'

import { PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { TimerState } from '@/types'

interface TimerControlsProps {
  state: TimerState
  onStart: () => void
  onPause: () => void
  onStop: () => void
  onReset: () => void
  disabled?: boolean
}

export default function TimerControls({
  state,
  onStart,
  onPause,
  onStop,
  onReset,
  disabled = false
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Start/Pause button */}
      {state === 'idle' || state === 'paused' ? (
        <button
          onClick={onStart}
          disabled={disabled}
          className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="w-5 h-5" />
          <span>{state === 'idle' ? 'Start' : 'Resume'}</span>
        </button>
      ) : (
        <button
          onClick={onPause}
          disabled={disabled}
          className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PauseIcon className="w-5 h-5" />
          <span>Pause</span>
        </button>
      )}
      
      {/* Stop button */}
      {(state === 'running' || state === 'paused') && (
        <button
          onClick={onStop}
          disabled={disabled}
          className="btn-secondary flex items-center space-x-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <StopIcon className="w-5 h-5" />
          <span>Stop</span>
        </button>
      )}
      
      {/* Reset button */}
      {(state === 'completed' || state === 'idle') && (
        <button
          onClick={onReset}
          disabled={disabled}
          className="btn-secondary flex items-center space-x-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  )
}