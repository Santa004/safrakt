// All clinic data — offline first, typed constants. Nothing invented.

export const clinic = {
  appName: 'Mantorpskliniken',
  fullName: 'Mantorps Smådjursklinik',
  companyLegal: 'Mantorps Smådjursklinik AB',
  orgNr: '559199-3430',
  slogan: 'Personlig djursjukvård i mindre skala, med tandvård som spetskompetens.',
  address: {
    street: 'Möllersbrunnsvägen 6',
    zip: '595 58',
    city: 'Mantorp',
  },
  phoneDisplay: '0142-66 19 80',
  phoneTel: '0142661980',
  email: 'kund@mantorpssmadjursklinik.se',
  phoneHours: '09.00–14.00',
  googleRating: '4,8',
  founded: 'Juli 2019',
};

// Opening hours: [openMin, closeMin] i minuter från midnatt, null = stängt
// Mån=0 ... Sön=6 (i JS getDay: Sön=0 ... Lör=6, vi mappar)
export const hours = {
  monday: { label: 'Mån', open: 8 * 60 + 15, close: 19 * 60, evening: true },
  tuesday: { label: 'Tis', open: 8 * 60 + 15, close: 19 * 60, evening: true },
  wednesday: { label: 'Ons', open: 8 * 60 + 15, close: 14 * 60 + 30 },
  thursday: { label: 'Tor', open: 8 * 60 + 15, close: 19 * 60, evening: true },
  friday: { label: 'Fre', open: 8 * 60 + 15, close: 14 * 60 + 30 },
  saturday: { label: 'Lör', open: null, close: null },
  sunday: { label: 'Sön', open: null, close: null },
};

export const hoursOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export const dropIn = {
  day: 'Tisdagar',
  time: '15:00–18:00',
  maxAnimals: 3,
  notes: [
    'Vaccination på drop-in, max 3 djur — fler bokas per telefon.',
    'Pass med stämpling kan innebära längre väntetid.',
    'Stamtavla eller vaccinationskort går snabbare.',
    'Kaninvaccin och rabies bokas alltid per telefon.',
  ],
  pricesInline: 'Vaccination 545 kr · Rabies 720 kr',
};

export const emergency = {
  headline: 'Akut? Ring oss.',
  body:
    'Vi har dagslediga akuttider via vår akutlista — ring så bokar vi in dig snarast.',
  fee: 'Akutavgift 840 kr + 50 % på ingreppet.',
  afterHours:
    'Efter stängning eller vid behov av inneliggande vård hänvisar vi till djursjukhus i Linköping.',
};

export const rules = [
  { title: 'Ingen kontant­betalning', body: 'Vi tar endast kort.' },
  { title: 'Direktreglering försäkring', body: '145 kr — vi hanterar samtliga bolag.' },
  {
    title: 'Uteblivet besök',
    body:
      'Om avbokning inte sker senast 24 h innan: 550 kr, eller 1100 kr för kirurgi, tandvård, ultraljud eller annan konsult.',
  },
  { title: 'Akutavgift', body: '840 kr + 50 % på ingreppet vid akutbesök.' },
];

// ---------- TANDVÅRD ----------
export const dentalServices = [
  { name: 'Munsanering hund', price: '4 300–4 650 kr' },
  { name: 'Munsanering katt', price: '3 865–4 205 kr' },
  { name: 'Tillägg risknarkos', price: '580 kr' },
  { name: 'Tandextraktion hund (inkl. munsanering)', price: '8 600–20 000 kr' },
  { name: 'FORL katt — första tand', price: '7 100 kr' },
  { name: 'FORL katt — därefter per tand', price: '665 kr/tand' },
  { name: 'FORL katt — tillägg tandsten', price: '945 kr' },
  { name: 'Tandfraktur', price: '6 980–15 000 kr' },
  { name: 'Mjölktandextraktion', price: '3 745 kr + 475 kr/tand' },
  { name: 'Mjölktandsfraktur', price: '5 480 kr' },
  { name: 'Häst — tandvård', price: 'Ring för uppgift' },
];

