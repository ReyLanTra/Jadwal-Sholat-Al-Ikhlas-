function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent =
    now.toLocaleTimeString("id-ID");

  document.getElementById("date").textContent =
    now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}

setInterval(updateClock, 1000);
updateClock();
