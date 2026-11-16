# ASHEN v0.4.6.4 — Laboratorium specjalizacji

Aktualizacja na bazie v0.4.6.3. Podmień `index.html`, `js/game.js`, `css/laboratory.css` w repozytorium. **Bez SQL**. Zmień również service worker/cache, jeśli projekt używa dodatkowego cache przeglądarki.

## Nowość
W zakładce Starcia → Laboratorium wyposażenia pojawia się panel **Laboratorium specjalizacji**. Jeden przycisk uruchamia 21 600 lokalnych symulacji: 6 pełnych zestawów (w tym dwie bronie jednoręczne), trzy etapy rozwoju i 4 poziomy pancerza po 300 prób. Raport zawiera średnie obrażenia/rundę, zwycięstwa, celność i krytyki; można go skopiować. Wyniki zapisują się w localStorage dla wybranego profilu i wracają po ponownym otwarciu panelu.

## Świadome ograniczenia
- To **narzędzie diagnostyczne**, NIE nowa matematyka Starć ani zakończony balans. Używa aktualnego lokalnego silnika ASHEN.
- Porównuje reprezentantów klas, których bazowe wartości nie zostały jeszcze wyrównane.
- W danej klasie dla 1R zawsze używany jest drugi identyczny egzemplarz ze współczynnikiem 80%.
- Profile: początek (cechy 8, zwykły +0, przeciwnik 1), rozwój (17, rzadki +0, boss 10), zaawansowany (30, legendarny +5 C, boss 20).
- Bez prefiksów/sufiksów; stały limit 10 rund, seedy powtarzalne.
- Zachowane wszystkie dotychczasowe testy v0.4.6.3, nie zmieniono ekwipunku, Wypraw, nagród, prawdziwych Starć ani serwerowych Ekspedycji.
- Po aktualizacji sprawdź działanie w przeglądarce, ze względu na zależności środowiskowe i cache.
