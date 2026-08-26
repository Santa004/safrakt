# Mantorpskliniken — PRD (E1 memory)

## Vision
Cross-platform Expo/React Native app for Mantorps Smådjursklinik AB. Public clinic info (Hem, Tandvård, Tjänster, Priser, Mer) works offline. New "Djur" pillar mimics the Autodoc-style garage — the account has pets, each pet has its own file, log, next-due countdown and booking requests.

## Users
- **Djurägare (owner)** — Anna in Mantorp / Mjölby wants to see her dog Luna in the app and know the next vaccination is 10 månader bort. Bookings are still confirmed by phone.
- **Klinikpersonal (staff)** — sees the inbox of tidsförfrågningar, confirms, marks as done. Search all pets. Cannot see passwords.

## Non-goals (v1)
- Ingen online-kalender med lediga tider (bara request-flödet)
- Ingen push, ingen SMS, ingen chat, ingen kamera, ingen betalning, inget PDF-pass, ingen social login

## Stack
- **Frontend:** Expo SDK 52 · Expo Router 4 · React 18 · React Native 0.76 · AsyncStorage · @expo/vector-icons.  Web preview via `expo start --web --port 3000`.
- **Backend:** FastAPI · motor (async Mongo) · PyJWT · bcrypt · pydantic 2. Bearer JWT (168 h). No cookies.
- **DB:** MongoDB collections: users, pets, bookings, logs.

## Implemented (2026-08-26)
- Klinik-appen (5 offentliga skärmar, sticky Call, öppet/stängt-chip mot Europe/Stockholm)
- Assets: banner i splash, rundade logotyp som app-ikon
- Auth: register / login / /auth/me · JWT Bearer · bcrypt · seed två konton (anna/staff)
- Datamodell: User / Pet / Booking / LogEntry med UUID-ids
- 6:e tab "Djur" / "Mina djur"
- Garage: horisontella pet-kort, "Vaccination om 10 månader"-chip, "Tid önskad"-chip, streckad "+ Lägg till djur"
- Utloggat läge: varm empty state med Logga in / Skapa konto
- Add-pet wizard: 7 steg (art → namn → ras → födelsedatum → kön → chip/färg/anteckning → review + spara)
- Pet-profil: header, next-due-kort (svensk relativ tid — aldrig ISO), booking-kort, tidslinje (senaste först), disclaimer "Detta är din djurlogg i appen. Klinikens journal är separat."
- Boka från pet: reason-chips, datum, tid-på-dagen, meddelande, "Vi ringer och låser tiden" toast, akut = ring
- Logga besök: typ-chips, datum, anteckning, nästa gång (auto ~12 mån för vaccin/tand/rabies/hälsokoll)
- Staff-läge: Klinikläge card i Mer, /staff dashboard (stats), /staff/inbox (Bekräfta/Genomförd/Avvisa), /staff/djur (sök på namn/chip/ägare)
- När staff markerar bokning som "done" skapas automatiskt en riktig Vaccination-log + nextDueDate på pet
- All CRUD skapar samtidigt system-lograder ("Luna tillagd", "Tid önskad: Vaccination", "Besök genomfört: Vaccination")
- Uppdaterad Integritet-text som beskriver konto+djurdata

## Seed / testkonton
Se `/app/memory/test_credentials.md`.

## Nästa (backlog)
- Photo per pet (kräver expo-image-picker)
- Riktig `forgot-password`-flöde via e-post (SendGrid)
- Push-notiser inför nästa vaccination
- Delbara PDF-pass för djur
- Multi-owner för samma djur (familjekonto)
- Historikexport
