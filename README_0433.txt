ASHEN v0.4.3.3 — Brak możliwości anulowania ekspedycji

WYMAGA wersji v0.4.3.2 i SQL 020.

INSTALACJA:
1. Supabase > SQL Editor: uruchom 021_expeditions_irrevocable.sql.
2. GitHub: podmień index.html oraz js/expeditions.js.
3. Poczekaj na publikację i otwórz grę ponownie.

ZMIANY:
- Organizator nie ma już przycisku „Anuluj wyprawę”.
- Potwierdzenie zakładania informuje o braku anulowania i braku zwrotu kosztów prywatnego wsparcia.
- Serwer blokuje wywołanie starej funkcji anulowania, także dla przestarzałych klientów.
- Nie zmieniono rekrutacji, minimalnej liczby uczestników i automatycznego startu.

UWAGA: jeśli do terminu zbiórki nie zbierze się minimalna liczba uczestników,
obecna logika serwerowa nie rozegra walki. To osobna mechanika do dopracowania.
Nie wdrażano automatycznej porażki ani zwrotu zasobów w takim przypadku.

TEST:
- Utwórz ekspedycję i sprawdź, czy nie ma przycisku anulowania.
- SQL musi zablokować także wywołanie ashen_expedition_cancel z nieaktualnego klienta.
