-- ASHEN v0.2.7: OPTIONAL message rate limiting. RUN ONLY IN ASHEN PROJECT.
-- Requires 003_online_pvp.sql. Existing mail and battle reports remain intact.
create or replace function public.ashen_online_send(p_recipient uuid,p_body text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare u uuid:=auth.uid();bid bigint;nm text;recent integer;daily integer;
begin
 if u is null then raise exception 'Zaloguj się.';end if;
 if p_recipient is null or p_recipient=u then raise exception 'Nieprawidłowy odbiorca.';end if;
 if char_length(trim(coalesce(p_body,''))) not between 1 and 1500 then raise exception 'Wiadomość: 1–1500 znaków.';end if;
 if not exists(select 1 from public.ashen_online_profiles where user_id=p_recipient) then raise exception 'Nie znaleziono odbiorcy.';end if;
 select name into nm from public.ashen_online_profiles where user_id=u;
 if nm is null then raise exception 'Najpierw opublikuj swoją postać.';end if;
 -- Serialize concurrent sends to prevent racing the per-sender limits.
 perform 1 from auth.users where id=u for update;
 select count(*) into recent from public.ashen_online_mail
  where sender_id=u and kind='personal' and created_at>now()-interval '1 minute';
 if recent>=5 then raise exception 'Limit wiadomości: maksymalnie 5 na minutę.';end if;
 select count(*) into daily from public.ashen_online_mail
  where sender_id=u and kind='personal' and created_at>now()-interval '1 day';
 if daily>=60 then raise exception 'Limit wiadomości: maksymalnie 60 na 24 godziny.';end if;
 insert into public.ashen_online_mail(sender_id,recipient_id,kind,subject,body)
 values(u,p_recipient,'personal','Wiadomość od '||nm,trim(p_body)) returning id into bid;
 return bid;
end $$;
revoke all on function public.ashen_online_send(uuid,text) from public,anon;
grant execute on function public.ashen_online_send(uuid,text) to authenticated;
