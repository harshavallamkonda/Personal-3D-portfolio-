const CACHE_NAME = 'harsha-portfolio-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/main.min.js',
    '/assets/images/harsha-profile.jpg',
    '/assets/icons/favicon.ico'
];

// Files to cache on demand
const DYNAMIC_FILES = [
    '/.netlify/functions/contact',
    '/.netlify/functions/geolocation',
    '/.netlify/functions/weather'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch((error) => {
                console.error('Failed to cache static files:', error);
            })
    );
    
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Claim all clients
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
        // HTML files - cache first, then network
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
        // CSS/JS files - cache first, then network
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.pathname.endsWith('.jpg') || url.pathname.endsWith('.png') || url.pathname.endsWith('.webp')) {
        // Images - cache first, then network
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.pathname.includes('/.netlify/functions/')) {
        // API calls - network first, then cache
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // Other files - network first
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

// Network first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Network first strategy failed:', error);
        
        // Try to serve from cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Network error', { status: 503 });
    }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Get stored form data
        const formData = await getStoredFormData();
        if (formData) {
            // Attempt to submit form data
            const response = await fetch('/.netlify/functions/contact', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // Clear stored form data on success
                await clearStoredFormData();
                console.log('Background sync successful');
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Store form data for offline submission
async function storeFormData(formData) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put('/offline-form', new Response(JSON.stringify(formData)));
    } catch (error) {
        console.error('Failed to store form data:', error);
    }
}

// Get stored form data
async function getStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/offline-form');
        if (response) {
            return JSON.parse(await response.text());
        }
    } catch (error) {
        console.error('Failed to get stored form data:', error);
    }
    return null;
}

// Clear stored form data
async function clearStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete('/offline-form');
    } catch (error) {
        console.error('Failed to clear stored form data:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'STORE_FORM_DATA') {
        storeFormData(event.data.formData);
    }
});