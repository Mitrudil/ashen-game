# ASHEN v0.4.7.4 — Porównanie setów w prawdziwych Starciach

## Instalacja
Wgraj na GitHub **index.html** i **js/game.js**. SQL nie jest potrzebny. Nie resetuj danych przeglądarki.

## Nowość
Postać → Planer setów → **Porównanie setów w Starciach**. Przyciskiem można wykonać 1200 symulacji (300 × 4 warianty) na bossie etapu 10 lub 20. Warianty: 6× Wartownika, 3+3, 4+2 oraz ręcznie skonfigurowany Planer. Uwzględniona jest jakość i bieżące 3 akcesoria wskazane w Planerze.

## Bezpieczeństwo
- Nie zmienia ekwipunku, statystyk ani postępu. Używa `fight()` z `testSnapshot` oraz wspólnym seedem.
- Pozwala na dwie aktywne rodziny ubioru (3+3), 3/3 akcesoriów; brak premii za 1–2 elementy.
- Punktem wyjścia są aktualne statystyki i broń gracza bez aktualnych premii setowych. Symulacja nakłada tylko wybrane bonusy setowe.
- Indywidualne wartości hipotetycznych sztuk odzieży, ich bazowy pancerz i premie prefiksów/sufiksów NIE są symulowane.
- Nie dotyczy serwerowych Ekspedycji.

## Szybka kontrola
1. Sprawdź, czy gra startuje (brak czarnego ekranu).
2. Wejdź Postać → Planer setów. Uruchom cztery warianty przy jakości zwykłej.
3. Zmień jakość na legendarną i ponów test. Porównaj PŻ i wyniki.
4. Przełącz zakładkę i wróć: zapisany raport powinien pozostać.

## Ograniczenia
Jeśli wszystkie zestawy mają 100% zwycięstw, kieruj się średnią rundą zwycięstwa i PŻ po walce. Porównanie jest diagnostyczne i nie zatwierdza jeszcze docelowych bonusów.
