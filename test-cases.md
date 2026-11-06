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

