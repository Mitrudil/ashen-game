const assert=require('node:assert/strict');
const Bonuses=require('../js/ashen-060-bonuses.js');
const Loot=require('../js/ashen-060-loot.js');
let tests=0;const ok=(a,b)=>{assert.deepEqual(a,b);tests++};
// 5 starych etykiet są tymczasowo mapowane bez zmiany istniejących indeksów jakości.
ok(Loot.LEGACY_SOCKET_TIER,['zwykly','zwykly','rzadki','epicki','legendarny']);
for(let rarity=0;rarity<5;rarity++){
 for(let roll of [0,.249999,.499999,.749999,.999999]){
  const base={uid:'test-'+rarity,id:'knife',rarity,prefix:null};
  const item=Loot.prepareNewLoot(base,Bonuses,()=>roll);
  ok(item.rarity,rarity);ok(item.socketedArtifacts,[]);
  assert(Number.isInteger(item.socketCapacity)&&item.socketCapacity>=0&&item.socketCapacity<=3);tests++;
  assert(!('socketCapacity' in base));tests++;
  assert.throws(()=>Loot.prepareNewLoot(item,Bonuses,()=>0),/ponownie/);tests++;
 }
}
const drop=Loot.prepareNewLoot({uid:'x',id:'knife',rarity:4},Bonuses,()=>.9999);ok(drop.socketCapacity,3);
assert.throws(()=>Loot.prepareNewLoot({id:'x',rarity:5},Bonuses),/rzadkość/);tests++;
assert.throws(()=>Loot.prepareNewLoot({id:'x',rarity:0,socketCapacity:1},Bonuses),/ponownie/);tests++;
console.log(`ASHEN 0.6 etap 10: ${tests} testów OK`);
