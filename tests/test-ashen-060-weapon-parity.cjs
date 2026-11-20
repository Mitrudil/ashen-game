const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {preview,DATA}=require('../tools/ashen-060-combat-reference.cjs');
const text=fs.readFileSync(path.join(__dirname,'../js/game.js'),'utf8');
function val(name){const m='const '+name+'=';const p=text.indexOf(m);assert(p>=0);let end=['newPrefixDefs','newSuffixDefs'].includes(name)?text.indexOf('\n];',p+m.length)+2:text.indexOf(';',p+m.length);return vm.runInNewContext('('+text.slice(p+m.length,end)+')');}
const source=val('COMBAT_V2_WEAPONS');
const pref=val('newPrefixDefs'),suf=val('newSuffixDefs');
assert.equal(Object.keys(source).length,24);assert.equal(DATA.weaponAffixes.length,15);
assert.equal(DATA.equipmentAffixes.length,27);
for(const id of Object.keys(source))for(const [k,v] of Object.entries(source[id]))assert.deepEqual(DATA.weapons[id][k],v);
const definitions=[...pref,...suf];
for(const a of [...DATA.weaponAffixes,...DATA.equipmentAffixes]){
 const x=definitions.find(d=>d.id===a.id);assert(x,'missing '+a.id);
 for(const [k,v] of Object.entries(x))assert.deepEqual(JSON.parse(JSON.stringify(a[k])),JSON.parse(JSON.stringify(v)));
}
let tested=0;
for(const id of Object.keys(source))for(let rarity=0;rarity<5;rarity++)for(let upgrade=0;upgrade<6;upgrade++)for(const modern of [false,true]){
 const w=source[id];const mult=(modern?[1,1.12,1.26,1.42,1.6]:[1,1.14,1.32,1.58,1.95])[rarity];
 const obj={id,rarity,upgrade,...(modern?{qualitySchema:'ashen-v06',quality:['zwykly','rzadki','epicki','legendarny','mityczny'][rarity]}:{})};
 const res=preview(obj),f=w.scale*mult*(1+[0,.028,.056,.084,.112,.14][upgrade]);
 assert.equal(res.min,Math.max(1,Math.round(w.min*f)));assert.equal(res.max,Math.max(1,Math.round(w.max*f)));
 assert.equal(res.baseAttacks,w.attacks);assert.equal(res.accuracy,w.accuracy);assert.equal(res.critPp,w.crit);
 tested++;
}
for(const a of DATA.weaponAffixes)for(const id of a.allowedWeapons){
 const obj={id,rarity:2,upgrade:3,[a.kind]:a.id};const r=preview(obj);const w=source[id];
 const f=w.scale*1.32*(1+(a.damagePct||0)/100)*1.084;
 assert.equal(r.min,Math.max(1,Math.round(w.min*f)));assert.equal(r.baseAttacks,w.attacks);assert.equal(r.extraAttacks,a.extraAttacks||0);
 tested++;
}
for(const id of Object.keys(source)){
 assert.throws(()=>preview({id,rarity:1,prefix:'weapon_invalid'}));
 assert.throws(()=>preview({id,rarity:4,qualitySchema:'ashen-v06',quality:'zwykly'}));
}
assert.throws(()=>preview({id:'shotgun',rarity:2,prefix:'weapon_quick'}));
assert.throws(()=>preview({id:'knife',rarity:5}));
const sql=fs.readFileSync(path.join(__dirname,'../sql/042_KANDYDAT_PARAMETRY_BRONI_NIE_WDRAZAC.sql'),'utf8');
for(const key of Object.keys(source))assert(sql.includes('"'+key+'"'),'missing SQL '+key);
assert(sql.includes('NIE URUCHAMIAĆ NA PRODUKCJI'));
console.log('ASHEN 0.6 etap 17: '+tested+' przekrojów broni/afiksów oraz zabezpieczenia OK; SQL tylko kontrola statyczna');
