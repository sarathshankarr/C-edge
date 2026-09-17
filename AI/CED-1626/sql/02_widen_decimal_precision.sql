-- CED-1626: widen GRN Checking mtrs/qty columns from 2 to 4 decimal places.
-- Requested so operators can enter/save/update fractional meters precisely
-- (e.g. 12.3456) instead of being rounded to 2 decimals.
-- Purely additive precision widening (DECIMAL(12,2) -> DECIMAL(14,4) etc.):
-- every existing value still fits (2 extra fraction digits, 2 extra whole
-- digits headroom), no data loss, no rows touched. Safe to run against a
-- live schema.

-- ============================================================
-- STEP 1: VERIFY current precision (expect 2 everywhere below)
-- ============================================================
SELECT TABLE_NAME, COLUMN_NAME, NUMERIC_SCALE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('grn_checking_fabric_lot', 'grn_checking_fabric_bale', 'grn_checking_fabric_bale_piece')
  AND COLUMN_NAME IN ('total_in_mtrs', 'checked_mtrs', 'damage_mtrs', 'difference_mtrs');

-- ============================================================
-- STEP 2: widen
-- ============================================================
ALTER TABLE grn_checking_fabric_lot
  MODIFY COLUMN total_in_mtrs DECIMAL(14,4) NULL;

ALTER TABLE grn_checking_fabric_bale
  MODIFY COLUMN total_in_mtrs   DECIMAL(14,4) NULL,
  MODIFY COLUMN checked_mtrs    DECIMAL(14,4) NULL,
  MODIFY COLUMN damage_mtrs     DECIMAL(14,4) NULL,
  MODIFY COLUMN difference_mtrs DECIMAL(14,4) NULL;

ALTER TABLE grn_checking_fabric_bale_piece
  MODIFY COLUMN total_in_mtrs DECIMAL(14,4) NULL,
  MODIFY COLUMN checked_mtrs  DECIMAL(14,4) NULL;

-- ============================================================
-- STEP 3: VERIFY (expect 4 everywhere above)
-- ============================================================
SELECT TABLE_NAME, COLUMN_NAME, NUMERIC_PRECISION, NUMERIC_SCALE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('grn_checking_fabric_lot', 'grn_checking_fabric_bale', 'grn_checking_fabric_bale_piece')
  AND COLUMN_NAME IN ('total_in_mtrs', 'checked_mtrs', 'damage_mtrs', 'difference_mtrs');
