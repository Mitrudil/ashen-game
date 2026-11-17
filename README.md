# ASHEN v0.4.8.1 — czyszczenie wyposażenia i testów

Podmień `index.html` i `js/game.js` na GitHubie. Bez SQL.

- Usunięto stare pule prefiksów/sufiksów i liczenie starych `affix`.
- Jednorazowo czyszczone są przestarzałe modyfikatory zapisanych przedmiotów; bazowe ID, jakość, poziomy ulepszeń, UID, wyposażenie i postęp pozostają.
- Dodano współczesny prefiks `armor_agile` (Zwinny) do losowania.
- Planer, podsumowanie ubioru i podgląd przedmiotów pokazują obliczenia z Ewolucji X/Y. Usunięto stare porównywarki walk bazujące na nieaktualnych premiach.
- Zachowano Rezonans artefaktów i zapis lokalnego profilu; mechaniki serwerowe Ekspedycji nadal wymagają aktualizacji.
- Aktywne X/Y; Z jeszcze nie działa.

Uwaga: przed wdrożeniem warto wyeksportować zapis dla porównania; czyszczenie starych prefiksów i sufiksów jest nieodwracalne bez kopii poprzedniej wersji.
