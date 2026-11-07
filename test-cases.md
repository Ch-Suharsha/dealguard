# DealGuard — Test Strategy and Test Cases

## Test scope

This test plan covers the local MVP in `dist/`:

- Individual UI features.
- Combined end-to-end behavior.
- Creator and brand-deal use cases.
- Failure and recovery behavior.
- Bottlenecks and performance risks.
- Responsive and accessibility risks.
- Data and content integrity.

## Test types

| Type | Purpose | Current execution |
|---|---|---|
| Static validation | Catch syntax and missing-file errors | Executed locally |
| DOM contract checks | Verify every JS-referenced element exists in HTML | Executed locally |
| Interaction tests | Verify clicks, input changes, chat, and report transitions | Primary flow executed in browser |
| End-to-end tests | Verify the complete creator-to-counteroffer flow | Primary flow executed in browser |
| Negative tests | Verify invalid/empty inputs and failed services | Empty-offer path executed; service failures pending |
| Responsive tests | Check mobile/tablet/desktop layouts | Browser blocked; pending |
| Accessibility tests | Keyboard, labels, focus, contrast, screen reader semantics | Browser blocked; static review pending |
| Performance tests | Load size, long text, many videos, repeated chat | Static checks only |

## Acceptance levels

- **P0:** Blocks the primary demo or causes data loss. Must pass.
- **P1:** Breaks a major feature or creates misleading output. Fix before demo.
- **P2:** Cosmetic, accessibility, or edge-case issue. Fix if time permits.

## Static and contract tests

| ID | Scenario | Expected result | Priority | Result |
|---|---|---|---|---|
| S-001 | Parse `dist/app.js` with Node | No syntax error | P0 | PASS |
| S-002 | Confirm `index.html`, `styles.css`, and `app.js` are non-empty | All files exist and contain content | P0 | PASS |
| S-003 | Confirm all JS selectors have matching HTML IDs/classes where applicable | No obvious missing runtime targets | P0 | PASS |
| S-004 | Confirm the page title contains DealGuard | Correct product identity | P1 | PASS |
| S-005 | Confirm primary actions exist: analyze, chat, copy, edit, download | All critical controls exist | P0 | PASS |
| S-006 | Confirm the five fixture videos have stable IDs and selectable state | Demo starts with five selected videos | P0 | PASS |
| S-007 | Confirm external font imports are absent | Site remains self-contained/offline | P1 | PASS |
| S-008 | Confirm CSS includes mobile breakpoint | Responsive rules exist | P1 | PASS |
| S-009 | Confirm no automatic external message/send action exists | Creator remains in control | P0 | PASS |
| S-010 | Confirm the disclaimer is present in the report flow/content model | Product does not claim legal advice | P1 | REVIEW: disclaimer currently documented but not visibly rendered in report |

## Feature tests

### Navigation and entry

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-001 | Open the page | DealGuard workspace renders with sidebar, header, video cards, offer panel, and Creator AI button | P0 | Browser pending |
| F-002 | Click `My content` | Content empty state appears; deal view hides | P1 | Browser pending |
| F-003 | Click `Deal history` | History empty state appears; deal view hides | P1 | Browser pending |
| F-004 | Click `Deal check` after another view | Deal workspace returns | P0 | Browser pending |
| F-005 | Use mobile viewport | Sidebar and content reflow without horizontal overflow | P1 | Browser pending |

### Creator video selection

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-006 | Inspect initial page | Five videos are selected and counter reads `5 selected` | P0 | Code path verified; browser pending |
| F-007 | Click a selected video | Card deselects and count decreases | P0 | Code path verified; browser pending |
| F-008 | Click a deselected video | Card selects and count increases | P0 | Code path verified; browser pending |
| F-009 | Deselect all videos and click Analyze | User sees a clear “select at least one video” message; report does not open | P0 | Code path verified; browser pending |
| F-010 | Upload one or more video files | User sees an upload-ready toast; no crash | P1 | Code path verified; browser pending |
| F-011 | Upload a non-video file | File input rejects it through `accept=video/*` where supported; no crash | P1 | Browser pending |
| F-012 | Select all videos again | Count returns to five and all selected indicators return | P1 | Browser pending |

