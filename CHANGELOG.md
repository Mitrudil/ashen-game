## v0.4.9.13 — Serwerowa kontrola spójności deklaracji setów (testowa)

- Nowa opcjonalna migracja `sql/028_pvp_set_snapshot_consistency.sql` weryfikuje skład, liczebność, sumę jakości, poziom i flagi Mistrzostw Z w migawce z wyposażeniem zapisanym w `ashen_cloud_saves`.
- Funkcja `ashen_publish_profile` odmawia zapisania migawki przy niespójności; walka SQL 027 pozostaje bez zmian.
- **Ograniczenie:** zapis chmurowy nadal modyfikowalny po stronie klienta. To kontrola spójności, nie niezależne potwierdzenie pochodzenia przedmiotów.
- Nie uruchamiano SQL na rzeczywistym Supabase; wymaga osobnych prób zgodności.

## v0.4.9.12 — audyt X/Y/Z i gotowości PvP online
- Statyczna kontrola 15 rodzin setów, ich flag Z, lokalnego silnika i `sql/027_online_pvp_z_stage1.sql`.
- Zestawienie: 15/15 lokalnie zaliczone, tylko 3/15 Z posiada implementację w SQL 027.
- Widoczna informacja o testowym charakterze PvP online i braku walidacji migawki po stronie serwera.
- Dokument `AUDYT_XYZ_PVP_v0.4.9.12.md` z mapą 15 rodzin, ryzykami i planem bezpiecznego wdrożenia.
- Bez zmian balansu, danych zapisów, tabel SQL lub zasad walki.

## v0.4.9.11 — poprawa testu Wszechstronnego
- Laboratorium mierzy pochłonięte obrażenia w rundzie 2 (przed śmiercią), zamiast sumować utracone PŻ do śmierci.
- Warunek zaliczenia wymaga jednej aktywacji Z i faktycznego pochłonięcia obrażeń przez osłonę.
- Bez zmian balansu, zwykłej walki, PvP online i SQL.

## v0.4.9.10 — poprawa testu Odpornego
- Laboratorium porównuje pierwsze trafienie krytyczne z Z i bez Z, a nie łączne obrażenia przy śmierci (są obcinane do pozostałych PŻ).
- W raporcie pokazuje redukcję na pierwszym krytyku oraz informacyjnie sumy obrażeń.
- Nie zmieniono działania zdolności, balansu, PvP online, SQL ani danych postaci.

# Historia zmian ASHEN

## v0.4.9.9 — język nazw i finał Laboratorium Setów Z
- Odmiana nazw prefiksów „Nomadyczny” i „Wartowniczy”; pozostałe przymiotniki nadal odmieniają się zgodnie z rodzajem przedmiotu.
- Ujednolicenie rodzin akcesoriów z ich prefiksami; `accessory_reflexive` to Refleksyjny, nie Nomady. Identyfikatory i bonusy bez zmian.
- Trzy nowe kontrolowane próby Z: Odporny, Tropicielski, Wszechstronny. Przed zatwierdzeniem wymagana weryfikacja w działającej grze.
- SQL nie jest potrzebny.

## 0.4.9.8 — Laboratorium Z i nazewnictwo
- Testy: Elastyczny — Kontratak; Refleksyjny — Przebicie po uniku; Nomady — Instynkt.
- Rodzina `accessory_observant` nazywa się Spostrzegawczy (żeńska forma Spostrzegawcza), zgodnie z prefiksem. Sufiks Tropiciela pozostaje osobny.
- Nie zmieniono identyfikatorów, balansu, PvP online ani migracji SQL.

# ASHEN — Historia zmian

## v0.4.9.7 — Nowe próby Mistrzostw Z i porządek w dokumentacji

- Laboratorium Z: Zwinny (pierwsze trafienie +12%), Żelazny (cios przeciw pancerzowi +8%, odstęp 3 rund) oraz Tropiciela (drugie trafienie +8%, raz w rundzie).
- Każda próba porównuje dwa uruchomienia istniejącego lokalnego silnika walki z tym samym losowaniem, różniące się wyłącznie aktywacją Z.
- Laboratorium działa tylko na profilach Testerów; nie zapisuje wyników w Supabase.
- Konsolidacja historycznych plików README_*.md do CHANGELOG.md.
- Bez zmian SQL, zwykłego balansu oraz silników serwerowych.

---

# Historia zmian ASHEN

# ASHEN v0.4.9.6 — Poprawa próby Drugiego oddechu

- Laboratorium Wzmocnionego wyłącza tylko w izolowanej symulacji osłonę startową Y po obu stronach porównania. W normalnej rozgrywce osłona Y pozostaje bez zmian.
- Oba przebiegi różnią się wyłącznie aktywacją Z; leczenie powinno być widoczne już po pierwszej rundzie.
- Raport pokazuje oczekiwaną wartość przywrócenia PŻ (10% maksymalnego).
- Nie zmieniono balansu, zapisu, SQL, ekwipunku, walk PvP ani Ekspedycji.
- Wersja w górnym panelu oraz parametry cache skryptów zostały zaktualizowane.


---

# ASHEN v0.4.9.5 — Laboratorium trzech kolejnych Mistrzostw Z

