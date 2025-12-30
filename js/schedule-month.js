async function showMonthly() {
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
}
