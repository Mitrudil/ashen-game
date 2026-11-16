ASHEN v0.4.5 — Spójne zasady broni w walkach

Kolejność instalacji:
1. W Supabase SQL Editor uruchom sql/024_expedition_weapon_stat_parity.sql.
   Wymaga ukończonych migracji do 023 włącznie. Zrób kopię bazy przed zmianą.
2. Wgraj index.html i js/game.js do głównego katalogu gry na GitHubie.
3. Sprawdź napis v0.4.5 u góry ekranu.

Co poprawiono:
- Dotychczas Ekspedycje wyliczały celność z pola ogólnego h.acc i
  pomijały premię do obrażeń z atrybutów wynikającą z typu broni.
- Teraz dla bohaterów w Ekspedycjach naliczana jest ta sama premia
  atrybutów i ta sama celność typów broni co w Starciach/PvP.
- Zachowano bonusy frakcji, taktyki, liczbę graczy, pule nagród,
  krytyki, pancerz i dotychczasową logikę rozstrzygania walk.
- Historyczne raporty nie są przeliczane.

Uwaga: przy aktualizacji na żywym serwerze nie da się zagwarantować
identycznego RNG i wyników walk między silnikami JavaScript i PostgreSQL.
Wymagany test: porównaj statystyki bohatera w Starciach i raporcie
Ekspedycji dla tej samej broni, po ponownym opublikowaniu profilu.
