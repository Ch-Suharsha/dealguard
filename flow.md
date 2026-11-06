# DealGuard — End-to-End Flow

This is the operational flow of the project. It is the implementation counterpart to `decisions.md`; each major flow step is tied to a product decision.

## 0. Entry and positioning

**State:** The creator opens a hyper-Gen-Z creator workspace.

**Message:** “Understand what your work is worth before you say yes.”

**Actions:**

- Check a brand deal.
- Analyze my content.
- Ask Creator AI.

**Decision references:** D001, D004, D021.

## 1. Creator media intake

**State:** The creator adds public video links and/or uploads video files.

**Actions:**

- Add links.
- Upload files.
- Preview thumbnails and metadata.
- Remove irrelevant videos.
- Select exactly which videos to analyze.

**System behavior:** Normalize all selected media into the same internal video-analysis input.

**Decision references:** D007, D008.

## 2. Creator understanding

**State:** DealGuard analyzes the selected videos and drafts a creator profile.

**Draft fields:**

- Niche and topics.
- Video formats.
- Hook and pacing patterns.
- Visual and verbal style.
- Audience signals visible from public content.

**Creator controls:** The creator edits any field and can add:

- Audience description.
- Past sponsorships.
- Values and prohibited categories.
- Preferred partnership style.
- Negotiation preferences.

**Decision references:** D003, D009, D010.

## 3. Brand offer intake

**State:** The creator adds the offer.

**Inputs:**

- Pasted email or message.
- Uploaded brief.
- Uploaded contract.

**System behavior:** Extract and display editable terms:

- Deliverables.
- Platforms and formats.
- Fee and payment schedule.
- Organic usage.
- Paid advertising usage.
- Whitelisting.
- Exclusivity.
- Raw footage.
- Revisions.
- Deadlines.

**Decision references:** D011, D006.

## 4. Fit and risk analysis

**State:** DealGuard compares the offer with the creator context and selected videos.

**Outputs:**

- Content/brand fit.
- Audience-signal fit.
- Authenticity concerns.
- Scope risk.
- Rights risk.
- Negotiation leverage.

**Evidence:** Each output links to a creator video, brand clause, or explicit assumption.

**Decision references:** D013, D019, D020.

## 5. Transparent valuation

**State:** DealGuard estimates the commercial value of the request.

**Calculation:**

```text
Base creation fee
+ platform and deliverable adjustments
+ paid usage fee
+ whitelisting fee
+ exclusivity fee
+ raw-footage fee
+ revision/scope fee
= estimated fair-value range
```

**Output:** Range, assumptions, confidence, and editable inputs.

**Decision references:** D014, D021.

## 6. Initial decision report

**State:** DealGuard presents the result.

**Top-level output:**

- Accept.
- Counter.
- Reject.

**Report sections:**

- One-line recommendation.
- Fair-value range.
- Three most important risks.
- Best negotiation points.
- Evidence drawer.
- Assumptions and confidence.
- Commercial-guidance disclaimer.

**Decision references:** D012, D013, D014, D022.

## 7. Interactive Creator AI

**State:** A floating assistant is available on every screen.

**The creator can ask:**

- Why did you recommend countering?
- What happens if I remove exclusivity?
- How much is 90 days of paid usage worth?
- Does this brand fit my content?
- Rewrite the counteroffer casually.
- Explain the calculation.
- What should I push back on first?

**System behavior:** Use current workspace context. If a chat message changes an assumption, propose a report update rather than silently changing it.

**Decision references:** D015, D016.

## 8. Approved revision

**State:** The creator reviews a proposed update.

**Actions:**

- Approve update.
- Reject update.
- Edit the assumption again.

**System behavior:** Only an approved update changes the official report and decision packet.

**Decision references:** D010, D016.

## 9. Negotiation packet

**State:** The creator approves the final recommendation.

**Outputs:**

- Final Accept/Counter/Reject decision.
- Fair-value breakdown.
- Risk summary.
- Negotiation points.
- Editable counteroffer message.
- Authentic sponsored-content concept.

