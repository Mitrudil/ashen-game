# ASHEN v0.4.6.5 — Diagnostyka specjalizacji

Aktualizacja **tylko Laboratorium**, bez SQL i bez resetu ekwipunku.

## Co poprawiono

- Oddzielne liczenie **rzeczywiście odjętych PŻ** od **potencjalnych obrażeń po pancerzu** (przed ograniczeniem wyniku do pozostałego PŻ przeciwnika). Dla przykładu: jeśli przeciwnikowi zostało 10 PŻ, cios za 70 odnotowuje 10 realnych i 70 potencjalnych obrażeń.
- Nowa kolumna **średnia runda zwycięstwa** (tylko z wygranych walk) pokazuje szybkość zakończenia starcia tam, gdzie odsetek zwycięstw wynosi 100%.
- Nowa kolumna **średnie pozostałe PŻ gracza**.
- Ostrzeżenie, jeżeli wszystkie zestawy mają 100% zwycięstw i metryka przestaje je rozróżniać.
- W raporcie opisane poziomy przeciwników: etap 1, boss 10, boss 20.
- Osobny klucz zapisu raportów tej wersji; stare raporty pozostają nietknięte.

**Silnik walki nie został zmieniony.** Zmieniono tylko licznik informacyjny w raporcie `fight()` i analitykę panelu specjalizacji. Wynik testu, w tym klasyfikacja zwycięstwa/remisu/porażki, jest liczony identycznie jak poprzednio. Ekspedycje Supabase są nietknięte.

## Instalacja

Podmień pliki `index.html` i `js/game.js` w repozytorium (inne pliki pozostają bez zmian). Następnie uruchom Laboratorium specjalizacji i skopiuj raport.

## Ograniczenia

To nadal porównanie **reprezentatywnych, nie wyrównanych budżetowo** modeli (w tym dwóch maczet i dwóch rewolwerów). Nie wolno na jego podstawie określać docelowej przewagi całych klas. Każdy etap wykorzystuje innego przeciwnika, więc porównujemy zestawy **w obrębie etapu**, nie poziomy między sobą. Potencjał obrażeń nie uwzględnia niewykonanych ataków po śmierci celu.
