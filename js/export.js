/* ===============================
   UTIL
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
    ctx.drawImage(img, -300, -300, 600, 600);
    ctx.restore();
  };
}

/* ===============================
   HEADER + FOOTER CANVAS
================================ */
function drawCanvasHeaderFooter(ctx, width, height) {
  ctx.fillStyle = "#0f766e";
  ctx.fillRect(0, 0, width, 90);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.fillText("Mushola Al-Ikhlas Pekunden", 40, 45);

  ctx.font = "18px Arial";
  ctx.fillText("Tegal, Kec. Margasari, Kab. Tegal", 40, 70);

  ctx.font = "16px Arial";
  ctx.fillStyle = "#555";
  ctx.fillText(
    "Dicetak pada " +
      new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta"
      }) +
      " WIB",
    40,
    height - 30
  );
}

/* ===============================
   EXPORT PDF (MULTI PAGE)
================================ */
function exportPDF() {
  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 10;
    const headerHeight = 35;
    const footerHeight = 20;

    const usableHeight =
      pageHeight - headerHeight - footerHeight - margin * 2;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 0;
    let page = 1;
    const totalPage = Math.ceil(imgHeight / usableHeight);

    while (y < imgHeight) {
      if (page > 1) pdf.addPage();

      pdf.setFontSize(14);
      pdf.text("Mushola Al-Ikhlas Pekunden", margin, 18);
      pdf.setFontSize(10);
      pdf.text("Pekunden, Kab. Tegal", margin, 25);

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
        y,
        canvas.width,
        (usableHeight * canvas.width) / imgWidth
      );

      pdf.setFontSize(9);
      pdf.text(
        `Halaman ${page} / ${totalPage}`,
        pageWidth - margin - 30,
        pageHeight - 10
      );

      y += usableHeight;
      page++;
    }

    pdf.save("jadwal-sholat-al-ikhlas.pdf");
  });
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
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, "jadwal-sholat.xlsx");
}

/* ===============================
   EXPORT WORD
================================ */
function exportWord() {
  const table = getExportTable();
  const blob = new Blob([table.outerHTML], {
    type: "application/msword"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jadwal-sholat.doc";
  a.click();
}
