-- CED-1626: GRN Checking -- foundational schema.
-- Discipline (matches docs/skp1508_fix.sql convention): verify -> apply -> verify.
-- Every statement here is purely additive: one new column (default 0, so
-- every existing company is completely unaffected) and brand-new tables.
-- Nothing existing is altered or dropped. Safe to run against a live schema.

-- ============================================================
-- STEP 1: VERIFY the new flag column does not already exist
-- ============================================================
SELECT COUNT(*) AS should_be_zero
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'new_flag_setup_master'
  AND COLUMN_NAME = 'nfsm_grn_checking';

-- ============================================================
-- STEP 2: New flag column, default 0 (off) for every existing company.
-- Matches the nfsm_ int-flag convention already used by every other
-- flag on this table (see NewFlagSetupMasterDAO.java).
-- ============================================================
ALTER TABLE new_flag_setup_master
  ADD COLUMN nfsm_grn_checking INT NOT NULL DEFAULT 0;

-- ============================================================
-- STEP 3: VERIFY -- every existing row must read 0
-- ============================================================
SELECT COUNT(*) AS total_rows,
       SUM(nfsm_grn_checking) AS should_be_zero
FROM new_flag_setup_master;

-- ============================================================
-- STEP 4: New tables. All additive, no foreign keys onto existing
-- tables enforced at the DB level (this codebase does not use FK
-- constraints elsewhere either -- consistent with existing convention;
-- referential integrity to po_master / po_master_lineitems /
-- po_fabric_receive_items is enforced in application code, same as
-- everywhere else in this schema).
-- ============================================================

CREATE TABLE IF NOT EXISTS grn_checking_header (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_number       INT NOT NULL,
    company_id      INT NOT NULL,
    item_type       VARCHAR(10) NOT NULL,   -- 'FABRIC' | 'RM'
    checking_date   DATE NOT NULL,
    remarks         VARCHAR(1000) NULL,
    grn_no          VARCHAR(50) NULL,       -- filled in on first Approve Checking, reuses grn_uniquecode
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
    status          VARCHAR(15) NOT NULL DEFAULT 'DRAFT',  -- DRAFT | SUBMITTED | APPROVED (header-of-lot convenience rollup; authoritative status lives per-bale)
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
-- caller (which owns the transaction and the S3 URL) using the
-- usage/result metadata the Python extraction service returns -- the
-- Python service itself never writes here. See
-- bhairav-ai-extraction/app/extraction/schemas.py::ExtractionUsage.
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

-- ============================================================
-- STEP 5: VERIFY all six objects exist
-- ============================================================
SELECT TABLE_NAME FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'grn_checking_header', 'grn_checking_fabric_lot', 'grn_checking_fabric_bale',
    'grn_checking_fabric_bale_piece', 'grn_checking_barcode', 'ai_extraction_audit'
  );

-- ============================================================
-- STEP 6: Seed barcode sequence rows for the new menu.
-- Fill in the real GRN Checking menu_id once it's created via the
-- existing Menu Configuration admin screen (see tracker.md item 3),
-- and the real company id(s) -- placeholders below use 0 deliberately
-- so this section is a no-op until someone edits it with real values,
-- rather than silently seeding wrong rows.
-- ============================================================
-- INSERT INTO barcode_generation_based_menuIds (bcg_company_Id, bcg_menu_Id, barcode_type, barcode_format, cur_seq)
-- VALUES
--   (<real_company_id>, <real_grn_checking_menu_id>, 'LOT', '<format_code>', 0),
--   (<real_company_id>, <real_grn_checking_menu_id>, 'BALE', '<format_code>', 0);