### Creator profile

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-013 | Edit niche | Value can be changed | P0 | Browser pending |
| F-014 | Edit audience | Value can be changed | P0 | Browser pending |
| F-015 | Edit creator boundary | Multi-line value can be changed | P0 | Browser pending |
| F-016 | Click Save context | Confirmation toast appears | P1 | Code path verified; browser pending |
| F-017 | Click Edit profile | Niche field receives focus and edit toast appears | P1 | Code path verified; browser pending |
| F-018 | Enter empty profile fields | Product does not crash; analysis remains possible with a warning/fallback recommendation | P1 | Not implemented: add validation/warning before demo |

### Brand offer intake

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-019 | Inspect demo offer | Offer includes $500, paid usage, exclusivity, raw footage, unlimited revisions | P0 | PASS by fixture inspection |
| F-020 | Edit offer text | Textarea accepts changes | P0 | Browser pending |
| F-021 | Click Reset demo offer | Original offer returns and toast appears | P1 | Code path verified; browser pending |
| F-022 | Empty offer and click Analyze | Product should show a clear missing-offer error | P0 | PASS by code path; browser pending |
| F-023 | Paste extremely long offer | Product should remain usable or truncate safely | P1 | Not implemented: add max-length handling |
| F-024 | Upload a PDF/brief | Product should parse or clearly indicate unsupported parsing | P1 | Not implemented in local MVP |

### Deal analysis and report

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-025 | Click Analyze with selected videos and offer | Report becomes visible and scrolls into view | P0 | Code path verified; browser pending |
| F-026 | Inspect recommendation | Report says `COUNTER` and shows $1,450–$1,800 range | P0 | PASS by fixture inspection |
| F-027 | Inspect risk cards | Paid usage, exclusivity, and unlimited revisions appear | P0 | PASS by fixture inspection |
| F-028 | Inspect fit card | Report explains why ClipForge fits the selected content | P1 | PASS by fixture inspection |
| F-029 | Inspect pricing breakdown | Base, paid usage, exclusivity, and raw footage/revision values appear | P0 | PASS by fixture inspection |
| F-030 | Click evidence buttons | Contextual Creator AI opens with the relevant question | P1 | Code path verified; browser pending |
| F-031 | Click Explain | Contextual Creator AI opens with calculation question | P1 | Code path verified; browser pending |
| F-032 | Inspect legal positioning | Report includes commercial-guidance disclaimer | P1 | PASS in markup; browser pending |

### Creator AI

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-033 | Click floating Ask Creator AI button | Drawer opens | P0 | Code path verified; browser pending |
| F-034 | Click close | Drawer closes | P1 | Code path verified; browser pending |
| F-035 | Click a suggestion chip | User message and relevant assistant response appear | P0 | Code path verified; browser pending |
| F-036 | Submit custom question | User message appears, then contextual response appears | P0 | Code path verified; browser pending |
| F-037 | Ask “why counter?” | Response explains paid usage, exclusivity, raw footage, and revisions | P0 | PASS by response inspection |
| F-038 | Ask about exclusivity | Response gives a separate pricing/reduction suggestion | P1 | PASS by response inspection |
| F-039 | Ask for calculation | Response explains the $500 + $600 + $450 + $300 breakdown | P0 | PASS by response inspection |
| F-040 | Submit blank question | Nothing is sent and UI remains stable | P1 | Code path verified; browser pending |
| F-041 | Submit rapid repeated questions | UI does not duplicate or lose messages | P1 | Not implemented/tested: add request state if live model is connected |

### Counteroffer and output

