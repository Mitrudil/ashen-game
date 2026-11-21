# ASHEN 0.6.0 — etap 19: izolowany podgląd premii 0.6 postaci

## Dostarczono
- `js/ashen-060-character-modifiers.js` — nowy, samodzielny adapter odczytowy współpracujący z `Ashen060Bonuses.compute()` i `Ashen060CharacterReference.calculate()`.
- Obsługa **jawnych** bonusów do STR/DEX/END/PER/INT/CHA, PŻ (płaskich i %), pancerza (płaskich i %), celności i uniku.
- Procent pancerza liczony wyłącznie od pancerza założonych elementów, zgodnie z dotychczasowym algorytmem.
- Rozdzielenie efektów nierozstrzygniętych: krytyki, obrażenia, dodatkowe ataki, efekty warunkowe i sygnały rezonansu — `unresolved`, `pendingSignals` oraz `complete:false`.
- Zakaz mieszania `setEffects` i `resonanceBonus` starego silnika z nowym podglądem, aby uniknąć podwójnego naliczania.
- `tests/test-ashen-060-character-modifiers.cjs` — 10 testów, w tym artefakty, HP, pancerz, komplet 2/3, rezonans, nieznane efekty, brak mutacji.
- Etap **19**, cache `060-e19`; wersja rozgrywki **0.5.4.1** pozostaje bez zmian.

## Użycie testowe (Node)
```js
const bonuses=require('./js/ashen-060-bonuses.js');
const reference=require('./js/ashen-060-character-reference.js');
const modern=require('./js/ashen-060-character-modifiers.js');
const result=bonuses.compute({items:{},modifiers:[{source:'prefix',key:'PŻ',value:10}]},catalog);
const view=modern.preview(characterSnapshot,result,reference);
// view.complete === false => przejrzyj view.unresolved / view.pendingSignals
```
`snapshot` używa formatu z etapu 18, a `catalog` jest wczytanym katalogiem 0.6. Nie przekazuj do migawki starych `setEffects` / `resonanceBonus`.

## Ważne ograniczenia
- To **narzędzie do obliczeń i testowania**, nie włączony system walki 0.6. Moduł podpięto do HTML, ale nie jest używany przez `attrs()`, `heroAttacks()` ani SQL RPC.
- Liczba ataków pozostaje w tym podglądzie zgodna ze starą grą. Nowa pełna dodatkowa próba ataku wymaga wskazania broni/docelowej reguły, więc jest zgłaszana jako nierozstrzygnięta — nie doliczamy jej po cichu.
- Nie wdrożono automatycznego wyznaczania progów X/Y ani skalowania premii średnią jakością; wartości X/Y w katalogu nadal są **robocze**. Zdarzenia Mistrzostw Z oraz rezonansów oczekują na reguły walki.
- Nie przeprowadzono testów na prawdziwym PostgreSQL / Supabase. SQL041/042 nadal nie wdrażać do produkcji.
- Dane postaci oraz stan łupów w produkcyjnej grze nie zostały zmienione.

## Testowanie
`node tests/test-ashen-060-character-modifiers.cjs`

Następny krok: zatwierdzić progi i skalę X/Y średnią jakością, następnie dodać kompletny rozdział efektów na fazy walki i testować pełne dodatkowe ataki osobno od starego `Szybki`.