**Actions:**

- Copy counteroffer.
- Download packet.
- Share packet.

**Constraint:** DealGuard never automatically sends the brand a message.

**Decision references:** D017, D018.

## 10. Demo fallback flow

If live data fails:

1. The creator still selects prepared video cards.
2. The system loads normalized fixture analysis.
3. Offer extraction uses prepared or local deterministic data.
4. Pricing logic runs locally.
5. Creator AI uses the same report context.
6. The final experience remains unchanged.

**Decision references:** D020, D023.

## 10A. Local prototype runtime

**State:** The MVP runs as a self-contained buildless site from `dist/`.

**Runtime files:**

- `dist/index.html` — application structure and content.
- `dist/styles.css` — responsive hyper-Gen-Z visual system.
- `dist/app.js` — interaction state, fixture analysis, chat, report, and output actions.

**System behavior:** The prototype uses prepared creator videos and a prepared ClipForge offer to demonstrate the full vertical flow. Video selection, creator-context editing, report visibility, chat responses, counteroffer editing, copy actions, navigation, and fallback messaging are interactive.

**Decision references:** D024, D025.

## 10B. Sponsor integration runtime

**State:** The browser communicates with a local/server-side DealGuard API gateway. Provider credentials are never exposed to the browser.

### `/api/health`

Returns readiness for Oriane, GMI, Compound, and Lovable without returning secrets.

### `/api/analyze`

1. Receive selected videos, creator context, and brand context.
2. Call `OrianeAdapter` when Oriane configuration is present.
3. Normalize Oriane's response into video evidence.
4. If Oriane is unavailable, return prepared evidence and a structured fallback reason.
5. Pass normalized evidence into the DealGuard report pipeline.

### `/api/chat`

1. Receive the creator question plus workspace context.
2. Call GMI Cloud's OpenAI-compatible chat-completions endpoint when `GMI_API_KEY` exists.
3. Otherwise return the contextual fallback assistant.
4. Never expose the GMI key to the browser.

### `/api/campaign-concept`

1. Receive the approved concept, creator style, and brand constraints.
2. Call Compound through its configured endpoint when the event provides one.
3. Otherwise return a handoff-ready local concept.

### Provider readiness behavior

- `live`: provider is configured and returned a response.
- `fallback`: provider key/endpoint is missing or the request failed; local response preserved the flow.
- `handoff`: Compound concept is ready for the approved manual/MCP/API handoff.

### Key handoff flow

```text
Receive sponsor key/docs
  → copy values into local .env
  → GET /api/health
  → make one smallest live request per provider
  → confirm normalized response
  → run full browser flow
  → keep fallback enabled for the demo
```

**Decision references:** D026, D027, D028, D029, D030, D031, D032.

## 11. Hackathon demo flow

```text
Open DealGuard
  → select five creator videos
  → correct inferred creator profile
  → paste the $500 offer
  → reveal 12-month paid usage + exclusivity + raw footage
  → show fair-value range
  → recommend Counter
  → ask Creator AI why
  → change one assumption
  → approve proposed update
  → generate counteroffer
  → generate sponsored concept
```

## 12. V2 deal lab flow

V2 preserves every step above and adds an interactive decision layer after the first report:

1. Show the initial fair-value range and recommendation.
2. Render a rights/value simulator with paid usage, exclusivity, raw footage, and revision toggles.
3. When a toggle changes, recompute the deterministic value range and suggested counter immediately.
4. Show how removing exclusivity or shortening paid usage changes the creator's position.
5. Show a brand-trust signal based on content fit, style fit, and claim risk.
6. Let Creator AI explain the changed scenario.
7. Generate the final counteroffer and Compound concept from the approved scenario.

**Fallback behavior:** The simulator works without any provider key because the rights valuation is deterministic. Oriane/GMI/Compound remain optional live layers behind the existing adapters.

**Decision references:** D033, D034, D035.

## 13. V2 frontend-to-provider wiring

