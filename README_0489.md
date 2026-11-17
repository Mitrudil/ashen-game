# ASHEN v0.4.8.9 — Mistrzostwo Z w PvP online, etap 1

## Zmiany
- Wprowadzenie trzech efektów Z w serwerowym PvP: Negocjator (+3 celności), Lekki (+4% obrażeń od drugiego trafienia w rundzie, do dwóch uruchomień), Wartownik (jednorazowa osłona 15% maks. PŻ).
- Uruchomienia Lekkiego i Wartownika są zapisywane w przebiegu rund i widoczne w raportach publicznych. Negocjator modyfikuje obliczenie celności bez osobnego wpisu na każdą próbę.
- Dotychczasowe X/Y, limit walk, raporty, udostępnianie i kolejność działań zachowane.
- Numer wersji 0.4.8.9 w górnym panelu, stopce i plikach HTML.

## Instalacja
1. Zrób kopię `ashen_online_attack` z Supabase (tak jak przed 0.4.8.5).
2. Uruchom `sql/027_online_pvp_z_stage1.sql` w Supabase SQL Editor (wymaga poprzednich SQL 025 i 026).
3. Wgraj `index.html`, `js/game.js`, `js/online.js` na GitHub. Nie zmieniaj `js/public-config.js`.
4. Ctrl+F5, synchronizacja postaci, próba walki z aktywnym odpowiednim setem; w raporcie sprawdź aktywację Z.

## Ograniczenia
- **Tylko 3 z 15 efektów Z**; nie ogłaszamy zakończenia całego mistrzostwa.
- Serwer nie potwierdza wyposażenia na podstawie wiarygodnych rekordów; przyjmuje flagi z opublikowanej migawki postaci. Przed publicznym uruchomieniem gry wymagany jest audyt i walidacja po stronie serwera.
- W obecnym PvP serwer wybiera kolejność stron losowo (50/50), więc nie wdrażamy jeszcze bonusów związanych z inicjatywą.
- Nie przeprowadzono testu rzeczywistej migracji w Supabase ani walk w przeglądarce; potrzebna jest weryfikacja po wdrożeniu.
- Poprawka przewijania v0.4.8.8 jest zachowana.
