ASHEN v0.4.3.4 — EKSPEDYCJE SOLO / WSPOLNA PULA NAGROD

WYMAGANE: zainstalowana v0.4.3.3 wraz z migracjami SQL 020 i 021.

INSTALACJA (w tej kolejnosci):
1. Zrob kopie zapasowa bazy w Supabase.
2. Supabase -> SQL Editor: uruchom 022_solo_expeditions_shared_rewards.sql.
3. GitHub: podmien index.html i js/expeditions.js.
4. Odczekaj na opublikowanie strony i wczytaj gre ponownie.

ZMIANY:
- Kazdy boss dopuszcza 1–5 graczy; bossa NIE oslabiamy dla solo.
- Organizator moze skrocic zbiorke bedac jedynym uczestnikiem.
- Automat nie anuluje juz ekspedycji za zbyt maly sklad.
- Za zwyciestwo jest jedna pula XP/kredytow/zlomu, dzielona rowno.
- Reszta z dzielenia rozdzielana jest wedlug kolejnosci dolaczenia.
- Losowanie przedmiotu jest jedno na cala zwycieska ekspedycje;
  item (unikat albo zwykly) moze dostac tylko organizator.
- Jednorazowe indywidualne premie za pierwsze zwyciestwo sa zachowane
  poza pula podstawowa. Odznaki nadal dostaje tylko organizator.
- Nie modyfikujemy starszych wyplat, zapisow postaci ani ekwipunku.
- Niekonczace sie ekspedycje z nieprawidlowym skladem (brak graczy lub
  przekroczony limit sumy poziomow) pozostaja otwarte do korekty;
  scheduler wypisuje ostrzezenie zamiast je anulowac.

TESTY:
A. Utworz ekspedycje solo, skroc zbiorke i sprawdz walke w harmonogramie.
B. Utworz ekspedycje we dwoje i porownaj laczne wyplaty do solo.
C. Sprawdz, ze uczestnik nie otrzymuje przedmiotu nawet przy unikatowym losie.
D. Sprawdz odznake organizatora i brak mozliwosci anulowania.

WAZNE: Nie testowano na zywym Supabase. Zrob kopie i sprawdz we wlasnej bazie.