- Wzmocniony: Drugi oddech (test porównujący wynik z i bez uzdrowienia).
- Pancerny: Niezłomna płyta (test redukcji dużego trafienia).
- Technika: Skan pancerza (test pierwszych dwóch trafień przeciw pancerzowi).
- Testy tylko na osobnych profilach Testerów; bez wpływu na PvP i Supabase.
- Nie wykonuj SQL. Podmień `index.html` i `js/game.js`.
- Pełna paczka zawiera odzyskane zasoby i konfigurację public-config.js — nie nadpisuj jej swoimi danymi.
- Status: składnia i archiwum sprawdzone; test przeglądarkowy do potwierdzenia.


---

# ASHEN v0.4.9.4 — Laboratorium Negocjatora i Lekkiego

- Dodano kontrolowaną próbę Autorytetu: +3 do celności, wraz z obliczeniem szansy trafienia przed i po bonusie (limity 15–95%).
- Dodano próbę Serii trafień z trzema trafieniami na rundę i porównaniem obrażeń z Z i bez Z.
- Wykorzystano istniejący silnik `fight()` i izolowany profil Testera; próby nie zmieniają postaci ani danych Supabase.
- Test Lekkiego wykorzystuje laboratoryjną broń kalibracyjną, aby pokazać efekt 4% mimo zaokrągleń.
- Nie ma zmian SQL, balansu, ani normalnego PvP online.
- GitHub: podmień `index.html` oraz `js/game.js`.


---

# ASHEN v0.4.9.3 — Poprawa osłony Wartownika

- Lokalny silnik walki odróżnia maksymalne PŻ postaci od PŻ na początku próby.
- Ostatni bastion nalicza 15% maksymalnych PŻ także przy starcie z 20% i 35% zdrowia.
- Laboratorium pokazuje oczekiwaną wartość osłony.
- Zmiana dotyczy lokalnego `js/game.js`; SQL 027 już wykorzystuje maksymalne PŻ i nie wymaga ponownego wykonania.
- Nie zmieniono danych postaci, wyposażenia, balansu ani publicznych raportów.

Instalacja: podmień `index.html` i `js/game.js`; SQL nie jest potrzebny.


---

# ASHEN v0.4.9.2 — Próba Mistrzostwa Z

Test offline dla aktywnego zestawu Wartownika na profilu Testera. W laboratorium wybierz startowe PŻ (20%, 35%, 100%) i uruchom próbę. Wynik i log zawierają aktywację osłony. Symulacja działa na kopii statystyk, nie zmienia zapisu ani PvP online. Nie wymaga SQL.


---

# ASHEN v0.4.9.1 — Poprawa komunikatów o Mistrzostwie Z

- Poprawiono 4 miejsca prezentacji aktywnego setu odzieży, które pomijały oznaczenie + Z.
- Przy 3 zgodnych elementach i 12 punktach jakości poprawnie wyświetlany jest poziom III oraz X + Y + Z.
- Oznaczenie 3/6 jest prawidłowe: odzież może zajmować 6 slotów, a aktywacja zaczyna się od 3.
- Brak zmian w logice wyliczania bonusów, serwerowym PvP i SQL.
- Aktualizacja GitHub: index.html i js/game.js.


---

# ASHEN v0.4.9.0 — Laboratorium Setów Z

Zmiany: panel w Ekwipunku na oddzielnych profilach Testerów, zestawy Negocjatora (akcesoria), Lekki i Wartownika (odzież), wybór jakości każdej z 3 części, faktyczne prefiksy i obliczanie X/Y/Z przez bieżący silnik.

Bezpieczeństwo: przed generowaniem zachowujemy kopię ekwipunku i założonych slotów profilu Testera; przywrócenie resetuje wyposażenie do kopii. Główny profil jest zablokowany. Migawka online zwraca brak danych, gdy testowy set jest aktywny, a auto-publikowanie nie jest wtedy uruchamiane przez zapis. Nie jest to jeszcze test serwerowego PvP: wymaga osobnego serwerowego trybu sandbox.

Instalacja: podmień index.html i js/game.js; bez SQL. Nie zmieniaj js/public-config.js.

Test: wybierz Tester 1–4 → Ekwipunek → Laboratorium Setów Z → wybierz set i jakości 4/4/4 → generuj → sprawdź poziom III → przywróć.

Uwaga: testowy zestaw powinien zostać przywrócony przed opuszczeniem profilu. Nie używaj go do zwykłej rozgrywki.


---

# ASHEN v0.4.8.9 — Mistrzostwo Z w PvP online, etap 1

## Zmiany
- Wprowadzenie trzech efektów Z w serwerowym PvP: Negocjator (+3 celności), Lekki (+4% obrażeń od drugiego trafienia w rundzie, do dwóch uruchomień), Wartownik (jednorazowa osłona 15% maks. PŻ).
- Uruchomienia Lekkiego i Wartownika są zapisywane w przebiegu rund i widoczne w raportach publicznych. Negocjator modyfikuje obliczenie celności bez osobnego wpisu na każdą próbę.
- Dotychczasowe X/Y, limit walk, raporty, udostępnianie i kolejność działań zachowane.
- Numer wersji 0.4.8.9 w górnym panelu, stopce i plikach HTML.

## Instalacja
1. Zrób kopię `ashen_online_attack` z Supabase (tak jak przed 0.4.8.5).
2. Uruchom `sql/027_online_pvp_z_stage1.sql` w Supabase SQL Editor (wymaga poprzednich SQL 025 i 026).
3. Wgraj `index.html`, `js/game.js`, `js/online.js` na GitHub. Nie zmieniaj `js/public-config.js`.
4. Ctrl+F5, synchronizacja postaci, próba walki z aktywnym odpowiednim setem; w raporcie sprawdź aktywację Z.

