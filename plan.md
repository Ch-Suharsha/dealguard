# DealGuard — Product and Hackathon Build Plan

## 1. Purpose

DealGuard is a creator-side negotiation workspace for brand partnerships. It helps a creator understand whether a deal is worth accepting, identify hidden commercial value in the requested rights, negotiate better terms, and turn the approved deal into an authentic sponsored-content concept.

The project is being built to win the Hack the Feed creator-tools hackathon. The event rewards a practical creator product that uses real social-video intelligence, demonstrates meaningful use of the partner stack, works end-to-end, and is compelling in a live demo.

## 2. Problems we will solve

Creators often receive brand offers that look simple on the surface but contain additional value transfers:

- Paid advertising or whitelisting rights are included without separate compensation.
- Exclusivity blocks future sponsorships.
- Raw footage and perpetual usage rights are not priced clearly.
- Deliverables, revision rounds, approval windows, and payment dates are vague.
- Creators do not know whether a brand fits their audience or established content identity.
- Rate calculators use generic benchmarks and do not understand the creator's actual video style.
- Contract-review tools flag terms but do not connect those terms to the creator's content or commercial value.
- Creators lack a manager who can explain the offer, suggest a counter, and help them visualize an authentic campaign.
- Generic AI assistants can answer questions, but they do not maintain a structured, evidence-backed deal workspace.

## 3. Product promise

> Creators should not need a manager to understand the value of their own work.

DealGuard turns a creator's selected videos and creator profile plus a brand offer into an evidence-backed decision:

- Accept
- Counter
- Reject

It explains the recommendation, exposes its assumptions, lets the creator challenge or edit the analysis, generates an editable counteroffer, and creates an authentic sponsored-video concept.

## 4. Target user

The product is creator-agnostic and should work for any creator type: technology, education, gaming, beauty, fitness, lifestyle, travel, UGC, and others.

The initial user is a solo creator who receives brand offers but does not have a manager or legal/commercial operations team. The demo will use one concrete creator persona and fictional brand so the workflow is reliable, while the product architecture remains universal.

## 5. The new vertical

The vertical is creator-side brand-deal intelligence and negotiation.

This is not a creator marketplace, a generic content generator, a social analytics dashboard, or a legal contract-review product. Its focused vertical slice is:

> Selected creator videos + creator context + brand offer → deal fit and rights analysis → transparent valuation → negotiation decision → editable counteroffer and sponsored-content concept.

## 6. Core user flow

1. The creator opens DealGuard.
2. They choose `Check a brand deal`, `Analyze my content`, or `Ask Creator AI`.
3. They add public video links and/or upload video files.
4. They select exactly which videos should be analyzed.
5. DealGuard extracts an initial niche, content-style, and audience-signal profile.
6. The creator edits or corrects that analysis whenever they want.
7. The creator adds short context: niche, audience, values, past sponsorships, and negotiation preferences.
8. The creator pastes a brand email/message or uploads a brief/contract.
9. DealGuard identifies deliverables, usage rights, paid advertising, whitelisting, exclusivity, raw footage, revisions, deadlines, and payment terms.
10. DealGuard compares the offer with the selected content and creator context.
11. DealGuard calculates a transparent estimated fair range using deal scope and rights.
12. DealGuard presents an Accept/Counter/Reject recommendation with evidence, assumptions, and confidence.
13. The creator asks contextual questions in Creator AI.
14. If the creator changes an assumption, DealGuard proposes an updated report for approval.
15. DealGuard generates an editable negotiation message and an authentic campaign concept.
16. The creator copies the message and downloads or shares the final decision packet.

## 7. System design

### 7.1 Front end

The front end is a hyper-Gen-Z creator workspace:

- Video-first cards and thumbnails.
- Strong typography and expressive color.
- Clear recommendation hierarchy.
- Lightweight motion and microcopy.
- Evidence drawers rather than dense enterprise tables.
- Persistent floating Creator AI assistant.

The style must remain trustworthy. Gen-Z visual language should make the product inviting, not obscure prices, clauses, assumptions, or uncertainty.

### 7.2 Main screens

1. **Home / entry**
   - `Check a brand deal`
   - `Analyze my content`
   - `Ask Creator AI`

2. **Creator context**
   - Add links or upload videos.
   - Select videos for analysis.
   - Edit inferred niche, style, audience signals, values, and preferences.

3. **Offer intake**
   - Paste brand email or message.
   - Upload brief or contract.
   - Show extracted terms for correction.

4. **Deal analysis**
   - Accept/Counter/Reject decision.
   - Brand/content fit.
   - Commercial risk.
   - Fair-value range.
   - Confidence and assumptions.
   - Evidence links to videos, clauses, and calculations.

5. **Creator AI**
   - Floating assistant available throughout.
   - Answers using workspace context plus general creator-business knowledge.
   - Can explain, challenge, recompute, and propose report updates.

6. **Decision packet**
   - Summary recommendation.
   - Risk and rights breakdown.
   - Pricing calculation.
   - Negotiation points.
   - Editable counteroffer.
   - Sponsored-content concept.
   - Copy, download, and share actions.

### 7.3 Analysis pipeline