// ---------- TJÄNSTER ----------
export const services = [
  {
    id: 'vaccination',
    title: 'Vaccination',
    body:
      'Årlig hälsokontroll ingår i vaccinationsbesöket. Drop-in tisdagar 15–18, max 3 djur. Kaninvaccin och rabies bokas alltid.',
    prices: ['Vaccination 545 kr', 'Rabies 720 kr'],
  },
  {
    id: 'halsokontroll',
    title: 'Hälsoundersökning / poliklinik',
    body: 'Undersökning och rådgivning kring hund, katt och kanin.',
    prices: ['985–1 430 kr'],
  },
  {
    id: 'kastration',
    title: 'Kastration',
    body: 'Prisexempel — slutpris efter individuell bedömning.',
    prices: [
      'Honkatt 2 090 kr · paket vacc + chip 2 770 kr',
      'Hankatt 1 350 kr · paket vacc + chip 2 030 kr',
      'Hanhund < 15 kg 5 090 kr · > 15 kg 5 650 kr · > 45 kg +1 200 kr',
      'Tik < 15 kg 8 300 kr · > 15 kg 8 800 kr · > 45 kg +1 200 kr',
      'Hankanin 2 200 kr',
    ],
  },
  {
    id: 'id',
    title: 'ID, pass & klor',
    body: null,
    prices: [
      'Chip 450 kr',
      'Pass 985 kr',
      'Kloklippning 165 kr (svår 395 kr)',
    ],
  },
  {
    id: 'rontgen',
    title: 'HD/ED-röntgen (SKK) & avelskoll',
    body: null,
    prices: ['HD/ED hund 1 940–2 460 kr', 'HD avelskoll katt 1 635 kr'],
  },
  {
    id: 'ultraljud',
    title: 'Ultraljud — specialist',
    body:
      'Utförs av Leg. Vet. Nadja Bengtsson Akkad. Bokas per telefon.',
    prices: ['3 875–4 425 kr'],
  },
  {
    id: 'rehab',
    title: 'Rehab',
    body: 'Marie Söderström. Läs mer på dynamicrehab.se.',
    prices: ['Nybesök 1 700 kr', 'Återbesök 1 400 kr'],
  },
  {
    id: 'akut',
    title: 'Akut',
    body:
      'Ring för akuttid — akutavgift 840 kr + 50 % på ingreppet. Efter stängning hänvisas till djursjukhus i Linköping.',
    prices: null,
  },
  {
    id: 'avlivning',
    title: 'Avlivning',
    body: null,
    prices: ['Katt 1 600 kr', 'Hund 2 100 kr'],
  },
];

// ---------- PRISER (alla, sökbara) ----------
export const priceGroups = [
  {
    id: 'tandvard',
    title: 'Tandvård',
    items: dentalServices,
  },
  {
    id: 'vaccid',
    title: 'Vaccination & ID',
    items: [
      { name: 'Vaccination', price: '545 kr' },
      { name: 'Rabies', price: '720 kr' },
      { name: 'Chip', price: '450 kr' },
      { name: 'Pass', price: '985 kr' },
      { name: 'Kullbesiktning + chip + vacc (valp/kattunge)', price: '975 kr/djur' },
      { name: 'Kullbesiktning – extra besök', price: '155 kr' },
      { name: 'Kullbesiktning + chip + vacc x2 (kattunge)', price: '1 210 kr/kattunge' },
    ],
  },
  {
    id: 'kastration',
    title: 'Kastration',
    items: [
      { name: 'Honkatt', price: '2 090 kr' },
      { name: 'Honkatt — paket vacc + chip', price: '2 770 kr' },
      { name: 'Hankatt', price: '1 350 kr' },
      { name: 'Hankatt — paket vacc + chip', price: '2 030 kr' },
      { name: 'Hanhund < 15 kg', price: '5 090 kr' },
      { name: 'Hanhund > 15 kg', price: '5 650 kr' },
      { name: 'Hanhund > 45 kg — tillägg', price: '+1 200 kr' },
      { name: 'Tik < 15 kg', price: '8 300 kr' },
      { name: 'Tik > 15 kg', price: '8 800 kr' },
      { name: 'Tik > 45 kg — tillägg', price: '+1 200 kr' },
      { name: 'Hankanin', price: '2 200 kr' },
    ],
  },
  {
    id: 'undersokning',
    title: 'Undersökning',
    items: [
      { name: 'Hälsoundersökning / poliklinik', price: '985–1 430 kr' },
      { name: 'Kloklippning', price: '165 kr' },
      { name: 'Kloklippning — svår', price: '395 kr' },
      { name: 'Recept', price: '165 kr' },
    ],
  },
  {
    id: 'bild',
    title: 'Bilddiagnostik',
    items: [
      { name: 'HD/ED-röntgen SKK hund', price: '1 940–2 460 kr' },
      { name: 'HD avelskoll katt', price: '1 635 kr' },
      { name: 'Ultraljud (specialist Nadja Bengtsson Akkad)', price: '3 875–4 425 kr' },
    ],
  },
  {
    id: 'rehab',
    title: 'Rehab',
    items: [
      { name: 'Rehab nybesök (Marie Söderström)', price: '1 700 kr' },
      { name: 'Rehab återbesök', price: '1 400 kr' },
    ],
  },
  {
    id: 'avlivning',
    title: 'Avlivning & kremering',
    items: [
      { name: 'Avlivning katt', price: '1 600 kr' },
      { name: 'Avlivning hund', price: '2 100 kr' },
      { name: 'Kremering hund < 20 kg', price: '1 175 kr' },
      { name: 'Kremering hund 20–40 kg', price: '1 765 kr' },
      { name: 'Kremering hund > 40 kg', price: '2 100 kr' },
      { name: 'Kremering katt', price: '980 kr' },
      { name: 'Omhändertagande av avlidet djur (kremering tillkommer)', price: '500 kr' },
      { name: 'Separat kremering', price: '3 480 kr' },
    ],
  },
  {
    id: 'ovrigt',
    title: 'Övrigt',
    items: [
      { name: 'Direktreglering försäkring', price: '145 kr' },
      { name: 'Uteblivet besök', price: '550 kr' },
      { name: 'Uteblivet besök — kirurgi/tandvård/ultraljud/konsult', price: '1 100 kr' },
      { name: 'Akutavgift', price: '840 kr + 50 % på ingreppet' },
    ],
  },
];

