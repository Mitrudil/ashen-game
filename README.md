# ASHEN v0.2.8 — Klany Pustkowi

Nowa zakładka **☷ Klany** z prawdziwą obsługą między kontami Supabase ASHEN.

- Zakładanie klanu: nazwa, 2–5-znakowy skrót, opis.
- Zapraszanie graczy z listy opublikowanych postaci online.
- Akceptowanie i odrzucanie zaproszeń (7 dni ważności).
- Lista członków (role, imiona, poziomy), limit 30.
- Lider, oficer, członek; zarządzanie rolami oraz wyrzucanie.
- Opuszczanie klanu; lider może rozwiązać pusty klan.
- Serwerowe RPC z kontrolą autoryzacji, bez bezpośredniego dostępu do tabel.

**WYMAGANY NOWY SQL:** `multiplayer/supabase/005_clans.sql` — tylko w projekcie ASHEN. Przewodnik: `multiplayer/URUCHOMIENIE_0.2.8.md`.

**Nie dodano jeszcze walk z bossami ani czatu klanowego.** Nie zmieniono dotychczasowego PvE, PvP, systemu zapisów ani ALLADYN.
