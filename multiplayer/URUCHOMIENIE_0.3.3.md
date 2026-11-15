# Aktualizacja ASHEN v0.3.3

1. Rozpakuj paczkę `ASHEN_v0.3.3_AKTUALIZACJA_GITHUB.zip` i prześlij znajdujące się w niej pliki do repozytorium ASHEN w GitHub, zachowując foldery.
2. Otwórz **Supabase → projekt ASHEN → SQL Editor**.
3. Uruchom **tylko** `multiplayer/supabase/011_profiles_and_expedition_inbox.sql`.
4. Po `Success` odśwież stronę gry przyciskiem **Ctrl+F5**.
5. Na obu kontach wejdź do **Gracze** i **Wiadomości**. Przy ostatnich ekspedycjach powinny pojawić się powiadomienia z przyciskiem otwierania raportu.

Nie trzeba ponownie uruchamiać skryptów 001–010. Harmonogram z v0.3.2 musi już działać.

**Uwagi:** System profilów używa aktualnych publikowanych online danych. Nowe postacie mogą nie pojawić się, dopóki nie prześlą profilu do chmury. W rankingu o tej samej pozycji mogą być gracze o równym poziomie. Nie ma bezpośredniego dostępu do bazowych tabel Supabase z poziomu przeglądarki; służą do tego RPC.
