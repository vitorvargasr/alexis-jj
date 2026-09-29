const CACHE_NAME = 'alexis-jj-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon-16.png',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/pwa-192.png',
  '/pwa-512.png',
  '/pwa-512-maskable.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Não interceptar requisições que não sejam GET
  if (event.request.method !== 'GET') {
    return
  }

  // NÃO cachear rotas de API, autenticação, mídia ou dados do PocketBase
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/files/') ||
    url.origin.includes('pocketbase') ||
    url.origin.includes('skipcloud')
  ) {
    return
  }

  // App shell estático e rotas SPA: Cache first para assets imutáveis com hash ou network-first robusto
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a resposta for válida, opcionalmente armazena no cache para recursos estáticos da mesma origem
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.startsWith(self.location.origin) &&
          !url.pathname.startsWith('/api')
        ) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(async () => {
        // Se offline, tenta responder do cache
        const cachedResponse = await caches.match(event.request)
        if (cachedResponse) {
          return cachedResponse
        }

        // Se for navegação de página (HTML), retorna o shell index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html')
        }

        return new Response('Rede indisponível', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      }),
  )
})
