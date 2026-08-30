// ================================================
// SERVICE WORKER — Pluviômetro Digital
// Versão: 1.4.2 — novo ícone do app
// ================================================
var CACHE_NAME = 'pluviometro-v1.4.2';
var ASSETS_TO_CACHE = ['./','./index.html','./manifest.json','./src/menu-integration.js'];
var CDN_HOSTS = ['cdn.tailwindcss.com','esm.sh','unpkg.com'];
var API_HOSTS = ['api.open-meteo.com','archive-api.open-meteo.com','viacep.com.br','nominatim.openstreetmap.org','maps.google.com','script.google.com'];
function isHost(url,hosts){try{return hosts.indexOf(new URL(url).hostname)!==-1;}catch(e){return false;}}
self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(ASSETS_TO_CACHE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(names){return Promise.all(names.filter(function(name){return name!==CACHE_NAME;}).map(function(name){return caches.delete(name);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(event){
  var request=event.request,url=request.url;
  if(new URL(url).pathname.endsWith('/index.html') || new URL(url).pathname==='/' ){
    event.respondWith(fetch(request).then(function(response){
      if(!response || !response.ok)return response;
      return response.text().then(function(html){
        if(html.indexOf('src/menu-integration.js')===-1){html=html.replace('</body>','<script src="./src/menu-integration.js"></script>\\n</body>');}
        var transformed=new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
        caches.open(CACHE_NAME).then(function(cache){cache.put(request,transformed.clone());});
        return transformed;
      });
    }).catch(function(){return caches.match(request).then(function(cached){return cached||caches.match('./index.html');});}));
    return;
  }
  if(isHost(url,CDN_HOSTS)){
    event.respondWith(caches.match(request).then(function(cached){if(cached)return cached;return fetch(request).then(function(response){if(response&&response.ok){var clone=response.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(request,clone);});}return response;});}));return;
  }
  if(isHost(url,API_HOSTS)){
    event.respondWith(fetch(request).catch(function(){return new Response(JSON.stringify({offline:true}),{status:503,headers:{'Content-Type':'application/json; charset=utf-8'}});}));return;
  }
  event.respondWith(caches.match(request).then(function(cached){if(cached)return cached;return fetch(request).then(function(response){if(response&&response.status===200&&response.type!=='opaque'){var clone=response.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(request,clone);});}return response;}).catch(function(){return caches.match('./index.html');});}));
});
self.addEventListener('message',function(event){if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
