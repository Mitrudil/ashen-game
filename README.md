# ASHEN v0.4.9.21 — ostatnie trzy Mistrzostwa Z

**SQL033 jest produkcyjny (12/15); SQL034 jest kandydatem, NIE wdrażać!**

Nowe serwerowe mechaniki (zachowujące reguły gry lokalnej):
- Tropicielski: normalne celne trafienie oznacza cel; późniejszy krytyk z oznaczeniem +10%, z przerwą co najmniej 3 rund.
- Nomadyczny: po utracie co najmniej 20% maksymalnego PŻ w rundzie, następne celne trafienie +10%, przerwa co najmniej 3 rundy.
- Wszechstronny: po utracie co najmniej 25% maksymalnego PŻ w rundzie jednorazowa osłona 10% maksymalnego PŻ; chroni dopiero następne trafienia.

## Co zrobić teraz
1. Opcjonalnie wgrać paczkę GitHub v0.4.9.21 (zmienia numer i komunikat Laboratorium, nie zmienia produkcyjnego PvP).
2. W Supabase uruchomić `sql/034_KONTROLA_PRZED_TESTEM_READONLY.sql`.
3. Zachować kopię `pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure)`.
4. Uruchomić **w jednym zapytaniu** wszystkie części `034_TEST_KOMPILACJI...`, od początku `BEGIN;` do końca `ROLLBACK;`.
5. Przesłać wynik. Dopiero potem izolowany test obliczeń i niezależnie sprawdzane wdrożenie produkcyjne.

Uwaga: 20 kontroli tekstowych potwierdza obecność implementacji, nie poprawność rachunków.
