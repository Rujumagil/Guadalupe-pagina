// Scope limited to /panel/. Never cache authenticated CRM pages, responses or tokens.
self.addEventListener("install",event=>{self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(self.clients.claim())});
