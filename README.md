# ASHEN v0.4.8.0 — Ewolucja setów X/Y (Starcia lokalne)

## Aktualizacja GitHub
Podmień `index.html` i `js/game.js`. Nie potrzeba SQL.

## Zmiany
- Wspólny kalkulator 15 rodzin: rzeczywista suma punktów jakości, progi X/Y/Z (Z nieaktywne), pełne jednostki X.
- X działa na PŻ, pancerz, celność, inicjatywę, uniki, krytyki, przebicie, obrażenia i handel.
- Y reaguje na chybienie, unik, otrzymany krytyk, pierwsze rundy, późne rundy, osłonę i obrażenia krytyczne.
- 3+3 rodzin odzieży oraz 3/3 akcesoriów działają niezależnie.
- Wzmocniony zyskuje 4 PŻ na punkt jakości, by wzrost miał znaczenie.

## Ograniczenia
Z nadal nie działa w prawdziwej walce. Serwerowe Ekspedycje i PvP używają własnej matematyki. Stary raport pełnych setów nie jest testem balansu nowych X/Y.

## Kontrola
Składnia JS i test jednostkowy kalkulatora; zachowanie wizualne i zbalansowanie wszystkich walk wymagają sprawdzenia w przeglądarce.
