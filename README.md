# ASHEN v0.2.7 — stabilizacja multiplayera

- Powiązanie lokalnego profilu ze **ściśle określonym kontem i projektem** Supabase (zamiast tylko numeru slotu).
- Po aktualizacji **każde konto wymaga jednorazowego ręcznego wysłania swojej postaci**, aby odnowić bezpieczne powiązanie. Stare dane lokalne i rekordy chmurowe pozostają bez zmian.
- Automatyczny zapis ogranicza zbędne próby, ponawia nieudany zapis po 10 sekundach i ponawia po przywróceniu Internetu.
- Wyświetla status automatycznej synchronizacji.
- Po zmianie konta czyści poprzednie listy graczy, raporty i wiadomości, aby nie wyświetlać cudzych danych.
- Zawiera dodatkowy, **opcjonalny** skrypt SQL `004_message_limits.sql`, ograniczający spam prywatnych wiadomości.
- Nie usuwa tabel ani zapisów, nie zmienia formuł PvP, klanów jeszcze nie dodaje.
- **Nie chroni jeszcze przed oszustwami klienta** ani konfliktami przy jednoczesnej grze na kilku urządzeniach.
- Pracuj wyłącznie w projekcie Supabase ASHEN; ALLADYN musi pozostać osobny.

## ASHEN v0.2.6.1 — poprawki raportu PvP online

- Pełne sylwetki obu graczy w ramkach bez przycinania.
- Zawsze własna postać po lewej (dla obrońcy zamieniona kolejność względem rekordu serwera).
- Statystyki, paski PŻ, obrażenia rund i wynik pokazane z perspektywy właściciela raportu.
- Brak zmian SQL / serwera i brak zmian lokalnych zapisów.

## ASHEN v0.2.6 — wspólny wygląd raportów Starcia / PvP online

Raport online otwiera się teraz w oknie podobnym do Starć, używając wspólnych klas CSS: portrety, porównanie statystyk, rundy, paski PŻ, wynik i tabela obrażeń. Zachowano obsługę starych raportów oraz istniejące połączenie Supabase. Nie trzeba uruchamiać nowego SQL.

# ASHEN v0.2.5.1 — poprawka podglądu raportu online

- Przycisk „Pokaż raport walki” w Wiadomościach online wyświetla teraz pełny raport obrony bezpośrednio pod treścią wiadomości.
- „Wróć” z raportu wraca do wiadomości, a „Wróć do listy” zamyka wiadomość.
- Nie trzeba zmieniać SQL ani bazy Supabase. Zmiana dotyczy wyłącznie interfejsu.
- Dla uniknięcia cache zwiększono wersję zasobów do 0.2.5.1.

# ASHEN v0.2.4 — konta i zapis w chmurze

- Nowy przycisk **☁ Konto online**. Opcjonalne połączenie z prywatnym Supabase Free, rejestracja/logowanie, ręczna kopia zapisu i ręczne pobieranie.
- Bezpieczne polityki RLS: konto widzi tylko własny zapis.
- Zapis lokalny pozostaje podstawą prototypu, konta nie działają jeszcze jako sieciowe PvP ani wiadomości.
- Instrukcja: `multiplayer/URUCHOMIENIE_0.2.4.md`; SQL: `multiplayer/supabase/002_cloud_saves.sql`.

## ASHEN v0.2.3 — PvP i Wiadomości

- Każdy atakujący może wykonać maksymalnie **2 ataki dziennie na wybranego obrońcę** (limit osobno dla każdej pary); w lokalnym prototypie reset jest o północy według zegara przeglądarki.
- Trzeci atak na tę samą osobę tego dnia jest blokowany, a inne cele mają osobne limity.
- Obrońca otrzymuje automatyczną wiadomość o ataku i link do szczegółowego raportu PvP.
- Nowa zakładka **Wiadomości**: Odebrane, Wysłane, odczyt/nieodczyt, odpowiedz, pisanie do innej postaci testowej.
- Prywatne wiadomości oraz powiadomienia o walkach zapisują się lokalnie w oddzielnych profilach.
- Bez przejmowania ekwipunku, bez trwałych obrażeń HP, bez potrącania zasobów.
- To nadal symulator offline. W przyszłym multiplayerze limit i doręczenie wiadomości muszą być egzekwowane przez serwer według wspólnej strefy czasowej (docelowo Europe/Warsaw).

