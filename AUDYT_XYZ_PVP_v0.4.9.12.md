# ASHEN v0.4.9.12 — Audyt setów X/Y/Z oraz PvP online

Stan kodu: po wersji v0.4.9.11. **Audyt statyczny** (analiza źródeł), nie test produkcyjnej bazy Supabase. W chwili audytu znana jest ostatnia przygotowana migracja `sql/027_online_pvp_z_stage1.sql`. Czy została zastosowana w aktywnej bazie należy zweryfikować po stronie Supabase.

## Wnioski

- **15/15:** lokalne kontrolowane próby Laboratorium zaliczone przez testera na wersjach do v0.4.9.11.
- **3/15:** `ashen_online_attack` w SQL 027 posiada implementacje Z: Przekonujący, Lekki, Wartowniczy. Pozostałych 12 nie rozlicza.
- **X/Y:** migawka przekazuje `setEffects`, SQL 025/027 konsumuje część efektów. To nie jest jeszcze dowód pełnej matematycznej identyczności lokalnej i serwerowej; systemy mają osobne procedury liczenia trafienia, krytyków i tarcz.
- **Poważne ograniczenie uczciwości:** serwer opiera się na `ashen_online_profiles.snapshot`, pochodzącym od klienta i zawierającym flagi `master_*`, a nie weryfikuje kompletu, jakości i własności trzech elementów zestawu przed rozliczeniem. Samo ograniczenie dostępu do funkcji online nie rozwiązuje tego problemu.
- **Nazewnictwo:** po v0.4.9.9 rodziny nazwane są według prefiksów (np. Spostrzegawczy, Refleksyjny); identyfikatory mechanik zostały zachowane. W SQL 027 pozostały starsze polskie określenia w opisach/logach, co jest kwestią prezentacji, nie zmienia przeliczania bonusów.

## Mapa 15 rodzin

| ID mechaniki | Rodzina | Mistrzostwo Z | W lokalnym silniku | Serwer SQL 027 |
|---|---|---|---|---|
| `armor_reinforced` | Wzmocniony | Drugi oddech | Tak (próba laboratoryjna) | nie |
| `armor_plated` | Pancerny | Niezłomna płyta | Tak (próba laboratoryjna) | nie |
| `armor_flexible` | Elastyczny | Kontratak | Tak (próba laboratoryjna) | nie |
| `armor_agile` | Zwinny | Błyskawiczny start | Tak (próba laboratoryjna) | nie |
| `armor_light` | Lekki | Seria trafień | Tak (próba laboratoryjna) | TAK |
| `armor_resistant` | Odporny | Stłumienie krytyka | Tak (próba laboratoryjna) | nie |
| `armor_tracker` | Tropicielski | Słaby punkt | Tak (próba laboratoryjna) | nie |
| `armor_iron` | Żelazny | Miażdżący cios | Tak (próba laboratoryjna) | nie |
| `armor_warden` | Wartowniczy | Ostatni bastion | Tak (próba laboratoryjna) | TAK |
| `armor_nomad` | Nomadyczny | Instynkt | Tak (próba laboratoryjna) | nie |
| `accessory_technical` | Techniczny | Skan pancerza | Tak (próba laboratoryjna) | nie |
| `accessory_observant` | Spostrzegawczy | Oznaczenie celu | Tak (próba laboratoryjna) | nie |
| `accessory_persuasive` | Przekonujący | Autorytet | Tak (próba laboratoryjna) | TAK |
| `accessory_reflexive` | Refleksyjny | Przebicie po uniku | Tak (próba laboratoryjna) | nie |
| `accessory_versatile` | Wszechstronny | Osłona ratunkowa | Tak (próba laboratoryjna) | nie |

## Kontrola powiązań

- `SET_V05_DESIGN` i `EVOLUTION_V05_FAMILIES` w `js/game.js` zawierają 10 rodzin odzieżowych i 5 rodzin akcesoriów. `evolutionSetFromQuality` tworzy flagi `master_<id>` tylko po uzyskaniu trzech wymaganych elementów i progu jakości Z. `setEngineEffects` zbiera je z wyposażenia; `pvpSnapshot` przekazuje `setEffects` i `activeSets`.
- Lokalna funkcja `fight` rozpoznaje 15 flag `master_*` i posiada własne ograniczenia aktywacji (`zOnce`, `zCooldown`, liczniki trafień, rund itd.).
- `sql/027_online_pvp_z_stage1.sql` analizuje trzy flagi `master_accessory_persuasive`, `master_armor_light`, `master_armor_warden`; **nie ma implementacji pozostałych 12 zdolności**.
- W lokalnym interfejsie i w panelu PvP umieszczono ostrzeżenie o różnicy 15/15 vs 3/15.

## Ryzyka i zalecana kolejność

1. **Serwerowe potwierdzanie wyposażenia:** weryfikować sloty, własność przedmiotów, rodzinę, jakość i wyliczone skutki po stronie backendu (nie polegać wyłącznie na flagach w snapshot). Przed wdrożeniem opracować ograniczenia dostępu do zapisów postaci oraz walidację niebezpiecznych wartości.
2. **Wspólna specyfikacja walki:** dokładnie spisać kolejność modyfikatorów (celność → obrażenia → krytyk → przebicie → redukcja → osłona → PŻ → skutki po trafieniu). Wyrównać reguły SQL z silnikiem lokalnym, w tym zaokrąglenia i kolejność wyzwalaczy.
3. **Wdrożenie 12 pozostałych Z** w niezależnych, małych migracjach z kopią obecnej funkcji `ashen_online_attack` przed każdą zmianą. W pierwszej kolejności testy autoryzacji i nadużyć, potem zgodność scenariuszy oraz regresja limitów ataków, raportów i poczty.
4. **Testy serwerowe:** użyć dwóch kont testowych i odtwarzalnych scenariuszy z 3-elementowymi kompletami. Weryfikować również brak bonusu przy 2 częściach lub jakości poniżej progu; przypadki śmierci, krytyków, uniku, osłon oraz ograniczeń aktywacji.
5. **Bossowie klanowi:** projektować wspólną tabelę definicji efektów, a nie kopiować reguły niezależnie do każdego rodzaju walki; mechaniki grupowe jak autorytet będą wymagały osobnych zasad doboru odbiorców premii.

## Zakres v0.4.9.12

Jest to **wersja audytowo-informacyjna**, bez zmiany balansu lub migracji SQL. Dodaje dokumentację oraz wyraźną informację o stanie online w interfejsie PvP; nie deklaruje wdrożenia nowych efektów Z na Supabase. Następny etap wymaga serwerowej migracji i testów na dwóch kontach.
