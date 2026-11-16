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
