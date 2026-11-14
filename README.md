# ASHEN v0.1.45 — Szczęście i eksploracja

- Test eksploracji zależny od Percepcji, Inteligencji i Zręczności; szansa ograniczona do 15–80%.
- Udany test daje 1 dodatkowy przedmiot obok dotychczasowych 1–3 znalezisk.
- Szczęście pochodzi obecnie z wybranych akcesoriów (kompas, gogle, gogle noktowizyjne, naszyjnik, moduł łączności) założonych w trzech slotach.
- Każdy punkt szczęścia przesuwa 1 punkt procentowy szansy ze zwykłych łupów w kierunku dostępnych wyższych rzadkości (maksymalnie 12 punktów procentowych).
- Żadna wyprawa nie daje jakości spoza swojej puli (bliska maks. ulepszone, średnia maks. epickie, daleka do legendarnych).
- Szanse i źródła Szczęścia w Wyprawach, szczegóły eksploracji w raportach i Postaci.
- Parametry eksploracji są zapisywane w chwili rozpoczęcia wyprawy, by zmiana wyposażenia w trakcie wyprawy nie zmieniała wyniku.
- Wsteczna zgodność z dotychczasowym zapisem i raportami.

# ASHEN v0.1.44 — trzy sloty akcesoriów

- Dodano Akcesorium I / II / III; pierwszy slot zachowuje dawny identyfikator `extra` i dotychczasowy przedmiot.
- Trzy niezależne sloty liczą bonusy do atrybutów, także po zapisaniu i odświeżeniu strony.
- Przy przedmiotach-akcesoriach w Ekwipunku pojawiają się przyciski 1 / 2 / 3; przy zajętym slocie symbol ↺ oznacza zamianę.
- Założone akcesoria można otwierać i zdejmować osobno, podobnie jak inne wyposażenie.
- Zgodność starszych zapisów i importów zachowana (`ashen-save-v010`, `version:1`).
- Nie dodano jeszcze Szczęścia ani artefaktów; to kolejne etapy.

# ASHEN v0.1.43 — jakość łupów zależna od wyprawy

- Bliska wyprawa: zwykły 78%, ulepszony 22%; rzadkie, epickie i legendarne **niedostępne**.
- Średnia wyprawa: zwykły 55%, ulepszony 30%, rzadki 13%, epicki 2%; legendarny **niedostępny**.
- Daleka wyprawa: zwykły 37%, ulepszony 29%, rzadki 23%, epicki 9%, legendarny 2%.
- Losowanie jakości każdego zdobywanego przedmiotu odbywa się w obrębie puli danej wyprawy (także łupy dodatkowe od kota).
- W kartach wypraw widoczne są szanse na jakość łupu. Pula *typów przedmiotów*, dotychczasowa liczba łupów, walka i pozostałe nagrody nie zostały zmienione.
- Nie dodano jeszcze Szczęścia ani testu eksploracji — te mechaniki w kolejnych wersjach; ograniczenia maksymalnych rzadkości pozostaną twarde.
- Zapis postaci pozostaje zgodny (`ashen-save-v010`); starsze znalezione przedmioty pozostają bez zmian.
- Następny plan: v0.1.44 trzy sloty na akcesoria; v0.1.45 Szczęście i eksploracja; v0.1.46 artefakty i zestawy rezonansowe; v0.1.47 anomalie i wyjątkowe wydarzenia. Zmiana zestawów wyposażenia pod różne aktywności dopiero, gdy pojawi się walka poza wyprawami.

# ASHEN v0.1.42 — ikony modyfikatorów i podsumowanie obrażeń

- Prefiksy i sufiksy mają własne oznaczenia w Ekwipunku i oknie przedmiotu. Nie dodajemy osobnych plików graficznych.
- Każda nowa walka zapisuje: obrażenia zadane/otrzymane, najlepsze trafienie, próby, trafienia, chybienia, krytyki i rundy.
- Podsumowania pojawiają się bezpośrednio po powrocie z wyprawy, w ostatniej wyprawie i Raportach.
- Dla starszych raportów statystyki są rekonstruowane z linii walki i oznaczone jako przybliżony zapis.
- Mechanika losowania łupów, atrybuty postaci, losowość walki, ekwipunek i zapis pozostają bez zmian.

# ASHEN v0.1.41 — Specjalizacje broni i atrybutów