## ASHEN v0.2.2 — lokalne PvP

- Nowa zakładka PvP, walka między zapisanymi profilami testowymi.
- Każdy walczy na podstawie własnych atrybutów, wyposażenia, zestawów i broni.
- Maksymalnie 10 rund, inicjatywa, trafienia, uniki i krytyki, raport każdej rundy.
- Oddzielne HP dla każdej walki. Brak trwałych obrażeń oraz strat ekwipunku, zasobów lub EXP.
- Wynik walki zapisuje się po stronie atakującego i obrońcy; ranking lokalny.
- Jest to prototyp offline, nie prawdziwa rozgrywka sieciowa.

## Zmiany w v0.2.1

- 5 slotów postaci (1 główna + 4 testowe).
- Wybór płci: mężczyzna / kobieta.
- 3 pary archetypów 1:1: Zwiadowca/Zwiadowczyni, Wojownik/Wojowniczka, Technik/Techniczka.
- Duże karty z pełnymi sylwetkami na ekranie tworzenia postaci.
- Pełne karty w panelu profili.

# ASHEN v0.2.0.2 — naprawa resetu profili testowych

- Reset Testera korzysta z dwustopniowego potwierdzenia **w samej grze**, bez natywnego okna `confirm()`.
- Po potwierdzeniu zapis Testera zostaje zastąpiony czystą postacią, a gra automatycznie otwiera właśnie tego Testera, wyświetlając tworzenie bohatera.
- Przed resetem przechowujemy lokalną kopię poprzedniego zapisu Testera (`-backup-before-reset`).
- Reset nie zmienia zapisu głównej postaci i innych profili.
- Aktualizacja wersji i parametrów cache w `index.html`.
- Przed instalacją zalecamy wyeksportowanie najważniejszych zapisów do plików JSON.
- Nadal jest to lokalne laboratorium offline, nie multiplayer online.

# ASHEN v0.2.0.1 — poprawka niezależności profili

- Każdy profil testowy odczytuje i zapisuje dane pod osobnym kluczem; nie podmieniamy już wspólnego zapisu przy przełączaniu.
- Klucz `ashen-save-v010` jest zarezerwowany dla głównej postaci. Dodano ostrożną migrację danych z v0.2.0.
- Każdy Tester ma przycisk **Nowa postać / reset**. Użyj go, jeśli tester utworzony w v0.2.0 ma skopiowany ekwipunek lub historię. Przed resetem zostaje zapisana lokalna kopia Testera.
- Poprawiono numer wersji skryptu w `index.html`, aby przeglądarka pobierała nowy kod.
- Przed aktualizacją zalecany eksport zapisu głównej postaci z zakładki Kryjówka.
- Nie ma jeszcze prawdziwych kont online ani PvP.

# ASHEN v0.2.0 — Fundament multiplayer (offline)

- Nowy przełącznik niezależnych lokalnych profili testowych (maksymalnie 8).
- Poprzednia postać i zapis `ashen-save-v010` pozostają zachowane.
- Przygotowany schemat SQL pod prywatny projekt Supabase: `multiplayer/supabase/001_schema.sql`.
- Dokument architektury, zaufania serwera i kolejnych kroków: `multiplayer/ARCHITEKTURA.md`.
- **To jeszcze nie jest działający multiplayer, nie ma logowania ani synchronizacji online.**
- Do GitHuba wrzuć wyłącznie zawartość ZIP-a ze zmienionymi plikami, zachowując ścieżki.

## ASHEN v0.1.61 — Rdzeń Otchłani

## Zmiany w v0.1.61

- Dodano Rozdział V Starć: **Rdzeń Otchłani** (poziomy 41–50).
- Dodano 10 nowych przeciwników oraz bossa kończącego pierwszy cykl Starć.
- Dodano komplet nowych grafik przeciwników `starcia-41.webp` do `starcia-50.webp`.
- Zaktualizowano ekran Starć do pełnej ścieżki 50 etapów i odblokowano Rozdział V.
- Boss z poziomu 50 przy pierwszym zwycięstwie daje epicki pancerz **Pancerz strażnika Zero** (`sentinel`).


