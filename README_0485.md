# ASHEN v0.4.8.5 — PvP X/Y (pierwszy etap)

## Zakres
- Wprowadza osobną migrację `sql/025_online_pvp_xy_passive.sql` dla serwerowego PvP.
- Obsługuje pasywne, wcześniej nieużywane w PvP efekty: startShield, earlyAccuracy, afterMissAccuracy, afterDodgeAccuracy, critChance, damagePct, afterMissDamage, critDamagePct, armorPen, critResist, physicalResist, lateResist, afterCritResist.
- Nie nalicza ponownie HP, armor, acc, dodge i atrybutów, ponieważ te wartości już znajdują się w migawce profilu.
- Mistrzostwo Z oraz pozostałe mechaniki wymagające obsługi zdarzeń walki NIE zostały wdrożone. Ekspedycje bez zmian.
- Zmiana wersji widocznej w nagłówku na 0.4.8.5.

## Kolejność
1. Wykonaj kopię zapasową schematu bazy / zachowaj obecną definicję funkcji `ashen_online_attack`.
2. Podmień na GitHubie `index.html`, `js/game.js`, `js/online.js`.
3. W Supabase SQL Editor wykonaj **jednorazowo** `sql/025_online_pvp_xy_passive.sql`.
4. Odśwież stronę Ctrl+F5, ponownie zsynchronizuj profil, przetestuj na dwóch kontach.

## Uwagi bezpieczeństwa
Profile bojowe nadal są przesyłane przez klienta. Ograniczenie wartości bonusów chroni balans przed skrajnymi liczbami, ale nie stanowi pełnej weryfikacji posiadanego ekwipunku. Nie traktować tego jako gotowego zabezpieczenia przeciw oszustwom.

## Testy
Sprawdzona składnia JS i integralność ZIP. SQL nie został uruchomiony na serwerze użytkownika. Brak pełnych testów przeglądarkowych.
