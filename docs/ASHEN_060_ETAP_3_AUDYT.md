# ASHEN 0.6.0 — etap 3: balans ofensywny

**Status: materiał projektowy. Bez zmian produkcyjnych PvP, X/Y/Z, poziomów i przedmiotów.**

## Podstawa analizy
- Wykorzystano 24 modeli broni z `ASHEN_060_KATALOG_I_ZASADY.json` oraz 42 modyfikatory i 15 rodzin z etapu 2.
- Stałe parametry broni (liczba ataków, bazowe obrażenia) niezależne od poziomu postaci.
- Wyniki liczone przy 75% trafienia, 15% krytyka, mnożniku krytyka ×1,5 i pancerzu testowym 40. Model edukacyjny: pancerz 100/(100+A), bez Z i bez rzeczywistych formuł SQL.

## Co pokazują liczby
- Pełny dodatkowy atak dla broni z 1 atakiem = **+100%** oczekiwanych obrażeń przy niezmienionej sile ciosu.
- Pełny dodatkowy atak dla broni z 2 atakami = **+50%**, a dla 3 ataków = **+33,3%**.
- Bonus **+10% obrażeń** zwiększa wynik o 10% niezależnie od liczby ataków (w tym uproszczeniu).
- Bonus **+5 punktów procentowych krytyka** podnosi oczekiwane obrażenia o około **2,33%** przy bazowych 15% krytyka i ×1,5 obrażeń krytycznych; jego wartość może być inna przy zmianie formuły krytyka.
- Ryzyko pustej rundy przy 75% trafienia: 1 atak 25%, 2 ataki 6,25%, 3 ataki 1,56%, 6 ataków 0,024%.

## Propozycje — prefiksy broni
| Prefiks | Obecnie | Propozycja do prób |
|---|---|---|
| Precyzyjny | Celność +3; Percepcja +2 | Pozostawić +3 celności, +2 Percepcji |
| Brutalny | Siła +2; dmg +4% | Siła +2, dmg +6% (broń biała) |
| Niszczycielski | Dmg +8% | Dmg +10% |
| Zabójczy | Krytyk +4 pp | Krytyk +5 pp |
| Szybki | 1 dodatkowy osłabiony cios | Pełny dodatkowy atak; tylko po teście balansu broni 1/3 ataki |
| Stabilny | Celność +5; krytyk +2 pp | Celność +5; krytyk +2 pp |
| Przebijający | Przebicie +4 | Przebicie +4 |

## Propozycje — sufiksy broni
| Sufiks | Obecnie | Propozycja do prób |
|---|---|---|
| Łowcy | Percepcja +2; celność +2 | Bez zmian |
| Snajpera | Percepcja +2; krytyk +2 pp | Krytyk +3 pp; Percepcja +2 |
| Berserkera | Dmg +8%; celność −4 | Dmg +12%; celność −4 |
| Egzekutora | Krytyk +4 pp | Krytyk +5 pp |
| Wojownika | Siła +2; dmg +3% | Siła +2; dmg +5% |
| Niszczyciela | Dmg +5%; przebicie +1 | Dmg +6%; przebicie +2 |
| Penetratora | Przebicie +5 | Bez zmian |
| Fechmistrza | Krytyk +3 pp; celność +3 | Bez zmian |

## Zachowane rodziny X/Y/Z — plan specjalizacji
| Zestaw | X (kierunek) | Y (kierunek) | Z (bez zmiany) |
|---|---|---|---|
| Wzmocniony | PŻ, Wytrzymałość | Odporność na obrażenia | Drugi oddech |
| Pancerny | Pancerz | Redukcja obrażeń | Niezłomna płyta |
| Elastyczny | Unik | Wzmocnienie po uniku | Kontratak po uniku |
| Zwinny | Celność / inicjatywa | Bonus ruchliwości | Błyskawiczny start |
| Lekki | Celność | Dodatkowy atak (kandydat, do balansu) | Seria trafień |
| Odporny | Wytrzymałość | Odporność na krytyki | Redukcja krytyka |
| Tropicielski | Percepcja / celność | Krytyk +pp | Oznaczenie celu |
| Żelazny | Siła | Przebicie i moc trafienia | Miażdżący cios |
| Wartowniczy | Wytrzymałość | Tarcza / przeżywalność | Tarcza ratunkowa |
| Nomadyczny | Zręczność | Premia eksploracyjna | Bonus po utracie PŻ |
| Techniczny | Inteligencja | Przebicie pancerza | Skan pancerza |
| Spostrzegawczy | Percepcja | Krytyk +pp | Drugi celny cios |
| Przekonujący | Charyzma | Celność | Autorytet |
| Refleksyjny | Zręczność | Unik | Przebicie po uniku |
| Wszechstronny | Percepcja / Inteligencja | Defensywa warunkowa | Jednorazowa osłona |

## Decyzje projektowe przed implementacją
1. Nie wprowadzać uniwersalnego +1 pełnego ataku bez kompensacji: dla broni jednoatakowej to podwójne DPS przy tej samej szansie trafienia.
2. Przetestować dwa warianty: (A) bonusowy pełny atak jedynie dla wybranych rodzin z odpowiednio dobraną statystyką bazową; (B) pełny atak z ograniczeniem skuteczności *całej konfiguracji*, ujawnionym w interfejsie. Nie wybierać jeszcze ukrytych mnożników.
3. Zostawić wszystkie 15 sprawdzonych Mistrzostw Z i nie wprowadzać obniżeń czy nowych efektów w ciemno.
4. Porównać bazowe modele broni przy jednakowej docelowej mocy rundy; następnie włączyć do symulacji krytyk, pancerz, celność i artefakty.
5. Finalne X/Y muszą zostać uzgodnione z formułami średniej jakości w pięciostopniowej hierarchii.

## Jak korzystać
Otwórz `tools/ashen-060-balans-etap-3.html`. Porównaj dwie bronie: `Strzelba pustkowi` (1 atak) i `Karabin maszynowy PK` (3 ataki). Wybierz +1 atak, +10% dmg i +5 pp krytyka; zobacz różnice. Dopiero potem ocenimy, jakich ograniczeń lub rekompensat potrzebuje szybkość.

**Nie wykonuj SQL, nie zmieniaj zapisów, nie nadpisuj silnika walki.**
