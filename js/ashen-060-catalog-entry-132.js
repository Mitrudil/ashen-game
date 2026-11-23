/* ASHEN 0.6 / etap 132: bezpieczny punkt wejścia do katalogu.
   Bez localStorage, bez Supabase, bez odczytu/zapisu postaci i bez modyfikacji ekwipunku. */
(()=>{
  'use strict';
  const CATALOG_URL='./ashen-060-katalog-test.html';
  const DATA_URL='./data/ashen-060-base-catalog-100.json';
  function ready(){
    if(document.getElementById('ashen060-catalog-entry'))return;
    const link=document.createElement('a');
    link.id='ashen060-catalog-entry';
    link.href=CATALOG_URL;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.textContent='Katalog ASHEN 0.6';
    link.setAttribute('aria-label','Otwórz testowy katalog przedmiotów ASHEN 0.6 w nowej karcie');
    link.style.cssText='position:fixed;right:12px;bottom:12px;z-index:9999;padding:9px 13px;border:1px solid #a68a5a;border-radius:9px;background:#17232cf0;color:#f1d6a2;text-decoration:none;font:600 13px system-ui,Arial,sans-serif;box-shadow:0 3px 14px #0008;max-width:calc(100vw - 24px)';
    link.title='Podgląd diagnostyczny — nie zmienia zapisów gry';
    document.body.append(link);
    // Check publicly hosted static catalog only. Never block or modify game startup.
    fetch(DATA_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()})
      .then(data=>{
        if(!Array.isArray(data.items)||data.items.length!==100||new Set(data.items.map(x=>x.modernId)).size!==100){throw Error('niepełny katalog')}
        link.title='Katalog 100 baz dostępny — podgląd tylko do odczytu';
        link.dataset.catalogStatus='ready';
      })
      .catch(()=>{
        link.title='Katalog testowy może nie być dostępny na tym serwerze';
        link.dataset.catalogStatus='unavailable';
      });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
