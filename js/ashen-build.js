/* Jedno zrodlo informacji o wersji gry i etapie przebudowy. */
(function(root){
'use strict';
const info=Object.freeze({gameVersion:'0.5.4.1',targetVersion:'0.6.0',modernDropsEnabled:false,stage:26,release:'060-e26',label:'przebudowa 0.6.0 · etap 26'});
root.ASHEN_BUILD=info;
document.title=`ASHEN — Kroniki Upadku v${info.gameVersion} · ${info.label}`;
})(window);