| ID | Steps | Expected result | Priority | Result |
|---|---|---|---|---|
| F-042 | Click Copy counteroffer | Counteroffer is copied or clear fallback toast appears | P0 | Code path verified; browser pending |
| F-043 | Click Edit message | Message becomes editable | P0 | Code path verified; browser pending |
| F-044 | Edit message and click away | Edited message remains visible | P1 | Browser pending |
| F-045 | Click Download packet | User receives a downloadable text decision packet | P1 | PASS by code path; browser pending |
| F-046 | Click Regenerate concept | User sees a concept-regenerated confirmation | P1 | Code path verified; browser pending |
| F-047 | Verify no auto-send exists | No external mail or message is created | P0 | PASS by code inspection |

## Combined end-to-end scenarios

| ID | Scenario | Expected result | Priority | Result |
|---|---|---|---|---|
| E2E-001 | Start → select videos → edit profile → analyze demo offer → inspect report | Complete core demo works without error | P0 | Browser pending |
| E2E-002 | Start with no selected videos → analyze → select videos → analyze again | First attempt is blocked; second succeeds | P0 | Code path partially verified; browser pending |
| E2E-003 | Modify creator boundary to reject creator tools → analyze ClipForge | Fit/risk context should reflect creator preference | P1 | Not implemented: analysis is fixture-based |
| E2E-004 | Change offer to remove exclusivity → ask AI about price | Chat response should reflect changed offer | P0 | Not implemented: prepared answers do not parse dynamic offer yet |
| E2E-005 | Analyze → ask why → change assumption → approve report update → copy counteroffer | Full human-in-the-loop flow works | P0 | Approval update is not fully implemented |
| E2E-006 | Analyze → edit counteroffer → copy it | Edited text is copied | P0 | Browser pending |
| E2E-007 | Analyze → open another nav view → return to Deal check | Report state behavior is intentional and stable | P1 | Browser pending; state persistence should be verified |
| E2E-008 | Run with live API unavailable | Prepared fallback still completes demo | P0 | Fallback fixture exists; browser pending |

## Failure and recovery tests

| ID | Failure | Expected behavior | Priority | Result |
|---|---|---|---|---|
| R-001 | Oriane request times out | Show fallback state or retry affordance; never blank the workspace | P0 | Adapter not implemented |
| R-002 | Oriane returns malformed video data | Skip bad item and show a recoverable warning | P1 | Adapter not implemented |
| R-003 | Upload fails | Preserve existing selected videos and show failure toast | P1 | Browser pending |
| R-004 | Clipboard permission denied | Show “ready to copy” fallback without crashing | P1 | Code has fallback toast |
| R-005 | Browser lacks smooth scrolling | Report still becomes visible | P1 | Native fallback expected; browser pending |
| R-006 | Creator enters empty offer | Explain what is missing and keep previous context | P0 | Validation needed |
| R-007 | Creator enters contradictory context | Ask for clarification or show assumptions | P1 | Not implemented |
| R-008 | Chat response is delayed | Show pending state and prevent confusing duplicates | P1 | Not implemented for live model |
| R-009 | Chat service fails | Preserve the report and show retry/fallback response | P0 | Not implemented |
| R-010 | Very long counteroffer | Keep card readable and allow editing/scrolling | P1 | Browser pending |
| R-011 | User deselects all after report | Existing report should remain readable or clearly become stale | P1 | Not implemented |
| R-012 | User reloads page | Product should either restore state or clearly reset demo state | P2 | Reset behavior undocumented; currently browser reset expected |

## Bottleneck and load scenarios

| ID | Scenario | What to observe | Target/expectation | Result |
|---|---|---|---|---|
| B-001 | 5 selected videos | Initial render and selection responsiveness | No perceptible lag | Static only |
| B-002 | 25 selected videos | Grid layout and selection state | UI remains usable | Not supported/tested |
| B-003 | 100,000-character offer | Textarea and analysis remain responsive | Enforce max length or truncate safely | Not implemented |
| B-004 | 100 chat messages | Chat scroll and DOM size | No severe slowdown | Not implemented |
| B-005 | Repeated Analyze clicks | Avoid duplicate reports or duplicate requests | Debounce/disable while analyzing | Not implemented |
| B-006 | Slow image/video upload | UI communicates progress | Progress or pending state | Not implemented |
| B-007 | Mobile width 320px | No horizontal clipping; chat remains usable | Responsive layout | Browser pending |
| B-008 | Keyboard-only navigation | All actions reachable and visible | No keyboard trap | Browser pending |

