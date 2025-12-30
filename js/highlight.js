function highlightActive() {
  const now = new Date();

  document.querySelectorAll(".card").forEach(card => {
    const [h,m] = card.dataset.time.split(":");
    if (now.getHours() === +h && now.getMinutes() === +m) {
      card.classList.add("active");
    }
  });
}

setInterval(highlightActive, 1000);
