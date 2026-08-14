# Decisions

## Design decisions
- Mobil-first, premium lokal klinik, tandvård som spets.
- Djurägare ser: djur, bokningar, vaccinationer, hemgångsråd, kvitton — inte full journal.

## Technical decisions
- En kodbas: publik webb + inloggad app (PWA). Ingen native iOS/Android i fas 1.
- Samma datamodell som senare kan bära journal: owner → pet → appointment → clinical_visit (tom i fas 1).
- BankID inte i MVP (e-postmagic link + lösenord). Förbered user-tabell för BankID senare.

## Client-specific decisions
- Fas 1: kundapp. Fas 2: personal-kalender. Fas 3: journal endast efter uttryckligt beslut.