## Security and privacy checks

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| SEC-001 | Paste sensitive contract text | Data stays in local prototype; no automatic transmission | PASS by architecture |
| SEC-002 | Inspect network references | No external asset imports in CSS/HTML | PASS after removing font import |
| SEC-003 | User enters script-like text into offer | Rendered text must not execute as HTML | Browser pending; use textContent in dynamic chat |
| SEC-004 | Attempt automatic message send | No send capability exists | PASS by code inspection |
| SEC-005 | Use uploaded private video | Do not transmit without explicit future integration consent | Upload handling is local UI only in MVP |

## Accessibility checks

| ID | Scenario | Expected result | Priority | Result |
|---|---|---|---|---|
| A-001 | Every icon-only button has accessible name | Screen reader can identify it | P1 | Partial: some buttons rely on title or visual text |
| A-002 | Tab through primary flow | Focus order follows content flow | P1 | Browser pending |
| A-003 | Keyboard activates video cards | Video selection works without mouse | P1 | Buttons support native keyboard activation |
| A-004 | Focus visible | Focus ring is visible on inputs/buttons | P1 | Needs review; browser pending |
| A-005 | Color contrast | Text remains readable against dark/purple/lime surfaces | P1 | Static review needed |
| A-006 | Toast announcements | Screen reader receives success/error messages | P1 | Toast has role=status |
| A-007 | Chat drawer semantics | Drawer and close action are discoverable | P1 | Partial; no dialog role/focus trap |

## Current test conclusions

## V2 test cases

| ID | Scenario | Expected result | Priority | Result |
|---|---|---|---|---|
| V2-001 | Open report on v2 branch | Rights/value simulator and brand-trust card are visible | P0 | Static checked; browser pending |
| V2-002 | Toggle paid usage off | Suggested counter decreases by $600 | P0 | Code path checked; browser pending |
| V2-003 | Toggle exclusivity off | Suggested counter decreases by $450 | P0 | Code path checked; browser pending |
| V2-004 | Toggle all rights off | Suggested counter returns to $500 and note says only base fee remains | P0 | Code path checked; browser pending |
| V2-005 | Toggle rights repeatedly | Total remains deterministic and no duplicate state is created | P0 | Code path checked; browser pending |
| V2-006 | Ask Creator AI after changing rights | Chat explains the current scenario | P1 | Pending dynamic live-context wiring |
| V2-007 | Run v2 without provider keys | Simulator works and fallback report remains available | P0 | Static checked |
| V2-008 | Compare v1 tag with v2 branch | v1 has no v2 simulator changes | P0 | Git tag/branch separation created |

## Sponsor gateway tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| API-001 | `GET /api/health` with no keys | Returns provider readiness without secrets | PASS |
| API-002 | `POST /api/analyze` with no Oriane key | Returns fallback recommendation and structured risks | PASS |
| API-003 | `POST /api/chat` with no GMI key | Returns contextual fallback answer | PASS |
| API-004 | `POST /api/campaign-concept` with no Compound config | Returns handoff-ready concept | PASS |
| API-005 | Frontend calls `/api/analyze` | Same-origin gateway call is wired with fallback preservation | PASS by syntax/static wiring; browser live route pending |
| API-006 | Provider returns error/timeout | Route should preserve fallback and expose a safe provider error | Implemented; live failure simulation pending |
| API-007 | Provider key present | Route should return `source: "live"` after schema confirmation | Pending keys and private schemas |

