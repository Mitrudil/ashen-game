# ASHEN v0.3.6.2 — odznaki wyłącznie dla organizatora i nowe grafiki

## Zasada odznak
- Odznakę za bossa otrzymuje **tylko organizator zwycięskiej ekspedycji**, raz na bossa i konto.
- Uczestnicy w dalszym ciągu dostają własne: EXP, kredyty, złom i losowe łupy.
- Premia +50% za osobiste pierwsze zwycięstwo nadal przysługuje uczestnikom; jest odrębna od odznaki.
- Na razie NIE ma wymogu ostatecznego ciosu. Rozważymy to po rozbudowie balansu.
- Nowy SQL naprawia odznaki przyznane wcześniej: usuwa odznaki osobom, które tylko dołączyły, oraz przyznaje organizatorom za wcześniej wygrane wyprawy.
- Historyczne nagrody i raporty pozostają bez zmian.

## Grafika odznak
Nowe, graficzne odznaki zapisane w `assets/badges/`: Złomowisko, Pożeracz, Trzej Bracia Rdzy. Pojawiają się w profilach graczy i Ekspedycjach.

## Aktualizacja
1. Wgraj zawartość paczki aktualizacyjnej do katalogu głównego repozytorium ASHEN.
2. W SQL Editor **wyłącznie projektu ASHEN**, uruchom `multiplayer/supabase/016_organizer_badges.sql`.
3. Odśwież grę przez Ctrl+F5 i sprawdź odznaki na kontach organizatora i uczestnika.

Nie uruchamiaj ponownie SQL 014 ani 015. Wcześniejszy tryb testowy z nieograniczonymi zapasami pozostaje aktywny.

## Zakres zmian
`index.html`, `js/game.js`, `js/players.js`, `js/expeditions.js`, `css/style.css`, `assets/badges/*.webp`, `multiplayer/supabase/016_organizer_badges.sql`, `README.md`.
