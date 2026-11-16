ASHEN v0.4.3.2 — Stałe bonusy i prywatne wsparcie ekspedycji

WYMAGA działającej v0.4.3.1 oraz wykonanych migracji SQL 017, 018 i 019.

INSTALACJA
1. W Supabase -> SQL Editor uruchom plik 020_expedition_personal_support.sql.
2. Dopiero po pomyślnym wykonaniu SQL podmień w repozytorium GitHub:
   - index.html
   - js/game.js
   - js/clans.js
   - js/expeditions.js
   - css/style.css
3. Zaczekaj na publikację GitHub Pages, otwórz grę ponownie.
4. Profil organizatora musi być zsynchronizowany z kontem online.

ZMIANY
- Kazdy czlonek frakcji moze zakladac ekspedycje; dotychczasowe limity i rekrutacja bez zmian.
- Budynki zapewniaja pasywny bonus kazdej ekspedycji (na poziom):
  Kuchnia +2% PZ, Lecznica +1 pancerza, Warsztat +1% obrazen.
- Organizator MOZE wybrac przy zalozeniu dodatkowe wsparcie:
  Prowiant: 20 zywnosci + 12 wody; dodatkowo +4% PZ / poziom Kuchni.
  Lecznica: 15 medykamentow + 6 wody; dodatkowo +2 pancerza / poziom Lecznicy.
  Zestaw: 40 zlomu + 14 czesci; dodatkowo +2% obrazen / poziom Warsztatu.
- Platnosc i utworzenie ekspedycji w jednej transakcji Supabase.
- Zwrot prywatnych kosztow po anulowaniu przed walka przez organizatora.
- Stare wsparcie z magazynu wspolnego nie dostaje zwrotu prywatnego.
- Wspolny magazyn nadal sluzy do budowania i wplat.
- Raport walki rozdziela bonusy stale od przygotowania organizatora.

UWAGA TESTOWA
Mechanizm dziala z obecnym zapisem postaci, ktory posiada czesc logiki po stronie
przegladarki. Nie jest to zabezpieczona ekonomia produkcyjna. Synchronizuj postac
przed testem i NIE korzystaj z tego samego konta na dwoch urzadzeniach jednoczesnie.
SQL i przebieg online nalezy sprawdzic w Supabase — lokalnie wykonano jedynie
kontrole statyczne skladni JavaScript i spojnosc plikow.
