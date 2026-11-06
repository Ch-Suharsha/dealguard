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

