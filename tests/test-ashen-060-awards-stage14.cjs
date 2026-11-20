const assert=require('node:assert/strict');
const Loot=require('../js/ashen-060-loot.js');
const Q=require('../js/ashen-060-quality.js');
const B=require('../js/ashen-060-bonuses.js');
let n=0;function eq(a,b){assert.deepEqual(a,b);n++;}
const sum=w=>w.reduce((a,b)=>a+b,0);
for(const pool of ['ruins','hospital','outpost']){
 const base=Loot.modernWeights(pool,Q,0);eq(base,Q.DROP_POOLS[pool]);
 for(const luck of [0,1,5,12,100]){
  const w=Loot.modernWeights(pool,Q,luck);eq(sum(w),100);eq(w.length,5);
  eq(w.findLastIndex(v=>v>0),base.findLastIndex(v=>v>0));
  eq(w[0]<=base[0],true);
  for(const x of [.001,.2,.5,.9999]){const k=Loot.rollWeightedQuality(w,()=>x);eq(k>=0&&k<=4,true);}
 }
}
for(let i=0;i<5;i++){
 const w=Q.DROP_POOLS.late_game;let lo=w.slice(0,i).reduce((a,b)=>a+b,0)/100;
 const item=Loot.prepareModernLoot({uid:'stage14-'+i,id:'knife'},'late_game',Q,B,()=>lo+w[i]/200,()=>.9);
 eq(item.qualitySchema,'ashen-v06');eq(item.rarity,i);eq(item.quality,Q.NEW_KEYS[i]);
 eq(item.socketedArtifacts,[]);eq(Q.describe(item).label,Q.NEW[i]);
 assert(Number.isInteger(item.socketCapacity)&&item.socketCapacity>=0&&item.socketCapacity<=3);n++;
 assert.throws(()=>Loot.prepareModernLoot(item,'late_game',Q,B));n++;
}
const legacy=Loot.prepareNewLoot({id:'knife',uid:'old',rarity:1},B,()=>0);
eq(legacy.qualitySchema,'legacy-v05');eq(Q.describe(legacy).label,'Ulepszony');
assert.throws(()=>Loot.rollWeightedQuality([50,50,0,0,10]),/wagi/);n++;
assert.throws(()=>Loot.rollWeightedQuality([100,0,0,0,0],()=>1),/los/);n++;
const fs=require('node:fs');const build=fs.readFileSync(require('node:path').join(__dirname,'../js/ashen-build.js'),'utf8');
assert.match(build,/modernDropsEnabled:false/);n++;
const game=fs.readFileSync(require('node:path').join(__dirname,'../js/game.js'),'utf8');
assert.match(game,/ASHEN_060_MODERN_DROPS_ENABLED/);n++;
console.log(`ASHEN 0.6 etap 14: ${n} kontroli nowego generatora OK`);
