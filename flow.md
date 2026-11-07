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

## 25. Oriane capability-aware evidence flow

1. Creator selects public posts and optionally adds local files.
2. DealGuard classifies public URLs that contain extractable platform IDs.
3. For mapped URLs, DealGuard calls Oriane content search with exact platform-ID filters, `projection=full`, bounded pagination, and a useful sort order.
4. DealGuard normalizes the returned content, media, transcript, frame, visual, comment, profile, and performance fields.
5. DealGuard calculates transparent creator analytics from the returned values: per-video metrics, aggregate comparisons, follower-normalized reach, and recurring hooks/formats.
6. The UI shows evidence and analytics before the recommendation so the creator can inspect the basis for the decision.
7. GMI receives the normalized evidence plus DealGuard-owned calculations and explains the recommendation.
8. Unindexed public URLs and local files remain clearly labeled as pending/fallback sources; Oriane is not claimed to ingest them automatically.

**Decision references:** D054, D055, D056.

## 26. Oriane profile-first coverage fallback

1. DealGuard attempts exact public post lookup from the pasted URL.
2. If Oriane returns a valid empty result, DealGuard distinguishes “not indexed” from authentication, quota, or validation failure.
3. DealGuard extracts the public creator handle when available and searches Oriane profiles.
4. If a profile match is found, DealGuard retrieves a bounded list of recent indexed posts and their aggregate analytics.
5. The creator selects the posts to analyze; DealGuard never silently substitutes content.
6. The selected posts re-enter the normal full-evidence and GMI reasoning flow.

**Decision references:** D052, D057.

## 27. Live evidence presentation

1. Analysis completes through Oriane.
2. DealGuard renders a compact live signal card before the recommendation.
3. The card shows matched-post status, views/likes/comments/shares, and available transcript/on-screen/frame evidence counts.
4. The recommendation remains the existing transparent rights/value decision.
5. If there is no indexed match, the card explains the limitation and the prepared report remains recordable.

**Decision references:** D055, D058.

## 28. Live Creator AI timing

1. The creator opens Creator AI after the live Oriane report is visible.
2. DealGuard shows a thinking state and disables duplicate submission.
3. The browser allows up to 30 seconds for the GMI-compatible response.
4. A live answer is labeled as live reasoning; a provider failure or timeout uses the prepared answer and says so.

**Decision references:** D059.

## 29. Live analysis timing and retry

1. The creator submits the selected public post and offer.
2. DealGuard shows an analysis loading state and disables duplicate submission.
3. The browser allows up to 30 seconds for Oriane.
4. A successful response renders the live evidence card; a timeout exposes Retry analysis and preserves the prepared report.

**Decision references:** D060.

## 30. Conversational Creator AI presentation

1. The creator submits a question and sees a thinking state.
2. GMI is instructed to answer directly in short, human conversational prose.
3. DealGuard safely renders the response as paragraphs, simple bullets, or compact detail rows instead of exposing Markdown syntax.
4. The creator can continue the conversation with another question.

**Decision references:** D061.

## 31. Session chat history

1. DealGuard loads the current tab's saved Creator AI messages from `sessionStorage`.
2. If none exist, it shows the initial context-aware greeting.
3. Every submitted creator question and completed assistant answer is appended to the visible history and saved to the session.
4. Reopening the drawer or refreshing the same tab renders the entire history again.
5. Ending the browser tab session removes the history automatically.

**Decision references:** D062.

## 32. Dynamic commercial recommendation

1. The creator submits a current brand offer.
2. DealGuard parses the first stated content fee and detects rights, duration, deliverables, source files, and revision scope.
3. DealGuard calculates an explainable rights breakdown, fair range, counter, and risk list.
4. Oriane evidence is displayed separately as live video intelligence; it does not silently invent a price.
5. The report replaces its demo values with the current scenario's recommendation and counteroffer.

**Decision references:** D063.

## 33. Streaming Creator AI

1. The creator submits a question.
2. DealGuard opens the streaming GMI-compatible route and shows a rotating progress state.
3. If GMI streams, each text delta is rendered into the chat immediately.
4. The completed answer is stored in the current session history as one assistant message.
5. If streaming fails or the provider is unavailable, DealGuard uses the prepared fallback and labels the provider state.

**Decision references:** D064.

## 34. Creator-specific live valuation

1. Oriane analyzes the selected public creator content.
2. DealGuard aggregates matched-post views and engagement into a creator performance signal.
3. The signal estimates a creator-specific base content value; the brand's proposed fee is treated as an offer to compare, not as the creator's value.
4. Rights premiums are calculated from the brand's requested paid usage, exclusivity, deliverables, source files, and revision scope.
5. The report shows the live-data assumption and generates the counter for this creator and this offer.
6. If live evidence is unavailable, DealGuard labels the fallback signal instead of presenting it as real-time valuation.

**Decision references:** D065.

## 35. Character-by-character streamed reply

