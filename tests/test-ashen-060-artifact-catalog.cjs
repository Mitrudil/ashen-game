const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const B = require('../js/ashen-060-bonuses.js');
const P = require('../js/ashen-060-equipment-preview.js');
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.json'),'utf8'));
const expected = ['broń','kurtka','koszulka','spodnie','buty','nakrycie głowy','rękawice','akcesorium'];
const names = [...new Set(catalog.artifact_effects.map(e=>e.artifact))];
assert.equal(names.length,16);
assert.equal(catalog.artifact_effects.length,128);
for (const name of names) {
  const effects=catalog.artifact_effects.filter(e=>e.artifact===name);
  assert.deepEqual(effects.map(e=>e.slot_category).sort(),[...expected].sort());
  for (const e of effects) {
    assert.ok(Number.isFinite(Number(e.value)) && Number(e.value)>0,`Zerowy/niepoprawny efekt: ${name} / ${e.slot_category}`);
    assert.ok(B.STAT_KEYS[e.key],`Nieobsługiwana statystyka: ${e.key}`);
  }
}
for (const slot of Object.keys(P.CATEGORY_BY_SLOT)) {
  const choices=P.artifactChoices(catalog,slot,B);
  assert.equal(choices.length,16,`Brak artefaktów dla ${slot}`);
  assert.ok(choices.every(c=>c.value>0),`Zerowy podgląd: ${slot}`);
}
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.js'),'utf8'),sandbox);
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.Ashen060Catalog)),catalog,'JSON i JS muszą być identyczne');
const head=P.artifactChoices(catalog,'head',B).find(c=>c.name==='Żyła Żelaza');
assert.equal(head.stat_key,'armor');assert.equal(head.value,1);
console.log(`OK: 16 artefaktów x 8 kategorii = ${catalog.artifact_effects.length} dodatnich efektów; 11 slotów; katalog JSON/JS identyczny.`);
