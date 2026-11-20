# ASHEN 0.6.0 — etap 8: integracja podglądu artefaktów z ekwipunkiem

**Działa w grze, bez nowego laboratorium.** W pełnym oknie posiadanego przedmiotu znajduje się rozwijana sekcja „ASHEN 0.6 — podgląd artefaktów”. Po wyborze jednego z 16 artefaktów wyświetla się jego efekt właściwy dla kategorii przedmiotu (broń, kurtka, spodnie, akcesoria itd.). Wartości oblicza rzeczywisty moduł `ashen-060-bonuses.js`, a nie osobna tabela HTML.

Zachowana jest dotychczasowa gra 0.5.4.1. **Niczego nie osadzamy ani nie nadajemy automatycznie gniazd starym przedmiotom.** Takie działanie bez odrębnej migracji złamałoby uzgodnioną zasadę „gniazda tylko w momencie zdobycia”. Moduł z etapu 7 pozostaje izolowany od produkcyjnego PvP i naliczania statystyk.

Dodano: `js/ashen-060-equipment-preview.js`, `data/ashen-060-katalog.js` (przeglądarkowa kopia katalogu), `tests/test-ashen-060-equipment-preview.cjs`; zmieniono `index.html` i `js/game.js`.

## Test

```bash
node tests/test-ashen-060-bonuses.cjs
node tests/test-ashen-060-equipment-preview.cjs
node --check js/game.js
```

Brak zmian SQL. Strona główna nadal ma numer 0.5.4.1, ponieważ nowy system 0.6 nie został jeszcze uruchomiony.

## Następny etap

Kontrolowana migracja starych jakości i artefaktów oraz generator nowych łupów z wylosowanymi gniazdami. Dopiero potem interaktywne osadzanie, realny wpływ na statystyki i synchronizacja Supabase.
