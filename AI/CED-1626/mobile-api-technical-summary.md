# GRN Checking Mobile API -- Technical Summary

Read this before diving into `mobile-api/openapi.yaml`,
`mobile-api/business-rules-and-flows.md`, or
`mobile-api/sequence-diagrams.md`. Those three are exhaustive references;
this is the map that tells you which one to open for what, and the
architectural decisions behind all three.

## Scope

Everything in GRN Checking (list page, Fabric edit core, lot/bale AI
upload, RM item flow + RM invoice AI upload, PDFs) **except barcode
generation/download**, which is out of scope for this effort entirely.

## What exists today (before this project)

- `GrnCheckingController` (`/grncheck/...`), browser-facing. JSP views for
  page loads (`/list`, `/fabric`), JSON for every action (`saveDraft`,
  `submit`, `approveBatch`, the AI-upload start/poll/cancel/resume family,
  etc.), raw PDF byte streams for the three PDF downloads. Auth: every
  method calls `SessionManagementOperation.checkValidSessionIfExist` and
  reads `companyId`/`userId` off `HttpSession` attributes
  (`COMPANY_DETAILS`/`USER_DETAILS`) set at browser login.
- `GrnCheckingPersistanceService` / `...ServiceImpl`, the shared business
  logic both this project's new controller and the existing one call into.
  Not touched by this project at all.
- `com.codeverse.stitch.api.controller` package (`POController`,
  `GrnControllerApi`, `LogInManagementControllerAPI`): an existing,
  separate family of controllers built for non-browser clients. Stateless
  per request -- `userName`/`userPwd` (and often `companyId`) travel in
  every request body, checked via
  `CommonsUtil.checkUsernameAndPassword(userName, userPwd)`. No
  OpenAPI/Swagger tooling anywhere in this codebase (checked: no
  springfox/springdoc/openapi dependency in `pom.xml`).

## What this project built

Two new, additive-only Java files (nothing existing was modified):

- **`com.codeverse.stitch.api.controller.GrnCheckingMobileController`**
  (`/api/grncheck/...`, 32 endpoints). Every endpoint delegates to the
  exact same `GrnCheckingPersistanceService` method its `/grncheck/...`
  counterpart calls -- see each operation's `x-legacy-endpoint` in
  `openapi.yaml` for the 1:1 mapping. No business logic was reimplemented.
- **`com.codeverse.stitch.api.request.grncheck.GrnMobileApiRequests`** --
  16 request-body DTOs, one shared `Auth` base
  (`userName`/`userPwd`/`companyId`/`userId`) extended per endpoint.

Plus one genuinely new capability: `GET /api/grncheck/state`, which
bundles header + fabric line items + lots (with nested bales/pieces) + RM
items + RM upload history + vendor details + GRN numbers into one JSON
response -- the same data `GrnCheckingController.fabric()` already
assembles server-side, but which previously only reached the browser
baked into a JSP's `<script>` tags, with no standalone JSON form.

## Auth: two layers, not one

1. **Credential check** (existing pattern, reused as-is): every request
   carries `userName`/`userPwd`; `isAuthenticated()` wraps
   `CommonsUtil.checkUsernameAndPassword`, which returns the *string*
   `"false"` for valid credentials and `"true"` for invalid -- inverted
   from what the name suggests. Handled in exactly one place
   (`isAuthenticated`) so nobody has to remember the inversion elsewhere.
2. **Company-session priming** (new, and the one real bug this project
   found): several existing service methods -- not all, but at least the
   S3-upload path behind every AI-upload endpoint -- don't take
   `companyId` as a plain parameter all the way down. A few frames deep
   (`GrnCheckingPersistanceServiceImpl.uploadToS3` ->
   `TrimsConstructionPersistanceService.getCompanyDetails()` ->
   `CommonsUtil.getCurrentCompany()`) they read `HttpSession`'s
   `COMPANY_DETAILS` attribute directly. A stateless request has no such
   session, so this NPE'd on first real test. Fixed by mirroring this
   codebase's own existing precedent
   (`LogInManagementControllerAPI#logIn` does the exact same thing):
   `primeCompanySession(request, companyId)` looks the company up
   explicitly and stashes it onto that one request's own (otherwise
   session-less) `HttpSession` before delegating -- local to a single
   request, not state a mobile client has to carry between calls. Applied
   to every endpoint uniformly, defensively, since this hidden-read
   pattern could exist elsewhere in the service layer without having been
   hit yet.

**Practical implication for whoever builds the mobile client:** you don't
need to know or care about #2 -- it's fully internal to the server side.
Send credentials + `companyId` on every call as documented, and the
server handles the rest.

## Multipart uploads: one non-obvious constraint

Spring's standard `MultipartFile`/`CommonsMultipartResolver` support is
**disabled project-wide** (`application-dispatcher-servlet.xml`). Both the
existing browser controller and this project's new one parse multipart
requests manually via Apache Commons FileUpload
(`ServletFileUpload`/`DiskFileItemFactory`). This project's parsing helper
(`GrnCheckingMobileController#parseMultipart`) is a deliberate duplicate
of the existing one, not a shared extraction -- touching the existing,
already-tested browser controller to expose it was judged riskier than a
~30-line duplication. If you ever refactor one, refactor both, or extract
a genuinely shared utility at that point.

## Response shapes: reused DTOs, not a new envelope

