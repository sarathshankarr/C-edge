# GRN Checking -- Business Rules & Flows

Everything in this document lives ONLY in `grnCheckingList.jsp` /
`grnCheckingFabric.jsp`'s JavaScript today -- the server enforces some of it
as a hard 400 (noted per rule below), but most of it is a client-side
UX/gating rule the web app currently gets "for free" from one shared JS file.
A mobile client has to reimplement each rule listed here deliberately; the
API alone will let you do things the web app never lets you do (e.g. submit
a bale with zero Checked Mtrs), so treat this document as equally load-bearing
as `openapi.yaml`, not optional polish.

Every message below is quoted (or near-verbatim, where the original is built
via string concatenation) from the live JS in `grnCheckingFabric.jsp` /
`grnCheckingList.jsp` -- match the wording where practical so a mobile user
sees the same guidance a web user does.

## The state machine

A Fabric **bale** and an RM **item** each move through
`DRAFT -> SUBMITTED -> APPROVED`, with one asymmetry:

- **Revert to Draft exists ONLY from SUBMITTED, never from APPROVED.** Once a
  bale/item is APPROVED, its inventory cascade has already run and it can
  never be unwound through this UI.
- Fabric's `bale.status` is enforced server-side (submit/approve reject a
  bale that isn't in the right state). RM's is the same, plus RM has a
  **third quasi-state**: a row with `totalReceivedQty <= 0` is locked
  regardless of its real `status` (shown as `NOT RECEIVED`, not its actual
  DRAFT/SUBMITTED/APPROVED value) -- there's nothing real to check yet.
- **`GrnCheckingFabricLotDTO.status` is a stale rollup -- never use it for
  gating.** It is not reliably written back to APPROVED after creation. The
  real state of a lot is the aggregate of its `bales[].status`; every rule
  below that needs to know "is this lot done" derives it from the bale list,
  never from `lot.status` directly.
- An RM item is the one exception to "APPROVED is final": each approve round
  folds `checkedQty` into a running `alreadyCheckedQty` total and the row
  **reopens as DRAFT** afterward, since RM supports partial receiving across
  multiple GRN rounds.

## List page

- "Check GRN" link: only if the user's privileges for this menu include
  `VIEW`.
- "PDF" (overall PO PDF): enabled only if `hasApprovedBatches` is true for
  that row; otherwise a disabled button titled *"No approved GRN batches
  yet"*.

## Lot toolbar

- "AI Doc Upload (Lot)" and "+ Add Bale (Manual)": disabled whenever
  `itemType !== 'FABRIC'`.

## Bale card gating

- **Locked once the bale leaves DRAFT** (`status !== 'DRAFT'`), or the PO
  isn't Fabric -- Bale No, every piece's Total In Mtrs, Damage Mtrs all
  become read-only. This is deliberately stricter than "only lock on
  APPROVED": a SUBMITTED bale has no reachable save path for these fields,
  so leaving them editable after Submit would silently discard edits.
- GRN No link: shown only when `status === 'APPROVED' && bale.grnNo` is set.
- "Revert to Draft" button: shown only when `status === 'SUBMITTED'`
  (Fabric only). Confirm text: *"Revert this bale to Draft? Its fields will
  unlock so you can fix and resubmit it."*
- "Move to Lot" control: shown only when `status === 'DRAFT'`, Fabric type,
  **and** at least one sibling lot exists under the same fabric line item.
  Choosing no destination and clicking Move shows *"Choose a destination lot
  first."* (warning, no request sent). Success: *"Bale moved."* (then the
  page reloads). Failure: server `errorMessage` or *"Move failed."*.
  **Server-side (400)**: rejects if the bale isn't DRAFT, or if the
  destination lot belongs to a different PO line item.
- Per-piece remove ("x" button): only rendered while `status === 'DRAFT'`
  (Fabric only), and never on a bale's last remaining piece row. Confirm
  text: *"Remove Pc No {n} from this bale? This cannot be undone."* Success:
  *"Piece removed."* Failure: server `errorMessage` or *"Could not remove
  piece."*. **Server-side (400)**: rejects if the bale isn't DRAFT, the
  `pcNo` doesn't exist, or it would remove the last piece.
