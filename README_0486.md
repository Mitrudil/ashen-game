# ASHEN v0.4.8.6 — czytelne raporty PvP i kontrola X/Y

Aktualizacja v0.4.8.5 -> v0.4.8.6.

## Zmiany
- Raport PvP online formatuje PŻ, pancerz i atrybuty jako liczby całkowite oraz unik i celność do maksymalnie 1 miejsca po przecinku (przecinek dziesiętny).
- Brak nieestetycznych artefaktów float, takich jak 9.600000000000001.
- Nie dopisujemy znaku % do uniku i celności: są to statystyki używane we wzorze na szansę trafienia, a nie bezpośrednie procenty.
- Wersja w nagłówku/stopce i parametry cache HTML: v0.4.8.6.
- Bez zmian w walce, RNG, balansie, SQL, kontach i zapisach.

## Ograniczenia audytu X/Y
- Migracja SQL 025 zawiera naliczanie części pasywnych premii X/Y w PvP, ale ich danych nie weryfikuje serwerowo na podstawie ekwipunku.
- Potwierdzenie balansu wymaga kontrolowanych walk na dwóch kontach. Nie da się go wywnioskować wyłącznie z wartości w raporcie.
- Z pozostaje niewdrożone w PvP online.

## Instalacja
Wgraj na GitHub index.html, js/game.js i js/online.js. Bez SQL. Odśwież Ctrl+F5.
Przed kolejnymi zmianami wykonaj test PvP w dwóch wariantach: bez setów i z aktywnymi setami X/Y, kontrolując status synchronizacji.
