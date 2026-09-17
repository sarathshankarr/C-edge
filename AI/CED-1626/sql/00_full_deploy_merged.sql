-- CED-1626: GRN Checking -- FULL MERGED DEPLOY SCRIPT.
-- Combines, in the exact order they were authored/applied against the
-- local dev DB, the six standalone scripts in this same folder:
--   01_grn_checking_schema.sql
--   02_widen_decimal_precision.sql
--   03_grn_checking_menu.sql
--   04_ai_extraction_audit_error_message.sql
--   05_grn_checking_batch_grn_no.sql
--   06_grn_checking_piece_barcode.sql
-- Those six files are left in place, unchanged -- this is a convenience
-- merge for a single-pass deploy to a fresh target database (e.g. the
-- test server), not a replacement for them as the source of truth.
--
-- Every statement below is purely additive (new columns with safe
-- defaults, new tables, new rows scoped to brand-new IDs) -- nothing
-- existing is altered or dropped, and no existing row's data changes.
-- Confirmed safe to run against a live schema that already has real data.
--
-- Discipline: verify -> apply -> verify, at every step, same convention
-- as docs/skp1508_fix.sql. Run interactively (not via a headless script)
-- and eyeball each verify SELECT's output before continuing to the next
-- step -- do not blindly pipe this whole file through the client.
--
-- ============================================================
-- READ BEFORE RUNNING ON THE TEST SERVER -- THREE VALUES ARE
-- HARD-CODED FOR THE LOCAL DEV DATABASE AND MUST BE RE-CHECKED:
-- ============================================================
-- 1) menu_id = 981 (Section 3 below). Local dev DB's own MAX(menu_id)
--    was 980 right before this was first created, so 981 was free.
--    Run `SELECT MAX(menu_id) FROM menu_master_tbl;` on the TEST SERVER
--    database first -- if 981 is already taken there, every "981" literal
--    in Section 3 (menu_master_tbl, role_menu_map, barcode_generation_
--    based_menuIds, English/Arabic/French_language) must be changed
--    together to whatever free id you pick instead.
-- 2) role_id = 1 (Section 3, role_menu_map insert). Confirmed to be
--    'ADMIN' on the local dev DB (`SELECT role_id, role_name FROM
--    role_master WHERE role_id=1;`) -- re-check this matches the admin
--    role on the test server before running; if the test server's admin
--    role has a different id, use that id instead.
-- 3) bcg_company_Id = 1 (Section 3, barcode sequence rows). Local dev DB
--    has exactly one company (id 1). If the test server has more than
--    one company that needs GRN Checking, add one more INSERT row PER
--    COMPANY for LOT + BALE + PIECE together (Section 3 and Section 6) --
--    not just LOT/BALE as this note used to say.
--
-- Everything else below (Sections 1, 2, 4, 5, 6) has no environment-specific
-- literals and is safe to run as-is on any target.

-- ============================================================
-- SECTION 1 (was 01_grn_checking_schema.sql)
-- New flag column + six brand-new tables. No FK constraints (matches
-- this schema's existing convention -- referential integrity to
-- po_master / po_master_lineitems / po_fabric_receive_items is enforced
-- in application code only, same as everywhere else here).
-- ============================================================

-- STEP 1.1: VERIFY the new flag column does not already exist
SELECT COUNT(*) AS should_be_zero
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'new_flag_setup_master'
  AND COLUMN_NAME = 'nfsm_grn_checking';

-- STEP 1.2: new flag column, default 0 (off) for every existing company
ALTER TABLE new_flag_setup_master
  ADD COLUMN nfsm_grn_checking INT NOT NULL DEFAULT 0;

-- STEP 1.3: VERIFY -- every existing row must read 0
SELECT COUNT(*) AS total_rows,
       SUM(nfsm_grn_checking) AS should_be_zero
FROM new_flag_setup_master;

-- STEP 1.4: new tables
CREATE TABLE IF NOT EXISTS grn_checking_header (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_number       INT NOT NULL,
    company_id      INT NOT NULL,
    item_type       VARCHAR(10) NOT NULL,   -- 'FABRIC' | 'RM'
    checking_date   DATE NOT NULL,
    remarks         VARCHAR(1000) NULL,
    grn_no          VARCHAR(50) NULL,       -- superseded by per-bale grn_no (Section 5); left in place, unused
    created_by      INT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gch_po (po_number, item_type)
);

