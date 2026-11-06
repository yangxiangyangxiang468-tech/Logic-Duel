// オフラインでも遊べるようにするサービスワーカー（GitHub Pages 版のみで動く）
// index.html は「通信できれば最新、だめなら保存済み」、ほかのファイル（PeerJS・フォント・アイコン）は保存済みを優先
const CACHE = "logical-casino-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const cacheable = url.origin === location.origin || /^(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname);
  if (!cacheable) return; // PeerJS の接続サーバーなどには手を出さない
  const put = res => { if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(put).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(put)));
});
