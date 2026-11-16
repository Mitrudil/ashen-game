ASHEN v0.4.3 — BUDYNKI FRAKCJI I WSPARCIE EKSPEDYCJI

Kolejność instalacji:
1. W Supabase SQL Editor uruchom 019_faction_facilities_and_support.sql.
   Wymagane są wcześniejsze migracje (017, 018) oraz system ekspedycji (009 i 015).
2. Podmień pliki index.html, css/style.css, js/game.js, js/clans.js i js/expeditions.js na GitHubie.
3. Zweryfikuj stan Frakcji, poziomy budynków i saldo magazynu.
4. Lider lub oficer rozpoczyna ekspedycję, następnie w zakładce Frakcje wybiera ją i przygotowuje wsparcie (po zbudowaniu odpowiedniego obiektu).
5. Po rozstrzygnięciu walki raport zawiera listę zastosowanych rodzajów wsparcia.

Nowe budynki (0-5): Kuchnia polowa, Lecznica, Warsztat frakcji.
Wsparcia jednorazowe na ekspedycję: prowiant (+6% HP / poziom), medyczne (+2 pancerza / poziom), techniczne (+3% obrażeń / poziom).
Zachowane: skład frakcji, ranking wpłat, zasoby, dotychczasowe trzy budynki i wyprawy.
Nie potrzeba wgrywać obrazów. Nowe koszty są testowe.
UWAGA: brak serwera testowego Supabase w środowisku; SQL wymaga weryfikacji na docelowym projekcie.
