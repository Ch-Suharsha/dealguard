# DealGuard

<video src="https://raw.githubusercontent.com/Ch-Suharsha/dealguard/codex/dealguard-v3/docs/media/dealguard-product-demo.mp4" poster="https://raw.githubusercontent.com/Ch-Suharsha/dealguard/codex/dealguard-v3/docs/media/dealguard-product-demo-poster.png" controls playsinline width="100%"></video>

**[Watch or download the DealGuard product demo](docs/media/dealguard-product-demo.mp4)**

DealGuard is a creator-side brand-deal intelligence workspace. It helps a creator understand what a brand is actually asking for, see what their public video evidence is worth, price usage rights separately, and decide whether to accept or counter.

## Why it exists

Creators are often offered one flat number for a package that quietly includes production, paid advertising, exclusivity, source files, and open-ended revisions. DealGuard turns the negotiation into an evidence-backed conversation:

```text
Video evidence → creator value → rights calculation → accept/counter decision
```

The product is designed to preserve creator agency. A brand offer is treated as an opening anchor—not as the creator's value—and a sufficient offer is accepted instead of being countered downward.

## Hackathon demo flow

1. Add a public TikTok, Instagram, or YouTube post, or upload creator content.
2. Paste a brand email/brief/contract or upload an offer PDF.
3. DealGuard retrieves live public video intelligence from Oriane when the post is indexed.
4. The report shows performance evidence, transcript/on-screen signals, creator value, and rights premiums.
5. DealGuard recommends `ACCEPT` or `COUNTER` and explains why.
6. Creator AI answers follow-up questions using the current offer, creator context, and Oriane evidence.
7. Export `context.md` so the creator's other AI workspace can continue with the same context.

## Sponsor integrations

- **Oriane** — public social-video intelligence: post metrics, transcript, on-screen text, visual frames, and indexed content evidence.
- **GMI Cloud** — OpenAI-compatible model gateway used for Creator AI, including streamed responses.
- **Compound.mov** — campaign-concept handoff path for creator-native video concepts.
- **Lovable** — prompt-to-product build surface used to accelerate the vertical.

See [integrations.md](integrations.md) for the integration contract and [docs/system-design.svg](docs/system-design.svg) for the architecture overview.

## Current status

The current working line is `codex/dealguard-v3`. The stable checkpoint before the next feature wave is tagged `v2.0.0`. Feature 1–3 on v3 currently include:

- Visible Oriane Content Intelligence
- Evidence-backed creator value and separate rights pricing
- Creator AI grounded in Oriane evidence
- Live/fallback provenance states
- PDF offer extraction
- Optional creator context
- Session-fresh Creator AI history
- Streamed, character-by-character Creator AI rendering

## Run locally

Requirements: Node.js 18+ and `pdftotext` for PDF offer extraction.

```bash
cp .env.example .env
# Add provider keys locally; never commit .env.
./run-local.sh
```

Then open `http://127.0.0.1:4175/` (or the port printed by the server).

The server-side gateway keeps provider keys out of browser code. Without a provider key, DealGuard preserves a clearly labeled fallback path for local UI testing.

## Environment variables

Use [.env.example](.env.example). Supported integrations include:

- `ORIANE_API_KEY`, `ORIANE_API_BASE_URL`, `ORIANE_ANALYZE_PATH`
- `GMI_API_KEY`, `GMI_BASE_URL`, `GMI_MODEL`
- `COMPOUND_API_KEY`, `COMPOUND_API_BASE_URL`, `COMPOUND_RENDER_PATH`

Never paste real keys into source files, screenshots, README content, or commit history.

## Tests

```bash
node --check dist/app.js
node --check server/index.js
node server/recommendation.test.js
git diff --check
```

The project also maintains detailed acceptance and failure cases in [test-cases.md](test-cases.md), with decisions and flow history in [decisions.md](decisions.md) and [flow.md](flow.md).

## Project principles

- Creator-owned inputs
- Evidence before valuation
- Rights priced separately
- Accept a good offer; do not negotiate downward
- Live provider status is always visible
- Fallback behavior is explicit
- No automatic external messages or deal acceptance

DealGuard is a hackathon prototype and provides commercial negotiation guidance, not legal advice.
