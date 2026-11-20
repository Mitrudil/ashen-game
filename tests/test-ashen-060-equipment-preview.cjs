const assert=require('node:assert/strict');
const path=require('node:path');const fs=require('node:fs');
const B=require('../js/ashen-060-bonuses.js');const P=require('../js/ashen-060-equipment-preview.js');
const C=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.json')),'utf8');
let checks=0;function t(name,fn){fn();checks++;console.log('OK',name)}
t('Wszystkie 11 slotów kompatybilne',()=>assert.equal(Object.keys(P.CATEGORY_BY_SLOT).length,11));
t('Podgląd 16 artefaktów na kurtce',()=>assert.equal(P.artifactChoices(C,'outer',B).length,16));
t('Różny efekt tego samego artefaktu zależnie od slotu',()=>{const a=P.artifactChoices(C,'right',B).find(x=>x.name==='Płytka Bastionu');const b=P.artifactChoices(C,'outer',B).find(x=>x.name==='Płytka Bastionu');assert.notEqual(a.value,b.value)});
t('Nie przypisuje gniazd przedmiotom bez tego pola',()=>{const a={id:'a'},b={right:a};const out=P.compareEquipped(b,b,C,B);assert.deepEqual(out.before.totals,{});assert.equal(a.socketCapacity,undefined)});
t('Podgląd zmiany wyposażenia wylicza zmiany, nie modyfikuje wejścia',()=>{const a={right:{id:'a',socketCapacity:1,socketedArtifacts:['Płytka Bastionu']}};const b={right:{id:'b',socketCapacity:1,socketedArtifacts:[]}};const saved=JSON.stringify(a);const x=P.compareEquipped(a,b,C,B);assert.notDeepEqual(x.before.totals,x.after.totals);assert.equal(JSON.stringify(a),saved)});
t('Wszystkie artefakty przeliczane przez produkowany moduł',()=>{for(const s of Object.keys(P.CATEGORY_BY_SLOT))assert.equal(P.artifactChoices(C,s,B).length,16)});
console.log(`${checks}/${checks} testów adaptera OK`);
