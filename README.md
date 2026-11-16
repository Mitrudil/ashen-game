# ASHEN v0.4.6.1 — Laboratorium wyposażenia (eksperyment)

## Instalacja GitHub
Skopiuj **index.html**, **js/game.js**, **css/laboratory.css** do tych samych miejsc w repozytorium, zastępując poprzednie pliki. Nie potrzeba SQL i nie trzeba podmieniać grafik.

## Obsługa
Starcia → rozwiń `Laboratorium wyposażenia · model Necro II / ASHEN (TEST)`. Wybierz broń z 24 modeli, przeciwnika, pancerz, profil atrybutów, jakość, wariant Warsztatu i afiksy. Kliknij „Porównaj stare i nowe”.

Symulacje nie modyfikują gry, postaci, zasobów, łupów ani zapisów. Porównują dwie konfiguracje tego samego silnika lokalnego `fight()` z powtarzalnymi ziarnami RNG. Wariant stary odpowiada bazowej broni 1-atakowej z jednakową jakością i ulepszeniem, nie pełnemu profilowi posiadanej broni z jej rzeczywistymi afiksami i zestawami.

## Znane ograniczenia
- Nowe krytyki i penetracja są prototypami; redukcja pancerza nadal korzysta ze starego modelu ASHEN (ograniczenie 60%).
- Wstępne efekty prefiksu „Szybki” i części sufiksów są uproszczone; „Snajpera” nie ma jeszcze premii do pierwszego trafienia.
- Parametry broni są autorską propozycją ASHEN, nie kopiami parametrów BloodWars.
- Nie testuje serwerowych Ekspedycji.
- Na tym etapie nie ma zmian balansu w prawdziwych walkach.

## Sugerowany test
1000 symulacji: Karabin PK, pancerz 0 oraz 60, profil średni, jakość zwykła, bez modyfikatorów; następnie sprawdź karabin wyborowy przy tych samych ustawieniach.
