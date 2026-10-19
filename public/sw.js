/**
 * PhysiX Service Worker
 * Bulletproof Offline-First & SPA Caching Strategy
 * Supports: direct URL navigation, offline reload, Ctrl+Shift+R, query-busted Vite assets
 */

const CACHE_VERSION = 'v7';
const APP_SHELL_CACHE = `physix-app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `physix-runtime-${CACHE_VERSION}`;

// Core assets to precache during install
const CORE_PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons.svg',
  '/cursor.png',
  '/offline.html',
  '/quiz.json',
  '/fonts/fonts.css',
  '/src/style.css',
  '/src/light-mode.css',
  '/src/main.js',
  '/src/streak.js',
  '/src/offline-manager.js',
  '/src/user-data-service.js',
  '/src/firebase.js',
  '/src/icons.js',
  '/src/logo-animation.js',
  '/src/api.js',
  '/src/celebrations.js',
  '/src/colour-sensor.js',
  '/src/content-protection.js',
  '/src/diffraction-grating.js',
  '/src/experiment-details-data.js',
  '/src/hall-effect.js',
  '/src/optical-fibre.js',
  '/src/pdf-export.js',
  '/src/planck.js',
  '/src/planck.css',
  '/src/quiz-data.js',
  '/src/splash.js'
];

// Install event - precache core app shell and assets safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      console.log('[SW] Precaching app shell & assets');
      await Promise.allSettled(
        CORE_PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (e) {
            // Silently skip files not applicable to current environment (e.g. /src files in prod build)
          }
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate event - claim clients and delete outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== APP_SHELL_CACHE && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Removing old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Universal Cache Matcher
 * Tries multiple matching strategies to handle query params (?v=..., ?t=...),
 * relative paths, and hard reloads (Ctrl+Shift+R / cache: 'reload')
 */
async function matchInCaches(request) {
  try {
    const url = typeof request === 'string' ? new URL(request, self.location.origin) : new URL(request.url);

    // 1. Exact match with ignoreSearch: true across all caches
    let match = await caches.match(request, { ignoreSearch: true });
    if (match) return match;

    // 2. Clean URL match (strip search parameters)
    match = await caches.match(url.origin + url.pathname, { ignoreSearch: true });
    if (match) return match;

    // 3. Match by pathname only
    match = await caches.match(url.pathname, { ignoreSearch: true });
    if (match) return match;

    // 4. Match pathname without leading slash
    match = await caches.match(url.pathname.replace(/^\//, ''), { ignoreSearch: true });
    if (match) return match;

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Safely store a valid response into the runtime cache under both
 * the full request and the clean pathname for maximum lookup hit rate.
 */
async function safeCachePut(request, response) {
  if (!response || (!response.ok && response.type !== 'opaque')) {
    return;
  }
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
    const url = new URL(request.url);
    if (url.search) {
      await cache.put(url.origin + url.pathname, response.clone());
    }
  } catch (e) {
    // Ignore cache quota or storage errors
  }
}

/**
 * Navigation Strategy (HTML documents & SPA routes)
 * Network-first when online, instant cache fallback when offline or slow.
 */
async function networkFirstNavigation(request) {
  if (navigator.onLine) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const networkResponse = await fetch(request, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (networkResponse && networkResponse.ok) {
        safeCachePut(request, networkResponse);
        return networkResponse;
      }
    } catch (error) {
      // Network failed or timed out, proceed to cache fallback
    }
  }

  // 1. Try matching the exact requested URL in cache
  const cachedResponse = await matchInCaches(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // 2. SPA client-side fallback: Return cached /index.html or / so all SPA routes function offline
  const appShell = (await matchInCaches('/index.html')) || 
                   (await matchInCaches('/'));
  if (appShell) {
    return appShell;
  }

  // 3. Fallback to offline page for un-cached first-time visitors
  const offlinePage = await matchInCaches('/offline.html');
  if (offlinePage) {
    return offlinePage;
  }

  return new Response('PhysiX Virtual Lab is currently offline.', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

/**
 * Stale-While-Revalidate for static assets (JS, CSS, images, JSON, SVG, fonts)
 * Returns cached asset immediately; revalidates in background if online;
 * NEVER returns undefined to avoid breaking respondWith().
 */
async function staleWhileRevalidate(request) {
  const url = new URL(request.url);

  // For localhost development, prioritize fresh network response so code edits reflect immediately
  if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') && navigator.onLine) {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
        safeCachePut(request, networkResponse);
        return networkResponse;
      }
    } catch (e) {}
  }

  // 1. Check cache first
  const cachedResponse = await matchInCaches(request);

  if (cachedResponse) {
    // If online, update cache in background
    if (navigator.onLine) {
      fetch(request).then((networkResponse) => {
        if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
          safeCachePut(request, networkResponse);
        }
      }).catch(() => {});
    }
    return cachedResponse;
  }

  // 2. If not in cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
      safeCachePut(request, networkResponse);
    }
    return networkResponse;
  } catch (error) {
    // 3. Network failed: check pathname fallback one last time
    const fallback = await matchInCaches(url.pathname);
    if (fallback) return fallback;

    // 4. Safe offline fallbacks by file type so respondWith never rejects
    if (request.destination === 'style' || url.pathname.endsWith('.css')) {
      return new Response('/* Offline fallback stylesheet */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    if (request.destination === 'script' || url.pathname.endsWith('.js')) {
      return new Response('// Offline fallback script', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    if (request.destination === 'image' || url.pathname.match(/\.(png|svg|jpg|jpeg|gif|webp|ico)$/i)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    if (url.pathname.endsWith('.json')) {
      return new Response('{}', {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Resource offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Cache-first strategy for Google Fonts and immutable fonts
 */
async function cacheFirst(request) {
  const cachedResponse = await matchInCaches(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
      safeCachePut(request, networkResponse);
    }
    return networkResponse;
  } catch (error) {
    if (request.destination === 'style' || request.url.includes('fonts.googleapis.com')) {
      return new Response('/* Google fonts offline */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    return new Response('Font offline', { status: 503 });
  }
}

/**
 * Network-only for Firebase Auth, Firestore, and backend API endpoints
 */
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-http schemes
  if (!request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // 1. Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // 2. Firebase Auth endpoints - network only (fresh state required)
  if (url.hostname.includes('firebaseauth.googleapis.com') ||
      url.hostname.includes('securetoken.googleapis.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // 3. Firebase Firestore & FCM endpoints - network only
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('fcmregistrations.googleapis.com')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // 4. API calls to Express backend - network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // 5. Google Fonts - cache first
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 6. All static assets (JS, CSS, images, JSON, SVG, fonts, manifest)
  event.respondWith(staleWhileRevalidate(request));
});

// Message event for skip waiting or explicit cache requests
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_URLS' && Array.isArray(event.data.urls)) {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        await Promise.allSettled(
          event.data.urls.map(async (u) => {
            try {
              const res = await fetch(u);
              if (res.ok) await cache.put(u, res);
            } catch (e) {}
          })
        );
      })
    );
  }
});

// ==========================================================================
// BACKGROUND PUSH NOTIFICATIONS & CLICK HANDLING
// ==========================================================================

/**
 * Safely sanitize and validate a notification target URL.
 * Strictly restricts navigation to same-origin paths and approved PhysiX relative paths.
 * Blocks any external domain, javascript:, data:, or malformed protocols.
 */
function sanitizeNotificationUrl(rawUrl, baseOrigin) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '/';
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) return '/';

  // Prevent dangerous protocol schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return '/';
  }

  try {
    const origin = baseOrigin || self.location.origin;
    const resolved = new URL(trimmed, origin);

    // Enforce strictly same-origin
    if (resolved.origin !== origin) {
      return '/';
    }

    return resolved.pathname + resolved.search + resolved.hash;
  } catch (e) {
    return '/';
  }
}

/**
 * Safely sanitize notification icon/badge asset URLs.
 * Restricts to same-origin or returns a safe local default.
 */
function sanitizeAssetUrl(rawUrl, defaultUrl, baseOrigin) {
  if (!rawUrl || typeof rawUrl !== 'string') return defaultUrl;
  const trimmed = rawUrl.trim();
  if (!trimmed || /^(javascript|data|vbscript):/i.test(trimmed)) return defaultUrl;
  try {
    const origin = baseOrigin || self.location.origin;
    const resolved = new URL(trimmed, origin);
    if (resolved.origin !== origin) return defaultUrl;
    return resolved.pathname + resolved.search;
  } catch (e) {
    return defaultUrl;
  }
}

/**
 * FCM Push Notification Contract:
 * To avoid duplicate notifications in Chromium browsers, the scheduled backend
 * MUST send "data-only" messages where all values are strings:
 * {
 *   "data": {
 *     "title": "Your PhysiX streak is at risk!",
 *     "body": "Complete a physics activity before midnight to protect your streak.",
 *     "url": "/",
 *     "icon": "/favicon.svg",
 *     "tag": "physix-streak-reminder"
 *   }
 * }
 */
self.addEventListener('push', (event) => {
  const DEFAULT_TITLE = 'PhysiX — Daily Streak Reminder';
  const DEFAULT_BODY = "Don't break your learning momentum! Complete an experiment today.";
  const DEFAULT_ICON = '/favicon.svg';

  let title = DEFAULT_TITLE;
  let body = DEFAULT_BODY;
  let icon = DEFAULT_ICON;
  let badge = DEFAULT_ICON;
  let tag = 'physix-streak-reminder';
  let targetUrl = '/';
  let payloadData = {};

  if (event.data) {
    try {
      const payload = event.data.json();
      // Support primary data-only contract, with notification fallback
      const data = (payload && typeof payload.data === 'object' && payload.data !== null) ? payload.data : {};
      const notification = (payload && typeof payload.notification === 'object' && payload.notification !== null) ? payload.notification : {};

      // Data fields take precedence to align with data-only contract
      title = (typeof data.title === 'string' && data.title.trim()) || 
              (typeof notification.title === 'string' && notification.title.trim()) || 
              (typeof payload.title === 'string' && payload.title.trim()) || 
              title;

      body = (typeof data.body === 'string' && data.body.trim()) || 
             (typeof notification.body === 'string' && notification.body.trim()) || 
             (typeof payload.body === 'string' && payload.body.trim()) || 
             body;

      const rawIcon = data.icon || notification.icon;
      icon = sanitizeAssetUrl(rawIcon, DEFAULT_ICON, self.location.origin);

      const rawBadge = data.badge || notification.badge;
      badge = sanitizeAssetUrl(rawBadge, DEFAULT_ICON, self.location.origin);

      tag = (typeof data.tag === 'string' && data.tag.trim()) || 
            (typeof notification.tag === 'string' && notification.tag.trim()) || 
            tag;

      const rawUrl = data.url || notification.click_action || payload.url;
      targetUrl = sanitizeNotificationUrl(rawUrl, self.location.origin);

      payloadData = {
        url: targetUrl,
        ...data
      };
    } catch (e) {
      try {
        const text = event.data.text();
        if (text && typeof text === 'string') {
          body = text.trim();
        }
      } catch (_) {}
    }
  }

  const options = {
    body,
    icon,
    badge,
    tag, // re-using tag replaces/updates any prior notification instead of stacking duplicates
    renotify: true,
    data: payloadData
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawUrl = event.notification.data?.url || '/';
  const safePath = sanitizeNotificationUrl(rawUrl, self.location.origin);
  const targetUrl = new URL(safePath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && safePath !== '/') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

