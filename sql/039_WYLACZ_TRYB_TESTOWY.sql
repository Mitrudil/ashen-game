-- AWARYJNE WYŁĄCZENIE TRYBU TESTOWEGO bez zmiany produkcyjnej funkcji.
-- Wystarcza, aby żaden aktywny testowy Z nie był nakładany na walki.
UPDATE public.ashen_pvp_test_z_config SET enabled=false,family=NULL,updated_at=now()
WHERE enabled OR family IS NOT NULL;
