# Testy ASHEN v0.4.9.22

## Checklist bez używania ataków

1. Uruchom aplikację, sprawdź v0.4.9.22 i otwórz zakładkę PvP online.
2. Sprawdź komunikat „SQL 034 — 15/15”.
3. Rozwiń „Audyt PvP · 15 Mistrzostw Z i spójność raportów”.
4. Po odświeżeniu sprawdź, że raporty silników SQL029, 032, 033 i 034 są osobno zliczane.
5. Kliknij „Kopiuj podsumowanie audytu”; skopiowany tekst nie powinien zawierać danych uwierzytelniających.
6. Otwórz starsze i nowe raporty: sprawdź kolejność graczy, rundy, PŻ oraz liczniki obrażeń.
7. W Supabase osobno wykonaj `sql/035_...`, `sql/036_...`, `sql/037_...`; zachowaj wyniki CSV.

## Weryfikacja bezpieczeństwa

Nie uruchamiać podczas audytu produkcyjnych migracji ani testów z COMMIT; nie potrzeba zużywać limitów walk. Wynik „0 aktywacji” jest niejednoznaczny. Audyt nie wykrywa wszystkich oszustw i nie porównuje losowania w pełnych walkach.