## Ograniczenia
- **Tylko 3 z 15 efektów Z**; nie ogłaszamy zakończenia całego mistrzostwa.
- Serwer nie potwierdza wyposażenia na podstawie wiarygodnych rekordów; przyjmuje flagi z opublikowanej migawki postaci. Przed publicznym uruchomieniem gry wymagany jest audyt i walidacja po stronie serwera.
- W obecnym PvP serwer wybiera kolejność stron losowo (50/50), więc nie wdrażamy jeszcze bonusów związanych z inicjatywą.
- Nie przeprowadzono testu rzeczywistej migracji w Supabase ani walk w przeglądarce; potrzebna jest weryfikacja po wdrożeniu.
- Poprawka przewijania v0.4.8.8 jest zachowana.


---

# ASHEN v0.4.8.8 — Stabilne przewijanie raportu PvP

Aktualizacja z v0.4.8.7. **Bez SQL**.

## Poprawka
- Zapamiętywanie i przywracanie pozycji wewnętrznego przewijania raportu PvP podczas ponownego renderowania interfejsu (np. po synchronizacji w tle).
- Zachowanie pozycji przewinięcia strony, gdy raport jest otwarty.
- Numer wersji 0.4.8.8 w nagłówku i HTML, z odświeżeniem plików skryptów przez nowy parametr wersji.
- Brak zmian w algorytmach walki, setach, raportach na serwerze i SQL.

## Instalacja
Wgraj na GitHub tylko **index.html** i **js/game.js**. Pliku **js/public-config.js** NIE podmieniaj — zawiera Twoją istniejącą publiczną konfigurację Supabase.
Potem Ctrl+F5. Otwórz raport z zakładki PvP i przewiń go; sprawdź, czy nie wraca sam na początek po synchronizacji.

## Testy
Kontrola składni JS i integralności ZIP. Działanie w rzeczywistej przeglądarce użytkownika wymaga potwierdzenia.


---

# ASHEN v0.4.8.7 — udostępnianie raportów PvP

**Aktualizacja z v0.4.8.6.** Wymagany SQL: `sql/026_public_pvp_reports.sql`.

## Co nowego
- W oknie raportu PvP: „Kopiuj link” i „Udostępnij”; serwer tworzy losowy token UUID dopiero na żądanie uczestnika walki.
- Publiczny widok `report.html?report=<token>` dla gości bez konta.
- Odczyt raportu przez bezpieczne RPC, bez identyfikatorów kont, całych snapshotów ani prywatnych zapisów.
- Raporty nie są publicznie indeksowane/listowane. Każdy, kto ma link, może go jednak przekazać dalej.
- Poprawiono wyświetlanie sumy zadanych obrażeń, z rezerwowym przeliczeniem z przebiegu rund; brakujących trafień/krytyków nie fałszujemy jako zero.
- Usunięto mylący komunikat o konieczności instalacji SQL 025 (zastąpiono informacją warunkową).
- Historia PvP w przeglądarce pokazuje do 40 pozycji, jeśli tyle zwróci serwer.

