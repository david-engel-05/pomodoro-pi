'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UseSupabaseConnectionReturn {
  isConnected: boolean
  isChecking: boolean
  lastChecked: Date | null
  error: string | null
}

export default function useSupabaseConnection(): UseSupabaseConnectionReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    setError(null)

    try {
      // Check if Supabase environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'placeholder-key') {
        setIsConnected(false)
        setError('Supabase configuration missing')
        return
      }

      // Try to perform a simple query to check connectivity
      const { error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (connectionError) {
        setIsConnected(false)
        setError(connectionError.message)
      } else {
        setIsConnected(true)
        setError(null)
      }
    } catch (err) {
      setIsConnected(false)
      setError(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setIsChecking(false)
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    isConnected,
    isChecking,
    lastChecked,
    error,
  }
}