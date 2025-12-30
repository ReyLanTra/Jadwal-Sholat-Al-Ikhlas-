window.DEVICE = {
  mobile: /Android|iPhone/i.test(navigator.userAgent),
  tablet: /iPad|Tablet/i.test(navigator.userAgent),
  desktop: !/Android|iPhone|iPad|Tablet/i.test(navigator.userAgent)
};

// contoh penggunaan
if (DEVICE.desktop) {
  console.log("Mode PC aktif");
}