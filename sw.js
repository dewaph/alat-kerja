/* Service worker Pengelola Alat Kerja: menerima notifikasi push.
   Taruh file ini di folder yang SAMA dengan Pengelola_Alat_Kerja.html (harus https). */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Pengelola Alat Kerja", {
    body: d.body || "",
    tag: d.tag || "alat",
    renotify: true,
    data: { url: d.url || self.registration.scope }
  }));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var u = (e.notification.data && e.notification.data.url) || self.registration.scope;
  var base = u.split("#")[0];
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.split("#")[0] === base && "focus" in list[i]) return list[i].focus();
    }
    return self.clients.openWindow(u);
  }));
});
