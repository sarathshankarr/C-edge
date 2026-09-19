# Batch Creation Module — Web Functionality &amp; Mobile API Integration Report

**App:** e-fabric / stitch (Spring MVC, Hibernate, JSP)
**Module:** Order Management → Batch Creation
**Scope of this report:** the List/Search page, the Create Batch page, and the Edit Batch page — how they work today on web, and the JSON APIs built to let a mobile app do the same things.

---

## 1. Where everything lives

| Concern | File |
|---|---|
| Web controller (JSP-driven, session-auth) | `src/main/java/com/codeverse/stitch/controllers/orderform/BatchCreationController.java` (unchanged by this work) |
| Mobile JSON API controller (new) | `src/main/java/com/codeverse/stitch/api/controller/BatchCreationApiController.java` |
| List/Search JSP | `src/main/webapp/views/orderform/batchCreationsearch.jsp` |
| Create JSP | `src/main/webapp/views/orderform/batchcreation.jsp` |
| Edit JSP | `src/main/webapp/views/orderform/batchCreationEdit.jsp` |
| View (read-only) JSP | `src/main/webapp/views/orderform/batchCreationview.jsp` |
| Persistence service | `BatchCreationPersistanceService` / `BatchCreationPersistanceDaoImpl` (untouched — all mobile APIs call the exact same service methods as the web controller) |
| Entities | `BatchCreation` (table `batch_creation`), `BatchCreationDetails` (table `batch_creation_details`) |
| Reference convention followed | `src/main/java/com/codeverse/stitch/api/controller/StockIssueReturnApiController.java` — this is the established pattern for mobile APIs in this codebase; `BatchCreationApiController` was written to match it exactly |

**Important:** none of the business logic in `BatchCreationController.java` or the persistence layer was changed. `BatchCreationApiController.java` is a parallel, additive layer that reuses the same service calls — only the auth model and the request/response transport (JSON vs. form-encoded/session) differ.

---

## 2. Authentication — web vs. mobile

### Web (existing, unchanged)
- Session-cookie based. `SessionManagementOperation.checkValidSessionIfExist(request, response)` runs at the top of every controller method.
- Login: `POST /stitch/loginMgmt/authenticateAccess` (`loginUsername`, `loginUserPwd`, form-urlencoded) → server sets `HttpSession` attributes `USER_DETAILS`, `COMPANY_DETAILS`, `menuPrivileges`, returns `Set-Cookie: JSESSIONID=...`.
- Every later request replays that cookie. If `USER_DETAILS` is missing/expired, the server responds with a redirect to `/loginMgmt/logout` (shows the app's own 404-style "OOPS" page if a JSON caller doesn't follow it).
- Not practical for a mobile client — requires manual cookie-jar plumbing on every platform.

### Mobile (new, `BatchCreationApiController`)
- **Stateless.** No session, no cookie. Every single request carries `username` and `password` directly in its JSON body.
- Server-side check per request: `commonUtil.checkUsernameAndPassword(username, password)`. **Gotcha:** this method's return semantics are inverted — it returns the **string `"false"`** when the credentials are **valid**, and `"true"` (or `""` on error) when invalid. The controller code correctly handles this (`if (!"false".equals(userLogin)) return unauthorized();`) but don't be confused by it if you read the raw method.
- Where the entity needs the current user's id (e.g. `create`, `update`, `delete`) or company (e.g. `view`, `edit`, `pdf`, `locations`, `fabricsByLocation`), the controller calls `commonUtil.getUserId(username, password)` to get a `LoginManagementDTO`, then (for company) `loginManagementService.getAllCompanyDetails(loginDTO.getCompany_ids())`.
- Failure responses:
  - Bad credentials → `401 Unauthorized`, `{"status":"false","message":"Invalid Username or Password"}`
  - Server exception → `500 Internal Server Error`, `{"status":"false","message":"Internal Server Error"}`
  - Missing required param (e.g. `view`/`edit` without `batchId`) → `400 Bad Request`

