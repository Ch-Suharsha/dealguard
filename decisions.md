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

## D033 — V2 branch isolation

**Decision:** Keep v1 frozen on `main` and tag `v1.0.0`; develop new features on `codex/dealguard-v2`.

**Reason:** The hackathon needs a safe fallback if v2 becomes unstable.

**Flow impact:** V2 additions are layered onto the existing vertical flow; v1 remains the recovery baseline.

## D034 — Rights/value simulator

**Decision:** Add an interactive simulator that recalculates the recommended counter when the creator toggles paid usage, exclusivity, raw footage, and revisions.

**Reason:** It turns a passive AI report into a visible decision tool and creates the strongest live-demo moment.

**Flow impact:** After the initial report, creators can change deal assumptions and immediately see the commercial impact.

## D035 — Brand trust signal

**Decision:** Add a brand-trust card showing topic fit, style fit, and claim risk.

**Reason:** A deal is not only about price; creators need to protect audience trust.

**Flow impact:** The report includes a trust layer alongside financial risk.

## D036 — Frontend API gateway wiring

**Decision:** V2 browser actions call DealGuard's same-origin `/api/analyze`, `/api/chat`, and `/api/campaign-concept` routes, with local UI fallback if the gateway is unavailable.

## D037 — Resilient request states

**Decision:** Add explicit loading, timeout, retry, provider-status, and duplicate-submit behavior to every live-facing browser action.

**Reason:** A hackathon demo must remain understandable when an API is slow, unavailable, or still unconfigured. These states can be implemented without sponsor keys and protect the creator from duplicate requests.

**Flow impact:** Analysis disables its submit button while running, exposes a retry action after failure, and labels live versus fallback results. Creator AI shows a thinking state, disables duplicate sends, and falls back safely after timeout or error. A test-only `window.DEALGUARD_SIMULATE_TIMEOUT` switch makes timeout behavior reproducible.

## D038 — Explicit creator media intake

**Decision:** Provide separate, visible controls for adding public video links and uploading local video files. Added sources appear in a removable list and are selected for analysis by default.

**Reason:** The original label promised both links and files but only opened a file picker. Creators commonly work from published TikTok, Instagram, or YouTube posts, so link intake must be a first-class interaction.

**Flow impact:** A creator can paste a valid HTTP(S) video URL or choose one or more local video files, review the added source, remove it, and continue through the same analysis flow. Existing fixture videos and V1 behavior remain intact.

## D039 — Portable creator context handoff

**Decision:** Add `Copy context.md` and `Download context.md` actions that export the creator's editable context, selected content signal, current offer, rights simulator state, recommendation, negotiation risks, and AI operating instructions.

**Reason:** Creators may already have a personal Butler, Claude, or other AI agency. DealGuard should transfer the creator's accumulated context instead of forcing them into another silo.

**Flow impact:** After analysis, the creator can explicitly copy or download a Markdown handoff. DealGuard does not automatically upload or transmit the context to another AI. The creator chooses the destination and remains responsible for reviewing sensitive deal information before sharing it.

## D040 — Compact Creator AI drawer

**Decision:** Reduce the Creator AI drawer to a compact floating panel: 320px wide and 430px tall on larger screens, with the same constrained dimensions on mobile where available.

**Reason:** The previous 350px by 550px drawer dominated the mobile viewport and obscured the deal workspace. Creator AI should feel like an always-available assistant, not a full-screen replacement for the report.

**Flow impact:** Opening Creator AI keeps the surrounding deal workspace visible while preserving the chat history, suggestions, input, and close control.

## D041 — Oriane contents-search integration

**Decision:** Integrate DealGuard with Oriane's documented `POST /rest/contents/search` operation rather than the previously assumed `/api/analyze` endpoint.

**Reason:** The complete public OpenAPI document exposes content search, profile search, and text/image asset creation. It does not expose a generic video-analysis or video-upload operation. Contents search returns the transcript, on-screen text, media frames, engagement, and profile evidence needed by DealGuard.

**Flow impact:** DealGuard must translate selected public sources into Oriane search filters, normalize `data.results` into provider-neutral evidence, request full projection for the demo, and preserve fallback behavior for local files or links that cannot be mapped to an indexed platform ID.

## D042 — No invented Oriane authentication or ingestion

**Decision:** Do not guess Oriane's API-key header or claim that arbitrary public URLs/local videos are supported until the API-key panel or event help desk confirms those capabilities.

**Reason:** The public OpenAPI document does not declare a security scheme, URL-ingestion field, or video multipart asset schema. Guessing would create a brittle demo and could waste credits.

**Flow impact:** The next integration pass must confirm authentication, URL indexing, and local-file handling. Until then, the app labels unverified sources as fallback-ready and keeps the demo functional.

## D043 — GMI capabilities from event deck

**Decision:** Use GMI's standard OpenAI-compatible API as the critical runtime path, keep voice as an optional enhancement, use MCP for development-time discovery, and reserve AgentBox for a later isolated media-processing worker.

**Reason:** The event deck confirms text, image, video, and audio model availability, an OpenAI-compatible endpoint, an MCP server, and AgentBox container execution. The core DealGuard demo needs reliable text reasoning first; adding AgentBox or realtime voice to the critical path would increase event-day risk.

**Flow impact:** The current API adapter remains the primary GMI integration. The verified model should come from `/v1/models`; the deck's `deepseek-ai/DeepSeek-V4` is the new default example. Voice and AgentBox are documented extension points with explicit credential and time checks.