### Resilience tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| RES-001 | Click Analyze twice quickly | Only one request runs; button is disabled while busy | Implemented; browser smoke passed |
| RES-002 | Analyze while request is pending | Button shows analyzing state and provider status shows loading | Implemented; browser smoke passed |
| RES-003 | Set `window.DEALGUARD_SIMULATE_TIMEOUT = true` and analyze | Request aborts, status shows timeout, retry button appears | Implemented; deterministic browser check pending |
| RES-004 | Click Retry analysis after failure | Previous analysis payload is retried without re-entering data | Implemented; browser check pending |
| RES-005 | Submit Creator AI question | Thinking indicator appears and send control is disabled | Implemented; browser check pending |
| RES-006 | Submit duplicate Creator AI question | Duplicate message/request is ignored while the first is active | Implemented; browser check pending |
| RES-007 | Fallback response returned | Status clearly says prepared fallback data/reasoning | Implemented; browser smoke passed |

### Media intake tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| MEDIA-001 | Inspect media intake | Separate link input and file upload controls are visible | Implemented; static checked |
| MEDIA-002 | Add valid HTTPS video link | Link appears in added-source list and is selected | Implemented; browser check pending |
| MEDIA-003 | Add invalid link | Clear validation message appears and no source is added | Implemented; browser check pending |
| MEDIA-004 | Add one or more local video files | Each file appears in the added-source list and is selected | Implemented; browser check pending |
| MEDIA-005 | Remove added source | Source disappears and selection count updates | Implemented; browser check pending |
| MEDIA-006 | Analyze with mixed fixtures, links, and files | Existing analysis flow receives the combined selected collection | Implemented by shared payload; live provider mapping pending |

### Portable context handoff tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| CTX-001 | Open analyzed report | AI HANDOFF card explains the portable context workflow | Implemented; static checked |
| CTX-002 | Click Copy context.md | Current creator context is copied as Markdown and confirmation appears | Implemented; browser check pending |
| CTX-003 | Click Download context.md | Local `context.md` file downloads with creator context and recommendation | Implemented; browser check pending |
| CTX-004 | Change profile or rights state, then export | Export reflects the current values at click time | Implemented by dynamic composer; browser check pending |
| CTX-005 | Inspect privacy boundary | No automatic upload or outbound AI request is triggered by export | PASS by architecture |

### Creator AI layout tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| AI-UI-001 | Open Creator AI on desktop | Drawer is compact and does not replace the workspace | Implemented; static checked |
| AI-UI-002 | Open Creator AI on 320px mobile viewport | Drawer fits within viewport without horizontal overflow | Implemented CSS; browser check pending |
| AI-UI-003 | Use suggestions and chat input in compact drawer | Existing controls remain visible and usable | Implemented; browser check pending |

### Oriane contract tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| ORI-001 | Build request for a mapped public post | Uses `/rest/contents/search` with valid operator/filter structure | Required implementation change |
| ORI-002 | Request full content projection | Response contains transcript, on-screen text, media, frames where available | Supported by documented schema; live test pending |
| ORI-003 | Normalize wrapped response | Reads `data.results` and preserves `metadata.requestId` and pagination | Required implementation change |
| ORI-004 | Receive HTTP 206 | Partial result remains usable and pagination metadata is surfaced | Required implementation change |
| ORI-005 | Receive HTTP 402 | UI explains credits/quota issue and preserves fallback | Required implementation change |
| ORI-006 | Public URL cannot be mapped to platform ID | No invented request is sent; source remains fallback-ready | Required implementation change |
| ORI-007 | Local video selected | UI does not claim Oriane video upload is live unless event capability confirms it | PASS by documented boundary |
| ORI-008 | Authentication convention | Use only the header/query format confirmed by Oriane workspace/help desk | Pending confirmation |

| ORI-009 | Local key present and synthetic platform ID request | Server sends Bearer-authenticated contents search and receives a valid 200 metadata envelope | PASS; zero matches expected for synthetic ID |
| ORI-010 | Real TikTok/Instagram URL | URL maps to `{platform, platformId}` and indexed evidence appears in normalized results | Pending real creator URL |
| ORI-011 | Unindexed but valid public URL | Empty results are disclosed and prepared fallback remains available | Adapter path implemented; UI verification pending |

