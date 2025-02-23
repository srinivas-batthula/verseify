const CACHE_NAME = "verseify-cache-v1";
const STATIC_FILES = [
    "https://srinivas-batthula.github.io/verseify/",
    "https://srinivas-batthula.github.io/verseify/manifest.json",
    "https://srinivas-batthula.github.io/verseify/icon.png",
    "https://srinivas-batthula.github.io/verseify/verseify.png",
];

// Install event: Cache essential assets
self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_FILES);
        })
    );
    self.skipWaiting();
});

// Fetch event: Serve cached files & fetch new ones
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).catch(() => {
                return caches.match("/verseify/offline.html");
            });
        })
    );
});

// Activate event: Delete old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker activated!");
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
    self.clients.claim();
});

// Push Notification Event
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "New Notification!";
    const options = {
        body: data.body || "You have a new message.",
        icon: "/verseify/icon.png",
        badge: "/verseify/icon.png",
        data: data.url || "/verseify/"
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle Notification Click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.notification.data) {
        event.waitUntil(clients.openWindow(event.notification.data));
    }
});
