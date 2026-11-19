# ASHEN 0.6.0 — ETAP 2: katalog premii i zestawów

**Status: audyt i projekt, nie aktualizacja silnika gry.**

Źródło: rzeczywisty plik `js/game.js` z ASHEN 0.5.4.1, ten sam co w laboratorium 0.6.0.

## Zasady niepodlegające zmianie
- Parametry modelu broni, w tym bazowe ataki, nie zależą od poziomu postaci.
- Dodatkowe ataki, obrażenia, krytyki, celność i przebicie mogą pochodzić z prefiksu, sufiksu, artefaktu i setu.
- Zestawy akcesoriów: 3/3; zestawy odzieży: premia od 3 części, skalowanie do 6.
- Zachować 15 obecnych zdolności Z i uzgodnione średnie jakości; w nowej jakości mitycznej przeliczyć punkty.
- Gniazda 0–3 tylko przy zdobywaniu; wszystkie typy przedmiotów.

## Najważniejsze ryzyka
1. Obecny `weapon_quick` dodaje osłabiony cios; zamiana na pełny atak wymaga nowego balansu obrażeń i synchronizacji serwera SQL.
2. Dodatkowe ataki i krytyki wzmacniają się wzajemnie; trzeba testować zarówno średni DPS, jak i prawdopodobieństwo pustej rundy.
3. Przypadki wieloatakowe wymagają ponownej kontroli zdolności Z: Lekki, Techniczny, Spostrzegawczy, Zwinny.
4. Nie można zmieniać samych opisów premii bez zmian w kalkulatorze statystyk, lokalnym PvE i serwerowym PvP.

## Prefiksy — obecny katalog (22)

| Prefiks | Dostępność | Bonus z aktualnego kodu | Rola projektowa |
|---|---|---|---|
| Precyzyjny (`weapon_precise`) | weapon | Percepcja +2, Celność +3 | Celność / stabilność |
| Brutalny (`weapon_brutal`) | meleeWeapon | Siła +2, Obrażenia % +4 | Silny cios wręcz |
| Niszczycielski (`weapon_destructive`) | weapon | Obrażenia % +8 | Obrażenia |
| Zabójczy (`weapon_lethal`) | weapon | Szansa krytyka (pp) +4 | Krytyki |
| Szybki (`weapon_quick`) | lightWeapon | Dodatkowy atak +1 | Dodatkowy pełny atak — test balansu |
| Stabilny (`weapon_stable`) | weapon | Celność +5, Szansa krytyka (pp) +2 | Celność i krytyki |
| Przebijający (`weapon_piercing`) | weapon | Przebicie pancerza +4 | Przebicie pancerza |
| Wzmocniony (`armor_reinforced`) | clothing | Wytrzymałość +2 | Specjalizacja odzieży |
| Pancerny (`armor_plated`) | clothingArmor | Pancerz % +15 | Specjalizacja odzieży |
| Zwinny (`armor_agile`) | clothing | Zręczność +2 | Specjalizacja odzieży |
| Elastyczny (`armor_flexible`) | clothing | Zręczność +2 | Specjalizacja odzieży |
| Lekki (`armor_light`) | clothing | Zręczność +1, Percepcja +1 | Specjalizacja odzieży |
| Odporny (`armor_resistant`) | clothingArmor | Wytrzymałość +1, Pancerz % +8 | Specjalizacja odzieży |
| Tropicielski (`armor_tracker`) | clothing | Percepcja +2 | Specjalizacja odzieży |
| Żelazny (`armor_iron`) | clothing | Siła +3 | Specjalizacja odzieży |
| Wartowniczy (`armor_warden`) | clothing | Wytrzymałość +2 | Specjalizacja odzieży |
| Nomadyczny (`armor_nomad`) | clothing | Zręczność +2 | Specjalizacja odzieży |
| Techniczny (`accessory_technical`) | accessory | Inteligencja +2 | Specjalizacja akcesoriów |
| Spostrzegawczy (`accessory_observant`) | accessory | Percepcja +2 | Specjalizacja akcesoriów |
| Przekonujący (`accessory_persuasive`) | accessory | Charyzma +2 | Specjalizacja akcesoriów |
| Refleksyjny (`accessory_reflexive`) | accessory | Zręczność +2 | Specjalizacja akcesoriów |
| Wszechstronny (`accessory_versatile`) | accessory | Percepcja +1, Inteligencja +1 | Specjalizacja akcesoriów |

## Sufiksy — obecny katalog (20)

