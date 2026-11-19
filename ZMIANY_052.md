# ASHEN 0.5.2 — towarzysze

- Gatunki: Kot 1, Pies 5, Kruk 10, Dzik 15 — wymagany poziom postaci przy pierwszym przygarnięciu. Posiadane zwierzęta pozostają dostępne.
- Treningi I/II/III: Kot 3/8/15, Pies 7/12/20, Kruk 12/18/25, Dzik 17/23/30 (poziom postaci); dodatkowo poziom zwierzęcia 2/4/6.
- Koszt treningów: I 200 kr / 60 złomu / 10 części, II 450 / 120 / 20, III 900 / 240 / 40. Trening wymaga potwierdzenia.
- Nowo przygarnięte zwierzę zaczyna bez aktywnego treningu (0/3), ale zdobywa PD, aby osiągnąć wymagany poziom zwierzęcia.
- Wcześniej posiadane zwierzęta zachowują swoje etapy treningu i poziom (np. pies 7/10); migracja wykonywana jeden raz.
- PD zwierzęcia na następny poziom: 70 + 40 × (poziom−1). Suma od 1 do poziomu 3/5/7/10: 180/520/1020/2070. Zachowano uzyskany bieżący PD (bez cofania poziomu).
- Przegrane wyprawy: 0 PD zwierzęcia. Wygrane wyprawy: bez zmiany PD (12/23/35). Starcia: pierwsza wygrana bez zmiany, kolejne wygrane tego samego etapu = 25% PD zwierzęcia, minimum 1. Testowe Starcia nadal bez nagród.
- Nie zmieniano walidacji walk PvP, migracja SQL nie jest wymagana.

## Kontrola po wdrożeniu
1. Sprawdź zachowanie poziomu i treningu obecnego psa; nie powinien spaść z 7/10.
2. Sprawdź trzy progi treningu w zakładce Towarzysze.
3. Sprawdź, że przygarnięcie zbyt wcześnie jest zablokowane, ale posiadany gatunek można wybrać.
4. Sprawdź przegraną wyprawę (0 PD zwierzęcia) i ponowne zwycięstwo na tym samym etapie Starć.
