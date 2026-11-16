ASHEN v0.3.9.5 — wspólna pula podstawowych przedmiotów na wszystkich wyprawach

Wgraj do katalogu głównego repozytorium:
- index.html
- js/game.js

Zmiana: wszystkie standardowe przedmioty (broń, ubiór, akcesoria) mogą zostać znalezione zarówno w Ruinach osiedla, Starym szpitalu, jak i Posterunku wojskowym. Każdy ma dodatnią wagę w puli, bez ograniczenia lokacji. Zachowano względne wagi z dotychczasowych tabel (wybierając najwyższą istniejącą wartość); dla dotąd pomijanych elementów zastosowano wagę 0.10.

BEZ ZMIAN: rzadkość wypadających przedmiotów jest nadal wyznaczana osobno dla każdej wyprawy (bliska: zwykły/ulepszony; średnia: do epickiego; daleka: do legendarnego), nie zmieniono liczby łupów, działania eksploracji, losowania prefiksów/sufiksów ani ograniczeń zgodności modyfikatorów z typem przedmiotu.

Artefakty zachowują oddzielną pulę i ograniczenia wypraw; unikatowe przedmioty bossów pozostają ich nagrodami; surowce nie trafiają do zwykłej puli wyposażenia.

Wersja adresu skryptu w index.html została zwiększona dla uniknięcia starego cache.
Bez SQL i bez resetowania zapisów.
