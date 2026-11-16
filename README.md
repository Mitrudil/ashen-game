# ASHEN v0.4.7.3 — naprawa czarnego ekranu

## Przyczyna
W v0.4.7.2 kod inicjalizował Planer setów wywołaniem `loadSetPlan()` przed deklaracją `ACCESSORY_SETS`. Ponieważ `ACCESSORY_SETS` jest stałą `const`, jej odczyt przed inicjalizacją wywołuje ReferenceError i zatrzymuje uruchomienie aplikacji — czarny ekran.

## Naprawa
Przeniesiono `setPlanner=loadSetPlan()` za deklarację `ACCESSORY_SETS`. Pozostawiono wszystkie funkcje v0.4.7.2 i dotychczasowy zapis w przeglądarce. Zwiększono wersję do 0.4.7.3 i parametry cache w index.html.

## Instalacja
Podmień w repozytorium **oba** pliki: `index.html` oraz `js/game.js`. Nie trzeba usuwać danych ani uruchamiać SQL. Po wdrożeniu wykonaj twarde odświeżenie Ctrl+F5. W nagłówku pojawi się v0.4.7.3.

## Kontrola
Otwórz grę, przejdź do Postać → Planer setów, przetestuj 6 Wartownika i 3+3. Przejdź na inną zakładkę i wróć.

Jeśli ekran nadal jest czarny, sprawdź w narzędziach deweloperskich F12 → Console pierwszy czerwony błąd i prześlij jego treść.
