# ASHEN 0.6.0 — etap 13: widoczne wydanie i przygotowanie ekonomii

## Co zrobiono
- Naglowek i stopka podaja **v0.5.4.1 · przebudowa 0.6.0 · etap 13**.
- `js/ashen-build.js` przechowuje numer wersji gry, etapu i identyfikator wydania. JS odczytuje go przy uruchomieniu.
- `index.html` ma odswiezone parametry `?v=060-e13` dla lokalnych plikow JS i CSS, aby uniknac wykorzystania starszych z cache.
- Wprowadzono bezpieczne wyliczanie mnoznikow sprzedazy i odzysku surowcow dla **starego** i **nowego** schematu jakosci. Stare wartosci identyczne z poprzednimi.
- Nowe wartosci ekonomii sa propozycja, poniewaz generator produkcyjny wciaz pozostaje na starym schemacie; nie zmieniono samych zasad dropu ani serwerowego PvP.

## Publikacja
Wgraj zawartosc archiwum aktualizacji do katalogu glownego repo GitHub (z zachowaniem podfolderow). Sprawdz napis **etap 13** w naglowku. Jesli nie widzisz etapu 13, aktualizacja nie zostala jeszcze pobrana albo przegladarka pokazuje starszy index.html. Wtedy odswiez strone Ctrl+F5.

## Testy
`node tests/test-ashen-060-economy.cjs`, pozostale `test-ashen-060-*.cjs`; `node --check js/game.js`.

## Nie wykonano
Nie ma nowego SQL, migracji zapisow, uruchomienia Mitycznych dropow, zmian PvP ani zmiany numeru oficjalnej gry. Nie bylo pelnego testu interfejsu w przegladarce.