## Wymagana jednorazowa konfiguracja publicznych linków
Aby link działał u odbiorców, wypełnij `js/public-config.js`: 
- `url`: publiczny Project URL Supabase (https://...supabase.co)
- `key`: **tylko** publishable/anon key (NIE secret/service_role).

Klucz publishable/anon jest przeznaczony do aplikacji publicznych. Nie wpisuj żadnego klucza tajnego.
Nie przesyłaj klucza w samym adresie raportu. Po zmianie configu wrzuć plik na GitHub.

## Instalacja
1. W Supabase SQL Editor uruchom `sql/026_public_pvp_reports.sql`, po wykonaniu kopii zapasowej.
2. Na GitHub wrzuć `index.html`, `report.html`, `js/game.js`, `js/online.js`, `js/public-report.js`, `js/public-config.js` (z publiczną konfiguracją).
3. Wyczyść cache Ctrl+F5. Otwórz stary lub nowy raport, kliknij „Kopiuj link” i sprawdź go w oknie incognito.
4. W razie problemów nie wykonuj ponownie SQL 025; SQL 026 nie zmienia silnika walki.

## Ograniczenia
- Nie testowano RPC na rzeczywistym serwerze użytkownika. SQL należy uruchomić świadomie w Supabase.
- Nie ma jeszcze serwerowej walidacji wyposażenia ani mechaniki Z w PvP.
- Publiczne raporty pozostają dostępne, dopóki istnieje token w bazie; kasowanie tokenu można wykonać administracyjnie w razie potrzeby.
- Historia zwrócona przez serwer może być ograniczona przez istniejącą funkcję `ashen_online_reports`.


---

# ASHEN v0.4.8.6 — czytelne raporty PvP i kontrola X/Y

Aktualizacja v0.4.8.5 -> v0.4.8.6.

## Zmiany
- Raport PvP online formatuje PŻ, pancerz i atrybuty jako liczby całkowite oraz unik i celność do maksymalnie 1 miejsca po przecinku (przecinek dziesiętny).
- Brak nieestetycznych artefaktów float, takich jak 9.600000000000001.
- Nie dopisujemy znaku % do uniku i celności: są to statystyki używane we wzorze na szansę trafienia, a nie bezpośrednie procenty.
- Wersja w nagłówku/stopce i parametry cache HTML: v0.4.8.6.
- Bez zmian w walce, RNG, balansie, SQL, kontach i zapisach.

## Ograniczenia audytu X/Y
- Migracja SQL 025 zawiera naliczanie części pasywnych premii X/Y w PvP, ale ich danych nie weryfikuje serwerowo na podstawie ekwipunku.
- Potwierdzenie balansu wymaga kontrolowanych walk na dwóch kontach. Nie da się go wywnioskować wyłącznie z wartości w raporcie.
- Z pozostaje niewdrożone w PvP online.

## Instalacja
Wgraj na GitHub index.html, js/game.js i js/online.js. Bez SQL. Odśwież Ctrl+F5.
Przed kolejnymi zmianami wykonaj test PvP w dwóch wariantach: bez setów i z aktywnymi setami X/Y, kontrolując status synchronizacji.


---

# ASHEN v0.4.8.5 — PvP X/Y (pierwszy etap)

## Zakres
- Wprowadza osobną migrację `sql/025_online_pvp_xy_passive.sql` dla serwerowego PvP.
- Obsługuje pasywne, wcześniej nieużywane w PvP efekty: startShield, earlyAccuracy, afterMissAccuracy, afterDodgeAccuracy, critChance, damagePct, afterMissDamage, critDamagePct, armorPen, critResist, physicalResist, lateResist, afterCritResist.
- Nie nalicza ponownie HP, armor, acc, dodge i atrybutów, ponieważ te wartości już znajdują się w migawce profilu.
- Mistrzostwo Z oraz pozostałe mechaniki wymagające obsługi zdarzeń walki NIE zostały wdrożone. Ekspedycje bez zmian.
- Zmiana wersji widocznej w nagłówku na 0.4.8.5.

## Kolejność
1. Wykonaj kopię zapasową schematu bazy / zachowaj obecną definicję funkcji `ashen_online_attack`.
2. Podmień na GitHubie `index.html`, `js/game.js`, `js/online.js`.
3. W Supabase SQL Editor wykonaj **jednorazowo** `sql/025_online_pvp_xy_passive.sql`.
4. Odśwież stronę Ctrl+F5, ponownie zsynchronizuj profil, przetestuj na dwóch kontach.

## Uwagi bezpieczeństwa
Profile bojowe nadal są przesyłane przez klienta. Ograniczenie wartości bonusów chroni balans przed skrajnymi liczbami, ale nie stanowi pełnej weryfikacji posiadanego ekwipunku. Nie traktować tego jako gotowego zabezpieczenia przeciw oszustwom.

## Testy
Sprawdzona składnia JS i integralność ZIP. SQL nie został uruchomiony na serwerze użytkownika. Brak pełnych testów przeglądarkowych.


---

# ASHEN v0.4.8.4 — Diagnostyka setów online

## Instalacja
Po v0.4.8.3 podmień `index.html`, `js/game.js` i `js/online.js` na GitHubie. Odśwież przez Ctrl + F5. Nie uruchamiaj SQL.

## Zmiany
- W PvP online dodano rozwijany panel "Diagnostyka setów online", pokazujący bieżące pełne rodziny setów (z wyposażenia postaci) i stan synchronizacji lokalnego zapisu.
- Wyświetla poziom i punkty jakości aktywnych setów, numer silnika oraz liczniki flag X/Y/Z w migawce.
- Jasno zaznacza, że to DANE KLIENTA, nie potwierdzenie działania bonusów po stronie serwera.
- Ujednolicono numer wersji 0.4.8.4 w górnym panelu, stopce, silniku setów i HTML.

## Granice i testy
- Bez zmian w walce, loot, balansie, zapisach i SQL.
- To nie jest aktywacja X/Y/Z w PvP ani w Ekspedycjach online.
- Brakuje w odtworzonym źródle migracji `003_online_pvp.sql`. Przed ingerencją w serwer należy pozyskać bieżącą definicję funkcji serwerowych z Supabase.
- Sprawdź: postać bez setów; 3 elementy z jednej rodziny; zestaw z Z; synchronizacja po zmianie wyposażenia; walki PvP online i raporty.


---

# ASHEN v0.4.8.3 — synchronizacja informacji o setach

Aktualizacja **po zainstalowaniu v0.4.8.2**.

## GitHub
Podmień `index.html`, `js/game.js`, `js/online.js`. Bez SQL. Odśwież Ctrl+F5.

## Zmiany
- Migawka postaci wysyłana online zawiera `setEngineVersion`, `setEffects`, `activeSets` (id, category, count, qualityPoints, level).
- Informacje o setach są wyliczane z **założonych** przedmiotów postaci, nie z katalogu ani planera.
- Poprawiony mylący opis Z w ekwipunku: mistrzostwo działa w lokalnych Starciach.
- W PvP online pojawia się jawna informacja, że serwer nie stosuje jeszcze efektów Z.

## Granica funkcjonalności
**To nie jest wdrożenie mistrzostwa Z do PvP ani Ekspedycji serwerowych.**
SQL nadal rozstrzyga walki własnym silnikiem. Zanim aktywujemy efekty X/Y/Z po stronie serwera, konieczna jest weryfikacja migawki (nie ufać dowolnym polom z klienta), migracja funkcji walki i testy regresji.
Nie wgrywaj starych skryptów SQL ponownie w losowej kolejności.

## Testy do wykonania w grze
1. Wyposażyć pełny set jakości otwierającej Z, sprawdzić jego opis w ekwipunku.
2. Lokalna walka: sprawdzić w raporcie zdarzenie „Mistrzostwo Z”.
3. Konto online: ponowić synchronizację postaci.
4. PvP online / Ekspedycja: sprawdzić poprawność działania dotychczasowego silnika, **bez oczekiwania Z**.

Wersja klienta 0.4.8.3.


---

### Archiwalna notatka: README_043.txt

````text
ASHEN v0.4.3 — BUDYNKI FRAKCJI I WSPARCIE EKSPEDYCJI

Kolejność instalacji:
1. W Supabase SQL Editor uruchom 019_faction_facilities_and_support.sql.
   Wymagane są wcześniejsze migracje (017, 018) oraz system ekspedycji (009 i 015).
2. Podmień pliki index.html, css/style.css, js/game.js, js/clans.js i js/expeditions.js na GitHubie.
3. Zweryfikuj stan Frakcji, poziomy budynków i saldo magazynu.
4. Lider lub oficer rozpoczyna ekspedycję, następnie w zakładce Frakcje wybiera ją i przygotowuje wsparcie (po zbudowaniu odpowiedniego obiektu).
5. Po rozstrzygnięciu walki raport zawiera listę zastosowanych rodzajów wsparcia.

Nowe budynki (0-5): Kuchnia polowa, Lecznica, Warsztat frakcji.
Wsparcia jednorazowe na ekspedycję: prowiant (+6% HP / poziom), medyczne (+2 pancerza / poziom), techniczne (+3% obrażeń / poziom).
Zachowane: skład frakcji, ranking wpłat, zasoby, dotychczasowe trzy budynki i wyprawy.
Nie potrzeba wgrywać obrazów. Nowe koszty są testowe.
UWAGA: brak serwera testowego Supabase w środowisku; SQL wymaga weryfikacji na docelowym projekcie.

````


---

### Archiwalna notatka: README_AKTUALIZACJA.txt

````text
ASHEN v0.4.1 — Baza frakcji (AKTUALIZACJA)

KROK 1 — SUPABASE (WAŻNE)
Otwórz projekt Supabase używany przez ASHEN (NIE ALLADYN).
SQL Editor -> New query -> wklej zawartość pliku 017_faction_base.sql -> Run.
Uruchom raz, po wcześniejszych migracjach 002_cloud_saves.sql i 005_clans.sql.
Jeśli migracja nie powiedzie się, nie instaluj gry, najpierw rozwiąż błąd SQL.

KROK 2 — GITHUB
Wgraj do głównego katalogu repozytorium dokładnie te pliki:
- index.html
- css/style.css
- js/game.js
- js/clans.js
- js/online.js
Nie musisz ponownie wgrywać żadnych grafik ani js/expeditions.js.
Plik 017_faction_base.sql jest skryptem do ręcznego uruchomienia w SQL Editor; może pozostać także w repo jako dokumentacja.

DZIAŁANIE
- Wspólny magazyn frakcji: złom, części mechaniczne.
- Wpłaty z powiązanej z kontem online postaci; odjęcie zasobów w transakcji SQL z chmurowego zapisu i dodanie do wspólnego magazynu.
- Tylko lider i oficer mogą rozwijać 3 budynki (poziomy 0–5).
- Koszt poziomu L: 150*L*L złomu + 30*L części.
- Każdy członek widzi wspólne poziomy, saldo i krótką historię wpłat/rozbudowy.
- Nie dodano jeszcze bonusów do wypraw/ekspedycji; najpierw testujmy wspólną ekonomię.

UWAGI DO TESTÓW
- Aktywny profil musi być powiązany z kontem w panelu „Konto online”; w razie braku materiałów w zapisie online poczekaj na automatyczną synchronizację.
- Nie przełączaj profili ani nie ręcznie nadpisuj chmurowego zapisu w czasie wpłaty.
- Funkcja SQL jest atomowa, ale istniejący zapis chmurowy ASHEN to JSON modyfikowalny przez użytkownika. Oznacza to, że jest to system testowy, a NIE odporna na oszustwa ekonomia publicznego MMO.
- Nie nadpisujemy starych frakcji ani ekspedycji. Dane nowych baz są w osobnych tabelach i zostaną powiązane z dotychczasowymi identyfikatorami frakcji.
- Poprzednich plików SQL nie uruchamiaj ponownie bez potrzeby.

````


---

### Archiwalna notatka: README_PAKIET_TESTOWY.txt

````text
ASHEN v0.4.3.1 — duży pakiet testowy surowców

1. Wgraj index.html oraz js/game.js do repozytorium (podmień istniejące).
2. Otwórz grę, przejdź do zakładki Magazyn.
3. Kliknij „Odbierz duży pakiet testowy” i zatwierdź.
4. Zobaczysz na aktywnej postaci: +100 000 kredytów, +50 000 złomu, +20 000 każdego z materiałów: tkanina, skóra, chemikalia, elektronika, części mechaniczne, żywność, czysta woda, zaopatrzenie medyczne; +100 rdzeni i +100 schematów.
5. Zasoby są w PRYWATNYM magazynie postaci. Do frakcji wpłaca się je ręcznie w zakładce Frakcje. Limit pojedynczej wpłaty: 5000 (obowiązujące ograniczenie serwera).

Przycisk jest jednorazowy na postać, niezależny od wcześniejszego testowego pakietu Warsztatu. Nie potrzeba SQL ani grafik. Testuj tylko na profilu przeznaczonym do testów: rozdane materiały nie mogą być automatycznie cofnięte.

UWAGA: Pakiet zwiększa zasoby w lokalnym zapisie postaci i powinien przejść standardową synchronizację online. Przed wpłatą do frakcji upewnij się, że aktywna postać jest połączona z kontem online, synchronizacja zakończona, a po odświeżeniu nadal widać zasoby. Dalsze wpłaty wykorzystują obecne funkcje serwerowe.

````


---

### Archiwalna notatka: README_045.txt

````text
ASHEN v0.4.5 — Spójne zasady broni w walkach

Kolejność instalacji:
1. W Supabase SQL Editor uruchom sql/024_expedition_weapon_stat_parity.sql.
   Wymaga ukończonych migracji do 023 włącznie. Zrób kopię bazy przed zmianą.
2. Wgraj index.html i js/game.js do głównego katalogu gry na GitHubie.
3. Sprawdź napis v0.4.5 u góry ekranu.

Co poprawiono:
- Dotychczas Ekspedycje wyliczały celność z pola ogólnego h.acc i
  pomijały premię do obrażeń z atrybutów wynikającą z typu broni.
- Teraz dla bohaterów w Ekspedycjach naliczana jest ta sama premia
  atrybutów i ta sama celność typów broni co w Starciach/PvP.
- Zachowano bonusy frakcji, taktyki, liczbę graczy, pule nagród,
  krytyki, pancerz i dotychczasową logikę rozstrzygania walk.
- Historyczne raporty nie są przeliczane.

Uwaga: przy aktualizacji na żywym serwerze nie da się zagwarantować
identycznego RNG i wyników walk między silnikami JavaScript i PostgreSQL.
Wymagany test: porównaj statystyki bohatera w Starciach i raporcie
Ekspedycji dla tej samej broni, po ponownym opublikowaniu profilu.

````


---

### Archiwalna notatka: README_0432.txt

````text
ASHEN v0.4.3.2 — Stałe bonusy i prywatne wsparcie ekspedycji

WYMAGA działającej v0.4.3.1 oraz wykonanych migracji SQL 017, 018 i 019.

INSTALACJA
1. W Supabase -> SQL Editor uruchom plik 020_expedition_personal_support.sql.
2. Dopiero po pomyślnym wykonaniu SQL podmień w repozytorium GitHub:
   - index.html
   - js/game.js
   - js/clans.js
   - js/expeditions.js
   - css/style.css
3. Zaczekaj na publikację GitHub Pages, otwórz grę ponownie.
4. Profil organizatora musi być zsynchronizowany z kontem online.

ZMIANY
- Kazdy czlonek frakcji moze zakladac ekspedycje; dotychczasowe limity i rekrutacja bez zmian.
- Budynki zapewniaja pasywny bonus kazdej ekspedycji (na poziom):
  Kuchnia +2% PZ, Lecznica +1 pancerza, Warsztat +1% obrazen.
- Organizator MOZE wybrac przy zalozeniu dodatkowe wsparcie:
  Prowiant: 20 zywnosci + 12 wody; dodatkowo +4% PZ / poziom Kuchni.
  Lecznica: 15 medykamentow + 6 wody; dodatkowo +2 pancerza / poziom Lecznicy.
  Zestaw: 40 zlomu + 14 czesci; dodatkowo +2% obrazen / poziom Warsztatu.
- Platnosc i utworzenie ekspedycji w jednej transakcji Supabase.
- Zwrot prywatnych kosztow po anulowaniu przed walka przez organizatora.
- Stare wsparcie z magazynu wspolnego nie dostaje zwrotu prywatnego.
- Wspolny magazyn nadal sluzy do budowania i wplat.
- Raport walki rozdziela bonusy stale od przygotowania organizatora.

UWAGA TESTOWA
Mechanizm dziala z obecnym zapisem postaci, ktory posiada czesc logiki po stronie
przegladarki. Nie jest to zabezpieczona ekonomia produkcyjna. Synchronizuj postac
przed testem i NIE korzystaj z tego samego konta na dwoch urzadzeniach jednoczesnie.
SQL i przebieg online nalezy sprawdzic w Supabase — lokalnie wykonano jedynie
kontrole statyczne skladni JavaScript i spojnosc plikow.

````


---

### Archiwalna notatka: README.txt

````text
ASHEN v0.4.3.5 — Raporty i automatyczne nagrody

INSTALACJA
1. Upewnij się, że uruchomiono wcześniejszy SQL 022_solo_expeditions_shared_rewards.sql.
2. W Supabase SQL Editor uruchom sql/023_expedition_report_rewards.sql.
3. Wgraj do GŁÓWNEGO katalogu repozytorium następujące pliki:
   index.html, js/game.js, js/online.js, js/expeditions.js
4. Odśwież grę i zweryfikuj wersję 0.4.3.5 w nagłówku.

NOWOŚCI
- Raport ekspedycji zawiera tabelę nagród wszystkich uczestników: EXP, kredyty,
  złom i przedmiot (wyłącznie dla organizatora).
- W Wiadomościach cały raport otwiera się bezpośrednio pod treścią wybranej wiadomości.
  Nie przechodzisz do zakładki Ekspedycje.
- Nagrody losowane i rejestrowane na serwerze po walce są automatycznie
  dopisywane do przypisanej postaci przy synchronizacji z kontem online.
  Nie ma już przycisku „Odbierz nagrodę”.
- Synchronizacja zapisuje stan postaci do chmury PRZED potwierdzeniem
  rozliczenia nagrody. Identyfikatory nagród zapobiegają podwójnemu dopisaniu.

UWAGI
- Jeśli postać nie jest przypisana do konta online albo brak połączenia,
  nagrody czekają bezpiecznie w bazie i zostaną zastosowane po przywróceniu
  synchronizacji. Nie są tracone.
- XP, kredyty i przedmioty nadal są ostatecznie przechowywane w zapisie
  postaci kontrolowanym przez przeglądarkę. Pełna odporność na manipulacje
  wymaga w przyszłości serwerowego zapisu ekwipunku i poziomów.
- Nie uruchamiaj ponownie starszych migracji SQL 013, 014, 020, 022, ponieważ
  mogłyby przywrócić poprzednie funkcje serwerowe.
- Brak resetu postaci i grafik.

TEST
A) Wygraj ekspedycję, wejdź w Wiadomości, otwórz raport; zobacz nazwiska
   i nagrody każdej osoby. Sprawdź item organizatora.
