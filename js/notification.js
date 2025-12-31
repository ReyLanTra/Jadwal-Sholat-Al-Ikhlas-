document.addEventListener("DOMContentLoaded", () => {
  if (!("Notification" in window)) return;

  const status = Notification.permission;
  const asked = localStorage.getItem("notifAsked");

  // tampilkan prompt hanya jika belum ditanya
  if (status === "default" && !asked) {
    document.getElementById("notifPrompt").classList.remove("hidden");
  }
});

function requestNotif() {
  Notification.requestPermission().then(permission => {
    localStorage.setItem("notifAsked", "yes");

    document.getElementById("notifPrompt").classList.add("hidden");

    if (permission === "granted") {
      alert("Notifikasi adzan & Ramadhan diaktifkan");
    } else {
      alert("Notifikasi ditolak. Bisa diaktifkan lewat pengaturan browser.");
    }
  });
}