1. Creator AI opens the stream and displays rotating progress copy.
2. GMI text deltas enter a client-side character queue.
3. DealGuard renders one character at a time at a readable cadence.
4. The progress copy disappears when the first character appears.
5. The complete typed answer is saved once in the current session history.

**Decision references:** D066.

## 36. Accept versus counter decision

1. DealGuard calculates the creator-specific fair range and reads the brand's stated offer.
2. If the offer is at or above the fair-range minimum, the decision becomes ACCEPT.
3. Creator AI drafts a confirmation that asks the creator to verify scope, usage, exclusivity, and revisions.
4. If the offer is below the fair-range minimum, the decision remains COUNTER at the calculated rights-adjusted value.
5. Deal Lab toggles use the same current breakdown and base as the report.

**Decision references:** D067.

## 37. Empty creator signal workspace

1. The creator opens DealGuard with no seeded content.
2. The workspace explains that a public social link or uploaded file must be added.
3. The creator adds one or more sources and they become selected automatically.
4. The creator can remove or deselect sources before analysis.
5. DealGuard refuses analysis when the selected-source count is zero.

**Decision references:** D068.

## 38. Fresh Creator AI page session

1. DealGuard loads the default Creator AI greeting.
2. Any legacy stored chat history is cleared and ignored.
3. Messages remain available while the current page is open, including after closing and reopening the drawer.
4. A reload starts a new conversation with no stale messages.

**Decision references:** D069.

## 39. Offer paste and PDF intake

1. DealGuard opens with an empty offer field and no demo email metadata.
2. The creator pastes a brand message, brief, or contract, or selects a PDF/TXT/Markdown document.
3. Text files are read locally; PDFs are sent to the local extraction route and converted to text.
4. Extracted text is placed in the editable offer field and the creator reviews it.
5. Analysis remains blocked until the offer field contains text.
6. The extracted file is not persisted after processing.

**Decision references:** D070.

## 40. Optional creator context

1. DealGuard opens with blank niche, audience, and boundary fields.
2. Each field is labeled optional and provides an example placeholder.
3. The creator may fill any subset, save it, or leave all fields blank.
4. Analysis uses selected content and the offer regardless of context completion.
5. If context is supplied, it enriches the report and Creator AI guidance; it never becomes a required gate.

**Decision references:** D071.

## 41. Vertical streamed chat layout

1. Creator AI receives a streamed text delta.
2. The delta enters the character queue and is rendered inside the active assistant bubble.
3. The bubble wraps long words, rows, and partial text within the drawer width.
4. Horizontal overflow is clipped from the message viewport.
5. The viewport scrolls to the newest rendered character so later paragraphs appear below earlier ones.

**Decision references:** D072.

## 42. Evidence-review analysis state

1. The creator submits a valid offer with selected content.
2. DealGuard hides the decision cards and opens the live review state.
3. The state rotates through brand request interpretation, content-signal matching, audience fit, rights valuation, and recommendation preparation.
4. Oriane analysis runs behind the state; the displayed phases describe the actual evaluation stages rather than exposing provider internals.
5. After the provider response and minimum presentation window complete, DealGuard reveals the report and its live/fallback status.

**Decision references:** D073.

## 43. Oriane Content Intelligence report section

1. DealGuard receives the existing normalized Oriane result after analysis.
2. The report renders a provenance badge: `LIVE API` for indexed Oriane evidence or `FALLBACK` when no live evidence is available.
3. For a matched result, the section shows views, likes, comments, shares, engagement rate, and visual frame count.
4. When returned, transcript and on-screen text are shown as short escaped excerpts; missing fields are labeled unavailable rather than invented.
5. The client derives a lightweight opening hook and content-pattern label from the returned text for judge-readable interpretation.
6. This section is evidence presentation only; the existing recommendation and pricing logic remain the source of the commercial decision.

**Decision references:** D074.

## 44. Evidence-backed creator value presentation

1. DealGuard keeps the existing `creatorSignal` returned by the recommendation engine.
2. The report renders a separate Creator Value block after the Oriane evidence section.
3. The block shows the creator base value before rights premiums are applied.
4. A short Why list shows average views, engagement rate, live/fallback provenance, and the available content pattern.
5. The existing Fair value breakdown continues to show paid usage, exclusivity, source files, revisions, and the suggested counter separately.
6. If the signal is fallback, the block states that it is not a live Oriane valuation and does not imply unavailable metrics.

**Decision references:** D075.

## 45. Evidence-grounded Creator AI

1. Analysis stores the returned `creatorSignal` and a compact Oriane evidence object in client state.
2. The object contains provenance, performance metrics, engagement, short transcript and on-screen excerpts, detected hook, content pattern, and visual-frame count.
3. Each `/api/chat` and `/api/chat/stream` request includes the current evidence object alongside the creator context and offer.
4. The server whitelists, trims, and normalizes those fields before including them in the Creator AI messages.
5. Creator AI is instructed to use actual evidence for relevant answers and to say when a field or live provenance is unavailable.
6. No pricing calculation, provider adapter, report presentation, offer intake, or stream transport behavior changes in this feature.

