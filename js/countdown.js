function updateCountdown() {
  const now = new Date();
  let next = null;

  document.querySelectorAll(".card").forEach(card => {
    const [h,m] = card.dataset.time.split(":");
    const t = new Date();
    t.setHours(h,m,0,0);
    if (t > now && (!next || t < next.time)) {
      next = {name: card.querySelector("h3").textContent, time: t};
    }
  });

  if (!next) return;

  const diff = next.time - now;
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  document.getElementById("nextPrayer").textContent =
    `${next.name} (${m}m ${s}s)`;
}

setInterval(updateCountdown, 1000);
