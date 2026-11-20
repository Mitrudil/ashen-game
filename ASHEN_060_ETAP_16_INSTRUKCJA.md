# ASHEN 0.6.0 — etap 16: serwerowy kontrakt integralności wyposażenia

## Zrobione
- Przygotowany **kandydat** SQL `sql/041_KANDYDAT_WALIDACJI_EKWIPUNKU_NIE_WDRAZAC.sql`, niezależny od istniejącej funkcji publikacji. Sprawdza wyłącznie zapis własnego użytkownika: UID, założone przedmioty, indeksy jakości, pojemność gniazd i liczbę osadzonych artefaktów. Używa SECURITY INVOKER i auth.uid(); nie tworzy nowej drogi dostępu do cudzych danych.
- Osobny audyt `sql/041_AUDYT_MIGAWKI_EKWIPUNKU_READONLY.sql` wyłącznie z SELECT.
- Zaktualizowany identyfikator wdrożenia 060-e16 i widoczny numer etapu 16.
- Zestaw testów statycznych: `node tests/test-ashen-060-server-candidate.cjs`.

## Ważne ograniczenia
- **NIE uruchamiaj kandydata SQL w produkcyjnym Supabase.** Jest do inspekcji i przyszłych testów na osobnej bazie. Wymaga weryfikacji schematu oraz uprawnień w prawdziwym środowisku.
- Nie jest to jeszcze pełne serwerowe wyliczanie statystyk broni/afiksów/setów/artefaktów. Samo sprawdzenie poprawności JSON nie dowodzi poprawności obrażeń.
- Nie zastąpiono funkcji `ashen_publish_profile`, ani SQL 034, nie włączono jakości Mitycznej, nie zmieniono walk ani zapisów.
- Bramka klienta z etapu 15 nadal blokuje nowe jakości w PvP.

## Dalszy etap
1. Przenieść tabelę statystyk bazowych przedmiotów i transformacje afiksów do serwerowej, wersjonowanej specyfikacji.
2. Zweryfikować rekonstrukcję statystyk na zbiorze zapisów testowych.
3. Dopiero potem przygotować aktualizację RPC i test na izolowanym Supabase.