B) Sprawdź, czy EXP, kredyty, złom oraz ewentualny item samoczynnie trafiły
   do postaci — również po odświeżeniu.
C) Przetestuj przerwę w internecie: nierozliczona nagroda powinna zostać
   naliczona przy powrocie połączenia, bez podwajania wartości.

````


---

### Archiwalna notatka: README_0434.txt

````text
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

````


---

### Archiwalna notatka: README_v0452.txt

````text
ASHEN v0.4.5.2 — Laboratorium walk: rozszerzona diagnostyka

INSTALACJA (na v0.4.5.1):
Podmień w repozytorium index.html, js/game.js i css/laboratory.css.
SQL nie jest potrzebny. Pozostałe pliki i grafiki zostają bez zmian.

NOWOŚCI:
- W Laboratorium ustawisz 10/15/20 rund. Poza Laboratorium walki wciąż mają 10 rund.
- Pokazane są PŻ postaci i przeciwnika na starcie.
- Wyniki pokazują średnie PŻ obu stron na końcu walki, średnie obrażenia na rundę, liczbę remisów spowodowanych limitem.
- Zachowano porównanie obecnego zestawu z nożem, 10/100/1000 prób i te same ziarna RNG dla par.
- Bez nagród i zapisu postępów. Brak zmian w serwerowych Ekspedycjach.

