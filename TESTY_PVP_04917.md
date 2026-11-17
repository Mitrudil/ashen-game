# ASHEN v0.4.9.17 — diagnostyka Z z faktycznych raportów

1. Zaktualizuj pliki GitHub z paczki aktualizacyjnej; SQL nie trzeba wykonywać.
2. W zakładce PvP online odśwież listę przeciwników i raportów.
3. Otwórz „Audyt rzeczywistych aktywacji Z · raporty Supabase”.
4. Zweryfikuj, że widać tylko raporty oznaczone silnikiem SQL 029. Stare raporty mogą nie być liczone.
5. Jeśli nie ma wpisów: to **brak zaobserwowanych aktywacji**, nie usterka.
6. W razie potrzeby administrator może uruchomić samodzielnie odczytowy `sql/030_diagnostyka_raportow_z_readonly.sql` w Supabase SQL Editor. Skrypt nie zmienia niczego w bazie; nie jest migracją.

## Co oznacza zaliczenie?

Panel potwierdza tylko fakty *zapisane w zdarzeniach rzeczywistych walk* (czyli `ashen_online_attack`), a nie poprawność obliczeń wszystkich gałęzi funkcji. Żeby **sprawdzić przypadek aktywacji**, należy mieć prawidłowy set w rzeczywistej postaci i doprowadzić do warunku w walce PvP; wymagane są oddzielne testy na staging dla wszystkich 3 zdolności SQL 029. Nie podmieniaj wyposażenia ani flag produkcyjnych postaci, nie wyłączaj limitów.

## Ograniczenie

W zestawieniu konta liczone są tylko ostatnio pobrane raporty, nie pełna historia ze wszystkich kont. W agregacji SQL liczone są wszystkie raporty dostępne administratorowi z właściwym tagiem. Nazwy rodzin „Negocjatora”, „Wartownika”, „Techniczny” odwzorowują komunikaty serwera SQL 029.
