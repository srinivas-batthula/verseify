// const CACHE_NAME = `verseify-cache-v${process.env.NEXT_PUBLIC_CACHE_VERSION || '9'}`
import { saveResponse } from "@/lib/indexedDB";


const CACHE_NAME = `verseify-cache-v12`                   //Change this to a new version before every New DEPLOY.............................

const STATIC_FILES = [
    "https://srinivas-batthula.github.io/verseify/",
    // "https://srinivas-batthula.github.io/verseify/public/",
    "https://srinivas-batthula.github.io/verseify/manifest.json",
    "https://srinivas-batthula.github.io/verseify/icon.png",
    "https://srinivas-batthula.github.io/verseify/verseify.png",
    "https://srinivas-batthula.github.io/verseify/badge.svg",
    "https://srinivas-batthula.github.io/verseify/notification.wav",
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

// Fetch event: Serve cached files & fetch new ones
// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//             return cachedResponse || fetch(event.request).catch(() => {
//                 return caches.match("/verseify/offline.html")
//             })
//         })
//     )
// })

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


async function handleSave(data) {
    const res = await saveResponse({id: data.id, response: data, store: 'notify'})
}

let url = NEXT_PUBLIC_HOME + ''
//Push Notifications...
self.addEventListener('push', async(event) => {
    console.log("Push received...")
    let data = event.data ? event.data.json() : { title: 'You have a new Notification!', body: 'You have a new notification alert from ~Verseify.' }
    url = body.url || NEXT_PUBLIC_HOME + ''

    await handleSave({id: data.id, title: data.title, body: data.body, date: new Date()})

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
            clients.openWindow(NEXT_PUBLIC_HOME + '') // Replace with your desired home URL
        )
    }
})
