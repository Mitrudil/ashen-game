# ASHEN v0.4.8.3 — synchronizacja informacji o setach

Aktualizacja **po zainstalowaniu v0.4.8.2**.

## GitHub
Podmień `index.html`, `js/game.js`, `js/online.js`. Bez SQL. Odśwież Ctrl+F5.

## Zmiany
- Migawka postaci wysyłana online zawiera `setEngineVersion`, `setEffects`, `activeSets` (id, category, count, qualityPoints, level).
- Informacje o setach są wyliczane z **założonych** przedmiotów postaci, nie z katalogu ani planera.
- Poprawiony mylący opis Z w ekwipunku: mistrzostwo działa w lokalnych Starciach.
- W PvP online pojawia się jawna informacja, że serwer nie stosuje jeszcze efektów Z.

## Granica funkcjonalności
**To nie jest wdrożenie mistrzostwa Z do PvP ani Ekspedycji serwerowych.**
SQL nadal rozstrzyga walki własnym silnikiem. Zanim aktywujemy efekty X/Y/Z po stronie serwera, konieczna jest weryfikacja migawki (nie ufać dowolnym polom z klienta), migracja funkcji walki i testy regresji.
Nie wgrywaj starych skryptów SQL ponownie w losowej kolejności.

## Testy do wykonania w grze
1. Wyposażyć pełny set jakości otwierającej Z, sprawdzić jego opis w ekwipunku.
2. Lokalna walka: sprawdzić w raporcie zdarzenie „Mistrzostwo Z”.
3. Konto online: ponowić synchronizację postaci.
4. PvP online / Ekspedycja: sprawdzić poprawność działania dotychczasowego silnika, **bez oczekiwania Z**.

Wersja klienta 0.4.8.3.
