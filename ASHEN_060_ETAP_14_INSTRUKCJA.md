# ASHEN 0.6.0 — etap 14: nowy generator nagrod, bezpiecznie odgrodzony

## Zrealizowano
- Nowa droga `modernRollItem` jest **podlaczona do faktycznej funkcji `rollItem`** w `js/game.js`.
- Oddzielone pule 0.6 dla ruin/szpitala/posterunku, premia Szczescia nie wykracza poza najrzadsza jakosc danej lokacji.
- Nowy przedmiot otrzymuje `qualitySchema: ashen-v06`, poprawna `quality`, indeks `rarity` i jednorazowo losowane `socketCapacity`.
- Stary generator i zapisy sa nietkniete. Stary „Ulepszony” NIE staje sie „Mitycznym”.
- `ashen-build.js` pokazuje etap 14 w naglowku i ma flage `modernDropsEnabled:false`.
- Testy automatyczne wykrywaja bledy sumowania wag i powtornego losowania gniazd.

## Dlaczego nowe jakosci nie sa jeszcze losowane na zywo
**Flaga jest celowo wylaczona.** Serwerowe PvP, nagrody klanowe i wspolne przeliczanie statystyk nie maja jeszcze potwierdzonej obslugi `ashen-v06`. Wlaczenie nowych przedmiotow tylko w przegladarce groziloby roznymi statystykami w walce i ekwipunku. Nie zmieniaj recznie flagi przed aktualizacja oraz testem serwera.

## Instalacja
Wgraj zawartosc paczki `AKTUALIZACJA_GITHUB.zip` do glownego katalogu repozytorium. W naglowku ma byc „przebudowa 0.6.0 · etap 14”. Niczego nie wykonuj w Supabase.

## Dalszy krok
Zweryfikowac produkcyjny schemat serwera i dodac obsluge nowego modelu do serwerowego przeliczania przedmiotow, po czym dopiero uaktywnic flage, przygotowac testy wypraw i PvP.
