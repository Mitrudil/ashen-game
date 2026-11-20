# ASHEN 0.6.0 — etap 18: niezależna kontrola statystyk całej postaci

## Zmiany
- `js/ashen-060-character-reference.js`: nowy czysty kalkulator atrybutów, PŻ, pancerza, uniku, celności i kolejności ataków; wejściem są już obliczone statystyki założonych przedmiotów i aktywne efekty zestawowe starego silnika.
- `js/game.js`: konsolowe, **wyłącznie odczytowe** `window.ashen060CheckCharacter()` porównuje wynik nowego kalkulatora z realnym `attrs()`, `heroDefense()` i `heroAttacks()`; nie zmienia stanu postaci ani zapisów.
- `tests/test-ashen-060-character-parity.cjs`: 336 scenariuszy 24 broni, 5 rzadkości, 2 schematów jakości oraz zestawów/obrony i dwóch rąk.
- Korekta historycznego testu SQL041: zamiast oczekiwać dokładnie etapu 17, kontroluje numer co najmniej 17 i aktualny cache wydania.
- Wyświetlany etap **18**, wersja główna nadal 0.5.4.1, cache `060-e18`.

## Ograniczenia
- Kalkulator używa gotowych bonusów z **dotychczasowego** `setEngineEffects()` oraz `resonanceBonuses()`; nie jest jeszcze całkowicie niezależnym silnikiem X/Y/Z i nie uwzględnia aktywnych osadzonych artefaktów 0.6.
- Nie odtwarza na serwerze złożonego ekwipunku, nie jest zamiennikiem SQL034. SQL042 nadal kandydat bez testów na PostgreSQL.
- `Szybki` nadal dodaje **osłabiony** dodatkowy atak, według starej gry. Nowe pełne ataki wymagają osobnego wdrożenia i balansu.
- Przełącznik jakości 0.6 i nowe łupy wciąż wyłączone. Brak zmian bazy Supabase.

## Testowanie
`node tests/test-ashen-060-character-parity.cjs`

Opcjonalnie po wgraniu na GitHub otwórz konsolę F12 i wpisz `ashen060CheckCharacter()` — `ok: true` oznacza zgodność nowego odczytu z bieżącą postacią. Nie jest to wymagane do grania.

**Nie uruchamiaj SQL042 w produkcyjnym Supabase.**
