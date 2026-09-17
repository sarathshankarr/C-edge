-- CED-1626: create the real "GRN Checking" menu entry, admin-role
-- privileges, and barcode sequence rows -- the three things
-- GrnCheckingController/GrnCheckingPersistanceServiceImpl were, until now,
-- deliberately borrowing menuId=5 (legacy "Goods Receipt Note(GRN)") or a
-- 0 placeholder for. Schema confirmed by reading the real, live tables
-- (menu_master_tbl, role_menu_map, barcode_generation_based_menuIds) and
-- the existing GRN Approve (menu_id 412) / Fabric receive (menu_id 5)
-- rows as working examples -- see tracker.md item 3 for why this was
-- deferred rather than guessed at up front.
--
-- IMPORTANT: menu_id 981 and privileges/barcode format numbers below are
-- for THIS local/dev database only (max menu_id here was 980). Re-check
-- MAX(menu_id) and existing barcode_format values before running this
-- against any other database (staging/prod) and adjust to avoid collisions.
--
-- IMPORTANT: menu_master_tbl / role_menu_map are cached into the HTTP
-- session at login (LoginManagementController) -- an already-logged-in
-- session will not see the new sidebar link or privileges until the user
-- logs out and back in.

-- ============================================================
-- STEP 1: VERIFY menu_id 981 doesn't already exist
-- ============================================================
SELECT COUNT(*) AS should_be_zero FROM menu_master_tbl WHERE menu_id = 981;

-- ============================================================
-- STEP 2: menu entry, under "Order Management" (parent_menuid=28),
-- ordered right alongside "GRN Approve" (order 5).
-- ============================================================
INSERT INTO menu_master_tbl (menu_id, menu_name, menu_desc, parent_menuid, menu_order, menu_url, active)
VALUES (981, 'GRN Checking', 'AI-assisted bale-by-bale GRN checking (CED-1626)', 28, 5, '../grncheck/list?menuId=981', 'Y');

-- ============================================================
-- STEP 3: admin-role (role_id=1) full privileges -- matches the
-- ADD,EDIT,VIEW,DELETE convention already used for menu_id 412.
-- Other roles get access the same way every other menu does: through
-- the existing Role/Menu configuration screens, when this is actually
-- rolled out to specific users.
-- ============================================================
INSERT INTO role_menu_map (role_id, menu_id, privileges, `desc`)
VALUES (1, 981, 'ADD,EDIT,VIEW,DELETE', 'admin role mapp');

-- ============================================================
-- STEP 4: barcode sequence rows for LOT and BALE, company_id=1 (the
-- only company in this database). Format numbers namespaced off the
-- new menu_id itself to guarantee no collision with existing ones
-- (315456 Fabric, 12345 RM, 215460 GATEPASS).
-- ============================================================
INSERT INTO barcode_generation_based_menuIds (barcode_format, cur_seq, bcg_company_Id, barcode_type, bcg_menu_Id)
VALUES
  ('981001', 0, 1, 'LOT', 981),
  ('981002', 0, 1, 'BALE', 981);

-- ============================================================
-- STEP 5: language translation rows -- loadAllMenusList()/loadAllmodule()
-- (LoginPersistanceDaoImpl) INNER JOIN menu_master_tbl against the
-- per-language table (English_language / Arabic_language /
-- French_language, keyed by language_tbl.language_tbl_name) ON
-- EL_MENUID = menu_id. Without a matching row here, the menu is silently
-- excluded from the sidebar -- an inner join, not a left join -- even
-- though menu_master_tbl and role_menu_map are both correct. This is
-- exactly what caused the new menu to not appear on first deploy.
-- ============================================================
INSERT INTO English_language (EL_MENUID, EL_MENU_NAME, EL_MENU_DESC) VALUES (981, 'GRN Checking', 'GRN Checking');
INSERT INTO Arabic_language (EL_MENUID, EL_MENU_NAME, EL_MENU_DESC) VALUES (981, 'GRN Checking', 'GRN Checking');
INSERT INTO French_language (EL_MENUID, EL_MENU_NAME, EL_MENU_DESC) VALUES (981, 'GRN Checking', 'GRN Checking');

-- ============================================================
-- STEP 6: VERIFY
-- ============================================================
SELECT * FROM menu_master_tbl WHERE menu_id = 981;
SELECT * FROM role_menu_map WHERE menu_id = 981;
SELECT * FROM barcode_generation_based_menuIds WHERE bcg_menu_Id = 981;
SELECT * FROM English_language WHERE EL_MENUID = 981;
SELECT * FROM Arabic_language WHERE EL_MENUID = 981;
SELECT * FROM French_language WHERE EL_MENUID = 981;