CREATE TABLE IF NOT EXISTS grn_checking_fabric_lot (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    header_id       BIGINT NOT NULL,
    po_lineitem_id  INT NOT NULL,
    fabric_id       INT NOT NULL,
    roll_no         VARCHAR(25) NOT NULL,   -- = existing Roll No / Lot, matches po_fabric_receive_items.roll_no
    lot_date        DATE NULL,
    total_in_mtrs   DECIMAL(14,4) NULL,
    ai_doc_s3_url   VARCHAR(500) NULL,
    status          VARCHAR(15) NOT NULL DEFAULT 'DRAFT',  -- DRAFT | SUBMITTED | APPROVED (convenience rollup; authoritative status lives per-bale)
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gcfl_header (header_id),
    INDEX idx_gcfl_roll (po_lineitem_id, roll_no)
);

CREATE TABLE IF NOT EXISTS grn_checking_fabric_bale (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    lot_id          BIGINT NOT NULL,
    bale_no         VARCHAR(50) NOT NULL,
    total_pcs       INT NOT NULL,
    total_in_mtrs   DECIMAL(14,4) NULL,
    checked_mtrs    DECIMAL(14,4) NULL,
    damage_mtrs     DECIMAL(14,4) NULL,      -- manual entry only, never AI-extracted or calculated
    difference_mtrs DECIMAL(14,4) NULL,      -- = total_in_mtrs - checked_mtrs, arithmetic only
    ai_doc_s3_url   VARCHAR(500) NULL,
    status          VARCHAR(15) NOT NULL DEFAULT 'DRAFT',  -- DRAFT | SUBMITTED | APPROVED, one-way
    approved_at     DATETIME NULL,
    approved_by     INT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gcfb_lot (lot_id),
    INDEX idx_gcfb_bale (bale_no)
);

CREATE TABLE IF NOT EXISTS grn_checking_fabric_bale_piece (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    bale_id         BIGINT NOT NULL,
    pc_no           INT NOT NULL,
    total_in_mtrs   DECIMAL(14,4) NULL,   -- vendor-declared (lot-level upload)
    checked_mtrs    DECIMAL(14,4) NULL,   -- Bhairav-checked (bale-level upload or manual)
    UNIQUE KEY uq_gcfbp_bale_pc (bale_id, pc_no)
);

CREATE TABLE IF NOT EXISTS grn_checking_barcode (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type         VARCHAR(10) NOT NULL,  -- 'LOT' | 'BALE' | 'RM'
    entity_id           BIGINT NOT NULL,
    fabric_or_rm_label  VARCHAR(255) NULL,
    barcode_value       VARCHAR(50) NOT NULL,
    generated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gcb_entity (entity_type, entity_id)
);

-- Every AI extraction call, at lot or bale level. Written by the Java
-- caller (owns the transaction + S3 URL) using the usage/result metadata
-- the Python extraction service returns -- Python never writes here.
CREATE TABLE IF NOT EXISTS ai_extraction_audit (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    grn_checking_context_type  VARCHAR(10) NOT NULL,  -- 'LOT' | 'BALE'
    context_id                 BIGINT NOT NULL,       -- grn_checking_fabric_lot.id or _bale.id
    s3_document_url            VARCHAR(500) NOT NULL,
    reference_template_version VARCHAR(50) NOT NULL,
    raw_extracted_json         JSON NOT NULL,
    final_confirmed_json       JSON NULL,              -- filled in at Save/Submit/Approve time
    model_used                 VARCHAR(100) NOT NULL,
    tokens_in                  INT NOT NULL,
    tokens_out                 INT NOT NULL,
    estimated_cost_usd         DECIMAL(10,6) NOT NULL,
    latency_ms                 INT NOT NULL,
    extraction_status          VARCHAR(10) NOT NULL,   -- 'OK' | 'MISMATCH' | 'ERROR'
    created_by                 INT NULL,
    created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aea_context (grn_checking_context_type, context_id),
    INDEX idx_aea_created (created_at)
);

-- STEP 1.5: VERIFY all six objects exist
SELECT TABLE_NAME FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'grn_checking_header', 'grn_checking_fabric_lot', 'grn_checking_fabric_bale',
    'grn_checking_fabric_bale_piece', 'grn_checking_barcode', 'ai_extraction_audit'
  );

