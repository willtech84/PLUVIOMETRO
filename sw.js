// ================================================
// SERVICE WORKER — Pluviômetro Digital
// Versão: 1.3.0 — auditoria offline
// ================================================

var CACHE_NAME = 'pluviometro-v1.3.0';

var ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

var CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'esm.sh',
  'unpkg.com'
];

var API_HOSTS = [
  'api.open-meteo.com',
  'viacep.com.br',
  'nominatim.openstreetmap.org',
  'maps.google.com',
  'script.google.com'
];

function isHost(url, hosts) {
  try {
    return hosts.indexOf(new URL(url).hostname) !== -1;
  } catch (e) {
    return false;
  }
}

self.addEventListener('install', function(event) {
  console.log('[SW] Instalando versão: ' + CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(ASSETS_TO_CACHE); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Ativando versão: ' + CACHE_NAME);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = request.url;

  // Bibliotecas externas: cache-first depois da primeira utilização.
  // Isso permite abrir o aplicativo sem internet após ele já ter sido carregado.
  if (isHost(url, CDN_HOSTS)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        if (cached) return cached;
        return fetch(request).then(function(response) {
          if (response && response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // APIs: rede primeiro, pois os dados precisam ser atuais.
  // Se estiver offline, devolve uma resposta 503 previsível.
  if (isHost(url, API_HOSTS)) {
    event.respondWith(
      fetch(request).catch(function() {
        return new Response(JSON.stringify({ offline: true }), {
          status: 503,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      })
    );
    return;
  }

  // Arquivos locais: cache-first com atualização dos recursos novos.
  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) return cached;

      return fetch(request).then(function(response) {
        if (response && response.status === 200 && response.type !== 'opaque') {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
