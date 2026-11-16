# ASHEN v0.4.6.6 — Laboratorium: równy budżet klas

**Zmiana wyłącznie Laboratorium.** Nie zmienia wyposażenia graczy, rzeczywistych Starć, Ekspedycji ani Supabase. Nie wymaga SQL.

## Nowość

Nowy panel pod Laboratorium specjalizacji: **Test kontrolny — wyrównany budżet klas**. W każdym z 3 etapów rozwoju, dla 6 reprezentatywnych zestawów, program oblicza teoretyczny budżet serii: średnie obrażenia przed pancerzem i losowaniem trafienia, przy uwzględnieniu liczby ataków, siły drugiej ręki, atrybutów oraz oczekiwanego mnożnika krytyka. Następnie mnoży jedynie bazowe obrażenia testowych broni, żeby budżety klas były możliwie bliskie wspólnej średniej.

**Nie zmienia liczby ataków, trafienia, krytyków ani penetracji.** Zaokrąglenia sprawiają, że budżety mogą się nieco różnić. Zmiany istnieją wyłącznie w tym teście i nie są automatyczną propozycją nowych statystyk.

Test wykonuje **21 600 walk** (6 zestawów × 3 etapy × 4 poziomy pancerza × 300 prób), używając tego samego lokalnego `fight()` i identycznych seedów dla każdej konfiguracji. Wyniki obejmują potencjał obrażeń na rundę przy pancerzu 0/20/40/60, zwycięstwa, średnią rundę zwycięstwa i współczynnik normalizacji. Raport można skopiować i jest zachowywany lokalnie.

## Interpretacja

Porównaj wyniki oryginalnego testu specjalizacji (nierówny budżet) z nowym testem kontrolnym. Jeśli rozrzut maleje, różnice wynikały głównie z parametrów broni. Jeśli nadal duży — problem może wynikać z mechaniki klasy (szansa trafienia, krytyk, pancerz, liczba ataków). Przeciwnicy pozostają odpowiednio etap 1, 10 i 20; przy łatwych walkach wygrane mogą wynosić 100% i nie rozróżniać zestawów. Potencjał obrażeń jest liczony tylko z faktycznie wykonanych ataków (zakończenie walki może ograniczać liczbę prób).

## Instalacja

Podmień w repozytorium **`index.html`** oraz **`js/game.js`**. Pozostałe pliki bez zmian. Odśwież stronę (w razie potrzeby Ctrl+F5). W Starciach otwórz Laboratorium wyposażenia.
