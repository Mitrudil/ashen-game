# ASHEN v0.4.8.4 — Diagnostyka setów online

## Instalacja
Po v0.4.8.3 podmień `index.html`, `js/game.js` i `js/online.js` na GitHubie. Odśwież przez Ctrl + F5. Nie uruchamiaj SQL.

## Zmiany
- W PvP online dodano rozwijany panel "Diagnostyka setów online", pokazujący bieżące pełne rodziny setów (z wyposażenia postaci) i stan synchronizacji lokalnego zapisu.
- Wyświetla poziom i punkty jakości aktywnych setów, numer silnika oraz liczniki flag X/Y/Z w migawce.
- Jasno zaznacza, że to DANE KLIENTA, nie potwierdzenie działania bonusów po stronie serwera.
- Ujednolicono numer wersji 0.4.8.4 w górnym panelu, stopce, silniku setów i HTML.

## Granice i testy
- Bez zmian w walce, loot, balansie, zapisach i SQL.
- To nie jest aktywacja X/Y/Z w PvP ani w Ekspedycjach online.
- Brakuje w odtworzonym źródle migracji `003_online_pvp.sql`. Przed ingerencją w serwer należy pozyskać bieżącą definicję funkcji serwerowych z Supabase.
- Sprawdź: postać bez setów; 3 elementy z jednej rodziny; zestaw z Z; synchronizacja po zmianie wyposażenia; walki PvP online i raporty.