-- ============================================================
-- SECTION 2 (was 02_widen_decimal_precision.sql)
-- Widens mtrs/qty columns to DECIMAL(14,4). The CREATE TABLEs in Section 1
-- above already use DECIMAL(14,4) directly, so on a FRESH database this
-- section is a harmless no-op (widening 14,4 to 14,4) -- kept here only
-- so this merged script exactly matches the sequence actually run
-- against the dev DB (which started at DECIMAL(12,2) before this ran).
-- ============================================================

-- STEP 2.1: VERIFY current precision
SELECT TABLE_NAME, COLUMN_NAME, NUMERIC_PRECISION, NUMERIC_SCALE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('grn_checking_fabric_lot', 'grn_checking_fabric_bale', 'grn_checking_fabric_bale_piece')
  AND COLUMN_NAME IN ('total_in_mtrs', 'checked_mtrs', 'damage_mtrs', 'difference_mtrs');

-- STEP 2.2: widen
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

-- STEP 2.3: VERIFY (expect 4 everywhere above)
SELECT TABLE_NAME, COLUMN_NAME, NUMERIC_PRECISION, NUMERIC_SCALE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('grn_checking_fabric_lot', 'grn_checking_fabric_bale', 'grn_checking_fabric_bale_piece')
  AND COLUMN_NAME IN ('total_in_mtrs', 'checked_mtrs', 'damage_mtrs', 'difference_mtrs');

-- ============================================================
-- SECTION 3 (was 03_grn_checking_menu.sql)
-- Menu entry, admin privileges, barcode sequence rows, language rows.
-- *** menu_id 981 / role_id 1 / bcg_company_Id 1 -- SEE THE WARNING AT
-- THE TOP OF THIS FILE BEFORE RUNNING ON THE TEST SERVER. ***
-- menu_master_tbl / role_menu_map are cached into the HTTP session at
-- login -- an already-logged-in session on the test server will not see
-- the new sidebar link or privileges until that user logs out and back in.
-- ============================================================

-- STEP 3.1: VERIFY menu_id 981 doesn't already exist on the TARGET database
SELECT COUNT(*) AS should_be_zero FROM menu_master_tbl WHERE menu_id = 981;
SELECT MAX(menu_id) AS current_max_menu_id FROM menu_master_tbl;

-- STEP 3.2: menu entry, under "Order Management" (parent_menuid=28),
-- ordered right alongside "GRN Approve" (order 5)
INSERT INTO menu_master_tbl (menu_id, menu_name, menu_desc, parent_menuid, menu_order, menu_url, active)
VALUES (981, 'GRN Checking', 'AI-assisted bale-by-bale GRN checking (CED-1626)', 28, 5, '../grncheck/list?menuId=981', 'Y');

-- STEP 3.3: admin-role (role_id=1) full privileges
INSERT INTO role_menu_map (role_id, menu_id, privileges, `desc`)
VALUES (1, 981, 'ADD,EDIT,VIEW,DELETE', 'admin role mapp');

-- STEP 3.4: barcode sequence rows for LOT and BALE, company_id=1
INSERT INTO barcode_generation_based_menuIds (barcode_format, cur_seq, bcg_company_Id, barcode_type, bcg_menu_Id)
VALUES
  ('981001', 0, 1, 'LOT', 981),
  ('981002', 0, 1, 'BALE', 981);

-- STEP 3.5: language translation rows -- loadAllMenusList()/loadAllmodule()
-- INNER JOIN menu_master_tbl against the per-language table ON
-- EL_MENUID = menu_id. Without these rows the menu is silently excluded
-- from the sidebar even though menu_master_tbl/role_menu_map are correct.
INSERT INTO English_language (EL_MENUID, EL_MENU_NAME, EL_MENU_DESC) VALUES (981, 'GRN Checking', 'GRN Checking');
INSERT INTO Arabic_language (EL_MENUID, EL_MENU_NAME, EL_MENU_DESC) VALUES (981, 'GRN Checking', 'GRN Checking');
INSERT INTO French_language (EL_MENUID, EL_MENU_NAME, EL_MENU_DESC) VALUES (981, 'GRN Checking', 'GRN Checking');

-- STEP 3.6: VERIFY
SELECT * FROM menu_master_tbl WHERE menu_id = 981;
SELECT * FROM role_menu_map WHERE menu_id = 981;
SELECT * FROM barcode_generation_based_menuIds WHERE bcg_menu_Id = 981;
SELECT * FROM English_language WHERE EL_MENUID = 981;
SELECT * FROM Arabic_language WHERE EL_MENUID = 981;
SELECT * FROM French_language WHERE EL_MENUID = 981;

