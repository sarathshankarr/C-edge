-- CED-1626: adds per-PIECE barcode support alongside the existing LOT/BALE
-- barcode generation (generateBarcodesOnApprove). No schema change needed --
-- grn_checking_barcode.entity_type is already VARCHAR(10), which fits the
-- new 'PIECE' value; only a new barcode_generation_based_menuIds seed row
-- is required, continuing the exact same (company, menu 981, type)
-- sequence-counter convention LOT ('981001')/BALE ('981002') already use.
--
-- Seeded only for company_id(s) that already have a LOT or BALE row for
-- menu 981 today -- i.e. company 1 only, in this database, matching the
-- current reality (see 03_grn_checking_menu.sql's own comment: "the only
-- company in this database"). This does NOT attempt to backfill any
-- company that's missing LOT/BALE rows too -- that's a separate,
-- already-documented onboarding gap (00_full_deploy_merged.sql's own
-- comment on adding one row per company_id when onboarding a new one).
-- Going forward, onboarding a new company to GRN Checking should seed
-- LOT + BALE + PIECE together.
--
-- Purely additive, no existing rows touched. Safe to run against a live
-- schema.

-- ============================================================
-- STEP 1: VERIFY no PIECE row already exists for menu 981
-- ============================================================
SELECT COUNT(*) AS should_be_zero
FROM barcode_generation_based_menuIds
WHERE bcg_menu_Id = 981 AND barcode_type = 'PIECE';

-- ============================================================
-- STEP 2: seed one PIECE row per company_id that already has a LOT
-- or BALE row for this menu (continues the 981001/981002 numbering)
-- ============================================================
INSERT INTO barcode_generation_based_menuIds (barcode_format, cur_seq, bcg_company_Id, barcode_type, bcg_menu_Id)
SELECT '981003', 0, existing.bcg_company_Id, 'PIECE', 981
FROM (
    SELECT DISTINCT bcg_company_Id FROM barcode_generation_based_menuIds WHERE bcg_menu_Id = 981
) AS existing
WHERE NOT EXISTS (
    SELECT 1 FROM barcode_generation_based_menuIds b2
    WHERE b2.bcg_company_Id = existing.bcg_company_Id AND b2.bcg_menu_Id = 981 AND b2.barcode_type = 'PIECE'
);

-- ============================================================
-- STEP 3: VERIFY -- one row per company that has LOT/BALE, all at seq 0
-- ============================================================
SELECT * FROM barcode_generation_based_menuIds WHERE bcg_menu_Id = 981 ORDER BY barcode_type, bcg_company_Id;
