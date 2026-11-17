# ASHEN v0.4.9.0 — Laboratorium Setów Z

Zmiany: panel w Ekwipunku na oddzielnych profilach Testerów, zestawy Negocjatora (akcesoria), Lekki i Wartownika (odzież), wybór jakości każdej z 3 części, faktyczne prefiksy i obliczanie X/Y/Z przez bieżący silnik.

Bezpieczeństwo: przed generowaniem zachowujemy kopię ekwipunku i założonych slotów profilu Testera; przywrócenie resetuje wyposażenie do kopii. Główny profil jest zablokowany. Migawka online zwraca brak danych, gdy testowy set jest aktywny, a auto-publikowanie nie jest wtedy uruchamiane przez zapis. Nie jest to jeszcze test serwerowego PvP: wymaga osobnego serwerowego trybu sandbox.

Instalacja: podmień index.html i js/game.js; bez SQL. Nie zmieniaj js/public-config.js.

Test: wybierz Tester 1–4 → Ekwipunek → Laboratorium Setów Z → wybierz set i jakości 4/4/4 → generuj → sprawdź poziom III → przywróć.

Uwaga: testowy zestaw powinien zostać przywrócony przed opuszczeniem profilu. Nie używaj go do zwykłej rozgrywki.
