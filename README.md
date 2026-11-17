# ASHEN — Kroniki Upadku · v0.4.9.13

15/15 testów lokalnych Mistrzostwa Z zaliczonych. PvP online obsługuje tylko 3 z 15 Z po SQL 027.

## Aktualizacja GitHub

Podmień `index.html`, `js/game.js`, `README.md`, `CHANGELOG.md` i dodaj `sql/028_pvp_set_snapshot_consistency.sql`.

## Migracja SQL 028 — opcjonalna, etap testowy

**Nie uruchamiaj automatycznie na bazie produkcyjnej.** Przed uruchomieniem wykonaj backup definicji `ashen_publish_profile(jsonb)` i przetestuj synchronizację na osobnej bazie / dwóch kontach. Migracja porównuje deklarowane sety z wyposażeniem w chmurowym zapisie postaci. Może odmówić publikacji niezgodnych / starych zapisów. Nie zmienia serwerowego rozliczania walk. **Nie jest pełnym anty-cheatem:** zapis `ashen_cloud_saves.save_data` nadal podlega edycji przez właściciela konta, a pozostałe statystyki profilu nadal są wyliczane przez klienta.

Raport wcześniejszego audytu: `AUDYT_XYZ_PVP_v0.4.9.12.md`.
