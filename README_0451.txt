ASHEN v0.4.5.1 — Laboratorium walk

INSTALACJA:
1. Uruchomione na v0.4.5: pozostaw dotychczasowy SQL/024 i resztę projektu bez zmian.
2. Wgraj do repozytorium: index.html, js/game.js oraz NOWY plik css/laboratory.css.
3. Otwórz Starcia i rozwiń „Laboratorium walk”.
4. Wybierz przeciwnika (etap 1, 10 lub 20) i 10/100/1000 symulacji, kliknij „Uruchom porównanie”.

LABORATORIUM:
- Ten sam silnik co zwykłe Starcia PvE: funkcja fight() z możliwością podania niezmiennego snapshotu i własnego RNG.
- Dwa zestawy: aktualnie wyposażone bronie vs zwykły nóż; pozostałe atrybuty i pancerz identyczne.
- Dokładnie ten sam przeciwnik w każdej próbie; rezultaty statystyczne: zwycięstwa, remisy, porażki, celność, średnie obrażenia i rundy.
- Po dwie symulacje dla każdego numeru próby przy tym samym początkowym ziarnie RNG.
- Zero przyznawanych nagród, brak save(), brak zmian w stanie gracza i chmurze.
- Panel jest zwinięty domyślnie; wynik istnieje tylko do odświeżenia strony.

OGRANICZENIE:
Laboratorium wykorzystuje silnik lokalnych Starć, NIE uruchamia funkcji PostgreSQL liczącej ekspedycje frakcyjne. Uczciwe porównanie serwerowych Ekspedycji wymaga oddzielnego, bezpiecznego endpointu symulacyjnego.

Nie trzeba uruchamiać SQL ani przesyłać grafik.
