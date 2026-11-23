/* ASHEN 0.6 / 138 — dobrowolny audyt lokalnego ekwipunku w interfejsie gry.
   Brak zapisu, brak Supabase, brak modyfikowania stanu game.js. */
(()=>{
 'use strict';
 const DATA='./data/ashen-060-base-catalog-100.json';
 const labels={ok:'Zgodny',unknownBase:'Baza spoza katalogu — do sprawdzenia',missingUid:'Brak UID w plecaku',ambiguousUid:'Powtórzony UID',reusedEquippedUid:'UID w kilku slotach',wrongSlot:'Nieprawidłowy slot',twoHandConflict:'Konflikt broni dwuręcznej',invalidUid:'Nieprawidłowy UID'};
 const slotLabels={right:'Prawa ręka',left:'Lewa ręka',head:'Głowa',shirt:'Koszulka',outer:'Pancerz',hands:'Rękawice',pants:'Spodnie',boots:'Buty',extra:'Akcesorium 1',extra2:'Akcesorium 2',extra3:'Akcesorium 3'};
 function element(tag,text){const e=document.createElement(tag);if(text!=null)e.textContent=String(text);return e}
 function init(){
  if(document.getElementById('ashen060-audit-trigger'))return;
  const trigger=element('button','Sprawdź ekwipunek 0.6');trigger.id='ashen060-audit-trigger';trigger.type='button';
  trigger.title='Kontrola lokalnego zapisu; nie sprawdza bazy Supabase';
  trigger.style.cssText='position:fixed;right:12px;bottom:57px;z-index:9999;padding:9px 13px;border:1px solid #a68a5a;border-radius:9px;background:#17232cf0;color:#f1d6a2;font:600 13px system-ui,Arial,sans-serif;cursor:pointer;max-width:calc(100vw - 24px)';
  document.body.append(trigger);
  let modal=null;
  function close(){if(modal){modal.remove();modal=null}trigger.focus()}
  function open(){
   if(modal){close();return}
   modal=element('section');modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Audyt lokalnego ekwipunku ASHEN 0.6');
   modal.style.cssText='position:fixed;z-index:10001;inset:5vh max(12px,calc((100vw - 760px)/2));overflow:auto;padding:18px;background:#192631;color:#ebf1f6;border:2px solid #a68a5a;border-radius:12px;box-shadow:0 0 0 100vmax #000a;font:14px/1.5 system-ui,Arial,sans-serif';
   const header=element('h2','ASHEN 0.6 — audyt lokalnego wyposażenia');header.style.margin='0 0 12px';modal.append(header);
   const notice=element('p','Kontrola jest tylko do odczytu. Dotyczy lokalnego zapisu tej domeny, który może różnić się od danych w Supabase. Nie ocenia uprawnień serwerowych ani wymagań poziomu.');modal.append(notice);
   const dismiss=element('button','Zamknij');dismiss.type='button';dismiss.style.cssText='padding:8px 14px;margin:0 0 12px;border-radius:7px;cursor:pointer';dismiss.addEventListener('click',close);modal.append(dismiss);
   const output=element('div','Odczyt i kontrola...');output.setAttribute('role','status');modal.append(output);
   document.body.append(modal);dismiss.focus();
   Promise.resolve().then(async()=>{
    const bridge=window.Ashen060ReadBridge134,audit=window.Ashen060EquipAudit135,local=window.Ashen060LocalSnapshot137;
    if(!bridge||!audit||!local)throw Error('Brakuje modułów 134, 135 lub 137 na tej gałęzi.');
    const snap=local.readSelected(window.localStorage);
    const response=await fetch(DATA,{cache:'no-store'});if(!response.ok)throw Error('Katalog 100 przedmiotów nie jest dostępny (HTTP '+response.status+').');
    const catalog=await response.json();bridge.indexCatalog(catalog);
    const result=audit.inspectEquipment(snap.snapshot,catalog);
    if(!modal)return;
    output.replaceChildren();
    const bad=result.rows.filter(r=>r.status!=='ok'&&r.status!=='unknownBase');
    const uncertain=result.rows.filter(r=>r.status==='unknownBase');
    output.append(element('p','Profil: '+snap.profile+' · zajęte sloty: '+result.rows.length+' · problemy: '+bad.length+' · do sprawdzenia: '+uncertain.length));
    const list=element('ul');for(const row of result.rows){list.append(element('li',(slotLabels[row.slot]||row.slot)+': '+(labels[row.status]||row.status)+' — '+row.reason))}output.append(list);
    const totals=Object.entries(result.inventoryTotals).map(([k,v])=>k+': '+v).join(' · ');
    output.append(element('p','Plecak: '+totals));
    if(result.unexpectedSlots.length)output.append(element('p','Dodatkowe klucze slotów: '+result.unexpectedSlots.join(', ')));
    output.append(element('p','Nie dokonano żadnych zmian w zapisie.'));
   }).catch(e=>{if(modal){output.replaceChildren(element('p','Nie udało się przeprowadzić audytu: '+e.message));}});
  }
  trigger.addEventListener('click',open);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal)close()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
