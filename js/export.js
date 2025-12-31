/* =====================================================
   CONFIG
===================================================== */
const EXPORT_CONFIG = {
  headerHeight: 120,
  footerHeight: 60,
  margin: 15
};

/* =====================================================
   UTIL
===================================================== */
function getExportWrapper() {
  const el = document.getElementById("exportWrapper");
  if (!el) throw new Error("exportWrapper tidak ditemukan");
  return el;
}

function nowWIB() {
  return new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta"
  });
}

/* =====================================================
   WATERMARK (AMAN – TIDAK MEMUDARKAN TEKS)
===================================================== */
function drawWatermark(ctx, width, height) {
  const img = new Image();
  img.src = "assets/watermark.png";

  img.onload = () => {
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = "multiply";

    const size = Math.min(width, height) * 0.6;
    ctx.drawImage(
      img,
      (width - size) / 2,
      (height - size) / 2,
      size,
      size
    );

    ctx.restore();
  };
}

/* =====================================================
   HEADER & FOOTER (PDF)
===================================================== */
function drawPDFHeader(pdf, pageWidth) {
  pdf.addImage("assets/logo.png", "PNG", 15, 10, 18, 18);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Mushola Al-Ikhlas Pekunden", 40, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(
    "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
    40,
    24
  );

  pdf.setDrawColor(15, 118, 110);
  pdf.line(15, 28, pageWidth - 15, 28);
}

function drawPDFFooter(pdf, pageWidth, pageHeight, page, total) {
  pdf.setFontSize(9);
  pdf.text(
    `Dicetak pada ${nowWIB()} WIB`,
    15,
    pageHeight - 10
  );

  pdf.text(
    `Halaman ${page} / ${total}`,
    pageWidth - 50,
    pageHeight - 10
  );
}

/* =====================================================
   EXPORT PDF (A4 LANDSCAPE – MULTI PAGE AMAN)
===================================================== */
async function exportPDF() {
  document.body.classList.add("export-mode");

  const wrapper = getExportWrapper();
  const dpr = window.devicePixelRatio || 2;

  const canvas = await html2canvas(wrapper, {
    scale: dpr,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  const ctx = canvas.getContext("2d");
  drawWatermark(ctx, canvas.width, canvas.height);

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("l", "mm", "a4");

  const pageWidth = 297;
  const pageHeight = 210;

  const usableHeight =
    pageHeight -
    EXPORT_CONFIG.headerHeight / 4 -
    EXPORT_CONFIG.footerHeight / 4;

  const imgWidth = pageWidth - EXPORT_CONFIG.margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let yOffset = 0;
  let page = 1;
  const total = Math.ceil(imgHeight / usableHeight);

  while (yOffset < imgHeight) {
    if (page > 1) pdf.addPage();

    drawPDFHeader(pdf, pageWidth);

    pdf.addImage(
      imgData,
      "PNG",
      EXPORT_CONFIG.margin,
      35,
      imgWidth,
      imgHeight,
      undefined,
      "FAST",
      yOffset / imgHeight
    );

    drawPDFFooter(pdf, pageWidth, pageHeight, page, total);

    yOffset += usableHeight;
    page++;
  }

  pdf.save("jadwal-sholat-al-ikhlas.pdf");
  document.body.classList.remove("export-mode");
}

/* =====================================================
   HEADER & FOOTER (CANVAS PNG/JPG)
===================================================== */
function drawCanvasHeader(ctx, width) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, EXPORT_CONFIG.headerHeight);

  const logo = new Image();
  logo.src = "assets/logo.png";
  logo.onload = () => ctx.drawImage(logo, 20, 20, 70, 70);

  ctx.fillStyle = "#065f46";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Mushola Al-Ikhlas Pekunden", 110, 50);

  ctx.font = "20px Arial";
  ctx.fillText(
    "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
    110,
    80
  );

  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, EXPORT_CONFIG.headerHeight - 5);
  ctx.lineTo(width - 20, EXPORT_CONFIG.headerHeight - 5);
  ctx.stroke();
}