- Nowy rozdział Starć IV: poziomy 31–40 i 10 unikalnych przeciwników z osobnymi portretami.
- Poziom 40: Strażnik Zero, czwarty boss; jednorazowa nagroda epicka, zabezpieczony egzoszkielet.
- Cztery rozdziały w przełączniku; tryb testowy pozwala walczyć na poziomach 1–40 bez nagród i postępu.
- Zachowano limit 10 rund, remis, historię raportów, portrety i zapis istniejącego postępu.
- Statystyki i nagrody wstępne — ostateczny balans po ukończeniu rozdziału V.

## ASHEN v0.1.59.1 — Tryb testowania Starć

- Przełącznik trybu testowego w zakładce Starcia pozwala wybrać dowolny z 30 etapów, niezależnie od postępu.
- W teście działa pełny silnik walki i raport modalny; brak nagród, doświadczenia, liczników i zapisów historii.
- Po wyłączeniu trybu wracają normalne blokady i przyznawanie nagród.
- Nie zmieniono mechaniki, balansu ani zapisanych postępów.
- Przełącznik jest sesyjny (po odświeżeniu wyłączony).

## v0.1.58.5 — Poprawka synergii Ekwipunku

- Usunięto ograniczenie wyświetlania do trzech nieaktywnych zestawów ubioru w sekcji Synergie w Ekwipunku.
- Nieaktywne zestawy pokazują postęp aktywacji 1/3 lub 2/3; po aktywacji pozostaje licznik do sześciu części i wzmacnianie premii.
- Zakładka Postać i Ekwipunek korzystają z tego samego źródła setResults(); bez zmian w balansie, naliczaniu premii, zapisie gry i przedmiotach.

## ASHEN v0.1.58.4 — poprawki raportów Starć

- Raport Starcia otwiera się jako okno modalne nad planszą. Zamknięcie: przycisk, kliknięcie poza oknem lub Esc.
- Nad statystykami znajdują się portrety obydwu walczących w podobnym kadrze (istniejące portrety klas postaci i przeciwników).
- Zakres obrażeń bohatera zapisywany jest w chwili walki dla każdego ataku; wartości historyczne bez zapisanych danych pozostają oznaczone jako niedostępne.
- Statystyki z większą wartością mają kolor zielony, niższą czerwony, a równe pomarańczowy. Przy braku danych kolor neutralny.
- Wszystkie rundy są domyślnie zwinięte, w tym ostatnia.
- Zapis rozgrywki, 10-rundowy limit i wyniki pozostają bez zmian.

# ASHEN v0.1.58.2 — raporty walk inspirowane BW

- Przed starciem zapisywany jest stan statystyk obu stron (PŻ, pancerz, unik, celność, ataki), wraz z atrybutami i konfiguracją broni bohatera.
- Każda runda osobno: zadane/otrzymane obrażenia, PŻ obu stron `aktualne / maksymalne`, pasek zdrowia i możliwość rozwinięcia wydarzeń rundy.
- Podsumowanie po walce: pozostałe PŻ bohatera i przeciwnika z mianownikiem, powód zwycięstwa/remisu/porażki oraz oryginalna tabela obrażeń.
- Starsze raporty nie mają historycznych statystyk ani rozpiski PŻ dla rund. Gra jasno informuje o braku tych danych i nadal pokazuje zapisany dziennik, bez zmyślania wartości.
- Bez zmian limitu 10 rund, balansu walk, nagród, postępu i struktury zapisu.
- Podmień `index.html`, `js/game.js` i `css/style.css`; `README.md` opcjonalnie.

# ASHEN v0.1.58.1 — Remis po dziesięciu rundach

