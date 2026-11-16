# ASHEN v0.4.6.7 — pierwsza stała kalibracja klas

## Co zmieniono
Dodano nowy panel w **Starcia → Laboratorium wyposażenia**. Po teście v0.4.6.6 stwierdziliśmy, że wyrównanie budżetu przed pancerzem znacznie zmniejszyło rozrzut skuteczności klas. Nowy test próbuje sprawdzić **jedną stałą korektę parametrów bazowych danej broni** w trzech etapach rozwoju — nie przelicza współczynników osobno dla każdego etapu.

Testowane współczynniki obrażeń bazowych (propozycje eksperymentalne):
- dwie maczety: ×0,72
- młot wyburzeniowy: ×0,91
- dwa rewolwery: ×1,12
- karabin maszynowy PK: ×0,93
- wyrzutnia harpunów: ×1,42
- prototypowa broń szynowa: ×1,22

Wszystkie testy porównują tę samą jakość, poziom Warsztatu, pancerz celu i atrybuty postaci oraz używają wspólnych seedów. W tym kroku **skalowane są jedynie testowe zakresy bazowych obrażeń broni**, a nie punkty z atrybutów ani działanie krytyka czy przebicia. Zaokrąglenia oraz bonusy z atrybutów sprawiają, że wynik nie będzie dokładnie identyczny między etapami.

**43 200 testowych walk** (6 zestawów × 3 etapy × 4 poziomy pancerza × 300 symulacji × 2 warianty). W tabeli i raporcie tekstowym wynik przed kalibracją jest zestawiony z wynikiem po kalibracji.

## Ważne ograniczenia
- To tylko pierwszy kandydat. Nie jest to jeszcze balans wszystkich 24 modeli ani modyfikatorów.
- Aktualizacja **nie zmienia żadnych przedmiotów, normalnych walk ani serwerowych Ekspedycji**. Nie wymaga SQL.
- Test nadal zakłada równe wartości wszystkich atrybutów; w następnych etapach trzeba przetestować rozkłady wyspecjalizowane i kombinacje prefiksów/sufiksów.
- Bardzo łatwe walki mogą mieć 100% wygranych we wszystkich klasach: patrz potencjał obrażeń/rundę i średnia runda wygranej.

## Instalacja
Podmień w repozytorium `index.html` oraz `js/game.js`. Pozostałe pliki niezmienione. Uruchom nowy panel **„Pierwsza stała kalibracja”**, poczekaj na wynik w samej aplikacji i skopiuj raport.
