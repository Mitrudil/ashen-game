# ASHEN v0.4.9.19 — Kandydat SQL 032 do testów

Aktualizacja GitHub **nie uruchamia SQL 032**. Na działającym serwerze po SQL 029 jest nadal **6/15 Mistrzostw Z**. Kandydat SQL 032 dodaje Zwinnego, Żelaznego i Spostrzegawczego (9/15 dopiero po osobnych testach i wdrożeniu). Test bezpieczny, tylko odczyt: `sql/032_sprawdzenie_wersji_przed_wdrozeniem_READONLY.sql`. Szczegóły: `TESTY_PVP_04919.md`.

# ASHEN v0.4.9.18 — Izolowane testy serwerowe SQL 029

Zamiast nowej migracji PvP dostarczamy **test wykonywany w SQL Editor Supabase**: `sql/031_sql029_izolowane_testy_serwerowe.sql`.

Skrypt odczytuje **aktualnie wdrożoną** definicję `public.ashen_online_attack(uuid)`, wyodrębnia obliczenia walki do funkcji sesyjnej, porównuje trzy syntetyczne scenariusze z Z / bez Z przy ustalonym losowaniu i kończy transakcję `ROLLBACK`. Nie wywołuje normalnego ataku PvP ani nie zapisuje raportów, wiadomości, danych profili czy limitów.

**To nie jest nowa migracja. Nie uruchamiaj ponownie SQL 029 ani SQL 028.** Skrypt nie modyfikuje interfejsu i nie zmienia balansu. Wynik będzie prawdziwym testem obliczeń uruchomionych na serwerze, lecz nadal NIE jest testem pełnej ścieżki RPC z autoryzacją użytkownika. Błędy, brak `OK` lub niezgodny format definicji zgłoś zamiast ponawiać zapytanie.

Zobacz `TESTY_SERWEROWE_SQL029_04918.md`.

# ASHEN v0.4.9.17

Panel **PvP online → Audyt rzeczywistych aktywacji Z** zbiera zdarzenia z dostępnych raportów Supabase. Brak raportu lub aktywacji to brak danych, nie wynik negatywny. Bez nowych migracji SQL. Dodatkowy odczytowy skrypt SQL znajduje się w `sql/030_diagnostyka_raportow_z_readonly.sql` (opcjonalny; nie jest migracją).

# ASHEN v0.4.9.14

Najnowsza aktualizacja dodaje **kandydata SQL 029** dla serwerowego PvP: Wzmocniony, Pancerny i Techniczny (łącznie 6/15 po wdrożeniu). Samo wgranie plików na GitHub **nie aktywuje** nowych zdolności online. Najpierw test w osobnej bazie i kopia funkcji `ashen_online_attack(uuid)`, następnie ostrożne wdrożenie SQL 029. Zachowaj kopię działającej funkcji publikowania postaci z limitem 8 ataków. W pełnej paczce znajduje się poprawiony SQL 028, ale **nie uruchamiaj go ponownie**.

# ASHEN — Kroniki Upadku · v0.4.9.13

15/15 testów lokalnych Mistrzostwa Z zaliczonych. PvP online obsługuje tylko 3 z 15 Z po SQL 027.

## Aktualizacja GitHub

Podmień `index.html`, `js/game.js`, `README.md`, `CHANGELOG.md` i dodaj `sql/028_pvp_set_snapshot_consistency.sql`.

## Migracja SQL 028 — opcjonalna, etap testowy

**Nie uruchamiaj automatycznie na bazie produkcyjnej.** Przed uruchomieniem wykonaj backup definicji `ashen_publish_profile(jsonb)` i przetestuj synchronizację na osobnej bazie / dwóch kontach. Migracja porównuje deklarowane sety z wyposażeniem w chmurowym zapisie postaci. Może odmówić publikacji niezgodnych / starych zapisów. Nie zmienia serwerowego rozliczania walk. **Nie jest pełnym anty-cheatem:** zapis `ashen_cloud_saves.save_data` nadal podlega edycji przez właściciela konta, a pozostałe statystyki profilu nadal są wyliczane przez klienta.

Raport wcześniejszego audytu: `AUDYT_XYZ_PVP_v0.4.9.12.md`.


### Laboratorium PvP (v0.4.9.15)
W zakładce PvP jest symulator trzech izolowanych reguł SQL 029. To tylko test po stronie przeglądarki; nie potwierdza działania funkcji na żywym serwerze. Nie publikuje testowych przedmiotów.

### PvP online i diagnostyka (v0.4.9.16)
PvP online jest jedynym trybem walk między kontami. Trzy izolowane próby w Laboratorium reguł PvP nie wysyłają ataków ani nie zużywają limitu. Raporty serwerowe wyświetlają osobną listę zapisanych aktywacji Z. Brak komunikatu w raporcie nie oznacza, że wszystkie mechaniki zostały zweryfikowane. Stara Arena PvP offline została usunięta z UI; nie dokonano migracji ani usuwania zapisów użytkownika.