- **Checked Mtrs input is disabled per-piece until that piece's own Total In
  Mtrs is a real positive number** -- re-evaluated live on every keystroke
  of Total In Mtrs, not just at initial render. There is nothing to check
  against a blank/zero total.
- "Select for Approval" checkbox: disabled if already APPROVED, or the PO
  isn't Fabric.
  - Checking it with a summed Checked Mtrs of 0 across all pieces shows
    *"Cannot select this bale for approval: no Checked Mtrs recorded yet."*
    (warning) and un-checks itself -- no request is sent.
  - Otherwise, checking it **force-saves the bale first** (the same request
    a manual Save would send) before actually selecting it, because Approve
    reads from the database, not from what's currently typed on screen. A
    save failure un-checks the box and shows the server's `errorMessage` or
    *"Could not save this bale -- not selected for approval."*
- "Locked from editing" italic hint: shown only when `status === 'SUBMITTED'`
  (Fabric only) -- purely informational, no separate rule behind it beyond
  the field-disabling above.

## Add Bale (Manual)

- Client-side validation before the request is even sent:
  - Blank/whitespace-only Bale No -> *"Bale No is required."* (error)
  - `totalPcs` missing or `< 1` -> *"Total Pcs must be at least 1."* (error)
- Success message: *"Bale added -- fill in Total In Mtrs / Checked Mtrs per
  piece below, then Submit as usual."*
- **Server-side (400)**: rejects if the lot doesn't exist, the header isn't
  FABRIC, Bale No is blank, `totalPcs` isn't positive, or Bale No already
  exists in this lot.

## Submit flow (Fabric)

1. Client collects every currently-DRAFT bale on screen. If there are none:
   *"No draft bales to submit."* (info), stop.
2. **Saves every one of those bales' current on-screen values first**
   (same request Save as Draft sends) -- Submit only ever reads the
   database, it never sees the UI inputs directly.
3. If ANY save fails: *"Save failed for one or more sections -- submit
   cancelled."* (error). Nothing is submitted.
4. Only once every save succeeds does the client call submit for each
   bale. **Partial submit success is allowed per-bale** -- collect each
   bale's own failure message (e.g. server-side *"Cannot submit bale X --
   no Checked Mtrs recorded yet"*), join them with `<br/>`, show as one
   error notice; bales that DID succeed stay submitted (this is NOT rolled
   back).
5. On full success: *"Submitted."* (success), plus any advisory warnings
   (see below) shown individually, then the page reloads -- after 800ms
   normally, or 4000ms if there were warnings (so they're actually
   readable before the reload clears them).
6. **Advisory (non-blocking) warnings** that can ride along on an
   otherwise-successful submit: a piece's Checked Mtrs exceeding its own
   Total In Mtrs, or this bale's Checked Mtrs (summed with every other
   SUBMITTED/APPROVED bale in the same lot) exceeding that lot's received
   qty. Neither blocks the submit. The same two checks run again at
   Approve time, since more bales may have been submitted/approved for the
   same lot in the meantime.

## Submit flow (RM) -- same shape, flat instead of lot/bale

1. Client collects DRAFT rows that are unlocked (`status === 'DRAFT'` and
   not `locked`) AND have a non-empty Checked Qty typed. Empty -> skipped
   silently (not an error). If nothing qualifies: *"No draft RM items with a
   Checked Qty to submit."* (info), stop.
2. Save-then-submit, same partial-failure handling as Fabric. Failure
   messages: *"Save failed for one or more items -- submit cancelled."* /
   *"Submit failed for one or more items."*
3. Success: *"Submitted."*, warnings shown individually, page reloads after
   800ms.

## Approve flow (Fabric)

1. Confirm dialog before sending anything: *"Approve {n} selected bale(s)?
   This will add their checked quantity to inventory, generate one GRN No
   for all of them together, and cannot be undone."*
2. **All-or-nothing, one shared GRN No.** Server-side (400/`success:false`):
   rejects the WHOLE batch (no partial writes) if ANY selected bale is
   already APPROVED, has no Checked Mtrs recorded, or would push its lot's
   total checked qty (accounting for every other bale in this same batch
   against that same lot) past that lot's received qty.
3. On success: *"Approved. GRN No: {grnNo}"*, then any batch-level warnings
   shown individually (same two advisory conditions as Submit, re-checked).
   The affected lots (and their bales) are re-rendered in place from the
   response's `updatedLots` -- no full page reload here, unlike Submit.

