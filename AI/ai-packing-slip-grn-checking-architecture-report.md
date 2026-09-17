# AI Packing-Slip / GRN-Checking Feature — Architecture Report

**Date:** 2026-09-07
**Scope:** New AI document-extraction feature (vendor packing slip + Bhairav Grey Checking Report → GRN comparison), built as a separate service alongside the existing `stitch`/e-fabric ERP, sharing its MySQL instance.

Grounded in: the actual WhatsApp requirement thread ("Bhairav - ERP Development"), the vendor tax invoice / vendor packing slip / Bhairav Grey Checking Report samples reviewed, the PO-Receive screenshot, and two codebase-mapping passes over the live `stitch` repo (tech stack, and the full GRN → Approval → Batch-Creation code path).

---

## 1. What the client actually asked for

New flow: **GRN → AI Packing Slip / Checking → GRN Approval**. Two documents get captured by phone camera at this new step:

| Document | Captured data | What was found in the sample files |
|---|---|---|
| **Vendor Packing Slip** | Bale No. (= Roll/Lot No, confirmed by client), No. of Pcs, meters per piece, total meters/bale | Small perforated per-bale ticket: `Bale No.` (e.g. `40670`), `Quality` (fabric construction, e.g. `20X20/60X60/52`), `No. of Pcs` (e.g. `07`), 15 numbered rows (one per piece's meterage), `TOTAL Mtrs` printed at the bottom = vendor-declared total. |
| **Bhairav's own Checking Report** | Actual received qty, bale-wise PCS/meters, damage | Handwritten form: header (Challan No/Date, Lot No, Goods Recd Date, Gray/Finished Width, Quality, Av. Weight), then a **continuous** Sr.No 1–100 grid (not restarted per bale) with `Party's Mtrs` (vendor-declared, transcribed) vs `Checked Mtrs` (actual) vs `Finished Mtrs`, `Remarks`, then a `Declared / Actual / Shortage` summary for **Pcs and Mtrs at the lot level**. |
| **Vendor Tax Invoice** | PO/vendor cross-reference | Header page: bale-number **ranges** (e.g. "BALE NOS: 50136 TO 50325 = 190, 40665 TO 40722 = 58"), HSN, total metre, rate/metre — the invoice-level reconciliation anchor, not bale-level detail. |

**A structural mismatch to flag back to the client before build starts:** the vendor packing slip groups pieces *by bale* (1–15 per slip); Bhairav's Checking Report grid is a *flat, continuous* serial 1–100 across the whole lot, with only one Declared/Actual/Shortage total for the entire lot — not per bale. The client's requirement explicitly asks for "**bale-wise** and lot-wise differences." As-is, there's no reliable way to reconstruct which of the 100 continuous rows belong to which bale unless (a) Bhairav's checking clerks start writing the report in bale groups too (a process change, not just a tech change), or (b) bale boundaries are inferred from the pieces-per-bale count on the vendor slip (fragile — that count isn't guaranteed constant, and any miscount cascades). **This needs a decision from the client, not an engineering workaround.**

Also worth stating honestly: this is genuinely hard OCR. The Checking Report is handwritten with cross-outs, arrows redirecting values between cells, and abbreviations ("TP" etc.). Even a strong vision-LLM will not read this at 100% — which is exactly why the client's own ask for a "checking screen" (human verifies before GRN Approval) is the right instinct. Frame this to the client as **"AI-assisted, human-confirmed,"** not "fully automatic."

---

## 2. Current codebase — what's actually there

**Tech stack (confirmed, `stitch`/e-fabric project):** Java 8, Spring MVC 4.3.6 (2016-era, XML-configured, no Java-config/Boot), Hibernate 4.3.6 mixed with raw SQL, MySQL 8 driver, WAR deployed to Tomcat.

- No connection pool wired — `DriverManagerDataSource`, despite HikariCP sitting unused in the pom.
- No security filter chain at all — the one `AuthenticationInterceptor` only covers `/loginMgmt/**` and `/ordersMgmt/**`; every other endpoint (including all GRN/JSON APIs) checks session manually per-method, and JSON APIs authenticate via **username/password embedded in the request body**, not a token.
- `application.properties` currently has **live plaintext credentials** (DB password, AWS keys, third-party API tokens) checked into the repo.
- One 54,890-line `CommonsUtil.java` god-class; three overlapping service-layer conventions (`business/`, `service/`, `persistance/service/`); inconsistent naming across ~180 controllers.
- File upload is inconsistent: raw `commons-fileupload` in some places (Spring's own multipart resolver bean is defined but commented out), an existing-but-dormant `SaveGrnPdf` attachment endpoint on `po_master.grnpdf` — the closest precedent for "attach a scan to a GRN" (its UI button is currently commented out in the JSP).

This confirms a separate service is the right call — not because Java 8 can't do AI, but because this codebase's structural debt (no pooling discipline, no real auth layer, no async job infrastructure, high regression risk in the 8000+ line `TrimsConstructionController`) makes it the wrong place to build anything new and fast-moving.

**GRN/PO-Receive flow (exact mechanics, for the new screen's integration point):**

- Everything lives in `TrimsConstructionController.java`: GRN entry (`/viewPOReceive`, `poreceiveviewfabric.jsp`) and GRN Approval (`/grnApprove`) are **the same controller/JSP**, branching on `menuId` (5 = entry, 412 = approval) and a `company.grn_app` flag.
- Roll/Lot-level data lands in **`po_fabric_receive_items`** (composite key `lineitemid`+`roll_no`), with an `approvePO` flag (0→1 on approval) and a generated `grn_uniqno`.
- **Roll No is free-text, manually typed** (max 25 chars, client-side duplicate check only) — no server-side auto-generation despite the tidy-looking `191M1178` pattern seen in the screenshot. Vendor Bale No ↔ Bhairav Roll No is **not currently a formal mapping anywhere** — it's whatever the data-entry operator types.
- Approval is what makes inventory usable: `fabric_master_lineitems` (read by Batch Creation) and `trimconstruction_master.avail_qty` are only populated when a line is approved (`type=App`). Gating "no approval until AI-checking is confirmed" has exactly one clean insertion point here.
- Menu/role access (`menu_master_tbl` + `role_menu_map`) is fully config-table-driven — adding a new "AI Packing Slip / Checking" screen as a new `menu_id` between 5 and 412 requires **zero code changes** to grant access, just new rows.

---

## 3. Proposed integration architecture

**New screen, minimally invasive to the legacy app:**

1. New `menu_master_tbl` row + `role_menu_map` entries (config only) for "AI Packing Slip / Checking," sitting between menuId 5 and 412.
2. New controller + JSP in the legacy app, following the existing `SessionManagementOperation.checkValidSessionIfExist(...)` + privilege-check pattern for consistency with every other screen.
3. **One guard** added to the existing `poFabricReceiveUpdate?type=App` path / menuId-412 branch: block approval unless a confirmed AI-comparison record exists for that PO line/roll. A single, targeted check into existing logic — not a rewrite of the entangled menuId 5/412 controller.
4. New tables (roll/lot + bale + comparison data), read directly by the legacy JSP via plain SQL — consistent with how the legacy app already talks to its DB.

**Where the new AI service runs — decided:** customer's dedicated server (Option A), with the AI orchestration logic (prompts, model calls, comparison algorithm) kept in a vendor-hosted gateway rather than embedded locally — see §4.

**Tech stack — decided:** Python + FastAPI.

---

## 4. New service — concrete setup

**Key design principle:** deploying the FastAPI wrapper on customer infra doesn't mean the extraction logic has to live there too. The service never holds a vision-provider API key locally — it calls a small gateway hosted by Codeverse (`ai-gateway.codeverse.in`) which does the actual model call, prompt orchestration, and cost/rate control. The thing running on the customer's server is a thin, replaceable client; the actual IP stays under Codeverse's control regardless of what happens to the box. **This is the single highest-leverage control in the whole design.**

### Repo scaffold

```
bhairav-ai-extraction/
  app/
    main.py                    # FastAPI app, startup license check
    core/
      config.py                # env-driven settings, secrets injected at runtime (not committed)
      security.py              # verifies short-lived tokens issued by the legacy app
      license.py               # offline signed-license verification (see §6 — supersedes earlier heartbeat design)
      crypto.py                # per-table DB encryption key handling, gated by license validity
    db/
      session.py               # SQLAlchemy + PyMySQL, least-privilege MySQL user
      models.py                # ai_* tables only
    routers/
      upload.py                # POST /extraction/upload  (packing slip / checking report image)
      extraction.py            # GET /extraction/{job_id}, POST /extraction/{job_id}/confirm
      health.py                # /healthz, also surfaces license status
    services/
      vision_gateway_client.py # calls the hosted gateway — no provider keys live here
      comparison.py            # bale/lot vendor-vs-actual diff logic
    workers/
      job_queue.py             # DB-backed async processing (Celery/RQ only if volume needs it)
  alembic/                     # migrations, scoped to ai_* tables
  Dockerfile                   # multi-stage; only the built image ships, never this source
  docker-compose.customer.yml  # what the customer actually runs: image ref + env, nothing else
  pyproject.toml
```

**What ships to the customer:** a `docker pull` from a private registry with pull-only, revocable credentials, plus a compose file referencing the image. No Dockerfile, no source tree, no build pipeline access — a real change from how the legacy app was presumably handed over historically; state this explicitly to the client as a term of this specific module.

### Database

New MySQL user (same instance, same shared schema) scoped to least privilege:
- Full CRUD only on new tables: `ai_vendor_packing_slip`, `ai_vendor_packing_slip_bale`, `ai_checking_report`, `ai_checking_report_line`, `ai_grn_bale_comparison`.
- `SELECT`-only on reference tables needed for context: `po_master`, `po_master_lineitems`, `po_fabric_receive_items`, `fabric_master_lineitems`, vendor/item masters.
- Nothing on `user_login`, `role_menu_map`, financial/costing tables.

### Legacy-app changes (Java side, small and targeted)

1. New `menu_master_tbl` row + `role_menu_map` entries between menuId 5 and 412 (config-only, no redeploy).
2. New controller + JSP for the checking screen, using the existing `SessionManagementOperation.checkValidSessionIfExist(...)` pattern.
3. **Auth bridge:** the legacy controller mints a short-lived signed token (RS256 preferred — only the public key needs to live on the legacy side) carrying user id, company id, po_number, and roll/lineitem id, expiry ~5 min, passed to the FastAPI service on every call. Deliberately does **not** copy the legacy app's existing "username+password in the JSON body" pattern.
4. **One guard** on `poFabricReceiveUpdate?type=App` (menuId 412): block approval unless a confirmed `ai_grn_comparison_result` row exists for that PO line/roll.

---

## 5. Open questions (client-facing, need resolution before generalizing)

- Bale-wise vs continuous-serial mismatch in the Checking Report (§1) — client decision needed.
- Which vision/LLM provider is approved to receive these documents — invoices carry GSTIN, bank IFSC, vendor pricing; a data-handling question, not just a technical one.
- Vendor packing-slip layout varies by vendor (more samples expected) — use a template-agnostic vision-extraction approach over per-vendor fixed OCR templates from day one.
- Hard-block GRN Approval on a mismatch, or warn-and-allow-with-override? Not yet specified.
- Rough volume (GRNs/images per day) — decides whether simple polling is enough or a real job queue is warranted.
- Who bears the per-page AI API cost, and is it priced into this engagement?
- Get the subscription/kill-switch/no-source-escrow terms in front of a lawyer before shipping any lock mechanism — legal review, parallel track, doesn't block R&D.

---

## 6. Access-control design — offline signed license key (current design, supersedes earlier heartbeat proposal)

An earlier draft of this design used a live "phone-home" license server: a background task calling a Codeverse-hosted endpoint every ~30 minutes for a short-TTL signed JWT, degrading the service if validation lapsed. **That approach was replaced** at the client's explicit request for something simpler: no separate always-on license service, no network dependency — a single offline signed key with an expiry, manually renewed by logging into the server.

### Design

- **License artifact:** a compact signed token (JWT, RS256 or Ed25519) containing `customer_id`, `issued_at`, `expires_at`, `feature scope`, `version`. No secret payload needs to be *confidential*, only *authentic and tamper-proof* — so signing (not encryption) is the core requirement.
- **Key custody:** Codeverse holds the **private** signing key offline (never touches customer infrastructure — e.g. kept in a password manager or an offline signing script run locally by Codeverse). The deployed service ships with only the **public** verification key baked in. Nobody without the private key — including the customer — can mint a valid license token. This is the same asymmetric-crypto guarantee used by GitLab EE, Atlassian Data Center, Elastic, and VMware for their own on-prem license files; it is an industry-standard pattern, not a novel one.
- **Storage:** the license token is stored either as a small file (e.g. `/opt/bhairav-ai/license.lic`) or as a single row in the new service's own DB table — either works; a file is simplest operationally since renewal is "replace one file," with no DB write access required to fix it.
- **Verification, no network call:** on startup and on a periodic **local-only** timer (e.g. every few minutes, purely in-process, no outbound call to anywhere), the service re-parses the token, verifies its signature against the embedded public key, and checks `now() < expires_at`. This works even if the customer's server has zero outbound internet access — a real plus, since that network policy is unknown for their environment.
- **Enforcement, scoped correctly:**
  - **All API routes** (not just AI-specific ones) pass through one dependency/middleware that checks "is there a currently-valid license loaded?" before the handler runs. Invalid/expired → `423 Locked` uniformly.
  - **The new service's own database tables** (`ai_*` tables only — **not** the legacy ERP's existing tables, which are the customer's pre-existing, already-delivered data and out of scope for any lock) use MySQL's native per-table InnoDB encryption (`ENCRYPTION='Y'`). The table encryption key is only loaded into the running process's memory while the license is currently valid; on expiry, the service purges that key from memory and refuses to open the encrypted tables again until a valid license is reloaded. This makes the DB-side lock a real technical barrier tied to the same license state, not merely a soft "if" check in application code.
- **Renewal (manual, exactly as requested):** Codeverse generates a new signed token offline (a small CLI script, seconds of work) with an extended `expires_at` and sends it to whoever has server access; that person replaces the license file (or the one DB row); the service picks it up on its next local check — no restart required if the check-and-reload loop is built to re-read periodically.

### Trade-off to set consciously

This model **cannot force an instant remote lockout** the moment Codeverse decides to act — unlike a live heartbeat design, there is no switch to flip from the outside. The lock only takes effect when the *current* key's timestamp naturally passes. The one dial that controls responsiveness is **how short the validity window is set** — e.g. issuing 30–90 day keys, renewed as a routine part of the support/subscription relationship, rather than a multi-year key. Shorter windows mean more leverage and more frequent (but trivial, seconds-long) renewal work; that is the direct and only trade for not running a live service, and it should be a deliberate choice, not a default.

### Honest limits (same caveat as always, not unique to this design)

If someone extracts the running service's code and embedded public key from the container (realistic for a Python service unless natively compiled — see the ghosting analysis below), a sufficiently motivated, technically resourced actor could in principle patch out the expiry check in the application code itself. This is the same limit every offline-license-file scheme in the industry accepts — it is not solved by any purely local software design, offline or heartbeat-based. What actually holds this together in practice: (1) the DB-side encryption key requirement means patching the check alone doesn't restore access to already-encrypted `ai_*` data without also reconstructing the encryption key material, which was never present in the codebase to begin with; (2) doing this is a blatant, provable breach of contract, not an accident; (3) most customers are not going to reverse-engineer cryptography to steal a B2B tool — the deterrent is calibrated to realistic risk, not nation-state adversaries.

---

## 7. Ghosting scenario — what a customer left holding the code + DB can and can't do

**The existing legacy ERP (Java app + core DB): unaffected.** It was already fully delivered, was never designed with any lock, and this project doesn't retroactively add one. If ghosted, the entire GRN/PO/batch/inventory system keeps running exactly as before. Whatever control is built here only covers the *new AI module* — not leverage over the ERP as a whole. Worth being explicit about this with the CEO.

**Can they view the new module's data?** Yes, essentially all of it, and that's mostly correct. They have root on their own MySQL instance — application-layer controls don't restrict a raw `SELECT` from the DB admin's own client, and the encryption scope described in §6 deliberately only covers the AI module's own tables, not the customer's legitimate confirmed GRN/checking records once written — those remain visible forever by design, because they are the customer's own business data.

**Can they make it work again after the key expires and they've cut off contact?**
1. The license check disables the service once the current key's timestamp passes — this doesn't require their cooperation.
2. To restore function themselves, they would need to both patch out the expiry check in the code (realistic to attempt, since a Python container's source is not meaningfully hidden without native compilation) **and** separately reconstruct working access to the encrypted `ai_*` tables (the encryption key for those was never in the codebase) **and** rebuild a working extraction pipeline against their own AI provider account, since no provider keys or prompts ever lived on their box.
3. That last part is the real barrier: with the actual extraction/comparison logic kept in the Codeverse-hosted gateway, what ships to the customer is thin plumbing. Rebuilding an equivalent tool means redoing real engineering work — prompts, comparison logic, the handwriting/multi-vendor-format edge cases — not flipping a switch.

**Bottom line:** this doesn't make the feature technically impossible to reproduce for a sufficiently resourced, motivated, contract-breaching adversary — it makes it slow, expensive, and a clear, provable breach rather than a trivial inconvenience. That gap in cost and time, backed by contract terms making circumvention an explicit remedied breach, is the actual leverage being bought here — not an unbreakable wall. No purely local software control can honestly claim more than that.

---

## 8a. Phase 1 status: built and proven end-to-end (2026-09-08)

All three components from §9 are implemented and independently verified. Nothing here touches the AI feature itself (still not started, requirement not landed) — this is purely the licensing/control core, built first per the plan at `~/.claude/plans/jaunty-painting-grove.md`.

**`codeverse-license-issuer`** (sibling repo, vendor-only, never shipped) — RSA-4096 keypair generation, `issue` CLI, and a forgery-test corpus (valid, expired, not-yet-valid, wrong-keypair, `alg:none`, HS256-key-confusion, bit-flipped, oversized, truncated, missing-segment). 11/11 tests pass. This exact corpus is what both app-side verifiers below were tested against — cross-language agreement on it is the actual proof, not either language's tests in isolation.

**e-fabric (Java)** — new `com.codeverse.stitch.licensing` package: hand-rolled `JwtRs256Verifier` (no new runtime Maven dependency — avoids the pom's Jackson-2.7.3/no-dependencyManagement conflict risk), `LicenseGate` (60s local recheck timer, anti-rollback via persisted `seq` watermark, fail-closed throughout), `LicenseEnforcementFilter` (global `/*` filter, writes 423 directly, REQUEST dispatcher only), `LicenseStartupListener`, and `LicensedTaskScheduler` (replaces the plain `taskScheduler` bean — covers today's one live job, `cedgetoportal`, and any of the currently-dormant `@Scheduled`/Quartz jobs for free if reactivated later). 22/22 tests pass, including a real (not simulated) 121-second end-to-end run on an embedded Jetty server proving revocation and recovery both happen on the actual 60-second background timer, with no restart. Full WAR still builds clean with all changes packaged in.

**`bhairav-ai-extraction` (Python/FastAPI, sibling repo)** — mirrors the Java rules exactly (`app/licensing/verifier.py`, `gate.py`, `middleware.py`), `/healthz` always reachable, `/ping` gated. 22/22 tests pass against the identical fixture corpus, same accept/reject decisions as Java.

**DB layer** (`e-fabric/ops/mysql-license-gate/`, proven against a disposable local MySQL 8.0.46 container, never the shared dev instance or any `bhairav*` schema) — used `AES_ENCRYPT`/`AES_DECRYPT` instead of the originally-proposed `keyring_file`/InnoDB TDE, because `application.properties` shows strong evidence of RDS-hosted customer deployments, and RDS does not expose plugin installation at all; this approach proves the identical "invalid license ⇒ unreadable data" chain and works identically on RDS and self-managed MySQL. Two dedicated least-privileged accounts (`efabric_licensed_reader`, `license_admin`) — **never root**, since the real app currently connects as `root@localhost` with a global grant, against which privilege revocation is a no-op (confirmed and deliberately worked around, not overlooked). `gate_daemon.py` re-verifies the real license every 60s and updates a `license_state` table; a native MySQL `EVENT` (no plugin, 1-minute interval) independently grants/revokes the reader account's access. Verified live: valid license → reader can `SELECT` and `AES_DECRYPT` correctly with the right key (wrong key → `NULL`); expired license → reader's grant is revoked by the real Event Scheduler tick and further reads are denied; `root`'s access is unaffected throughout, confirming the mechanism's actual scope. Native `keyring_file` TDE (already active on this dev machine via a hand-edited LaunchDaemon plist — undocumented, machine-local, not in git) remains documented as a stronger optional add-on for confirmed self-managed-only deployments, not what's implemented here.

**Known, deliberately deferred items** (not silently dropped): the real app's `dataSource` still connects as `root` — this DB layer means nothing until that's changed on the real schema, a separate larger effort. ProGuard/Nuitka bytecode hardening, retrofitting encryption onto any existing populated table, and private-key custody/HSM policy are all still open, per §9's original scope note.

## 8. Next steps

1. Legal review of the license-expiry/lock mechanism and no-source-escrow terms — parallel track, doesn't block prototyping.
2. Confirm the vision/LLM provider and get sign-off on sending vendor invoices (GSTIN, bank IFSC, pricing) through it.
3. Stand up the AI gateway proxy first — almost everything else depends on it existing.
4. Prototype extraction against the real Sri Amman Tex samples already reviewed before generalizing to other vendors' formats.
5. Take the bale-wise-vs-continuous-serial mismatch in the Checking Report (§1) back to the client — a process decision, not something to engineer around silently.

---

## 9. Final decision (2026-09-08) — whole-stack subscription lock, supersedes §6 scope

**Business decision, made explicitly and knowingly after the §6/§7 caution above:** the entire deployment — the existing legacy e-fabric/`stitch` ERP, the new AI service, and the shared MySQL database — is delivered to the customer as a **time-boxed subscription/lending arrangement**, not owned code. Within a licensed period (e.g. 30 days) everything functions; on expiry, the entire codebase and database must stop functioning for any user, authorized or not, until Codeverse issues a renewal. Only Codeverse (holding the private signing key) can produce a valid renewal.

### Architecture: one signed token, verified independently by three components

```
                    Codeverse (offline) — RSA-4096 PRIVATE key
                                   │  signs license.jwt
                                   ▼
                    /etc/codeverse/license.jwt  (single source of truth,
                                                   lives on customer's server)
                    ┌───────────┼───────────┬───────────────┐
                    ▼           ▼           ▼               ▼
            Java monolith   Python AI   Keyring-provider   MySQL Event
            (global filter  service     daemon (releases   Scheduler job
            + startup gate) (middleware) DB master key)     (active revoke)
```

Every component independently verifies the same token with the same hardcoded public key. None trusts another component's say-so — compromising one does not unlock the rest.

### Token

- **Format:** JWS (signed, not encrypted — expiry/customer-id need tamper-proofing, not confidentiality), algorithm **RS256**, 4096-bit RSA key pair. Chosen for cross-language compatibility: Java 8's built-in `java.security.Signature` verifies it with no extra dependencies; Python's `PyJWT`/`cryptography` does the same natively.
- **Claims:** `customer_id`, `iat`, `nbf`, `exp`, `features`, `seq` (strictly increasing sequence number, used for anti-rollback).
- **Critical implementation rule:** the verifier must hardcode that it only accepts `alg: RS256` and must never read the algorithm from the token itself. Trusting the token's own `alg` header is the single most common real-world way JWT-based license checks get bypassed (`alg: none`, or re-signing as HS256 using the necessarily-public verification key as an HMAC secret).
- **The public key is baked into each component at build time** as a compiled-in constant, never an external, customer-editable file — otherwise an attacker can swap in their own key pair and self-sign licenses indefinitely.

### Enforcement — Java legacy monolith

- **Startup gate:** a `ContextRefreshedEvent` listener runs before the DataSource/Hibernate `SessionFactory` become usable and verifies the token. On failure, does **not** crash Tomcat (a fully dead process gives zero diagnostic surface for legitimate support issues) — instead every downstream bean is wired to a locked state.
- **Request-path gate:** a Servlet `Filter` with `<url-pattern>/*</url-pattern>` in `web.xml` — the one true choke point, catching JSPs served directly under `webapp/views/` as well as every controller. Invalid/expired → `423 Locked` for everything, including login.

### Enforcement — Python AI service

Same two-layer pattern: a startup check before the app accepts traffic, plus a FastAPI dependency injected into every router so a future endpoint can't accidentally be added without the check.

### Enforcement — database (the layer that makes "even with full DB access, it's dead" actually true)

App-level checks alone don't achieve this — a raw `mysql` client or a copied `.ibd` file bypasses the application entirely. Two layers, covering two different attack scenarios:

- **Layer A — TDE at rest** (for "they copied the files"): MySQL InnoDB tablespace encryption (`ENCRYPTION='Y'`), master key held by a small **local keyring-provider daemon** (not a hosted service — another local process on the same box). At MySQL startup, this daemon checks the same license token and only then releases the master key into MySQL's keyring interface. Standard mechanism (same category as SQL Server/Oracle/MySQL TDE); retrofitting onto an already-populated live schema is a real migration project (tablespace rewrite, maintenance window), not a config flip.
- **Layer B — active revocation** (for "the instance was already running and unlocked before expiry"): TDE only re-checks the key at MySQL *startup*, so a continuously running server keeps serving past expiry until restarted. Fix: a native **MySQL Event Scheduler** job (built-in, no plugin needed) running every few minutes, reading a flag table the keyring daemon keeps in sync, and on invalid license, running `REVOKE ALL PRIVILEGES` on the application DB users (or flipping the schema read-only, or killing connections).
- These are not redundant: Layer A is what makes an *exfiltrated copy* of the database genuinely unreadable; Layer B is what stops the *original, still-running* instance from outliving its license without a restart.

### Anti-clock-tamper (system-wide, one shared state)

- A monotonically increasing `seq`/timestamp record, persisted alongside the license state and checked by all three components. If the observed clock ever reads earlier than the last recorded value beyond normal drift tolerance, that's treated as tamper detected — immediate lock requiring a fresh token to clear.
- Opportunistic corroboration against a public NTP pool or an HTTPS `Date:` header when outbound internet is available, in place of trusting the local clock alone.

### Renewal

Vendor generates a new signed token offline (seconds, via a CLI script using the private key) with an extended `exp` and incremented `seq`. Someone with server access installs the replacement file at `/etc/codeverse/license.jwt` but cannot create one themselves. All three components pick it up on their next periodic local check.

### Hardening against code tampering

- Java: run the compiled classes through ProGuard (or similar), targeted at the license-check and crypto classes.
- Python: compile sensitive modules natively with Nuitka rather than shipping interpretable `.py` files.
- Cross-check the checks: the DB stays encrypted behind Layer A independently of the Java/Python gate, so patching the app-level check alone doesn't hand back readable data.

### Honest summary and realistic safety assessment

This combination — signed-token gating, independent multi-component verification, TDE-at-rest, active DB-level revocation, and anti-rollback — is close to the strongest version of "entirely local, no vendor-hosted service, works even fully offline" that real commercial on-prem software achieves. Against the **realistic threat model for this engagement** (a textile-manufacturing ERP customer's IT/ops staff, not a dedicated reverse-engineering team), it is very safe in practical terms: defeating it requires reverse-engineering compiled/obfuscated code, understanding MySQL's keyring internals, and doing so in a way that is a blatant, provable breach of contract with real legal exposure — a combination of skill, effort, and risk tolerance essentially no ordinary business customer will have or attempt. It will stop the realistic range of "customer stops paying and tries to keep using it" scenarios cold.

It will not survive a determined adversary with full root, genuine reverse-engineering skill, and willingness to snapshot/restore the entire machine state — no purely local, offline mechanism does, and no vendor should claim otherwise. That residual gap is what the contract clause (§8, item 1) exists to cover, not a weakness specific to this design.
