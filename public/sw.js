const CACHE_VERSION = 'saitama-v3'
const BASE = '/Saitama-training/'

// 설치 — 새 캐시 생성
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll([BASE, BASE + 'index.html'])
    )
  )
  // 대기 중인 SW를 즉시 활성화
  self.skipWaiting()
})

// 활성화 — 이전 캐시 삭제 + 클라이언트에 업데이트 알림
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const old = keys.filter((k) => k !== CACHE_VERSION)
      if (old.length > 0) {
        // 이전 버전 캐시가 있으면 → 앱 업데이트됨
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION })
          })
        })
      }
      return Promise.all(old.map((k) => caches.delete(k)))
    })
  )
  self.clients.claim()
})

// 네트워크 우선, 실패 시 캐시 (stale-while-revalidate 변형)
self.addEventListener('fetch', (event) => {
  const url = event.request.url

  // Firebase/외부 API 요청은 캐시 안 함
  if (
    url.includes('firestore') ||
    url.includes('googleapis') ||
    url.includes('firebase') ||
    url.includes('identitytoolkit')
  ) {
    return
  }

  // GET 요청만 캐시
  if (event.request.method !== 'GET') return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          // 캐시 히트 → 반환, 미스 → SPA 폴백 (index.html)
          if (cached) return cached
          // navigation 요청이면 index.html로 폴백 (SPA 라우팅 지원)
          if (event.request.mode === 'navigate') {
            return caches.match(BASE + 'index.html')
          }
          return cached
        })
      )
  )
})
