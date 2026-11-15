# ASHEN v0.3.1 — Organizacja ekspedycji klanowych

Rozwija v0.3.0.1 bez zmiany grafik, statystyk bossów, postaci ani wcześniej zapisanych raportów.

## Co nowego

- **Zapasy ekspedycyjne**: nowy zasób na poziomie klanu, maksymalnie 12, początkowo 12, regeneracja +1 co 6 godzin. Koszt utworzenia: boss 1 = 2, boss 2 = 3, boss 3 = 4.
- **Dwa aktywne sloty na klan**. Jeden lider/oficer może organizować tylko jedną wyprawę na raz.
- **Kandydatury**: gracz zgłasza się; organizator zatwierdza lub odrzuca.
- **Imienne zaproszenia**: organizator wysyła zaproszenie członkowi klanu; gracz sam je przyjmuje lub odrzuca.
- **Limit sumy poziomów drużyny**: boss 1 = 20, boss 2 = 35, boss 3 = 50 (jednocześnie 2–5 graczy).
- Gracz może być w składzie tylko jednej aktywnej ekspedycji.
- Nadal **serwer Supabase** zatwierdza zapisy, przyjęcia i rozpoczęcie walki; nie wystarczy manipulacja widocznym HTML.

## Zasady

- Koszt jest pobierany od razu przy utworzeniu wyprawy, nawet jeśli klan ją anuluje.
- Uczestnik przyjęty do składu może z niego wyjść przed startem. Organizator może anulować ekspedycję.
- Wybrana taktyka i raport walki pozostają dostępne.
- Nie dodano jeszcze nagród i przedmiotów — to następny etap po testach tej rekrutacji.
- **Nie uruchamiaj poprzedniego `006` lub `007` ponownie** na zaktualizowanej bazie, ponieważ nadpisałoby to nowe reguły.

## Instalacja

1. Zrób kopię zapasową plików gry i danych w Supabase.
2. Wgraj pliki na GitHub, zachowując strukturę.
3. Otwórz w Supabase **projekt ASHEN**, przejdź do SQL Editor i uruchom **`multiplayer/supabase/008_expedition_recruitment.sql`**. Wcześniejsze 001–007 muszą być już zastosowane.
4. Odśwież grę `Ctrl+F5`. Testuj na co najmniej dwóch kontach.

Plik z kompletną instrukcją: `multiplayer/URUCHOMIENIE_0.3.1.md`.
