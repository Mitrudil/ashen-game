# ASHEN 0.6.0 — Etap 4: katalog premii i artefaktów

**STATUS: PROJEKT DO TESTÓW. Żadna z premii nie została wdrożona do gry ani serwera SQL.**

## Co ustalono i co pozostaje propozycją

- Zachowujemy wszystkie 15 istniejących Mistrzostw Z. **Nowe wartości X/Y są wstępnymi kandydatami**, do dopasowania do progów aktywacji i algorytmu średniej jakości.
- 10 rodzin odzieży i 5 rodzin akcesoriów; akcesoria nadal wymagają kompletu 3/3, odzież minimum trzech pasujących części.
- 16 artefaktów w 8 rodzinach; każdy ma osobny bonus zależny od kategorii sprzętu; w jednym przedmiocie jedna sztuka danej rodziny. Rezonans po 3 osadzonych artefaktach tej samej rodziny w wyposażeniu (tylko raz na rodzinę).
- Zero automatycznego wzrostu ataków z poziomem postaci. Liczba gniazd powstaje wyłącznie w chwili zdobycia przedmiotu, bez późniejszego dodawania/przelosowywania.
- **Iskra Tempa** to wyłącznie kandydat na +1 pełny atak dla broni z minimum 2 bazowymi atakami; nie jest zaakceptowany balansowo. Szybki prefiks także nie został zmieniony.

## Zestawy i poziom jakości

Wartości bazowe X/Y w `KATALOG_15_ZESTAWOW_XY.csv`. Robocza skala średniej jakości: `1 + 0,12 × (średnia jakość − 1)`. Gdy po skalowaniu powstają ułamki, wyświetlamy i rozliczamy je zgodnie z charakterem parametru; atrybuty całkowite zaokrąglamy raz po sumowaniu wszystkich bonusów, **nie oddzielnie dla każdego artefaktu**. Dodatkowe ataki są zawsze całkowite i nie podlegają mnożnikowi jakości. Nie wprowadzono nowych progów X/Y/Z w produkcji.

## Bezpieczeństwo balansu ataków

Dla modeli z 1 atakiem bonus +1 pełny atak zwiększa wynik o 100% przed pancerzem. Dla 3 ataków o 33,3%. Rozważony wyjątek dla szybkości tylko od 2 ataków jest roboczy, a nie obowiązującą zasadą. Nie nakładamy ukrytych kompensat obrażeń na broń.

## Scenariusze do sprawdzenia przed wdrożeniem

1. Broń jednoatakowa vs trzyatakowa, z +1 atakiem, +10% obrażeń, +5 pp krytyka.
2. Trzy osłonowe artefakty w trzech różnych przedmiotach -> jeden rezonans; czwarty osłonowy nie daje drugiego rezonansu.
3. Jedna rodzina artefaktu w przedmiocie (np. trzy gniazda, tylko jeden Osłonowy).
4. Zmiana jednego elementu odzieży: 3/6 -> 2/6 usuwa X/Y/Z, ale nie istniejące artefakty innych przedmiotów.
5. Zestaw akcesoriów: 2/3 bez bonusu, 3/3 aktywuje; zamiana jakości aktualizuje średnią.
6. Artefakty w broni, rękawicach, kurtce i akcesorium różnią się bonusami mimo identycznej nazwy.
7. Dodatkowe ataki i krytyki przy dużym pancerzu: bez wdrożenia do SQL aż do potwierdzenia balansu.

## Kolejne prace

Doprecyzować bazową moc 24 modeli broni, ukończyć wartości afiksów odzieży/akcesoriów, porównać wynik X/Y z działającym mechanizmem, potem zintegrować artefakty i Strefę Anomalii. Wdrożenie produkcyjne dopiero ze wspólnymi testami serwerowego PvP.