## D044 — Optimize the judged vertical around evidence and a Monday artifact

**Decision:** Shape the hackathon demo around one complete creator workflow: selected video evidence → transparent deal decision → creator-approved counteroffer/context handoff → Compound-ready campaign concept. Keep optional sponsor capabilities outside the critical path.

**Reason:** The private Hack the Feed report says judging prioritizes meaningful use of video intelligence—what videos show, say, and sound like—and asks for a tool a creator can use on Monday. A broad collection of disconnected sponsor features would make the 3-minute pitch less legible and increase event-day failure risk.

**Flow impact:** The first report view must visibly cite Oriane-derived evidence. GMI explains the decision but does not replace deterministic rights valuation. The final screen must show a usable artifact and the app must remain demoable from seeded fallback data if live sponsor calls fail.

## D045 — Treat sponsor loop features as staged enhancements

**Decision:** Use Oriane as the core live evidence integration, GMI as the core reasoning integration, Lovable as an optional build/deployment surface, and Compound as an optional campaign-rendering/distribution handoff. Do not add voice, AgentBox, MCP runtime calls, automatic posting, or direct Lovable project management to the critical demo before credentials and latency are verified.

**Reason:** The report confirms credits and capabilities, but it does not guarantee that every surface is ready for a stable end-to-end runtime in a same-day build. Reliability and judge comprehension matter more than feature count.

**Flow impact:** Every optional layer has a clear fallback: prepared evidence, local reasoning, local concept preview, and context.md export. Live sponsor status is disclosed in the UI.

## D046 — Prepare for the event review and live pitch constraints

**Decision:** Maintain a seeded demo path, a 4:30 PM submission checkpoint, and a 3-minute pitch with 2-minute Q&A as explicit release constraints.

**Reason:** The private report says all projects are reviewed before the stage round and finalists have a short live demo. The product must communicate value in one pass and tolerate provider failure.

**Flow impact:** QA must cover a cold-start demo, live-provider success, live-provider timeout, and fallback recovery. The pitch script should show one creator, one suspicious offer, one evidence-backed change, and one exported artifact.

## D047 — Voice is an optional push-to-talk enhancement

**Decision:** Add voice as an optional Creator AI enhancement using short browser audio capture and the existing server-side DealGuard context, while keeping text chat as the canonical path and fallback.

**Reason:** GMI's current documentation confirms an OpenAI-compatible HTTP inference surface and audio modalities, but does not establish that OpenAI Realtime/WebRTC is directly compatible or that the event key can use every audio model. A full realtime voice implementation would create avoidable demo risk.

**Flow impact:** Voice may transcribe a creator question, send it through the same evidence-aware chat route, and optionally speak the response after a verified output-audio model is found. If any audio capability is missing, the user continues in text without losing the conversation.

## D048 — Do not treat an OpenAI-compatible API as OpenAI Realtime compatibility

**Decision:** Verify GMI model IDs, audio input/output schema, and realtime transport from the live account before implementing a WebRTC/WebSocket voice loop.

**Reason:** “OpenAI-compatible” reliably supports the documented HTTP request shape, authentication, and chat-completions concepts; it does not guarantee identical model names, audio content schema, realtime events, browser permissions, or CORS behavior.

**Flow impact:** The first live check is `/v1/models`, followed by a small text request and a small audio-capability request. Only then should the UI expose microphone capture, and only behind a feature flag.

## D049 — Protect secrets and record key readiness without storing keys in Git

**Decision:** Keep Oriane and GMI keys in a local ignored `.env` or deployment secret store; never place them in chat, `dist/app.js`, documentation, or commits.

**Reason:** The project currently has no `.env` file in the workspace, so a key mentioned by the user has not yet been installed into the local runtime. Provider credentials must stay server-side.

**Flow impact:** Once the user adds the keys locally, the app can run provider health, model discovery, and smoke tests without changing browser code. Missing keys continue to produce explicit fallback status.

## D050 — Use GMI API for runtime and MCP for development discovery

**Decision:** Use GMI's OpenAI-compatible API as the DealGuard runtime integration. Use GMI MCP only for development-time model/docs discovery and troubleshooting.

**Reason:** The app needs a predictable server-side request path, explicit timeouts, retries, provider status, and a stable fallback. MCP is valuable for an assistant operating tools interactively, but it should not be a hidden dependency inside the creator's production request path.

**Flow impact:** DealGuard calls GMI through `GMI_BASE_URL` and `GMI_API_KEY`. MCP may help identify a verified model or inspect docs, after which the selected model is pinned in `.env`. The browser never talks to MCP directly.

## D051 — Create an ignored local environment file

**Decision:** Add a local `.env` template and a `.gitignore` rule before installing provider credentials.

**Reason:** The user needs a safe place to paste the Oriane key, and the repository previously lacked a `.gitignore`. The local file contains placeholders only until the user fills it in.

**Flow impact:** Provider keys stay server-side and out of Git. The Oriane path is set to `/rest/contents/search`, but live testing remains blocked until the adapter request mapping and authentication convention are confirmed.

**Reason:** This lets us add keys later without exposing secrets or rewriting the interface, while preserving the working demo today.

**Flow impact:** Analysis, Creator AI, and campaign-concept actions now attempt the server gateway first and retain the existing fallback behavior on failure.

