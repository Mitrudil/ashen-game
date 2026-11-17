# ASHEN v0.4.9.26 — serwerowy tryb testowy Z

Wszystkie testy realnych walk działają na aktualnym silniku SQL 034. SQL 039 dodaje osobne, administracyjne nadpisanie jednej flagi Z na *migawce walki*, bez zmiany zapisanego ekwipunku. **To mechanizm wyłącznie dla dwóch kont testowych** i nie powinien pozostać aktywny po rozpoczęciu normalnej rozgrywki.

## Instalacja w bezpiecznej kolejności

1. Zachowaj eksport obecnej `public.ashen_online_attack(uuid)` — SQL 038 mógł już wyłączyć limit, a cofanie zmian musi zachować aktualną wersję funkcji.
2. W Supabase SQL Editor uruchom `sql/039_PROBA_BEZ_WDROZENIA_ROLLBACK.sql` (81 linii). Ostatnia instrukcja **ROLLBACK**. Jeśli zwróci błąd, nie wdrażaj właściwej migracji; prześlij komunikat.
3. Po udanym teście uruchom `sql/039_TEST_Z_TYLKO_ADMIN_KANDYDAT.sql` (81 linii), kończy się **COMMIT** i tworzy tabelę z RLS oraz RPC. Nie przyznaje jeszcze nikomu testowej premii.
4. **Jeżeli** Mitrudil i Kowal to Twoje dwa konta, uruchom `sql/039_DOPUSC_DWA_KONTA_TESTOWE.sql` (19 linii). Skrypt odmawia pracy, jeśli nie znajdzie dokładnie jednej postaci o każdej nazwie. Sprawdź otrzymane ID kont i nazwy.
5. Uruchom `sql/039_KONTROLA_READONLY.sql` (6 linii): oczekiwane `OK`, `konta_uprawnione=2`, `konta_z_wlaczonym_z=0`.
6. Wgraj aktualizację na GitHub, sprawdź nagłówek v0.4.9.26. Panel `Serwerowy test Mistrzostw Z` będzie widoczny wyłącznie po zalogowaniu na dopuszczone konto i odświeżeniu PvP online.
7. Wybierz rodzinę → `Zastosuj do walk online` → stocz walkę. **Uwaga**: istniejące realne premie zestawowe nadal działają; wybierasz dodatkowe testowe Z. Raport powinien zawierać oznaczenie `WALKA TESTOWA Z` i `testZMode`.
8. Po testach użyj `Wyłącz test Z` na obu kontach lub administracyjnego `sql/039_WYLACZ_TRYB_TESTOWY.sql` (4 linie).

## Zabezpieczenia

- Sam zapis wyposażenia i funkcja publikacji nie są modyfikowane; walidacja setów SQL 028 pozostaje w mocy.
- Zwykły użytkownik nie może dopisać się do listy testerów ani wybrać Z, ponieważ dostęp nadawany jest wyłącznie w SQL Editor, a tabela ma aktywne RLS i brak bezpośrednich uprawnień.
- Konta z listy mogą zmienić tylko *własną* rodzinę, przez funkcję RPC.
- Skrypt nie usuwa raportów i nie zmienia mechaniki zadawania obrażeń.
- SQL 039 nie zmienia obecnego ustawienia limitu dziennego; zachowuje istniejącą wersję `ashen_online_attack`, także jeśli wcześniej wykonano SQL 038.
- Nie uruchamiaj skryptu wdrożeniowego bez pomyślnego testu z `ROLLBACK`.