There is no wrapping/versioned envelope. Every endpoint's response is
either the exact same DTO the legacy service method already returns
(`GrnCheckingFabricLotDTO`, `GrnCheckingUploadResult`,
`GrnCheckingBatchApproveResult`, etc.), or a small ad-hoc
`Map<String,Object>` mirroring what the legacy JSP-facing controller
builds by hand for that same action. See `openapi.yaml`'s `schemas`
section for the exact field lists, and its `x-legacy-endpoint` per
operation to trace back to the real Java method if a field's meaning is
unclear.

**One inconsistency worth knowing, confirmed live rather than assumed:**
`java.util.Date` fields do NOT serialize uniformly. Some
(`GrnCheckingHeaderDTO.checkingDate`) come out as a plain `"yyyy-MM-dd"`
string; others (`createdAt`, `updatedAt`, `GrnCheckingFabricLotDTO.lotDate`)
come out as raw epoch milliseconds, Jackson's default with no format
annotation. Prefer each DTO's own pre-formatted display string
(`lotDateDisplay`, `uploadedAtDisplay`) wherever one exists.

## Business rules: NOT enforced by these endpoints beyond what the
## legacy service layer already enforces

Most of the conditional UI logic in the browser app (what's
locked/disabled, what warning shows when) lives only in
`grnCheckingFabric.jsp`'s JavaScript -- it is *not* re-implemented
server-side by this project, and mobile will not get it "for free" by
calling these endpoints. `mobile-api/business-rules-and-flows.md` is the
exhaustive list of every such rule and every user-facing message, by
feature area, cited to file:line in the existing JSP. Treat it as equally
load-bearing as the API contract itself -- a mobile client that only reads
`openapi.yaml` will functionally work, but will let a user do things
(like submit a bale with zero Checked Mtrs) that the browser UI silently
prevents today.

## Verification performed (2026-09-16, against a local deployment)

- `GET /state`: valid creds (full bundle) and invalid creds (clean 401).
- `POST /list`: correct paginated rows, matching the browser list page.
- `GET /pdf/worksheet`: valid creds (real PDF, visually confirmed
  byte-identical to the browser download) and invalid creds (clean 401
  JSON, not a broken binary stream -- confirms auth runs before PDF
  generation starts).
- `GET /lot/upload/status` with an unknown `jobId`: the real service's
  own graceful error, not an unhandled exception.
- `POST /header/save-meta`: a real write, confirmed via direct MySQL
  read-back, then reverted.
- `POST /lot/upload` and `POST /bale/upload`: a REAL end-to-end AI
  extraction round trip (real file upload -> S3 write -> AI call to the
  local `bhairav-ai-extraction` service -> `ai_extraction_audit` row with
  `extraction_status='OK'` -> correct business-rule reconciliation against
  an already-SUBMITTED bale). This is what surfaced and led to fixing the
  `COMPANY_DETAILS` bug above.
- Existing browser flow re-checked after every redeploy: same PO, same
  page, identical rendering and data -- zero regressions introduced.

**UPDATE (2026-09-17): all 32 endpoints now individually verified live**,
closing the async/resume gap noted below in the previous version of this
document:

- `/bale/add`, `/bale/save-draft`, `/bale/remove-piece`, `/bale/submit`,
  `/bale/unsubmit`, `/bale/approve-batch`, `/bale/move-to-lot`: full real
  lifecycle cycle on live bales, plus a disposable bale through
  approve-batch (real GRN No, real qty-ceiling warning).
- `/rm/save-draft`, `/rm/submit`, `/rm/approve-batch`: real RM header,
  confirmed batch-approve semantics (approves every eligible item under
  the header, reopens as DRAFT, surfaces a real warning).
- `/lot/available-rolls`, `/lot/open` (confirmed idempotent), `/audit-history`.
- `/pdf/grn`, `/pdf/overall`: real valid PDF bytes.
- The full async job family for lot/bale/RM (`*/upload/async` + `/status`
  + `/cancel` + `/resume` where applicable): all tested with real files
  against the real AI service. **`/resume` specifically was proven twice**
  (lot and bale) -- a genuinely fabric-mismatched document correctly
  stopped the job with `fabricMismatchStopped:true` *before writing
  anything* (confirmed via direct DB read), and the subsequent `/resume`
  call correctly continued that exact job and completed the write. This
  was the one scenario the hidden-session-read fix had NOT been
  independently checked against -- it is now proven safe by the same
  `primeCompanySession` fix as every other endpoint.

Two things surfaced during this sweep:

- **Real bug, fixed**: `moveBaleToLot` had no duplicate-Bale-No check
  against the destination lot (only `createManualBale` had one, for the
  same lot). Fixed with the identical one-line pattern; verified both a
  rejected clash and a successful no-clash move.
- **Pre-existing asymmetry, not a bug, now documented**: `totalInMtrs` is
  always recomputed server-side from `pieces[].totalInMtrs`, but
  `checkedMtrs` in `bale/save-draft` is taken literally from the
  request's top-level field -- a mobile client must sum its own
  piece-level checked values itself and send that sum, or the bale-level
  `checkedMtrs` silently reflects whatever was sent instead.

## Where to go next

- Adding a new mobile endpoint: read one existing method in
  `GrnCheckingMobileController` closest in shape to what you're adding
  (JSON-body vs. multipart vs. GET-with-headers), copy its structure, add
  the matching entry to `openapi.yaml`.
- Understanding one specific business rule or user-facing message:
  `mobile-api/business-rules-and-flows.md`, organized by feature area.
- Understanding the AI-upload job/poll or submit/approve flows step by
  step: `mobile-api/sequence-diagrams.md`.
- Wiring up a real mobile client against a real backend: `openapi.yaml`
  is the contract; start with `/state` for the initial screen, then the
  action endpoints for whatever the user does next.
