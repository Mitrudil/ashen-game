# ASHEN 0.3.1 — test zapasów, rekrutacji i sumy poziomów

## Aktualizacja
1. Pobierz paczkę zmienionych plików i wgraj jej **zawartość** do głównego katalogu repozytorium GitHub.
2. W Supabase wybierz **wyłącznie projekt ASHEN** (nie ALLADYN).
3. SQL Editor → New query → wklej zawartość `multiplayer/supabase/008_expedition_recruitment.sql` → Run.
4. Odśwież stronę `Ctrl+F5`.

## Test z Mitrudilem i Kowalem
1. Na koncie organizatora (lider lub oficer) utwórz wyprawę z pierwszym bossem. Koszt powinien pobrać 2 zapasy z 12.
2. Na koncie drugiego członka klanu kliknij „Zgłoś kandydaturę”. Powinien pozostać poza składem.
3. Na koncie organizatora odśwież, zobacz zgłoszenie, kliknij „Przyjmij”. Teraz gracz jest w składzie.
4. Sprawdź sumę poziomów. Dla pierwszego bossa limit to 20; dla drugiego 35; dla trzeciego 50.
5. Uruchom walkę i sprawdź raport z zapisanymi grafikami oraz taktyką.
6. Test zaproszeń: stwórz kolejną wyprawę i wybierz członka z listy. Drugie konto musi ręcznie przyjąć zaproszenie.
7. Dwie równoczesne wyprawy na klan są dozwolone **tylko jeśli organizuje je dwóch różnych liderów/oficerów** i postacie nie uczestniczą jednocześnie w obu.
8. Spróbuj stworzyć trzecią aktywną wyprawę — serwer powinien odmówić.

## Reguły kosztu
- początek: 12/12 zapasów na klan;
- regeneracja: +1 co 6 godzin, maksymalnie 12;
- koszt: boss 1 = 2, boss 2 = 3, boss 3 = 4;
- anulowanie nie zwraca zapasów;
- starsze, już utworzone ekspedycje nie są obciążane wstecznie.

## Uwagi techniczne
- Prawdziwe uprawnienia oraz limit poziomów są sprawdzane przez RPC w Supabase.
- Dołączenie przez stare `ashen_expedition_join` zostało zablokowane dla kont użytkowników.
- Wersja nie dodaje jeszcze wypłat nagród, doświadczenia ani łupów — ekonomia nagród wymaga osobnego wdrożenia, żeby nie było duplikowania zasobów.
