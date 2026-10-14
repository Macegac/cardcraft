/* Cardcraft has moved into Rolecraft, and this is its last service worker.
   It takes away Cardcraft's offline copy, so the note in index.html shows instead of the
   cached app, then removes itself. Only Cardcraft's own caches (gcs-...) are deleted:
   Rolecraft lives at the same address and keeps its caches in the same store. Cards in
   IndexedDB are never touched, so Rolecraft can still bring them over. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('gcs-')).map(k => caches.delete(k)));
    await self.registration.unregister();
    // Reopen any Cardcraft page that's showing, so it loads the note.
    const pages = await self.clients.matchAll({ type: 'window' });
    pages.forEach(page => page.navigate(page.url).catch(() => {}));
  })());
});
