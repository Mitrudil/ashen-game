# ASHEN 0.6.0 — etap 7: moduł naliczania bonusów (pierwsza implementacja)

**Status:** wdrożony do plików projektu jako *izolowany moduł*, ale **jeszcze nieaktywny w produkcyjnej walce, ekwipunku ani SQL**. Główna gra nadal v0.5.4.1. Brak zmian Supabase.

## Nowe pliki
- `js/ashen-060-bonuses.js`: czysty moduł naliczania, nie mutuje obiektów. Można załadować w przeglądarce lub `require(...)` w Node.
- `data/ashen-060-katalog.json`: 15 zestawów X/Y/Z i 16 artefaktów (128 efektów kategorii) z poprzednich etapów.
- `tests/test-ashen-060-bonuses.cjs`: 14 automatycznych testów logiki.

## Co działa w module
- Weryfikacja pięciu jakości, odrzucenie starej jakości Ulepszony.
- Rozkład szans 0–3 gniazd zależnie od jakości i losowanie **tylko przy tworzeniu nowego łupu**. Funkcja nie ma opcji dodawania/przelosowania gniazd.
- Walidacja gniazd i zakaz dwóch artefaktów tej samej rodziny w jednym przedmiocie.
- Przypisanie bonusów osadzonego artefaktu na podstawie rzeczywistej kategorii slotu.
- Zliczenie rezonansu po trzech osadzonych artefaktach jednej rodziny — bez ponownego mnożenia bonusu.
- Zestawy akcesoriów wyłącznie 3/3, odzież od trzech elementów.
- Rozdzielone modyfikatory i wartości łączone według źródła/operacji, bez zmian poziomowych bazowej liczby ataków.

## Celowo nie włączono jeszcze
- Aktywacji poziomów X/Y z progów średniej jakości — te progi muszą być zgodne z silnikiem i zatwierdzone; obecnie `activeSets` otrzymuje jawnie wyliczone poziomy.
- Liczbowego bonusu rezonansu i obsługi efektów reaktywnych Z — katalog zawiera nazwę/rodzinę, nie pełny uzgodniony kontrakt bojowy. Moduł zwraca sygnały do dalszej obsługi.
- Nowej formuły DPS, krytyków i pancerza — najpierw regresja z realnym SQL 034.
- Migracji starych artefaktów, generatora łupów, UI warsztatu, integracji PvP.

## Test lokalny
```sh
node tests/test-ashen-060-bonuses.cjs
```
Spodziewane: `14/14 testów OK`.

## Następny etap
Podłączenie wspólnego modułu w kontrolowany sposób do ekwipunku i porównywarki, a następnie do generatora łupów, wraz z migracją istniejących testowych przedmiotów. Integracja serwerowego PvP wymaga osobnej migracji SQL i testów regresyjnych 15 Mistrzostw Z.
