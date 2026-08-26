import { hours, hoursOrder } from './clinic';

// Convert current time in Europe/Stockholm to minutes and weekday
export function getStockholmNow(now = new Date()) {
  // Use Intl to get parts in Stockholm timezone
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    hour12: false,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const parts = fmt.formatToParts(now);
  const weekdayShort = parts.find(p => p.type === 'weekday')?.value || '';
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  // Map sv-SE weekday abbreviations → key
  const map = {
    'mån': 'monday', 'mån.': 'monday',
    'tis': 'tuesday', 'tis.': 'tuesday',
    'ons': 'wednesday', 'ons.': 'wednesday',
    'tor': 'thursday', 'tors': 'thursday', 'tor.': 'thursday', 'tors.': 'thursday',
    'fre': 'friday', 'fre.': 'friday',
    'lör': 'saturday', 'lör.': 'saturday',
    'sön': 'sunday', 'sön.': 'sunday',
  };
  const key = map[weekdayShort.toLowerCase().replace(/\s/g, '')] || null;
  return { dayKey: key, minutes: hour * 60 + minute };
}

export function isOpenNow(now = new Date()) {
  const { dayKey, minutes } = getStockholmNow(now);
  if (!dayKey) return { open: false, todayLabel: '', nextText: '' };
  const day = hours[dayKey];
  if (!day || day.open == null) {
    return {
      open: false,
      todayLabel: day?.label || '',
      nextText: findNextOpen(dayKey),
    };
  }
  if (minutes >= day.open && minutes < day.close) {
    return {
      open: true,
      todayLabel: day.label,
      closesAt: formatMinutes(day.close),
    };
  }
  return {
    open: false,
    todayLabel: day.label,
    nextText: minutes < day.open
      ? `Öppnar ${formatMinutes(day.open)}`
      : findNextOpen(dayKey),
  };
}

function findNextOpen(fromKey) {
  const idx = hoursOrder.indexOf(fromKey);
  for (let i = 1; i <= 7; i++) {
    const next = hoursOrder[(idx + i) % 7];
    const day = hours[next];
    if (day && day.open != null) {
      return `Öppnar ${day.label} ${formatMinutes(day.open)}`;
    }
  }
  return '';
}

export function formatMinutes(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDayHours(day) {
  if (!day || day.open == null) return 'Stängt';
  return `${formatMinutes(day.open)}–${formatMinutes(day.close)}`;
}
