# ASHEN v0.4.7.5 — Pełny audyt rodzin setowych

## Instalacja
Wgraj **index.html** i **js/game.js** do repozytorium, nadpisując pliki z v0.4.7.4. Nie wykonuj SQL, nie czyść pamięci przeglądarki ani ekwipunku.

## Nowa funkcja
**Postać → Planer setów → Wszystkie sety — kontrola jakości**.

Jednym przyciskiem porównasz:
- wszystkie **10** zdefiniowanych rodzin ubioru jako pełne **6/6**;
- wszystkie **45** niepowtarzalnych par rodzin jako układy **3+3**;
- wszystkie **5** zdefiniowanych rodzin akcesoriów jako pełne **3/3**;
- jeden wariant kontrolny bez premii.

Każdy wariant jest badany w jakości **zwykłej** oraz **legendarnej**, po 80 prób na konfigurację, łącznie **9760 symulacji** w lokalnym silniku `fight()`. Wybierz bossa etapu 10 lub 20. Aby sprawdzić obu bossów, uruchom test osobno dla każdego etapu.

Wyniki: bonusy, maksymalne PŻ, pancerz, potencjał obrażeń na rundę, odsetek zwycięstw, średnia runda zwycięstwa, PŻ po walce. Raport jest zapamiętywany lokalnie i można go skopiować do schowka. Przebieg jest wykonywany partiami, dzięki czemu interfejs może się odświeżać.

## Zasady i ograniczenia
- Test bierze aktualną postać i jej uzbrojenie jako punkt odniesienia, **odejmuje obecne premie setowe** i nakłada tylko testowaną konfigurację.
- Poszczególne grupy badane są **oddzielnie**: w teście odzieży nie ma bonusu akcesoriów, a w teście akcesoriów nie ma bonusu odzieży. Synergie między obydwoma rodzajami zestawów będą osobnym etapem.
- Nie symulujemy indywidualnych statystyk fikcyjnej odzieży ani jej bazowego pancerza, prefiksów i sufiksów. Nie zmieniamy ekwipunku.
- Set odzieży aktywuje premie od **3/6**, kolejne części wzmacniają premię. Testy 3+3 aktywują obie rodziny. Akcesoria aktywują set **tylko przy 3/3**.
- Porównujemy **dwie skrajne jakości** na tym etapie; jakości pośrednie pozostają w Planerze i będą przedmiotem następnego etapu.
- Test wykorzystuje **lokalne Starcia**, nie dotyczy serwerowych Ekspedycji.
- Każdy wariant ma te same losowania; 80 prób nadaje się do wstępnego wykrywania skrajnych różnic, nie do ostatecznego zatwierdzania drobnych zmian balansu.

## Szybka kontrola po wdrożeniu
1. Otwórz grę, sprawdź zakładkę Postać i Planer setów — brak czarnego ekranu.
2. Uruchom **Przetestuj wszystkie rodziny (9760 walk)** na bossie etapu 20.
3. Sprawdź liczbę wierszy: **122** w dwóch jakościach (10 pełnych + 45 mieszanych + 5 akcesoriów + kontrola, każda jakość).
4. Skopiuj raport i prześlij do analizy. Przełącz zakładkę i sprawdź, czy raport pozostaje zapisany.
