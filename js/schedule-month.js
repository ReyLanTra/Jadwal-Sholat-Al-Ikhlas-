/* ======================================================
   SCHEDULE MONTH - UX FINAL
   Mushola Al-Ikhlas Pekunden
====================================================== */

let monthSelect;
let yearSelect;
let btnShow;

document.addEventListener("DOMContentLoaded", () => {
  monthSelect = document.getElementById("monthSelect");
  yearSelect = document.getElementById("yearSelect");
  btnShow = document.getElementById("btnShow");

  if (!monthSelect || !yearSelect || !btnShow) {
    console.error("Element tidak lengkap");
    return;
  }

  initSelect();

  // enable tombol hanya jika dua-duanya terisi
  monthSelect.addEventListener("change", checkReady);
  yearSelect.addEventListener("change", checkReady);
});

/* =========================
   INIT SELECT
========================= */
function initSelect() {
  const MONTHS = [
    "01","02","03","04","05","06",
    "07","08","09","10","11","12"
  ];

  monthSelect.innerHTML = `<option value="">Pilih Bulan</option>`;
  yearSelect.innerHTML = `<option value="">Pilih Tahun</option>`;

  MONTHS.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = new Date(2025, i)
      .toLocaleString("id-ID", { month: "long" });
    monthSelect.appendChild(opt);
  });

  for (let y = 2025; y <= 2030; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}

/* =========================
   ENABLE BUTTON
========================= */
function checkReady() {
  btnShow.disabled = !(monthSelect.value && yearSelect.value);
}

/* =========================
   BUTTON HANDLER
========================= */
function handleShow() {
  showLoading();
  setTimeout(showMonthly, 3000);
}

/* =========================
   LOADING UI
========================= */
function showLoading() {
  let rows = "";

  // 10 baris skeleton (estetis)
  for (let i = 0; i < 31; i++) {
    rows += `
      <tr>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
      </tr>
    `;
  }

  document.getElementById("monthlyTable").innerHTML = `
    <table class="skeleton-table">
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
        ${rows}
      </tbody>
    </table>
  `;
}

/* =========================
   LOAD DATA
========================= */
async function showMonthly() {
  const month = monthSelect.value;
  const year = yearSelect.value;

  if (!month || !year) {
    alert("Pilih bulan dan tahun terlebih dahulu");
    return;
  }

  const tableWrap = document.getElementById("monthlyTable");
  tableWrap.innerHTML = `<div class="skeleton-table"></div>`;

  let days = null;

  // =====================
  // 1. COBA ONLINE
  // =====================
  if (navigator.onLine) {
    try {
      const res = await fetch(`json/${year}.json`);
      const json = await res.json();

      days = json.time[month];
      if (days) {
        saveMonthlyToStorage(year, month, days);
      }
    } catch (err) {
      console.warn("Gagal fetch online, fallback offline");
    }
  }

  // =====================
  // 2. FALLBACK OFFLINE
  // =====================
  if (!days) {
    days = loadMonthlyFromStorage(year, month);
  }

  // =====================
  // 3. VALIDASI
  // =====================
  if (!days || !days.length) {
    tableWrap.innerHTML =
      "<p class='error'>Data jadwal tidak tersedia (offline & online kosong)</p>";
    return;
  }

  // =====================
  // 4. RENDER TABLE
  // =====================
  let html = `
  <table id="exportTable">
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
    <tbody>`;

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
      </tr>`;
  });

  html += "</tbody></table>";
  tableWrap.innerHTML = html;
}

/* =========================
   RENDER TABLE
========================= */
function renderTable(days) {
  let html = `
  <table id="exportTable" class="jadwal-table fade-in">
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

  html += "</tbody></table>";

  document.getElementById("monthlyTable").innerHTML = html;
}
