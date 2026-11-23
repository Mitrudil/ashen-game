/* ASHEN 0.6 pakiet 130 — ręczna blokada ekwipunku podczas wyprawy (offline). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060MissionEquipLock130=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const message='Podczas wyprawy nie można zakładać ani zdejmować wyposażenia. Zestaw Szczęścia trzeba wybrać przed rozpoczęciem wyprawy.';
function blocked(state){return Boolean(state&&state.mission);}
return Object.freeze({blocked,message});
});
