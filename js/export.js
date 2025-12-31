/* ==========================
   WATERMARK
================================ */
function drawWatermark(ctx, width, height) {
  const img = new Image();
  img.src = "assets/watermark.png";

  img.onload = () => {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);

    const size = Math.min(width, height) * 0.7;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);

    ctx.restore();
  };
}

/* ===============================
   TABLE GETTER (WAJIB)
================================ */
function getExportTable() {
  const table = document.getElementById("exportTable");
  if (!table) {
    alert("Tabel jadwal belum ditampilkan");
    throw new Error("exportTable tidak ditemukan");
  }
  return table;
}

function withExportMode(fn) {
  document.body.classList.add("export-mode");

  setTimeout(async () => {
    await fn();
    document.body.classList.remove("export-mode");
  }, 100);
}

function drawPDFHeader(pdf, pageWidth) {
  pdf.addImage(
    "assets/logo.png",
    "PNG",
    10,
    8,
    18,
    18
  );

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Mushola Al-Ikhlas Pekunden", 35, 15);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah", 35, 21);

  pdf.setDrawColor(15, 118, 110);
  pdf.line(10, 26, pageWidth - 10, 26);
}

function drawPDFFooter(pdf, pageWidth, pageHeight, pageNum, total) {
  const now = new Date();
  const time = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta"
  });

  pdf.setFontSize(9);
  pdf.text(`Dicetak pada ${time} WIB`, 10, pageHeight - 10);
  pdf.text(
    `Halaman ${pageNum} / ${total}`,
    pageWidth - 50,
    pageHeight - 10
  );
}

/* ===============================
   EXPORT PDF (A4 LANDSCAPE)
================================ */
async function exportPDF() {
  document.body.classList.add("export-mode");
  if (isRamadhan()) document.body.classList.add("ramadhan");

  const table = getExportTable();

  const canvas = await html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  const ctx = canvas.getContext("2d");
  drawWatermark(ctx, canvas.width, canvas.height);

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth - 20;
  const imgHeight = canvas.height * imgWidth / canvas.width;

  let heightLeft = imgHeight;
  let position = 30;
  let pageNum = 1;

  const totalPages = Math.ceil(imgHeight / (pageHeight - 50));

  drawPDFHeader(pdf, pageWidth);
  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  drawPDFFooter(pdf, pageWidth, pageHeight, pageNum, totalPages);

  heightLeft -= (pageHeight - 50);

  while (heightLeft > 0) {
    pageNum++;
    pdf.addPage();
    drawPDFHeader(pdf, pageWidth);

    position = heightLeft - imgHeight + 30;
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    drawPDFFooter(pdf, pageWidth, pageHeight, pageNum, totalPages);
    heightLeft -= (pageHeight - 50);
  }

  pdf.save("jadwal-sholat-al-ikhlas_by-Reyy.pdf");

  document.body.classList.remove("export-mode", "ramadhan");
}

function drawThemeBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#064e3b");
  gradient.addColorStop(1, "#0f766e");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawImageHeader(ctx, width) {
  const logo = new Image();
  logo.src = "/assets/logo.png";

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(40, 30, width - 80, 130);

  logo.onload = () => {
    ctx.drawImage(logo, 60, 45, 90, 90);
  };

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Arial";
  ctx.fillText("Mushola Al-Ikhlas Pekunden", 170, 80);

  ctx.font = "20px Arial";
  ctx.fillText(
    "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
    170,
    115
  );

  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 155);
  ctx.lineTo(width - 60, 155);
  ctx.stroke();
}

function drawTextWatermark(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 4);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";

  ctx.fillText("© Mushola Al-Ikhlas Pekunden", 0, -20);
  ctx.font = "32px Arial";
  ctx.fillText("Created by Reyzar Alansyah Putra", 0, 40);

  ctx.restore();
}

function drawImageFooter(ctx, width, height) {
  const now = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta"
  });

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, height - 70, width, 70);

  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Arial";
  ctx.fillText(`Dicetak pada ${now} WIB`, 40, height - 30);
}

