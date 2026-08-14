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
} as const;
