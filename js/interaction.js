// Keyboard shortcut khusus PC
document.addEventListener("keydown", e => {
  if (e.key === "f") {
    document.documentElement.requestFullscreen();
  }

  if (e.key === "Escape") {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
});