- Cztery grupy: broń biała jednoręczna (ZRĘ/SIŁ), biała dwuręczna (SIŁ/ZRĘ), palna/technologiczna (PER/ZRĘ) oraz dystansowa niepalna (PER/ZRĘ).
- Celność oraz bonus obrażeń pochodzą z **wspólnych funkcji** używanych przez symulację walki i tabelę Siła bojowa; wynik zależy od rzeczywiście trzymanej broni.
- Siła nie wzmacnia już wprost każdej broni palnej. Wartości skalowano, aby zachować znaczenie bazowych obrażeń przedmiotu, jego rzadkości i poziomu ulepszenia.
- Tabela Siła bojowa podaje specjalizację, główny/pomocniczy atrybut, bonus obrażeń z atrybutów i celność każdej używanej broni.
- Wskazówki przy atrybutach odzwierciedlają nowe zasady.
- Dawne akcesoria z prefiksem Zwinny pokazują odtąd nazwę Refleksyjny (bez zmiany zapisanych identyfikatorów i bonusu +2 ZRĘ). Ubrania z dawnym prefiksem Zwinny nadal liczą się do zestawu Zwinny.
- Bez zmian: zapis `ashen-save-v010`, właściwości posiadanych przedmiotów, mechanika i rzadkość setów, szansa na krytyk, inicjatywa i liczba ataków na rundę.

# ASHEN v0.1.40.2 — Czytelny Ekwipunek i szczegóły setów

- Kolorowe komunikaty o bonusach setów zostały usunięte z głównej listy Ekwipunku, miejsc na wyposażenie oraz skróconych kart przedmiotów. Powrócił zwarty widok.
- Informacja o secie (zielona aktywna / czerwona nieaktywna) jest widoczna dopiero w oknie szczegółów przedmiotu.
- W szczegółach przedmiotu można rozwinąć listę **faktycznie założonych** części danego zestawu, ich jakość, średnią oraz sposób obliczenia bonusu.
- Podgląd niezałożonego elementu nie traktuje go jako założonego, a prognoza uwzględnia zastąpienie przedmiotu w tym samym slocie.
- Panel „Zestawy ubioru” w Postaci pozostaje podsumowaniem rzeczywiście założonych zestawów.
- Bez zmian w balansie, identyfikatorach przedmiotów i kluczu zapisów gry.

# ASHEN v0.1.40.1 – widoczne premie setów i nazewnictwo

- Naprawiono starszy prefiks **Zwinny**: 3 założone ubrania z tym prefiksem aktywują teraz zestaw Zwinny.
- W panelu Postać, Ekwipunku i szczegółach wyposażenia widać premię setu: zieloną dla aktywnych, czerwoną dla nieaktywnych.
- Nieaktywny zestaw pokazuje prognozę premii po założeniu trzech części i liczbę brakujących elementów.
- Ujednolicono pisownię nazw przedmiotów: opisowe człony typu „warty”, „zwiadowcy”, „wędrowca” są pisane małą literą.
- Zachowano dotychczasowe ID, bonusy modyfikatorów, zapis gry i obrazy.
- Względna prognoza uwzględnia aktualną średnią jakość; premia po dobraniu następnego przedmiotu może się zmienić.

# ASHEN v0.1.40 — Siła bojowa

- Zakładka Postać: dynamiczna tabela ATAK / OBRONA z parametrami wynikającymi z założonego wyposażenia i aktywnych setów.
- Liczba ataków na rundę oraz kolejność i siła poszczególnych ataków są liczone przez tę samą funkcję co realna walka.
- Szczegółowe objaśnienia sześciu atrybutów: najedź na symbol informacji lub dotknij go na telefonie.
- Szansa trafienia zależy od przeciwnika, dlatego ekran pokazuje składowe celności, nie fikcyjną stałą szansę.
- Dotychczasowe zapisy (`ashen-save-v010`) i statystyki broni pozostają bez zmian.
- Aktualizacja wymaga tylko `index.html`, `js/game.js`, `css/style.css`, `README.md`.

# ASHEN v0.1.39 — zestawy z prefiksów ubioru

