# ASHEN v0.2.5 — PvP online: instalacja i testy

**UWAGA: otwórz WYŁĄCZNIE projekt Supabase ASHEN. Nie otwieraj ani nie zmieniaj ALLADYN.**

1. Zrób kopię zapasową lokalnych postaci (`Eksportuj zapis (JSON)`).
2. W Supabase ASHEN → SQL Editor → New query wklej CAŁY plik `multiplayer/supabase/003_online_pvp.sql`, następnie Run. Wcześniejszej tabeli `ashen_cloud_saves` nie usuwaj. Skrypt tworzy nowe tabele i funkcje, nie kasuje istniejących danych.
3. Wgraj pliki z paczki *TYLKO ZMIENIONE PLIKI* na GitHub do repozytorium ASHEN, zachowując ścieżki.
4. Otwórz stronę i zrób Ctrl+F5. W `☁ Konto online` zaloguj się i **Wyślij aktualną postać**. Wybrany slot lokalny zostaje przypisany do zalogowanego konta i odtąd automatycznie synchronizowany. Inne lokalne profile nie są synchronizowane.
5. W PvP → sekcji `PvP online` kliknij „Odśwież”. Na pierwszym koncie możesz nie zobaczyć przeciwników — potrzebne drugie konto Supabase Auth, z innym adresem e-mail i opublikowaną postacią (najlepiej w drugiej przeglądarce/profilu przeglądarki).
6. Na drugim koncie zaloguj się, stwórz postać, wyślij ją do chmury i odśwież listę. Wybierz przeciwnika, stocz walkę. Z pierwszego konta odśwież Wiadomości online: raport powinien być również u obrońcy, także jeśli był wylogowany podczas ataku.
7. Przetestuj trzeci atak na tę samą postać — powinien zostać zablokowany przez bazę. Limit resetuje się o północy **Europe/Warsaw**. Przetestuj prywatną wiadomość.

## Ważne ograniczenia wersji testowej
- Połączenie online wymaga Internetu i działającego Supabase. Lokalna gra działa nadal offline.
- Baza **rozstrzyga** walkę i egzekwuje limity; przeglądarka nie przesyła wyniku walki.
- Statystyki i wyposażenie są pobierane z publikowanego zapisu użytkownika. Ten etap **nie jest odporny na oszukiwanie** (zmodyfikowane klienty mogą opublikować zawyżone statystyki). Przed publicznym uruchomieniem potrzebne jest przeniesienie progresji i walidacji przedmiotów na serwer.
- Formuły walki po stronie bazy są uproszczoną adaptacją lokalnego silnika i **nie są jeszcze identyczne** z lokalnym PvP (np. modyfikatory obrażeń z atrybutów). Ten etap służy testowaniu infrastruktury.
- Konta online są przypisane do jednego wybranego slotu w danej przeglądarce. Zmienianie slotu i ręczne wysłanie nowej postaci zastępuje poprzednią postać w chmurze. Nie należy współdzielić jednego konta między testerami.
- Autopublikacja działa w przypadku zmian zapisanych przez grę, z krótkim opóźnieniem. Można ręcznie wymusić wysłanie w Konto online.
- Pobranie zapisu z chmury zastępuje aktywny slot lokalny z kopią zapasową tak jak w v0.2.4.1.
- Nie podawaj nikomu `sb_secret_` ani `service_role`. W grze używaj wyłącznie klucza `sb_publishable_` lub `anon`.
- W przypadku błędu `Could not find function...` odśwież schemat PostgREST w Supabase lub sprawdź wykonanie skryptu SQL.