TEST: Uruchom 1000 prób z bossem etapu 20 przy 10, 15 i 20 rundach i porównaj rezultaty.

````


---

### Archiwalna notatka: README_042.txt

````text
ASHEN v0.4.2 — Wspólna gospodarka frakcji

INSTALACJA (ważna kolejność):
1. Upewnij się, że w projekcie Supabase została już uruchomiona migracja 017_faction_base.sql z wersji 0.4.1.
2. W Supabase SQL Editor uruchom plik 018_faction_supply_and_contributions.sql z tej paczki.
3. Do katalogu głównego gry na GitHubie skopiuj index.html i katalogi css/ oraz js/ z ZIP-u. Zastąp tylko wskazane pliki.
4. Poczekaj na publikację GitHub Pages i zwyczajnie odśwież stronę. W interfejsie powinno być v0.4.2.

CO NOWEGO:
- Trzy nowe prywatne materiały: żywność, czysta woda, zaopatrzenie medyczne.
- Znaleziska tych materiałów na zwykłych wyprawach we wszystkich trzech lokacjach; brak automatycznego zużycia.
- Dobrowolne, atomowe wpłaty pięciu materiałów z chmurowego zapisu postaci na konto frakcji.
- Ranking zbiorczego wkładu kont/postaci + historia ostatnich 30 transakcji z nazwami.
- Przyszłe budynki (kuchnia polowa, lecznica, warsztat frakcji) są na razie planem; koszty i poziomy obecnych 3 budynków nie uległy zmianie.
- Poprzednie salda i wszystkie historyczne wpłaty pozostają zachowane. Stare nazwy pobieramy z profili online.

