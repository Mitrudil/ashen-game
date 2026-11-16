# ASHEN 0.4.6.8 — Odporność balansu na atrybuty i modyfikatory

## Co zmieniono
- Naprawiono identyfikator wersji w JS: APP_VERSION = 0.4.6.8 (w poprzedniej paczce błędnie pokazywano 0.4.6.4).
- Starcia → Laboratorium wyposażenia: nowy panel **Odporność balansu · atrybuty i modyfikatory**.
- 43 200 prób: 6 reprezentatywnych zestawów × 3 etapy × 2 pancerze (20/60) × 2 profile atrybutów × 4 pakiety modyfikatorów × 150 prób.
- Wykorzystano stałe bazowe współczynniki sześciu zestawów z 0.4.6.7.
- Profile: równe atrybuty oraz ukierunkowane na klasę, ze stałą SUMĄ punktów.
- Pakiety: brak, Niszczycielski+Berserkera, Zabójczy+Egzekutora, Szybki+Łowcy. Ten ostatni jest celowym testem zgodności i nie daje identycznych bonusów każdej klasie.
- Raport: zestawienie rozrzutu na pancerzu 20 oraz eksport szczegółów każdej kombinacji. Zapis lokalny.

## Ograniczenia
- Laboratorium używa **eksperymentalnych**, uproszczonych modyfikatorów z aktualnego modelu, nie pełnego katalogu właściwych przedmiotów.
- Raport liczy potencjalne obrażenia po pancerzu (przed obcięciem do PŻ przeciwnika); procent wygranych może być nieinformatywny przy łatwym przeciwniku.
- Brak zmian w grze właściwej, zapisach gracza i serwerowych Ekspedycjach. Nie wymaga SQL.
- Nie należy traktować 150 prób na wariant jako końcowej kalibracji — to test diagnostyczny.

## Instalacja
Podmień w GitHubie `index.html` oraz `js/game.js`. Nie nadpisuj całego repozytorium tą paczką (pozostałe pliki pozostają bez zmian).
