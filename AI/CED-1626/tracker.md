# CED-1626 — Bhairav GRN AI Capture / GRN Checking — Implementation Tracker

**Status:** Analysis complete, design locked, implementation not started.
**Deadline context (from tester meeting, 2026-09-09):** Fabric flow (list + checking page + AI extraction + inventory + barcode generation) is the hard requirement for **15th**. RM flow reuses the same pattern and should follow if time allows. PDF (customer-style view PDF) and the barcode *print format* are best-effort — customer hasn't sent the barcode format yet. Downstream barcode *scanning* in Batch Creation / Fabric Process In / Store Management is explicitly **out of scope until after the 15th**.

Sources analyzed: ticket CED-1626, tester↔dev WhatsApp thread, full meeting transcript (`Wednesday_10h08m_1_transcript.txt`), the 3-tab Google Sheet mockup (List/Fabric/RM CSVs), the reference vendor packing-slip PDF, and live screenshots of every existing page in the current flow (PO create/edit/view, GRN list/view, GRN Approve list/view, Flag Setup Master).

---

## 1. What's actually changing, in plain terms

Today: GRN receive → (if `company.grn_app`=1) GRN Approve, one shot, whole-lot, no partial re-approval, no per-bale granularity, no AI.

New: GRN receive (**unchanged**) → **GRN Checking** (new screen, new flag-gated flow, replaces GRN Approve *only for companies with the new flag on*) → bale-by-bale (fabric) or row-by-row (RM) checking, AI-assisted, partial across sessions, explicit per-item approval → inventory update happens per approved item, not per whole GRN.

**Critical constraint carried through the whole design: existing GRN / GRN Approve code paths must not be touched for companies where the new flag is off.** This is why the new flag is additive (`new_flag_setup_master.nfsm_grn_checking`), not a replacement of `company.grn_app`.

---

## 2. Confirmed page structures (verbatim from the sheet + transcript clarifications)

### 2.1 GRN Checking — List page
| PO No | Vendor | RM/Fabric/Trims | Total Order Qty | Total Checked Qty | GRN No | PO status | User Name | Action |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | Check GRN, PDF, Barcode PDF |

Only PO lines belonging to a company with the new flag ON, and only once a GRN receive has happened, appear here (mirrors how GRN Approve list works today, just a parallel list).

### 2.2 GRN Checking — Fabric page
- Header: Company details (read-only), Vendor, PO No, **Checking Date** (defaults to today, editable), Remarks, GRN No (blank until first approval, then shown).
- Repeated **per Fabric No (Color)** block: UOM, Total Order Qty, Total Received Qty (both read-only, sourced from the existing GRN).
  - Repeated **per Lot** (= existing Roll No) block: **Lot No is a dropdown** populated from the roll numbers already entered against that fabric in this GRN (not free text — confirmed explicitly: *"whatever lot numbers they have in GRN we should show it as a select option"*). Selecting a lot auto-fills Lot Date and Total In Mtrs. One "AI Doc upload" per lot.
    - Repeated **per Bale** block (created by the lot-level AI upload, or added manually): Bale No, Total Pcs, then one row per piece (Pc No, Total In Mtrs, Checked Mtrs, Difference), a per-bale "AI Doc upload", then **Total in Mtrs / Checked Mtrs** sum row, then a manual-entry **Total Damage in Mtrs** field.
- Footer: **Save as Draft**, **Submit**, **Approve Checking**, Back.

### 2.3 GRN Checking — RM page
Flat table, no lot/bale nesting: RM Name (Color), UOM, Order Qty, Received Qty, Checked Qty, Damage Qty, Difference, AI Doc Upload — one row per RM item on the PO. Same header fields and footer buttons as Fabric.

---

## 3. The two AI document types (confirmed same format, used twice)

Both extractions read **the same physical document format** — the vendor's per-bale packing-slip ticket (Date / Quality / Bale No / No. of Pcs / up to 15 numbered piece-meter rows / Total Mtrs), as already reviewed against real Sri Amman Tex samples. The multi-bale sheet (5 tickets per page) is the same format repeated.

