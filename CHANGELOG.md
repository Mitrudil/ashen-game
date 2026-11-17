## v0.4.9.24 — audyt historycznych raportów PvP
- Starsze raporty bez totals nie są błędnie oznaczane jako uszkodzone.
- W audycie osobno pokazano liczbę raportów z SQL 034 i starszych wersji.
- Spójność liczników i PŻ jest weryfikowana tylko dla SQL 034.
- Gdy brak raportów SQL 034, panel wskazuje brak danych do walidacji rzeczywistej walki.
- Bez zmian w silniku walki i SQL.

# ASHEN — CHANGELOG

## v0.4.9.23 — poprawka aktualizacji interfejsu i audytu
- Audyt PvP jest stałym panelem: nie zamyka się podczas odświeżania raportów ani ponownego renderowania gry.
- Przycisk „Kopiuj podsumowanie audytu” jest stale dostępny w zakładce PvP online.
- Zmieniono identyfikator wersji i parametry cache skryptów z 0.4.9.22 na 0.4.9.23.
- Zaktualizowano pozostałe opisy stanu SQL 029 w diagnostyce; SQL 034 działa już w produkcji.
- Brak zmian SQL i mechaniki walki.

## v0.4.9.22 — audyt końcowy serwerowego PvP
- Produkcyjny SQL 034 obsługuje 15/15 Mistrzostw Z (wdrożenie potwierdzone wcześniej w Supabase). Bez nowej migracji.
- Panel audytu rozróżnia cztery wersje silnika SQL029/032/033/034, liczy wszystkie 15 zdolności i sygnalizuje oczywiste sprzeczności raportów.
- Dodano kopiowanie podsumowania oraz trzy krótkie zapytania wyłącznie SELECT do audytu całej tabeli Supabase.
- Poprawiono przestarzałe opisy SQL 029/033 w PvP, raportach i Laboratorium.
- Audyt nie jest dowodem pełnej poprawności obliczeń ani zabezpieczeniem anty-cheat.


## v0.4.9.21
- SQL034: kandydat trzech ostatnich Mistrzostw Z (Tropicielski, Nomadyczny, Wszechstronny) na podstawie wdrożonego SQL033.
- Uwzględniona produkcyjna poprawka statystyk `totals.damage` obu uczestników.
- Dołączony izolowany test kompilacji (BEGIN/ROLLBACK) w krótkich fragmentach.
- Numer wersji i komunikat Laboratorium zaktualizowane do stanu SQL033 12/15.
- Żadna migracja serwerowa nie została wykonana przez ten pakiet.

## v0.4.9.20 — kandydat SQL033: Elastyczny, Odporny, Refleksyjny

- SQL033 dodaje trzy efekty PvP ponad SQL032, zachowuje poprzednie 9 Z, wiadomości, raporty i limit ataków.
- Elastyczny: +8% kolejnego celnego ataku po uniku (odstęp 2 rund).
- Odporny: raz na walkę -40% dodatkowej części pierwszego krytyka przeciwnika.
- Refleksyjny: +4 pkt przebicia pancerza przy kolejnym trafieniu po uniku, max raz na rundę.
- Osobny test transakcyjnej kompilacji z ROLLBACK, kontrola preflight i pliki dzielone.
- Opisy w Laboratorium dostosowane do stanu 9/15 Z w produkcyjnym PvP.
- SQL033 **niewdrożony**; wymaga testów obliczeń przed produkcją.


## ASHEN v0.4.9.25 — tymczasowo bez limitu PvP
SQL 038 wyłącza blokadę 2 ataków dziennie w funkcji `ashen_online_attack(uuid)`; bez zmian w walce i raportach. Aby przycisk ataku nie był blokowany, potrzebna jest też aktualizacja GitHub. SQL do przywrócenia limitu pozostaje w `sql/`, lecz nie uruchamiać go podczas testów.