- Trzy założone elementy ubioru z tym samym prefiksem aktywują bonus zestawu.
- Każdy kolejny element (maksymalnie sześć różnych slotów) zwiększa wartość bonusu.
- Siła premii zależy od średniej jakości wszystkich założonych przedmiotów danego zestawu (zwykły ×1, ulepszony ×1,2, rzadki ×1,5, epicki ×2, legendarny ×2,5).
- Bonusy trafiają do rzeczywistych atrybutów postaci lub wartości pancerza podczas walki.
- Siedem zestawów: Wzmocniony, Pancerny, Elastyczny, Lekki, Odporny, Tropicielski i Żelazny.
- W zakładce Postać wyświetla się postęp każdego aktualnie kompletowanego zestawu, a w szczegółach przedmiotu informacja o jego zestawie.
- Zgodność z dotychczasowym kluczem zapisu `ashen-save-v010`; przedmioty z dawnymi prefiksami Wzmocniony, Pancerny i Lekki też wliczają się do zestawów.
- Nowe zasady nie powodują naliczania setów z broni ani akcesoriów.

# ASHEN v0.1.38 — oddzielne prefiksy i sufiksy

- 18 nowych prefiksów: 6 dla broni, 7 dla ubioru, 5 dla akcesoriów.
- 18 nowych sufiksów: po 6 dla każdej kategorii.
- Nazwy i identyfikatory w losowaniu są odseparowane między kategoriami.
- Premie procentowe pancerza losują się tylko na częściach ubioru posiadających bazowy pancerz.
- Prefiks „Szybki” działa na wskazanej lekkiej broni: dodatkowy osłabiony atak w rundzie; „Stabilny” dodaje 8 punktów procentowych do trafienia.
- Negatywny „Złomowy” nie pojawia się w nowych łupach; dawne egzemplarze zachowują się pod nazwą „Odzyskany” z pozytywnym bonusem.
- Dawne sufiksy „Berserkera” i „Mutanta” nie mają już ujemnych kar.
- Istniejące identyfikatory i lokalny zapis `ashen-save-v010` bez zmian. Nowe zestawy aktywowane po 3 prefiksach ubioru będą wdrożone w v0.1.39.
- Aktualizacja: wyłącznie `index.html`, `js/game.js` i `README.md` (3 pliki).

---

# ASHEN v0.1.37.4 — jednolity układ i szczegóły łupów

- Wszystkie strony (włącznie z Pulpitem) mają tę samą maksymalną szerokość i wspólny wygląd menu po lewej.
- Ostatnia zakładka jest zapamiętywana pod osobnym kluczem `ashen-active-page`, niezależnie od zapisu postaci.
- Kliknięcie ikony lub nazwy przedmiotu z łupów w Wyprawach, Raportach i podsumowaniu otwiera okno szczegółów jak w Ekwipunku. Jeśli przedmiot został już sprzedany lub rozłożony, widok katalogowy pokazuje podstawowy opis i grafikę.
- Statystyki prefiksów i sufiksów oraz mechanika gry pozostają bez zmian.
- Do aktualizacji istniejącej instalacji na GitHub Pages wystarczą 3 pliki: `index.html`, `css/style.css`, `js/game.js`. Nie trzeba ponownie wrzucać zasobów `assets`.
- Zapis gry nadal używa `ashen-save-v010` i zachowuje zgodność z poprzednią wersją.

# ASHEN v0.1.37.3 — komplet grafik broni od użytkownika

- Wszystkie 24 bronie z bazy mają osobne grafiki WebP z obrazów przesłanych przez użytkownika.
- Wcześniejsze cztery testowe ilustracje SVG zastąpiono obrazami z nowej serii.
- Grafiki są używane w Ekwipunku, na slocie postaci i w szczegółach przedmiotu.
- Bez zmian nazw, obrażeń, statystyk, rzadkości, dropów i formatu zapisów (`ashen-save-v010`).
- W folderze `assets/items/weapons/` jest 24 plików `.webp`; ich nazwy odpowiadają identyfikatorom z `js/game.js`.
- Jeśli przedmiot ma podobną sylwetkę do innego, pliki można później wymienić bez zmian w kodzie.

# ASHEN v0.1.37.2 — Test czterech grafik broni (SVG)

- Dodano indywidualne ikony SVG dla Zardzewiałego noża (`knife`), Toporka z odzysku (`hatchet`), Pistoletu M-9 (`pistol`) i Karabinu Szabrownika (`rifle`).
- Grafiki wyświetlają się w Ekwipunku, w wyposażonych slotach oraz w oknie szczegółów przedmiotu.
- Zachowano parametry, dropy i format zapisu postaci.
- Ujednolicono numer wersji na `0.1.37.2`.
- To próbny styl ilustracyjny przed stworzeniem grafik dla pozostałej broni.

