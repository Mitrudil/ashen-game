# ASHEN v0.4.8.8 — Stabilne przewijanie raportu PvP

Aktualizacja z v0.4.8.7. **Bez SQL**.

## Poprawka
- Zapamiętywanie i przywracanie pozycji wewnętrznego przewijania raportu PvP podczas ponownego renderowania interfejsu (np. po synchronizacji w tle).
- Zachowanie pozycji przewinięcia strony, gdy raport jest otwarty.
- Numer wersji 0.4.8.8 w nagłówku i HTML, z odświeżeniem plików skryptów przez nowy parametr wersji.
- Brak zmian w algorytmach walki, setach, raportach na serwerze i SQL.

## Instalacja
Wgraj na GitHub tylko **index.html** i **js/game.js**. Pliku **js/public-config.js** NIE podmieniaj — zawiera Twoją istniejącą publiczną konfigurację Supabase.
Potem Ctrl+F5. Otwórz raport z zakładki PvP i przewiń go; sprawdź, czy nie wraca sam na początek po synchronizacji.

## Testy
Kontrola składni JS i integralności ZIP. Działanie w rzeczywistej przeglądarce użytkownika wymaga potwierdzenia.
