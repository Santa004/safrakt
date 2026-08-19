const CACHE = "mantorp-shell-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Endast nätverk — ingen avancerad offline-sync
  event.respondWith(fetch(event.request).catch(() => caches.match("/")));
});
