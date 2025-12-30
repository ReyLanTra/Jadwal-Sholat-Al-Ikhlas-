function notify(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "assets/logo.png",
      vibrate: [200,100,200]
    });
  }
}

function requestNotifPermission() {
  if (!("Notification" in window)) {
    alert("Browser ini tidak mendukung notifikasi desktop.");
  } 
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Izin diberikan!");
        new Notification("Terima kasih!", {
          body: "Notifikasi berhasil diaktifkan.",
          icon: "../assets/logo.png"
        });
      }
    });
  }
}

requestNotifPermission();
