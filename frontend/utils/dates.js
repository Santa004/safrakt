// Swedish relative-time helpers. All calculations in whole days.
export function daysBetween(fromISO, toISO) {
  const a = toDate(fromISO);
  const b = toDate(toISO);
  const MS = 24 * 60 * 60 * 1000;
  return Math.round((b - a) / MS);
}

export function toDate(iso) {
  if (!iso) return null;
  const s = iso.length === 10 ? `${iso}T00:00:00` : iso.replace('Z', '');
  return new Date(s);
}

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Returns { text, overdue }
export function relativeSwedish(targetISO, prefix = 'om') {
  if (!targetISO) return null;
  const t = toDate(targetISO);
  const now = today();
  const days = Math.round((t - now) / (24 * 60 * 60 * 1000));
  if (days === 0) return { text: 'i dag', overdue: false };
  if (days === 1) return { text: 'i morgon', overdue: false };
  if (days === -1) return { text: 'i går', overdue: true };
  if (days > 0) {
    return { text: `${prefix} ${formatSpan(days)}`, overdue: false };
  }
  return { text: `förfallen för ${formatSpan(-days)} sedan`, overdue: true };
}

function formatSpan(days) {
  if (days < 14) return `${days} dagar`;
  if (days < 60) return `${Math.round(days / 7)} veckor`;
  const months = Math.round(days / 30);
  if (months < 24) return `${months} ${months === 1 ? 'månad' : 'månader'}`;
  const years = Math.round(months / 12);
  return `${years} år`;
}

export function petAge(birthISO) {
  if (!birthISO) return '';
  const b = toDate(birthISO);
  const now = today();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months--;
  if (months < 1) return 'nyfödd';
  if (months < 12) return `${months} mån`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${years} år` : `${years} år ${rem} mån`;
}

export function formatDateSv(iso) {
  if (!iso) return '';
  const d = toDate(iso);
  if (!d || isNaN(d)) return iso;
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
