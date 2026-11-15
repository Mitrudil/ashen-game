# ASHEN v0.2.4 — uruchomienie kont i zapisu online (prywatny test)

## Co działa

- Rejestracja e-mailem i hasłem oraz logowanie w Supabase Auth.
- Jedna prywatna kopia zapisu gry na **jedno konto online**.
- Ręczny eksport aktywnej postaci do chmury oraz ręczny import do aktywnego profilu lokalnego.
- Osobny backup lokalny przed importem (klucz `...-before-cloud-load-v024`).
- Tylko zalogowany właściciel może odczytać/zapisać swoją kopię dzięki RLS.
- Wszystkie dotychczasowe lokalne postacie, historia, PvP i wiadomości pozostają aktywne w przeglądarce.

## Co NIE działa jeszcze online

Nie ma synchronizacji automatycznej, PvP między kontami, wiadomości między kontami, serwerowo naliczanych statystyk ani rankingów. Zapisy gry są nadal generowane przez przeglądarkę — nie wolno używać ich jako źródła prawdy w rywalizacji online. To przygotowanie uwierzytelniania i bezpiecznego przechowywania prywatnych kopii.

## Konfiguracja (bez opłat, bez publikowania gry)

1. Wejdź na https://supabase.com/ i utwórz **projekt Free**; nie wybieraj płatnej subskrypcji.
2. Otwórz **SQL Editor** swojego projektu i uruchom plik `multiplayer/supabase/002_cloud_saves.sql`.
3. W ustawieniach **Authentication → URL Configuration** ustaw adres opublikowanej gry jako Site URL. Dodatkowo dodaj go do Redirect URLs, jeśli korzystasz z potwierdzania e-mail. Wymagane jest **HTTPS**, a nie otwieranie lokalnego pliku `file://`.
4. W **Authentication → Providers → Email** zdecyduj, czy chcesz wymagać potwierdzenia e-mail. Na prywatnym etapie możesz założyć własne konta, a potem wyłączyć rejestrację nowych użytkowników w ustawieniach projektu. Dokładna nazwa ustawienia może się zmieniać.
5. W ustawieniach API projektu skopiuj **Project URL** oraz **publishable key** (lub starszy klucz `anon`). **Nigdy** nie kopiuj `service_role`, `sb_secret_...`, hasła bazy czy tokenów administracyjnych.
6. W grze kliknij przycisk **☁ Konto online**. Wklej URL i klucz publiczny (zapiszą się tylko lokalnie w Twojej przeglądarce), następnie utwórz konto lub zaloguj się.
7. Po potwierdzeniu e-mail zaloguj się, wybierz lokalną postać i naciśnij **↑ Wyślij aktualną postać**.
8. Aby przetestować pobieranie: wybierz aktywny profil lokalny (najlepiej nowy Tester), naciśnij **↓ Pobierz z chmury**, potwierdź operację. Gra wykona kopię poprzedniego lokalnego zapisu, wstawi kopię z chmury i przeładuje stronę.

## Bezpieczeństwo

- URL projektu i **publishable / anon** to dane publiczne. Bezpieczeństwo prywatnych kopii wymaga **RLS** w bazie.
- Hasła trafiają do Supabase Auth. Gra nie zapisuje haseł w localStorage i nie wymaga klucza administratora.
- Sesja logowania może być przechowywana w przeglądarce przez bibliotekę Supabase. Korzystaj z własnego komputera do testów.
- Kopia w chmurze **nadpisuje** poprzednią kopię na tym samym koncie, lecz lokalny zapis pozostaje bez zmian po wysłaniu.
- Import wymaga jawnego potwierdzenia i nadpisuje **tylko aktualny profil lokalny**. Nie pobieraj postaci bez świadomego wyboru profilu docelowego.
- Jeżeli połączenie z biblioteką CDN będzie zablokowane, tryb offline działa nadal.
- Konto online nie ogranicza liczby lokalnych postaci. Jedno konto przechowuje **jedną kopię** — w późniejszych wersjach zdecydujemy, czy jedna osoba może mieć więcej postaci online.

## Testy

- Brak konta / rozłączony projekt: wszystkie funkcje offline działają.
- Konto A wysyła postać; po wylogowaniu Konto B **nie może** zobaczyć jej zapisu.
- Konto A pobiera zapis do nowego testera: poprzedni zapis powinien mieć kopię; główna postać powinna zostać nietknięta.
- Konto A nadpisuje swój zapis: po odświeżeniu metadane zmieniają się; Konto B nadal widzi tylko swój zapis.
- Nigdy nie publikuj plików JSON z postaciami, haseł i kluczy secret.

**Zalecenie:** zanim zaczniesz testować chmurę, w grze na każdej ważnej postaci użyj Kryjówka → Pobierz kopię zapisu JSON.