```text
Video links/files
  → video metadata and content analysis
  → creator profile inference
  → creator edits/approves context

Brand email/brief/contract
  → offer and clause extraction
  → creator-content fit analysis
  → rights and deliverables valuation
  → recommendation with evidence
  → creator questions and approved revisions
  → negotiation packet and campaign concept
```

### 7.4 Live data and fallback

The system will use an adapter boundary for social-video analysis:

- Live path: Oriane API analyzes creator-provided public video links or available media.
- Fallback path: prepared fixture data represents the same response shape if API access, rate limits, or network conditions fail.

The UI must not reveal whether the response came from the live or fallback path during the demo. Both paths must produce the same normalized creator-video analysis object.

## 8. Transparent pricing model

The MVP will not claim to provide a legally or financially authoritative market price. It will provide a negotiation benchmark based on explicit inputs:

```text
Estimated deal value =
  base content creation fee
  + platform/deliverable adjustment
  + paid usage fee
  + whitelisting/creator-handle ad fee
  + exclusivity fee
  + raw-footage fee
  + revision/scope adjustment
```

The interface will show a range, assumptions, and confidence rather than one false-precision number.

## 9. Hackathon demo scenario

Use a fictional creator video-editing brand and a prepared universal creator profile. The offer is:

> $500 for one 60-second TikTok/Instagram video, plus 12 months of paid advertising rights, six months of category exclusivity, raw footage delivery, and unlimited revisions.

The demo reveal is that this is not merely a $500 post. The brand is requesting multiple commercial rights that should be priced separately.

Demo sequence:

1. Select five creator videos.
2. Correct the inferred creator profile.
3. Paste the brand offer.
4. Show extracted terms.
5. Reveal hidden rights and the fair-value range.
6. Show `Counter` as the recommendation.
7. Ask Creator AI why.
8. Change one assumption and approve a revised report.
9. Generate an editable counteroffer.
10. Generate a short authentic sponsored-content concept.

## 10. Tools and partner stack

- **Oriane API:** social-video analysis, selected-video understanding, content-style and topic signals, and brand/creator video comparison.
- **Lovable:** rapid construction of the creator-facing web experience and visual interaction flow.
- **GMI Cloud:** hosting and compute for analysis, embeddings, document parsing, and any heavier inference.
- **Compound.mov:** create a short sponsored-video concept or visual preview after the deal is accepted/countered.
- **LLM layer:** parse offers, explain evidence, maintain the Creator AI conversation, and draft negotiation messages.
- **Prepared fixtures:** stable demo data for creator videos, extracted terms, calculations, and fallback behavior.

## 11. What must change from a generic AI assistant

DealGuard must not be a chat wrapper. It must add:

- Persistent creator context.
- Explicit video selection.
- Creator-editable analysis at every stage.
- Structured offer and clause extraction.
- Transparent rights valuation.
- Evidence links to source videos, clauses, and calculations.
- Confidence and assumptions.
- Approved report revisions rather than silent changes.
- A concrete Accept/Counter/Reject action.
- An editable negotiation message.
- A campaign concept grounded in the creator's actual style.

## 12. Explicit non-goals for the hackathon MVP

- No marketplace.
- No creator discovery system.
- No payment processing.
- No automatic emails to brands.
- No contract signing.
- No full legal advice or legal conclusion.
- No broad social analytics dashboard.
- No multi-user agency workspace.
- No full invoice-management system.
- No unrestricted general-purpose chatbot.
- No requirement to support every social platform live.

## 13. Acceptance criteria

The MVP is ready for the demo when a user can:

- Add videos through links or uploads.
- Select which videos to analyze.
- Edit the inferred creator context.
- Paste or upload a brand offer.
- See extracted deal terms.
- See a clear Accept/Counter/Reject recommendation.
- Understand the recommendation through evidence and calculations.
- Ask Creator AI contextual questions.
- Change an assumption and approve a proposed report update.
- Generate an editable counteroffer.
- Generate a sponsored-content concept.
- Download or share the decision packet.
- Complete the core flow using fallback data if live API calls fail.

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Oriane API is unavailable or rate-limited | Build the adapter and prepared fixture path first. |
| Project becomes a generic chatbot | Require every key output to connect to a video, clause, or calculation. |
| Pricing appears arbitrary | Show formula, assumptions, range, and confidence. |
| Gen-Z design reduces trust | Keep evidence, numbers, and clauses visually prominent. |
| Solo build becomes too broad | Protect the one vertical slice and exclude non-goals. |
| Product is mistaken for legal advice | Label it commercial negotiation guidance and avoid legal conclusions. |
| Demo depends on too many external services | Prepare a complete fallback scenario and rehearse it. |

## 15. Build order

1. Create the four documentation artifacts: plan, decisions, flow, and stages.
2. Build the app shell and hyper-Gen-Z visual system.
3. Build creator video input and selection.
4. Add creator profile inference and editing.
5. Add offer intake and term extraction.
6. Add deterministic pricing and recommendation logic.
7. Add evidence-backed report UI.
8. Add contextual Creator AI chat.
9. Add counteroffer generation and campaign concept.
10. Add Oriane live adapter and verify fallback.
11. Rehearse the three-minute demo.
12. Polish only the screens used in the demo.

