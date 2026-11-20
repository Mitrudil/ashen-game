const assert=require('node:assert/strict');
const Q=require('../js/ashen-060-quality.js');
const B=require('../js/ashen-060-bonuses.js');
const L=require('../js/ashen-060-loot.js');
let n=0;function eq(a,b){assert.deepEqual(a,b);n++;}
const sum=x=>x.reduce((s,v)=>s+v,0);
eq(Q.NEW,['Zwykły','Rzadki','Epicki','Legendarny','Mityczny']);
eq(Q.MULTIPLIERS,[1,1.12,1.26,1.42,1.60]);
for(const [name,pool] of Object.entries(Q.DROP_POOLS)) {eq(sum(pool),100);eq(pool.length,5);eq(Q.rollQuality(name,()=>0),0);eq(Q.rollQuality(name,()=>.999999),pool.findLastIndex(v=>v>0));}
for(let i=0;i<5;i++){eq(Q.describe({rarity:i}).label,Q.LEGACY[i]);}
const existing=[{uid:'a',rarity:1,socketCapacity:2,socketedArtifacts:[]},{uid:'b',rarity:4}];const copy=JSON.stringify(existing);
eq(Q.auditInventory(existing).requiresDecision,true);
eq(Q.migrationPreview(existing,'block')[0].status,'requires_decision');
eq(Q.migrationPreview(existing,'to_rare')[0].to,'Rzadki');
eq(Q.migrationPreview(existing,'to_common')[0].to,'Zwykły');
eq(Q.migrationPreview(existing,'to_rare')[1].to,'Legendarny');
eq(JSON.stringify(existing),copy);
assert.throws(()=>Q.migrationPreview(existing),/politykę/);n++;
assert.throws(()=>Q.migrationPreview(existing,'to_mythic'),/politykę/);n++;
for(let i=0;i<5;i++){
 const x=Q.createNewDrop({uid:'new-'+i,id:'knife'},'late_game',B,()=>[0,.10,.39,.80,.999][i],()=>.99);
 eq(x.qualitySchema,'ashen-v06');eq(x.rarity,i);eq(x.quality,Q.NEW_KEYS[i]);eq(x.socketedArtifacts,[]);
 eq(Q.describe(x).label,Q.NEW[i]);eq(Q.auditInventory([x]).modern,1);
 assert(x.socketCapacity>=0&&x.socketCapacity<=3);n++;
}
const legacy=L.prepareNewLoot({uid:'old-loot',id:'knife',rarity:1},B,()=>0);
eq(legacy.qualitySchema,'legacy-v05');eq(Q.describe(legacy).label,'Ulepszony');
assert.throws(()=>Q.createNewDrop({uid:'x',rarity:4},'ruins',B),/czystą metrykę/);n++;
assert.throws(()=>Q.rollQuality('ruins',()=>1),/poza/);n++;
assert.throws(()=>Q.describe({rarity:2,qualitySchema:'ashen-v06',quality:'mityczny'}),/Niespójna/);n++;
console.log(`ASHEN 0.6 etap 11: ${n} kontroli jakości OK`);
