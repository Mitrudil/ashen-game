# ASHEN v0.4.9.18 — test 3 Mistrzostw Z na serwerze SQL 029

## Przed uruchomieniem

Przechowuj poprzednią kopię `ashen_online_attack`. Wykonuj jako administrator w **Supabase → SQL Editor**, najlepiej w projekcie testowym. W produkcji test nie zapisuje danych, ale wykorzystuje bieżący kod z bazy; uruchamiaj go, gdy nie prowadzisz innych zmian w SQL. Bez potrzeby podmiany funkcji i bez zmian GitHub dla działania samego testu.

1. Otwórz `sql/031_sql029_izolowane_testy_serwerowe.sql` w Notatniku. `Ctrl+A`, `Ctrl+C`.
2. W Supabase SQL Editor → **New query** wklej **CAŁY PLIK**.
3. Sprawdź, czy początek to `BEGIN;`, a ostatnia linia `ROLLBACK;`. **Jeżeli nie — nie uruchamiaj**.
4. Kliknij **Run**. Nie jest potrzebne RLS: skrypt nie tworzy tabel; tworzy dwie funkcje `pg_temp` wycofywane przez `ROLLBACK`.
5. Wyeksportuj tabelę wyników z trzema wierszami. `wynik=OK` oznacza spełnienie warunków konkretnego scenariusza. `DO_ANALIZY` oznacza konieczność sprawdzenia raportu, a nie automatycznie błąd produkcyjny.

## Co faktycznie testuje

- **Wzmocniony:** jednorazowe leczenie po zejściu do 30% maks. PŻ; korzyść w PŻ vs identyczny przebieg bez Z.
- **Pancerny:** jednorazowa redukcja 35% przy dużym ciosie; korzyść w PŻ vs bez Z.
- **Techniczny:** dwie aktywacje penetracji pancerza przy trafieniach; wzrost obrażeń zadanych vs bez Z.

W każdym przebiegu generator losowy jest inicjalizowany tym samym ziarnem. Silnik jest kopiowany **z aktualnej definicji SQL w bazie**, a nie odtwarzany niezależną implementacją JavaScript. Dane testowe nie przechodzą kontroli uprawnień i ekwipunku SQL 028, ponieważ to izolowany test samej matematyki walki. Zatem test **nie** dowodzi prawidłowego działania całego RPC `ashen_online_attack` ani ochrony anty-cheat. W przypadku nieznanej wersji silnika test przerwie się z błędem.

## Oczekiwany wynik

Trzy pozycje (`Pancerny`, `Techniczny`, `Wzmocniony`) z `wynik = OK`, aktywacje `1`, `2`, `1`, bez aktywacji w wariancie wyłączonego Z. Nie zgadujemy wartości szkód, dopóki nie zobaczymy wyników z bazy.

## Bezpieczeństwo

Nie ma `INSERT/UPDATE/DELETE` na tabelach graczy; skrypt oddziela obliczenia od początku i końca produkcyjnej funkcji; weryfikuje, czy wydzielony fragment nie zawiera poleceń modyfikujących dane. W razie nieoczekiwanej struktury funkcji zatrzymuje się bez podmiany funkcji produkcyjnej. Wszystkie tymczasowe funkcje tworzone są w transakcji kończącej się `ROLLBACK`.
