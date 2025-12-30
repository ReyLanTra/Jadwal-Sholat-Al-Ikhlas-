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

/* ===============================
   EXPORT PDF (A4 LANDSCAPE)
================================ */
function exportPDF() {
  withExportMode(async () => {
    const table = getExportTable();

    const canvas = await html2canvas(table, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    const ctx = canvas.getContext("2d");
    drawWatermark(ctx, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("l", "mm", "a4");

    const w = 297;
    const h = canvas.height * w / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, w, h);
    pdf.save("jadwal-sholat-al-ikhlas.pdf");
  });
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
