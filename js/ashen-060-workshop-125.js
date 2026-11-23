/* ASHEN 0.6 — pakiet 125: jednoznaczna kategoryzacja materiałów nowego katalogu.
 * Nie zmienia zapisów ani reguł walki. Przedmioty legacy wyłączone z warsztatu Testera.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Workshop125=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function family(item){
 if(!item||!/^base-\d{2}-\d{2}$/.test(item.id||''))return null;
 const c=item.modernCategory;
 if(item.modernBase122){
  if(['palna_1h','palna_2h'].includes(c))return 'gun';
  if(['biala_1h','biala_2h'].includes(c))return 'melee';
  if(c==='dystansowa')return 'gun'; // mechanizmy dystansowe — części i złom
  throw Error('Nieznana kategoria broni 0.6: '+c);
 }
 if(item.modernBase123){
  if(['koszulka','spodnie'].includes(c))return 'cloth';
  if(c==='buty')return 'leather';
  if(c==='rekawice')return 'leather';
  if(c==='pancerz')return 'metalarmor';
  if(c==='glowa')return 'cloth';
  if(c==='akcesorium')return 'electronics';
  throw Error('Nieznana kategoria odzieży 0.6: '+c);
 }
 return null;
}
function canUpgrade(item,instance){return !!family(item)&&instance?.qualitySchema==='ashen-v06'&&Number.isInteger(Number(instance.upgrade||0))&&Number(instance.upgrade||0)>=0&&Number(instance.upgrade||0)<=5;}
function qualityIndex(instance,qualityApi){
 if(instance?.qualitySchema!=='ashen-v06')throw Error('Warsztat 0.6 wymaga nowej jakości');
 const q=qualityApi.describe(instance);
 if(q.schema!=='ashen-v06'||!Number.isInteger(q.index)||q.index<0||q.index>4)throw Error('Nieprawidłowa jakość 0.6');
 return q.index;
}
return Object.freeze({family,canUpgrade,qualityIndex});
});
