# ASHEN v0.3.9.2 — Wybór etapów pojazdów

## Zmiany

- Pojazd zachowuje najwyższy zakupiony etap (1–3) i pozwala swobodnie przełączać się między etapami już odblokowanymi. Przyszłe etapy nie są widoczne jako opcje.
- Aktywny etap jest zapisywany osobno dla każdego pojazdu, bez kosztów za przełączanie.
- Wybrany etap kontroluje grafikę Garażu, grafikę i opis w zakładce Postać oraz premię do szybkości wypraw.
- Ulepszanie pojazdu korzysta z najwyższego kupionego poziomu, a nie z poziomu tymczasowo wybranego, dzięki czemu nie można kupić tego samego etapu ponownie.
- Zakup nowego etapu automatycznie go aktywuje, ale niższe wciąż pozostają dostępne.
- Starsze zapisy automatycznie startują z najwyższym zakupionym etapem każdego pojazdu.

## Instalacja

Wgraj `index.html` i `js/game.js` do głównego katalogu repozytorium, zastępując obecne pliki. Grafiki oraz SQL nie wymagają zmian.

## Test

1. Wybierz pojazd z wykupionym etapem 3/3. Kliknij „Etap 2”.
2. Sprawdź, czy w Transporcie i zakładce Postać widać obraz etapu 2 oraz premię jego szybkości.
3. Wróć na etap 3 bez wydawania zasobów; przełącz na inny pojazd i z powrotem. Wybrane etapy powinny się zachować.
4. Nowa postać z etapem 1/3 nie powinna mieć przycisków etapów 2 i 3.

# ASHEN v0.3.8 — Towarzysze Pustkowi

## Nowości

- **Kolekcja zwierząt:** pies tropiciel, kot cieni, kruk zwiadowca i dzik pustkowi. Można posiadać wszystkie cztery, ale **tylko jeden jest aktywny**. Po zdobyciu zwierzęcia można je aktywować ponownie bez kolejnej opłaty.
- **Zachowanie poprzednich zapisów:** dotychczas aktywne zwierzę automatycznie trafia do kolekcji, a dotychczasowe etapy szkolenia pozostają zachowane.
- **Nowe doświadczenie zwierząt:** osobny poziom 1–10 dla każdego zdobytego zwierzęcia. Doświadczenie zdobywa **aktywny** zwierzak podczas zakończonych zwykłych wypraw i zwycięskich Starć (bez trybu testowego). Wyższe poziomy zwiększają efekt jego aktualnego bonusu o 1,5% za poziom ponad pierwszy, maksymalnie o 13,5%. To dodatkowy mnożnik, nie +13,5 punktu procentowego szansy na łup.
- **Dotychczasowe etapy treningu 1–3 działają oddzielnie**. Rozwój Legowiska także nadal wzmacnia aktywnego zwierzaka.
- **Tryb testowy:** pozwala odblokować dowolne zwierzę i jego etap bez kosztów. Odblokowane zwierzęta zostają na liście. Nie trzeba czekać na poziom postaci 20, aby wypróbować system.
- **Wersjonowanie grafik:** adresy nowych grafik kryjówki i grafik zwierząt zawierają numer wersji gry, aby przeglądarka nie wyświetlała starych plików z cache.
- **Najnowsze grafiki pomieszczeń:** do pełnej gry dołączono zaakceptowane poprawki Legowiska (w tym osobną poprawkę poziomu 3), Garażu i Ambulatorium.

## Ważne ograniczenia

- Wersja 0.3.8 nie dodaje jeszcze nowych gatunków, umiejętności specjalnych, hodowli ani zdobywania zwierząt losowo z łupów; to osobny etap.
- Normalne zdobywanie nowego zwierzęcia jest możliwe od poziomu postaci 20. Pierwsze zwierzę jest darmowe, kolejne kosztują 500 kredytów. Wybór wcześniej zdobytego towarzysza jest darmowy.
- Dane kolekcji i doświadczenia są częścią **zapisu postaci** (lokalnego i opcjonalnego w chmurze). W przypadku zmiany urządzenia zaczekaj na synchronizację lub użyj eksportu.
- Poziomy 1–10 i tempo doświadczenia są wstępne — balans do sprawdzenia podczas testów.

## Instalacja

### Aktualizacja z v0.3.7

Rozpakuj `ASHEN_v0.3.8_AKTUALIZACJA_GITHUB.zip` i **wgraj zawartość znajdującego się w nim folderu** do katalogu głównego repozytorium na GitHubie. Nie twórz dodatkowego folderu z nazwą archiwum. Podmień `index.html`, `js/game.js`, `css/style.css` oraz grafiki z `assets/bunker/rooms/`.

### Supabase

**Nowy SQL nie jest wymagany.** System wykorzystuje istniejący zapis postaci; nie zmieniono żadnych funkcji RPC. Nie uruchamiaj starych skryptów SQL ponownie.

## Test

1. Wejdź w Towarzysz i wybierz psa (lub użyj testowego wyboru).
2. Wybierz kota i wróć do psa — oba powinny zostać w kolekcji, a ich etapy rozwoju powinny być zachowane.
3. Zwycięż w zwykłych Starciach albo ukończ wyprawę i sprawdź EXP aktywnego zwierzęcia.
4. Przełącz aktywnego zwierzaka i sprawdź, czy XP poprzedniego pozostał bez zmian.
5. Otwórz Kryjówkę i przełącz poziomy Legowiska, Garażu i Ambulatorium; obrazy powinny się załadować bez konieczności ręcznego odświeżania.

## Bez zmian

Nie zmieniano zasad ekspedycji klanowych, nagród za bossów, odznak, PvP, magazynu ani projektu ALLADYN.


## ASHEN v0.3.9 — Pojazdy Pustkowi

- Naprawa: przyciski etapów towarzyszy służą tylko do podglądu grafik; nie aktywują ani nie trenują zwierzęcia.
- Garaż: trwała kolekcja pojazdów i aktywacja tylko przyciskiem „Aktywuj”.
- Podgląd etapów pojazdów bez aktywowania; osobny przycisk testowego odblokowywania.
- Trzy moduły dla każdego posiadanego pojazdu: silnik (czas), ładowność (złom), pancerz (walka na zwykłych wyprawach).
- Dotychczasowe 3 etapy rozwoju pojazdów oraz bonus poziomu Garażu pozostają.
- Migracja aktywnego pojazdu starszej wersji do kolekcji bez utraty jego ulepszeń.
- Bez zmian SQL / Supabase.


## ASHEN v0.3.9.1 — poprawka Garażu

- Testowo odblokowany pojazd można aktywować niezależnie od poziomu postaci; poprzednio warunek poziomu blokował aktywację pomimo posiadania.
- Usunięto podgląd trzech etapów pojazdu z kart; widoczny jest jedynie naprawdę osiągnięty etap.
- „TEST · Odblokuj” nadal nie aktywuje pojazdu automatycznie. Aktywacja następuje wyłącznie przez „Aktywuj”.
- Pojazdy zdobyte wcześniej i ich moduły zachowują się w zapisie. Bez migracji SQL i zmian grafik.