-- ============================================================
-- SECTION 4 (was 04_ai_extraction_audit_error_message.sql)
-- Closes a gap: a page-fetch/normalize failure used to write no audit
-- row at all. Purely additive (one nullable column).
-- ============================================================

-- STEP 4.1: VERIFY the column does not already exist
SELECT COUNT(*) AS should_be_zero
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'ai_extraction_audit'
  AND COLUMN_NAME = 'error_message';

-- STEP 4.2: add the column
ALTER TABLE ai_extraction_audit
  ADD COLUMN error_message VARCHAR(1000) NULL AFTER extraction_status;

-- STEP 4.3: VERIFY -- every existing row reads NULL, column exists
SELECT COUNT(*) AS total_rows,
       SUM(error_message IS NOT NULL) AS should_be_zero
FROM ai_extraction_audit;

-- ============================================================
-- SECTION 5 (was 05_grn_checking_batch_grn_no.sql)
-- Moves from one GRN No per PO/header to one GRN No per approval batch,
-- mirroring legacy GRN Approve's per-roll grn_uniqno storage.
-- grn_checking_header.grn_no (Section 1) is left in place, unused --
-- fully superseded by this per-bale column.
-- ============================================================

-- STEP 5.1: VERIFY the column does not already exist
SELECT COUNT(*) AS should_be_zero
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'grn_checking_fabric_bale'
  AND COLUMN_NAME = 'grn_no';

-- STEP 5.2: add the column + index
ALTER TABLE grn_checking_fabric_bale
  ADD COLUMN grn_no VARCHAR(50) NULL AFTER status,
  ADD INDEX idx_gcfb_grn_no (grn_no);

-- STEP 5.3: VERIFY -- every existing row reads NULL, column exists
SELECT COUNT(*) AS total_rows,
       SUM(grn_no IS NOT NULL) AS should_be_zero
FROM grn_checking_fabric_bale;

-- ============================================================
-- SECTION 6 (was 06_grn_checking_piece_barcode.sql)
-- Adds per-PIECE barcode support alongside the existing LOT/BALE
-- generation. No schema change -- entity_type is already VARCHAR(10);
-- only a new sequence-counter seed row, continuing the exact 981001/
-- 981002 numbering. Seeded only for company_id(s) that already have a
-- LOT or BALE row for menu 981 -- see the HARD-CODED VALUES note above.
-- ============================================================

-- STEP 6.1: VERIFY no PIECE row already exists for menu 981
SELECT COUNT(*) AS should_be_zero
FROM barcode_generation_based_menuIds
WHERE bcg_menu_Id = 981 AND barcode_type = 'PIECE';

-- STEP 6.2: seed one PIECE row per company_id that already has LOT/BALE
INSERT INTO barcode_generation_based_menuIds (barcode_format, cur_seq, bcg_company_Id, barcode_type, bcg_menu_Id)
SELECT '981003', 0, existing.bcg_company_Id, 'PIECE', 981
FROM (
    SELECT DISTINCT bcg_company_Id FROM barcode_generation_based_menuIds WHERE bcg_menu_Id = 981
) AS existing
WHERE NOT EXISTS (
    SELECT 1 FROM barcode_generation_based_menuIds b2
    WHERE b2.bcg_company_Id = existing.bcg_company_Id AND b2.bcg_menu_Id = 981 AND b2.barcode_type = 'PIECE'
);

-- STEP 6.3: VERIFY -- one row per company that has LOT/BALE, all at seq 0
SELECT * FROM barcode_generation_based_menuIds WHERE bcg_menu_Id = 981 ORDER BY barcode_type, bcg_company_Id;

-- ============================================================
-- FINAL VERIFY -- everything CED-1626 needs, all in one place
-- ============================================================
SELECT TABLE_NAME FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'grn_checking_header', 'grn_checking_fabric_lot', 'grn_checking_fabric_bale',
    'grn_checking_fabric_bale_piece', 'grn_checking_barcode', 'ai_extraction_audit'
  );
SELECT COUNT(*) AS grn_checking_menu_present FROM menu_master_tbl WHERE menu_id = 981;
SELECT COUNT(*) AS grn_no_column_present FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'grn_checking_fabric_bale' AND COLUMN_NAME = 'grn_no';
SELECT COUNT(*) AS error_message_column_present FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ai_extraction_audit' AND COLUMN_NAME = 'error_message';
