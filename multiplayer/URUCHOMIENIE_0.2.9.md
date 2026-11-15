# ASHEN 0.2.9 — jak uruchomić ekspedycje klanowe

## 1. Wgraj pliki gry
Podmień pliki z tej wersji na serwerze / hostingu gry.

Najważniejsze nowe lub zmienione pliki:
- `index.html`
- `css/style.css`
- `js/game.js`
- `js/expeditions.js`
- `multiplayer/supabase/006_clan_expeditions.sql`

## 2. Supabase — wymagane wcześniejsze SQL
Jeśli jeszcze nie były uruchamiane w projekcie **ASHEN**, wykonaj kolejno:
1. `002_cloud_saves.sql`
2. `003_online_pvp.sql`
3. `005_clans.sql`

## 3. Supabase — nowy SQL dla 0.2.9
W SQL Editor uruchom:
- `multiplayer/supabase/006_clan_expeditions.sql`

## 4. Jak testować
1. Zaloguj 2+ osobne konta online.
2. Na każdym koncie opublikuj postać online.
3. Utwórz klan albo dołącz do istniejącego.
4. Lider lub oficer przechodzi do **☠ Ekspedycje**.
5. Tworzy wyprawę na jednego z 3 bossów.
6. Pozostali członkowie dołączają do składu.
7. Lider / oficer klika **Rozpocznij walkę z bossem**.
8. Po chwili raport powinien być widoczny dla całego klanu.

## 5. Co sprawdzić ręcznie
- utworzenie wyprawy,
- dołączanie i opuszczanie składu,
- blokadę 1 aktywnej wyprawy na klan,
- limit 2–5 graczy,
- uruchomienie walki i zapis raportu,
- otwieranie starszych raportów.

## 6. Aktualne ograniczenia
- brak nagród za bossów,
- brak rozwoju rajdów / lokacji klanowych,
- brak pełnej drabinki 15–20 bossów,
- balans walk jest jeszcze testowy.
