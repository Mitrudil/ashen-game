# ASHEN v0.4.9.20 — etap 4 Mistrzostw Z

W Supabase działa SQL032 (9/15 Z). **SQL033 to kandydat, nie wdrożenie**.
Nowe serwerowe umiejętności do sprawdzenia: Elastyczny, Odporny i Refleksyjny.

## Bezpieczna kolejność
1. Wgraj aktualizację GitHub (nie zmienia Supabase).
2. Uruchom `sql/033_KONTROLA_PRZED_TESTEM_READONLY.sql` i potwierdź SQL032.
3. Wykonaj kopię `SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);`.
4. Uruchom **pełny** `sql/033_TEST_KOMPILACJI_BEZ_WDROZENIA.sql`. Plik zawiera `BEGIN;` i `ROLLBACK;`, nie zapisuje zmian. Długie zapytanie możesz wkleić kolejno z podzielonych plików, nie uruchamiaj ich osobno.
5. Podeślij wynik testu. Nie uruchamiaj kandydata produkcyjnie przed izolowanymi testami obliczeń i przeglądem.

Uwaga: kontrola kompilacji/obecności mechanik nie dowodzi poprawności obliczeń ani zachowania we wszystkich walkach.