WAŻNE:
- Nie ma nowego głodu, nie ma automatycznego zużycia zapasów ani dodatkowych bonusów.
- Dane JSON postaci są nadal podatne na modyfikacje w przeglądarce: ekonomia pozostaje testowa, nieodpowiednia do publicznej gry bez twardej walidacji serwerowej.
- Po wpłacie nie wysyłaj ręcznie starszej wersji zapisu z innego urządzenia. Mechanizm podmienia lokalne saldo aktywnego profilu zgodnie z potwierdzeniem RPC.
- Nazwa postaci w rankingu jest aktualną nazwą konta online; wpłaty przypisywane są do UUID konta, co zapobiega utracie sum po zmianie nicku.

````


---

### Archiwalna notatka: README_0444.txt

````text
ASHEN v0.4.4 — INTEGRACJA, ETAP 1 / AUDYT I POPRAWKA OBRONY

INSTALACJA
1. Wgraj index.html i js/game.js do głównego katalogu istniejącej wersji ASHEN.
2. Zachowaj WSZYSTKIE pozostałe pliki, zwłaszcza js/expeditions.js,
   js/online.js i dotychczasowe migracje Supabase.
3. W nagłówku gry sprawdź v0.4.4.
4. SQL: NIEPOTRZEBNY. Nowe lokacje, nagrody, rzadkość i balans bez zmian.

REALNE ZMIANY
- Jedna funkcja heroDefense() wylicza PŻ, pancerz i unik postaci:
  dla Wypraw, Starć, lokalnego PvP, profilu publikowanego online
  i podsumowania na karcie Postać.
