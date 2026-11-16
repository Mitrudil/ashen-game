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