# ASHEN v0.1.37.1 – uzupełnienie grafik i licznik wyprawy

- Uzupełniono brakujące grafiki: Gogle noktowizyjne, Celownik optyczny, Moduł neurotechniczny, Wzmacniacz odruchów, Komin filtrujący, Rękawice technika, a także grafiki surowców-przedmiotów.
- Bransoleta Strażnika jest teraz akcesorium (`extra`), nie rękawicą (`hands`). Przestarzały zapis jest migrowany bez usuwania przedmiotu.
- Przywrócono licznik i pasek upływu czasu w panelu Wypraw.
- Zachowano klucz zapisu `ashen-save-v010`, numer wersji danych `1`, dotychczasowe ID itemów.

# ASHEN v0.1.37 — Akcesoria i poprawka wersji

- numer wersji został ujednolicony — nagłówek i stopka pobierają teraz tę samą wartość
- usunięto górny komunikat o czasie wyprawy, bo te informacje są już widoczne na panelu wypraw
- dodano komplet akcesoriów z różnymi bonusami i własnymi grafikami:
  - Szal Wędrowca
  - Bandana Zbieracza
  - Gogle Zwiadowcy
  - Okulary Technika
  - Naszyjnik Ocalonego
  - Bransoleta Strażnika
  - Kompas Tropiciela
  - Moduł Łączności
- akcesoria zostały podpięte do ekwipunku jako osobna część wyposażenia

# ASHEN v0.1.36 — Rękawice i karwasze

Osiem indywidualnych grafik WebP podpiętych do wyposażenia, listy ekwipunku oraz szczegółów przedmiotu. Zachowano nazwy, statystyki i identyfikatory z v0.1.35, a także zgodność zapisu. Nowe pliki: `assets/items/hands/*.webp`.

# ASHEN v0.1.35 — Koszulki i nakrycia głowy

Nowości: 11 nowych grafik WebP, realistyczne opisy przedmiotów, bazowy pancerz koszulek i nakryć głowy uporządkowany od najniższego do najwyższego. Maska filtracyjna nadal zajmuje slot głowy. Zapis zachowuje klucz `ashen-save-v010`, ID przedmiotów pozostają bez zmian.

Grafiki: `assets/items/shirts/` (5) i `assets/items/head/` (6).

# ASHEN v0.1.33 — sortowanie i pancerze

Domyślny porządek ekwipunku: legendarne, epickie, rzadkie, ulepszone, zwykłe. Do wyboru jest siedem sposobów sortowania. Preferencja sortowania jest zapisywana razem z postacią. Nowe grafiki WebP: 10 pancerzy, w `assets/items/armor/`; obrazy pojawiają się w ekwipunku, slotach i oknie szczegółów. Podstawowe wartości pancerza ustalono rosnąco od Podartej kurtki do Pancerza Strażnika Zero. Identyfikatory przedmiotów oraz klucz zapisu pozostają bez zmian.

# ASHEN v0.1.32 — Odkrywanie broni i odchudzony ekwipunek

* Szczegóły i statystyki przedmiotów wyświetlane są dopiero po kliknięciu nazwy lub ikony w oknie szczegółów.
* Zarówno ikony, jak i nazwy wyposażenia założonego przy sylwetce otwierają to samo okno.
* Usunięto publiczny katalog całego uzbrojenia, aby gracz odkrywał przedmioty w wyprawach. Usunięto dublujący panel „Założone przedmioty” i panel porównania.
* Nowe kategorie broni dwuręcznej: palna, dystansowa, biała, po 5/3/4 przedmioty; obrażenia bazowe stopniują się zgodnie z ustaloną kolejnością.
* Zachowano identyfikatory wyposażenia oraz format zapisów `ashen-save-v010`.
* Grafiki broni pozostają w przygotowaniu, obecnie używane są czytelne ikony zastępcze.

# ASHEN v0.1.31 — pierwsza seria broni jednoręcznej

