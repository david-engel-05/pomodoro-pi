const CACHE_NAME = 'pomodoro-pi-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Error caching files:', error)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/')
        }
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline session storage
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Sync any pending session data when connection is restored
  return new Promise((resolve) => {
    console.log('Background sync triggered')
    resolve()
  })
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Pomodoro session complete!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start-break',
        title: 'Start Break',
        icon: '/icon-192x192.png'
      },
      {
        action: 'view-stats',
        title: 'View Stats',
        icon: '/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Pomodoro Pi', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'start-break') {
    event.waitUntil(
      clients.openWindow('/?action=break')
    )
  } else if (event.action === 'view-stats') {
    event.waitUntil(
      clients.openWindow('/statistics')
    )
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})