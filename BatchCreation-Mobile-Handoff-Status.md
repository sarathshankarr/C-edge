# Batch Creation Mobile Module — Handoff Status

**Repo:** `C-edge` (React Native mobile app), `origin` = `https://github.com/sarathshankarr/C-edge`
**Branch:** `main`
**As of commit:** `a98c505` ("Batch creation md file"), preceded by `a6b313f` ("Batch Creation draft code")
**Companion doc:** `BatchCreation-Mobile-Integration-Report.md` in this same repo root — that file documents the **backend** API contract (field names, payloads, business rules, gotchas) this mobile module was built against. Read it first; this file only covers mobile-side status.

---

## 1. Context — what this module is

The backend team built 12 new stateless JSON REST endpoints under `POST {baseUrl}/batchCreation/...` on a **separate** repo (`bitbucket.org/estitch/e-fabric.git`, branch `141024backup`, Spring MVC app `e-fabric`/`stitch`) to let a mobile client do everything the existing web "Order Management → Batch Creation" pages do (List/Search, Create, Edit, Delete, View, PDF). That backend work is documented in `BatchCreation-Mobile-Integration-Report.md`.

**Critical caveat carried over from that report, still true:** as of this report, the backend branch is not confirmed merged/deployed to any environment. Endpoints may 404 or return unverified field shapes until the backend team deploys. Nothing in this mobile module has been tested against a live server with real batch data beyond the one manual search test noted in §5 below.

This document describes the **mobile app UI** built in this repo to consume those endpoints, following the existing "Stock Issue Return" module (`src/components/storeComponents/StockIssueReturn/`) as the reference pattern for architecture and styling conventions.

---

## 2. What's done

### 2.1 API layer
`src/utils/apiCalls/apiCallsComponent.js` — appended at the end of the file (search for `postBatchCreation` or `// Batch Creation (Order Management)`):
- `postBatchCreation(endpoint, jsonValue)` — generic POST helper, mirrors the existing `postStockIssueReturn` pattern exactly (internet check, JSON parse with raw-text fallback logging, unwraps `data.data` when present else returns the flat parsed body).
- Exported wrappers, one per endpoint: `batchCreationListApi`, `batchCreationLocationsApi`, `batchCreationFabricProcessFlowApi`, `batchCreationFabricsByLocationApi`, `batchCreationLotNosApi`, `batchCreationCheckBatchNoApi`, `createBatchCreationApi`, `editBatchCreationApi`, `updateBatchCreationApi`, `viewBatchCreationApi`, `deleteBatchCreationApi`, `downloadBatchCreationPdf` (returns a URL string for `axios.post(..., {responseType:'arraybuffer'})`, same as the existing PDF-download pattern).

### 2.2 Screens — `src/components/storeComponents/BatchCreation/`
- **`BatchCreationList.js`** (container) + **`BatchCreationListUI.js`** (presentation)
  - Loads via `list` API on mount (`styleSearchDropdown:"-1"` for unfiltered load).
  - Search bar with a field-picker (Batch Id / Batch Nos / Batch Creation Date / Lot Nos / PO No → `styleSearchDropdown` values `batchId`/`batchname`/`creationdate`/`lotnos`/`ponos`), debounced 350ms, re-queries the server (not a client-side filter).
  - Per row: **Edit** shows only when `Number(item.isEdit) === 0`; otherwise a **View** button shows instead. **Delete** now also only shows when `isEdit === 0` (this was explicitly requested mid-session — originally it was unconditional, see §4 changelog). **PDF** download always shown.
  - Delete has a confirm popup (reusing the existing `AlertComponent` pattern) before calling `deleteBatchCreationApi`.
  - `keyExtractor` uses `item.batchDetailsId` (**not** `item.id`) — `id` is the parent batchId and repeats across a batch's multiple detail/lot rows in `aaData`, which was already caught as a real duplicate-key bug against live data (see §4 changelog, §5).
  - "Add New" floating button navigates to `CreateBatchCreation` with no params (defaults to create mode).

