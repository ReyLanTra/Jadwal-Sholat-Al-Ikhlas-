/*async function showMonthly() {
  const now = new Date();

  const month = monthSelect.value || (now.getMonth() + 1);
  const year = yearSelect.value || now.getFullYear();

  try {
    const res = await fetch(`json/${year}.json`);
    if (!res.ok) throw new Error("File JSON tidak ditemukan");

    const data = await res.json();
    const days = data.time[month];

    if (!days) {
      document.getElementById("monthlyTable").innerHTML =
        "<p>Data bulan tidak tersedia</p>";
      return;
    }

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

  } catch (err) {
    console.error(err);
    document.getElementById("monthlyTable").innerHTML =
      "<p>Gagal memuat jadwal sholat</p>";
  }
}*/

const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

const MONTHS = [
  "01","02","03","04","05","06",
  "07","08","09","10","11","12"
];

function initSelect() {
  // Month
  MONTHS.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = new Date(2025, i)
      .toLocaleString("id-ID", { month: "long" });
    monthSelect.appendChild(opt);
  });

  // Year
  for (let y = 2024; y <= 2027; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  // default ke sekarang
  const now = new Date();
  monthSelect.value = String(now.getMonth()+1).padStart(2,"0");
  yearSelect.value = now.getFullYear();
}

initSelect();

monthSelect.addEventListener("change", showMonthly);
yearSelect.addEventListener("change", showMonthly);

async function showMonthly() {
  const month = monthSelect.value;
  const year = yearSelect.value;

  if (!month || !year) return;

  const res = await fetch(`json/${year}.json`);
  if (!res.ok) {
    alert("File jadwal tahun tidak ditemukan");
    return;
  }

  const data = await res.json();
  const days = data.time?.[month];

  if (!days) {
    document.getElementById("monthlyTable").innerHTML =
      "<p>Data bulan tidak tersedia</p>";
    return;
  }

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
