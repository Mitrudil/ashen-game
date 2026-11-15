# ASHEN v0.3.5 — indywidualne nagrody za bossów

Wersja bazuje na działającym ASHEN v0.3.4, nie zmienia mechaniki walk, zaproszeń, rekrutacji ani harmonogramu wypraw.

## Co nowego

- Każdy **uczestnik zwycięskiej** ekspedycji klanowej otrzymuje **własną** nagrodę — serwer zapisuje wynik osobno dla każdego konta.
- Gwarantowane nagrody: doświadczenie (EXP), kredyty oraz złom.
- Losowa szansa na jeden przedmiot pasujący do istniejącego katalogu wyposażenia.
- Premia +50% zasobów i EXP za **pierwsze zwycięstwo nad danym bossem** (per konto i boss).
- Nowy panel **🎁 Moje nagrody z ekspedycji**, z przyciskiem **Odbierz nagrodę** oraz listą ostatnich odebranych nagród.
- Odbiór daje prawdziwy przedmiot w Ekwipunku i zasoby postaci, a nie tylko tekst w raporcie.
- Identyfikator nagrody zapisuje się w postaci przed potwierdzeniem odbioru w Supabase, więc ponowienie żądania po utracie połączenia nie nalicza jej dwa razy.
- Nagrody indywidualne, nie ma wspólnego podziału przedmiotów ani rywalizacji o łup.

## Tabela testowa nagród

| Boss | EXP | Kredyty | Złom | Szansa na przedmiot |
| --- | ---: | ---: | ---: | ---: |
| Rzeźnik ze Złomowiska | 45 | 45 | 12 | 28% |
| Kanałowy Pożeracz | 80 | 90 | 22 | 42% |
| Trzej Bracia Rdzy | 125 | 140 | 36 | 58% |

Premia pierwszego zwycięstwa: +50% EXP, kredytów i złomu (zaokrąglenie do pełnych liczb). Losowe przedmioty korzystają z już istniejących typów i rzadkości; boss 1 daje przedmioty do rzadkiej jakości, bossowie 2–3 mogą dać także epickie i bardzo rzadko legendarne.

### Ważne ograniczenia tej wersji

- Nagrody są generowane tylko dla **nowych zwycięstw, już po uruchomieniu skryptu SQL 013**. Stare raporty są zachowane, ale nie otrzymują łupów wstecz.
- **Odbiór jest ręczny**. Walka może rozegrać się automatycznie, gdy gracz jest offline; po zalogowaniu nagroda czeka w zakładce Ekspedycje.
- Przed odbiorem aktywna lokalna postać musi być przypisana do zalogowanego konta w panelu ☁ Konto online. Nie odbieraj łupu na przypadkowym profilu testowym.
- Gra wciąż korzysta z lokalnych zapisów oraz synchronizacji w chmurze. To prototyp, **nie pełny serwerowo autorytatywny ekwipunek**. Przed zmianą przeglądarki poczekaj na synchronizację; nie przywracaj starej kopii postaci, bo może nie zawierać odebranych nagród.
- Przedmioty pochodzą na razie z istniejącego katalogu. Osobne unikatowe przedmioty przypisane do bossów zostawiamy na kolejny etap.

## Instalacja

1. Wgraj zawartość paczki aktualizacyjnej na GitHub (pliki bez dodatkowego katalogu nadrzędnego).
2. W SQL Editor **wyłącznie projektu Supabase ASHEN** uruchom **nowy** skrypt:
   `multiplayer/supabase/013_individual_boss_rewards.sql`
3. Nie uruchamiaj ponownie skryptów 001–012.
4. Odśwież grę przez Ctrl + F5.

## Test

1. Na dwóch kontach online (np. Mitrudil i Kowal) opublikuj/przypisz właściwe lokalne postaci.
2. Rozegraj **nową** zwycięską ekspedycję. Możesz skrócić zbiórkę.
3. Wejdź na każdym koncie do **☠ Ekspedycje → 🎁 Moje nagrody z ekspedycji**.
4. Sprawdź, że oba konta widzą **swoje** nagrody; przedmiot może wypaść tylko jednemu z graczy.
5. Odbierz nagrodę na każdym koncie; sprawdź kredyty, złom, EXP i Ekwipunek.
6. Ponownie odśwież grę / kliknij odbiór: drugi raz nie można przyznać tej samej nagrody.
7. Powtórz walkę z tym samym bossem: premia za pierwsze zwycięstwo nie powinna pojawić się ponownie.

## Zmodyfikowane pliki

- `index.html`
- `js/game.js`
- `js/expeditions.js`
- `css/style.css`
- `multiplayer/supabase/013_individual_boss_rewards.sql`

Systemy ALLADYN nie są w żaden sposób zmieniane.
