/* =====================================================
   ADZAN + RAMADHAN NOTIFICATION SYSTEM
   Mushola Al-Ikhlas Pekunden
===================================================== */

let played = {};

/* =========================
   KONFIGURASI
========================= */
const ADZAN_TIMES = ["subuh", "dzuhur", "ashar", "maghrib", "isya"];

// Mode Ramadhan (AUTO)
function isRamadhan() {
  const now = new Date();
  const start = new Date("2026-02-18T00:00:00");
  const end   = new Date("2026-03-19T23:59:59");
  return now >= start && now <= end;
}

/* =========================
   NOTIFICATION HELPER
========================= */
function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body,
        icon: "assets/logo.png",
        badge: "assets/logo.png",
        vibrate: [200, 100, 200]
      });
    });
  }
}

/* =========================
   MAIN CHECKER
========================= */
function checkTimes() {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0,5);

  document.querySelectorAll(".card").forEach(card => {
    const time = card.dataset.time;
    const name = card.querySelector("h3").textContent.toLowerCase();
    const key = `${name}-${time}`;

    if (time !== hhmm || played[key]) return;

    /* ===== SHOLAT WAJIB ===== */
    if (ADZAN_TIMES.includes(name)) {
      played[key] = true;

      let audio;
      if (name === "subuh") {
        audio = new Audio("assets/adzan-subuh.mp3");
      } else {
        audio = new Audio("assets/adzan.mp3");
      }

      audio.play();
      sendNotification(
        `Waktu ${name.toUpperCase()}`,
        `Telah masuk waktu sholat ${name}`
      );

      // Buka puasa khusus Ramadhan
      if (name === "maghrib" && isRamadhan()) {
        setTimeout(() => {
          sendNotification(
            "Buka Puasa",
            "Selamat berbuka puasa"
          );
        }, 1000);
      }
    }

    /* ===== IMSAK (RAMADHAN) ===== */
    if (name === "imsak" && isRamadhan()) {
      played[key] = true;

      new Audio("assets/sirine-imsak.mp3").play();
      sendNotification(
        "Imsak",
        "Telah masuk waktu imsak"
      );
    }
  });

  /* ===== SAHUR JAM 03:00 ===== */
  if (isRamadhan() && hhmm === "03:00" && !played["sahur"]) {
    played["sahur"] = true;

    new Audio("assets/alarm-sahur.mp3").play();
    sendNotification(
      "Waktu Sahur",
      "Segera melaksanakan sahur"
    );
  }
}

/* =========================
   RESET HARIAN
========================= */
function resetDaily() {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 1) {
    played = {};
  }
}

/* =========================
   INTERVAL
========================= */
setInterval(() => {
  checkTimes();
  resetDaily();
}, 1000);
