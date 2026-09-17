-- CED-1626: GRN Checking moves from one GRN No per PO/header (set once, on
-- the first-ever bale approval) to one GRN No per APPROVAL BATCH -- a single
-- click of the new page-level "Approve" button, which can span multiple
-- bales across multiple lots/items at once. Mirrors the legacy GRN
-- Approve flow's own per-roll grn_uniqno storage
-- (po_fabric_receive_items.grn_uniqno) -- one GRN No stamped onto every
-- bale row touched by that one approval action.
--
-- grn_checking_header.grn_no / updateHeaderGrnNo are left in place
-- (harmless, unused going forward) -- the header-level single GRN No is
-- fully superseded by this per-bale column. Purely additive, no existing
-- rows touched. Safe to run against a live schema.

-- ============================================================
-- STEP 1: VERIFY the column does not already exist
-- ============================================================
SELECT COUNT(*) AS should_be_zero
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'grn_checking_fabric_bale'
  AND COLUMN_NAME = 'grn_no';

-- ============================================================
-- STEP 2: add the column + index
-- ============================================================
ALTER TABLE grn_checking_fabric_bale
  ADD COLUMN grn_no VARCHAR(50) NULL AFTER status,
  ADD INDEX idx_gcfb_grn_no (grn_no);

-- ============================================================
-- STEP 3: VERIFY -- every existing row reads NULL, column exists
-- ============================================================
SELECT COUNT(*) AS total_rows,
       SUM(grn_no IS NOT NULL) AS should_be_zero
FROM grn_checking_fabric_bale;
