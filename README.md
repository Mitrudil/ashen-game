# ASHEN — Kroniki Upadku · v0.4.9.8

Przeglądarkowa gra postapokaliptyczna. Obecna wersja zawiera m.in. walki lokalne, PvP online, Ekspedycje, ekwipunek, sety X/Y/Z i laboratorium testowe.

## Instalacja aktualizacji 0.4.9.8

Wgraj na GitHub pliki `index.html`, `js/game.js`, `README.md` i `CHANGELOG.md` z paczki aktualizacyjnej. Nie wykonuj SQL dla tej wersji i nie nadpisuj istniejącego `js/public-config.js` (zawiera publiczne ustawienia raportów).

## Nowości

- Laboratorium dodaje trzy kontrolowane próby Mistrzostwa Z: **Elastyczny — Kontratak**, **Refleksyjny — Przebicie po uniku**, **Nomady — Instynkt**.
- Set akcesoriów `accessory_observant` został nazwany zgodnie z prefiksem **Spostrzegawczy** (w nazwach przedmiotów może występować forma **Spostrzegawcza**); **Tropiciela** to oddzielny sufiks akcesoriów. Identyfikatory i działanie mechaniki pozostają bez zmian.
- Nadal nie publikujemy przedmiotów wygenerowanych w Laboratorium do zwykłego PvP online.

## Historia i migracje

Szczegółowa historia jest w `CHANGELOG.md`. Folder `sql/` zawiera historyczne migracje i nie powinien być czyszczony. Wersja 0.4.9.8 nie wymaga SQL.

## Raporty publiczne

Własna instalacja wymaga adresu projektu Supabase i wyłącznie klucza publishable/anon w `js/public-config.js`. Nigdy nie umieszczaj tam klucza secret/service_role. Istniejąca konfiguracja zostaje zachowana przy tej aktualizacji.

## Testy i ograniczenia

Wprowadzono testy laboratoryjne offline, ale nowe scenariusze wymagają potwierdzenia w przeglądarce. Obecna synchronizacja statystyk do serwera wymaga przed publicznym uruchomieniem dodatkowej walidacji po stronie Supabase. Lokalne próby Z nie potwierdzają działania efektów w PvP online.
