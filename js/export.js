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

function forceExportStyle() {
  document.body.classList.add("export-force");
}

function restoreExportStyle() {
  document.body.classList.remove("export-force");
}

/* ===============================
   EXPORT PDF (MULTI PAGE)
================================ */
function exportPDF() {
  forceExportStyle();

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {
    restoreExportStyle();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 10;
    const headerHeight = 40;
    const footerHeight = 20;

    const usableHeight =
      pageHeight - headerHeight - footerHeight - margin * 2;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let renderedHeight = 0;
    let page = 1;
    const totalPages = Math.ceil(imgHeight / usableHeight);

    // LOAD LOGO DENGAN BENAR
    const logo = new Image();
    logo.src = "assets/logo.png";
    logo.crossOrigin = "anonymous";

    logo.onload = () => {
      while (renderedHeight < imgHeight) {
        if (page > 1) pdf.addPage();

        // HEADER
        pdf.addImage(logo, "PNG", margin, 10, 18, 18);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Mushola Al-Ikhlas Pekunden", margin + 25, 18);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(
          "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
          margin + 25,
          25
        );

        // POTONG CANVAS
        const sliceHeight = Math.min(
          usableHeight,
          imgHeight - renderedHeight
        );

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height =
          (sliceHeight * canvas.width) / imgWidth;

        const ctx = pageCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          (renderedHeight * canvas.width) / imgWidth,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );

        pdf.addImage(
          pageCanvas,
          "PNG",
          margin,
          headerHeight,
          imgWidth,
          sliceHeight
        );

        // FOOTER
        pdf.setFontSize(9);
        pdf.text(
          `Dicetak pada ${new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta"
          })} WIB`,
          margin,
          pageHeight - 10
        );

        pdf.text(
          `Halaman ${page} / ${totalPages}`,
          pageWidth - margin - 35,
          pageHeight - 10
        );

        renderedHeight += sliceHeight;
        page++;
      }

      pdf.save("jadwal-sholat-al-ikhlas.pdf");
    };
  Pekundenunction drawCanvasHeader(ctx, width) {
  const logo = new Image();
  logo.src = "assets/logo.png";

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
    "Pekunden, Kec. Dukuhturi, Kab. Tegal, Jawa Tengah",
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
  const rows = Array.from(table.querySelectorAll("tr"));

  const data = rows.map(row =>
    Array.from(row.querySelectorAll("th, td")).map(
      cell => cell.innerText.trim()
    )
  );

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Jadwal Sholat");

  XLSX.writeFile(wb, "jadwal-sholat-al-ikhlas.xlsx");
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
