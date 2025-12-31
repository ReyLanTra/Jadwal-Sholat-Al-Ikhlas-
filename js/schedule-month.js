let monthSelect;
let yearSelect;

document.addEventListener("DOMContentLoaded", () => {
  monthSelect = document.getElementById("monthSelect");
  yearSelect = document.getElementById("yearSelect");

  if (!monthSelect || !yearSelect) {
    console.error("monthSelect / yearSelect tidak ditemukan di HTML");
    return;
  }

  initSelect();

  monthSelect.addEventListener("change", showMonthly);
  yearSelect.addEventListener("change", showMonthly);
});

function initSelect() {
  const MONTHS = [
    "01","02","03","04","05","06",
    "07","08","09","10","11","12"
  ];

  monthSelect.innerHTML = "";
  yearSelect.innerHTML = "";

  MONTHS.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = new Date(2025, i).toLocaleString("id-ID", {
      month: "long"
    });
    monthSelect.appendChild(opt);
  });

  for (let y = 2025; y <= 2030; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  const now = new Date();
  monthSelect.value = String(now.getMonth() + 1).padStart(2, "0");
  yearSelect.value = now.getFullYear();

  // Auto load pertama kali
  //showMonthly();
}

/* =========================
   LOAD MONTHLY SCHEDULE
========================= */
async function showMonthly() {
  if (!monthSelect || !yearSelect) return;

  const month = monthSelect.value;
  const year = yearSelect.value;

  try {
    const res = await fetch(`json/${year}.json`);
    if (!res.ok) throw new Error("File JSON tidak ditemukan");

    const data = await res.json();
    const days = data.time?.[month];

    if (!days) {
      document.getElementById("monthlyTable").innerHTML =
        "<p>Data jadwal tidak tersedia.</p>";
      return;
    }

    renderTable(days);
  } catch (err) {
    console.error(err);
    document.getElementById("monthlyTable").innerHTML =
      "<p>Gagal memuat jadwal.</p>";
  }
}

/* =========================
   RENDER TABLE
========================= */
function renderTable(days) {
  let html = `
  <table id="exportTable" class="jadwal-table">
    <thead>
      <tr>
        <th>Tanggal</th>
        <th>Imsak</th>
        <th>Subuh</th>
        <th>Dzuhur</th>
        <th>Ashar</th>
        <th>Maghrib</th>
        <th>Isya</th>
      </tr>
    </thead>
    <tbody>
  `;

  days.forEach(d => {
    html += `
      <tr>
        <td>${d.tanggal}</td>
        <td>${d.imsak}</td>
        <td>${d.subuh}</td>
        <td>${d.dzuhur}</td>
        <td>${d.ashar}</td>
        <td>${d.maghrib}</td>
        <td>${d.isya}</td>
      </tr>
    `;
  });

  html += `
    </tbody>
  </table>
  `;

  document.getElementById("monthlyTable").innerHTML = html;
}