- Naprawione PŻ w PvP i profilu online: Ambulatorium było wcześniej
  pomijane; teraz PŻ liczone jest jak w Starciach i Wyprawach.
- Karta Postać i raport walki mają zgodne obliczenia obrony (w tym dzika).
- Karta Postać zawiera zwijany opis źródeł premii Wypraw / Starć /
  Ekspedycji, bez wydłużania ekranu w stanie domyślnym.
- Poprawiony opis transportu: ładowność i pancerz mają zastosowanie
  na zwykłych wyprawach; poprzedni opis błędnie sugerował brak wpływu.
- Wersja zaktualizowana w index.html i js/game.js.

ZAKRES AUDYTU — ważne, czego JESZCZE NIE łączymy:
- Wyprawy i Starcia używają tej samej funkcji fight() w js/game.js,
  ale różnią się nagrodami, eksploracją i liczbą rund.
- Ekspedycje frakcyjne i PvP online wykonują walkę w Supabase,
  korzystając z publikowanego profilu; to NIE jest ta sama funkcja JS.
- Premie Kuchni, Lecznicy i Warsztatu frakcji są rozliczane w SQL;
  nie dokładano ich do lokalnych Starć ani Wypraw.
- Aktualne reguły przydziału nagród ekspedycji pozostają bez zmian.
- Nie zmieniano dropów ani szans na rzadkość przedmiotów.
- Nie zmieniano ekonomii, doświadczenia ani trudności bossów.

TESTY RĘCZNE
1. Zwiększ Ambulatorium do poziomu 3 i porównaj PŻ na karcie Postać
   ze statystyką w nowym raporcie Starcia i w PvP po synchronizacji.
2. Wybierz dzika; karta Postać powinna pokazać jego pancerz/uniki.
3. Wybierz pojazd z modułem pancerza i rozpocznij Wyprawę;
   w Starciu moduł nie powinien działać.
4. Otwórz 'Skąd pochodzą premie?' i sprawdź podział między tryby.
5. Zweryfikuj, że nagrody ekspedycji wciąż naliczają się raz.

UWAGA: składnię JS sprawdzono lokalnie. Integracja z rzeczywistym Supabase
nie była testowana, dlatego po publikacji zweryfikuj PvP i ekspedycje.

````


---

### Archiwalna notatka: README_0433.txt

````text
ASHEN v0.4.3.3 — Brak możliwości anulowania ekspedycji

WYMAGA wersji v0.4.3.2 i SQL 020.

INSTALACJA:
1. Supabase > SQL Editor: uruchom 021_expeditions_irrevocable.sql.
2. GitHub: podmień index.html oraz js/expeditions.js.
3. Poczekaj na publikację i otwórz grę ponownie.

ZMIANY:
- Organizator nie ma już przycisku „Anuluj wyprawę”.
- Potwierdzenie zakładania informuje o braku anulowania i braku zwrotu kosztów prywatnego wsparcia.
- Serwer blokuje wywołanie starej funkcji anulowania, także dla przestarzałych klientów.
- Nie zmieniono rekrutacji, minimalnej liczby uczestników i automatycznego startu.

UWAGA: jeśli do terminu zbiórki nie zbierze się minimalna liczba uczestników,
obecna logika serwerowa nie rozegra walki. To osobna mechanika do dopracowania.
Nie wdrażano automatycznej porażki ani zwrotu zasobów w takim przypadku.

TEST:
- Utwórz ekspedycję i sprawdź, czy nie ma przycisku anulowania.
- SQL musi zablokować także wywołanie ashen_expedition_cancel z nieaktualnego klienta.

````


---

### Archiwalna notatka: README_0451.txt

````text
ASHEN v0.4.5.1 — Laboratorium walk

INSTALACJA:
1. Uruchomione na v0.4.5: pozostaw dotychczasowy SQL/024 i resztę projektu bez zmian.
2. Wgraj do repozytorium: index.html, js/game.js oraz NOWY plik css/laboratory.css.
3. Otwórz Starcia i rozwiń „Laboratorium walk”.
4. Wybierz przeciwnika (etap 1, 10 lub 20) i 10/100/1000 symulacji, kliknij „Uruchom porównanie”.

LABORATORIUM:
- Ten sam silnik co zwykłe Starcia PvE: funkcja fight() z możliwością podania niezmiennego snapshotu i własnego RNG.
- Dwa zestawy: aktualnie wyposażone bronie vs zwykły nóż; pozostałe atrybuty i pancerz identyczne.
- Dokładnie ten sam przeciwnik w każdej próbie; rezultaty statystyczne: zwycięstwa, remisy, porażki, celność, średnie obrażenia i rundy.
- Po dwie symulacje dla każdego numeru próby przy tym samym początkowym ziarnie RNG.
- Zero przyznawanych nagród, brak save(), brak zmian w stanie gracza i chmurze.
- Panel jest zwinięty domyślnie; wynik istnieje tylko do odświeżenia strony.

OGRANICZENIE:
Laboratorium wykorzystuje silnik lokalnych Starć, NIE uruchamia funkcji PostgreSQL liczącej ekspedycje frakcyjne. Uczciwe porównanie serwerowych Ekspedycji wymaga oddzielnego, bezpiecznego endpointu symulacyjnego.

Nie trzeba uruchamiać SQL ani przesyłać grafik.

````