The v2 browser now calls the local DealGuard gateway for live-capable actions:

- Analyze button → `POST /api/analyze`.
- Creator AI question → `POST /api/chat`.
- Compound concept action → `POST /api/campaign-concept`.

Each call sends creator context, selected-video metadata, and the current offer. The browser never sends a provider key. If the gateway is unavailable or a provider fails, the existing local response remains usable and the UI reports fallback/handoff mode.

**Decision references:** D027, D028, D036.

## 14. Resilient request states

1. Creator starts analysis or asks Creator AI.
2. DealGuard marks the action busy and disables the matching submit control.
3. The browser request uses an abortable timeout.
4. While waiting, the UI shows an explicit loading state.
5. On success, the UI labels the result as live sponsor data or prepared fallback data.
6. On timeout or transport failure, the UI preserves the local experience and exposes a retry action for analysis.
7. A second click or duplicate chat submission is ignored while the first request is active.

For deterministic QA, setting `window.DEALGUARD_SIMULATE_TIMEOUT = true` before an action forces the short client timeout path without requiring a provider outage.

**Decision references:** D028, D036, D037.

## 15. Creator media source flow

1. DealGuard shows the existing selected fixture videos.
2. The creator either pastes a public TikTok, Instagram, or YouTube URL and selects `Add link`, or selects one or more local video files with `Upload video files`.
3. DealGuard validates the link protocol or accepts the browser's video-file filter.
4. The source is added to the visible media list and selected for analysis by default.
5. The creator can remove an added source before analysis.
6. Analysis receives the selected source collection through the same normalized video payload used by the fixture flow.

**Decision references:** D007, D008, D010, D038.

## 16. Portable AI context handoff

1. DealGuard composes `context.md` from the creator's current editable profile, selected video signal, brand offer, rights simulator state, recommendation, risks, and negotiation preferences.
2. The creator reviews the handoff controls in the `AI HANDOFF` card.
3. `Copy context.md` places the Markdown in the clipboard for direct pasting into Butler AI or another assistant.
4. `Download context.md` saves a local Markdown file for upload to an AI tool that accepts files.
5. No external upload or AI-to-AI connection occurs automatically.

**Decision references:** D010, D017, D018, D039.

## 17. Compact Creator AI interaction

1. The creator clicks `Ask Creator AI`.
2. DealGuard opens a compact floating drawer above the workspace.
3. The creator can see the report behind or around the drawer while asking questions.
4. The chat drawer keeps its suggestions, input, loading state, and close action.
5. On mobile, the drawer remains within the viewport with a bounded width and height.

**Decision references:** D015, D021, D040.

## 18. Oriane live evidence flow

1. The creator selects fixture videos, public links, or local files.
2. DealGuard identifies which public sources can be mapped to an Oriane platform and external post ID.
3. For mapped sources, the server calls `POST /rest/contents/search` with `projection=full`, a bounded limit, and a filter using `platformId` and/or other confirmed content filters.
4. DealGuard reads the wrapped response from `data.results` and `metadata`, retaining request ID, pagination, partial-result status, transcript, on-screen text, frames, engagement, and profile fields.
5. DealGuard normalizes the results into its provider-neutral evidence model.
6. GMI Cloud receives the normalized evidence plus the offer and creator context for reasoning.
7. Unmapped URLs, local files, missing keys, credit exhaustion, or unsupported ingestion stay on the prepared fallback path and are disclosed in provider status.

**Decision references:** D020, D028, D041, D042.

## 19. GMI event-capability flow

1. At the event, claim the GMI credits in the console and discover available models through the API or GMI MCP server.
2. Pin one verified text model in the local environment and run the standard DealGuard report/chat smoke test.
3. Keep GMI's OpenAI-compatible inference route as the critical path for report reasoning, Creator AI, and counteroffer drafting.
4. If time and credits allow, test one audio model behind an optional voice control; text chat remains the fallback.
5. If Oriane cannot ingest local videos, evaluate AgentBox as a separate worker that receives a clip, extracts usable evidence, and returns a normalized file/result to DealGuard.
6. Do not couple the main demo to MCP or AgentBox until the event-day credential and latency checks pass.