### GMI event capability tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| GMI-001 | Claim event credits in GMI console | Credits appear on the account without changing the codebase | Pending event-day action |
| GMI-002 | Call `/v1/models` | Select and pin a model actually available to the account | Pending credentials |
| GMI-003 | Run report with verified text model | Structured DealGuard reasoning completes through the existing API adapter | Pending credentials |
| GMI-004 | Use GMI MCP for discovery | Model/price/docs discovery works without placing MCP in the runtime critical path | Pending event-day access |
| GMI-005 | Test optional audio model | Voice response works or text fallback remains available | Pending voice credential/model |
| GMI-006 | Test AgentBox credential separately | Container launch/upload/execute works without confusing AgentBox credentials with inference credentials | Pending AgentBox access |

| GMI-007 | Discover models with authenticated key | `/v1/models` succeeds and local configuration uses an available model | PASS; model pinned to DeepSeek-V4.1-Flash |
| GMI-008 | Send minimal Creator AI chat request | Chat completions returns an assistant answer and usage metadata | PASS |
| GMI-009 | Configured model is unavailable | Setup detects the mismatch before the demo and allows a verified model to be pinned | PASS during setup |

### Oriane capability and analytics tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| ORI-012 | Search an exact indexed post with `projection=full` | Results include available transcript, on-screen text, frames, visual tags, profile, comments, and metrics | Pending real creator URL |
| ORI-013 | Sort and paginate content search | `sort`, `offset`, `limit`, and `aiSearchAnchor` are passed safely; 206 metadata is preserved | Request path implemented; live pagination pending |
| ORI-014 | Read content aggregations | DealGuard can show totals/averages and calculate transparent creator comparisons | Normalizer ready; UI pending |
| ORI-015 | Search creator profile | Profile result includes handle, follower/post/like counts, bio, verification/privacy, language, and timestamps | Adapter not yet implemented |
| ORI-016 | Create a text visual-search asset | Text asset is capped at 300 characters and returns an asset ID | Adapter not yet implemented |
| ORI-017 | Submit local video to documented asset endpoint | App does not claim Oriane supports it; source remains fallback/pending | PASS by documented boundary |
| ORI-018 | Attempt unsupported social mutation | DealGuard offers no take-down, edit, publish, or account-control action through Oriane | PASS by documented boundary |

| ORI-019 | Search a public indexed profile | Profile search returns public profile identity, follower/post counts, and pagination metadata | PASS with @mrbeast |
| ORI-020 | Search indexed profile content | Content search returns 206/200, results, aggregate analytics, and request metadata | PASS with @mrbeast |
| ORI-021 | Exact indexed public post through adapter | Existing DealGuard adapter returns one normalized result with metrics and full media evidence | PASS with public TikTok post |
| ORI-022 | Valid public post not in catalog | Empty result is not treated as an auth failure; profile-first fallback is recommended | PASS at provider level; UI fallback pending |

| ORI-023 | Live indexed result in report | Report visibly shows Oriane live status, metrics, evidence counts, and request metadata | Implemented; final browser rehearsal pending |
| ORI-024A | Live indexed result renders Content Intelligence | Show LIVE API provenance, views, likes, comments, shares, engagement, transcript/on-screen excerpts when present, frame count, hook, and content pattern | Implemented; browser rehearsal pending |
| ORI-024B | Fallback result renders provenance honestly | Show FALLBACK status and do not claim transcript, on-screen text, or frames when Oriane evidence is unavailable | Implemented; static checked |
| ORI-024 | Live empty result in report | Report explains no indexed match and keeps the prepared decision visible | Implemented; final browser rehearsal pending |

