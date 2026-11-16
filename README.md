# ASHEN v0.4.6.2 — stabilne Laboratorium wyposażenia

## Instalacja
Wgraj do głównego katalogu repozytorium ASHEN: `index.html`, `js/game.js`, `css/laboratory.css`. Nie uruchamiaj SQL, nie wymieniaj innych plików.

## Zmiany
- Konfiguracja Laboratorium wyposażenia jest zapisywana w localStorage, osobno od zapisu postaci.
- Ostatni raport jest zachowany po przejściu na inną zakładkę gry, po przełączeniu okna przeglądarki i po ponownym otwarciu strony.
- Stan rozwinięcia panelu jest zapamiętywany.
- Presety A/B/C/D ustawiają wszystkie wartości testu; po wyborze presetu trzeba kliknąć 'Porównaj stare i nowe'.
- Każdy preset: Boss etap 20, średnia postać (atrybuty 17), 1000 prób, zwykła jakość, Warsztat +0, model A, brak prefiksu, sufiks Egzekutora, jedna broń. A/B pancerz 20, C/D pancerz 60.
- Symulacje nadal nie zmieniają ekwipunku, XP, surowców ani zapisów online.

Uwaga: zapis w localStorage jest lokalny dla przeglądarki i jej profilu; wyczyszczenie danych witryny go usuwa.
