# ASHEN v0.4.6.3 — Laboratorium równowagi broni

## Instalacja
Skopiuj `index.html`, `js/game.js` i `css/laboratory.css` do katalogu głównego repozytorium ASHEN, zachowując ścieżki. Nie jest potrzebny SQL ani reset ekwipunku.

## Nowy test
W Starciach otwórz Laboratorium wyposażenia i kliknij „Przetestuj 24 bronie × 4 poziomy pancerza”. Porównuje 24 modele przy pancerzu 0, 20, 40 i 60, po 100 symulacji dla każdej kombinacji, z tym samym przeciwnikiem i bieżącymi opcjami panelu. Wyniki i ustawienia zostają w lokalnej pamięci przeglądarki. Przycisk „Kopiuj raport do analizy” przygotowuje dane do wklejenia do rozmowy.

## Filozofia projektu
Nie tworzymy obowiązkowych zestawów broni na pojedynczych bossów. Każda klasa ma być grywalna przez całą grę. Style mogą się różnić, a konkretne modele mogą reprezentować różne etapy rozwoju. Wskaźniki zbiorcze są pomocnicze i **nie dowodzą jeszcze zbalansowania klas**.

## Ograniczenia
To test bieżącego prototypu nowego modelu w lokalnym silniku walk Starć. Nie modyfikuje prawdziwych walk ani silnika serwerowego Ekspedycji. 9600 symulacji może trwać chwilę na wolniejszym urządzeniu.