### Hack the Feed judged-vertical tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| EVENT-001 | Run seeded demo with no provider keys | Full evidence-to-counteroffer-to-concept flow completes with clear fallback labels | Pending final rehearsal |
| EVENT-002 | Run live Oriane + GMI path | Report visibly uses video evidence and GMI explanation while retaining deterministic rights math | Pending event credentials |
| EVENT-003 | Oriane returns partial/failed data during pitch | Evidence cards remain usable or fall back; demo does not block | Architecture covered; live simulation pending |
| EVENT-004 | Creator edits rights assumptions | Counteroffer changes immediately and the explanation reflects the approved scenario | Implemented; browser regression pending |
| EVENT-005 | Export the final artifact | Counteroffer copy/download and context.md handoff are available before the final concept | Implemented; browser regression pending |
| EVENT-006 | Deliver a 3-minute demo | A cold viewer can identify the creator problem, evidence, recommendation, and Monday artifact in one pass | Rehearsal pending |
| EVENT-007 | Judge asks an adversarial question | Creator AI answers from the same evidence/offer context without inventing an external send or changing the report without approval | Partial; approval behavior remains pending |
| EVENT-008 | Optional sponsor feature is unavailable | Voice, AgentBox, MCP runtime, Lovable deployment, and Compound rendering can be skipped without breaking the core demo | Architecture covered; event verification pending |

### Optional voice tests

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| VOICE-001 | GMI key is configured; list models | Available model IDs and capabilities are inspected before exposing voice | Pending key installation |
| VOICE-002 | Push-to-talk with verified audio input | Short clip is captured and converted into a contextual text question | Pending model/schema verification |
| VOICE-003 | Voice response model is unavailable | Text answer still appears; UI explains voice output is unavailable | Pending implementation |
| VOICE-004 | Microphone permission denied | No crash; typed chat remains usable | Pending implementation |
| VOICE-005 | Audio request times out or credits are exhausted | Text fallback/retry appears and no duplicate request is submitted | Pending implementation |
| VOICE-006 | Inspect network/browser bundle | Oriane/GMI keys never appear in client-side code | PASS by architecture; recheck after voice implementation |

## Browser execution results

The local browser run completed successfully for the primary vertical flow:

- Opened the DealGuard workspace.
- Selected and deselected creator videos; selection count updated.
- Edited niche, audience, and creator boundary; save confirmation appeared.
- Analyzed the populated brand offer and rendered the decision report.
- Opened Creator AI and received a contextual answer to a suggested question.
- Submitted a custom Creator AI question and received a contextual answer.
- Edited the counteroffer content.
- Copied the edited counteroffer and received confirmation.
- Downloaded the decision packet and received confirmation.
- Tested empty-offer handling and saw the validation message.
- Reset the demo offer successfully.
- Navigated to My Content and Deal History, then returned to Deal Check.
- Confirmed the report remained visible during navigation.

Browser execution could not yet verify mobile layout, keyboard-only navigation, actual downloaded-file contents, live Oriane behavior, or external API failure recovery.

### Passing now

- JavaScript syntax validation.
- Core files exist and are non-empty.
- Prepared demo data is present.
- Core selectors and handlers are present by static inspection.
- Fallback UI logic exists.
- No automatic outbound message behavior exists.
- Site has no external font/runtime asset dependency.

### Must fix before claiming production-ready

1. Add real report-update approval behavior.
2. Add dynamic offer parsing so chat and pricing respond to edited offers.
3. Add live Oriane adapter and timeout fallback.
4. Run browser interaction, responsive, keyboard, and visual tests once a preview path is available.

### Submission rehearsal cases

