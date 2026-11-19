# ASHEN v0.5.3 — testy porównywarki ekwipunku

## Sprawdzone automatycznie

- `node --check js/game.js`: poprawna składnia.
- Podgląd zmian PŻ, pancerza, uniku, celności i atrybutów nie modyfikuje stanu `state.equip`.
- Symulacja dwuręcznej broni usuwa broń z lewej ręki.
- Symulacja akcesorium dla drugiego slotu zachowuje pierwszy slot.
- Przełożenie tej samej jednoręcznej broni między rękami nie duplikuje UID.
- Jedna wspólna funkcja wybiera docelowy ekwipunek w podglądzie i podczas faktycznego zakładania.

## Prośba o sprawdzenie w grze

1. Otwórz Ekwipunek i kliknij przedmiot z plecaka. Zobacz panel „Porównanie przed założeniem”.
2. Wybierz lewą, a potem prawą rękę. Sprawdź, czy zmienia się tabela i wskazany slot przy przycisku Załóż.
3. Sprawdź akcesorium przy pełnym zestawie 3/3; zamiana na obcą rodzinę powinna pokazać utratę bonusu X/Y/Z.
4. Zobacz przedmiot dwuręczny, gdy masz dwie bronie 1R — ostrzeżenie o zdjęciu lewej ręki.
5. Zamknij okno bez zakładania przedmiotu: statystyki, ekwipunek i stan online nie powinny się zmienić.
6. Załóż przedmiot przyciskiem z okna i sprawdź wynik w panelu Postać.
7. Sprawdź na telefonie przewijanie tabeli w poziomie.

Nie zmieniano SQL, formuł walki ani systemu łupów i towarzyszy.
