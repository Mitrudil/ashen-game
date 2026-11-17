// Testy wyciągają rzeczywiste funkcje game.js, bez połączenia z Supabase.
const fs=require('fs'), vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(require('path').join(__dirname,'../js/game.js'),'utf8');
function part(from,to){const i=src.indexOf(from),j=src.indexOf(to,i+from.length);assert(i>=0&&j>i,`missing ${from} / ${to}`);return src.slice(i,j)}
const sandbox={console,Math,Number,Object,Array,Set,Map,rarities:[{name:'Zwykły',mult:1}],
 def:i=>({id:i?.id||'goggles',name:'Gogle',slot:'head',armor:1,bonus:{per:2,end:1}}),
 rarity:()=>({name:'Zwykły',mult:1}),rarityPrefix:()=>'',prefixLabel:x=>x?.name||'',weaponSlot:()=>false,
 prefixDefs:[{id:'p',name:'Prefiks',bonus:{per:3}}],suffixDefs:[{id:'s',name:'Sufiks',bonus:{per:4,dex:1}}],
 COMBAT_V2_WORKSHOP:[0],UPGRADE_POWER:[0],combatV2WeaponConfig:()=>null,modifierText:()=>''};
vm.createContext(sandbox);
vm.runInContext(part('function findModifier(','// ASHEN v0.4.6.9'),sandbox);
vm.runInContext(part('function statsOf(inst){','// ASHEN v0.1.43'),sandbox);
const test=(obj)=>JSON.parse(JSON.stringify(vm.runInContext(`statsOf(${JSON.stringify(obj)})`,sandbox)));
assert.deepStrictEqual(test({id:'goggles'}).bonus,{per:2,end:1});
assert.deepStrictEqual(test({id:'goggles',prefix:'p'}).bonus,{per:5,end:1});
assert.deepStrictEqual(test({id:'goggles',prefix:'p',suffix:'s'}).bonus,{per:9,end:1,dex:1});
vm.runInContext(part('const SET_ENGINE_VERSION=','function setEngineEffects(){'),sandbox);
const calc=(id,cat,arr)=>JSON.parse(JSON.stringify(vm.runInContext(`evolutionSetFromQuality(${JSON.stringify(id)},${JSON.stringify(cat)},${JSON.stringify(arr)})`,sandbox)));
assert.equal(calc('armor_reinforced','clothing',[0,0,0]).y,false);
assert.equal(calc('armor_reinforced','clothing',[4,4,2]).z,true);
assert.equal(calc('armor_reinforced','clothing',[4,4,1]).z,false);
// Poprawny test 3/3 oraz brak premii dla 2/3.
assert.equal(vm.runInContext('evolutionSetFromQuality("accessory_technical","accessories",[4,4])',sandbox),null);
assert.equal(calc('accessory_technical','accessories',[4,4,2]).z,true);
// Liczby X/Y/Z w kodzie nie zmieniają się przez patch statystyk.
assert.equal(calc('armor_reinforced','clothing',[0,0,0]).effects.hpFlat,20);
assert.equal(calc('armor_reinforced','clothing',[4,4,2]).effects.hpFlat,60);
console.log('OK: bonusy bazowe / prefiks / sufiks oraz progi X/Y/Z (9 sprawdzeń)');
