'use client'

import { useState, useEffect, useCallback } from 'react'

export default function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [supported])

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!supported || permission !== 'granted') return null

    try {
      return new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      })
    } catch (error) {
      console.error('Error showing notification:', error)
      return null
    }
  }, [supported, permission])

  return {
    supported,
    permission,
    granted: permission === 'granted',
    requestPermission,
    showNotification,
  }
}