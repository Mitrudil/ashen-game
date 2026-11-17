# ASHEN — SQL 029: plan testów przed wdrożeniem

**Nie uruchamiaj SQL 029 na głównej bazie bez uprzedniej weryfikacji na bazie testowej.**

1. Backup serwerowej funkcji walki: `select pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure);` i zachowaj wynik poza bazą.
2. Potwierdź, że na bazie testowej zainstalowano SQL 025–027 i **poprawiony SQL 028**, zachowujący 8 ataków przy publikacji. Nie uruchamiaj historycznego 028 z paczki.
3. Uruchom na bazie testowej `sql/029_online_pvp_z_stage2.sql`; sprawdź że kompiluje się i nie zmienia `ashen_publish_profile`.
4. Scenariusz Wzmocnionego: profil z aktywnym `master_armor_reinforced=1`, po spadku PŻ do <=30% (i przetrwaniu) otrzymuje jednorazowo 10% maks. PŻ. Bez Z i powyżej progu — brak efektu.
5. Scenariusz Pancernego: duży cios (>=12% maks. PŻ) otrzymuje redukcję 35% przed osłoną; tylko raz na walkę. Cios poniżej progu — brak efektu.
6. Scenariusz Technicznego: dwa pierwsze **celne** trafienia otrzymują dodatkowe 8% przebicia pancerza celu; pudła nie zużywają ładunków, 3. trafienie bez premii.
7. Regresja: Przekonujący, Lekki, Wartowniczy nadal działają; X/Y, 2 ataki dziennie, raport publiczny, obie postacie i publikacja Kowala (3 ataki) bez zmian.
8. Zapisz logi/raporty; nie wyciągaj wniosków o pełnym anty-cheat z SQL 028.

**Ograniczenie:** nie dostarczamy testu automatycznego podmieniającego produkcyjne snapshoty, ponieważ groziłoby to nadpisaniem profili graczy. Do bezpiecznych scenariuszy wymagane są izolowane konta testowe w odrębnym projekcie Supabase.
