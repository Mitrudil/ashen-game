# ASHEN 0.2.0 — fundament multiplayer

## Obecny stan
- Gra pozostaje całkowicie offline i bezpłatna. Żadnych kont, usług ani serwera nie uruchomiono.
- Profile testowe są **lokalnymi, izolowanymi zapisami w jednej przeglądarce**. Pozwalają przygotować postacie, ale nie symulują bezpiecznego PvP ani wieloosobowości przez sieć.
- `js/game.js` nadal wykorzystuje dotychczasowy klucz `ashen-save-v010`, aby nie stracić wcześniejszej postaci. Każdy profil ma dodatkową kopię pod `ashen-dev-slot-v020:<id>`. Przełączanie profilów odświeża stronę.
- SQL w `supabase/001_schema.sql` to **projekt do późniejszego wdrożenia**, nie włączona baza. Sam schemat jest niewystarczający do bezpiecznego multiplayera.

## Docelowy podział zaufania
1. Klient HTML/CSS/JS wyświetla postać, wysyła intencje działań i odbiera raporty.
2. Supabase Auth uwierzytelnia konta testerów. Rejestracja publiczna wyłączona.
3. Funkcje serwerowe sprawdzają własność postaci, zasoby, limity, losowanie, nagrody, wyposażenie i kolejność akcji.
4. PostgreSQL przechowuje postacie i historie; transakcje ograniczają podwójne nagrody.
5. Klient nie ma uprawnień do modyfikowania `characters.state` ani wstawiania `pvp_reports` bezpośrednio.

## Następne kroki
- 0.2.1: połączenie z prywatnym projektem Supabase, kontrolowany import istniejącego lokalnego zapisu, identyfikatory postaci i logowanie; dopiero po implementacji API serwerowych.
- 0.2.2: lista postaci i profile do odczytu, bez wycieku prywatnego ekwipunku czy zapisu.
- 0.2.3: deterministyczne testy silnika walk i server-authoritative PvP. Nigdy nie przyjmować wyniku walki wyliczonego przez klienta.
- 0.2.4+: raporty, rankingi, klany i ekspedycje.

## Bezpieczeństwo i kopie
- Lokalny tryb developerski nie jest mechanizmem kontroli dostępu. Nie publikuj jako pełnego multiplayera.
- Przed przełączeniami urządzeń eksportuj JSON z każdej postaci oddzielnie.
- Nie zamieszczaj kluczy service_role lub haseł w repozytorium, JavaScript ani HTML.
- Wszystkie darmowe limity usług należy sprawdzić przy faktycznym uruchomieniu.
