# GRN Checking -- Mobile API Documentation

**STATUS: implemented, deployed, and live-tested (2026-09-16).** Every
endpoint in `openapi.yaml` is real, running code today, not a proposal --
see "What's actually implemented" below for exactly what was built and how
it was verified.

This directory is the hand-off package for exposing the GRN Checking module to
the mobile team: the list page, the Fabric edit page (lots/bales/pieces,
save/submit/approve, move-to-lot, revert-to-draft), AI Doc Upload for
lot/bale/RM (including the async job/poll pattern), the RM item flow, and PDF
downloads (GRN No PDF, overall PO PDF, lot worksheet PDF).

For two other companion documents pitched at different audiences, see:
- **`../mobile-api-overview.md`** -- a short, non-technical explanation of
  what this project is and why, for anyone who isn't going to read YAML.
- **`../mobile-api-technical-summary.md`** -- a mid-length technical
  overview for a developer joining this effort, before they dive into the
  three exhaustive files in this directory.

**Explicitly excluded from this package: the barcode feature** (lot/bale/PO
barcode PDFs, `grn_checking_barcode`). Barcode generation-on-approve keeps
running server-side regardless, but its UI and its three download endpoints
are out of scope here and are not documented in `openapi.yaml`.

## Files in this package

- **`openapi.yaml`** -- the machine-readable contract: every endpoint's path,
  method, request/response schema, and auth requirement. This is what a
  mobile developer (or an AI coding agent scaffolding a client) should hand
  to a code generator or read first for "what do I call and what do I get
  back."