- Pełna sylwetka w Ekwipunku jak w zakładce Postać
- Szeroki układ Magazynu, Kryjówki i Raportów
- Rozdział broni jednoręcznej na białą i palną w filtrach
- 12 broni z określoną kolejnością bazowych obrażeń
- Kliknięcie ikony lub nazwy przedmiotu otwiera okno szczegółów
- Katalog 12 broni w Ekwipunku, bez dodawania darmowych egzemplarzy graczowi
- Miejsce na przyszłe zdjęcia przedmiotów i ikony prefiksów/sufiksów
- Zachowane identyfikatory przedmiotów i klucz zapisów `ashen-save-v010`

# ASHEN v0.1.30 — ujednolicone zakładki

Nowe szerokie układy dla Towarzysza, Transportu, Ekwipunku i Warsztatu. Nowe karty dla zwierząt i pojazdów, wyróżnienie aktywnego wyboru, przestronniejsze karty i przyciski. Logika rozwoju, walka, zapisy i koszty bez zmian.

# ASHEN v0.1.29.1 – poprawka szerokości ekranu Postać

Zakładka Postać korzysta z tej samej szerokości co Wyprawy (do 1570 px) oraz tego samego układu nawigacji. Karty Towarzysz i Transport są teraz ułożone jedna pod drugą, z osobnymi miejscami na obraz, tytuł, opis i przycisk. Zmieniono też punkty przełamania układu na tabletach i telefonach. Nie zmieniono logiki gry ani identyfikatora zapisu.

# ASHEN v0.1.29 — zakładka Postać

Dodano pełną sylwetkę postaci w zakładce Postać, przebudowano układ ekranu w stylu ekranów Wypraw oraz dodano widoczność aktualnego towarzysza i środka transportu bezpośrednio w tym panelu.

Nowe pliki: `assets/characters/*-full.png`.

# ASHEN v0.1.28.1 — poprawa czytelności

Globalnie zastąpiono ciasną czcionkę nagłówków i przycisków czytelnym krojem interfejsowym. Zachowano metaliczne faktury, ale ograniczono cienie napisów, poprawiono odstępy i wysokości linii. Butelka z płynem jest podpisana **Chemikalia**. Wewnątrz zapisu gry klucz `tworzywo` pozostaje niezmieniony, aby starsze zapisy nadal działały. Usunięto zdublowany górny komunikat o zwycięstwie; wynik pozostaje w głównym raporcie wyprawy.

Wgraj `index.html`, `css/style.css`, `js/game.js`. Grafiki nie uległy zmianie.

# ASHEN v0.1.28 – surowce i przyciski z przetartej blachy

Odświeżona oprawa ekranu Wypraw: osobne grafiki sześciu zasobów w `assets/ui/resources/`, tekstura metalu `assets/ui/rusted-orange.webp`, spójne przyciski w panelach i poprawiona typografia. Usunięto górny komunikat „Wyprawa rozpoczęta…”, zachowując licznik trwającej wyprawy. Logika, raporty i zapis gry pozostają zgodne z wersją 0.1.27.

Wgraj całą zawartość paczki do głównego katalogu repozytorium i zachowaj strukturę folderów. Przed aktualizacją wyeksportuj plik JSON zapisu postaci.

# ASHEN v0.1.27 — Wyprawy (redesign i narracja)

- 15 autorskich opisów fabularnych dla każdej z trzech lokacji (45 łącznie); ostatni wariant danej lokacji nie powtarza się bezpośrednio.
- Po powrocie z wyprawy u góry ekranu Wyprawy automatycznie pojawia się opowieść, łupy i nagrody.
- W dolnym panelu przyciski Raport i Łupy rozwijają zawartość na miejscu, bez opuszczania Wypraw.
- Poprawiona siatka kart i wyśrodkowanie treści, nowe przyciski z cieniami, czytelna typografia.
- Zachowano dotychczasowy zapis (`ashen-save-v010`) i całą mechanikę rozgrywki.

Wgraj zawartość ZIP do katalogu głównego GitHub, zachowując ścieżki. Zaktualizuj szczególnie `index.html`, `css/style.css`, `js/game.js`.

# ASHEN – Kroniki Upadku v0.1.26

