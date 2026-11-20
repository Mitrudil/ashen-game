const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const {calculate,style,weaponAttributeDamage,weaponAccuracy}=require('../js/ashen-060-character-reference.js');
const {DATA,preview}=require('../tools/ashen-060-combat-reference.cjs');
const game=fs.readFileSync('js/game.js','utf8');
const twoHand=new Set(['rifle','shotgun','crossbow','carbine','hammer','sniper','flame','rail','lmg','harpoon','sledge','crowbar']);
const slotOf=id=>twoHand.has(id)?'hand2':'hand1';
const block=(start,end)=>{const a=game.indexOf(start),b=game.indexOf(end,a+start.length);assert(a>=0&&b>a);return game.slice(a,b)};
// Formula anchors from the actual game to catch drift from the read-only reference.
const attrsFormula=block('function attrs(){','function xpNeed()');
const defenseFormula=block('function heroDefense(options={}){','function fight(enemy,options={})');
const attackFormula=block('function heroAttacks(){','function heroDefense(options={})');
for(const x of ['setEngineEffects().effects','resonanceBonuses().bonus','statsOf(instance(uid))','roomLevel(\'infirmary\')'])assert(attrsFormula.includes(x)||game.includes(x));
for(const x of ['Math.floor(a.end/4)','Math.round(rawArmor*setArmor/100)','pet','vehicleArmor'])assert(defenseFormula.includes(x));
for(const x of ['Math.min(3,','Math.min(.36,.12*count*power)','power:Math.min','if(off&&off.slot===\'hand2\')'])assert(attackFormula.includes(x));
let cases=0;
function mk({weapon='knife',off=null,rarity=0,level=1,end=10,modern=false,bonusExtra=0,pet=0,headArmor=4,set={},res={}}={}){
 const attrs={str:9,dex:12,end,per:11,int:5,cha:5};
 const item=preview({id:weapon,rarity,upgrade:2,...(modern?{qualitySchema:'ashen-v06',quality:['zwykly','rzadki','epicki','legendarny','mityczny'][rarity]}:{})});
 const equipment={w:{uid:'w',id:weapon,slot:slotOf(weapon),...item,extraAttacks:item.extraAttacks+bonusExtra},armor:{uid:'armor',id:'test_armor',slot:'head',armor:headArmor,bonus:{end:2,dex:1}}};
 const equip={right:'w',head:'armor'};
 if(off){const x=preview({id:off,rarity});equipment.off={uid:'off',id:off,slot:slotOf(off),...x};equip.left='off'}
 return {baseAttrs:attrs,equipment,equip,setEffects:set,resonanceBonus:res,infirmaryLevel:level,petArmor:pet,dominantHand:'right',fallbackKnife:{id:'knife',slot:'hand1',min:4,max:8,baseAttacks:2}};
}
for(const weapon of Object.keys(DATA.weapons))for(let rarity=0;rarity<5;rarity++)for(const modern of [false,true]){
 const s=mk({weapon,rarity,modern,set:{hpFlat:5,hpPct:2,armorPct:10,armorFlat:3,accuracy:2,dodge:3,end:2},res:{dex:2},level:3});
 const r=calculate(s);const wb=DATA.weapons[weapon].bonus||{};assert.equal(r.attributes.end,14+(wb.end||0));assert.equal(r.attributes.dex,15+(wb.dex||0));
 assert.equal(r.defense.hp,Math.round((60+r.attributes.end*10)*1.05*1.02+5));
 assert.equal(r.defense.rawArmor,4);assert.equal(r.defense.armor,4+Math.round(4*.1)+Math.floor(r.attributes.end/4)+3);
 const expected=DATA.weapons[weapon].attacks;
 assert.equal(r.attackCount,expected);assert.equal(r.attacks[0].id,weapon);assert.equal(r.attacks[0].base,true);
 cases++;
}
for(const a of Object.keys(DATA.weapons))for(const b of ['knife','pistol','shotgun']){
 const s=mk({weapon:a,off:b,bonusExtra:2});const r=calculate(s);
 if(slotOf(b)==='hand2')assert.equal(r.attackCount,DATA.weapons[b].attacks);
 else if(slotOf(a)==='hand1')assert.equal(r.attackCount,DATA.weapons[a].attacks+1+DATA.weapons[b].attacks);
 cases++;
}
for(const id of Object.keys(DATA.weapons)){
 let s=mk({weapon:id,bonusExtra:1});let r=calculate(s);
 assert.equal(r.attackCount,DATA.weapons[id].attacks+(slotOf(id)==='hand1'?1:0));
 if(slotOf(id)==='hand1')assert.equal(r.attacks.at(-1).power,Math.min(.36,.12*DATA.weapons[id].attacks));
 cases++;
}
const a=calculate(mk({weapon:'pistol',headArmor:10,pet:2,end:20,set:{armorPct:25,armorFlat:4,hpFlat:7},level:5}));
assert.equal(a.defense.armor,10+Math.round(10*.25)+Math.floor(22/4)+2+4);

let bad=mk();bad.equip.left='w';assert.throws(()=>calculate(bad),/Duplicate/);
bad=mk();bad.equipment.w.bonus.end=Infinity;assert.throws(()=>calculate(bad),/Invalid/);
bad=mk();delete bad.equipment.w;assert.throws(()=>calculate(bad),/Missing/);
console.log('ASHEN 0.6 etap 18: '+cases+' scenariuszy wyposażenia/postaci + walidacja OK');