- Maksymalny czas walki w Starciach nie zmienia się: **10 rund**.
- Gdy obie strony mają PŻ po dziesiątej rundzie, wynik to **REMIS** w pomarańczowym kolorze.
- Remis nie przyznaje nagród ani nie odblokowuje następnego etapu; ponowienie starcia jest możliwe.
- W oknie potwierdzającym oraz w zakładce Starcia wyjaśniono zasady.
- Raport pokazuje powód zakończenia i pozostałe PŻ obu stron.
- Wynik jest spójny w dzienniku Starć i zakładce Raporty.
- Starsze zapisane walki z pozostałymi PŻ obu stron także będą wyświetlane jako remisy, bez zmiany zasobów.
- Silnik Wypraw i balans przeciwników pozostawiono bez zmian.
- Wystarczy podmienić `index.html`, `js/game.js`, `css/style.css` (README opcjonalnie).

# ASHEN v0.1.58 — Starcia 11–20

- Rozdział II: Ziemie bezprawia, poziomy 11–20, dziesięć nowych przeciwników i unikalnych portretów.
- Boss na poziomie 20: Egzekutor, jednorazowy zabezpieczony epicki łup.
- Dwa przełączane rozdziały, wspólny i zachowany postęp Starć, osobne raporty.
- Trudność orientacyjna — bez finalnego balansu.
- Wgranie aktualizacji nie kasuje dotychczasowego zapisu.

ASHEN v0.1.57 — Starcia Pustkowi (Rozdział I: etapy 1–10).

Dodano: osobna zakładka Starcia z 10 unikalnymi grafikami przeciwników, bossem na etapie 10, niezależnym od poziomu postaci odblokowywaniem kolejnych starć, automatyczną walką opartą na dotychczasowym wyposażeniu, historią prób i raportami obrażeń, nagrodami za pierwsze zwycięstwo oraz mniejszymi nagrodami za powtórki.

Zapis pozostaje lokalny (ashen-save-v010), bez resetowania istniejących postaci.

ASHEN v0.1.56.3 — rezonanse artefaktów liczą osobne założone egzemplarze (UID), także powtórzone typy. Działa niezależnie dla prefiksu i sufiksu. Zaktualizowane opisy. Bez zmiany zapisów i zestawów odzieży.

ASHEN v0.1.56.2 — poprawa układu slotów wokół postaci. Karty z prawej i lewej strony mieszczą się w panelu Ekwipunku, bez wychodzenia poza ramkę.

## ASHEN v0.1.56.1
- Załóż/Zdejmij bezpośrednio w oknie szczegółów, obsługa wyboru ręki i trzech slotów akcesoriów.
- Łączne obrażenia wszystkich ataków na rundę, z rozwijaną rozpiską; wartości przed redukcją pancerza/unikami/krytykami.
- Zwarta lista przedmiotów, statystyki i akcje rozwijane dopiero po kliknięciu.
- Filtry pogrupowane: broń, odzież, akcesoria i artefakty.

ASHEN v0.1.55.1 — jeden styl paska zasobów jak we Wyprawach na wszystkich ekranach; usunięto przyciski Podgląd i panel Wybrany przedmiot z Ekwipunku, szczegóły nadal otwierają się bezpośrednio po kliknięciu ikony lub nazwy. Bez zmian mechaniki i zapisów.

ASHEN v0.1.55 — Ekwipunek premium: uporządkowane sloty, wyróżnienie wybranego wyposażenia, karta podglądu z modyfikatorami i aktywnym zestawem, rozszerzone style szczegółów, podpowiedzi prefiksów/sufiksów pozycjonowane w oknie przeglądarki. Mechanika i zapisy bez zmian.

ASHEN v0.1.54.5 — poprawiony, kompaktowy pasek zasobów poza zakładką Wyprawy; pełne tooltipy prefiksów i sufiksów przy wyposażeniu; roszady i lustrzane odbicia grafik samochodu osobowego oraz vana zgodnie z uwagami testowymi.

ASHEN v0.1.54.4 — stały pasek zasobów na wszystkich zakładkach, bez zdublowanych paneli ekwipunku i magazynu. Oznaczenie zajętej ręki przy dwuręcznej broni; widoczne ikony prefiksu i sufiksu przy wyposażeniu postaci; usunięcie spoilerowej planszy rozwoju towarzyszy; nowe warianty samochodu i vana.

## ASHEN v0.1.54.2 — naprawa odświeżania grafik sypialni

Podmiana trzech scen sypialni 1–3; wymuszenie przeładowania obrazów po aktualizacji dzięki parametrze wersji w adresie plików. Wgrywaj pliki zachowując strukturę katalogów, zastępując poprzednie wersje. Mechanika gry i zapisy pozostają niezmienione.

