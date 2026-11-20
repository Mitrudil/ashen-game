# ASHEN 0.6.0 — etap 17: kontrakt parametrów broni (bez wdrożenia SQL)

## Dostarczono
- Automatyczny ekstraktor katalogu z `js/game.js`: `tools/extract-060-combat-catalog.cjs`.
- Wersjonowany plik danych `data/ashen-060-combat-contract.json`: **24 bronie, 15 afiksów broni, 27 afiksów ubioru i akcesoriów**.
- Referencyjny kalkulator pojedynczej broni `tools/ashen-060-combat-reference.cjs`, zgodny z aktualną formułą `statsOf` dla broni: parametry bazowe, jakość, procent obrażeń, upgrade, celność, krytyk, przebicie i premia liczby ataków.
- Kandydat czystej funkcji PostgreSQL `sql/042_KANDYDAT_PARAMETRY_BRONI_NIE_WDRAZAC.sql`, korzystający z zamrożonego katalogu. Nie dotyka obecnych RPC ani tabel i **nie należy go uruchamiać w produkcji**.
- Testy `tests/test-ashen-060-weapon-parity.cjs`: rzeczywiste dane porównane z obecnym źródłem gry i scenariusze kombinacji.
- W nagłówku gry: **Przebudowa 0.6.0 · etap 17**; cache bust 060-e17.

## Ograniczenia
- **Brak testu wykonywalnego SQL na PostgreSQL / Supabase**. Przechodzą testy JS i kontrola struktury kandydata SQL, nie możemy jeszcze twierdzić, że klient i serwer przeliczają identycznie.
- To rekonstrukcja **statystyk jednej broni**, nie pełnego zestawu postaci. Nie ma tu bonusów X/Y/Z, rezonansów, Mistrzostw Z, obliczeń celności z atrybutów bohatera, obrażeń po pancerzu ani rzeczywistej sekwencji dodatkowych ciosów.
- Bonus `weapon_quick` w bieżącym silniku nadal ma **osłabiony dodatkowy cios**; zmiany sposobu ataku dopiero po testach pełnej walki.
- Różnice dawnych 5 jakości i nowych 5 jakości są jawne. Stare przedmioty nie są migrowane. Nowe łupy i PvP 0.6 nadal zablokowane.
- Pełna zgodność będzie wymagać testów SQL na osobnej bazie, potem wyposażenia, bonusów postaci i PvP.

## Test
`node tests/test-ashen-060-weapon-parity.cjs`

Pozostałe testy etapu 16 nadal powinny przechodzić. **Nie uruchamiaj SQL042 na produkcji**.
