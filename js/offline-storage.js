function getStorageKey(year, month) {
  return `jadwal-${year}-${month}`;
}

function saveMonthlyToStorage(year, month, data) {
  localStorage.setItem(
    getStorageKey(year, month),
    JSON.stringify({
      savedAt: Date.now(),
      data
    })
  );
}

function loadMonthlyFromStorage(year, month) {
  const raw = localStorage.getItem(getStorageKey(year, month));
  if (!raw) return null;

  try {
    return JSON.parse(raw).data;
  } catch {
    return null;
  }
}

window.addEventListener("offline", () => {
  document.getElementById("offlineBadge").classList.remove("hidden");
});

window.addEventListener("online", () => {
  document.getElementById("offlineBadge").classList.add("hidden");
});
