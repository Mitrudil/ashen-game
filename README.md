# ASHEN v0.4.6.9 — pierwszy etap wdrożenia broni w prawdziwych Starciach

**Zainstaluj na obecnej wersji 0.4.6.8** przez podmianę plików `index.html` i `js/game.js` w repozytorium. Pozostałe pliki pozostają bez zmian. **Bez SQL.**

## Wprowadzone zmiany

- **24 standardowe bronie** korzystają z eksperymentalnych zakresów obrażeń Laboratorium oraz jednego stałego współczynnika klasy z testu v0.4.6.7 (biala1 x0.72; biala2 x0.91; palna1 x1.12; palna2 x0.93; dystansowa x1.42; technologiczna x1.22).
- **Liczba ataków w rzeczywistych Starciach** zgodna z charakterem 24 broni: 1, 2 lub 3. Dwie bronie jednoręczne to suma sekwencji obu rąk; lewa ręka ma współczynnik 0.8.
- **Prefiks Szybki:** dodatkowy, znacznie osłabiony atak o sile 12% podstawowej sekwencji danej broni (maksymalnie 36% pełnego ciosu przy 3 atakach). Działa tylko na broniach jednoręcznych, zgodnie z obecną pulą losowania. Nie zmieniamy starych przedmiotów, ale ich działanie jest liczone nowymi zasadami.
- **Celność, szansa krytyka, mnożnik krytyka i przebicie** dla 24 broni są pobierane z modelu Laboratorium. Pancerz jest liczony przed mnożnikiem krytyka dla tego modelu.
- **Ulepszenia Warsztatu** na 24 standardowych broniach dają teraz premię procentową 2.8% za poziom (+14% na +5), zamiast płaskich +20 do każdego strzału. Pozostałe bronie unikatowe i pancerze zachowują dotychczasowy sposób ulepszania.
- Karta przedmiotu pokazuje bazową liczbę ataków i bonus „Szybki”.
- **Laboratorium i stare raporty zachowane** dla porównania — są odrębnym testowym modelem; nie należy interpretować starych wykresów jako dokładnej kopii nowej postaci z realnego ekwipunku.

## Znane ograniczenia i zakres

- To **wstępne wdrożenie balansu**, nie zakończony ASHEN 0.5. Wyniki z prawdziwego ekwipunku mogą zależeć od premii ubioru, prefiksów i atrybutów.
- Powyższa aktualizacja zmienia lokalne walki obsługiwane przez `fight()` (Starcia i inne wywołania tego silnika). **Nie zmienia serwerowych Ekspedycji frakcyjnych w Supabase**. Tam nadal może obowiązywać wcześniejsza matematyka; nie porównuj bezpośrednio ich wyników do Starć, dopóki nie wdrożymy SQL.
- Broń unikatowa z bossów nadal ma stare zasady. Osobna kalibracja w następnym etapie.
- Pamięć ekwipunku nie jest resetowana; nie wynika to z potrzeby kompatybilności, tylko z braku konieczności resetu do zmiany statystyk. W razie kolejnej przebudowy możemy ją wyczyścić.

## Szybkie testy ręczne (po wgraniu)

1. Otwórz zakładkę Postać i potwierdź, że Karabin maszynowy PK pokazuje 3 ataki, a Młot wyburzeniowy 1 atak.
2. Wyposaż broń, wykonaj rzeczywiste Starcie i przejrzyj raport: liczba prób ataków ma odpowiadać broni; ich liczba może być mniejsza, jeśli przeciwnik zginie wcześniej.
3. Porównaj dwie bronie 1R z jedną dwuręczną w zbliżonym etapie rozwoju.
4. Wypróbuj prefiks Szybki na broni jednoręcznej; ma dawać słaby dodatkowy cios, a nie drugi pełnowartościowy atak.
5. Sprawdź, czy przechodzenie między zakładkami nie czyści raportów Laboratorium.

## Kontrola techniczna

Plik `js/game.js` przechodzi `node --check`; archiwum ZIP przechodzi test CRC. Test w prawdziwej przeglądarce i test serwerowych Ekspedycji nie zostały wykonane.
