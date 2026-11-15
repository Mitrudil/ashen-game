# ASHEN v0.3.6 — odznaki bossów i unikatowe łupy

Aktualizacja rozwija v0.3.5, nie zmienia zasad walk, organizacji ekspedycji, rekrutacji, zaproszeń ani harmonogramu.

## Odznaki pogromcy — nagroda gwarantowana tylko za pierwsze zwycięstwo

Każda postać/konto gracza otrzymuje odznakę **jeden raz za pierwsze wygranie walki z danym bossem**:

| Boss | Odznaka |
|---|---|
| Rzeźnik ze Złomowiska | Pogromca Złomowiska |
| Kanałowy Pożeracz | Łowca Kanałowego Pożeracza |
| Trzej Bracia Rdzy | Zwycięzca Trzech Braci Rdzy |

- Odznaki widoczne w **Ekspedycjach** oraz w **publicznym profilu gracza** (otwieranym z rankingu lub klanu).
- Odznaki zapisuje Supabase, więc nie można uzyskać ich ponownie przez odświeżanie strony ani odbiór kolejnych nagród.
- **Odznaki są przyznawane automatycznie** przy pierwszej wygranej — nie trzeba klikać odbioru nagrody.
- Gracze, którzy w wersji 0.3.5 otrzymali `first_clear`, dostaną odznaki także za te wcześniejsze zwycięstwa, dzięki migracji SQL.
- Premia **+50% EXP, kredytów i złomu za pierwszą wygraną** pozostaje bez zmian. Kolejne wygrane nie dają ponownie tej premii.

## Unikatowe przedmioty — mogą wypadać podczas każdej wygranej

| Boss | Szansa na łup unikatowy (łącznie) | Pula |
|---|---:|---|
| Rzeźnik | 8% | Tasak Rzeźnika, Hak Rozpruwacza, Płyta ze Złomowiska |
| Pożeracz | 6% | Zatruty Kieł Pożeracza, Skóra Skażonego Łowcy, Oko z Głębin |
| Trzej Bracia | 5% | Gwoździarka Mechanika, Pancerz Braci Rdzy, Karabin Ostatniego Brata |

- Każdy uczestnik ma osobne losowanie — również przy powtórnym pokonywaniu bossa.
- Unikat zastępuje zwykły losowy przedmiot w danym rozdaniu; **maksymalnie jeden przedmiot na wygraną**.
- Jeśli nie wypadnie unikat, dalej działa standardowa szansa na zwykły przedmiot z wersji v0.3.5.
- Przedmioty są realnymi typami ekwipunku i po odbiorze trafiają do magazynu postaci.
- Ich statystyki są testowe i uwzględniają bieżący model obrażeń/obrony. Nie ma jeszcze nowych efektów DOT jak krwawienie/zatrucie — takie efekty wymagają oddzielnych zmian w silniku walki.
- Unikatowe przedmioty losują się **tylko przy nowo rozstrzygniętych walkach po instalacji SQL 014**. Nie dopisujemy ich do już odebranych nagród.

## Instalacja

1. Wgraj zawartość paczki **Aktualizacja GitHub** do katalogu głównego repozytorium ASHEN (nie wrzucaj dodatkowego folderu nadrzędnego).
2. W **Supabase projektu ASHEN** otwórz SQL Editor i uruchom **tylko nowy** skrypt:
   `multiplayer/supabase/014_boss_badges_and_unique_loot.sql`
3. Odśwież grę Ctrl + F5.

**Wymagane:** wcześniej wdrożone SQL 013 i pozostałe wcześniejsze migracje. Nie uruchamiaj ponownie SQL 001–013. Nie uruchamiaj tego skryptu w ALLADYN.

## Test

1. Zaloguj się na konto, które pokonało już bossa po instalacji SQL 013. Sprawdź panel **Odznaki pogromcy** i profil gracza.
2. Rozegraj kolejny raz tego samego bossa: odznaka nie powinna się dublować, a premia `first_clear` nie może wrócić.
3. Pokonaj nowego bossa pierwszy raz: nowa odznaka powinna pojawić się automatycznie.
4. Rozegraj kilka kolejnych walk: unikat jest losowy i nie musi wypaść w pierwszym teście.
5. Po losowaniu unikatu sprawdź jego nazwę w **Moje nagrody**, odbierz go i otwórz **Ekwipunek**.

## Zmodyfikowane pliki

- `index.html`
- `js/game.js`
- `js/expeditions.js`
- `js/players.js`
- `css/style.css`
- `multiplayer/supabase/014_boss_badges_and_unique_loot.sql`

Nie zmieniano pozostałych modułów i projektu ALLADYN.
