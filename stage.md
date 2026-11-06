# DealGuard — Stage Record

This file records the current implementation checkpoint. Future work should update this file when a stage is completed or when a material change is made to the system, visual identity, images, logo, or flow.

## Current stage: Stage 10 — V2 deal lab started; live integration pending

**Status:** V1 is frozen and pushed to a private GitHub repository. V2 development is active on a separate branch with the rights/value simulator and brand-trust signal added. Live provider verification remains pending.

The planning system has been installed. The documentation artifacts and the first working DealGuard vertical slice have been added. The build now continues from the local prototype checkpoint.

### Added artifacts

- `plan.md` — product intent, problems, architecture, tools, scope, risks, and build order.
- `decisions.md` — decisions and reasons, with flow impact.
- `flow.md` — complete user and system flow, including fallback behavior and demo flow.
- `stage.md` — stage checkpoint and future change protocol.
- `dist/index.html` — DealGuard application shell and interactive screens.
- `dist/styles.css` — responsive hyper-Gen-Z visual system.
- `dist/app.js` — local interaction logic and prepared-data fallback.
- `test-cases.md` — feature, integration, failure, bottleneck, accessibility, security, and regression test matrix.
- `integrations.md` — sponsor capability research, integration boundaries, key handoff, and provider uncertainty notes.
- `.env.example` — safe configuration template with no real keys.
- `server/integrations.js` — Oriane, GMI Cloud, and Compound adapters plus health reporting.
- `server/index.js` — local API gateway with live/fallback routes.
- `v1.0.0` Git tag — frozen v1 baseline.

### Locked product state

- Product: DealGuard.
- User: solo creators without managers.
- Scope: creator-side brand-deal negotiation.
- Inputs: selected video links/uploads, creator context, pasted or uploaded brand offers.
- Core output: evidence-backed Accept/Counter/Reject recommendation.
- Supporting outputs: interactive Creator AI, editable counteroffer, sponsored-content concept, downloadable/shareable decision packet.
- Data: prepared fixture fallback implemented; live Oriane adapter pending.
- Visual direction: hyper-Gen-Z creator workspace with trustworthy evidence.
- MVP boundary: one vertical workflow; no marketplace, payments, signing, automatic sending, or full agency platform.

## Stage progression

### Stage 1 — System shell

**Definition of done:** App shell, navigation, visual tokens, entry actions, and placeholder workspace exist.

**Checkpoint:** The system shell has been installed and the initial visual system has been added. The current implementation includes the shell, navigation, entry actions, and responsive visual treatment. Browser preview is pending because the local socket server was blocked by the environment.

### Stage 2 — Creator media and profile

**Definition of done:** Links/uploads, thumbnails, selection, inferred profile, and creator editing work.

**Checkpoint:** Implemented in the local prototype. The creator can select fixture videos, add/upload video inputs, edit niche/audience/boundary context, and save the context state notification.

### Stage 3 — Offer intake

**Definition of done:** Pasted text and uploaded files produce editable deal terms.

**Checkpoint:** Implemented in the local prototype with a prepared brand email and editable offer input. The demo surface shows paid usage, exclusivity, raw footage, and revisions; generalized file parsing remains pending.

### Stage 4 — Analysis and valuation

**Definition of done:** Fit, risks, transparent valuation, assumptions, confidence, and evidence are visible.

**Checkpoint:** Implemented in the local prototype with evidence cards, a transparent value breakdown, confidence, fit, risk, and a Counter recommendation. Production-grade extraction and live Oriane analysis remain pending.

### Stage 5 — Creator AI and approved updates

**Definition of done:** Floating contextual chat answers questions and proposes report changes for approval.

**Checkpoint:** Contextual chat UI and prepared answers have been added. Approval-based report-update mechanics are represented in the flow but still need a full implementation pass.

### Stage 6 — Negotiation packet and campaign concept

