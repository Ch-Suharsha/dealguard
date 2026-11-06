# DealGuard — Decision Log

This file records product and implementation decisions. Every decision is also reflected in `flow.md` so the operational flow remains consistent with the decision history.

## D001 — Hackathon objective

**Decision:** Optimize for winning the creator-tools hackathon, not for building a complete commercial SaaS product.

**Reason:** The event emphasizes a creator problem, real social-video data, partner-stack usage, a working product by sunset, and a compelling live demo.

**Flow impact:** The flow is one complete vertical slice from offer intake to negotiation packet.

## D002 — Primary user

**Decision:** Solo creators who negotiate brand deals without a manager.

**Reason:** They have a clear pain, an immediate need, and can understand the value without agency procurement.

**Flow impact:** The flow starts with creator-owned videos and context, not a brand marketplace.

## D003 — Creator coverage

**Decision:** The product is creator-agnostic. The demo uses one concrete creator persona only for reliability.

**Reason:** The product should serve different creator niches through a universal analysis core.

**Flow impact:** Niche is inferred from selected videos and remains editable.

## D004 — Product name

**Decision:** Use `DealGuard`.

**Reason:** It is immediately understandable and supports a protective creator-side positioning.

**Flow impact:** All entry points and output language use DealGuard terminology.

## D005 — Core job

**Decision:** Help creators negotiate better brand-deal terms.

**Reason:** The strongest concrete outcome is preventing creators from giving away valuable rights for free.

**Flow impact:** The primary output is a negotiation decision and counteroffer.

## D006 — Hero scenario

**Decision:** Demonstrate a $500 offer with 12 months of paid usage, six months of exclusivity, raw footage, and unlimited revisions.

**Reason:** The hidden commercial value creates a clear before/after reveal.

**Flow impact:** Offer parsing must extract rights, scope, and revisions.

## D007 — Input method

**Decision:** Support both public video links and uploaded video files.

**Reason:** This makes the product useful for creators with different workflows and supports a fallback path.

**Flow impact:** Video intake normalizes both inputs into selectable video cards.

## D008 — Video selection

**Decision:** The creator chooses which videos DealGuard analyzes.

**Reason:** Creator control prevents irrelevant or outdated content from distorting the result.

**Flow impact:** Selection happens before profile inference and is visible in the workspace.

## D009 — Creator context

**Decision:** Collect a short editable profile containing niche, audience, past sponsorships, values, and negotiation preferences.

**Reason:** Video analysis alone cannot capture boundaries or preferences.

**Flow impact:** The creator can edit context at any stage.

## D010 — Human control

**Decision:** Creators can edit DealGuard's understanding whenever they want.

**Reason:** The creator is the authority on their identity, audience, and boundaries.

**Flow impact:** Every AI-generated profile or report has an edit path.

## D011 — Offer intake

**Decision:** Accept pasted brand messages and uploaded briefs/contracts.

**Reason:** Offers arrive through email, DMs, PDFs, and campaign platforms.

**Flow impact:** The offer parser produces editable extracted terms.

## D012 — Recommendation format

**Decision:** Use Accept/Counter/Reject instead of a standalone numerical score.

**Reason:** The creator needs an action, not an abstract metric.

**Flow impact:** The report opens with a recommended action and supporting evidence.

## D013 — Evidence model

**Decision:** Link important claims to source videos, exact clauses, or visible calculations.

**Reason:** Evidence differentiates DealGuard from a generic AI opinion.

**Flow impact:** Every major report card has an expandable evidence reference.

## D014 — Pricing model

**Decision:** Use a transparent range based on deliverables and rights, with assumptions and confidence.

**Reason:** A false-precision number would be untrustworthy and difficult to defend.

**Flow impact:** The report shows the formula and allows assumptions to be changed.

## D015 — Creator AI

**Decision:** Include a floating contextual Creator AI assistant available throughout the app.

**Reason:** Creators should be able to ask questions about the situation instead of accepting a black-box report.

**Flow impact:** Chat uses workspace context and can propose report changes.

## D016 — Report updates

**Decision:** Chat-driven changes are proposed and require creator approval before updating the official report.

**Reason:** Silent changes would reduce trust and make the recommendation difficult to audit.

**Flow impact:** The chat has an explicit `Apply update` action.

## D017 — Output packet

**Decision:** Generate an evidence-backed decision packet, editable negotiation message, and authentic sponsored-content concept.

**Reason:** The creator needs an immediately usable output, not only analysis.

**Flow impact:** The final step supports copy, download, and share.

## D018 — Automation boundary

**Decision:** DealGuard never automatically sends a message to a brand.

**Reason:** The creator must approve external communication.

**Flow impact:** Sending is outside the MVP; copying and sharing are supported.

## D019 — Partner stack

**Decision:** Use Oriane for social-video intelligence, Lovable for rapid UI, GMI Cloud for compute/hosting, and Compound.mov for the campaign concept.

