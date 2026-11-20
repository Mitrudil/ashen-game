const fs=require('fs'),vm=require('vm');
const source=fs.readFileSync(process.argv[2],'utf8');
function expression(name){const marker='const '+name+'=';let p=source.indexOf(marker);if(p<0)throw Error('missing '+name);p+=marker.length;let end;if(['newPrefixDefs','newSuffixDefs','items','extraItems'].includes(name)){end=source.indexOf(['items','extraItems'].includes(name)?'];':'\n];',p);if(end<0)throw Error('unterminated array '+name);end+=(['items','extraItems'].includes(name)?1:2);}else{end=source.indexOf(';',p);if(end<0)throw Error('unterminated '+name);}return source.slice(p,end);}
function evaluate(name){return vm.runInNewContext('('+expression(name)+')',Object.create(null),{timeout:1500});}
const weapons=evaluate('COMBAT_V2_WEAPONS'),items=[...evaluate('items'),...evaluate('extraItems')],prefix=evaluate('newPrefixDefs'),suffix=evaluate('newSuffixDefs');
const range=new Set(evaluate('rangedIds')); // Set(expression) works
const melee=new Set(evaluate('meleeWeaponIds'));const light=new Set(evaluate('lightWeaponIds'));
const weaponsById={};for(const [id,v] of Object.entries(weapons)){
 const d=items.find(x=>x.id===id); if(!d)throw Error('weapon without item: '+id);
 weaponsById[id]={...v,bonus:d.bonus||{},name:d.name,slot:d.slot};
}
const affix=[...prefix.map(x=>({...x,kind:'prefix'})),...suffix.map(x=>({...x,kind:'suffix'}))];
const weaponAffixes=affix.filter(x=>x.id.startsWith('weapon_')).map(x=>({...x,allowedWeapons:Object.keys(weaponsById).filter(id=>{
 if(x.on==='weapon')return true;
 if(x.on==='ranged')return range.has(id);
 if(x.on==='meleeWeapon')return melee.has(id);
 if(x.on==='lightWeapon')return light.has(id);
 if(x.on==='oneHandWeapon')return /1R/.test(weaponsById[id].category);
 return false;
 })}));
if(Object.keys(weaponsById).length!==24||weaponAffixes.length!==15||affix.length!==42)throw Error('catalog sizes differ');
console.log(JSON.stringify({version:'060-e17',source:'js/game.js',weapons:weaponsById,weaponAffixes,equipmentAffixes:affix.filter(x=>!x.id.startsWith('weapon_'))}));