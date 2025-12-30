function isRamadhan() {
  const now = new Date();
  const start = new Date("2026-02-18T00:00:00");
  const end   = new Date("2026-03-19T23:59:59");
  return now >= start && now <= end;
}