- **`CreateBatchCreation.js`** (container) + **`CreateBatchCreationUI.js`** (presentation, ~820 lines)
  - Single screen handles both **create** and **edit** modes via `route.params.mode`.
  - Loads `locations` + `fabricProcessFlow` on mount (create mode), or `edit` (with `batchId`/`batchDetailsId`) on mount (edit mode) to prefill the form.
  - Cascading dropdowns: Location → `fabricsByLocation` (Fabric Type) → `lotNos` (Lot No, used per batch-detail row).
  - Custom `SelectField` (Modal + FlatList) and `TextField` components built inline in the file — no new dependency pulled in for pickers.
  - All header fields from the report's §4 field table, the 10 treatment checkboxes (`CustomCheckBox` from common components), a `DateTimePickerModal`-driven Creation Date field formatted strictly as `dd/MM/yyyy` (per report gotcha #1 — the backend's date parser silently nulls anything else).
  - Dynamic batch-detail rows (Add/Remove), each with Batch No (with duplicate-check via `checkBatchNo` on blur, shows inline error + blocks submit), No of Pieces, Lot No (dropdown), MTR, Grey Received.
  - Total Issued is auto-summed from row MTR values (read-only field), matching the web form's JS behavior.
  - Save (`saveFlag:0`) / Submit (`saveFlag:1`, with a confirm modal — "locks this batch, adds it to available stock") / Save & New (`saveFlag:2`, create mode only — resets the form and re-loads dropdown data) buttons.
  - Edit mode sends `batchDetailsId`/`mtrOld`/`rollNoh`/`lineItemId` per existing row, per report §5's mtr-delta logic requirements.
  - **Known gap:** `mapViewDTOToForm()` (top of `CreateBatchCreationUI.js`) that prefills edit mode reads several plausible field-name aliases defensively (e.g. `dto.locationId ?? dto.bcLocationId`) because the exact JSON key casing of the `edit` endpoint's `viewDTO` has **never been confirmed against a live server** — the backend wasn't deployed when this was written. This is flagged with a comment in the code and is the single highest-risk unverified area.

- **`ViewBatchCreation.js`** (container) + **`ViewBatchCreationUI.js`** (presentation)
  - Read-only, modeled directly on `ViewStockIssueReturnUI.js`'s label/value + scrollable table pattern.
  - Same field-name-uncertainty caveat as above applies to `viewDTO` field access here.

### 2.3 Wiring
- `src/navigation/appNavigator.js` — registered `BatchCreationList`, `CreateBatchCreation`, `ViewBatchCreation` as stack screens (`headerShown: false`, matching every other screen in this navigator).
- `src/pages/sidebar/Sidebar.js` — added a "Batch Creation" entry (`menu_id: 571`, per the backend report's web URL `menuId=571`) under the existing `order` section ("Order Management", `menu_id: 28`), alongside Purchase Order / GRN / Box Packing / Bill Generation.

### 2.4 Fixes applied during this session (already committed)
1. **Delete button gating** — originally rendered unconditionally on every list row; changed to only show when `Number(item.isEdit) === 0`, matching the Edit button's rule (a Submitted/locked batch shouldn't be deletable from the list).
2. **Duplicate React key bug (confirmed against a real device/server run)** — `keyExtractor` was using `item.id`, which is the parent batchId and repeats whenever a batch has more than one detail/lot row in the `aaData` array returned by `list`. Console showed `Warning: Encountered two children with the same key, .$42` / `.$30` in production-like testing. Fixed to use `item.batchDetailsId` (falls back to `` `${item.id}_${index}` `` if that field is ever absent).

This second fix is notable: it's the first real signal that **the backend is live and returning data** at `https://testdemo.codeverse.co/stitch/batchCreation/list` — the session's console logs showed a real response shape:
```json
{"data":{"iTotalRecords":0,"iTotalDisplayRecords":0,"menuId":0,"menuStatus":0,"configId":0,"menuOrder":0,"batchId":0,"id":0,"newstts":0,"batchmtr":0,"aaData":[]},"status":"true"}
```
Note this response has extra top-level keys (`menuId`, `menuStatus`, `configId`, `menuOrder`, `batchId`, `id`, `newstts`, `batchmtr`) beyond what the integration report's §3 example documented (`iTotalRecords`, `iTotalDisplayRecords`, `aaData`) — these look like leftover/unused fields from a shared DTO class rather than anything Batch-Creation-specific, and the mobile code doesn't read them, but flagging in case they turn out to matter.

---

## 3. What's NOT done / pending

