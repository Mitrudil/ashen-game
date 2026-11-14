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
