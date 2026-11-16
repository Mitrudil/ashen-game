# ASHEN 0.4.7.2 — Planer zestawów i jakości

## Co dodano
- Postać → Planer setów: bez posiadania przedmiotów można składać sześć slotów odzieży i trzy akcesoria, wybierając ich rodziny prefiksów.
- Gotowe warianty: 6 Wartownika, 3 Wartownika + 3 Nomady, 4 Wartownika + 2 Nomady, wyczyść.
- Wybór jakości od zwykłej do legendarnej; plan liczy premie tymi samymi stałymi i wzorami co działający ekwipunek (SETS, ACCESSORY_SETS, setQuality).
- Sety ubioru aktywują się od 3 sztuk (progi 3/4/5/6), można połączyć 3+3. Akcesoria tylko 3/3, brak premii za 1–2 sztuki.
- Plan jest zapamiętywany w localStorage, ale nie zmienia postaci, wyposażenia ani serwerowych ekspedycji.

## Dlaczego jeszcze nie zwiększamy premii?
Przy jakości legendarnej aktualny mnożnik to ×2,5. Bez pomiaru wpływu na pełne zestawy i ich kombinacje zmiana wielkości premii byłaby ryzykowna. Planer służy do porównania 6+0 z 3+3 na różnych jakościach przed następna kalibracją.

## Instalacja
Podmień tylko `index.html` i `js/game.js` w repozytorium GitHub. Pozostałe pliki zostają. Nie wymaga SQL.

## Test
1. Otwórz Postać → Planer setów. Domyślnie wybór 3 Wartownika + 3 Nomady i 3 akcesoria Tropiciela. Powinny aktywować się dwa sety odzieży i jeden akcesoriów.
2. Kliknij „6 × Wartownika”: jeden bonus odzieży na progu 6/6.
3. Kliknij „4 Wartownika + 2 Nomady”: aktywny tylko Wartownika 4/6; Nomady nieaktywne.
4. Zmień jakość na legendarną: premia wzrasta. Sprawdź przełączenie zakładki i powrót; planer powinien pamiętać wybór.
5. Ustaw akcesoria jako dwa Tropiciela i jedno Technika: żaden set akcesoriów nie powinien dawać premii.

## Granice
Aktualizacja nie zmienia wartości premii, prawdziwych Starć ani SQL Ekspedycji. Wcześniejsza v0.4.7.1 jest wymagana jako baza (lub odpowiadająca jej zawartość kodu).
