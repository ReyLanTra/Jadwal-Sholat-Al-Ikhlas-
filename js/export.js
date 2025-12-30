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

/* function drawPDFHeader(pdf, pageWidth) {
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
} */

/* ===============================
   EXPORT PDF (A4 LANDSCAPE)
================================ */
function exportPDF() {
  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  }).then(canvas => {

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const headerHeight = 35;
    const footerHeight = 20;
    const margin = 10;

    const usableHeight =
      pageHeight - headerHeight - footerHeight - margin * 2;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let positionY = 0;
    let page = 1;
    const totalPages = Math.ceil(imgHeight / usableHeight);

    while (positionY < imgHeight) {
      if (page > 1) pdf.addPage();

      // HEADER
      pdf.setFontSize(14);
      pdf.text("Mushola Al-Ikhlas Pekunden", margin, 18);
      pdf.setFontSize(10);
      pdf.text(
        "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
        margin,
        25
      );

      // POTONG GAMBAR
      pdf.addImage(
        canvas,
        "PNG",
        margin,
        headerHeight,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
        0,
        positionY,
        canvas.width,
        (usableHeight * canvas.width) / imgWidth
      );

      // FOOTER
      const now = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta"
      });

      pdf.setFontSize(9);
      pdf.text(
        `Dicetak pada ${now} WIB`,
        margin,
        pageHeight - 10
      );

      pdf.text(
        `Halaman ${page} / ${totalPages}`,
        pageWidth - margin - 30,
        pageHeight - 10
      );

      positionY += usableHeight;
      page++;
    }

    pdf.save("jadwal-sholat-al-ikhlas.pdf");
  });
}Kecunction drawCanvasHeader(ctx, width) {
  const logo = new Image();
  logo.src = "../assets/logo.png";

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
  if (isRamadhan()) document.body.classList.add("ramadhan");

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height + 190;

    const ctx = finalCanvas.getContext("2d");

    drawCanvasHeader(ctx, finalCanvas.width);

    ctx.drawImage(canvas, 0, 120);

    drawCanvasFooter(ctx, finalCanvas.width, finalCanvas.height);

    drawWatermark(ctx, finalCanvas.width, finalCanvas.height);

    const a = document.createElement("a");
    a.href = finalCanvas.toDataURL("image/png");
    a.download = "jadwal-sholat-al-ikhlas.png";
    a.click();

    document.body.classList.remove("export-mode", "ramadhan");
  });
}

/* ===============================
   EXPORT JPG
================================ */
function exportJPG() {
  document.body.classList.add("export-mode");
  if (isRamadhan()) document.body.classList.add("ramadhan");

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height + 190;

    const ctx = finalCanvas.getContext("2d");

    drawCanvasHeader(ctx, finalCanvas.width);
    ctx.drawImage(canvas, 0, 120);
    drawCanvasFooter(ctx, finalCanvas.width, finalCanvas.height);
    drawWatermark(ctx, finalCanvas.width, finalCanvas.height);

    const a = document.createElement("a");
    a.href = finalCanvas.toDataURL("image/jpeg", 0.95);
    a.download = "jadwal-sholat-al-ikhlas.jpg";
    a.click();

    document.body.classList.remove("export-mode", "ramadhan");
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