function drawCanvasHeader(ctx, width) {
  const logo = new Image();
  logo.src = "/assets/logo.png";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, 110);

  logo.onload = () => {
    ctx.drawImage(logo, 30, 20, 70, 70);
  };

  ctx.fillStyle = "#065f46";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Mushola Al-Ikhlas Pekunden", 120, 55);

  ctx.font = "20px Arial";
  ctx.fillText(
    "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
    120,
    85
  );

  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, 110);
  ctx.lineTo(width - 30, 110);
  ctx.stroke();
}

function drawCanvasFooter(ctx, width, height) {
  const now = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta"
  });

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, height - 80, width, 80);

  ctx.fillStyle = "#000000";
  ctx.font = "18px Arial";
  ctx.fillText(`Dicetak pada ${now} WIB`, 30, height - 30);
}

/* ===============================
   EXPORT PNG
================================ */
function exportPNG() {
  document.body.classList.add("export-mode");

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: null,
    useCORS: true
  }).then(tableCanvas => {

    const canvas = document.createElement("canvas");
    canvas.width = tableCanvas.width + 120;
    canvas.height = tableCanvas.height + 260;

    const ctx = canvas.getContext("2d");

    drawThemeBackground(ctx, canvas.width, canvas.height);
    drawImageHeader(ctx, canvas.width);

    ctx.drawImage(tableCanvas, 60, 180);

    drawImageFooter(ctx, canvas.width, canvas.height);
    drawTextWatermark(ctx, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "jadwal-sholat-al-ikhlas_poster.png";
    link.click();

    document.body.classList.remove("export-mode");
  });
}

/* ===============================
   EXPORT JPG
================================ */
function exportJPG() {
  document.body.classList.add("export-mode");

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: null,
    useCORS: true
  }).then(tableCanvas => {

    const canvas = document.createElement("canvas");
    canvas.width = tableCanvas.width + 120;
    canvas.height = tableCanvas.height + 260;

    const ctx = canvas.getContext("2d");

    drawThemeBackground(ctx, canvas.width, canvas.height);
    drawImageHeader(ctx, canvas.width);
    ctx.drawImage(tableCanvas, 60, 180);
    drawImageFooter(ctx, canvas.width, canvas.height);
    drawTextWatermark(ctx, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.download = "jadwal-sholat-al-ikhlas_poster.jpg";
    link.click();

    document.body.classList.remove("export-mode");
  });
}

/* ===============================
   EXPORT EXCEL
================================ */
function exportExcel() {
  const table = getExportTable();

  // Ambil semua baris
  const rows = Array.from(table.querySelectorAll("tr"));

  if (rows.length === 0) {
    alert("Tabel kosong, tidak bisa export Excel");
    return;
  }

  // Convert ke array data
  const data = rows.map(row =>
    Array.from(row.querySelectorAll("th, td")).map(cell =>
      cell.innerText.replace(/\s+/g, " ").trim()
    )
  );

  // Tambahkan HEADER INFO
  const infoHeader = [
    ["Mushola Al-Ikhlas Pekunden"],
    ["Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah"],
    [""]
  ];

  const finalData = [...infoHeader, ...data];

  // Buat worksheet
  const ws = XLSX.utils.aoa_to_sheet(finalData);

  // Atur lebar kolom
  ws["!cols"] = [
    { wch: 25 }, // Tanggal
    { wch: 10 }, // Imsak
    { wch: 10 }, // Subuh
    { wch: 10 }, // Dzuhur
    { wch: 10 }, // Ashar
    { wch: 10 }, // Maghrib
    { wch: 10 }  // Isya
  ];

  // Merge judul
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }
  ];

  // Buat workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Jadwal Sholat");

  // Export
  XLSX.writeFile(wb, "jadwal-sholat-al-ikhlas.xlsx");
}

/* ===============================
   EXPORT WORD
================================ */
function exportWord() {
  const table = getExportTable();

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        ${table.outerHTML}
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "jadwal-sholat-al-ikhlas_by-Reyy.docx";
  link.click();
}
