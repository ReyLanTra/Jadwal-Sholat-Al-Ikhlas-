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
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

requestNotifPermission();