- Wyprawy: wybór lokacji jest pierwszy; trzy nowe grafiki WebP; ostatni raport na dole; nie pokazujemy przykładowych łupów.
- Wyprawy trwają 5/10/15 sekund w wersji testowej. Pojazdy realnie skracają czas. Po powrocie walka rozstrzyga się automatycznie.
- Postać: stały wizerunek powiązany z pochodzeniem (zwiadowca/najemnik/mechanik), wybieranym na początku gry.
- Towarzysz: pies, kot lub sokół, wybór od poziomu 20. Każde zwierzę ma inny bonus.
- Transport: rower, motocykl, stary samochód, terenówka, van, kamper, ciężarówka; koszty i poziomy odblokowania; dwa usprawnienia.
- Zapis: lokalStorage `ashen-save-v010` i import/eksport JSON zgodne z poprzednimi wersjami.

Wgraj zawartość ZIP do głównego katalogu repozytorium, podmieniając `index.html`, `css/style.css`, `js/game.js`, i dodaj foldery `assets/missions`, `assets/characters`, `assets/companions`. Zachowaj istniejące `assets/bunker`.

## Uwagi
Grafiki postaci są pierwszymi statycznymi wariantami portretów. Nie odzwierciedlają zakładanego ekwipunku postaci. Bonusy i koszty są testowe i będą balansowane w przyszłości.

# ASHEN – Kroniki Upadku v0.1.24

Nowość: trzy poziomy tła sypialni Schronu 17 oraz poprawione ustawienie mebli. Rozbudowa sypialni od razu zmienia wygląd pomieszczenia: poziom 1 jest zaniedbany, poziom 2 uporządkowany i odnowiony, a poziom 3 surowy, nowoczesny i niemal idealny. Skorygowano też położenie łóżka, stołu i szafki, aby nie nachodziły na siebie.

Przy aktualizacji wgraj `index.html`, `js/game.js` oraz nowe pliki tła do `assets/bunker/rooms/`. Nie usuwaj `assets/` ani danych przeglądarki. Starsze zapisy są zachowane.

# ASHEN – Kroniki Upadku v0.1.24

Nowość: rozbudowa sypialni, magazynu i warsztatu do poziomu 3. Sypialnia daje +3/+6% PD, magazyn +10/+20% odzysku, warsztat −5/−10% kosztów materiałów i kredytów. Koszty i wymagane poziomy postaci są widoczne w Kryjówce. Meble pozostają dekoracyjne.

Przy aktualizacji wgraj `index.html`, `css/style.css`, `js/game.js`. Nie usuwaj `assets/` ani danych przeglądarki. Starsze zapisy są zachowane.

# ASHEN v0.1.20 – Meble sypialni

Pierwsze realistyczne wyposażenie pomieszczenia: łóżko, stolik i metalowa szafka. Grafiki przechowywane oddzielnie w `assets/bunker/furniture/`. Zachowano lokalny zapis i dotychczasowe funkcje gry. Przed wymianą plików warto wyeksportować zapis JSON.

## Wgrywanie na GitHub

Wgraj całą zawartość tej paczki do katalogu głównego repozytorium (nie folder nadrzędny). W szczególności podmień `index.html`, `js/game.js` i dodaj trzy pliki `.webp` do `assets/bunker/furniture/`. Nie publikuj plików zapisu JSON – zawierają dane postaci.

# ASHEN – Kroniki Upadku

Przeglądarkowe RPG postapokaliptyczne. Aktualna wersja: **0.1.18**.

## Co jest w repozytorium?

- `index.html` – strona uruchamiająca grę
- `css/style.css` – wygląd gry
- `js/game.js` – mechaniki i aktualne definicje przedmiotów
- `assets/` – przygotowane katalogi na przyszłe grafiki (na razie zawierają tylko pliki `.gitkeep`)
- `data/` – miejsce na przyszłe pliki z danymi (na razie bez `items.json`)

**Ważne:** obecne ikony i grafiki schronu są generowane przez kod CSS/JavaScript. To jeszcze nie jest zestaw osobnych plików PNG/WebP. Dodamy je później.

## Publikowanie przez GitHub Pages

1. Utwórz repozytorium `ashen-game` na GitHubie.
2. Rozpakuj archiwum i wgraj **zawartość** folderu `ashen-game`, nie sam plik ZIP i nie folder nadrzędny.
3. W ustawieniach repozytorium przejdź do **Settings → Pages**.
4. Wybierz **Deploy from a branch**, gałąź **main**, folder **/(root)** i kliknij **Save**.
5. Po opublikowaniu gra będzie dostępna pod adresem `https://TWOJ_LOGIN.github.io/ashen-game/`.

## Zapisy gry – bardzo ważne

