# ASHEN v0.4.8.7 — pełna gra

# ASHEN v0.4.8.7 — udostępnianie raportów PvP

**Aktualizacja z v0.4.8.6.** Wymagany SQL: `sql/026_public_pvp_reports.sql`.

## Co nowego
- W oknie raportu PvP: „Kopiuj link” i „Udostępnij”; serwer tworzy losowy token UUID dopiero na żądanie uczestnika walki.
- Publiczny widok `report.html?report=<token>` dla gości bez konta.
- Odczyt raportu przez bezpieczne RPC, bez identyfikatorów kont, całych snapshotów ani prywatnych zapisów.
- Raporty nie są publicznie indeksowane/listowane. Każdy, kto ma link, może go jednak przekazać dalej.
- Poprawiono wyświetlanie sumy zadanych obrażeń, z rezerwowym przeliczeniem z przebiegu rund; brakujących trafień/krytyków nie fałszujemy jako zero.
- Usunięto mylący komunikat o konieczności instalacji SQL 025 (zastąpiono informacją warunkową).
- Historia PvP w przeglądarce pokazuje do 40 pozycji, jeśli tyle zwróci serwer.

## Wymagana jednorazowa konfiguracja publicznych linków
Aby link działał u odbiorców, wypełnij `js/public-config.js`: 
- `url`: publiczny Project URL Supabase (https://...supabase.co)
- `key`: **tylko** publishable/anon key (NIE secret/service_role).

Klucz publishable/anon jest przeznaczony do aplikacji publicznych. Nie wpisuj żadnego klucza tajnego.
Nie przesyłaj klucza w samym adresie raportu. Po zmianie configu wrzuć plik na GitHub.

## Instalacja
1. W Supabase SQL Editor uruchom `sql/026_public_pvp_reports.sql`, po wykonaniu kopii zapasowej.
2. Na GitHub wrzuć `index.html`, `report.html`, `js/game.js`, `js/online.js`, `js/public-report.js`, `js/public-config.js` (z publiczną konfiguracją).
3. Wyczyść cache Ctrl+F5. Otwórz stary lub nowy raport, kliknij „Kopiuj link” i sprawdź go w oknie incognito.
4. W razie problemów nie wykonuj ponownie SQL 025; SQL 026 nie zmienia silnika walki.

## Ograniczenia
- Nie testowano RPC na rzeczywistym serwerze użytkownika. SQL należy uruchomić świadomie w Supabase.
- Nie ma jeszcze serwerowej walidacji wyposażenia ani mechaniki Z w PvP.
- Publiczne raporty pozostają dostępne, dopóki istnieje token w bazie; kasowanie tokenu można wykonać administracyjnie w razie potrzeby.
- Historia zwrócona przez serwer może być ograniczona przez istniejącą funkcję `ashen_online_reports`.


## Aktualizacja 0.4.8.8
Zobacz README_0488.md.


Historia aktualizacji: [CHANGELOG.md](CHANGELOG.md). Nowych plików README z numerami wersji już nie tworzymy.
