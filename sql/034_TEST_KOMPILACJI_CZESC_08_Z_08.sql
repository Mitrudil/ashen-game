  'master_armor_light', CASE WHEN position('master_armor_light' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_warden', CASE WHEN position('master_armor_warden' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_reinforced', CASE WHEN position('master_armor_reinforced' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_plated', CASE WHEN position('master_armor_plated' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_technical', CASE WHEN position('master_accessory_technical' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_agile', CASE WHEN position('master_armor_agile' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_iron', CASE WHEN position('master_armor_iron' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_observant', CASE WHEN position('master_accessory_observant' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_flexible', CASE WHEN position('master_armor_flexible' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_resistant', CASE WHEN position('master_armor_resistant' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_reflexive', CASE WHEN position('master_accessory_reflexive' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_tracker', CASE WHEN position('master_armor_tracker' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_armor_nomad', CASE WHEN position('master_armor_nomad' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'master_accessory_versatile', CASE WHEN position('master_accessory_versatile' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'poprawka_totals', CASE WHEN position('"critical":0,"damage":0}]' in v)>0 THEN 'OK' ELSE 'BRAK' END,
  'zapisy_raportow', CASE WHEN position('insert into public.ashen_online_attacks' in lower(v))>0 THEN 'OK' ELSE 'BRAK' END,
  'wiadomosci', CASE WHEN position('insert into public.ashen_online_mail' in lower(v))>0 THEN 'OK' ELSE 'BRAK' END,
  'limit_pvp', CASE WHEN position('cnt>=2' in v)>0 THEN 'OK' ELSE 'BRAK' END
)) AS kontrole_sql034
FROM (SELECT pg_get_functiondef('public.ashen_online_attack(uuid)'::regprocedure) AS v) q;
ROLLBACK;
