/* ===============================
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

function withExportMode(fn) {
  document.body.classList.add("export-mode");

  setTimeout(async () => {
    await fn();
    document.body.classList.remove("export-mode");
  }, 100);
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
  pdf.text("Pekunden, Kec. Dukuhturi, Kab. Tegal, Jawa Tengah", 35, 21);

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

  pdf.save("jadwal-sholat-al-ikhlas-1-bulan.pdf");

  document.body.classList.remove("export-mode", "ramadhan");
}

/* ===============================
   EXPORT PNG
================================ */
function exportPNG() {
  withExportMode(async () => {
    const table = getExportTable();
    const canvas = await html2canvas(table, { scale: 2 });

    const ctx = canvas.getContext("2d");
    drawWatermark(ctx, canvas.width, canvas.height);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "jadwal-sholat-al-ikhlas.png";
    a.click();
  });
}

/* ===============================
   EXPORT JPG
================================ */
function exportJPG() {
  withExportMode(async () => {
    const table = getExportTable();
    const canvas = await html2canvas(table, { scale: 2 });

    const ctx = canvas.getContext("2d");
    drawWatermark(ctx, canvas.width, canvas.height);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.download = "jadwal-sholat-al-ikhlas.jpg";
    a.click();
  });
}

/* ===============================
   EXPORT EXCEL
================================ */
function exportExcel() {
  const table = getExportTable();
  const wb = XLSX.utils.table_to_book(table, {
    sheet: "Jadwal Sholat"
  });

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
  link.download = "jadwal-sholat-al-ikhlas.doc";
  link.click();
}
