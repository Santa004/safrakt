# Mantorpskliniken — PRD (E1 memory)

## Vision
Cross-platform Expo/React Native app for Mantorps Smådjursklinik AB. Public clinic info (Hem, Tandvård, Tjänster, Priser, Mer) works offline. New "Djur"-pillar mimics the Autodoc-style garage — the account has pets (with photos), each pet has its own file, log, next-due countdown, family sharing, push reminders, and booking requests.

## Users
- **Djurägare (owner)** — Anna in Mantorp / Mjölby wants to see her dog Luna in the app, get a push 4 weeks before the next vaccination, share Luna with sambon Bertil.
- **Klinikpersonal (staff)** — sees inbox of tidsförfrågningar, confirms, marks as done. Search all pets.

## Non-goals (v1)
- Ingen online-kalender med lediga tider (bara request-flödet)
- Ingen chat, ingen kamera-scan av chip, inga betalningar

## Stack
- **Frontend:** Expo SDK 52 · Expo Router 4 · React 18 · RN 0.76 · AsyncStorage · expo-image-picker · expo-image-manipulator · expo-notifications · expo-device · @expo/vector-icons.
- **Backend:** FastAPI · motor · PyJWT · bcrypt · httpx (Expo push). Bearer JWT (168h).
- **DB:** MongoDB (users, pets, bookings, logs, reset_tokens).

## Implemented
### 2026-08-26 (v1 MVP)
- 5 offentliga skärmar (Hem, Tandvård, Tjänster, Priser, Mer)
- Sticky Call, öppet/stängt-chip mot Europe/Stockholm
- Splash med banner, ikon med rundad logotyp

### 2026-08-26 (v2 Auth + Djur)
- Register/login/me (Bearer JWT · bcrypt)
- Seed anna@test.se + staff@mantorpssmadjursklinik.se
- 6:e tab **Djur / Mina djur**
- Garage-lista med chips ("Vaccination om 10 månader")
- 7-stegs Lägg till djur-wizard
- Pet-profil med next-due, tidslinje, disclaimer
- Boka från pet, Logga besök med auto-nästa
- Staff-läge: Klinikläge dashboard, Inbox, Djur-sök

### 2026-08-26 (v3 Family + Photo + Push + Reset)
- **Familjekonto**: Pet.sharedWith[{userId, role: coowner|viewer}], POST/DELETE /pets/:id/share. Co-owners kan skriva (boka + logga). Viewers ser bara. UI: /djur/:id/dela med Bjud in-form + lista över delade.
- **Djurbilder**: expo-image-picker + expo-image-manipulator (resize 400x400, JPEG q0.7). Web-fallback via `<input type=file>` + canvas. Base64 data-URI lagrat i Mongo. Foto på pet-kort + i profil-header med kamera-badge.
- **Push-notiser**: expo-notifications registrerar Expo Push Token vid login. Backend asyncio-scheduler kör dagligen `send_reminders_once()` som pushar 28 dagar innan varje `nextDueDate` (både till ägare och delade coowners/viewers). Manuell trigger `POST /api/reminders/run` (staff). Web = no-op, native = fungerar.
- **Lösenordsåterställning**: POST /auth/forgot-password (MOCKED — skriver reset-URL till backend-loggen; kräver SendGrid-nyckel för riktig e-post). POST /auth/reset-password. `reset_tokens` collection med TTL 1h. Frontend `/auth/glomt` med två-stegs flöde (begär link → klistra in token → nytt lösenord).

## Testkonton
Se `/app/memory/test_credentials.md`.

## Backlog
- **SendGrid-integration** för riktig e-post-återställning (kräver API-nyckel + verifierad avsändare)
- Djur-foto som kan zoomas
- Delning via QR-kod istället för e-post
- Automatisk radering av push-tokens som Expo returnerar som DeviceNotRegistered
- Historik-export som PDF
- Sammanslagning av dubblettdjur mellan två familjekonton
