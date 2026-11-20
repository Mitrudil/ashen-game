# ASHEN 0.6.0 — etap 11: oddzielenie pięciu jakości od starego zapisu

## Wdrożone w kodzie
- Moduł `js/ashen-060-quality.js` definiuje nowe jakości: Zwykły, Rzadki, Epicki, Legendarny, Mityczny.
- Oddzielne nazwy schematów `legacy-v05` i `ashen-v06` — indeks 4 ze starego zapisu NIE zmienia się automatycznie w Mityczny.
- Wprowadzono projektowe mnożniki bazowe 1 / 1.12 / 1.26 / 1.42 / 1.60 oraz cztery pule jakości sumujące się do 100%; w dotychczasowych lokalizacjach nie występuje Mityczny.
- `createNewDrop()` może wygenerować nowy przedmiot w schemacie 0.6 z gniazdami losowanymi podczas stworzenia. **Nie jest jeszcze podpięty do produkcyjnego generatora**.
- Nagrody nadal przyznawane przez obecną grę dostają teraz jawną etykietę `qualitySchema: legacy-v05`; nie zmienia to ich statystyk.
- `auditInventory()` oraz `migrationPreview()` umożliwiają przygotowanie migracji bez zapisu. Stary „Ulepszony” wymaga jawnej polityki. Nie konwertujemy go automatycznie na Mityczny.
- Testy wymuszają brak mutacji istniejącego ekwipunku i poprawność metryk.

## Dlaczego jeszcze nie aktywowano pięciu jakości we wszystkich łupach?
`js/game.js` w wielu miejscach traktuje `rarity` jako indeks starego schematu; serwer Supabase także przekazuje stare liczby. Podmiana indeksów bez wspólnej migracji zmieniłaby statystyki, nazwy, ceny i zachowanie PvP. Dlatego w tym etapie działa nowy moduł i tagowanie, a stary generator pozostaje aktywny.

## Następny krok (wdrożenie 0.6)
1. Ustalić politykę dla starych „Ulepszonych” (dla testów rekomendowany pełny reset przedmiotów, ale nie wykonujemy go automatycznie).
2. Uaktualnić jednocześnie mapowania klienta, ekonomię, zestawy i serwerowe funkcje nagród/walk.
3. Dopiero po testach zgodności uruchomić nowe pule jakości w rzeczywistych wyprawach.

## Testy
```sh
node tests/test-ashen-060-quality.cjs
node tests/test-ashen-060-loot.cjs
node tests/test-ashen-060-bonuses.cjs
node tests/test-ashen-060-equipment-preview.cjs
node tests/test-ashen-060-artifact-catalog.cjs
node --check js/game.js
```

**Brak nowego SQL. Nie ma automatycznej migracji ani zmiany PvP. Nie wymaga żadnych laboratoriów.**