function drawCanvasFooter(ctx, width, height) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(
    0,
    height - EXPORT_CONFIG.footerHeight,
    width,
    EXPORT_CONFIG.footerHeight
  );

  ctx.fillStyle = "#000";
  ctx.font = "18px Arial";
  ctx.fillText(
    `Dicetak pada ${nowWIB()} WIB`,
    20,
    height - 20
  );
}

/* =====================================================
   EXPORT PNG / JPG (RETINA SAFE)
===================================================== */
async function exportImage(type = "png") {
  document.body.classList.add("export-mode");

  const wrapper = getExportWrapper();
  const dpr = window.devicePixelRatio || 2;

  const baseCanvas = await html2canvas(wrapper, {
    scale: dpr,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = baseCanvas.width;
  finalCanvas.height =
    baseCanvas.height +
    (EXPORT_CONFIG.headerHeight + EXPORT_CONFIG.footerHeight) * dpr;

  const ctx = finalCanvas.getContext("2d");

  drawCanvasHeader(ctx, finalCanvas.width);
  ctx.drawImage(
    baseCanvas,
    0,
    EXPORT_CONFIG.headerHeight * dpr
  );
  drawCanvasFooter(ctx, finalCanvas.width, finalCanvas.height);
  drawWatermark(ctx, finalCanvas.width, finalCanvas.height);

  const a = document.createElement("a");
  a.href = finalCanvas.toDataURL(
    `image/${type}`,
    type === "jpg" ? 0.95 : 1
  );
  a.download = `jadwal-sholat-al-ikhlas.${type}`;
  a.click();

  document.body.classList.remove("export-mode");
}

function exportPNG() {
  exportImage("png");
}

function exportJPG() {
  exportImage("jpg");
}

/* =====================================================
   EXPORT EXCEL (XLSX – AUTO WIDTH)
===================================================== */
function exportExcel() {
  const table = document.getElementById("exportTable");
  if (!table) {
    alert("Tabel jadwal belum ditampilkan");
    return;
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const data = rows.map(row =>
    Array.from(row.querySelectorAll("th, td")).map(cell =>
      cell.innerText.trim()
    )
  );

  // Header mushola
  data.unshift([
    "Mushola Al-Ikhlas Pekunden",
    "",
    "",
    "",
    "",
    "",
    ""
  ]);
  data.unshift([
    "Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah",
    "",
    "",
    "",
    "",
    "",
    ""
  ]);
  data.unshift([]);

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Auto column width
  ws["!cols"] = [
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Jadwal Sholat");

  XLSX.writeFile(
    wb,
    "jadwal-sholat-al-ikhlas.xlsx"
  );
}

/* =====================================================
   EXPORT WORD (DOC – HEADER & FOOTER)
===================================================== */
function exportWord() {
  const table = document.getElementById("exportTable");
  if (!table) {
    alert("Tabel jadwal belum ditampilkan");
    return;
  }

  const now = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta"
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    h1 {
      margin-bottom: 4px;
      color: #065f46;
    }
    h3 {
      margin-top: 0;
      font-weight: normal;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 6px;
      text-align: center;
      font-size: 12px;
    }
    th {
      background: #0f766e;
      color: white;
    }
    footer {
      margin-top: 30px;
      font-size: 10px;
    }
  </style>
</head>
<body>

<h1>Mushola Al-Ikhlas Pekunden</h1>
<h3>Pakulaut, Kec. Margasari, Kab. Tegal, Jawa Tengah</h3>

${table.outerHTML}

<footer>
  Dicetak pada ${now} WIB
</footer>

</body>
</html>
`;

  const blob = new Blob(
    ["\ufeff", html],
    { type: "application/msword" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jadwal-sholat-al-ikhlas.doc";
  a.click();
}
