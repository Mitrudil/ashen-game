const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const cand=fs.readFileSync(path.join(root,'sql/041_KANDYDAT_WALIDACJI_EKWIPUNKU_NIE_WDRAZAC.sql'),'utf8');
const ro=fs.readFileSync(path.join(root,'sql/041_AUDYT_MIGAWKI_EKWIPUNKU_READONLY.sql'),'utf8');
const build=fs.readFileSync(path.join(root,'js/ashen-build.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let n=0;function has(s,rx){assert.match(s,rx);n++}
for(const rx of [/security invoker/i,/auth\.uid\(\)/,/ashen_cloud_saves/,/jsonb_array_elements\(v_inventory\)/,/v_uid\s*=\s*any\(v_seen\)/,/jsonb_array_length\(v_item->'socketedArtifacts'\)\s*>\s*v_capacity/,/v_uid\s*=\s*any\(v_equipped\)/,/readyForModernPvp',false/,/qualitySchema/,/ashen-v06/,/legacy-v05/,/NIE URUCHAMIAĆ W PRODUKCJI/i])has(cand,rx);
assert.doesNotMatch(cand,/\b(insert|update|delete|truncate)\s+(into|from|public\.)/i);n++;
assert.doesNotMatch(ro,/\b(create|alter|drop|insert|update|delete|truncate)\s+(table|function|into|from|public\.)/i);n++;
has(build,/stage:17/);has(build,/modernDropsEnabled:false/);has(html,/060-e17/);
console.log('ASHEN etap 16: '+n+' kontroli plików kontraktu serwerowego OK (bez uruchamiania SQL)');
