// ================================================
// SERVICE WORKER — Pluviômetro Digital
// Versão: 1.2.0
// ================================================

var CACHE_NAME = 'pluviometro-v1.2.0';

var ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// ── Instalação: salva arquivos no cache ──
self.addEventListener('install', function(event) {
  console.log('[SW] Instalando versão: ' + CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function() {
      // Ativa imediatamente sem esperar fechar abas
      return self.skipWaiting();
    })
  );
});

// ── Ativação: remove caches antigos ──
self.addEventListener('activate', function(event) {
  console.log('[SW] Ativando versão: ' + CACHE_NAME);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) {
            console.log('[SW] Removendo cache antigo: ' + name);
            return caches.delete(name);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Intercepta requisições ──
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Requisições externas (CDN, APIs) → sempre tenta a rede primeiro
  var isExternal = (
    url.includes('cdn.tailwindcss.com') ||
    url.includes('esm.sh') ||
    url.includes('unpkg.com') ||
    url.includes('api.open-meteo.com') ||
    url.includes('viacep.com.br') ||
    url.includes('nominatim.openstreetmap.org') ||
    url.includes('maps.google.com') ||
    url.includes('script.google.com')
  );

  if (isExternal) {
    // Network first para externos — se falhar, silencia (não quebra o app)
    event.respondWith(
      fetch(event.request).catch(function() {
        return new Response('', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // Arquivos locais → Cache first (app funciona offline)
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(function(response) {
        // Salva no cache para próxima vez
        if (response && response.status === 200) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function() {
        // Fallback para o index.html se tudo falhar
        return caches.match('./index.html');
      });
    })
  );
});

// ── Recebe mensagens do app (ex: forçar atualização) ──
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
