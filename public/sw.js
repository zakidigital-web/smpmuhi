const CACHE = "smp-mutiara-v1";
const urls = [
  "/",
  "/berita",
  "/galeri",
  "/profil",
  "/program",
  "/kontak",
  "/ppdb",
  "/ppdb/daftar",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(urls))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});
