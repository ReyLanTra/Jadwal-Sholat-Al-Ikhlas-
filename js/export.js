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

/* ===============================
   EXPORT PDF (A4 LANDSCAPE)
================================ */
async function exportPDF() {
  const table = getExportTable();

  const canvas = await html2canvas(table, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const ctx = canvas.getContext("2d");
  drawWatermark(ctx, canvas.width, canvas.height);

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("l", "mm", "a4");

  const pdfWidth = 297;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
  pdf.save("jadwal-sholat-al-ikhlas.pdf");
}

/* ===============================
   EXPORT PNG
================================ */
async function exportPNG() {
  const table = getExportTable();

  const canvas = await html2canvas(table, { scale: 2 });
  const ctx = canvas.getContext("2d");
  drawWatermark(ctx, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "jadwal-sholat-al-ikhlas.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ===============================
   EXPORT JPG
================================ */
async function exportJPG() {
  const table = getExportTable();

  const canvas = await html2canvas(table, { scale: 2 });
  const ctx = canvas.getContext("2d");
  drawWatermark(ctx, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "jadwal-sholat-al-ikhlas.jpg";
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
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