1. **Lot-level upload** (one per lot): reads a sheet containing *all* bales for that lot → extracts bale numbers, pcs count per bale, and vendor-declared per-piece meters → **creates the bale rows** (populates `Total In Mtrs`, leaves `Checked Mtrs` empty). This is what turns "7 pcs" into "7 rows" automatically per the ticket.
2. **Bale-level upload** (one per bale, optional, re-triggerable): reads the same-format single-bale ticket → populates **`Checked Mtrs`** for that bale's pieces. `Checked Mtrs` can also be entered manually — both paths are supported and can be mixed bale-by-bale.

**Validation on upload (soft, not hard-blocking):** extract PO number + vendor name from the document and compare against the PO/fabric currently open; on mismatch, show an alert but let the user decide whether to proceed (matches the ticket's own AI-assisted-not-authoritative posture, and the identical soft-alert pattern used for the qty-exceeds-GRN case below).

**Damage is always manual** — one number per bale, never AI-extracted, never calculated. **Difference = Total In Mtrs − Checked Mtrs**, arithmetic only, not reduced by damage.

**Qty-exceeds-GRN validation:** if the sum of checked quantities for a lot exceeds what was actually received in GRN for that roll, show a highlighted alert but still allow saving — the GRN-received figure stays the source of truth for the *original* GRN screen; GRN Checking is allowed to diverge and that divergence is exactly what the tester wants surfaced, not blocked.

---

## 4. State machine (confirmed via clarification — Submit and Approve Checking are separate steps)

Applied at **bale granularity** for Fabric and **row granularity** for RM — not once per whole page — because the whole point of this feature is that checking happens partially, bale by bale, across multiple sessions/days.

```
DRAFT  →  SUBMITTED  →  APPROVED
(Save as Draft)  (Submit)   (Approve Checking)
```

- **Save as Draft**: persists whatever's been entered/extracted for the touched bales/rows. No inventory effect. Freely re-editable.
- **Submit**: marks the currently-ready bales/rows as submitted — a "this one is done, ready for sign-off" state. Still no inventory effect. This is the maker/checker separation point (may be the same user, may be a different approver role later — the mechanism doesn't care).
- **Approve Checking**: the action that actually adds the bale's/row's Checked Mtrs (fabric) or Checked Qty (RM) to inventory, generates the GRN No the first time it's used for a given GRN, and is a **one-way** action per bale/row (matches existing GRN Return being the correction mechanism elsewhere in this system — no in-place reversal here).
- GRN No generation reuses the exact existing prefix/sequence mechanism (`grn_uniquecode`) and fires on first Approve Checking for a GRN, mirroring today's "generated on approve, not on receive" behavior. Confirmed acceptable that this can theoretically collide in sequence with the old GRN-Approve path's numbers if a company somehow used both — non-issue since the flag makes them mutually exclusive per company.

---

## 5. Data model (new tables + one new flag column; nothing existing is altered)

Reusing exact conventions already found in this codebase (raw-SQL/Hibernate mix, `TrimsConstructionPersistanceDaoImpl`-style DAO, existing `po_fabric_receive_items`/`rm_master_lineitems` as the inventory targets).

```
grn_checking_header
  id PK, po_number, company_id, checking_date, remarks, grn_no (nullable until first approve),
  item_type ('FABRIC' | 'RM'), created_by, created_at, updated_at

grn_checking_fabric_lot
  id PK, header_id FK, po_lineitem_id, fabric_id, roll_no (= existing Lot/Roll No, FK-by-value into
  po_fabric_receive_items), lot_date, total_in_mtrs, ai_doc_ref (uploaded file), status

grn_checking_fabric_bale
  id PK, lot_id FK, bale_no, total_pcs, total_in_mtrs, checked_mtrs, damage_mtrs, difference_mtrs,
  ai_doc_ref, status ('DRAFT'|'SUBMITTED'|'APPROVED'), approved_at, approved_by

grn_checking_fabric_bale_piece
  id PK, bale_id FK, pc_no, total_in_mtrs, checked_mtrs   -- one row per numbered piece (1..15)

grn_checking_rm_row
  id PK, header_id FK, po_lineitem_id, rm_id, uom, order_qty, received_qty, checked_qty, damage_qty,
  difference_qty, ai_doc_ref, status ('DRAFT'|'SUBMITTED'|'APPROVED'), approved_at, approved_by

grn_checking_barcode
  id PK, entity_type ('LOT'|'BALE'|'RM'), entity_id, fabric_or_rm_label, barcode_value, generated_at
```

**Inventory write targets on Approve Checking (reuse existing tables, existing logic, per explicit confirmation "role wise inventory logic stays the same"):**
- Fabric bale approved → `fabric_master_lineitems` incremented against that **roll_no**, exactly like today's GRN-approve path (`updateFabricrolls(..., "FABRIC", ...)`), plus `trimconstruction_master.avail_qty`.
- RM row approved → `rm_master_lineitems.RM_qty` incremented against that `po_master_lineitem_id` (`updateFabricrolls(..., "RM", ...)`) — this is a genuinely **new gate** for RM, since today RM has no approve step at all (confirmed: RM currently adds to inventory unconditionally on receive). GRN Checking introduces the first RM approval gate in this system.

**New flag:** `new_flag_setup_master.nfsm_grn_checking` (int, 0/1) — matches the table/column-naming convention this specific Flag Setup Master page is actually built on (confirmed: newer flags live in `new_flag_setup_master`, not the legacy `company` table). Defaults to 0 for every existing company; only turned on for Bhairav. Wired into `FlagMasterDaoImpl.edit()`/`updateflag()` and `FlagMasterController.savef()` alongside the existing flags, plus a `FlagMasterDTO` field.

**Routing logic:** in the fabric/RM receive-save path, after a successful GRN receive, check `nfsm_grn_checking` for the company; if on, the item appears in the new GRN Checking list instead of GRN Approve (GRN Approve's own query naturally returns nothing for these companies since their items never enter that state — no code deleted, no existing behavior touched for flag-off companies).

---

## 6. AI service integration (reuses the Phase 1 licensing-gated scaffold, this is where it gets used for real)

`bhairav-ai-extraction` (built in the licensing phase) gets its first real feature endpoints:
- `POST /extraction/packing-slip` — accepts an image/PDF + `{po_number, vendor_id}` context, returns `{matched: bool, vendor_name, po_number, bales: [{bale_no, total_pcs, pieces: [{pc_no, total_in_mtrs}], total_mtrs}]}`. Used for the **lot-level** upload.
- `POST /extraction/bale-checked` — same document format, scoped to one bale, returns `{pieces: [{pc_no, checked_mtrs}], total_mtrs}`. Used for the **bale-level** upload.
- Both go through the same license-gate middleware already built; both are the same underlying vision-extraction call, just with a different response shape/scope — no new AI capability class, just two thin routes over one capability.
- Auth bridge from the legacy app: reuse the short-lived signed-token design from the Phase 1 plan (not yet built — this ticket is what actually needs it, so it gets built now, not deferred).

---

## 7. Barcode generation (generate only, per the 15th scope — scanning integration is later)

Reuse the existing `CommonsUtil.getBarcodeBasedOnMenuIdAndType` / `barcode_generation_based_menuIds` sequence mechanism already used elsewhere in this codebase, rather than inventing a new one. Fires on Approve Checking:
- **Lot barcode**: Fabric No, Lot No, Total no. of bales, Total Mtr, barcode.
- **Bale barcode**: Fabric No, Bale No, Total Mtr, barcode.
- **RM barcode**: one per approved RM row, "per qty per UOM" per the ticket — simplest reasonable reading is one barcode per approval event carrying qty+UOM, pending the customer's actual format.
- Barcode **print layout** is a placeholder until the customer sends their format (explicitly still pending as of the WhatsApp thread) — build the barcode *value*/record generation now, keep the printable layout swappable.

---

## 8. Assumptions being carried forward (not blocking, but flagged for tester confirmation)

1. PO/vendor mismatch on AI upload → soft alert, not a hard block (§3).
2. New flag name `nfsm_grn_checking` — proposed to match convention; final key name subject to tester/backend sign-off, trivial to rename before ship.
3. RM gets its first-ever approval gate via this feature (previously unconditional) — confirmed correct per the transcript's own description of the RM flow needing "Approve Checking" too, but worth a one-line confirmation since it's a real behavior change for RM specifically (fabric already had a gate; RM didn't).
4. GRN Approve menu item for flag-on companies: left in place at the menu/role level (no code change needed) — it will simply always show empty for those companies once the flag is on, since nothing routes into that state anymore.

---

## 9. Test plan

- **Unit**: state-machine transitions (Draft→Submitted→Approved, one-way, per-bale independence), Difference calculation, qty-exceeds-GRN alert logic, PO/vendor mismatch alert logic — plain JUnit, no Spring context, matching the Phase 1 licensing test style already established in this repo.
- **AI extraction accuracy**: a fixed regression set built from the real Sri Amman Tex sample pages (already reviewed) — lot-level and bale-level, checked against hand-verified expected values.
- **Integration**: legacy JSP + new controller wiring, using the local Eclipse/WTP Tomcat + local MySQL setup already documented in project memory; confirm GRN Approve path is byte-for-byte unaffected when the flag is off (regression guard for the "don't break existing flow" requirement).
- **End-to-end (Playwright, via the Chrome/Claude Code extension where useful for exploratory passes)**: full flow — PO → GRN receive → GRN Checking list → open Fabric page → upload lot doc → verify bale rows populate → upload bale doc → verify Checked Mtrs populate → Save as Draft → Submit → Approve Checking → verify inventory (`fabric_master_lineitems`) incremented → verify barcode record created. Same flow for RM without the lot/bale nesting.
- **Manual test script for the tester**: a plain numbered checklist mirroring the above, since Hemalata is doing hands-on testing per the WhatsApp thread — will be produced as implementation lands, not written speculatively now.

---

## 10. TODO tracker

**Implementation plan for phases 0-1 is in `~/.claude/plans/jaunty-painting-grove.md` (file-level detail, approved).**

### Phase 0 — foundation — DONE (2026-09-09)
- [x] `nfsm_grn_checking` flag fully wired: DB column (`sql/01_grn_checking_schema.sql`), `NewFlagSetupMasterDAO` field, `FlagMasterDaoImpl` (both the positional-index SELECT and the named-parameter UPDATE — appended at the end of each, zero risk to existing flag indices), `FlagMasterDTO`, `FlagMasterController.savef`, and a Yes/No toggle added to `showFlagMaster.jsp` next to "Grn Approve". Compiles clean.
- [x] New DB tables from §5 (+ `ai_extraction_audit`) — `docs/AI/CED-1626/sql/01_grn_checking_schema.sql`. Written, not yet run against any live schema (needs to be applied to the local dev DB before end-to-end testing).
- [x] Legacy↔AI-service auth bridge — built both sides: `app.security.internal_token` (Python, HMAC-SHA256, 5-minute validity, 9 tests) and `com.codeverse.stitch.grncheck.security.InternalAiServiceTokenIssuer` (Java, 5 tests including independent cross-check of the signature bytes, not just self-consistency). Deliberately symmetric/HMAC rather than a second RSA keypair, since both ends are vendor-operated — the license itself stays asymmetric. Wired into both of `bhairav-ai-extraction`'s extraction routes as a second, independent gate alongside the license check.
- [ ] New `menu_master_tbl` row + `role_menu_map` entries for "GRN Checking" — still to be done via the existing Menu Configuration admin screen once the app is running (routes work via direct URL without it; needed for real sidebar navigation + privilege-string enforcement).

### Phase 1 — Fabric flow (the 15th deliverable) — core built, not yet live-tested
- [x] **`bhairav-ai-extraction`: `/extraction/packing-slip` and `/extraction/bale-checked` — built and tested (45/45 Python tests).** Real vision-model client (`AnthropicVisionExtractionClient`, needs `ANTHROPIC_API_KEY` — not exercised live in this sandbox) behind a `VisionExtractionClient` abstraction, `FakeVisionExtractionClient` used throughout tests. The ticket's own Sri Amman Tex sample is the checked-in, versioned reference template (`app/extraction/reference_templates/packing_slip_v1/`), included as a fixed few-shot example in every call. Soft mismatch alerting, never hard-blocking. Gated by both the license check and the internal-caller token.
- [x] **Java controller (`GrnCheckingController`) + DAO (`GrnCheckingPersistanceDao`) + service (`GrnCheckingPersistanceService`) — built, compiles, packages into the WAR.** New self-contained package (`com.codeverse.stitch.{controllers,persistance.dao,persistance.daoImpl,persistance.service,persistance.serviceimpl}.grncheck`), not another addition to `TrimsConstructionController`. Raw-SQL DAO, named parameters throughout (no string-concatenated values, unlike some existing legacy queries). S3 upload reuses the exact existing `CommonsUtil.uploadFile`/`getS3BuucketFileUrl` pattern from `GrnControllerApi.uploadPoFile` (composite bucket-path convention, `erp-company-wise-images/<company>/grncheck/lot|bale`).
- [x] Two JSPs (`grnCheckingList.jsp`, `grnCheckingFabric.jsp`) — DataTables-based list (modeled on `poreceivesearch.jsp`, using this app's actual `start`/`length`/`draw` DataTables 1.10+ convention, not the legacy `iDisplayStart` names), and a data-driven Fabric/Lot/Bale/Piece page with AI-doc-upload (real multipart AJAX, not the dormant/broken `SaveGrnPdf` pattern), per-piece Checked-Mtrs editing, mismatch alerting, and Save Draft/Submit/Approve actions per bale.
- [x] Save as Draft / Submit / Approve Checking — bale-granular, one-way `DRAFT → SUBMITTED → APPROVED` state machine, matching the clarified semantics (Submit = ready-for-review, not yet in inventory; Approve Checking = separate final action that commits to inventory).
- [x] Approve Checking → inventory update, reusing the existing private `updateFabricrolls(...)` via a new, minimal public wrapper (`updateFabricRollInventoryForGrnChecking`, added to both the DAO and Service interfaces/impls) rather than duplicating that logic. GRN No generated via the existing `generateGRNCode("GRN")` (now exposed on the same interfaces) on first approval per header.
- [x] `ai_extraction_audit` persistence — Java writes one row per extraction call (raw model output + full usage/cost metadata from the AI service's response) and fills in `final_confirmed_json` at Save Draft / Submit / Approve time, so the raw-vs-final diff and per-call cost are both queryable later without more instrumentation.
- [x] Barcode generation on approve — reuses the existing `commonUtil.getBarcodeBasedOnMenuIdAndType`/`updateBarcodeBasedOnMenuIdAndType` sequence mechanism. **Currently gated behind a placeholder menu id (`GRN_CHECKING_MENU_ID_PLACEHOLDER = 0`)** — must be replaced with the real id once the menu is created (see Phase 0's remaining item), and `barcode_generation_based_menuIds` seeded for it (placeholder `INSERT` already sketched in the migration script, step 6).
- [ ] Regression check against a running instance — not yet performed (no live app/DB run in this pass; see "Known gaps" below).

### Real-data verification — DONE (2026-09-09)

Imported the real 2026-09-08 production backup (`bhairav_db`, ~1.6GB uncompressed: 11,357 POs, 24,551 PO line items, 962 fabric receive items, 827 vendors) into local MySQL. Confirmed:
- **Every join/filter column my new queries use against the big legacy tables is already indexed** (`po_master_lineitems.po_number`, `po_fabric_receive_items` composite PK on `lineitemid`, `vendor.id`, `fabric_master.fabric_id`, `po_master.po_number`/`vendorid`) — `EXPLAIN` confirms index-based lookups (`ref`/`eq_ref`), not full scans, on all three new lookup queries. No missing-index performance risk found at real production scale.
- **Ran the migration script against this real schema** — clean, all 6 tables + the flag column created, flag correctly defaulted to 0 for the existing company.
- **`GrnCheckingRealDataIT`** (new, `src/test/java/.../grncheck/GrnCheckingRealDataIT.java`, excluded from default `mvn test` like the licensing `*IT` tests): exercises the full DAO layer — header get-or-create (idempotency asserted), fabric line item lookup, roll lookup, lot get-or-create, bale+piece insert, Draft→Submitted→Approved (one-way enforcement asserted), barcode insert, audit insert+finalize, and the list page query with the real vendor join — against real PO 10828 (SRI BALAJI TEXTILE, the exact PO from the tester's own reference screenshots). **All assertions pass**, including that the fabric line item data matches the tester's screenshot exactly (roll 190B112, 100059.50 received qty) and that the approved bale's arithmetic is correct (100 − 97 = 3 difference). Verified the written rows directly in MySQL afterward — everything landed correctly across all 6 new tables. Bypasses the web/session/login layer entirely (built a minimal Hibernate `SessionFactory` directly), so this proves the SQL/business-logic layer specifically, not the JSP/HTTP layer.
- `application.properties`' `jdbc.url` now points at this imported `bhairav_db` locally (existing local-only convention, not shipped).

### Known gaps / open items before this can be called done
1. **`buyerPoId`/`styleId`/`loc`/`batchId` default to 0 at approve time** (`GrnCheckingPersistanceServiceImpl.approveBale`, clearly commented). The legacy path derives these from the original GRN-entry form submission (`itemArr[...]` positional fields), which GRN Checking has no equivalent of since it approves a roll well after that submission. 0 is this codebase's existing "unset" sentinel elsewhere, not a wrong guess, but **needs explicit tester/backend confirmation before go-live** — this is the single most important open question, since it affects real inventory attribution. *(User is confirming with the tester.)*
2. Menu Configuration entry not yet created (needs a running app + admin click-through — the routes work via direct URL without it, verified above via IT bypassing the web layer, but real navigation/privilege-string enforcement needs it).
3. **The JSP/HTTP/browser layer itself has not been click-tested** (only the DAO layer, via the bypass above) — booting the actual web app locally requires either the Eclipse WTP GUI or a real login session, neither exercised in this pass. This is the next real gap: proving the JS (lot/bale rendering, AJAX upload wiring, mismatch alert) actually works in a browser, not just that the server-side data layer is correct.
4. No live extraction test has been run (no `ANTHROPIC_API_KEY` in this sandbox) — the pipeline is proven correct against a fake model client; real-document accuracy is still unverified.
5. RM flow, PDF, real barcode print layout, and downstream barcode-scanning integration remain Phase 2/3 as originally scoped — untouched in this pass.

### Phase 2 — RM flow (if time allows before 15th, else immediately after)
- [ ] GRN Checking RM page (flat table, reusing header/footer components from Fabric).
- [ ] New RM approval gate → `rm_master_lineitems` update (first-ever approval step for RM).
- [ ] RM barcode generation.

### Phase 3 — best-effort / explicitly deferred
- [ ] Customer-style view PDF for GRN Checking (best-effort, confirm scope once barcode format also lands).
- [ ] Barcode print layout, once customer sends their actual format.
- [ ] Downstream barcode **scanning** integration: Batch Creation, Fabric Process In (fabric/lot/bale), Store Management (RM) — explicitly after the 15th.
- [ ] Reports impact (Inventory Consumption Report row shifting from GRN Approve to GRN Checking) — explicitly deferred by the tester.