- **`business-rules-and-flows.md`** -- everything OpenAPI schemas can't
  express: the DRAFT -> SUBMITTED -> APPROVED state machine, every
  conditional gate (what's locked/disabled/hidden and why), and every
  user-facing warning/alert/confirm message with its exact trigger
  condition. The existing web app enforces almost none of this server-side
  as a hard block -- most of it lives only in the JSP's JavaScript today, so
  a mobile client has to reimplement it deliberately, not discover it by
  trial and error against the API.
- **`sequence-diagrams.md`** -- Mermaid diagrams for the three flows that are
  genuinely stateful and easy to get wrong: the AI-upload async job/poll
  loop (shared by lot/bale/RM), the Submit flow (save-then-submit, partial
  failure handling), and the Approve flow (force-save-on-select, batch
  approve, GRN No generation).

## The auth decision

The existing browser-facing `GrnCheckingController` (`/grncheck/...`) is
gated purely by `HttpSession` -- every method reads `companyId`/`userId` off
session attributes (`COMPANY_DETAILS`/`USER_DETAILS`) set at login, and there
is no bearer-token or API-key path anywhere in that chain. That doesn't map
cleanly onto a native mobile client.

Per the product decision on this effort, mobile does **not** get a new
token/JWT layer. Instead, every mobile-facing endpoint in `openapi.yaml`
extends the **stateless, credentials-per-request pattern already
established** in this codebase's `com.codeverse.stitch.api.controller`
package (`POController`, `GrnControllerApi`): `userName`/`userPwd` travel on
every single request (in the JSON body for POST calls, as headers for GET
calls -- see `openapi.yaml`'s `securitySchemes`), validated server-side the
same way that package already does, and `companyId`/`userId` are passed
explicitly as request fields instead of being read from a session. This is
consistent with existing precedent, not a new security model, but it is
**not** a modern scheme (plaintext credentials on every call, no token
expiry) -- flagged as a known limitation, not silently upgraded, since that
decision belongs to the team, not this documentation pass.

One real, non-obvious gotcha inherited from the existing pattern: the
underlying `CommonsUtil.checkUsernameAndPassword(userName, userPwd)` helper
returns the **string `"false"` when the credentials are valid** and
`"true"` when they are *not* (an inverted-sounding name). Any new
mobile-facing controller method wrapping this must not get that backwards.

**A second, deeper session dependency was found and fixed during live
testing (2026-09-16):** the file-upload endpoints (`/lot/upload*`,
`/bale/upload*`, `/rm/upload/async`) don't just need the stateless
credential check -- several frames down inside
`GrnCheckingPersistanceServiceImpl` (the S3-upload step specifically,
`uploadToS3` -> `TrimsConstructionPersistanceService.getCompanyDetails()`),
existing legacy code calls `CommonsUtil.getCurrentCompany()`, which reads
`HttpSession`'s `COMPANY_DETAILS` attribute directly, bypassing any
parameter passed in. A stateless mobile request has no such session, so
this returned `null` and every upload endpoint NPE'd
(`GrnCheckingPersistanceServiceImpl.uploadToS3:1208`) on first live test.

Fixed the same way this codebase's OWN existing stateless API precedent
already does it (`LogInManagementControllerAPI#logIn`, in this same
`api.controller` package): every mobile-facing method that carries a
`companyId` looks that company up explicitly
(`LoginManagementService#getAllCompanyDetails`) and stashes it onto its
own request's `HttpSession` (`primeCompanySession` in
`GrnCheckingMobileController`) before delegating to the shared service
layer -- entirely local to that one request, not a durable session a
mobile client needs to carry across calls. Applied to every endpoint
uniformly (not just uploads) as a defensive measure, since this same
hidden-session-read pattern could exist elsewhere in the legacy service
layer without having been hit yet.

## The one new endpoint this package needed

Before this effort, `GET /grncheck/fabric` (the edit page's page-load)
already assembled everything the page needs -- header, lots (with bales
and pieces), RM items, upload history, vendor details, and every GRN No
ever issued for this PO -- via `GrnCheckingController.fabric()`. But it
handed all of that to the *browser* by JSON-encoding each piece straight
into `<script>` variables for the JSP to read (see `grnCheckingFabric.jsp`
lines 7-11 and 703-714) -- there was no endpoint that returned this bundle
as an actual HTTP response body. A mobile client has no JSP to embed data
into, so this package adds one new endpoint, `GET /api/grncheck/state`,
that wraps the exact same service calls `fabric()` already makes and
returns them as one JSON object. Every other endpoint documented here
already returned JSON (or a PDF byte stream) as-is server-side and needed
no new business logic, only the auth re-homing described above.

## What's actually implemented

Two new Java files, additive only -- nothing in the existing
`GrnCheckingController`, any JSP, or the shared service/DAO layer was
touched:

- **`src/main/java/com/codeverse/stitch/api/controller/GrnCheckingMobileController.java`**
  -- all 32 endpoints in `openapi.yaml`, `@RequestMapping("/api/grncheck")`.
  Every method delegates to the exact same `GrnCheckingPersistanceService`
  method its `/grncheck/...` counterpart calls (see each operation's
  `x-legacy-endpoint` in `openapi.yaml` for the mapping) -- no business
  logic was reimplemented, only the transport/auth layer differs. File
  uploads use the same raw commons-fileupload parsing as
  `GrnCheckingController` (Spring's `MultipartFile` support is disabled
  project-wide in `application-dispatcher-servlet.xml`), duplicated rather
  than shared to avoid touching that existing, already-tested file.
- **`src/main/java/com/codeverse/stitch/api/request/grncheck/GrnMobileApiRequests.java`**
  -- the 16 request-body DTOs (one shared `Auth` base carrying
  `userName`/`userPwd`/`companyId`/`userId`, extended per endpoint).

**Verified live** (2026-09-16, against a local deployment, real DB,
credentials looked up directly from `user_login`):
1. `GET /state` with valid credentials -- full JSON bundle (header, 2 fabric
   line items, lots with nested bales/pieces) returned correctly.
2. Same call with a wrong password -- clean `401` with
   `{"success":false,"errorMessage":"Invalid credentials."}`, not a stack
   trace or a silent wrong-data response.
3. `POST /list` -- correct paginated PO rows, matching the browser list
   page's own data exactly (same `hasApprovedBatches`, `poStatus`, etc.).
4. `GET /pdf/worksheet` -- real PDF bytes back, `Content-Disposition`
   header set, content visually confirmed identical to the same lot's
   browser-downloaded worksheet PDF.
5. Same PDF call with a wrong password -- clean `401` JSON, confirming the
   auth check runs *before* any PDF generation starts (not a broken/partial
   binary stream).
6. `GET /lot/upload/status` with a made-up `jobId` -- the real service's own
   graceful `"Unknown or expired job."` / `jobStatus:"error"` response, not
   an unhandled exception.
7. `POST /header/save-meta` -- a real write, confirmed by reading the row
   back directly from MySQL afterward, then reverted to its original value.
8. **The existing browser flow re-checked after deployment**: logged into
   the web app, reloaded the same PO's Fabric edit page -- identical
   rendering, identical data, no regressions. The two controllers run
   side by side in the same WAR with zero interference.

9. `POST /lot/upload` and `POST /bale/upload` -- exercised end-to-end for
   real, with the local `bhairav-ai-extraction` Python service running
   and two of the checked-in reference images
   (`single_bale_ticket.png`, `multi_bale_sheet.png`) as the uploaded
   documents. This is what surfaced the hidden `COMPANY_DETAILS` session
   dependency above -- first attempt NPE'd; after the fix, both calls
   completed a REAL AI extraction round-trip (S3 upload, `ai_extraction_audit`
   row written with `extraction_status='OK'`, confirmed by direct DB
   query) and correctly applied the same business rule the browser UI
   enforces (uploaded documents whose extracted `bale_no` matched an
   already-SUBMITTED bale in this lot were skipped with the exact same
   advisory message text, never silently overwritten).

**UPDATE (2026-09-17): every one of the 32 endpoints is now individually
live-tested end-to-end**, closing the gap flagged above. In addition to
items 1-9:

10. `POST /bale/add`, `/bale/save-draft`, `/bale/remove-piece`,
    `/bale/submit`, `/bale/unsubmit`, `/bale/approve-batch`,
    `/bale/move-to-lot` -- each exercised for real against live bales,
    including a full add -> save-draft -> submit -> unsubmit ->
    remove-piece cycle on one bale and a disposable bale taken all the
    way through approve-batch (real GRN No issued, real warning surfaced
    for a qty-ceiling breach).
11. `POST /rm/save-draft`, `/rm/submit`, `/rm/approve-batch` -- tested
    against real RM line items under a real RM header; approve-batch
    correctly batch-approved every eligible item under the header (not
    just the one touched), reopened each as DRAFT per the documented RM
    behavior, and surfaced a real received-qty-exceeded warning.
12. `POST /lot/available-rolls`, `/lot/open`, `/audit-history` -- tested
    against a real PO; `/lot/open` confirmed idempotent against an
    already-open roll.
13. `GET /pdf/grn`, `GET /pdf/overall` -- both return real, valid PDF
    bytes for a real GRN No / PO.
14. The full async job/poll/cancel/resume family for lot, bale, and RM
    (`/lot/upload/async`, `/bale/upload/async`, `/rm/upload/async` +
    their `/status`, `/cancel`, and -- for lot/bale --  `/resume`
    endpoints) -- all tested with real files against the real AI service.
    `/cancel` confirmed to finalize a job as `jobStatus:"cancelled"`
    while still keeping whatever page(s) already completed. Most
    importantly, `/resume` was proven end-to-end **twice** (once for lot,
    once for bale): uploading a document whose fabric didn't match the
    target PO line correctly stopped the job with
    `fabricMismatchStopped:true` *before writing anything* (confirmed via
    direct DB read -- no bale fields changed), and calling `/resume`
    afterward correctly continued that same job and completed the real
    write. This is the exact scenario flagged as unverified in the
    previous version of this document, and it's now proven safe.

Two real, non-obvious things surfaced during this full sweep (neither is
a regression -- both are either a genuine pre-existing gap or documented,
pre-existing behavior worth knowing about):

- **A real bug, found and fixed**: `moveBaleToLot` had no duplicate-Bale-No
  check against the *destination* lot -- `createManualBale` already
  rejected a duplicate Bale No within the same lot, but moving an
  existing bale into a different lot that already had a bale with that
  same number went through unchecked, leaving two bales sharing one Bale
  No in one lot. Fixed with the same one-line pattern `createManualBale`
  already used, and verified both ways (a genuine clash is now rejected;
  a legitimate no-clash move still succeeds).
- **Not a bug, but a real asymmetry worth flagging to mobile**: unlike
  `totalInMtrs` (always recomputed server-side as the sum of the
  request's own `pieces[].totalInMtrs`), a bale's `checkedMtrs` in
  `POST /bale/save-draft` is taken **literally** from the request's
  top-level `checkedMtrs` field -- it is *not* auto-summed from
  `pieces[].checkedMtrs`. A mobile client must sum its own piece-level
  checked values and send that sum explicitly, or the bale-level
  `checkedMtrs` will silently be whatever was sent (including `0` if
  omitted/defaulted), even though every piece row looks correctly filled
  in. See `openapi.yaml`'s `SaveDraftRequest` schema for this callout.