### Base URL
- Local dev: `http://localhost:8080/stitch`
- Shared demo: `https://testdemo.codeverse.co/stitch` (**only after the code below is committed, pushed, and the server's `deploy.sh` rebuilds/redeploys the WAR** — this is a manual/CI step outside this codebase; nothing works there until that happens)

---

## 3. List / Search Page

**Web URL:** `GET /stitch/batchcreation/batchcreationsearch?menuId=571`
**Controller methods:** `loadBatchCreationSearchPage()` (page shell/config) + `loadAll()` (actual data, called via AJAX on load and on every search/filter change)

### What the page shows
- Header "Order Management - Batch Creation", with a **Create Batch** link (only if the user's privileges for that `menuId` include `ADD`).
- Search bar: dropdown (`BatchId` / `Batch Nos` / `Batch Creation Date` / `Lot Nos` / `PO No`) + free-text value + Search button.
- Radio filter: "last N days" (N = `commonUtil.getListProcessDays(menuId)`) vs. "all data".
- A DataTable with columns: BatchId, Batch No, Batch Name, Lot Nos, Quality Name, Total Issued, Creation Date, Action (Edit / View / Delete / PDF-download, each gated by privileges).

### Backend calls on this page
| Call | Trigger | Purpose |
|---|---|---|
| `GET/POST batchcreationsearch?menuId=` | page load | Renders the shell (privileges, "last N days" count, language strings) |
| `POST loadAll` | page load, search, filter change | Returns the DataTable JSON |
| `POST deleteBatchById` | row Delete button | Deletes one batch-detail row (and the parent `batch_creation` row if it was the last detail) |
| `GET editBatch?batchId=&batchDetailsId=&menuId=` | row Edit button (only shown if `isEdit==0`) | Navigates to the Edit page |
| `GET viewbatch?batchId=&menuId=` | row View button | Navigates to the read-only View page |
| `GET generateBatchPDF?batchDetailsId=&menuId=` | row PDF icon | Downloads a PDF |
| `GET batchcreate?menuId=` | "Create Batch" link | Navigates to the Create page |

### Mobile equivalent: `POST /batchCreation/list`
**Request:**
```json
{
  "username": "admin",
  "password": "Codeverse@demo",
  "start": 0,
  "length": 25,
  "searchKeyValue": "",
  "styleSearchDropdown": "-1",
  "dataFilter": ""
}
```
- `styleSearchDropdown = "-1"` → full unfiltered list (`loadAll` service call). Any other value (`"batchId"`, `"batchname"`, `"creationdate"`, `"lotnos"`, `"ponos"`) → search mode (`loadAllSearch` service call), and `searchKeyValue` must be non-empty.
- `dataFilter`: empty string = the default "last N days" window used server-side (30 days is the only branch actually implemented in SQL — see §7); any other string effectively means "all data".

**Response:**
```json
{
  "status": "true",
  "data": {
    "iTotalRecords": 42,
    "iTotalDisplayRecords": 42,
    "aaData": [
      {
        "id": 101,
        "batchNames": "B001",
        "lotNos": "L1,L2",
        "grnNos": "",
        "totalIssued": 120.5,
        "batchCreationDate": "16/09/2026",
        "qualityName": "Cotton Twill",
        "batchDetailsId": 501,
        "isEdit": 0,
        "isProductionProcess": 0,
        "actionVal": "",
        "noOfPieces": 0,
        "bcLocationId": 3,
        "fabricId": 57,
        "fabricflowstatus": 0
      }
    ]
  }
}
```
- `data` is the **parsed** JSON the underlying service produces (not double-encoded as a string) — the API controller runs it through Jackson's `ObjectMapper().readTree()` before embedding it.
- **`aaData[].isEdit`** is read directly from the `batch_creation_details.is_submit` column. `0` = still a draft, editable. Non-zero (typically `1` after a real Submit) = the web UI hides its Edit button for that row — treat it the same way on mobile: only allow Edit when `isEdit == 0`.
- The page/config info the web `loadBatchCreationSearchPage()` also returns (privileges, "last N days" count, language strings) is **not** included in this call, on purpose (matches the `StockIssueReturnApiController` convention, which never exposes privileges). If the mobile UI needs to gate its own Edit/Delete/PDF buttons by permission, that logic needs to live client-side or be added later — it does **not** currently exist in the mobile API layer.

### Mobile field mapping for the list UI
| Web column | JSON field |
|---|---|
| BatchId | `aaData[].id` |
| Batch No | `aaData[].batchNames` |
| Batch Name (display) | `aaData[].batchNames` (same field; there's no separate "batch name" vs "batch no" in the data) |
| Lot Nos | `aaData[].lotNos` |
| Quality Name | `aaData[].qualityName` |
| Total Issued | `aaData[].totalIssued` |
| Creation Date | `aaData[].batchCreationDate` (already formatted `dd/MM/yyyy` server-side) |
| Action → Edit target id | `aaData[].id` (batchId) + `aaData[].batchDetailsId` |
| Action → View/PDF target id | `aaData[].batchDetailsId` |
| Action → Delete needs | `aaData[].id` (batchId), `aaData[].batchDetailsId`, `aaData[].fabricId`, `aaData[].bcLocationId` |

---

## 4. Create Batch Page

**Web URL:** `GET /stitch/batchcreation/batchcreate?menuId=571`
**Controller method:** `batchcreate()` (page shell) → submit hits `createBatch()` (POST)

### Full field inventory (and whether it's actually used server-side)

| Label on page | Web `name=` | Sent to server? | Actually read by `createBatch()`? | Mobile JSON key |
|---|---|---|---|---|
| Location * | `locationId` | yes | yes | `locationId` |
| Fabric Type * | `fabricId` | yes | yes | `fabricId` |
| Vendor Name | *(display only, `<span>`)* | — | **no** (input is commented out in the JSP) | — |
| Vendor Challan No | *(display only)* | — | **no** | — |
| Grey Width | *(display only)* | — | **no** | — |
| Grey Date | *(display only)* | — | **no** | — |
| Cotton D | `cottonD` | yes | yes | `cottonD` |
| Polys D | `polysD` | yes | yes | `polysD` |
| Desize D | `desizeD` | yes | yes | `desizeD` |
| Party Name | `partyName` | yes | yes | `partyName` |
| Singeing…Shiner (10 checkboxes) | `singeing`, `hset`, `kitty`, `zerozero`, `semiStarch`, `crossDyg`, `singleDyg`, `solidDyg`, `cationicDyg`, `shiner` | yes (value `1` if checked) | yes | same keys, `1`/omit |
| Creation Date * | `creationDate` | yes | yes — **format is `dd/MM/yyyy`**, see §7 | `creationDate` |
| DC No * | `dcNo` | yes | yes | `dcNo` |
| Quality Name | hidden field `qualityNameh` (auto-filled by JS, not typed) | yes | yes | `qualityNameh` |
| Grey Shortage | `greyShortage` | yes | yes | `greyShortage` |
| Weight | `weight` | yes | yes | `weight` |
| Reed and Pick | `reedPick` | yes | yes | `reedPick` |
| Fabric Process Flow * | `fabricFlow` | yes | yes | `fabricFlow` |
| Bio Finish | `bioFinish` | yes | yes | `bioFinish` |
| Remazol | `remazol` | yes | yes | `remazol` |
| Mercerise | `mercerise` | yes | yes | `mercerise` |
| Lycra | `lycra` | yes | yes | `lycra` |
| Roll/Trolley | `rolltrolley` | yes | yes | `rolltrolley` |
| Total Issued | `totalIssued` (auto-summed by JS from row MTRs) | yes | yes | `totalIssued` |
| "Folding and Packing Instruction" | *(section heading only, not a field)* | — | — | — |
| Sample | `sample` | yes | yes | `sample` |
| BSR | `bsr` | yes | yes | `bsr` |
| Delivery At | `deliveryAt` | yes | yes | `deliveryAt` |
| Save/Submit/Save&New buttons | `saveFlag` (0/1/2) | yes | yes | `saveFlag` |
| — | `menuId` | yes | only for privilege/session lookup, never persisted | not needed |
| — | `count` (row count) | yes | drives the indexed-field loop | replaced by array length — see below |

**Per-row line items** (table: Batch No / Lot No / Grey Received / No of Pieces / MTR):

| Web `name=` (indexed, e.g. `batchNo1`) | Read server-side? | Mobile `batchDetails[]` key |
|---|---|---|
| `batchNo{i}` | yes | `batchName` |
| `poNo{i}` (hidden, always `0` on this page) | yes | `poNo` |
| `vendorId{i}` (hidden, always `0` on this page) | yes | `vendorId` |
| `noOfPieces{i}` | yes | `noOfPieces` |
| `rollNo{i}` | yes | `rollNo` |
| `mtr{i}` | yes | `mtr` |
| `greyReceivedh{i}` | yes | `greyReceivedh` |
| `vendorName{i}`, `vendorChallanNo{i}`, `greyWidth{i}`, `greyDate{i}` (all hidden) | **no** — sent by the browser (they're real `<input>`s in the form) but never read by `createBatch()` | not needed |

### Dropdown data sourcing (2 different patterns)
1. **Location** and **Fabric Process Flow** — loaded together in the **same** initial page-load call (`batchcreate()` sets `locationsMap` and `fabricFlowConfigMap`+`defaultFlowId` as request attributes, rendered via JSTL).
2. **Fabric Type** — starts empty; populated by a **separate** AJAX call (`loadFabricsByLocation`) fired only after Location is picked.
3. **Lot No.** — starts empty; populated by a **separate** AJAX call (`getRollNos`) fired only after Fabric is picked.

(Note: the controller also loads a `fabricMap` server-side in `batchcreate()`, but the JSP's JSTL loop for it is commented out — that data is dead on this page; the real Fabric list only ever comes from `loadFabricsByLocation`.)

### Duplicate Batch No check
- `checkBatchNo?batch_name=&batchId=0` (GET) fires on the Batch No field's `onchange`. If it finds an existing batch with that name, it **disables** the Save/Submit/Save&New buttons and alerts the user; otherwise it re-enables them.

### `saveFlag` semantics — important business logic
Traced in `BatchCreationPersistanceDaoImpl.createBatch()` / `addBatchInventory()`:
- **`saveFlag = 0`** ("Save"): plain draft. Persists `batch_creation` + `batch_creation_details` only.
- **`saveFlag = 1`** ("Submit"): **the only value that triggers real side effects** — also (a) updates `batch_creation_fabric_process_flow` (kicks off production-process tracking) and (b) inserts a row into `batch_inventory` (the batch becomes real, available stock).
- **`saveFlag = 2`** ("Save & Add New"): at the persistence layer, behaves exactly like `0` (no special-casing in the DAO). The **web controller** additionally reloads the create form's dropdown data when it sees `2`, purely to re-render the same JSP for the next entry — the mobile `create` API deliberately does **not** replicate that reload-bundling; call `locations`/`fabricProcessFlow`/`fabricsByLocation` again instead.
- **Any other value** (e.g. `3`): behaves like a draft at the DAO level (no inventory/process-flow side effects), but the List page will still treat that row as **not editable** (`isEdit != 0`), because `isEdit` is read straight from the same `is_submit` column. **Only ever send `0`, `1`, or `2` from mobile.**

### Mobile equivalents
| Purpose | Endpoint | Notes |
|---|---|---|
| Locations dropdown | `POST /batchCreation/locations` | `{username,password}` → `{status,data:{<id>:<name>,...}}` |
| Fabric Process Flow dropdown | `POST /batchCreation/fabricProcessFlow` | `{username,password}` → `{status,data:{fabricFlowConfigMap:{...}, defaultFlowId:<int>}}` |
| Fabric Type dropdown | `POST /batchCreation/fabricsByLocation` | `{username,password,locationId}` → `{status,data:{<id>:<name>,...}}` — call after Location is picked |
| Lot No. dropdown | `POST /batchCreation/lotNos` | `{username,password,fabricId}` → `{status,data:{<rollNo>:<label>,...}}` — call after Fabric is picked |
| Duplicate batch-no check | `POST /batchCreation/checkBatchNo` | `{username,password,batch_name,batchId}` (`batchId:0` for a new batch) → `{status:"true", exists:true|false}` |
| Create (Save or Submit) | `POST /batchCreation/create` | see below |

**`create` request (all fields, using the field mapping table above):**
```json
{
  "username": "admin",
  "password": "Codeverse@demo",
  "locationId": 1,
  "fabricId": 3,
  "cottonD": "Cotton D",
  "polysD": "Polys D",
  "desizeD": "Desize D",
  "partyName": "Party Name",
  "singeing": 1, "hset": 1, "kitty": 1, "zerozero": 1, "semiStarch": 1,
  "crossDyg": 1, "singleDyg": 1, "solidDyg": 1, "cationicDyg": 1, "shiner": 1,
  "creationDate": "17/09/2026",
  "dcNo": "12345",
  "qualityNameh": "",
  "greyShortage": 1,
  "weight": 12,
  "reedPick": "Reed and Pick",
  "fabricFlow": 2,
  "bioFinish": "Bio Finish",
  "remazol": "Remazol",
  "mercerise": "Mercerise",
  "lycra": "Lycra",
  "rolltrolley": "Roll",
  "totalIssued": 10,
  "sample": "Sample",
  "bsr": "BSR",
  "deliveryAt": "Delivery At",
  "saveFlag": 1,
  "batchDetails": [
    {
      "batchName": "123123",
      "poNo": 489,
      "vendorId": 27,
      "noOfPieces": 10,
      "rollNo": "1",
      "mtr": 10,
      "greyReceivedh": 1000
    }
  ]
}
```
The web's indexed fields (`batchNo1`, `poNo1`, `mtr1`, `count=1`, ...) are replaced by the `batchDetails` JSON array — one object per row, array length replaces `count`. All fields are optional except what's needed to actually create a meaningful batch; the API only sets a field on the entity if it's present and non-empty, exactly like the web controller's `request.getParameter(...) != null && !....isEmpty()` guards.

**Response:**
```json
{ "status": "true", "batchId": 123, "message": "Batch Created Successfully" }
```

---

## 5. Edit Batch Page

**Web URL:** `GET /stitch/batchcreation/editBatch?batchId=&batchDetailsId=&menuId=` (from the List page's Edit button — only shown when `isEdit == 0`)
**Controller methods:** `editBatch()` (loads the form) → submit hits `updateBatch()` (POST)

### How it differs from Create
`updateBatch()` shares ~95% of its field-parsing code with `createBatch()` (same header fields, same table). The differences that actually matter:

1. **`batchId`** is set on the entity (`batch.setId(...)`) → Hibernate does an `UPDATE` on `batch_creation` instead of an `INSERT`.
2. **`batchDetailsId{i}`** is set on each row (`details.setId(...)`) → that specific `batch_creation_details` row is updated in place instead of a new row being inserted.
3. **Mtr delta logic** — only runs when a row has an existing id **and** a `mtrOld` value is present:
   - if the roll number didn't change: adjusts that roll's received-quantity map by `mtr - mtrOld` (the delta), not the full new `mtr` (avoids double-counting what create already recorded).
   - if the roll number **did** change: adds the full new `mtr` to the new roll, and subtracts `mtrOld` from the old roll.
   - Needs three extra per-row fields only for existing rows: `mtrOld` (previous mtr), `rollNoh` (previous/original roll no, used as the comparison key), and `lineItemId` (parsed by the web controller but never actually used in the logic — genuinely dead, kept only for parity).
4. Dead fields, same as create: `vendorName1`, `vendorChallanNo1`, `greyWidth1`, `greyDate1`, plus `param=update` and `lineItemGreyReceived1` (all sent by the browser, none read server-side).
5. Both controllers call the same service method `batchCreationPersistanceService.createBatch(batch, isEdit)` — `isEdit` is a **completely unused parameter** in the DAO implementation. The real insert-vs-update behavior comes entirely from whether `.setId()` was set, not from this flag.

### Mobile equivalents
**Load for editing — `POST /batchCreation/edit`:**
```json
{ "username": "admin", "password": "Codeverse@demo", "batchId": "10147", "batchDetailsId": "10147" }
```
→
```json
{
  "status": "true",
  "data": {
    "viewDTO": { "...BatchCreation entity, including batchDetails[] with each row's id/mtr/lotNo..." },
    "fabricMap": { "...": "..." },
    "locationsMap": { "...": "..." },
    "fabricFlowConfigMap": { "...": "..." },
    "rollsMap": { "...": "..." }
  }
}
```
Use each row's `id` → `batchDetailsId`, `mtr` → `mtrOld`, `lotNo` → `rollNoh` when building the subsequent `update` call for that row.

**Submit — `POST /batchCreation/update`:** same shape as `create`, plus `batchId` at the top level, and each `batchDetails[]` item optionally carrying `batchDetailsId`, `mtrOld`, `lineItemId`, `rollNoh` (include these three only for a row that already existed; omit them to insert a brand-new row during an edit).

```json
{
  "username": "admin", "password": "Codeverse@demo",
  "batchId": "10147",
  "...(all the same header fields as create)...": "...",
  "saveFlag": 1,
  "batchDetails": [
    {
      "batchDetailsId": "52",
      "batchName": "123123", "poNo": 489, "vendorId": 27, "noOfPieces": 10,
      "rollNo": "1", "mtr": 10, "greyReceivedh": 1000,
      "mtrOld": 10, "lineItemId": 0, "rollNoh": "1"
    }
  ]
}
```
Response shape is the same as `create`: `{"status":"true","batchId":123,"message":"Batch Updated Successfully"}`.

---

## 6. Delete, View, PDF (list-page actions)

| Endpoint | Request | Response |
|---|---|---|
| `POST /batchCreation/delete` | `{username,password,batchId,batchDetailsId,fabricId,locationId}` | `{"status":"true"\|"false"}` (deletes the detail row; deletes the parent batch too if it was the last row) |
| `POST /batchCreation/view` | `{username,password,batchId}` (this is actually the `batchDetailsId`, matching the web's `viewbatch?batchId=` param naming) | `{"status":"true","data":{"viewDTO":{...},"fabricMap":{...},"locationsMap":{...},"fabricFlowConfigMap":{...}}}` |
| `POST /batchCreation/pdf` | `{username,password,batchDetailsId}` | Raw PDF bytes, `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="BC#<id>.pdf"` |

---

## 7. Known gotchas to preserve when building the mobile UI

1. **Date format bug (real, silent):** `commonUtil.stringToUtil_yyyyMMdd(String)` — despite its name — parses with `SimpleDateFormat("dd/MM/yyyy")`, not ISO format. It also swallows `ParseException` internally (logs it, returns `null`) — **no error surfaces to the caller**, the date just silently ends up `null` in the database. Always send `creationDate` as `dd/MM/yyyy` (e.g. `"17/09/2026"`), never `yyyy-MM-dd`.
2. **`checkUsernameAndPassword` inverted return value:** returns the string `"false"` for a *successful* login check, `"true"`/`""` for failure. This is existing behavior, correctly handled in the API controller — just don't be misled if you read that method directly.
3. **`status` in every mobile response is a string** (`"true"`/`"false"`), not a JSON boolean — matches the established convention from `StockIssueReturnApiController`. Parse it as a string on the client, or coerce explicitly.
4. **`isEdit`/`is_submit`/`isSubmit` is one underlying value, three names** depending on context: stored per-row as `batch_creation_details.is_submit`; set via `saveFlag` on create/update; read back as `aaData[].isEdit` on the list. `0` = draft/editable, non-zero = locked from editing on the list UI (regardless of whether it was a "real" submit).
5. **30-day filter is the only implemented `dataFilter` branch** — the SQL only special-cases `days.equalsIgnoreCase("30Days")`; anything else (including empty string) returns the unfiltered "all data" set. Don't assume other day-count values do anything.
6. **Dead fields exist on both Create and Edit forms** (`vendorName{i}`, `vendorChallanNo{i}`, `greyWidth{i}`, `greyDate{i}`, `lineItemGreyReceived{i}`, `menuId`, `param`) — the web browser sends them because they're literal form fields, but the server never reads them. The mobile APIs correctly omit them; don't bother implementing UI for them unless a future requirement changes this.
7. **`lineItemId` in `update`** is read/parsed by the server but never actually used in any calculation — send it for parity if you want, but it has zero effect either way.

---

## 8. What is *not* yet built (gaps, if the mobile scope grows)

These web endpoints exist and are actively used by the JSPs, but have **no** mobile equivalent yet:
- `getGRNNos` / `getGRNDetails` — legacy per-row roll/GRN detail lookups, used by both Create and Edit pages (partially superseded by `getRollNos`/`lotNos` in the current UI flow, but still wired up).
- `addbatchprocessflow` / `updateFabricProductionProcessOrder` — a separate "fabric production process order" sub-feature used on the View and Edit pages.
- Privileges/permissions exposure — the mobile API layer never returns `menuPrivileges`, unlike the web's `batchcreationsearch()`/`batchcreate()` page-load. If the mobile UI needs to hide/show Edit/Delete/PDF per-user, that logic needs a new endpoint or a different design.

Confirmed **dead code, not used anywhere**, so no mobile equivalent is needed: `checkBatchName` (distinct from `checkBatchNo`), `deleteBatch` (the non-`ById` variant — the UI only ever calls `deleteBatchById`).

---

## 9. Full mobile API reference (all under `POST {baseUrl}/batchCreation/...`, JSON in/out)

| # | Endpoint | Mirrors (web) | Required body fields |
|---|---|---|---|
| 1 | `locations` | `batchcreate()`'s `locationsMap` | `username`, `password` |
| 2 | `fabricProcessFlow` | `batchcreate()`'s `fabricFlowConfigMap`+`defaultFlowId` | `username`, `password` |
| 3 | `fabricsByLocation` | `loadFabricsByLocation()` | `username`, `password`, `locationId` |
| 4 | `lotNos` | `getRollNos()` | `username`, `password`, `fabricId` |
| 5 | `checkBatchNo` | `checkBatchNo()` | `username`, `password`, `batch_name`, `batchId` |
| 6 | `list` | `loadAll()` / `loadAllSearch()` | `username`, `password`, `start`, `length`, `searchKeyValue`, `styleSearchDropdown`, `dataFilter` |
| 7 | `create` | `createBatch()` | `username`, `password`, (header fields), `batchDetails[]` |
| 8 | `edit` | `editBatch()` | `username`, `password`, `batchId`, `batchDetailsId` |
| 9 | `update` | `updateBatch()` | `username`, `password`, `batchId`, (header fields), `batchDetails[]` (with `batchDetailsId`/`mtrOld`/`rollNoh` per existing row) |
| 10 | `view` | `viewbatch()` / `view()` | `username`, `password`, `batchId` (actually a `batchDetailsId`) |
| 11 | `delete` | `deleteBatchById()` | `username`, `password`, `batchId`, `batchDetailsId`, `fabricId`, `locationId` |
| 12 | `pdf` | `generateOrderPDF()` | `username`, `password`, `batchDetailsId` |

A ready-to-import Postman collection covering all 12 (with `username`/`password`/`baseUrl` hardcoded to `admin` / `Codeverse@demo` / `http://localhost:8080/stitch`) is at:
`e-fabric/BatchCreation-Talend-API-Tester.postman_collection.json`

---

## 10. Recommended mobile screen ↔ API call flow

**List screen:**
1. On load → `list` (with `styleSearchDropdown:"-1"`).
2. On search → `list` (with the chosen dropdown field + `searchKeyValue`).
3. Per row: Edit → only enabled if `isEdit==0`; tapping it calls `edit`. View → `view`. PDF → `pdf`. Delete (with confirm) → `delete`, then refresh via `list`.
4. "Create Batch" button → navigate to Create screen.

**Create screen:**
1. On load, in parallel: `locations` and `fabricProcessFlow`.
2. On Location selected → `fabricsByLocation`.
3. On Fabric selected → `lotNos`.
4. On Batch No field blur/change (per row) → `checkBatchNo`; disable Save/Submit if `exists:true`.
5. Save button → `create` with `saveFlag:0`. Submit button → `create` with `saveFlag:1` (after a confirm dialog, matching web). Save & Add New → `create` with `saveFlag:2`, then re-run steps 1-3 to reset the form for the next entry.

**Edit screen:**
1. On load → `edit` with the `batchId`/`batchDetailsId` from the tapped list row.
2. Populate the same fields as Create from `data.viewDTO`, plus dropdown data from `data.fabricMap`/`data.locationsMap`/`data.fabricFlowConfigMap`/`data.rollsMap`.
3. For each existing row, remember its `id` (→ `batchDetailsId`), `mtr` (→ `mtrOld`), `lotNo` (→ `rollNoh`) for the update call.
4. Submit → `update`, same `saveFlag` semantics as Create.

---

## 11. Deployment note (applies to every endpoint above)

None of `BatchCreationApiController.java`'s endpoints exist on any deployed server yet — they are currently only in the local source tree, uncommitted, on branch `141024backup` of `https://bitbucket.org/estitch/e-fabric.git`. Standard deploy flow (`deploy.sh`, runs **on** the target server): `git pull` → `mvn clean package` → copy `target/stitch.war` into Tomcat's `webapps/` → restart Tomcat. Until that's done (locally or on `testdemo.codeverse.co`), every call above will 404.
