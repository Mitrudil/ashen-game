# ASHEN v0.4.7.6 — Katalog nowych rodzin setowych (etap projektowy)

## Instalacja
Wgraj `index.html` i `js/game.js` do repozytorium, podmieniając pliki z v0.4.7.5. **Brak SQL. Nie resetuj postaci.**

## Co dodano
W `Postać → Planer setów` pojawia się sekcja **„Projekt ASHEN 0.5 — 15 unikalnych rodzin”**. Pokazuje 10 rodzin odzieży i 5 rodzin akcesoriów, ich nową tożsamość, proponowane dwie premie każdej rodziny oraz wartości dla bieżącego układu Planera. 

**To wyłącznie podgląd projektowy.** Działające Starcia, drop, premie i wyniki starszych testów NIE zostały zmienione. Nie należy mylić proponowanych wartości z obecnym balansem.

## Ustalone reguły
- Odzież aktywuje bonus od 3 części, progresja 3/4/5/6, jednoczesne dwa zestawy 3+3.
- Akcesoria: trzy aktualne sloty, premia tylko przy 3/3.
- Set identyfikuje prefiks, sufiks służy personalizacji.
- Rodziny nie są sztywno przypisane do klasy broni.
- Jakość: prototypowy mnożnik bonusów `1+0,35×(mnożnik_jakości−1)`, tylko w podglądzie.
- Bez bonusów za 1 lub 2 elementy.

## Dlaczego etap projektowy?
W nowym katalogu znalazły się efekty, których silnik jeszcze nie obsługuje (m.in. odporność na krytyki i premiowanie pierwszego ciosu). Dopóki nie będą działać w jednym wspólnym silniku, nie wolno włączać ich do prawdziwej walki.

## Kontrola
1. Uruchom grę; wejdź w Postać → Planer setów.
2. W podglądzie 3 Wartownika + 3 Nomady sprawdź, że są dwie aktywne rodziny.
3. Przy 2 elementach rodziny nie ma premii.
4. Przejście do innych zakładek nie powinno usuwać wyboru Planera.
