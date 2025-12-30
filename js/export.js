function drawWatermark(ctx, width, height) {
  const img = new Image();
  img.src = "assets/watermark.png";

  img.onload = () => {
    ctx.globalAlpha = 0.1;
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.drawImage(img, -300, -300, 600, 600);
    ctx.rotate(Math.PI / 6);
    ctx.translate(-width / 2, -height / 2);
    ctx.globalAlpha = 1;
  };
}

function exportPDF() {
  const table = document.getElementById("exportTable");

  html2canvas(table, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("l", "mm", "a4");

    const imgWidth = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    const ctx = canvas.getContext("2d");
    drawWatermark(ctx, canvas.width, canvas.height);

    pdf.addImage(canvas, "PNG", 0, 10, imgWidth, imgHeight);
    pdf.save("jadwal-sholat-al-ikhlas.pdf");
  });
}

function exportPNG() {
  html2canvas(exportTable, { scale: 2 }).then(canvas => {
    const ctx = canvas.getContext("2d");
    drawWatermark(ctx, canvas.width, canvas.height);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "jadwal-sholat.png";
    a.click();
  });
}

function exportJPG() {
  html2canvas(exportTable, { scale: 2 }).then(canvas => {
    const ctx = canvas.getContext("2d");
    drawWatermark(ctx, canvas.width, canvas.height);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.download = "jadwal-sholat.jpg";
    a.click();
  });
}

function exportExcel() {
  const wb = XLSX.utils.table_to_book(exportTable);
  XLSX.writeFile(wb,"jadwal-sholat.xlsx");
}

function exportWord() {
  const blob = new Blob([exportTable.outerHTML], {type:"application/msword"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jadwal-sholat.doc";
  a.click();
}