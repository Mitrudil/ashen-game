# ASHEN v0.4.7.9 — Laboratorium Ewolucji Setów

## Instalacja
Podmień `index.html` oraz `js/game.js` w repozytorium GitHub. Nie potrzeba SQL.

## Funkcje
- Postać → Planer setów → Laboratorium Ewolucji Setów.
- Kalkulator 15 rodzin, liczby elementów 3/4/5/6 (dla akcesoriów tylko 3), mieszanej jakości, progów X/Y/Z.
- Kontrola wszystkich 19 500 kombinacji jakości i pojedynczych ulepszeń (test matematyczny).
- Kontrola niezależności zasad jakości wobec wszystkich 6 specjalizacji broni, ale **bez symulowania ich walk**.
- Lokalny zapis raportu, kopiowanie tekstowe, trwały stan panelu.

## Istotne ograniczenie
Wersja nie wdraża jeszcze zdarzeń Y/Z do rzeczywistego `fight()` ani do serwerowych Ekspedycji. Zatem nie podaje DPS, procentu wygranych ani rzekomych wyników walk dla X/Y/Z. Matematyczna walidacja wzoru nie jest dowodem balansu. Obecne Starcia nadal korzystają z działającego silnika z v0.4.7.8.
