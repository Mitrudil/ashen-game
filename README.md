# ASHEN v0.3.2 — czasowe ekspedycje i zaproszenia checkboxami

Wersja rozwija testowane v0.3.1, zachowuje dwa sloty na klan, zapasy, poziomy, taktyki i raporty.

**Nowości:** lista wszystkich członków do zaproszenia w kwadracikach, zbiorcze zaproszenia, czas zbiórki (boss 1: 1h, boss 2: 1h30, boss 3: 2h; architektura do 8h dla przyszłych bossów), automatyczny start serwerowy co minutę oraz wcześniejsze zamknięcie rekrutacji przez organizatora przy co najmniej 2 osobach.

**Ważne:** Automatyczne walki wymagają uruchomienia dwóch skryptów SQL w projekcie ASHEN w kolejności: `009_timed_expeditions.sql`, potem `010_enable_expedition_scheduler.sql`. Bez 010 harmonogram nie zadziała, nawet jeśli aplikacja pokazuje czas. Nie wkładaj klucza secret/service_role do przeglądarki.

Jeśli termin minie bez minimum dwóch zatwierdzonych graczy, serwer anuluje zbiórkę bez walki (zapasy nie są zwracane). Jeśli nastąpi błąd rozliczenia, ekspedycja pozostaje otwarta i serwer spróbuje ponownie; sprawdzaj logi. Dokładność startu: ok. 1 minuta po terminie. Zakończenie zbiórki wcześniej nie oznacza natychmiastowej walki w przeglądarce, tylko prośbę do harmonogramu.

**Migracja:** plik 009 zachowuje raporty i aktywne ekspedycje. Trwające zbiórki dostają termin liczony od chwili ich utworzenia, więc starsze mogą rozegrać się na pierwszym przebiegu harmonogramu. Jeśli wolisz, dokończ stare wyprawy przed aktualizacją. Stare skrypty 006–008 nie mogą być uruchamiane ponownie po tej migracji.

**Limit 2 ekspedycji na klan** pozostaje. Pomysł „co najmniej 1 własna ekspedycja dziennie na gracza” zapisujemy do dalszego projektu wraz z systemem uprawnień organizatora; nie zwiększamy jeszcze limitu.
