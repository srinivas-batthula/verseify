// const CACHE_NAME = `verseify-cache-v${process.env.NEXT_PUBLIC_CACHE_VERSION || '9'}`


const CACHE_NAME = `verseify-cache-v36`                   //Change this to a new version before every New DEPLOY.............................
const HOME = 'https://verseify.netlify.app'

const STATIC_FILES = [
    HOME+"/",
    // "https://srinivas-batthula.github.io/verseify/public/",
    HOME+"/manifest.json",
    HOME+"/icon.png",
    HOME+"/verseify.png",
    HOME+"/badge.svg",
    HOME+"/notification.wav",
]

// Install event: Cache essential assets
self.addEventListener("install", (event) => {
    console.log("Service Worker installing...")
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_FILES)
        })
    );
    self.skipWaiting()
})


// Activate event: Delete old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker activated!")
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key)
                })
            )
        )
    )
    self.clients.claim()
})


let url = HOME
//Push Notifications...
self.addEventListener('push', async(event) => {
    console.log("Push received...")
    let data = event.data ? event.data.json() : { title: 'You have a new Notification!', body: 'You have a new notification alert from ~Verseify.' }
    url = (data.url!=='')?data.url : url

    const options = {
        body: data.body,
        icon: './icon.png', // Replace with your icon file path if available
        badge: './badge.svg',
        vibrate: [150, 80, 150],
        sound: './notification.wav',
        actions: [
            {
                action: 'open',
                title: 'view'
            },
            {
                action: 'dismiss',
                title: 'dismiss'
            },
        ]
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    )

    
    // Send data to the main thread
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: 'SAVE_NOTIFICATION', data: data })
        })
    })
})

self.addEventListener('notificationclick', (event) => {
    const action = event.action

    if (action === 'dismiss') {
        event.notification.close()
    }

    else if (action === 'open') {
        event.notification.close()
        event.waitUntil(
            clients.openWindow(url) // Replace with your desired route URL
        )
    }

    else {
        event.notification.close()
        event.waitUntil(
            clients.openWindow(HOME) // Replace with your desired home URL
        )
    }
})
