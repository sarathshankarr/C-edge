# GRN Checking (Fabric) — UI Redesign Design Spec

**Purpose of this document:** a complete, implementation-agnostic content and interaction spec for the GRN Checking edit screen, written to be handed to a design-generation tool (e.g. Stitch) or a designer. It describes every field, every control, every state, and every layout rule that must be honored — not CSS or component code. Whoever/whatever designs from this should be free to choose the actual visual style (color, type, spacing) but must not drop, rename, or hide any field or control listed here, and must follow the structural/behavioral rules called out explicitly.

**Why this exists:** two earlier implementation passes on this screen were built directly (not from a spec) and both had real problems the reviewer only caught by looking at the live result — a table-heavy layout with no visual hierarchy between nesting levels (v1), then a KPI-chip redesign that over-corrected (chips instead of a real label/value structure, the whole header row as an oversized click target, bale cards stacked full-width) (v2). This document exists so the *next* design pass starts from an explicit, complete spec instead of a third guess.

---

## 1. What this screen is

A checker works through one Purchase Order's fabric receipt, roll by roll, bale by bale: confirming how much of each bale was actually checked against what was received, flagging damage, and approving batches of checked bales together. The data has a strict 3-level hierarchy for the main body of the page:

```
Fabric (one PO line item)
  └─ Lot / Roll (one physical roll received against that line item)
       └─ Bale (one bale cut from that roll, checked piece by piece)
            └─ Piece (one numbered piece within the bale)
```

Above that hierarchy sits a page header (PO/vendor/company context), and below it a page-wide sticky action bar.

---

## 2. Page header (top section, above the Fabric/Lot/Bale hierarchy)

Not a table — a plain, spacious block. Two columns on desktop, stacking to one column on narrow screens.

