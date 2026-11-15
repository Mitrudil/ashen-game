# ASHEN v0.3.0 — grafiki bossów i taktyka ekspedycji

Ta wersja rozwija **ekspedycje klanowe** o dwie rzeczy, które były kolejnym krokiem po v0.2.9.1:

1. **indywidualne grafiki bossów i przeciwników**,  
2. **taktykę drużyny wybieraną przed walką**.

## Co doszło

### Grafiki bossów
- każdy z 3 pierwszych bossów ma teraz własną grafikę,
- **Brat Tarczownik**, **Brat Mechanik** i **Brat Strzelec** mają osobne portrety,
- grafiki są widoczne:
  - na kartach bossów,
  - w aktywnej wyprawie,
  - w raportach walki.

### Taktyka wyprawy
Lider lub oficer może ustawić taktykę aktywnej wyprawy przed uruchomieniem walki:
- **Dobić najsłabszych**
- **Na największe zagrożenie**
- **Rozproszyć ogień**

Taktyka wpływa na wybór celu przez drużynę podczas rozliczania walki na serwerze.

## Nadal bez zmian
W tej wersji nadal **nie ma jeszcze**:
- nagród za bossów,
- łupów,
- pełnej ekonomii ekspedycji,
- pełnej kampanii 15–20 bossów.

To będzie następny etap.

## Wymagany SQL

### Jeśli masz już v0.2.9 / v0.2.9.1
Uruchom dodatkowo:
- `multiplayer/supabase/007_expedition_tactics_and_boss_art.sql`

### Jeśli stawiasz wszystko od zera
Uruchom po kolei:
- `002_cloud_saves.sql`
- `003_online_pvp.sql`
- `005_clans.sql`
- `006_clan_expeditions.sql`
- `007_expedition_tactics_and_boss_art.sql`

## Najważniejsze zmienione pliki
- `index.html`
- `css/style.css`
- `js/game.js`
- `js/expeditions.js`
- `assets/bosses/*`
- `multiplayer/supabase/007_expedition_tactics_and_boss_art.sql`

## Dokument uruchomienia
Szczegóły: `multiplayer/URUCHOMIENIE_0.3.0.md`

## Bez zmian
Nie ruszałem:
- lokalnego PvE,
- lokalnego PvP testowego,
- ekwipunku i rozwoju postaci,
- systemu klanów poza ekspedycjami,
- ALLADYN.
