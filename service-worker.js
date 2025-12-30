self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

/* ==========================
   BACKGROUND NOTIFICATION
========================== */

function showNotif(title, body) {
  self.registration.showNotification(title, {
    body,
    icon: "assets/logo.png",
    vibrate: [300, 150, 300]
  });
}

/* ==========================
   TIMER RAMADHAN
========================== */

function isRamadhan() {
  const now = new Date();
  const start = new Date("2026-02-18T00:00:00");
  const end   = new Date("2026-03-19T23:59:59");
  return now >= start && now <= end;
}

function schedule(ms, callback) {
  setTimeout(callback, ms);
}

function scheduleDailyEvents() {
  const now = new Date();

  // === SAHUR 03:00 ===
  if (isRamadhan()) {
    const sahur = new Date();
    sahur.setHours(3,0,0,0);
    if (sahur > now) {
      schedule(sahur - now, () => {
        showNotif("Waktu Sahur", "Saatnya sahur • Mushola Al-Ikhlas");
      });
    }
  }
}

scheduleDailyEvents();