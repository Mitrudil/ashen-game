# ASHEN v0.2.9.1 — poprawki raportów ekspedycji

- Kolory zdarzeń na podstawie faktycznego składu bohaterów i wrogów w zapisanym raporcie.
- Wszyscy bohaterowie na zielono, przeciwnicy na czerwono; nieznany nadawca pozostaje neutralny.
- Nagłówki rund wyraźnie pokazują: Drużyna zadała / Otrzymała.
- Zmiana wyłącznie wyświetlania — bez zmian w SQL, balansie, danych postaci czy zapisanych walkach.

# ASHEN v0.2.9 — Ekspedycje klanowe i pierwsi bossowie

Ta wersja rozwija system klanów i dodaje pierwszy działający fundament pod **wspólne walki z bossami online**.

## Co doszło

### Nowa zakładka: **☠ Ekspedycje**
- osobna karta w menu gry,
- lista **3 pierwszych bossów**,
- aktywna wyprawa klanu widoczna dla wszystkich członków,
- historia ostatnich raportów wypraw.

### System wypraw klanowych
- **lider lub oficer** może utworzyć wyprawę na wybranego bossa,
- pozostali członkowie klanu mogą **dołączać** i **opuszczać** skład,
- skład: **2–5 graczy**,
- jedna aktywna wyprawa na klan,
- walka jest rozliczana przez **RPC po stronie serwera**,
- raport zapisuje się dla całego klanu.

### Pierwsi bossowie
1. **Rzeźnik ze Złomowiska** — pierwszy prosty test grupy,
2. **Kanałowy Pożeracz** — mocniejszy pojedynczy mutant,
3. **Trzej Bracia Rdzy** — grupa elitarnych przeciwników.

## Ważne ograniczenia tej wersji
- to jeszcze **nie jest pełny endgame**,
- boss nr 3 to dalej etap testowy, nie finał gry,
- **brak nagród, łupów i ekonomii bossów**,
- brak jeszcze pełnej kampanii 15–20 bossów,
- brak rajdów klanowych / wieloetapowych lokacji.

Czyli: to jest **gotowy fundament systemu**, na którym można dalej budować właściwą zawartość.

## Wymagany SQL
Uruchom w projekcie **ASHEN**:
- najpierw wcześniejsze pliki, jeśli nie były uruchomione:
  - `002_cloud_saves.sql`
  - `003_online_pvp.sql`
  - `005_clans.sql`
- następnie nowy plik:
  - `multiplayer/supabase/006_clan_expeditions.sql`

## Dokument uruchomienia
Szczegóły: `multiplayer/URUCHOMIENIE_0.2.9.md`

## Bez zmian
Nie ruszałem:
- lokalnego PvE,
- lokalnego PvP testowego,
- systemu ekwipunku,
- ALLADYN.
