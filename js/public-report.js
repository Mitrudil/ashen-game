(()=>{'use strict';
const target=document.getElementById('public-report-result');
const cfg=window.ASHEN_PUBLIC_CONFIG||{};
const token=new URLSearchParams(location.search).get('report')||'';
const valid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);
const show=(s)=>{target.textContent=s};
if(!valid){show('Nieprawidłowy link do raportu.');return}
if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url||'')||!cfg.key){show('Publiczne raporty nie są jeszcze skonfigurowane przez administratora ASHEN (js/public-config.js).');return}
if(!window.supabase?.createClient){show('Nie można połączyć się z Supabase.');return}
(async()=>{try{
 const client=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 const {data,error}=await client.rpc('ashen_public_pvp_report',{p_token:token});
 if(error)throw error;
 if(!data){show('Nie znaleziono udostępnionego raportu.');return}
 const render=window.ASHEN_ONLINE?.renderPublicReport;
 if(!render){show('Nie można wyświetlić raportu.');return}
 target.innerHTML=render(data);
 target.removeAttribute('role');
}catch(e){show('Nie udało się pobrać raportu: '+String(e.message||e).slice(0,220))}})();
})();