**Decision references:** D076.

## 46. Analysis provenance trace

1. The analysis gateway starts a timer before attempting the configured Oriane request.
2. A live response returns `LIVE ORIANE`, the number of indexed results, an evidence-availability boolean, and safe evidence counts.
3. A missing configuration or failed request returns `FALLBACK`, zero indexed matches, unavailable evidence, a non-secret reason code, and elapsed server time when available.
4. The browser renders this compact trace below provider status, separate from the existing Oriane evidence and Creator Value sections.
5. The trace is explanatory only; it does not alter pricing, recommendation math, Creator AI payloads, or intake behavior.

**Decision references:** D077.

## 47. Evidence-bounded audience/content fit

1. DealGuard receives the creator's optional niche, audience, and boundary fields, the offer text, and any returned Oriane content text.
2. The server compares supplied terms and available content language; it does not infer follower demographics or audience attributes.
3. DealGuard returns `Strong`, `Moderate`, or `Weak` plus one concise evidence-based sentence.
4. Boundary conflicts are called out as a weak fit requiring review.
5. The report shows the result in a separate compact card after analysis, with chips indicating which evidence sources were actually available.
6. Missing context or live evidence is disclosed rather than replaced with invented claims.

**Decision references:** D078.

## 48. Why this matters explanation

1. After recommendation rendering, DealGuard reads the existing compact Oriane evidence and provenance already held in client state.
2. The report shows a compact explanation connecting demonstrated reach, audience response, and repeatable content format to brand value.
3. Live runs show returned views, engagement, and the derived content pattern; no new provider request is made.
4. If evidence is missing or fallback is active, each affected dimension says unavailable and the card explains that live evidence cannot be claimed.
5. The card is explanatory only; it does not modify pricing, recommendation state, Creator AI transport, intake, or Feature 1/2 rendering.

**Decision references:** D079.

## 49. Presentation market framing

1. The second presentation slide introduces an approximately 67M global creator-market estimate as context, not as a guaranteed user count.
2. The slide narrows the target to solo creators negotiating brand deals without managers.
3. The copy connects that audience to the product promise: understand content value, separate rights, and make a defensible decision.
4. The market claim is confined to the presentation microsite and does not affect application logic or recommendation calculations.

**Decision references:** D080.

## 50. Presentation system design visual

1. The “Full loop” slide introduces the four sponsor/workflow roles: Oriane, DealGuard, GMI Cloud, and Compound.
2. The existing public system diagram is shown directly below those cards.
3. The diagram communicates the path from public creator video links, optional context, and a brand offer to DealGuard’s evidence-to-decision workflow.
4. It names Oriane as the video-intelligence source and GMI Cloud as the reasoning/hosting layer, then shows creator value, rights, and decision outputs.
5. The image is presentation-only and does not change application behavior or recommendation calculations.

**Decision references:** D081.

## 51. Presentation wording refinement

1. The “Why this wins” slide uses “invisible work” instead of “invisible labor.”
2. The replacement keeps the same meaning: DealGuard turns creator activity and video evidence into a defensible value signal.
3. No application flow or recommendation calculation changes.

**Decision references:** D082.

## 52. Sourced solo-creator and brand-outreach context

1. Slide 2 introduces solo creators and the brand-deal decisions DealGuard supports.
2. The first card shows the share of CreatorIQ × Influencers.club respondents who handle their business independently, with the sample size, fieldwork dates, and a direct report link.
3. The second card shows the share of U.S. respondents finding deals through direct brand outreach in The Influencer Marketing Factory's January 2026 survey, with its own source link and sample.
4. The slide states that these are separate surveys and that outreach prevalence does not measure offers per month. It does not imply the same creators satisfy both statistics.
5. The supporting research note records the original total-creator estimate, verified definitions, source locations, and the unavailable global solo count/monthly outreach average. This supersedes section 49's slide framing.

**Decision references:** D083.

## 53. Product-led presentation opening

1. The opening slide introduces DealGuard in large type and names solo creators as its target audience.
2. The central promise is helping solo creators negotiate better brand deals.
3. A compact story explains the inputs (content and a brand offer), the analysis (creator value and usage rights), and the next action (review, ask Creator AI, and draft a reply).
4. The live-demo button remains available, followed by the existing problem, evidence, valuation, and assistant slides.

**Decision references:** D084.

## 54. Diagram-only fifth presentation slide

1. After the creator-value slide, the fifth slide shows the existing DealGuard system-design image by itself.
2. The image scales to fit the available viewport without cropping the architecture.
3. The fifth navigation item is labeled “System design”; the existing previous, next, and keyboard controls continue to work.

**Decision references:** D085.
