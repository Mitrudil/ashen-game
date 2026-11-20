# ASHEN 0.6.0 — etap 15: bramka zgodności PvP

## Co faktycznie zmieniono
- `js/ashen-060-pvp-contract.js`: sprawdza zapis ekwipunku, tożsamość identyfikatorów, prawidłowe schematy jakości, pojemność gniazd i podstawowy format migawki walki.
- Przed automatyczną synchronizacją klient sprawdza zgodność; jeśli zapis ma przedmiot `ashen-v06`, odrzuca publikację do starszego serwera zamiast wysłać mylące statystyki. Bramka odmawia publikacji także gdy ktoś ręcznie zmieni `modernDropsEnabled` na true.
- `sql/040_AUDYT_JAKOSCI_PVP_READONLY.sql`: audyt zbiorczy po stronie Supabase, tylko SELECT, nie dotyka danych ani funkcji.
- Numer wdrożenia w nagłówku: etap 15, znaczniki cache `060-e15`.

## Wynik audytu architektury
Silnik PvP SQL 034 konsumuje **gotowe dane** `attacks`, `attrs`, `armor`, `hp`, `acc`, `dodge` z `ashen_online_profiles.snapshot`, a nie oblicza statystyk z `inventory`. SQL 028 jedynie sprawdza części setów X/Y/Z względem `ashen_cloud_saves`. Dlatego nie można bezpiecznie włączyć Mitycznych przedmiotów tylko przez zmianę jakości na kliencie. Dla pełnej zgodności potrzebna będzie serwerowa rekonstrukcja statystyk wyposażenia i weryfikacja wartości w migawce przed zapisem.

## Jak używać
Wgraj paczkę aktualizacji do GitHub. Napis w nagłówku: „przebudowa 0.6.0 · etap 15”. Nie uruchamiaj SQL, nie włączaj nowych łupów. Skrypt SQL jest wyłącznie opcjonalnym audytem — po jego użyciu możesz przesłać zanonimizowane, zbiorcze wyniki.

## Czego ten etap NIE robi
Nie aktywuje nowych jakości ani artefaktów, nie zmienia walk, nie aktualizuje Supabase i nie stanowi anty-cheata. Kontrola klienta nie zastępuje weryfikacji danych na serwerze. Nie modyfikuje dotychczasowych przedmiotów.
