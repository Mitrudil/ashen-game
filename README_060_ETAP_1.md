# ASHEN 0.6.0 — etap 1: katalog i laboratorium balansu

Pakiet oparty na pełnej wersji gry **0.5.4.1**. Nie zmienia kodu produkcyjnego `index.html`, `js/game.js`, zapisu postaci ani serwerowego SQL PvP.

## Co już działa

- `tools/ashen-060-laboratorium.html` — samodzielna przeglądarkowa symulacja 24 istniejących modeli broni, od 1 do 12 ataków. Pokazuje przeciętne obrażenia i procent rund bez trafienia. Działa offline i na GitHub Pages.
- `docs/ASHEN_060_KATALOG_I_ZASADY.json` — wersjonowana, maszynowo czytelna baza obecnych 24 broni, 22 prefiksów i 20 sufiksów wraz z zatwierdzonym projektem pięciu jakości i szans gniazd.
- `docs/ASHEN_060_ETAP_1.md` — audyt aktualnego mechanizmu oraz lista zależności do migracji.

## Jak używać

Na GitHub Pages: `https://mitrudil.github.io/ashen-game/tools/ashen-060-laboratorium.html`

Wybierz broń, dodaj ataki z przyszłych prefiksów/zestawów/artefaktów i kliknij „Uruchom symulację”. Uwaga: to **model demonstracyjny**, nie produkcyjny silnik PvP. Celowo pokazuje również problem z nadmiernymi obrażeniami, jeśli dodamy ataki bez ich zbalansowania. Nie wykorzystuj tych wyników jako nowych statystyk broni.

## Dlaczego nie zmieniono jeszcze gry

Najpierw trzeba przebudować indeksy jakości `rarity`, ponieważ jakość `Ulepszony` zajmuje indeks 1. Trzeba też wspólnie zmienić klienta, format ekwipunku i serwerowy snapshot PvP, inaczej bonusy ataków nie będą zgodne między trybami. Stare SQL i obecne Mistrzostwa Z pozostają bez zmian do etapu migracji.

## Następny etap

1. Dopracowanie stałych bonusów wszystkich rodzin setów X/Y/Z, prefiksów i sufiksów pod 2–12 ataków.
2. Rozpisanie pełnych 16 artefaktów i efektów w każdym slocie.
3. Wdrożenie jakości, gniazd, artefaktów i pasujących zmian PvP w jednym testowanym pakiecie.