### 3.1 Verification against the live backend (highest priority)
Only one manual search request/response pair has been observed against `testdemo.codeverse.co` (an empty-result search, shown above). **None of the following have been verified against real data:**
- The actual shape of a non-empty `aaData` row from `list` (field names/types match report §3's example, but unconfirmed).
- The `edit` endpoint's `viewDTO`/`fabricMap`/`locationsMap`/`fabricFlowConfigMap`/`rollsMap` response shape — `mapViewDTOToForm()` in `CreateBatchCreationUI.js` is best-effort/defensive, not confirmed.
- The `view` endpoint's response shape — `ViewBatchCreationUI.js`'s field access is similarly best-effort.
- `create` / `update` / `delete` / `checkBatchNo` / `locations` / `fabricProcessFlow` / `fabricsByLocation` / `lotNos` / `pdf` have not been exercised at all yet from this mobile module.

**Next session should:** log in with real credentials against `testdemo.codeverse.co`, walk through List → Create → Save → Edit → Submit → View → PDF → Delete end-to-end, fix field-name mismatches as they surface (most likely spot: `mapViewDTOToForm` and `ViewBatchCreationUI`'s DTO field reads).

### 3.2 Features explicitly out of scope so far (per the original backend report §8)
These have **no mobile API endpoint at all yet** — backend work would be needed first:
- `getGRNNos` / `getGRNDetails` (legacy per-row roll/GRN lookups).
- `addbatchprocessflow` / `updateFabricProductionProcessOrder` (fabric production process order sub-feature on View/Edit web pages).
- Privilege-based show/hide of Edit/Delete/PDF buttons — the mobile API never returns `menuPrivileges`. Currently Edit/Delete are gated only by `isEdit` (submit status), not by per-user permission. If the business needs permission-based gating on mobile, that's a new backend requirement first.

### 3.3 Known simplifications in the mobile UI (not bugs, but deviations from the web)
- The web's "last N days" vs "all data" radio filter (`dataFilter` param) is **not exposed in the mobile UI** — the app always sends `dataFilter: ""`, which per the backend report §7 gotcha #5 means "all data" anyway (the only implemented server-side branch is the literal string `"30Days"`). If the business wants a real day-count filter control on mobile, that's mobile UI work, not blocked on backend.
- `list` is called with `length: 100` (no real pagination UI) — fine for typical data volumes but will silently truncate results past 100 rows. If batch volume can exceed that, add pagination or infinite scroll to `BatchCreationList.js`.
- No loading of the web's "Vendor Name / Vendor Challan No / Grey Width / Grey Date" display-only fields — the report itself notes these are dead/display-only on the web and never read server-side, so intentionally omitted.

### 3.4 Testing
- No automated tests written for this module (no test infra precedent found elsewhere in this app either — check before adding one from scratch).
- No manual device/simulator walkthrough completed beyond the one list-search call referenced in §2.4. UI has not been visually verified on a device — layout, spacing, and the custom dropdown modals should be sanity-checked on both iOS and Android.

---

## 4. File inventory (for quick reference)

```
BatchCreation-Mobile-Integration-Report.md          (backend API contract — read this first)
BatchCreation-Mobile-Handoff-Status.md              (this file)
src/utils/apiCalls/apiCallsComponent.js             (+~122 lines at end of file — API functions)
src/navigation/appNavigator.js                      (+3 Stack.Screen entries)
src/pages/sidebar/Sidebar.js                        (+1 menu entry under "order" section)
src/components/storeComponents/BatchCreation/
  BatchCreationList.js
  BatchCreationListUI.js
  CreateBatchCreation.js
  CreateBatchCreationUI.js
  ViewBatchCreation.js
  ViewBatchCreationUI.js
```

## 5. How to pick this up in a new session
1. Read `BatchCreation-Mobile-Integration-Report.md` in full — it's the backend contract this was built against.
2. Read this file.
3. Get real login credentials for `testdemo.codeverse.co` (or a local `stitch` server) and a test batch with **multiple detail rows** (to properly re-verify the `batchDetailsId` key fix and the list's per-row rendering).
4. Walk the full flow end-to-end per §3.1, fixing field-name mismatches in `mapViewDTOToForm()` (`CreateBatchCreationUI.js`) and `ViewBatchCreationUI.js` as they're discovered — these are the two files most likely to need adjustment.
5. Only after that: consider §3.2/§3.3 scope additions if the business asks for them.