| Field | Notes |
|---|---|
| Company name | Bold, own line |
| Company address | Below name |
| Company phone | Below address |
| **PO No** | Label + value, e.g. "BE/PO/26-27/1847" — sits beside/near the company block, not under it |
| Vendor name | Bold, own line |
| Vendor address | Below name |
| Vendor phone | Below address |
| **Checking Date** | A real date input, editable, defaults to today or the last-saved value |
| **Remarks** | A multi-line free-text box (up to ~1200 characters), editable |
| **GRN No** | Read-only. Can be **more than one value** — a PO can accumulate several GRN numbers across separate approval batches over time. Each one shown is a clickable link (opens/downloads that batch's PDF). Shows "-" when none exist yet. |

There is also a page title directly above this block: "GRN Checking — FABRIC" (or "— RM" for the raw-material variant of this same screen, which additionally shows a "preview only, not yet enabled for saving" banner when active).

---

## 3. Fabric section (repeats once per PO line item)

**Visual requirement:** a real label/value structure, like a form — NOT an HTML table with borders, and NOT chips/pills for these values. Each field is a label (small, muted) with its value beside or below it (per the actual design's grid — this is a layout choice for the designer, the *only* hard rule is: no bordered grid/table look, no pill/chip treatment for these numbers).

**Fields, in this order (grouped exactly like this — the grouping is meaningful, keep it):**

Row/group 1: **Fabric No (Color)** (e.g. "20X20/60X60/52 (GREIGE)") · **Fabric Code** (e.g. "20X20/60X60/52", can be blank) · **Lots** (a count, e.g. "3" — this is the true number of physical rolls received on this PO line, *not* the number of lots someone has already opened for checking)

Row/group 2: **UOM** (e.g. "METER") · **Total Order Qty** · **Total Received Qty**

Row/group 3: **Total Checked Qty** · **Total Damaged Qty** · **Total Balance Qty** (= Received − Checked − Damaged; these three specifically get re-fetched and repainted live after every approval, without a full page reload — the design must have an obvious "this number just updated" affordance is optional, but the numbers themselves must be easy to target/update via a stable element, not baked into a static string)

**Toggle/expand behavior:**
- The whole Fabric section starts **collapsed** by default.
- There is a small disclosure caret/chevron icon.
- **Only that icon is the click target for expand/collapse.** Clicking anywhere else in the header (the fabric name, the code, the qty numbers) must do nothing. This is a hard requirement — the previous redesign made the *entire header row* clickable, which was rejected specifically for this reason.
- Expanding for the first time triggers a data fetch (available rolls to open); the design should account for a brief loading moment here, ideally without a jarring layout shift.

**Inside the expanded Fabric section, before any Lots:**
- A "choose a lot / roll to check" dropdown, populated with rolls of this fabric that haven't been opened yet (each option also shows that roll's received qty).
- An "Add / Open Lot" button next to it, which opens the selected roll as a new Lot section below.

RM (raw material) items do **not** use this Fabric/Lot/Bale section shape at all — see §9's corrected RM description for the actual (flat table) structure. Every action is disabled for RM today (preview-only), pending the customer's final reference format.

---

## 4. Lot section (repeats once per opened roll within a Fabric section)

Nested one level inside its parent Fabric section. **Visually, a Lot must read as "one level in" from its Fabric — same label/value structural language as the Fabric section (not a table, not chips), but a viewer should be able to tell at a glance "this is a child of that Fabric block above it," not just by indentation.**

**Fields:**

Row/group 1: **Lot / Roll No** (e.g. "238K417") · **Lot Date** · **Total In Mtrs** (same number as Received Qty below — shown as its own field to match the Fabric section's own shape, not a mistake, keep it)

Row/group 2: **Received Qty** · **Checked Qty** · **Damaged Qty**

Row/group 3: **Balance Qty** (= Received − Checked − Damaged)

**Toggle/expand behavior:** identical rule to the Fabric section — a caret icon is the *only* click target; starts collapsed; expanding/collapsing must not disturb sibling Lots' own expand state, and must **preserve its own expand state across a data refresh** (e.g. after an AI upload completes, the Lot that was open must still be open, not silently re-collapse).

**Actions inside a Lot section, below its fields, in their own clearly-separated action area (not interleaved with the qty fields above):**
- **"AI Doc Upload (Lot)"** — a file-picker button. Uploading kicks off document extraction (can take several seconds to a couple of minutes for a large multi-page document); while running, a progress indicator ("Extracting… N of M pages") must be visible in this Lot's own area, not page-global.
- **"Add Bale (Manual)"** — opens a small inline form (Bale No text field + Total Pcs number field + Create/Cancel) for adding a bale without any document upload. This is a first-class, equally-supported way of adding a bale, not a fallback — word it as a normal feature, not "for testing" or "when AI is unavailable."
- **"view uploaded docs (N)"** — a link/disclosure showing every document ever uploaded to this Lot (not just the latest), each entry a filename + upload date/time, each a working link to that exact document. Must update immediately (no page reload) the moment a new upload completes or is rejected, including on a fabric-mismatch rejection.

---

## 5. Bale section (repeats once per bale within a Lot)

**This is the part that most needs to change from both prior attempts.** Today, each Bale currently renders as a single block taking the full available width, stacked vertically one after another — wasteful once a Lot has more than a couple of bales, since most of a Bale's content (a handful of piece rows, a few totals) doesn't need the full page width.

**New requirement — a responsive grid of Bale cards:**
- Bales within one Lot lay out in a **grid**, not a single stacked column.
- **Default: 2 bale cards per row** on a normal desktop width.
- **The number of columns must be user-adjustable, from 1 up to 4 or 5**, via a visible control (e.g. a small stepper, a segmented button group showing "1 2 3 4 5", or a slider — designer's choice of control, but it must be an explicit, discoverable, always-visible control, not a hidden setting). This is a *global* control for the whole page (all Lots' bale grids respond together), not per-Lot.
- Changing the column count must **transition smoothly** (an animated reflow, not an instant jump/flash) — cards should visibly resize/reflow, not pop to new positions.
- On a narrow (phone-width) screen, the grid must still collapse to 1 column regardless of the chosen desktop column count — the column control governs desktop/tablet layout, it must never force cards narrower than they can legibly render.
- Each bale card's own internal content (see below) must remain fully legible at whatever column width results — if a design calls for 5 columns, the card's internal layout (e.g. the piece table) may need its own compact treatment (e.g. a smaller/denser table, or a scroll-within-card) rather than becoming unreadably cramped.

**Fields inside one Bale card, in this order:**

1. **Bale No** — an editable text field (editable only while the bale is DRAFT).
2. **Total Pcs** — a plain number, not editable directly (implied by how many piece rows exist).
3. **Status** — one of DRAFT / SUBMITTED / APPROVED, shown as a distinct visual badge (this is exactly the kind of thing a colored pill/status-chip *is* appropriate for — unlike the qty fields above, which should not be chips).
4. **"AI Doc Upload (Bale)"** button — disabled once the bale leaves DRAFT.
5. **"view uploaded docs (N)"** — same behavior as the Lot-level one, scoped to this bale.
6. **GRN No** — only shown once this bale has been approved as part of a batch; a clickable link that opens/downloads that batch's PDF.
7. **"Revert to Draft"** button — only shown while the bale is SUBMITTED (not APPROVED — that's one-way).
8. **Piece table** — one row per piece:
   - **Pc No** (plain number)
   - **Total In Mtrs** — editable number input while DRAFT
   - **Checked Mtrs** — editable number input while DRAFT, but stays disabled/greyed until that same row's Total In Mtrs has a positive value; becomes editable the instant Total In Mtrs is typed (this is a real-time dependency, not just an initial-render check)
   - **Difference** (= Total In Mtrs − Checked Mtrs, plain arithmetic) — read-only, recalculates live as the two inputs above change
   - A small remove ("×") control per row — only shown while DRAFT and only when the bale has more than one piece row (the last remaining row can never be removed)
9. **Bale-level totals**, each with a visible label (not bare numbers relying on position): **Total in Mtrs** (sum of the piece column above) · **Checked** (sum of Checked Mtrs) · **Difference** (sum of Difference) — all three recalculate live as piece inputs change.
10. **Total Damage in Mtrs (manual)** — a single editable number input, entered by hand (never AI-extracted or calculated from anything).
11. **"Select for Approval"** — a checkbox. Disabled once APPROVED, or if there's no Checked Mtrs recorded yet. Checking it adds this bale to a page-level batch-approve selection (see §6).
12. **"Move to Lot"** — only shown while DRAFT, and only when at least one sibling Lot exists under the same Fabric to move it to: a small dropdown of sibling Lots + a "Move to Lot" button.

**Disabled/locked state:** once a bale leaves DRAFT, fields 1 (Bale No), 8 (both piece inputs), 10 (damage input) all become read-only/disabled together — the design should have one consistent "locked" visual treatment applied to a whole card's editable fields at once, not field-by-field inconsistency.

---

## 6. Page-wide sticky action bar (bottom of page, always visible while scrolling)

Buttons, currently, in order: **Save as Draft**, **Submit**, **Approve**, **History**, **Back**. (The "History" button is intentionally hidden on the current test-server build — that's a temporary, unrelated toggle, not part of this redesign; leave a way for it to exist in the bar's layout even if not shown right now.)

- **Save as Draft** — saves every DRAFT bale's current field values across the whole page in one action, plus the header Remarks/Checking Date.
- **Submit** — same save, then submits every DRAFT bale (moves it to SUBMITTED).
- **Approve** — enabled only once at least one bale's "Select for Approval" checkbox (§5.11) is checked; approves every currently-checked bale together as one batch, which all then share one new GRN No.
- **Back** — returns to the GRN Checking list page.

**Approve-selection feedback:** when one or more bales are checked for approval, the user needs to see *which* bales are currently selected and be able to deselect one, without that feedback disrupting this sticky bar's own layout (today this is a small floating widget, separate from the bar itself — keep that separation: whatever shows "N bales selected, here they are" must never push or misalign the Save/Submit/Approve/Back buttons themselves).

**Redesign ask for every button on this page** (sticky bar and per-section alike): the current buttons read as inconsistent/ad hoc (mixed sizes, mixed default Bootstrap coloring with no clear visual hierarchy of "primary action" vs "secondary" vs "destructive/undo"). The new design should establish one consistent button system across the whole page:
- A clear **primary** action style (e.g. Submit, Approve, Create) — the one action most likely to be taken.
- A clear **secondary/neutral** style (e.g. Add Bale (Manual), Move to Lot, Back, Cancel).
- A clear **upload/file-picker** style, visually distinguishable from a normal button since it wraps a hidden file input.
- A clear **destructive or reverting** style (e.g. Revert to Draft, remove-piece "×") that stands apart so it's not confused with a forward-moving action.
- Consistent sizing per context (page-level actions bigger/more prominent than per-piece-row micro-actions like the remove "×").

---

## 7. States and edge cases to design for

- A brand-new Fabric section with **zero Lots opened yet** (just the picker + Add/Open Lot button, nothing below).
- A Lot with **zero Bales yet** (freshly opened, before any upload or manual add).
- A Bale with **only one piece row** (no remove control available on it).
- A Bale in each of the three statuses (DRAFT fully editable / SUBMITTED locked-but-revertible / APPROVED fully locked with a GRN No link).
- An in-progress AI upload (progress indicator, cancelable) at both Lot and Bale level.
- A rejected upload (fabric mismatch) — still must show up immediately in "view uploaded docs," even though nothing else on the page changed.
- Many bales in one Lot (grid must handle more than a full row cleanly — wrapping, not overflow) at every column-count setting (1 through 5).
- RM — the flat table (§9), fields disabled (preview-only), with a visible banner explaining why.
- Narrow/phone width — full single-column stacking everywhere, including the Bale grid regardless of its desktop column setting.

---

## 8. What must NOT change (functional contract)

Every field named in §2–§6 must remain present, visible, and reachable in whatever new design is produced — this is a restyle/restructure, not a scope cut. Nothing here should be removed, merged away, or hidden behind an extra click that doesn't exist today (e.g. Balance Qty must not require opening a submenu to see). If a designer genuinely believes a field is redundant or should be deprioritized, that's a question to bring back to the product owner — not a silent omission.

---

## 9. Sample dataset — for populating an actual mockup

A generator needs real content, not placeholder labels. Use this exact dataset (or one shaped identically) so the generated screen shows every structural case at once: two Fabrics, lots in three different states of use (expanded-with-bales / opened-but-empty / not-yet-opened), and bales covering all three statuses plus the RM preview-only variant.

### Page header

| Field | Value |
|---|---|
| Company | Bhairav Exports Industry Pvt. Ltd. — 875, Karivali Village, Subash Nagar, Bhiwandi, Maharashtra – 421302 — 9324724762 |
| PO No | BE/PO/26-27/1847 |
| Vendor | Kalaimagal Textiles — SF NI 566 KMT Garden Mangalam Road, Puduppalayam Village, Avinashi, 641654 |
| Checking Date | 09/09/2026 |
| Remarks | *(empty text area — show the empty state, not filled)* |
| GRN No | 2094, 2091 *(two separate clickable values — this PO has been through two separate approval batches already)* |

### Fabric 1 — fully worked example (expanded)

**Fabric No (Color):** 20X20/60X60/52 (GREIGE) **Fabric Code:** 20X20/60X60/52 **Lots:** 3
**UOM:** METER **Total Order Qty:** 1000 **Total Received Qty:** 1000
**Total Checked Qty:** 212 **Total Damaged Qty:** 12 **Total Balance Qty:** 776

- **Lot 11366L1** (Lot Date 10/09/2026) — expanded — **Total In Mtrs:** 333 **Received Qty:** 333 **Checked Qty:** 212 **Damaged Qty:** 12 **Balance Qty:** 109 — "view uploaded docs (4)" — 3 bales:

  - **Bale 1221** — status **DRAFT** — Total Pcs 3 — all fields editable — pieces: `(1, 82.4, 82.4, 0)` `(2, 85.0, —, —)` `(3, 83.2, —, —)` *(piece 1 fully checked, pieces 2–3 show Checked Mtrs still blank/disabled-until-Total-entered, illustrating the live-enable rule)* — Total in Mtrs **250.6**, Checked **82.4**, Difference **168.2** — Total Damage in Mtrs: *(blank)* — Select for Approval: unchecked, enabled — Move to Lot: dropdown showing "11366L2, 11366L3", since sibling lots exist under this same Fabric.

  - **Bale 1222** — status **SUBMITTED** — Total Pcs 1 *(single-piece bale — no remove "×" control on its one row, since a bale must always keep at least one)* — piece `(1, 44.0, 44.0, 0)` — all fields locked/read-only — **"Revert to Draft"** button visible — Select for Approval: unchecked, enabled *(SUBMITTED bales remain selectable for the next approval batch)* — no Move to Lot control (SUBMITTED bales can't move).

  - **Bale 1223** — status **APPROVED** — Total Pcs 2 — pieces `(1, 83.0, 82.6, 0.4)` `(2, 81.0, 81.0, 0)` — **GRN No: 2091** shown as a clickable link — Total Damage in Mtrs: **1.5** *(a damage value was recorded on this one)* — Select for Approval: checkbox present but disabled/greyed, unchecked — no Revert to Draft, no Move to Lot (approved is final).

- **Lot 11366L2** (Lot Date 10/09/2026) — opened, but **collapsed**, and currently has **zero bales** — Received Qty 334, Checked/Damaged/Balance all blank ("–") since nothing's been checked yet — this is the "just opened, empty" state: only the AI Doc Upload / Add Bale (Manual) actions are visible, no bale cards below them yet.

- **Lot 11366L3** — **not yet opened at all** — does not appear as its own section; it only exists as an option in the "choose a lot / roll to check" dropdown at the Fabric level (this is the "unopened lot" case — the Fabric's own Lots count of 3 already includes it, per §3's rule that the count is the true received-roll count, not the opened-lot count).

### RM (raw material) — corrected: a flat table, not the Fabric/Lot/Bale hierarchy

**This supersedes an earlier assumption in this document.** RM does **not** share the nested Fabric → Lot → Bale structure — that only applies to Fabric. RM has no lot/roll concept and no bale-by-bale checking; it is **one row per RM item**, based directly on the customer's own reference layout (a spreadsheet mockup: "Bhairav – GRN Checking UI" → "GRN Checking – RM" tab).

**Important caveat, state this to whoever builds from this spec:** the customer has **not yet supplied their final reference document** for the RM checking format. The tester's explicit instruction was: build this general structure and logic now, using the shape below, and adjust once the real reference document arrives. Design this section accordingly — functional and reasonably polished, but not over-invested in pixel-perfect detail that a real spec might immediately change. Do not invent additional RM-specific fields, business rules, or terminology beyond what's listed here.

**Page structure for RM:**
- The same page header block as Fabric (§2 — Company/PO/Vendor/Checking Date/Remarks/GRN No) is reused as-is; RM and Fabric are two views of the same PO-level header.
- Below the header: a **plain flat data table**, ordinary rows and columns (like a normal list table elsewhere in this app — e.g. the GRN Checking list page's own table) — not a label/value block, not a nested hierarchy. One row per RM item.
- **Columns, in this order** (exact names from the customer's own reference sheet): **RM Name (Color)** · **UOM** · **Order Qty** · **Received Qty** · **Checked Qty** · **Already Checked Qty** (a running total already checked in a previous checking session/batch, before this one) · **Damage Qty** · **Difference** (= Received − Checked − Already Checked − Damage, plain arithmetic) · **AI Doc Upload** (one upload control per row).
- **Upload/extraction behavior:** uploading a document via that row's AI Doc Upload control extracts data from it and **auto-fills that row's Checked Qty** field (the same document-in, quantity-out pattern as Fabric's bale-level upload, just landing on one row instead of a piece table). The checker can review/adjust the extracted value before saving.
- **Save/approve behavior:** once confirmed, saving/submitting/approving an RM row must use **the same backend logic the legacy "GRN Approve" screen already uses for RM-type items** — this is a parity requirement, not a new business rule to invent. The button row (Save as Draft / Submit / Approve Checking / Back) is the same as Fabric's, reusing the same labels shown in the customer's reference sheet (note: their sheet says "Approve Checking," not just "Approve" — use that exact label for RM).
- Today, in the live app, RM is still preview-only (saving/submitting/approving disabled) pending this real spec — keep a visible banner stating that, but design the table itself as if it will go live once RM is confirmed, since that switch-on is imminent, not speculative.

---

## 10. Conditional rendering — explicit state matrix

Design each of these as its own distinct visual state, not just a color swap on one template — a viewer should be able to tell a bale's status from a glance without reading the text badge.

| State | Bale No field | Piece inputs | Damage input | Status badge | GRN No | Revert to Draft | Select for Approval | Move to Lot |
|---|---|---|---|---|---|---|---|---|
| **DRAFT** | editable | editable (Checked Mtrs per-row locked until that row's Total In Mtrs > 0) | editable | "DRAFT" | not shown | not shown | enabled, unchecked | shown *if* a sibling lot exists |
| **DRAFT, single piece** | editable | editable, but the one row has **no remove control** | editable | "DRAFT" | not shown | not shown | enabled, unchecked | shown *if* a sibling lot exists |
| **SUBMITTED** | locked | locked | locked | "SUBMITTED" | not shown | **shown** | enabled, unchecked (still selectable for approval) | not shown |
| **APPROVED** | locked | locked | locked (but may show a previously-entered value, e.g. 1.5) | "APPROVED" | **shown**, clickable | not shown | shown but disabled, unchecked | not shown |
| **Select for Approval, checked** | *(whatever its own status dictates above)* | — | — | — | — | — | **checked** — and this bale now also appears in the page-wide "selected for approval" floating summary (see §6) | — |

RM has its own, separate row-level states (it has no bales, so the table above doesn't apply): a row with **no upload yet** (Checked Qty blank/editable by hand), a row **mid-extraction** (upload in progress, same kind of progress indicator as Fabric's), a row with **Checked Qty auto-filled from a completed extraction** (editable, so the checker can correct it), and the current **preview-only** state (every field/control in every row locked, with the explanatory banner from §9).

Also design the **Fabric-section-level** and **Lot-section-level** collapsed vs. expanded states as distinct, deliberate states (not just "hidden div appears") — collapsed should still show every field listed in §3/§4 (a checker scans qty numbers *without* expanding), only the Lots-list / Bales-grid underneath is what expand/collapse actually hides.

---

## 11. Responsive behavior — concrete breakpoints

- **Desktop (≥ ~1024px):** full multi-column layout everywhere; Bale grid respects whatever column count (1–5) is currently selected.
- **Tablet (~600–1024px):** page header and Fabric/Lot label/value groups may reflow to fewer columns per row (e.g. 2 instead of 3) but keep the same fields; Bale grid caps at 2–3 columns regardless of the desktop setting, to keep each card legible.
- **Phone (< ~600px):** everything single-column, full width; Bale grid forced to 1 column regardless of any desktop setting; the column-count control itself may hide or become a no-op at this width (state this explicitly in whatever is generated, don't leave it ambiguous).
- At every width, the page-wide sticky action bar (§6) remains reachable without excessive scrolling, and never overlaps content underneath it.

---

## 12. Ask: generate multiple versions

Please produce **2–3 distinct visual directions** from this same spec and dataset (e.g. varying: how strongly Fabric vs. Lot vs. Bale are visually differentiated; card-based vs. more compact list-based Bale grid; how the column-count control is presented) rather than a single take — this is explicitly meant to be a comparison round, not a final pick. Every version must still satisfy every hard rule in §3, §4, §5, and §10 (icon-only toggle, label/value not table/not chips, the configurable 1–5 column Bale grid with smooth transition, and the full conditional state matrix) — those are fixed requirements, not part of what's being explored.