## Approve flow (RM)

1. Confirm text (same pattern): *"Approve all checked RM items? This will
   add their checked quantity to inventory, generate one GRN No for all of
   them together, and cannot be undone."*
2. Approves **every** eligible row under the header at once -- there is no
   per-row selection for RM (item level is already the finest granularity).
3. If the response's `updatedItems` comes back empty: *"Nothing eligible to
   approve -- enter a Checked Qty first."* (info) -- this is NOT an error
   status, just nothing to do.
4. Otherwise: *"Approved. GRN No: {grnNo}"* + warnings, table re-rendered
   in place (no reload).

## AI Doc Upload -- shared async job/poll flow (Lot, Bale, RM)

All three share one shape; see `sequence-diagrams.md` for the visual.
Poll every **1.5 seconds** (`LOT_JOB_POLL_INTERVAL_MS = 1500`).

1. Upload starts the job; response carries `jobId`, `totalPages`,
   `completedPages`. If the initial call itself fails
   (`success: false`): show `errorMessage` or *"Extraction failed."*
   (error), stop -- no job to poll.
2. Poll `GET .../upload/status?jobId=...`. While `jobStatus === 'running'`,
   keep polling and update the progress line: *"Extracting, please wait...
   {totalPages} page(s) detected. Extracted {completedPages} out of
   {totalPages} page(s)."* with a Cancel control alongside it.
3. **`jobStatus === 'cancelled'`**: show `errorMessage` or *"Extraction
   cancelled."* (warning). If a partial `lot`/`bale` came back, it's still
   real and should be re-rendered -- pages already processed before the
   cancel took effect are kept, not discarded.
4. **`jobStatus !== 'done'` or `success === false`** (a real failure, or a
   hard stop): if the response still carries a populated `lot`/`bale`,
   render it anyway -- a hard fabric mismatch records an audit row and
   returns a fully populated lot/bale even though `success` is false; the
   "view uploaded docs" history for that entity needs to reflect the
   attempt immediately, not just after a manual refresh.
   - **Lot only** -- if `fabricMismatchStopped` is true: this is a soft,
     overridable stop (per explicit product direction, NOT a hard block).
     Show a confirm dialog: *"This document's fabric ('{extracted}') doesn't
     match this PO line's fabric ('{expected}'). Still do you want to
     process it?"* Accepting calls `/lot/upload/resume` (or
     `/bale/upload/resume`) with the SAME `jobId` -- do not re-upload the
     file; page 1 was already extracted and already paid for. Declining
     does nothing further.
   - Otherwise: show `errorMessage` or *"Extraction failed."* (error).
   - **RM has no fabric-mismatch concept at all** -- an RM invoice has no
     per-line fabric-match gate, so this branch never applies to
     `/rm/upload/*`.
5. **Terminal success** (`jobStatus === 'done' && success === true`):
   - `mismatched === true` -> *"{mismatchMessage}<br/><small>The extracted
     data has still been loaded below -- please verify before
     approving.</small>"* (warning) -- soft PO/vendor mismatch, data is
     still usable.
   - else if `errorMessage` is set -> *"Document read with some issues:
     {errorMessage}"* (warning) -- some pages succeeded, some didn't; still
     non-blocking.
   - else -> *"Document read successfully."* (success).
   - Render the returned `lot`/`bale`/`rmItems` in place.
6. **Cancel** confirm text: *"Cancel this extraction? Pages already read
   will still be kept -- only pages not yet processed will be skipped."*
   Cancelling only flips a flag server-side -- it does not itself stop the
   client's polling loop; the next poll tick picks up `jobStatus="cancelled"`
   on its own once the AI service reports it.

## Upload progress UX (informational, not a hard rule)

Before a job exists to poll, the upload call itself shows real
browser-upload-percentage via the request's own progress event (0-99%),
then a static *"Upload complete -- processing document, please wait..."*
message for the server-side leg (S3 upload + AI service page-count), which
has no progress signal to report. Not required for a mobile client to
replicate exactly, but the two-phase framing (upload % then indeterminate
"processing") is worth keeping so users don't think the app has frozen on
a large multi-page document.