Gra używa obecnie `localStorage` w przeglądarce. **Postęp z lokalnych plików HTML nie przeniesie się automatycznie na adres GitHub Pages.** Plik projektu nie zawiera Twojego zapisu postaci. Zrób kopię zapisu przed przejściem na Pages. Obecna wersja umożliwia eksport i import JSON oraz przywrócenie poprzedniego zapisu z kopii przechowywanej lokalnie. Przed importem lub resetem gra automatycznie zachowuje poprzedni zapis w przeglądarce. Zalecamy również pobranie pliku JSON jako niezależnej kopii.

Dane gry są zapisywane osobno w każdej przeglądarce i na każdym urządzeniu. GitHub Pages nie zapewnia kont użytkowników, wspólnych zapisów ani bezpiecznego serwera gry.

## Aktualizacje

Podmieniaj `index.html`, `css/style.css` i `js/game.js`, gdy zmieniamy kod gry. Grafiki umieszczaj w odpowiednich podfolderach `assets/`. Nie zapisuj w repozytorium prywatnych danych ani eksportowanych zapisów gry.

## Uwaga

To prototyp offline przeznaczony do testów, nie gotowa gra wieloosobowa.

## Jak przenieść wcześniejszą postać?

1. Otwórz poprzedni plik HTML z grą, a następnie w Kryjówce kliknij **Eksportuj zapis JSON**.
2. Na opublikowanej stronie GitHub Pages otwórz **Kryjówka → Importuj zapis JSON** (lub **Wczytaj istniejącą postać** na ekranie tworzenia postaci).
3. Wybierz plik JSON i potwierdź import. Strona odświeży się z przywróconą postacią.
4. W razie pomyłki użyj **Przywróć poprzedni zapis**. Kopia w przeglądarce jest pojedyncza i może zostać zastąpiona kolejnym importem/resetem; warto zachować eksport na dysku.

**Nie publikuj plików zapisu postaci na publicznym GitHubie.**

## Poprawka v0.1.19
Po potwierdzeniu importu postać jest aktywowana od razu bez przeładowywania strony; zapis jest weryfikowany w localStorage. Zaktualizowano odwołanie do JS w index.html, aby ograniczyć problem starego pliku w pamięci podręcznej.


## v0.1.19 — pierwsze tło graficzne Schronu 17

W sypialni zastosowano realistyczne tło `assets/bunker/rooms/bedroom-base.webp`. Meble i dekoracje nadal są niezależnymi elementami SVG, a ich wybór jest wyłącznie kosmetyczny. Na GitHub należy przesłać także nowy plik WebP, zachowując strukturę folderów.


### v0.1.21 — umeblowanie
- Poprawione proporcje i pozycje: większe łóżko na podłodze, szafka bliżej ściany, stół na środku.
- Trzy warianty łóżka, stołu i szafki: od 1. poziomu, następne od poziomów 20 i 30.
- Tworzenie i ulepszanie mebli kosztuje złom, inne surowce i (wyższe warianty) kredyty.
- Łóżko jest obowiązkowym miejscem do spania; przed wykonaniem łóżka polowego bohater ma prowizoryczne posłanie.
- Wszystkie meble są wyłącznie wizualne. Bonusy będą związane z przyszłą rozbudową pomieszczeń.
- Starsze zapisane meble zostają uznane za posiadane na poziomie 1 bez ponownego kosztu.
- Wyższe warianty mają tymczasowe zmiany wizualne; pełne grafiki powstaną później.


### v0.1.22 — poprawione osadzenie mebli
- Grafiki mebli zostały przycięte do rzeczywistych konturów, bez dużych przezroczystych marginesów. Dzięki temu rozmiary w silniku odpowiadają widocznym meblom.
- Łóżko i szafka stoją teraz niżej, z nogami na poziomie podłogi; stół jest bliżej środka.
- Aktualizacja obejmuje pliki WebP (koniecznie wgraj je ponownie do repozytorium), `js/game.js` i `index.html`.
- Bez zmian w zapisie gry, cenach mebli i mechanice.


## v0.1.34
- dodano grafiki dla 5 par spodni i 5 par butów,
- podpięto grafiki w ekwipunku i w oknie szczegółów przedmiotu,
- poprawiono nazwy: `Zniesione trampki` → `Zniszczone trampki`, `Buty uszczelnione` → `Buty trapera`.
