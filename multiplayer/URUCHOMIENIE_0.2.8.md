# ASHEN v0.2.8 — uruchomienie klanów

1. Podmień pliki z ZIP „tylko zmienione” na GitHubie. Zachowaj strukturę katalogów (w tym NOWY `js/clans.js`).
2. W panelu Supabase wybierz **wyłącznie projekt ASHEN** (nie ALLADYN).
3. SQL Editor → New query → wklej cały `multiplayer/supabase/005_clans.sql` → Run → sprawdź „Success”.
4. Odśwież stronę przez Ctrl+F5 w obu przeglądarkach.
5. Na koncie **Wędrowca** otwórz **☷ Klany**, utwórz klan, wybierz **Kowala** i wyślij zaproszenie.
6. Na koncie **Kowala** otwórz **☷ Klany** → **Odśwież** → **Dołącz**.
7. U Wędrowca kliknij **Odśwież**, sprawdź listę członków, spróbuj mianować Kowala oficerem.
8. Dla testów sprawdź też odrzucenie zaproszenia, opuszczanie klanu oraz ograniczenia ról.

## Zasady
- 1 klan na konto Supabase; 30 członków na klan.
- Lider: zaproszenia, mianowanie/zdejmowanie oficerów, usuwanie członków.
- Oficer: zaproszenia.
- Członek: przyjęcie zaproszenia, opuszczenie klanu.
- Zaproszenia wygasają po 7 dniach; maks. 10 oczekujących na klan.
- Lider może rozwiązać klan tylko po usunięciu pozostałych członków.
- Lista zaproszeń nie jest jeszcze powiadomieniem push: trzeba otworzyć Klany i kliknąć Odśwież.
- Na razie NIE ma wspólnych bossów, lokacji klanowych, czatu klanu ani przekazywania przywództwa.
- Dane klanu są przechowywane tylko w Supabase; lokalne zapisy, PvE, PvP, wiadomości i ekwipunek pozostają bez zmian.
- Wymaga wcześniejszego wdrożenia skryptów 002 i 003. Skrypt 004 ograniczający spam wiadomości pozostaje opcjonalny.

## Bezpieczeństwo
Role i członkostwo są sprawdzane serwerowo przez RPC. Tabele mają RLS i nie są dostępne bezpośrednio dla kont graczy. Gra pozostaje wersją testową, bez pełnego mechanizmu anty-cheat statystyk postaci. Nigdy nie wprowadzaj secret/service_role w przeglądarce.
