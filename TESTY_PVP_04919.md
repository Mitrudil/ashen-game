# ASHEN v0.4.9.19 — plan testów SQL 032 (Zwinny, Żelazny, Spostrzegawczy)

## Obecny stan
SQL 029 (6/15 Z) działa na głównej bazie. SQL 032 jest **kandydatem** (9/15 po oddzielnym wdrożeniu); samo umieszczenie go na GitHub nie zmienia PvP.

## Etap A — bez zmian danych
1. Wykonaj w Supabase `sql/032_sprawdzenie_wersji_przed_wdrozeniem_READONLY.sql`. Oczekuj `OK — SQL 029 jest aktywny` i pięciu wartości `true`.
2. Zachowaj aktualną definicję `public.ashen_online_attack(uuid)` uzyskaną przez `SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);`.
3. Przetestuj SQL 032 na osobnym projekcie Supabase albo w izolowanej transakcji, która kończy się `ROLLBACK`. Test funkcji bez pełnego RPC to nie test gry.

## Etap B — reguły do sprawdzenia po osobnym wdrożeniu
- **Zwinny**: pierwsze *celne* trafienie walki +12% obrażeń bazowych po damagePct; pudło nie zużywa efektu. Licznik jeden na walkę.
- **Żelazny**: trafienie przeciwnika z dodatnim pancerzem +8% bazowych obrażeń; najwcześniej rundy 1, 4, 7, 10. Jeden bonus na trzy rundy; przeciwnik bez pancerza nie zużywa aktywacji.
- **Spostrzegawczy**: od drugiego celnego trafienia w rundzie +8%; maksimum jeden raz w rundzie. Pudła nie są zaliczane do trafień.
- **Regresja**: poprzednie 6 Mistrzostw Z, X/Y, 2 ataki/dzień na obrońcę, raport publiczny, konto Kowal (3 ataki), synchronizacja profilu, stary raport SQL 029.
- **Autoryzacja**: brak ataków na siebie, brak nieautoryzowanych ataków, brak udostępnienia danych prywatnych.

## Ograniczenia
Nie zapewniamy jeszcze izolowanego end-to-end RPC z fikcyjnymi kontami. Wcześniejszy SQL 031 sprawdził wybrane obliczenia, ale nie autoryzację i zapis raportów. Nie uruchamiaj produkcyjnego SQL 032 na podstawie wyłącznie kontroli statycznej. W razie błędu przywróć zapisaną definicję funkcji (nie wykonuj starszej migrującej wersji SQL 029).
