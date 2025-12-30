async function loadToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate().toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");

  const res = await fetch(`json/${year}.json`);
  const data = await res.json();

  const monthData = data.time[month];
  if (!monthData) {
    console.error("Data bulan tidak ditemukan:", month);
    return;
  }

  // Cari tanggal dengan format DD/MM/YYYY
  const today = monthData.find(d => {
    const parts = d.tanggal.split(", ");
    if (!parts[1]) return false;
    return parts[1] === `${day}/${monthStr}/${year}`;
  });

  if (!today) {
    console.error("Data hari ini tidak ditemukan di JSON");
    return;
  }

  // Simpan global untuk adzan.js
  window.todayScheduleData = today;

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
