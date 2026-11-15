# ASHEN v0.3.6.1 — nielimitowane zapasy podczas testów

Wszystkie ekspedycje są **bezpłatne w zapasach**, bez względu na stan magazynu klanowego. Można wielokrotnie uruchamiać kolejne wyprawy do sprawdzania odznak i łupów.

**Bez zmian pozostają:** maksymalnie 2 aktywne wyprawy na klan, 1 aktywna wyprawa na organizatora, ograniczenia sumy poziomów i liczby graczy, okres zbiórki, zaproszenia i nagrody. Wyprawy nadal wymagają odpowiedniego składu.

## Instalacja
1. Wgraj zawartość paczki aktualizacyjnej do katalogu głównego repozytorium ASHEN.
2. W **osobnym projekcie Supabase ASHEN** uruchom **jedynie** `multiplayer/supabase/015_unlimited_test_expeditions.sql` (wymaga wcześniej wdrożonych migracji 001–014).
3. Odśwież grę klawiszami Ctrl+F5.

SQL 015 zastępuje tylko funkcję `ashen_expedition_create(integer)` i **nie pobiera zapasów** przy tworzeniu. Zachowuje dane i wcześniejsze raporty. Samo wgranie plików HTML/JS nie wystarczy — serwer nadal pobierałby zapasy bez SQL 015.

**Tryb testowy, nie do publikacji produkcyjnej.** Przy końcowym balansowaniu gry przywrócimy koszt zapasów.
