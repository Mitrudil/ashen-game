# ASHEN 0.4.7.0 — przebudowa prefiksów i sufiksów broni

## Instalacja
Podmień pliki `index.html` i `js/game.js` w repozytorium. Brak migracji SQL.

## Zmiany
- Nowa pula prefiksów broni: Precyzyjny, Brutalny (tylko biała), Niszczycielski, Zabójczy, Szybki (tylko lekka), Stabilny, Przebijający.
- Nowa pula sufiksów broni: Łowcy, Snajpera (dystansowa/palna), Berserkera, Egzekutora, Wojownika (tylko biała), Niszczyciela, Penetratora, Fechmistrza (tylko 1R).
- Przebicie pancerza z modyfikatorów działa w prawdziwych Starciach (jest dodawane do przebicia modelu broni).
- Sufiks Berserkera ma teraz koszt w celności, Stabilny oferuje też krytyki.
- Prefiks Szybki pozostaje ograniczony do lekkiej broni i osłabionego ciosu o wartości około 12% sekwencji.
- Teksty w kartach broni opisują bonusy w sposób czytelny, także karę celności.
- Zmienione definicje dotyczą posiadanych przedmiotów z nowymi ID; stare ID dalej można odczytać.

## Zakres i ograniczenia
- **Bez zmian SQL**: serwerowe Ekspedycje wciąż nie mają tej samej matematyki i wymagają osobnego wdrożenia.
- Nie zmieniano statystyk zbroi, akcesoriów, przedmiotów unikatowych ani pul jakości.
- Laboratorium 0.4.6.8 nadal bada stare scenariusze testowe i nie służy do weryfikacji całej nowej puli.
- Najpierw sprawdź w prawdziwych Starciach przedmiot z modyfikatorem `Przebijający` lub `Penetratora`, bonus w karcie przedmiotu i raport obrażeń.

## Plan dalej
Następny etap: automatyczny test wszystkich nowych par prefiks+sufiks, potem ich korekta i synchronizacja z serwerowymi Ekspedycjami.
