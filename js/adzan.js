let played = {};

/* =========================
   UTILITIES
========================= */
function playAudio(src) {
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

function notify(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "assets/logo.png",
      vibrate: [200, 100, 200]
    });
  }
}

/* =========================
   MODE RAMADHAN
========================= */
function isRamadhan() {
  const now = new Date();
  const start = new Date("2026-02-18T00:00:00");
  const end   = new Date("2026-03-19T23:59:59");
  return now >= start && now <= end;
}

/* =========================
   ADZAN SHOLAT WAJIB
========================= */
function checkAdzan() {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5);

  document.querySelectorAll(".card").forEach(card => {
    const time = card.dataset.time;
    const name = card.querySelector("h3").textContent.toLowerCase();

    if (time === hhmm && !played[time]) {
      played[time] = true;

      // --- MAGHRIB SAAT RAMADHAN ---
      if (isRamadhan() && name === "maghrib") {
        notify("Waktu Buka Puasa", "Saatnya berbuka puasa");
        playAudio("assets/sirine-buka.mp3");

        setTimeout(() => {
          playAudio("assets/adzan.mp3");
        }, 5000);

        return;
      }

      // --- ADZAN BIASA ---
      if (name === "subuh") {
        playAudio("assets/adzan-subuh.mp3");
      } else {
        playAudio("assets/adzan.mp3");
      }
    }
  });
}

/* =========================
   EVENT KHUSUS RAMADHAN
========================= */
function checkRamadhanEvents(today) {
  if (!isRamadhan()) return;

  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5);

  // === SAHUR 03:00 ===
  if (hhmm === "03:00" && !played.sahur) {
    played.sahur = true;
    notify("Waktu Sahur", "Saatnya sahur • Mushola Al-Ikhlas");
    playAudio("assets/alarm-sahur.mp3");
  }

  // === IMSAK ===
  if (today && hhmm === today.imsak && !played.imsak) {
    played.imsak = true;
    notify("Waktu Imsak", "Imsak telah tiba");
    playAudio("assets/sirine-imsak.mp3");
  }
}

/* =========================
   RESET HARIAN (00:01)
========================= */
function resetDaily() {
  const now = new Date();
  const reset = new Date();
  reset.setHours(0, 1, 0, 0);
  if (reset < now) reset.setDate(reset.getDate() + 1);

  setTimeout(() => {
    played = {};
    resetDaily();
  }, reset - now);
}

/* =========================
   INIT
========================= */
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(() => {
  checkAdzan();
  if (window.todayScheduleData) {
    checkRamadhanEvents(window.todayScheduleData);
  }
}, 1000);

resetDaily();