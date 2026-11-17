ASHEN v0.4.9.24 — korekta audytu historycznych raportów.

Po aktualizacji GitHub odśwież Ctrl+F5. Nie trzeba uruchamiać SQL.

# ASHEN v0.4.9.23 — audyt PvP po wdrożeniu SQL 034

**Wdrożony silnik: SQL 034, 15/15 Mistrzostw Z.** Ta aktualizacja GitHub nie wymaga żadnej migracji Supabase, nie zmienia mechaniki obrażeń ani limitów walk.

## Co nowego

- Panel PvP → **Audyt PvP · 15 Mistrzostw Z i spójność raportów**: liczba raportów per wersja serwera, 15 rodzin, podstawowe sprawdzenie PŻ, statystyk i limitów zdolności.
- Przycisk **Kopiuj podsumowanie audytu**, który przekazuje wyłącznie dane z raportów pobranych przez aktualnie zalogowane konto.
- Trzy zapytania SQL do osobnego uruchomienia w Supabase SQL Editor (wyłącznie SELECT, bez funkcji i zapisu):
  - `sql/035_AUDYT_PVP_SILNIKI_READONLY.sql` — liczba raportów z podziałem na wersje.
  - `sql/036_AUDYT_PVP_AKTYWACJE_READONLY.sql` — rzeczywiście zapisane aktywacje wszystkich rodzin Z.
  - `sql/037_AUDYT_PVP_SPÓJNOŚĆ_READONLY.sql` — zagregowane sygnały braków i niespójności.

## Test praktyczny

1. Wgraj paczkę GitHub; odśwież stronę (w razie potrzeby Ctrl+F5).
2. Otwórz PvP online → odśwież graczy i raporty → audyt jest już widoczny (nie trzeba go rozwijać).
3. Skopiuj podsumowanie. Brak aktywacji konkretnego Z nie dowodzi awarii — muszą wystąpić właściwe warunki w prawdziwej walce.
4. W Supabase uruchom osobno 035, 036, 037 i prześlij wyniki CSV. Każdy skrypt jest krótki (poniżej 95 linii) i służy tylko do odczytu.

**Ograniczenia:** Panel widzi tylko historię zwracaną przez konto (`ashen_online_reports`) i nie powtarza serwerowego losowania; SQL czyta całą tabelę, ale nie zwraca nazw graczy, UUID ani treści raportów. Kontrole spójności są diagnostyczne, a nie pełnym matematycznym dowodem poprawności każdej walki. Model publikowania profilu pozostaje częściowo zależny od danych klienta.

## Poprawka 0.4.9.23
- Audyt nie zwija się podczas odświeżania. Przycisk kopiowania jest od razu widoczny.
- Przy aktualizacji GitHub należy **nadpisać** także `index.html`, `js/game.js` i `js/online.js`. Sprawdź wersję w nagłówku strony oraz wykonaj Ctrl+F5.


## ASHEN v0.4.9.25 — tymczasowo bez limitu PvP
SQL 038 wyłącza blokadę 2 ataków dziennie w funkcji `ashen_online_attack(uuid)`; bez zmian w walce i raportach. Aby przycisk ataku nie był blokowany, potrzebna jest też aktualizacja GitHub. SQL do przywrócenia limitu pozostaje w `sql/`, lecz nie uruchamiać go podczas testów.


## v0.4.9.26 — prywatny test Z w PvP
Panel pojawia się tylko kontom jawnie dopuszczonym przez administratora w SQL 039.
Skrypt SQL 039 należy najpierw przetestować w transakcji, a dopiero potem wdrożyć; nie włącza sam testu żadnemu graczowi.
Konfiguracja Mistrzostwa Z jest nakładana tylko na migawkę walki, nie na zapis w chmurze.