**Reason:** Each partner should have a visible role in the live demo.

**Flow impact:** The analysis flow includes a live-data adapter and a campaign-concept generation step.

## D020 — Live/fallback architecture

**Decision:** Use one normalized analysis interface with a live Oriane path and prepared fixture fallback.

**Reason:** The demo must survive API credentials, network, and rate-limit failures.

**Flow impact:** The user experience is identical regardless of the data source.

## D021 — Visual design

**Decision:** Use a hyper-Gen-Z creator aesthetic with clear, trustworthy evidence.

**Reason:** The product should feel native to creators while retaining commercial credibility.

**Flow impact:** Video cards, bold recommendations, friendly copy, and evidence drawers are core UI patterns.

## D022 — Legal positioning

**Decision:** Present DealGuard as commercial negotiation guidance, not legal advice.

**Reason:** Contract analysis can be useful without making legal conclusions.

**Flow impact:** The limitation appears at the end of the report and near contract analysis.

## D023 — MVP scope

**Decision:** Exclude authentication, marketplace, payments, signing, automatic email, multi-user teams, full invoice management, and broad analytics.

**Reason:** A solo builder must complete and polish one vertical workflow.

**Flow impact:** The product starts in a single workspace and ends at an approved decision packet.

## D024 — Local-only implementation

**Decision:** Build the first working prototype as a self-contained buildless HTML/CSS/JavaScript site inside `dist/`.

**Reason:** The user requested that work remain inside this folder and the hackathon demo needs a reliable fallback without dependency or deployment risk.

**Flow impact:** The complete vertical flow runs in the browser using prepared fixture data; the Oriane integration can be attached behind the same normalized adapter later.

## D025 — Self-contained visual assets

**Decision:** Do not depend on external font files, images, or hosted assets for the MVP.

**Reason:** The local prototype must work offline and remain within the authorized folder.

**Flow impact:** Video thumbnails, concept previews, and visual identity use local CSS treatments and fixture content until real media assets are added.

## D026 — Sponsor integration roles

**Decision:** Use Oriane as the video-perception layer, GMI Cloud as the reasoning/inference layer, Lovable as the app/build/connector platform, and Compound as the campaign-video layer.

**Reason:** Each sponsor contributes a distinct capability and the architecture should make that value visible in the demo.

**Flow impact:** Creator media flows through Oriane evidence, evidence and deal terms flow through GMI reasoning, Lovable remains the app/backend integration surface, and the approved concept flows to Compound or a handoff-ready fallback.

## D027 — Server-side secrets

**Decision:** Provider keys never enter browser JavaScript. The browser calls DealGuard server routes, and the server calls provider APIs.

**Reason:** Protects limited hackathon tokens and keeps the prototype safe to share.

**Flow impact:** `/api/analyze`, `/api/chat`, and `/api/campaign-concept` own provider calls.

## D028 — Live/fallback provider contract

**Decision:** Every sponsor route must work in fallback mode without keys and return a normalized response shape. When configured, it attempts live mode and reports provider failures without destroying the user flow.

**Reason:** The demo must remain reliable before keys arrive and during API rate limits or schema changes.

**Flow impact:** Provider source is tracked as `live`, `fallback`, or `handoff` and errors are safe, structured, and non-secret.

## D029 — Oriane schema boundary

**Decision:** Do not invent Oriane request/response fields. Isolate the exact endpoint and mapping behind `OrianeAdapter` until the private hackathon API documentation/key is available.

**Reason:** Oriane exposes an API docs surface, but its exact authenticated schema is not publicly available in the materials we could verify.

**Flow impact:** Only the adapter mapping changes when the event provides the endpoint contract; the UI and report model remain stable.

## D030 — GMI Cloud runtime

**Decision:** Use GMI Cloud's OpenAI-compatible `/v1/chat/completions` endpoint for Creator AI and structured report reasoning.

**Reason:** GMI publicly documents this endpoint, bearer authentication, model discovery, and OpenAI-compatible request shape.

**Flow impact:** GMI is called through `GmiAdapter`; deterministic pricing remains in DealGuard code.

## D031 — Compound integration boundary

**Decision:** Produce a normalized campaign concept now and support a configurable Compound API/webhook path plus a handoff fallback.

**Reason:** Compound publicly documents its editing capabilities but no general developer API schema was verifiable; the event team must provide the approved integration surface.

**Flow impact:** The user always receives a concept; it is sent live only when Compound credentials and endpoint details exist.

## D032 — Lovable role

**Decision:** Treat Lovable as the rapid app-building/cloud/connector surface, not as a per-request runtime provider in DealGuard.

**Reason:** Lovable provides app construction, Cloud backend, and connectors; its API is for managing Lovable workspaces/projects rather than analyzing creator deals.

**Flow impact:** DealGuard remains portable and can be moved into Lovable Cloud/serverless functions without rewriting provider adapters.

