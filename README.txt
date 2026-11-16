ASHEN v0.4.3.5 — Raporty i automatyczne nagrody

INSTALACJA
1. Upewnij się, że uruchomiono wcześniejszy SQL 022_solo_expeditions_shared_rewards.sql.
2. W Supabase SQL Editor uruchom sql/023_expedition_report_rewards.sql.
3. Wgraj do GŁÓWNEGO katalogu repozytorium następujące pliki:
   index.html, js/game.js, js/online.js, js/expeditions.js
4. Odśwież grę i zweryfikuj wersję 0.4.3.5 w nagłówku.

NOWOŚCI
- Raport ekspedycji zawiera tabelę nagród wszystkich uczestników: EXP, kredyty,
  złom i przedmiot (wyłącznie dla organizatora).
- W Wiadomościach cały raport otwiera się bezpośrednio pod treścią wybranej wiadomości.
  Nie przechodzisz do zakładki Ekspedycje.
- Nagrody losowane i rejestrowane na serwerze po walce są automatycznie
  dopisywane do przypisanej postaci przy synchronizacji z kontem online.
  Nie ma już przycisku „Odbierz nagrodę”.
- Synchronizacja zapisuje stan postaci do chmury PRZED potwierdzeniem
  rozliczenia nagrody. Identyfikatory nagród zapobiegają podwójnemu dopisaniu.

UWAGI
- Jeśli postać nie jest przypisana do konta online albo brak połączenia,
  nagrody czekają bezpiecznie w bazie i zostaną zastosowane po przywróceniu
  synchronizacji. Nie są tracone.
- XP, kredyty i przedmioty nadal są ostatecznie przechowywane w zapisie
  postaci kontrolowanym przez przeglądarkę. Pełna odporność na manipulacje
  wymaga w przyszłości serwerowego zapisu ekwipunku i poziomów.
- Nie uruchamiaj ponownie starszych migracji SQL 013, 014, 020, 022, ponieważ
  mogłyby przywrócić poprzednie funkcje serwerowe.
- Brak resetu postaci i grafik.

TEST
A) Wygraj ekspedycję, wejdź w Wiadomości, otwórz raport; zobacz nazwiska
   i nagrody każdej osoby. Sprawdź item organizatora.
B) Sprawdź, czy EXP, kredyty, złom oraz ewentualny item samoczynnie trafiły
   do postaci — również po odświeżeniu.
C) Przetestuj przerwę w internecie: nierozliczona nagroda powinna zostać
   naliczona przy powrocie połączenia, bez podwajania wartości.
