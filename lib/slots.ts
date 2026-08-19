import { clinic } from "@/lib/clinic";

function parseHm(hm: string) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function stockholmParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: clinic.schedule.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return parts;
}

function weekdayNumber(date: Date): number {
  // getDay in Stockholm
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: clinic.schedule.timeZone,
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[wd] ?? 0;
}

function atStockholmMinutes(year: number, month: number, day: number, minutes: number) {
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${hh}:${mm}:00`;
  // Interpret as Stockholm local via offset approximation using Date + format roundtrip
  const probe = new Date(`${iso}+01:00`);
  const parts = stockholmParts(probe);
  const localMin = parseHm(`${parts.hour}:${parts.minute}`);
  const delta = minutes - localMin;
  return new Date(probe.getTime() + delta * 60_000);
}

export function generateSlots(from: Date, dayCount: number, bookedStarts: string[]) {
  const booked = new Set(bookedStarts.map((s) => new Date(s).toISOString()));
  const slots: Date[] = [];
  const lunchStart = parseHm(clinic.schedule.lunch.start);
  const lunchEnd = parseHm(clinic.schedule.lunch.end);
  const step = clinic.schedule.slotMinutes;

  for (let d = 0; d < dayCount; d++) {
    const day = new Date(from.getTime() + d * 86_400_000);
    const parts = stockholmParts(day);
    const year = Number(parts.year);
    const month = Number(parts.month);
    const dayNum = Number(parts.day);
    const wd = weekdayNumber(day);
    const hours = clinic.schedule.openDays[wd];
    if (!hours) continue;

    const open = parseHm(hours.open);
    const close = parseHm(hours.close);

    for (let t = open; t + step <= close; t += step) {
      if (t >= lunchStart && t < lunchEnd) continue;
      const start = atStockholmMinutes(year, month, dayNum, t);
      if (start.getTime() <= Date.now()) continue;
      if (booked.has(start.toISOString())) continue;
      slots.push(start);
    }
  }

  return slots;
}

export function formatSlot(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: clinic.schedule.timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