- **E2E-001:** Paste a public indexed TikTok URL, add it, analyze, and confirm the live Oriane evidence card and metrics are visible.
- **E2E-002:** Open Creator AI, submit a negotiation question, confirm thinking state, duplicate-submit prevention, and live/fallback status.
- **E2E-003:** Toggle deal rights and confirm the suggested counter updates.
- **E2E-004:** Download `context.md` after analysis and confirm the portable handoff action is available.
- **CHAT-005:** Submit a response containing bold markers, bullets, and a pipe-delimited table; confirm the chat shows readable prose/detail rows with no raw `**`, `|`, or separator lines.
- **CHAT-006:** Ask two distinct Creator AI questions and confirm the live response text is not replaced by the same canned fallback when GMI is available.
- **CHAT-007:** Send two messages, close/reopen Creator AI, and confirm both user questions and assistant answers remain visible.
- **CHAT-008:** Refresh the same tab and confirm session history is restored; open a new tab and confirm it starts with only the greeting.

- **DEAL-009:** Analyze a plain `$500` single-post offer and a `$1,200` offer with paid usage, exclusivity, and raw footage; confirm the fair range, breakdown, and counter differ.
- **DEAL-010:** Analyze an offer without a stated price; confirm the documented default base is used and the assumptions remain visible.
- **CHAT-009:** Submit a Creator AI question while GMI is configured; confirm rotating progress messages appear, streamed text arrives incrementally, and the final answer is saved once in session history.
- **CHAT-010:** Disable or break GMI; confirm the stream route ends in a readable fallback answer with provider/fallback status and no duplicate assistant message.
- **DEAL-011:** Submit the same offer against two Oriane metric sets with materially different views/engagement; confirm the creator base and counter differ.
- **DEAL-012:** Submit a low brand anchor for a high-performing creator; confirm the brand offer is shown as an input/comparison and does not overwrite the live creator-based base value.
- **CHAT-011:** Ask Creator AI with GMI streaming enabled; confirm progress copy rotates before the first delta and the visible answer grows character-by-character until completion.
- **DEAL-013:** Submit a $1,200 offer whose calculated fair range is $500–$650; confirm the recommendation is ACCEPT and no lower counter is generated.
- **DEAL-014:** Complete analysis, then inspect V2 Deal Lab; confirm its base and right premiums match the report and its total is not the stale $1,850 demo value.
- **CONTENT-009:** Open a fresh session; confirm no fake creator videos are preselected and the selected count is zero.
- **CONTENT-010:** Attempt analysis with no selected sources; confirm DealGuard asks the creator to add a video and does not call Oriane.
- **CONTENT-011:** Add a public link; confirm it becomes selected, appears in the content workspace, and can be removed before analysis.
- **CHAT-012:** Send a Creator AI question, close/reopen the drawer, and confirm the current conversation remains.
- **CHAT-013:** Send a Creator AI question, reload the page, and confirm the old conversation is gone and only the fresh greeting remains.
- **OFFER-009:** Open a fresh session; confirm the offer field is blank and no demo sender/message appears.
- **OFFER-010:** Paste a brand message and analyze; confirm the pasted text is the only offer input used.
- **OFFER-011:** Upload a text-based PDF; confirm extracted text populates the editable offer field before analysis.
- **OFFER-012:** Upload an oversized, malformed, or unsupported document; confirm a clear error appears and analysis does not use fabricated offer text.
- **CONTEXT-012:** Open a fresh session; confirm niche, audience, and boundary are blank and marked optional.
- **CONTEXT-013:** Add content and an offer while leaving all context fields blank; confirm analysis proceeds.
- **CONTEXT-014:** Fill only one context field; confirm partial context is accepted and used without requiring the others.
- **CHAT-014:** Stream a multi-paragraph Creator AI response; confirm every paragraph wraps below the previous one with no horizontal overflow.
- **CHAT-015:** Stream a response longer than the drawer viewport; confirm the message area follows the newest text and the input remains reachable.
- **ANALYSIS-015:** Click Analyze with a valid source and offer; confirm the report cards stay hidden while the review phases rotate and appear only after analysis completes.
- **ANALYSIS-016:** Use a fast fallback response; confirm the review state remains visible for at least the minimum presentation window and does not expose stale demo results.
- **ANALYSIS-017:** Force an analysis timeout; confirm the rotating state ends with a clear retry/error status rather than revealing a fabricated live result.

