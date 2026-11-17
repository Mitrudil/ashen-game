# ASHEN v0.5.0 — spójność ekwipunku i X/Y/Z

- `statsOf()` dolicza bazowe bonusy atrybutów przedmiotu obok prefiksów i sufiksów. Dotyczy Postaci, Ekwipunku, porównania oraz migawki online. **Może zmienić statystyki i balans po publikacji postaci.**
- Szczegóły posiadanego i założonego przedmiotu pokazują źródła bonusu (model, prefiks, sufiks).
- Planer i katalog rodzin korzystają z jednej rzeczywistej formuły `evolutionSetFromQuality()` zamiast deklaracji projektowych. Prawidłowe etykiety X/Y/Z, punkty jakości do kolejnego poziomu, zaokrąglenie prezentacji bez zmian w matematyce walki.
- Usunięto nieaktualny opis, że tylko 3 z 15 Mistrzostw Z działają online.
- **Brak zmian w SQL**, zadawaniu obrażeń, progach X/Y/Z lub zapisanych przedmiotach.
- Po instalacji ponownie opublikuj profile testowe w Supabase i porównaj statystyki; nowe PŻ mogą się różnić, jeśli wyposażenie ma bazową Wytrzymałość.

## v0.4.9.28
- Naprawa zamykania raportu PvP po przełączeniu karty przeglądarki: TOKEN_REFRESHED/ponowne potwierdzenie tej samej sesji Supabase nie resetuje widoku online.
- Raport pozostaje otwarty podczas nawigacji i nie jest zerowany przez wybór wiadomości; wylogowanie lub zmiana konta czyści raport.
- Zachowanie raportu przy zawieszeniu karty (pagehide); bez zmian SQL i walki.

## v0.4.9.27
- Okno raportu PvP jest renderowane niezależnie od zakładki. Można je schować i ponownie otworzyć z nagłówka.
- Zapis otwartego raportu w sessionStorage zabezpiecza go przy przeładowaniu karty, w ramach tego samego konta.
- Zachowywanie pozycji przewijania i rozwiniętych szczegółów rund przy odświeżeniu UI.
- Bez zmian SQL ani zasad walki.

## 0.4.9.26 — prywatne testy Mistrzostw Z w serwerowym PvP
- Panel wyboru testowego Z tylko dla kont dopuszczonych przez administratora.
- Nowa migracja SQL039: jawna allowlista, RLS, testowy override wyłącznie w trakcie walki.
- Osobny skrypt nadania dostępu Mitrudil i Kowal oraz awaryjne wyłączenie.
- Brak zmian w mechanice X/Y/Z, zapisach ekwipunku i normalnej walidacji profili.

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
