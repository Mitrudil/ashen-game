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
