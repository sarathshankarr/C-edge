-- CED-1626: RM "Already Checked Qty" accumulation.
-- Each Approve Checking round no longer locks an RM item forever -- it
-- folds this round's Checked Qty into a running already_checked_qty total,
-- then clears checked_qty/damage_qty/status back to DRAFT so the same PO
-- line item can be checked again in a later round (partial receiving over
-- multiple GRNs). See GrnCheckingPersistanceServiceImpl#approveRmBatchForHeader.
ALTER TABLE grn_checking_rm_item
  ADD COLUMN already_checked_qty DECIMAL(14,4) NOT NULL DEFAULT 0 AFTER checked_qty;
