-- CED-1626: GRN Checking RM -- flat, one row per PO line item (no lot/bale
-- nesting, matching the legacy plain-"RM" GRN Approve flow's own flat
-- structure, confirmed via live tracing of TrimsConstructionPersistanceDaoImpl
-- .updatePOReceive()'s final generic else-branch). Mirrors the shape/columns
-- of grn_checking_fabric_bale as closely as makes sense for an item with no
-- pieces/total-mtrs concept, just Checked Qty / Damage Qty.
CREATE TABLE IF NOT EXISTS grn_checking_rm_item (
  id BIGINT NOT NULL AUTO_INCREMENT,
  header_id BIGINT NOT NULL,
  po_lineitem_id INT NOT NULL,
  checked_qty DECIMAL(14,4) DEFAULT NULL,
  damage_qty DECIMAL(14,4) DEFAULT NULL,
  difference_qty DECIMAL(14,4) DEFAULT NULL,
  status VARCHAR(15) NOT NULL DEFAULT 'DRAFT',
  grn_no VARCHAR(50) DEFAULT NULL,
  approved_at DATETIME DEFAULT NULL,
  approved_by INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_gcri_header_lineitem (header_id, po_lineitem_id),
  KEY idx_gcri_header (header_id),
  KEY idx_gcri_grn_no (grn_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
