# ASHEN v0.3.4 — skrzynka wiadomości i profile graczy

Aktualizacja do v0.3.3. Dalszy rozwój społecznościowego systemu wiadomości i profili.

## Nowości

- **Odpowiedz** bezpośrednio podczas czytania wiadomości prywatnej: pole odpowiedzi i przycisk wysłania, bez konieczności otwierania profilu.
- **Profil gracza w niezależnym oknie (modal)**, bez opuszczania obecnej zakładki (np. Klany, Wiadomości, PvP).
- **Zbiorcze zaznaczanie i usuwanie wiadomości**. Przy usunięciu skasowana jest tylko widoczność wiadomości dla bieżącego konta. Drugie konto zachowuje swoją kopię. Raport walki nadal pozostaje w historii.
- **Zbiorcze „Oznacz jako przeczytane”** dla odebranych wiadomości prywatnych, powiadomień o PvP oraz ekspedycjach.
- **Raporty PvP w Odebranych**, zarówno dla atakującego jak i obrońcy. W **Wysłanych** pozostają tylko prywatne wiadomości napisane przez gracza.
- Każdy uczestnik raportu ma **własny stan przeczytania**.

## Instalacja

1. Wgraj nowe pliki gry na GitHub (zalecana paczka „Aktualizacja GitHub”).
2. W **oddzielnym projekcie Supabase ASHEN**, w SQL Editor uruchom tylko:
   `multiplayer/supabase/012_mail_and_profiles.sql`
3. Odśwież stronę gry przez Ctrl + F5.

**Nie uruchamiaj tego skryptu w projekcie ALLADYN.**

## Test

1. Konto Mitrudil wysyła prywatną wiadomość do Kowala.
2. Kowal otwiera wiadomość i odpisuje bez przechodzenia do profilu.
3. W Odebranych zaznacza kilka pozycji, oznacza je jako przeczytane, a następnie usuwa część.
4. Sprawdza, że Mitrudil nadal ma swoją historię korespondencji.
5. Oba konta sprawdzają, że raport PvP jest w Odebranych, a nie w Wysłanych.
6. Z listy Klanu, PvP lub Wiadomości otwiera profil gracza jako nakładane osobne okno.

## Techniczne uwagi

- Uruchom skrypt 012 po 011; nie wykonuj ponownie starych skryptów 003/011, ponieważ nadpisałyby najnowsze funkcje serwera.
- Usuwanie to tzw. **miękkie usuwanie** (ukrycie dla bieżącego uczestnika), nie kasowanie rekordów bazy ani zapisanych walk.
- Nowe powiadomienia PvP dla atakującego będą nieprzeczytane; historyczne powiadomienia są traktowane jako przeczytane.
- Po stronie klienta testowano składnię JS i podstawowe interakcje na symulowanych odpowiedziach serwera. Konieczny jest test z prawdziwym Supabase.
