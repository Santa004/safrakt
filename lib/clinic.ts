export const clinic = {
  name: "Mantorps Smådjursklinik",
  legalName: "Mantorps Smådjursklinik AB",
  address: "Möllersbrunnsvägen 6",
  postal: "595 58 Mantorp",
  phone: "0142-66 19 80",
  phoneHref: "tel:0142661980",
  email: "kund@mantorpssmadjursklinik.se",
  hours: [
    { days: "Mån, tis, tor", time: "08:15–19:00" },
    { days: "Ons, fre", time: "08:15–14:30" },
  ],
  acuteNote:
    "Akut: ring, reception bedömer. Hänvisa vidare efter stängning / inneliggande.",
  /** Öppettider för slotgenerator (Europe/Stockholm) */
  schedule: {
    /** 0=sön … 6=lör — stängt helg */
    openDays: {
      1: { open: "08:15", close: "19:00" },
      2: { open: "08:15", close: "19:00" },
      3: { open: "08:15", close: "14:30" },
      4: { open: "08:15", close: "19:00" },
      5: { open: "08:15", close: "14:30" },
    } as Record<number, { open: string; close: string }>,
    lunch: { start: "12:00", end: "13:00" },
    slotMinutes: 20,
    timeZone: "Europe/Stockholm",
  },
} as const;