**Definition of done:** Editable counteroffer, campaign concept, copy/download/share actions work.

**Checkpoint:** Implemented in the local prototype. The counteroffer is editable, copyable, and presented with a Compound-style campaign concept preview. No external message is sent automatically.

### Stage 7 — Live integration and fallback

**Definition of done:** Oriane live path and prepared fixture path share one interface and the demo survives live failures.

**Checkpoint:** Fallback data has been added and is the current runtime. The live Oriane adapter has not yet been installed. Run the full demo with live data once credentials and API schema are available.

### Stage 8 — QA pass

**Definition of done:** Static validation, feature test design, failure analysis, and available automated checks are complete.

**Checkpoint:** The QA pass has been installed and the test matrix has been added. JavaScript syntax, file presence, primary DOM contracts, critical action presence, fixture count, empty-selection guard, empty-offer guard, visible disclaimer, download logic, self-contained assets, responsive breakpoints, and no-auto-send behavior all pass. Browser interaction, visual, responsive, keyboard, live API, and true end-to-end tests remain pending because local browser/file preview and socket-server access were blocked by the environment.

### Stage 8 — Demo readiness

**Definition of done:** Three-minute demo is rehearsed, visuals are polished, and the hero scenario works end-to-end.

**Checkpoint to record:** The demo system has been installed and the final presentation assets have been added. No new feature should be started after this checkpoint unless it fixes a demo blocker.

### Stage 9 — Sponsor integration scaffold

**Definition of done:** Sponsor responsibilities are mapped, server-side provider adapters exist, environment variables are documented, fallback behavior is preserved, and the remaining unknowns are limited to private keys/endpoints/schema confirmation.

**Checkpoint:** The sponsor integration scaffold has been installed and the adapter routes have been added. GMI Cloud's public OpenAI-compatible path is represented directly. Oriane and Compound use isolated configurable boundaries because their exact private event schemas are not yet available. Lovable is documented as the build/cloud/connector surface. No real keys are present.

### Stage 10 — V2 deal lab

**Definition of done:** The v2 branch adds the interactive rights/value simulator and brand-trust signal without changing the v1 baseline.

**Checkpoint:** The V2 deal lab has been added. Rights toggles update the suggested counter deterministically, and the brand-trust card is visible in the report. Browser regression testing and live API wiring remain next.

### Stage 11 — Frontend integration wiring

**Definition of done:** V2 browser actions call the local API gateway while preserving fallback behavior.

**Checkpoint:** The frontend integration wiring has been added. Analyze, Creator AI, and campaign-concept actions now attempt the server routes; keys remain server-side and the fallback path remains available. Provider-specific live verification is still pending.

### Stage 12 — Browser resilience

**Definition of done:** Live-facing browser actions communicate progress, prevent duplicate submissions, identify live/fallback results, and recover from timeout or transport failure.

**Checkpoint:** Loading states, abortable client timeout handling, retry analysis, provider-status messaging, Creator AI thinking state, and duplicate-submit guards have been added. Live provider failure simulation remains pending until real provider configuration is available; deterministic client timeout QA is available through `window.DEALGUARD_SIMULATE_TIMEOUT = true`.

### Stage 13 — Explicit media intake

**Definition of done:** Creators can add both public video links and local video files, review the added sources, remove them, and keep them selected for the existing analysis flow.

**Checkpoint:** Separate link and file controls, validation, selected-source rendering, and remove actions have been installed. Provider-specific URL indexing and raw-file upload are intentionally pending until Oriane's private event schema is confirmed.

## Change protocol

Whenever a future change is proposed—such as changing the image system, logo, visual style, partner integration, recommendation logic, or major flow:

1. Add a new decision to `decisions.md` with reason and flow impact.
2. Update the affected section in `flow.md`.
3. Update the relevant stage checkpoint in this file.
4. Record what was installed or added, what remains unverified, and what should be inspected next.
5. Only then begin implementation of the changed system.

