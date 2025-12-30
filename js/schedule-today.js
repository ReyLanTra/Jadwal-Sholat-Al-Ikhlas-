async function loadToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate().toString().padStart(2, "0");

  const res = await fetch(`json/${year}.json`);
  const data = await res.json();

  const today = data.time[month].find(d =>
    d.tanggal.includes(`/${day}/`)
  );

  const prayers = ["imsak","subuh","terbit","dhuha","dzuhur","ashar","maghrib","isya"];
  const container = document.getElementById("todaySchedule");
  container.innerHTML = "";

  prayers.forEach(p => {
    container.innerHTML += `
      <div class="card" data-time="${today[p]}">
        <h3>${p.toUpperCase()}</h3>
        <div>${today[p]}</div>
      </div>`;
  });
}

loadToday();
