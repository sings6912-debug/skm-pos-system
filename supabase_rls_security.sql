-- =========================================================================
-- SKM POS v31 Pro — Supabase Security, RLS Policies & Stock RPC
-- របៀបប្រើ៖ ចូល Supabase Dashboard -> SQL Editor -> New Query -> Paste -> Run
-- =========================================================================

-- 1. ធានាថាមាន Function កាត់ស្តុកដោយសុវត្ថិភាព (Atomic Stock Deduction)
CREATE OR REPLACE FUNCTION public.deduct_stock_safely(
    p_product_id TEXT,
    p_branch_id TEXT,
    deduct_qty NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.pos_products
    SET qty = GREATEST(0, COALESCE(qty, 0) - GREATEST(0, deduct_qty)),
        updated_at = NOW()
    WHERE id = p_product_id
      AND branch_id = p_branch_id;
END;
$$;

-- 2. បង្កើតតារាង pos_audit_logs សម្រាប់កំណត់ត្រាការពារការបន្លំ (Append-Only — លុបមិនបាន)
CREATE TABLE IF NOT EXISTS public.pos_audit_logs (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    severity TEXT DEFAULT 'warning',
    staff_name TEXT,
    staff_role TEXT,
    amount NUMERIC DEFAULT 0,
    details TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pos_audit_logs_branch_created
    ON public.pos_audit_logs (branch_id, created_at DESC);

-- 3. បើក Row Level Security (RLS) លើគ្រប់តារាងទាំងអស់
ALTER TABLE IF EXISTS public.branch_store     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pos_products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pos_orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pos_customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pos_expenses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pos_history_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.branch_licenses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pos_audit_logs   ENABLE ROW LEVEL SECURITY;

-- 4. កំណត់សិទ្ធិតារាង pos_audit_logs: អនុញ្ញាតតែ INSERT និង SELECT ប៉ុណ្ណោះ (ហាម UPDATE / DELETE ដាច់ខាត!)
DROP POLICY IF EXISTS "skm_audit_select" ON public.pos_audit_logs;
DROP POLICY IF EXISTS "skm_audit_insert" ON public.pos_audit_logs;

CREATE POLICY "skm_audit_select"
    ON public.pos_audit_logs FOR SELECT
    USING (branch_id IS NOT NULL AND length(branch_id) > 0);

CREATE POLICY "skm_audit_insert"
    ON public.pos_audit_logs FOR INSERT
    WITH CHECK (branch_id IS NOT NULL AND length(branch_id) > 0);

-- 5. កំណត់សិទ្ធិតារាង branch_licenses: អនុញ្ញាតតែអាន (SELECT) ដើម្បីផ្ទៀងផ្ទាត់ License ហាមអតិថិជនកែ/លុប
DROP POLICY IF EXISTS "skm_licenses_read_only" ON public.branch_licenses;
CREATE POLICY "skm_licenses_read_only"
    ON public.branch_licenses FOR SELECT
    USING (true);

-- 6. កំណត់សិទ្ធិតារាងប្រតិបត្តិការតាម Branch (សម្រាប់ប្រព័ន្ធ POS + Digital Menu ដំណើរការរលូន)
-- ចំណាំ៖ ប្រសិនបើអ្នកចង់ចាក់សោតឹងរ៉ឹងតាម Supabase Auth (auth.uid()) សូមប្តូរ USING (...) ទៅ auth.role() = 'authenticated'
-- សម្រាប់តារាង pos_expenses, pos_history_logs និង branch_store UPDATE។
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['branch_store', 'pos_products', 'pos_orders', 'pos_customers', 'pos_expenses', 'pos_history_logs']
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
            EXECUTE format('DROP POLICY IF EXISTS "skm_branch_scoped_select" ON public.%I;', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "skm_branch_scoped_insert" ON public.%I;', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "skm_branch_scoped_update" ON public.%I;', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "skm_branch_scoped_delete" ON public.%I;', tbl);

            EXECUTE format('CREATE POLICY "skm_branch_scoped_select" ON public.%I FOR SELECT USING (branch_id IS NOT NULL AND length(branch_id) > 0);', tbl);
            EXECUTE format('CREATE POLICY "skm_branch_scoped_insert" ON public.%I FOR INSERT WITH CHECK (branch_id IS NOT NULL AND length(branch_id) > 0);', tbl);
            EXECUTE format('CREATE POLICY "skm_branch_scoped_update" ON public.%I FOR UPDATE USING (branch_id IS NOT NULL AND length(branch_id) > 0) WITH CHECK (branch_id IS NOT NULL AND length(branch_id) > 0);', tbl);
            -- ហាមលុប branch_store ទាំងមូលពី Client
            IF tbl <> 'branch_store' THEN
                EXECUTE format('CREATE POLICY "skm_branch_scoped_delete" ON public.%I FOR DELETE USING (branch_id IS NOT NULL AND length(branch_id) > 0);', tbl);
            END IF;
        END IF;
    END LOOP;
END $$;

-- 7. ផ្តល់សិទ្ធិដល់ Public View សម្រាប់ Digital Menu ដោយលាក់ user_accounts (Optional Hardening)
CREATE OR REPLACE VIEW public.branch_public_menu_view AS
SELECT
    branch_id,
    shop_info,
    sys_settings,
    active_plugins,
    updated_at
FROM public.branch_store;

GRANT SELECT ON public.branch_public_menu_view TO anon, authenticated;
