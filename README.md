# ASHEN — Kroniki Upadku · v0.4.9.9

Przeglądarkowa gra postapokaliptyczna: Starcia lokalne, PvP online, Ekspedycje, ekwipunek i sety X/Y/Z.

## Instalacja aktualizacji v0.4.9.9

Na GitHub podmień `index.html`, `js/game.js`, `README.md`, `CHANGELOG.md`. Nie wykonuj migracji SQL. Nie zmieniaj `js/public-config.js`.

## Zmiany

- Zmieniono **wyłącznie wyświetlane** nazwy prefiksów, tak aby pasowały rodzajem do nazw przedmiotów, np. „Legendarna Nomadyczna Koszulka termiczna” oraz „Legendarny Wartowniczy Płaszcz”.
- Ujednolicono nazwy pięciu setów akcesoriów z ich prefiksami: Techniczny, Spostrzegawczy, Przekonujący, Refleksyjny i Wszechstronny. To **nie** zmienia sufiksów typu „Tropiciela” ani wartości bonusów.
- Laboratorium ma próby wszystkich 15 Mistrzostw Z, dodano: Odporny (krytyk), Tropicielski (kolejny krytyk) i Wszechstronny (osłona).
- Zachowano istniejące ID rodzin, przedmiotów, zapisy, punktację setów i mechanikę walk.

## Testowanie

Zaliczono wcześniej 12/15 testów lokalnych; ostatnie trzy testy wymagają teraz sprawdzenia na Testerze w przeglądarce. To nie jest potwierdzenie PvP online.

Historię wersji znajdziesz w `CHANGELOG.md`. Archiwum `sql/` nie jest usuwane.


### v0.4.9.10
Poprawione porównanie zdolności „Odporny — Stłumienie krytyka” w Laboratorium Z: decyduje pierwsze trafienie krytyczne zamiast sumy PŻ utraconych do śmierci. Bez migracji SQL.
