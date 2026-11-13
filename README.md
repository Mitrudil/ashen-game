# ASHEN – Kroniki Upadku

Przeglądarkowe RPG postapokaliptyczne. Aktualna wersja: **0.1.16**.

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

Gra używa obecnie `localStorage` w przeglądarce. **Postęp z lokalnych plików HTML nie przeniesie się automatycznie na adres GitHub Pages.** Plik projektu nie zawiera Twojego zapisu postaci. Zrób kopię zapisu przed przejściem na Pages. Obecna wersja umożliwia eksport JSON, ale nie ma jeszcze wygodnego importu JSON – to warto dodać w następnej wersji.

Dane gry są zapisywane osobno w każdej przeglądarce i na każdym urządzeniu. GitHub Pages nie zapewnia kont użytkowników, wspólnych zapisów ani bezpiecznego serwera gry.

## Aktualizacje

Podmieniaj `index.html`, `css/style.css` i `js/game.js`, gdy zmieniamy kod gry. Grafiki umieszczaj w odpowiednich podfolderach `assets/`. Nie zapisuj w repozytorium prywatnych danych ani eksportowanych zapisów gry.

## Uwaga

To prototyp offline przeznaczony do testów, nie gotowa gra wieloosobowa.
