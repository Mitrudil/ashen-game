# ASHEN v0.3.7 — Rozbudowa Kryjówki (Schron 17)

## Nowości

### 3 nowe pomieszczenia
- **Legowisko towarzyszy** (`sanctuary`) — wzmacnia premię aktywnego zwierzęcia o +2,5%, +5%, +7,5%, +10% na poziomach 2–5 (mnożnik skuteczności bonusu, a nie bezpośrednie +10 punktów procentowych).
- **Garaż** (`garage`) — skraca czas zwykłych wypraw o dodatkowe 2,5%, 5%, 7,5%, 10% na poziomach 2–5. Nie skraca zbiórki ekspedycji klanowych.
- **Ambulatorium** (`infirmary`) — zwiększa maksymalne punkty życia postaci o +2,5%, +5%, +7,5%, +10% na poziomach 2–5.

Każde pomieszczenie korzysta z istniejącej rozbudowy: koszt w kredytach, złomie i materiałach, wymagany poziom postaci, zapisany poziom oraz testowy wybór 1–5 bez kosztów.

### Grafiki i interfejs
- Przekrój Schronu 17 pokazuje 6 pomieszczeń w dwóch rzędach po 3.
- Dodano robocze sceny dla Legowiska, Garażu i Ambulatorium z wizualnymi wariantami oświetlenia 1–5. **To nie jest jeszcze pięć odrębnie ilustrowanych etapów przebudowy**: na razie zmienia się głównie natężenie i kolor oświetlenia; szczegółową ewolucję wyposażenia można dopracować później.
- Naprawiono błąd identycznych plików `fighter-f-full.png` i `scout-f-full.png`; mają teraz osobne grafiki. Naprawiono brak prawidłowej miniatury `scout-f.webp`.

### Kompatybilność
- Istniejące postaci otrzymują nowe pomieszczenia na poziomie 1 bez utraty dotychczasowego postępu.
- Importowane i chmurowe zapisy ze starszych wersji są inicjalizowane również dla trzech nowych modułów.
- Zmiany są lokalne — **bez nowego SQL**. Nie zmieniają systemu nagród bossów ani odznak.
- Zasada „wiele posiadanych zwierząt, jedno aktywne” zostanie wdrożona oddzielnie; w tej wersji zachowujemy dotychczasowy sposób wyboru towarzysza.

## Aktualizacja GitHub
Wgraj pliki z mniejszej paczki do **korzenia repozytorium ASHEN**: `index.html`, `css/style.css`, `js/game.js` oraz katalogi `assets/characters` i `assets/bunker/rooms`. Odśwież stronę Ctrl+F5.

## Testy
1. Otwórz **Kryjówka**. W przekroju powinno być 6 pokoi.
2. Przełącz Legowisko między poziomami 1 i 5, sprawdź bonus psa/kota/kruka/dzika w zakładce Towarzysz.
3. Przełącz Garaż i porównaj czas zwykłej wyprawy (najbardziej widoczny przy dłuższej wyprawie i wolniejszym pojeździe).
4. Przełącz Ambulatorium i porównaj maksymalne PŻ w statystykach postaci i walce.
5. Na profilu testowym utwórz Wojowniczkę i Zwiadowczynię — powinny mieć inne sylwetki.
6. Sprawdź, czy starsze zapisy Kryjówki i ekspedycji nie zostały zmienione.

## Następny etap
Kolekcja zwierząt i zarządzanie jednym aktywnym towarzyszem oraz dalsze dopracowanie wizualne scen pomieszczeń.
