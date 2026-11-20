-- ASHEN 0.6 / ETAP 16 — opcjonalny audyt TYLKO DO ODCZYTU.
-- Zestawia wielkość zapisów, liczbę założonych UID i odchylenia struktury.
-- Nie pokazuje nazw graczy, identyfikatorów ani wartości przedmiotów.
with saves as (
 select s.user_id, s.save_data,
  case when jsonb_typeof(s.save_data->'inventory')='array'
    then jsonb_array_length(s.save_data->'inventory') else null end as item_count,
  case when jsonb_typeof(s.save_data->'equip')='object'
    then (select count(*) from jsonb_each(s.save_data->'equip') e
      where e.value not in ('null'::jsonb, '""'::jsonb)) else null end as equipped_count
 from public.ashen_cloud_saves s
), profiles as (
 select s.*,p.snapshot,
  case when jsonb_typeof(p.snapshot->'attacks')='array'
    then jsonb_array_length(p.snapshot->'attacks') else null end as attacks_count
 from saves s left join public.ashen_online_profiles p using(user_id)
)
select count(*) as liczba_zapisow,
 count(*) filter(where item_count is null) as brak_prawidlowego_inventory,
 count(*) filter(where equipped_count is null) as brak_prawidlowego_equip,
 count(*) filter(where snapshot is not null) as z_opublikowanym_pvp,
 count(*) filter(where snapshot is not null and attacks_count is null) as bledna_tablica_atakow,
 max(attacks_count) as maks_atakow_w_migawce,
 max(item_count) as maks_przedmiotow,
 max(equipped_count) as maks_zalozonych
from profiles;
