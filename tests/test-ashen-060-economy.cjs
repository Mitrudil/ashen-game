const assert=require('node:assert/strict');
const Q=require('../js/ashen-060-quality.js');
const B=require('../js/ashen-060-quality-bridge.js');
const economy={saleRarity:[1,1.5,2.4,4.5,8],yieldRarity:[1,1.2,1.5,2,2.7]};
let n=0;
for(let index=0;index<5;index++){
 const old={rarity:index};
 const modern={rarity:index,qualitySchema:'ashen-v06',quality:Q.NEW_KEYS[index]};
 for(const [kind,key] of [['sale','saleRarity'],['salvage','yieldRarity']]){
  const before=JSON.stringify(old),mBefore=JSON.stringify(modern);
  assert.equal(B.economyMultiplier(old,kind,Q,economy),economy[key][index]);n++;
  assert.equal(B.economyMultiplier(modern,kind,Q,economy),B.MODERN_ECONOMY[kind][index]);n++;
  assert.equal(JSON.stringify(old),before);n++;
  assert.equal(JSON.stringify(modern),mBefore);n++;
 }
}
assert.throws(()=>B.economyMultiplier({rarity:1},'other',Q,economy));n++;
assert.throws(()=>B.economyMultiplier({rarity:4,qualitySchema:'ashen-v06',quality:'legendarny'},'sale',Q,economy));n++;
console.log(`ASHEN 0.6 etap 13: ${n} testow ekonomii OK`);
