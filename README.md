# ASHEN v0.4.7.1 — Sety mieszane ubioru i trzy akcesoria

## Zmiany
- Ubiór: dodano prefiksy `Wartownika` oraz `Nomady` do losowania nowych elementów; utrzymano już działający mechanizm 3/4/5/6 części jednej rodziny prefiksu. Można aktywować DWIE różne rodziny jednocześnie przy układzie 3+3. Sufiksy nie przeszkadzają w kompletowaniu.
- Zwykłe akcesoria: pięć rodzin setów opartych o prefiksy (Technika, Tropiciela, Negocjatora, Nomady, Ocalałego). Premia aktywuje się WYŁĄCZNIE po założeniu 3 zwykłych akcesoriów z tej samej rodziny. Przy 1 lub 2 nie ma żadnej premii zestawowej; pojedyncze bonusy samych przedmiotów nadal działają.
- Jakość wpływa na siłę setu akcesoriów poprzez średnią mnożników jakości; różne sufiksy i rzadkości nie blokują kompletu.
- Oddzielny istniejący Rezonans artefaktów pozostaje bez zmian, zwykłe akcesoria nie liczą się do Rezonansu i na odwrót.
- Wyniki setów są widoczne w Postaci, podsumowaniu Ekwipunku oraz w szczegółach akcesorium.
- Żadnych nowych slotów, SQL ani resetu ekwipunku. Nowa pula prefiksów akcesoriów już istniała; teraz pięć prefiksów łączy przedmioty w sety.

## Instalacja
Z paczki podmień dokładnie `index.html` oraz `js/game.js` w repozytorium GitHub. Pozostałe pliki zachowaj bez zmian.

## Test manualny
1. Załóż 2 zwykłe akcesoria z prefiksem `Techniczny`: bonus setowy 0. Załóż 3.: bonus do Inteligencji; zdejmij dowolny: bonus znika.
2. Załóż 3 ciuchy `Wzmocniony` i 3 ciuchy `Tropicielski` w sześciu slotach: obydwa sety aktywne. Zdejmij jeden z rodziny: traci bonus tylko ta rodzina.
3. Zmieniaj sufiksy i jakości; nie powinny zrywać setów. Zwykłe akcesoria i artefakty nie mogą sumować się do jednego zestawu.

## Uwagi
Nie ma tu zmian matematyki Starć ani serwerowych Ekspedycji. Zwiększenie atrybutów przez nowe sety wpływa na lokalne Starcia. Formuła SQL Ekspedycji wymaga osobnej synchronizacji.
