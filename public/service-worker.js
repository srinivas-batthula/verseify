self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open("verseify-cache").then((cache) => {
            return cache.addAll(["https://srinivas-batthula.github.io/verseify/", "https://srinivas-batthula.github.io/verseify/manifest.json", "https://srinivas-batthula.github.io/verseify/icon.png", "https://srinivas-batthula.github.io/verseify/verseify.png"]);
        })
    );
    self.skipWaiting(); // Ensure immediate activation
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated!");
    event.waitUntil(clients.claim()); // Claim control immediately
});
