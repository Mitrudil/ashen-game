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
