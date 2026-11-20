# ASHEN 0.6.0 — etap 5: porównanie kompletnych konfiguracji

**Status: LABORATORIUM PROJEKTOWE. Bez zmian w grze, PvE i SQL.**

## Oparte na rzeczywistych danych
- `24` modeli broni z etapu 4: nazwa, rodzaj, podstawowe ataki i średnie obrażenia z wcześniejszego laboratorium.
- `15` proponowanych zestawów X/Y i ich niezmienione identyfikatory/role Z.
- `16` artefaktów, `8` rodzin i efekty zależne od kategorii wyposażenia; jedna rodzina w jednym przedmiocie.
- `7` propozycji prefiksów i `8` sufiksów. Wybór prefiksu i sufiksu w laboratorium dotyczy wyłącznie jawnie rozpoznanych premii ofensywnych z propozycji.

## Uproszczona formuła do porównań
- Każdy z N ataków ma niezależną szansę trafienia p (ustawianą ręcznie), niezależną szansę krytyka c po trafieniu i tę samą średnią wartość obrażeń bazowych na cios.
- Obrażenia niekrytyczne = max(0, bazowe obrażenia na cios × (1 + bonus% /100) - pancerz na cios).
- Obrażenia krytyczne = max(0, bazowe obrażenia na cios × (1 + bonus%/100) × mnożnik krytyka - pancerz na cios).
- Średnia/runda = N × p × [(1−c)×obrażenia niekrytyczne + c×obrażenia krytyczne].
- Pusta runda z braku trafień = (1−p)^N. NIE oznacza wszystkich rund z 0 obrażeń przy pełnym pochłanianiu przez pancerz.
- Każde '+1 atak' oznacza pełną próbę **tylko w tej symulacji**. Produkcyjny 'Szybki' nadal daje cios osłabiony.

## Granice testu / rzeczy do zrobienia
1. Właściwy kod PvP SQL 034 stosuje własny model szans trafienia, pancerza, krytyków i kolejności efektów — **wyniki tutaj nie są tożsame z serwerem**.
2. Afiksy są propozycjami opisowymi, więc laboratorium jawnie interpretuje tylko nazwy efektów, które uda się rozpoznać. Nie zakładamy, że wszystkie premie w istniejącym kodzie mają identyczną semantykę.
3. Statystyki z broni w tabelach mogą być uśrednionymi wartościami wcześniejszego laboratorium — nie oznaczają konkretnych wartości z ekwipunku Mitrudila.
4. Artefakty i zestawy z etapu 4 to wartości kandydujące, bez wpływu na serwer.
5. Następny etap: spisać oficjalny format premii (typy i kolejność sumowania), zbalansować bazowe bronie, a potem uruchomić deterministyczne scenariusze oparte o rzeczywisty silnik SQL przed wdrożeniem.

## Pierwszy wniosek
Premie do pełnych dodatkowych ataków nie są wymienne z premią +10% obrażeń. Na jednowystrzałowej broni pełne +1 podwaja próby (i przed obroną potencjał), a na broni z trzema próbami zwiększa liczbę prób o 33,3%. Mocny pancerz dodatkowo zmienia relację obrażeń na cios. Laboratorium pozwala wybrać warianty bez wprowadzania ukrytych korekt.
