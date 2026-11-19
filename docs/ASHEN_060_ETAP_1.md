# ASHEN 0.6.0 — ETAP 1. Audyt danych i bezpieczny punkt startowy

Źródło: pełna gra ASHEN 0.5.4.1, plik `js/game.js` oraz działające `SETY_0_5_PROJEKT.json`.

## Potwierdzone fakty z kodu

- Zbadano **24 modeli broni** z istniejącego laboratorium.
- Nowe prefiksy w definicjach: **22**; sufiksy: **20**.
- Obecny porządek jakości w kodzie to **Zwykły → Ulepszony → Rzadki → Epicki → Legendarny**.
- `weapon_quick` zapewnia dodatkowy, **osłabiony** atak — jego efekt nie oznacza obecnie pełnej dodatkowej próby o bazowych obrażeniach.
- Kod ma już laboratorium 24 broni, ale nie jest ono testem nowych konfiguracji 6–12 ataków z artefaktami.
- Aktywne reguły zestawów X/Y/Z oraz PvP wymagają zsynchronizowania logiki klient/serwer podczas właściwej migracji.

## Decyzje zatwierdzone

- Pięć jakości: Zwykły, Rzadki, Epicki, Legendarny, Mityczny. „Ulepszony” przestaje oznaczać jakość.
- Bazowe parametry konkretnego modelu broni (w tym liczba ataków) nie rosną z poziomem postaci.
- Bonusy prefiksów, sufiksów, setów i artefaktów mogą podnosić liczbę ataków, obrażenia, celność, krytyki itp.
- Gniazda 0–3 losowane tylko przy zdobyciu przedmiotu, we wszystkich kategoriach. Bez dodawania i przelosowywania.
- 16 artefaktów w 8 rodzinach; efekt danego artefaktu zależy od slotu. Strefa Anomalii jako osobne źródło.
- Rezonans przy trzech artefaktach tej samej rodziny; nie mnożymy go przez liczbę kolejnych kopii.

## Co trzeba przeliczyć przed wdrożeniem

1. Konwersja starego indeksu jakości `rarity=1..4` bez pomylenia „Ulepszonego” z „Mitycznym”.
2. Rozdzielenie „dodatkowy osłabiony atak” od nowego pełnego ataku; jeden kontrakt gry i silnika SQL.
3. Efekty per-hit i per-runda w 15 Mistrzostwach Z; szczególnie Lekki, Techniczny, Spostrzegawczy i Zwinny.
4. Ograniczenie dominacji szybkich broni przez per-hit rozliczenie pancerza i krytyków.
5. Zapis gniazd z przedmiotem oraz transport artefaktów ze starych slotów.

## Kolejny etap kodu

Najpierw komplet 16 artefaktów z efektami na 11 slotach oraz specyfikacja premii wszystkich zestawów. Następnie migracja modelu przedmiotów i zgodny pakiet klient + SQL, potem nowa Strefa Anomalii i rzeczywiste testy.

### Katalog aktualnych 24 modeli broni

| Model | Kategoria | Bazowe ataki | Obrażenia jednego ciosu |
|---|---|---:|---:|
| Pałka ochroniarza | Biała 1R | 1 | 5–8 |
| Żelazna rura | Biała 1R | 1 | 6–10 |
| Klucz francuski | Biała 1R | 1 | 7–12 |
| Zardzewiały nóż | Biała 1R | 2 | 6–10 |
| Tasak z pustkowi | Biała 1R | 1 | 10–16 |
| Toporek z odzysku | Biała 1R | 1 | 12–18 |
| Szabla konwojenta | Biała 1R | 2 | 10–15 |
| Maczeta zbieracza | Biała 1R | 2 | 12–18 |
| Pistolet M-9 | Palna 1R | 1 | 12–18 |
| Pistolet pustynny | Palna 1R | 1 | 18–27 |
| Rewolwer Strażnika | Palna 1R | 1 | 19–28 |
| Pistolet maszynowy Viper | Palna 1R | 3 | 8–13 |
| Karabin szabrownika | Palna 2R | 1 | 18–27 |
| Karabinek warty | Palna 2R | 2 | 13–20 |
| Strzelba pustkowi | Palna 2R | 1 | 28–42 |
| Karabin dalekiego zasięgu | Palna 2R | 1 | 36–54 |
| Karabin maszynowy PK | Palna 2R | 3 | 13–20 |
| Kusza tropiciela | Dystansowa 2R | 1 | 18–28 |
| Wyrzutnia harpunów | Dystansowa 2R | 1 | 23–36 |
| Miotacz żaru | Technologiczna 2R | 3 | 12–19 |
| Łom zbrojony | Biała 2R | 1 | 15–23 |
| Młot złomiarza | Biała 2R | 1 | 21–33 |
| Prototypowa broń szynowa | Technologiczna 2R | 1 | 31–47 |
| Młot wyburzeniowy | Biała 2R | 1 | 32–50 |
