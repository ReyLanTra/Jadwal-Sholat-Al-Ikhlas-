async function loadToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate().toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");

  const STORAGE_KEY = `jadwal-${year}-${month}`;

  let monthData = null;

  /* =========================
     1️⃣ COBA AMBIL ONLINE
  ========================== */
  if (navigator.onLine) {
    try {
      const res = await fetch(`json/${year}.json`);
      const data = await res.json();

      if (data.time && data.time[month]) {
        monthData = data.time[month];

        // Simpan ke LocalStorage (OFFLINE CACHE)
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(monthData)
        );
      }
    } catch (err) {
      console.warn("Fetch online gagal, fallback offline");
    }
  }

  /* =========================
     2️⃣ FALLBACK OFFLINE
  ========================== */
  if (!monthData) {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      monthData = JSON.parse(cached);
    }
  }

  if (!monthData) {
    console.error("Data jadwal tidak tersedia (online & offline)");
    return;
  }

  /* =========================
     3️⃣ CARI DATA HARI INI
  ========================== */
  const today = monthData.find(d => {
    const parts = d.tanggal.split(", ");
    if (!parts[1]) return false;
    return parts[1] === `${day}/${monthStr}/${year}`;
  });

  if (!today) {
    console.error("Data hari ini tidak ditemukan");
    return;
  }

  // Simpan global untuk adzan.js
  window.todayScheduleData = today;

  /* =========================
     4️⃣ RENDER UI
  ========================== */
  const prayers = [
    ["imsak","Imsak"],
    ["subuh","Subuh"],
    ["terbit","Terbit"],
    ["dhuha","Dhuha"],
    ["dzuhur","Dzuhur"],
    ["ashar","Ashar"],
    ["maghrib","Maghrib"],
    ["isya","Isya"]
  ];

  const container = document.getElementById("todaySchedule");
  container.innerHTML = "";

  prayers.forEach(([key, label]) => {
    container.innerHTML += `
      <div class="card" data-time="${today[key]}">
        <h3>${label}</h3>
        <div>${today[key]}</div>
      </div>
    `;
  });
}

loadToday();
