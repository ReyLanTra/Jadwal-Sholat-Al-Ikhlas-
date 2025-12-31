/* =====================================================
   UTIL
===================================================== */
function getExportTable() {
  const table = document.getElementById("exportTable");
  if (!table) {
    alert("Tabel jadwal belum ditampilkan");
    throw new Error("exportTable tidak ditemukan");
  }
  return table;
}

/* =====================================================
   FORCE STYLE SAAT EXPORT
===================================================== */
function forceExportStyle() {
  document.body.classList.add("export-force");
}

function restoreExportStyle() {
  document.body.classList.remove("export-force");
}

/* =====================================================
   EXPORT PDF (MULTI PAGE – AMAN)
===================================================== */
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

    const logo = new Image();
    logo.src = "assets/logo.png";
    logo.crossOrigin = "anonymous";

    logo.onload = () => {
      while (renderedHeight < imgHeight) {
        if (page > 1) pdf.addPage();

        /* HEADER */
        pdf.addImage(logo, "PNG", margin, 10, 18, 18);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Mushola Al-Ikhlas Pekunden", margin + 25, 18);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(
          "Pekunden, Kec. Dukuhturi, Kab. Tegal, Jawa Tengah",
          margin + 25,
          25
        );

        /* SLICE CANVAS */
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

        /* FOOTER */
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
  });
}

/* =====================================================
   EXPORT PNG
===================================================== */
function exportPNG() {
  forceExportStyle();

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {
    restoreExportStyle();

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "jadwal-sholat-al-ikhlas.png";
    a.click();
  });
}

/* =====================================================
   EXPORT JPG
===================================================== */
function exportJPG() {
  forceExportStyle();

  const table = getExportTable();

  html2canvas(table, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  }).then(canvas => {
    restoreExportStyle();

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.download = "jadwal-sholat-al-ikhlas.jpg";
    a.click();
  });
}

/* =====================================================
   EXPORT EXCEL (ANTI KOSONG)
===================================================== */
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

/* =====================================================
   EXPORT WORD
===================================================== */
function exportWord() {
  const table = getExportTable();
  const blob = new Blob([table.outerHTML], {
    type: "application/msword"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jadwal-sholat-al-ikhlas.doc";
  a.click();
}