**Decision references:** D030, D043.

## 20. Judged hackathon vertical

The private Hack the Feed report defines the sponsor loop and the judged experience:

1. Start with a creator who has a brand offer and a small set of selected public videos or local files.
2. Show the creator's evidence signal first: what their videos show, say, and sound like, plus performance context when available from Oriane.
3. Extract the offer terms and calculate rights/value impact deterministically.
4. Ask GMI to explain the recommendation in the creator's context and answer follow-up questions.
5. Let the creator change rights assumptions, approve or edit the recommendation, and generate the counteroffer.
6. Export `context.md` so the creator's existing AI workspace can continue with the same context.
7. Generate a Compound-ready campaign concept from the approved negotiation and creator style.
8. If any live sponsor call fails, keep the same screen and disclose fallback status rather than blocking the demo.

### Event release constraints

- A seeded path must work without keys for rehearsal and submission.
- The live path should demonstrate Oriane evidence and GMI reasoning when credentials are available.
- The pitch should fit a 3-minute demo followed by 2 minutes of questions.
- AgentBox, voice, MCP runtime calls, Lovable deployment, and automatic Compound posting stay optional until verified.

**Decision references:** D044, D045, D046.

## 21. Optional Creator AI voice flow

1. Creator opens the compact Creator AI drawer and chooses push-to-talk.
2. Browser requests microphone permission and records a short audio clip; no provider key is exposed.
3. DealGuard sends the clip through a server-side audio/transcription adapter only if a verified GMI audio model and schema are configured.
4. The resulting text question is added to the same contextual chat flow used by typed questions.
5. GMI receives the creator context, Oriane evidence, offer, rights state, and conversation history.
6. DealGuard renders the text response immediately.
7. If a verified output-audio model exists, DealGuard may synthesize a response; otherwise the response remains text.
8. If microphone permission, model access, audio schema, or timeout fails, the UI preserves the question when possible and says to continue in text.

**Decision references:** D047, D048, D049.

## 22. Runtime provider configuration flow

1. The user opens the ignored local `.env` file and enters the Oriane key.
2. DealGuard server reads the key from the environment; browser assets never receive it.
3. The server uses the documented Oriane base URL and contents-search path, then performs a small authenticated smoke test.
4. If the response contract or auth convention differs, update only `OrianeAdapter`; preserve the browser and normalized evidence interface.
5. Add the GMI key separately when available.
6. Use GMI MCP only to inspect available models/docs during setup; pin the verified model in `.env` and use the API for runtime requests.

**Decision references:** D041, D042, D050, D051.

## 23. Oriane authenticated lookup flow

1. Server loads the ignored local `.env` and keeps `ORIANE_API_KEY` server-side.
2. DealGuard extracts a supported platform and post ID from each selected public URL.
3. OrianeAdapter builds `filters.platformId.includes` entries with both values.
4. DealGuard requests `projection=full` with a bounded limit.
5. Oriane returns `data.results` and pagination/request metadata; DealGuard normalizes them for the existing analysis boundary.
6. A successful empty result is treated as “no indexed match yet,” not as a crash; the prepared fixture remains available.

**Decision references:** D052.

## 24. GMI authenticated reasoning flow

1. Server loads `GMI_API_KEY` and the account-verified `GMI_MODEL` from the ignored `.env`.
2. Setup calls `/v1/models` to verify model availability without exposing the key.
3. DealGuard sends the creator context, normalized Oriane evidence, offer terms, and question to `/v1/chat/completions`.
4. The server returns only the assistant answer, provider source, and safe usage/status metadata to the browser.
5. If GMI times out, rejects the model, or runs out of credits, Creator AI falls back to the local contextual answer.
6. Audio/voice is not enabled merely because text chat works; it requires a separate model/schema smoke test.

**Decision references:** D050, D053.

