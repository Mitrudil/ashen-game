# ASHEN v0.3.3 — wiadomości, profile, ranking i odświeżanie zakładek

## Nowości

### 1. Samoczynne odświeżanie po wejściu w zakładkę
- Kliknięcie **Ekspedycje**, **Klany**, **Wiadomości**, **PvP**, **Gracze** uruchamia pobranie aktualnych danych online.
- Działa także przy ponownym kliknięciu aktywnej zakładki (wygodne na telefonie).
- Pozostałe zakładki i tak odczytują lokalny, bieżący stan gry przy każdym przejściu.

### 2. Nowa skrzynka wiadomości
- Lista wiadomości online i powiadomień z ekspedycji znajduje się od razu pod nagłówkiem i przełącznikiem Odebrane/Wysłane.
- Usunięto formularz nowej wiadomości ze skrzynki i przestarzały podgląd lokalnych wiadomości testowych.
- Zakończona ekspedycja generuje serwerowe powiadomienie dla uczestników, niezależnie od tego, czy byli online w momencie walki.
- Kliknięcie w powiadomienie pozwala otworzyć zapisany raport ekspedycji.
- Stare ukończone ekspedycje otrzymują powiadomienia podczas uruchomienia skryptu 011 (bez duplikatów).
- Powiadomienia można oznaczać jako przeczytane. Dostęp kontroluje serwer.

### 3. Nowa zakładka **Gracze**
- Ranking według opublikowanego online poziomu postaci.
- Wyszukiwanie po nicku (bez danych prywatnych i adresów e-mail).
- Karta postaci: nick, klasa, poziom i wizerunek zgodny z płcią/archetypem.
- Wysyłanie wiadomości prywatnych z profilu postaci (z zachowaniem dotychczasowego limitu serwerowego).
- Można otworzyć profil gracza również z zakładki **Klany**, zakładki PvP lub wiadomości od nadawcy.

### 4. Taktyki
- Wybór celu nie ma sensu przy jednym przeciwniku: panel taktyk ukrywa się dla pierwszych dwóch bossów.
- Panel taktyczny pozostaje dla grup, np. Trzech Braci Rdzy. Mechanizm walki i historyczne taktyki pozostają bez zmian.

## SQL

W projekcie ASHEN uruchom **tylko nowy** plik:
`multiplayer/supabase/011_profiles_and_expedition_inbox.sql`

Wymaga wcześniejszego wdrożenia v0.3.2, wraz z `009_timed_expeditions.sql` i `010_enable_expedition_scheduler.sql`.

**Nie uruchamiaj skryptu w projekcie ALLADYN.**

## Testy

1. Zaloguj Mitrudila i Kowala w dwóch różnych przeglądarkach.
2. Kliknij Ekspedycje bez ręcznego odświeżania strony: lista powinna pokazać aktualny skład i terminy.
3. Kliknij Klany: sprawdź przycisk **Profil** przy członku i otwórz jego kartę.
4. Na karcie napisz prywatną wiadomość. Odbiorca powinien ją zobaczyć w **Wiadomościach**.
5. Wygraj lub przegraj ekspedycję; przejdź do Wiadomości i otwórz raport z powiadomienia.
6. Sprawdź ranking i wyszukiwanie po nicku.

## Bez zmian

Nie ruszano systemu walk, sprzętu, levelowania, zapasów ekspedycyjnych, limitów aktywnych ekspedycji ani harmonogramu pg_cron. Nagrody z ekspedycji są wciąż odłożone na później.
