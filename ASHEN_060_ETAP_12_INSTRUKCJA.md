# ASHEN 0.6.0 — etap 12: klient rozpoznaje schemat pięciu jakości

## Zmiany wdrożone
- `js/ashen-060-quality-bridge.js` jednoznacznie rozpoznaje `legacy-v05` i `ashen-v06` i udostępnia nazwy, odmiany, kolory, mnożniki oraz ranking.
- `js/game.js` odczytuje jakość przez bridge. Pozwala prawidłowo wyświetlać *Mityczny*, a dawny `Ulepszony` nie jest przeklasyfikowany.
- Nazwy rzadkości w opisach przedmiotów, statystyki bazowe i sortowanie działają dla obu schematów.
- **Nie włączono jeszcze puli nowych jakości w produkcyjnych wyprawach.** Nowe jakości są dostępne w generatorze 0.6 (etap 11), ale serwerowe PvP nadal potrzebuje zgodnego odczytu. Brak automatycznej migracji.
- Nie zmieniono SQL, nie zmieniono zapisanych postaci i nie zmieniono zasady gniazd. Graficzne gniazda będą poprawiane w Warsztacie.

## Testy
`node tests/test-ashen-060-quality-bridge.cjs` oraz pozostałe istniejące testy `tests/test-ashen-060-*.cjs`.

## Ograniczenia
- Ekonomia, akcje Warsztatu i nagrody Supabase nadal korzystają z dawnych indeksów; dlatego aktywacja `ashen-v06` w prawdziwych łupach pozostaje zablokowana.
- Wartości mnożników nowej jakości są projektowe, niezweryfikowane jeszcze w serwerowym PvP.
