async function showMonthly() {
  const month = monthSelect.value;
  const year = yearSelect.value;

  const res = await fetch(`json/${year}.json`);
  const data = await res.json();
  const days = data.time[month];

  let html = `<table id="exportTable">
    <tr>
      <th>Tanggal</th><th>Imsak</th><th>Subuh</th>
      <th>Dzuhur</th><th>Ashar</th><th>Maghrib</th><th>Isya</th>
    </tr>`;

  days.forEach(d => {
    html += `<tr>
      <td>${d.tanggal}</td>
      <td>${d.imsak}</td>
      <td>${d.subuh}</td>
      <td>${d.dzuhur}</td>
      <td>${d.ashar}</td>
      <td>${d.maghrib}</td>
      <td>${d.isya}</td>
    </tr>`;
  });

  html += "</table>";
  document.getElementById("monthlyTable").innerHTML = html;
}
