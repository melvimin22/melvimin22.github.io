// Sculpt service worker: after the first visit with internet, the whole app opens offline.
const CACHE = 'sculpt-v2';
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=Unbounded:wght@500..800&display=swap';
const SHELL = ['./index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

async function notify(type) {
  const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  list.forEach((c) => c.postMessage({ type }));
}

// Fonts are optional: without them the phone's own font is used.
async function cacheFonts(cache) {
  try {
    const res = await fetch(FONT_CSS, { mode: 'cors' });
    if (!res.ok) return;
    const css = await res.clone().text();
    await cache.put(FONT_CSS, res);
    const urls = Array.from(css.matchAll(/url\((https:[^)]+)\)/g), (m) => m[1]);
    await Promise.all(urls.map((u) => fetch(u, { mode: 'cors' }).then((r) => (r.ok ? cache.put(u, r) : null)).catch(() => null)));
  } catch (e) { /* offline: fonts are saved on a later visit */ }
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    await cacheFonts(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('sculpt-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
    await notify('sculpt-offline-ready');
  })());
});

// The app opens instantly from the saved copy; a newer version is fetched in the background.
async function fromApp(e, isPage) {
  const req = e.request;
  const cache = await caches.open(CACHE);
  const hit = isPage ? await cache.match('./index.html') : await cache.match(req, { ignoreSearch: true });
  const hitCopy = hit ? hit.clone() : null;
  const refresh = (async () => {
    try {
      const res = await fetch(isPage ? new Request('./index.html', { cache: 'no-cache' }) : req);
      if (!res || !res.ok) return res;
      if (isPage) {
        const fresh = await res.clone().text();
        const old = hitCopy ? await hitCopy.text() : null;
        await cache.put('./index.html', res.clone());
        if (old !== null && old !== fresh) await notify('sculpt-update');
      } else {
        await cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      return null;
    }
  })();
  if (hit) {
    e.waitUntil(refresh);
    return hit;
  }
  const res = await refresh;
  if (res) return res;
  return (isPage && (await cache.match('./index.html'))) || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    const root = new URL(self.registration.scope).pathname;
    const isPage = req.mode === 'navigate';
    if (isPage && url.pathname !== root && url.pathname !== root + 'index.html') return;
    e.respondWith(fromApp(e, isPage));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req, { ignoreVary: true });
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) await cache.put(req, res.clone());
        return res;
      } catch (err) {
        return Response.error();
      }
    })());
  }
});
