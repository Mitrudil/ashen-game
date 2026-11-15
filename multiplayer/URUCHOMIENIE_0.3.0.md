# ASHEN 0.3.0 — jak uruchomić grafiki bossów i taktykę ekspedycji

## 1. Wgraj pliki gry
Podmień pliki z tej wersji na serwerze / hostingu gry.

Najważniejsze nowe lub zmienione pliki:
- `index.html`
- `css/style.css`
- `js/game.js`
- `js/expeditions.js`
- `assets/bosses/boss-01-rzeznik.webp`
- `assets/bosses/boss-02-pozeracz.webp`
- `assets/bosses/boss-03-tarczownik.webp`
- `assets/bosses/boss-03-mechanik.webp`
- `assets/bosses/boss-03-strzelec.webp`
- `multiplayer/supabase/007_expedition_tactics_and_boss_art.sql`

## 2. Supabase — aktualizacja z 0.2.9 / 0.2.9.1
Jeśli ekspedycje klanowe już działają, w SQL Editor uruchom tylko:
- `multiplayer/supabase/007_expedition_tactics_and_boss_art.sql`

Ten plik:
- dodaje kolumnę `tactic` do ekspedycji,
- dodaje RPC do zmiany taktyki,
- aktualizuje dane bossów o grafiki,
- rozszerza silnik walki o wybór strategii drużyny.

## 3. Supabase — instalacja od zera
Jeśli to nowy projekt ASHEN, wykonaj kolejno:
1. `002_cloud_saves.sql`
2. `003_online_pvp.sql`
3. `005_clans.sql`
4. `006_clan_expeditions.sql`
5. `007_expedition_tactics_and_boss_art.sql`

## 4. Jak testować
1. Zaloguj 2+ osobne konta online.
2. Na każdym koncie opublikuj postać online.
3. Utwórz klan albo dołącz do istniejącego.
4. Lider lub oficer przechodzi do **☠ Ekspedycje**.
5. Tworzy wyprawę na jednego z 3 bossów.
6. Sprawdza, czy na karcie bossa i w aktywnej wyprawie widać grafikę.
7. Ustawia różne taktyki wyprawy.
8. Pozostali członkowie dołączają do składu.
9. Lider / oficer klika **Rozpocznij walkę z bossem**.
10. Po chwili raport powinien być widoczny dla całego klanu razem z informacją o taktyce.

## 5. Co sprawdzić ręcznie
- poprawne wyświetlanie grafik wszystkich bossów,
- osobne grafiki 3 Braci Rdzy,
- zmianę taktyki przez lidera / oficera,
- brak możliwości zmiany taktyki po rozliczeniu wyprawy,
- wpływ taktyki na dobór celów w raporcie,
- otwieranie starszych raportów,
- brak regresji w tworzeniu i dołączaniu do wypraw.

## 6. Aktualne ograniczenia
- brak nagród i łupów,
- brak ekranu tabeli łupów / ekonomii bossów,
- nadal tylko 3 pierwszych bossów,
- balans walk dalej jest testowy.
