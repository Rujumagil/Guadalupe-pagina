// Scope limited to /academia-guadalupe/. Protected learning content stays network-only.
self.addEventListener("install",event=>{self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(self.clients.claim())});
