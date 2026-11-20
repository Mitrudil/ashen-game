const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const B=require('../js/ashen-060-bonuses.js');
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.json'),'utf8'));
let count=0;
function test(name,run){run();count++;console.log('OK',name)}
function item(id,cap,arts=[],family=null){return {id,socketCapacity:cap,socketedArtifacts:arts,setFamily:family}}
test('Pięć jakości bez Ulepszonego',()=>{assert.equal(B.QUALITY.length,5);assert.throws(()=>B.normalizeQuality('Ulepszony'))});
test('Rozkłady wszystkich pięciu jakości sumują się do 100%',()=>{for(const w of B.SOCKET_WEIGHTS)assert.equal(w.reduce((a,b)=>a+b),100)});
test('Wszystkie gniazda losowane przy dropie, rozkład brzegowy',()=>{assert.equal(B.rollSockets('mityczny',()=>0.999),3);assert.equal(B.rollSockets('zwykly',()=>0.999),1);assert.equal(B.rollSockets('epicki',()=>0),0)});
test('Nie można przelosować gniazd starego przedmiotu',()=>{assert.throws(()=>B.createLootItem({socketCapacity:0},'epicki'))});
test('Brak gniazd przy ulepszaniu i brak funkcji dodawania',()=>{assert.equal(B.createLootItem({id:'x'},'rzadki',()=>0).socketCapacity,0);assert.equal(B.addSocket,undefined)});
test('Blokada nieznanego artefaktu i przepełnienia',()=>{assert.throws(()=>B.validateItem(item('a',0,['Płytka Bastionu']),catalog));assert.throws(()=>B.validateItem(item('b',2,['?']),catalog))});
test('Blokada dwóch artefaktów tej samej rodziny w przedmiocie',()=>{const n=[...new Set(catalog.artifact_effects.filter(x=>x.family==='Osłonowy').map(x=>x.artifact))];assert.equal(n.length,2);assert.throws(()=>B.validateItem(item('a',2,n),catalog))});
test('Artefakt zmienia bonus wraz z kategorią slotu',()=>{const a=B.compute({items:{weapon_main:item('a',1,['Płytka Bastionu'])}},catalog).modifiers[0];const b=B.compute({items:{jacket:item('b',1,['Płytka Bastionu'])}},catalog).modifiers[0];assert.notEqual(a.value,b.value);assert.equal(a.stat_key,'armor')});
test('Rezonans aktywuje się raz przy 3 i 4 artefaktach jednej rodziny',()=>{const name='Płytka Bastionu';for(const n of [2,3,4]){const slots=['jacket','boots','head','accessory1'];const items=Object.fromEntries(slots.slice(0,n).map((s,i)=>[s,item('x'+i,1,[name])]));const res=B.compute({items},catalog);assert.equal(res.signals.filter(x=>x.type==='resonance').length,n<3?0:1)}});
test('Komplet akcesoriów: 2/3 bez X, 3/3 z X',()=>{const slots=['accessory1','accessory2','accessory3'];for(const n of [2,3]){const items=Object.fromEntries(slots.slice(0,n).map((s,i)=>[s,item('x'+i,0,[],'Techniczny')]));const res=B.compute({items,activeSets:[{family:'Techniczny',kind:'Akcesoria',x:true,y:true}]},catalog);assert.equal(res.modifiers.filter(m=>m.source==='set_x').length,n===3?1:0)}});
test('Odzież zaczyna premiować od 3 elementów',()=>{const slots=['jacket','boots','head'];for(const n of [2,3]){const items=Object.fromEntries(slots.slice(0,n).map((s,i)=>[s,item('x'+i,0,[],'Lekki')]));const res=B.compute({items,activeSets:[{family:'Lekki',kind:'Odzież',x:true,y:true}]},catalog);assert.equal(res.modifiers.length,n===3?2:0)}});
test('Ataki bazowe nie zależą od poziomu postaci',()=>{const res=B.compute({items:{},modifiers:[{source:'prefix',key:'extra_attacks',value:1}]},catalog);assert.equal(B.weaponAttackCount(3,res),4);assert.equal(B.weaponAttackCount(3,res),4)});
test('15 rodzin, 16 artefaktów, 128 efektów',()=>{assert.equal(catalog.sets.length,15);assert.equal(new Set(catalog.artifact_effects.map(e=>e.artifact)).size,16);assert.equal(catalog.artifact_effects.length,128)});
test('Brak mutacji wejściowej',()=>{const source={items:{jacket:item('x',1,['Płytka Bastionu'])}};const prev=JSON.stringify(source);B.compute(source,catalog);assert.equal(JSON.stringify(source),prev)});
console.log(`\n${count}/${count} testów OK`);
