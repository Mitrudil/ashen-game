# ASHEN 0.6.0 — etap 9: naprawa wszystkich zerowych premii artefaktów

**Zmiana w rzeczywistym podglądzie przedmiotów**, bez nowych laboratoriów i bez zmian produkcyjnego silnika walki.

Zidentyfikowano 17 zerowych efektów w 128 kombinacjach artefakt–kategoria wyposażenia. Wszystkie 17 zastąpiono użytecznymi premiami odpowiednimi do kategorii przedmiotu. Przykład: **Żyła Żelaza w nakryciu głowy → +1 pancerza** (zamiast `0 Wytrzymałości`).

Zmiany ujednolicono w: `data/ashen-060-katalog.json`, `data/ashen-060-katalog.js`, `docs/ASHEN_060_ETAP_4_PROJEKT.json`, `docs/ASHEN_060_ETAP_5_KATALOG.json`, `docs/ASHEN_060_ETAP_4_ARTEFAKTY.csv`.

Dodano `tests/test-ashen-060-artifact-catalog.cjs`, który blokuje powrót zerowych premii i weryfikuje wszystkie 128 kombinacji w module oraz w 11 slotach gry, również w przeglądarkowej kopii katalogu.

Uruchom testy:

```bash
node tests/test-ashen-060-artifact-catalog.cjs
node tests/test-ashen-060-bonuses.cjs
node tests/test-ashen-060-equipment-preview.cjs
node --check js/game.js
```

**Nie wykonuj SQL.** Główna gra nadal 0.5.4.1. Efekty artefaktów nadal są podglądem; nie działają jeszcze w walce i nie zmieniają zapisanych przedmiotów. Na tym etapie nie wdrażano migracji jakości ani generowania gniazd w produkcyjnych dropach.
