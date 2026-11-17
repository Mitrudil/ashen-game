# ASHEN — CHANGELOG

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