// ---------- TEAM ----------
export const team = {
  owners: [
    { name: 'Linda Billehag', role: 'Ägare · Leg. djursjukskötare' },
    { name: 'Linda Samuelsson Bäckgren', role: 'Ägare · Leg. djursjukskötare' },
  ],
  vets: [
    { name: 'Sarah Axén Gideskog', role: 'Chefsveterinär · kirurgi, akut, tandvård · hästtandvård · officiell veterinär' },
    { name: 'Lars Wistedt', role: 'Specialist smådjur · kirurgi & tandvård' },
    { name: 'Madde Nydahl', role: 'Veterinär' },
    { name: 'Sophia Lindemark', role: 'Veterinär' },
    { name: 'Pia Åström', role: 'Veterinär' },
    { name: 'Tobias Digreus', role: 'Veterinär' },
  ],
  nurses: [
    { name: 'Matilda Carlsson', role: 'Djursjukskötare' },
    { name: 'Emelie Westberg', role: 'Djursjukskötare' },
    { name: 'Susanne Ekström', role: 'Djursjukskötare' },
    { name: 'Maria Rosenquist', role: 'Djursjukskötare' },
    { name: 'Johanna Fors', role: 'Djursjukskötare' },
  ],
  others: [
    { name: 'Josefin Persson', role: 'Personal' },
    { name: 'Julia Arvidsson', role: 'Personal' },
    { name: 'Lisa Homann', role: 'Personal' },
    { name: 'Stina Mortensen', role: 'Personal' },
    { name: 'Pia Lantz', role: 'Personal' },
  ],
  consultants: [
    { name: 'Nadja Bengtsson Akkad', role: 'Leg. Vet. · Ultraljudsspecialist (konsult)' },
    { name: 'Marie Söderström', role: 'Rehab (konsult) · dynamicrehab.se' },
  ],
};

export const aboutText =
  'Mantorps Smådjursklinik startade i juli 2019 av Linda Billehag och Linda Samuelsson Bäckgren — båda legitimerade djursjukskötare. Tanken var enkel: djurägare i Mantorp, Mjölby och trakten skulle slippa köra till Linköping för kvalificerad vård i mindre skala. Vi är privatägda, personliga och har byggt vår spetskompetens kring tandvård. Flera av våra veterinärer har vidareutbildning inom smådjurstandvård, och vi tar även emot häst — då endast för tandvård.';

export const locationText = {
  parking: 'Parkering utanför mottagningen.',
  from_mjolby: '~7 min från Mjölby',
  from_linkoping: '~25 min från Linköping',
  near: 'Nära Mantorps travbana',
};

export const privacyText =
  'Vi lagrar ditt konto (namn, telefon, e-post) och de djur du lägger in för att kunna visa din djurfil, komma ihåg nästa vaccination och skicka dina tidsförfrågningar till kliniken. Ingen tredjepartsspårning används. Vill du att vi raderar ditt konto och dina djur — kontakta kliniken. Personuppgiftsansvarig: Mantorps Smådjursklinik AB, org.nr 559199-3430.';