# ASHEN v0.1.54 — Kryjówka: 15 gotowych scen

- Sypialnia, magazyn i warsztat mają po pięć etapów rozwoju (15 scen).
- Nowe obrazy są w jednym formacie 1280 × 720 (16:9), równo wykadrowane. Zmieniono wyłącznie kadry: bez przemalowywania wnętrz.
- W nowych ilustracjach magazynu i warsztatu nie ma już dużych pustych połaci podłogi.
- Ściany, oświetlenie i wyposażenie widocznie ewoluują z poziomem każdego pomieszczenia.
- Koszty poziomów 4 i 5 są wstępne, do testów balansu. Bonusy rozbudowy: sypialnia +3% PD na poziom, magazyn +10% odzysku, warsztat −5% kosztu ulepszeń na poziom.
- Cofanie poziomów nadal działa testowo bez zwrotu materiałów; powrót do wcześniej opłaconego poziomu jest darmowy.
- Stare zapisy pozostają zachowane.
- Aktualizacja podmienia pliki gry i 15 obrazów w assets/bunker/rooms/.

# ASHEN v0.1.48 — Anomalie i wydarzenia Rezonansu

- Bliskie wyprawy: 18% szansy na zjawisko, średnie: 32%, dalekie: 50%. Brak anomalii pozostaje możliwy.
- Sześć autorskich wydarzeń, w tym Echo nieobecnych, Błysk drugiej szansy, Szept w przewodach, Martwy depozyt, Strefa ciszy i Puls Pustkowi.
- Zdarzenia mogą modyfikować Szczęście, skuteczność eksploracji, nagrodę złomu lub dawać dodatkowe znalezisko.
- Trzyczęściowe sety rezonansowe neutralizują negatywny efekt zagrożeń; ich ochrona jest pokazana w raporcie.
- Anomalie są losowane po zakończeniu wyprawy i zapisywane we wszystkich wariantach raportu; stare raporty bez zdarzeń wyświetlają się jak dotąd.
- Nie zmieniono podstawowych szans rzadkości ani ich limitów na konkretnych wyprawach, ekwipunku, walki ani klucza zapisu.
- Następny etap: zebrać uwagi do v0.1.43–0.1.48, sprawdzić balans i poprawić zgłoszone błędy przed nowymi aktywnościami bojowymi.

# ASHEN v0.1.46 — Szczęście i eksploracja

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
- Następny plan: v0.1.44 trzy sloty na akcesoria; v0.1.46 Szczęście i eksploracja; v0.1.46 artefakty i zestawy rezonansowe; v0.1.48 anomalie i wyjątkowe wydarzenia. Zmiana zestawów wyposażenia pod różne aktywności dopiero, gdy pojawi się walka poza wyprawami.

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
- Liczba ataków na rundę 

## v0.1.56
- premium pass dla zakładki Ekwipunek
- nowy panel podsumowania postaci, obrażeń i synergi
- uporządkowana lista przedmiotów z lepszymi badge'ami i akcjami
- zachowana pełna funkcjonalność ekwipowania, sprzedaży, rozkładania i tooltipów


## v0.1.58.3 — raport Starć na osobnym ekranie
- Po Starciu ekran automatycznie pokazuje pełny raport; powrót do planszy osobnym przyciskiem.
- Postęp: zwycięstwa zielone, porażki czerwone, remisy pomarańczowe. Liczniki porażek i remisów są utrwalane; przy migracji starych zapisów rekonstruowane wyłącznie z zachowanej historii (do 40 raportów).
- Usunięty zdublowany oryginalny dziennik zdarzeń.
- Rozszerzona pionowa tabela porównawcza postać/przeciwnik; przeciwnik ma opisowy profil taktyczny wyliczony z realnych parametrów walki, niewpływający dodatkowo na mechanikę.


## v0.2.5 — test multiplayera
Dodano odrębne PvP online rozliczane przez PostgreSQL oraz internetową skrzynkę wiadomości. Instalacja: `multiplayer/URUCHOMIENIE_0.2.5.md`. Offline PvP działa bez zmian.
