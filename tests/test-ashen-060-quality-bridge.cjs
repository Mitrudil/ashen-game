const assert=require('node:assert/strict');
const Q=require('../js/ashen-060-quality.js');
const B=require('../js/ashen-060-quality-bridge.js');
let n=0;const ok=(actual,expected)=>{assert.deepEqual(actual,expected);n++};
for(let i=0;i<5;i++){
  const legacy={uid:'old',rarity:i}, modern={uid:'new',rarity:i,qualitySchema:'ashen-v06',quality:Q.NEW_KEYS[i]};
  const backup=[JSON.stringify(legacy),JSON.stringify(modern)];
  ok(B.resolve(legacy,Q).name,Q.LEGACY[i]);ok(B.resolve(modern,Q).name,Q.NEW[i]);
  ok(B.resolve(legacy,Q).mult,[1,1.14,1.32,1.58,1.95][i]);ok(B.resolve(modern,Q).mult,Q.MULTIPLIERS[i]);
  for(const f of ['m','f','p']){ok(typeof B.prefix(legacy,f,Q),'string');ok(typeof B.prefix(modern,f,Q),'string')}
  ok(B.qualityArmorFloor(modern,Q),[0,1,2,3,5][i]);
  ok(JSON.stringify(legacy),backup[0]);ok(JSON.stringify(modern),backup[1]);
}
ok(B.prefix({rarity:1},'m',Q),'Ulepszony');
ok(B.prefix({rarity:1,qualitySchema:'ashen-v06',quality:'rzadki'},'m',Q),'Rzadki');
ok(B.prefix({rarity:4,qualitySchema:'ashen-v06',quality:'mityczny'},'f',Q),'Mityczna');
ok(B.prefix({rarity:4,qualitySchema:'ashen-v06',quality:'mityczny'},'p',Q),'Mityczne');
ok(B.ranking({rarity:1},Q),.5);
ok(B.ranking({rarity:4,qualitySchema:'ashen-v06',quality:'mityczny'},Q),4);
assert.throws(()=>B.resolve({rarity:4,qualitySchema:'ashen-v06',quality:'legendarny'},Q),/Niespójna/);n++;
console.log(`ASHEN 0.6 etap 12: ${n} testów mostu jakości OK`);