| Sufiks | Dostępność | Bonus z aktualnego kodu | Rola projektowa |
|---|---|---|---|
| Łowcy (`weapon_hunter`) | weapon | Percepcja +2, Celność +2 | Celność / tropienie |
| Snajpera (`weapon_sniper`) | ranged | Percepcja +2, Szansa krytyka (pp) +2 | Krytyki dystansowe |
| Berserkera (`weapon_berserker`) | weapon | Obrażenia % +8, Celność -4 | Obrażenia za cenę celności |
| Egzekutora (`weapon_executioner`) | weapon | Szansa krytyka (pp) +4 | Szansa krytyka |
| Wojownika (`weapon_warrior`) | meleeWeapon | Siła +2, Obrażenia % +3 | Siła i obrażenia wręcz |
| Niszczyciela (`weapon_destroyer`) | weapon | Obrażenia % +5, Przebicie pancerza +1 | Obrażenia i przebicie |
| Penetratora (`weapon_piercer`) | weapon | Przebicie pancerza +5 | Przebicie pancerza |
| Fechmistrza (`weapon_duelist`) | oneHandWeapon | Szansa krytyka (pp) +3, Celność +3 | Precyzja i krytyki broni 1R |
| Ocalonego (`armor_survivor`) | clothing | Wytrzymałość +3 | Specjalizacja odzieży |
| Strażnika (`armor_guard`) | clothingArmor | Pancerz % +10 | Specjalizacja odzieży |
| Wędrowca (`armor_wanderer`) | clothing | Wytrzymałość +1, Percepcja +1 | Specjalizacja odzieży |
| Zwiadowcy (`armor_scout`) | clothing | Zręczność +2 | Specjalizacja odzieży |
| Twardziela (`armor_tough`) | clothing | Siła +2 | Specjalizacja odzieży |
| Żelaznej Woli (`armor_ironwill`) | clothing | Wytrzymałość +1, Inteligencja +1 | Specjalizacja odzieży |
| Technika (`accessory_technician`) | accessory | Inteligencja +3 | Specjalizacja akcesoriów |
| Negocjatora (`accessory_negotiator`) | accessory | Charyzma +3 | Specjalizacja akcesoriów |
| Tropiciela (`accessory_tracker`) | accessory | Percepcja +3 | Specjalizacja akcesoriów |
| Przywódcy (`accessory_leader`) | accessory | Charyzma +2, Wytrzymałość +1 | Specjalizacja akcesoriów |
| Odkrywcy (`accessory_explorer`) | accessory | Inteligencja +1, Percepcja +1 | Specjalizacja akcesoriów |
| Ocalałego (`accessory_survivor`) | accessory | Wytrzymałość +2 | Specjalizacja akcesoriów |

## Zestawy (15) — bez usuwania przetestowanych Z

| Set | Kategoria | Obecna specjalizacja | Propozycja | Zachowywane Mistrzostwo Z |
|---|---|---|---|---|
| Wzmocniony | Odzież | PŻ i wytrzymałość | PŻ i wytrzymałość | Drugi oddech |
| Pancerny | Odzież | Pancerz i redukcja | Pancerz i redukcja | Niezłomna płyta |
| Elastyczny | Odzież | Zręczność i unik | Zręczność i unik | Kontratak po uniku |
| Zwinny | Odzież | Inicjatywa i precyzja | Inicjatywa, celność i szybkość | Błyskawiczny start |
| Lekki | Odzież | Percepcja i celność | Ataki i celność | Seria trafień |
| Odporny | Odzież | Wytrzymałość i krytyki | Wytrzymałość i krytyki | Redukcja premii krytyka |
| Tropicielski | Odzież | Percepcja i krytyki | Krytyki i oznaczenie celu | Oznaczenie celu |
| Żelazny | Odzież | Siła i moc trafienia | Moc ciosu i przebicie | Miażdżący cios |
| Wartowniczy | Odzież | Wytrzymałość i stabilność | Wytrzymałość i stabilność | Tarcza ratunkowa |
| Nomadyczny | Odzież | Zręczność i wszechstronność | Zręczność i wszechstronność | Bonus po utracie PŻ |
| Techniczny | Akcesoria | Inteligencja i penetracja | Inteligencja i penetracja | Skan pancerza |
| Spostrzegawczy | Akcesoria | Percepcja i krytyk | Percepcja i krytyk | Drugi celny cios |
| Przekonujący | Akcesoria | Charyzma i handel | Charyzma i handel | Autorytet / celność |
| Refleksyjny | Akcesoria | Zręczność i unik | Zręczność i unik | Przebicie po uniku |
| Wszechstronny | Akcesoria | Wytrzymałość i percepcja | Wytrzymałość i percepcja | Jednorazowa osłona |

## Proponowane testy przed wdrożeniem

1. 24 modele broni: konfiguracje 1, 2, 3, 4, 6, 8, 10, 12 ataków, przy niezmienionej podstawie broni.
2. Trzy rodzaje bonusów ofensywnych: +1 atak, +10% obrażeń, +5 pp krytyka — zestawiane na broni szybkiej i ciężkiej.
3. Obie strony pancerza: niski i wysoki, z przebiciem i bez niego.
4. Włączenie/wyłączenie X/Y/Z: zachować wszystkie obecne reguły aktywacji i 15 Mistrzostw Z.
5. Oddzielny test migracji `Ulepszony` i piątej jakości Mityczny — bez automatycznego przepisania starych przedmiotów na Mityczne.

**Wniosek:** najpierw zatwierdzić nową tabelę premii ofensywnych z symulacji. Dopiero później zmieniać pełnoprawne ataki w kodzie gry i wdrożeniu SQL.