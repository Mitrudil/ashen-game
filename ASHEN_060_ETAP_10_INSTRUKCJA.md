# ASHEN 0.6.0 — ETAP 10: rzeczywiste gniazda w nowych łupach

## Co działa
- Nowy sprzęt z wypraw lokalnych losuje i zapisuje `socketCapacity` (0–3) oraz `socketedArtifacts: []` dokładnie raz.
- Unikatowe nagrody z lokalnych Starć i odebrane nagrody ekspedycji klanowych też losują gniazda przy **przyznaniu do ekwipunku**.
- Stare przedmioty z zapisów, startowy ekwipunek, materiały oraz osobne artefakty starego systemu **nie dostają** nowych gniazd.
- Szczegóły nowo zdobytego przedmiotu pokazują liczbę gniazd; podgląd artefaktów wyświetla te same dane.
- Próba ponownego losowania gniazd jest blokowana.

## WAŻNE — granica etapu
Obecny system jakości 0.5.4.1 nadal używa porządku Zwykły/Ulepszony/Rzadki/Epicki/Legendarny. Dlatego w tym etapie wyłącznie **do prawdopodobieństw gniazd** używamy mapowania indeksów: Zwykły→Zwykły, Ulepszony→Zwykły, Rzadki→Rzadki, Epicki→Epicki, Legendarny→Legendarny. Nie jest to migracja istniejących przedmiotów ani docelowy balans 0.6.

**Nie wolno uznać, że pięć nowych jakości zostało już wdrożonych.** Przed migracją należy ustalić politykę dla starych ulepszonych przedmiotów oraz zaktualizować wszystkie źródła nagród (w tym SQL), nazwy, kolory i mnożniki bez uszkadzania zapisów. Gniazda nie zmieniają dziś statystyk ani PvP. Brak osadzania artefaktów.

## Uruchom testy
```
node tests/test-ashen-060-loot.cjs
node tests/test-ashen-060-bonuses.cjs
node tests/test-ashen-060-equipment-preview.cjs
node tests/test-ashen-060-artifact-catalog.cjs
node --check js/game.js
```

Nie trzeba uruchamiać SQL. Wgraj ZIP aktualizacyjny do korzenia repozytorium, z zachowaniem ścieżek. Jeśli planujesz testowe nagrody na głównej postaci, wcześniej wykonaj kopię zapisu.
