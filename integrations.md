# DealGuard — Sponsor Integration Blueprint

## Executive summary

The product should use each sponsor for a distinct layer:

```text
Creator videos + brand context
        ↓
Oriane: see/hear/search video evidence
        ↓
GMI Cloud: reason over evidence and produce structured decisions
        ↓
DealGuard: show/edit/approve the decision packet
        ↓
Compound: turn the approved concept into a creator-style video preview
```

Lovable is the build and app platform around the experience. It is not something DealGuard should call on every user interaction.

## 1. Oriane — primary integration

### What it provides

Oriane describes itself as a video search/intelligence layer. Its public materials say it can search across TikTok, Instagram, and YouTube using what is on screen, what is spoken, captions, products, logos, and context, and return structured data such as views, comments, creator details, transcripts, and visual tags. Oriane also exposes API documentation at `https://connect.oriane.xyz/rest/docs`.

### How DealGuard should use it

1. Accept public creator video links and brand/competitor video references.
2. Send selected creator media or indexed references to Oriane.
3. Normalize the response into a provider-neutral `VideoEvidence` object.
4. Use the evidence for:
   - Creator niche and topic inference.
   - Hook and format patterns.
   - Content/brand fit.
   - Visual and spoken-style matching.
   - Evidence citations in the report.

### What is already scaffolded

- Server-side `OrianeAdapter`.
- Configurable base URL and analyze path.
- Timeout handling.
- Provider-neutral response normalization.
- Fallback to prepared fixtures when the key or endpoint is missing.

### What must be confirmed at the event

- Exact endpoint path.
- Authentication header format.
- Whether the API accepts public URLs, uploaded media, or both.
- Exact request body schema.
- Exact response fields for transcripts, visual tags, comments, views, and creator metadata.
- Rate limits and credit accounting.

Do not guess this endpoint. The adapter isolates the unknowns so only the provider request mapping needs to be updated after access is granted.

## 2. GMI Cloud — reasoning and inference integration

### What it provides

GMI Cloud publicly documents an OpenAI-compatible inference API at `https://api.gmi-serving.com/v1`, including chat completions, Responses API, Messages API, and `GET /v1/models`. The API uses a bearer key and supports streaming or full responses.

### How DealGuard should use it

- Use GMI for Creator AI responses.
- Use a structured JSON prompt for the final report.
- Use the same evidence packet for chat, valuation explanation, and counteroffer generation.
- Keep deterministic rights valuation in DealGuard code; ask GMI to explain and contextualize it, not invent the math.

### Recommended request

```json
{
  "model": "<GMI_MODEL>",
  "temperature": 0.2,
  "response_format": {"type": "json_object"},
  "messages": [
    {"role": "system", "content": "You are DealGuard, a creator-side commercial negotiation assistant. Return evidence-backed JSON."},
    {"role": "user", "content": "<normalized creator evidence + extracted deal terms + pricing calculation>"}
  ]
}
```

### What is already scaffolded

- OpenAI-compatible HTTP adapter.
- `GMI_API_KEY`, `GMI_BASE_URL`, `GMI_MODEL`, and timeout configuration.
- JSON response extraction.
- Retry-safe timeout/error result.
- Fallback report when the key is unavailable.

## 3. Lovable — app and connector platform

### What it provides

Lovable publicly describes Lovable Cloud as a backend with database, authentication, file storage, and serverless functions. Its connectors can connect apps and tools, and it supports custom connections for APIs/MCP-compatible services.

### How DealGuard should use it

For the hackathon, Lovable is the fastest path to:

- Build the creator workspace UI.
- Store creator profiles and decision packets if persistence is needed.
- Keep secrets out of browser code through a serverless backend.
- Add an HTTP/custom connector after the Oriane and Compound schemas are confirmed.

### What it should not do

- Do not put Oriane, GMI, or Compound secrets into client-side JavaScript.
- Do not use Lovable as a replacement for the provider adapters.
- Do not require a Lovable API key for the DealGuard user workflow unless the hackathon explicitly asks us to manage Lovable projects programmatically.

### What is already scaffolded

- `.env.example` includes optional Lovable values for future connector/project integration.
- Server boundary is compatible with a Lovable Cloud serverless function or a small Node service.
- No runtime dependency on Lovable API exists today.

## 4. Compound — campaign concept/video layer

### What it publicly provides

Compound’s public site presents it as an AI video editor that accepts clips and natural-language instructions, edits video, adds captions/graphics, remembers style, and can post to social platforms. The public site does not expose a documented general-purpose developer API in the material available to us.

### How DealGuard should use it

The output of DealGuard should be a structured `CampaignConcept`:

- Hook.
- Spoken script.
- Shot list.
- Creator-style references.
- Brand/product mentions.
- Compliance constraints.

At the event, send that concept to Compound using whichever approved path the sponsors provide:

1. Public API endpoint, if provided.
2. Webhook or MCP connector, if provided.
3. A handoff/export that the creator can paste into Compound.

### What is already scaffolded

- `CompoundAdapter` accepts a configurable base URL/path and returns a normalized concept result.
- If no API is configured, DealGuard renders the local concept preview and labels it as a handoff-ready concept.

### What must be confirmed at the event

- Whether Compound offers an API, MCP tool, webhook, or only the Mac app.
- Input format for clips and instructions.
- Output format and polling model.
- Whether the event credits cover programmatic generation.

We should not invent a Compound endpoint until the team gives us the integration details.

## 5. Environment and secret handling

- Real keys go in a local `.env`, never in `dist/app.js`.
- The browser calls only DealGuard server routes.
- The server calls providers with bearer keys.
- Logs must never print keys or full uploaded contracts/videos.
- Provider errors return a safe structured error and preserve the local fallback.

## 6. Runtime routes

```text
GET  /api/health
POST /api/analyze
POST /api/chat
POST /api/campaign-concept
```

Each route works in fallback mode immediately. When the required provider key/configuration is present, it attempts the live provider and returns `source: "live"`; otherwise it returns `source: "fallback"` and a `missingConfiguration` field for diagnosis.

The v2 browser is now wired to these routes through same-origin `fetch` calls. This keeps the browser contract stable while allowing the server adapter to change when private sponsor schemas arrive.

## 8. Browser resilience before keys arrive

The browser now has provider-neutral resilience behavior that does not require live credentials:

- Analysis shows a loading state, disables duplicate submits, and exposes `Retry analysis` after a timeout or transport failure.
- Creator AI shows a thinking indicator, disables duplicate sends, and restores the local answer when the gateway is unavailable.
- The report status identifies live sponsor reasoning versus prepared fallback data.
- Requests use an abortable client timeout. QA can set `window.DEALGUARD_SIMULATE_TIMEOUT = true` to exercise the timeout path deterministically.

These are client safeguards; they do not replace live provider verification once keys and private schemas are available.

## 9. Media source handoff

The browser now normalizes both creator-provided source types into the selected video collection:

- Public links carry their source hostname and URL-derived title into the server payload. Oriane mapping will later decide whether to index the URL directly or submit it to the provider's analysis endpoint.
- Local files currently become upload-ready source entries in the prototype. The production handoff must add multipart/object-storage handling once the Oriane event schema confirms whether raw media uploads are supported.

The UI intentionally does not transmit a local file to a third party yet; it records the source locally and preserves the fallback demo path until provider upload requirements are known.

## 10. Personal AI agency handoff

DealGuard now exports a provider-neutral `context.md` artifact rather than requiring a direct Butler/Claude integration. The artifact contains the creator context, selected content sources, current offer, recommendation, rights state, risks, and instructions for another AI to preserve creator boundaries.

This is intentionally a user-controlled handoff:

- `Copy context.md` supports paste-based AI workflows.
- `Download context.md` supports file-upload-based AI workflows.
- DealGuard does not transmit the file to another service automatically.
- A future direct integration may be added only after the target AI tool's connector/API and privacy model are confirmed.

## 11. Oriane REST documentation audit

Audited the complete public OpenAPI document at [Oriane REST docs](https://connect.oriane.xyz/rest/docs) on 2026-11-06.

### What the public API actually exposes

The document is OpenAPI 3.0, version 0.0.1, with server `https://connect.oriane.xyz` and three documented operations:

```text
POST /rest/contents/search
POST /rest/profiles/search
POST /rest/assets
```

`/rest/contents/search` is the important endpoint for DealGuard. It searches Oriane-indexed social content across Instagram, TikTok, and YouTube. It supports `sort`, `offset`, `limit` (1–100), `projection` (`basic`, `default`, `full`), and `aiSearchAnchor` query parameters.

The request body uses a required top-level `operator` (`and` or `or`) and optional `filters`/`queries`. Content filters include platform, external platform ID, format, profile, caption, transcript, on-screen text, hashtags, engagement metrics, publication date, audio, co-authors, mentions, location, and `visualSimilarity`. Nested query depth is limited to two; total filter values are limited to 500; visual-similarity values are limited to 10.

The default/full response contains normalized social evidence such as content ID, platform, title, caption, thumbnail, views, likes, shares, comments, interaction rates, profile metadata, media, transcripts, on-screen text, tags, and—on full projection—transcript chunks, frames, and popular comments. Results are wrapped with metadata including request ID, execution time, timestamp, and pagination. A `206` response represents partial/paginated results.

`/rest/assets` creates reusable text or image assets for visual search. Text assets are limited to 300 characters. The documented multipart upload supports images up to 20 MiB; it does not document video upload.

### Important gaps and corrections

1. The current `OrianeAdapter` default path `/api/analyze` is wrong for this public API. It must default to `/rest/contents/search`.
2. The current adapter sends DealGuard's internal `{videos, creatorContext, brandContext}` object directly. It must build Oriane's `{operator, filters, queries}` request and then normalize `data.results` into DealGuard evidence.
3. The public schema has no documented URL field or documented video-ingestion endpoint. A pasted TikTok/Instagram/YouTube URL cannot be sent as an arbitrary `analyze` request. We must either extract a platform post ID and search by `platformId`, confirm that Oriane indexes the URL on demand through a private event capability, or keep the source in fallback mode.
4. Local video upload is not supported by the documented `/rest/assets` operation. The UI may accept local files, but raw-file analysis needs a separate provider capability or a local/GMI processing path.
5. The public OpenAPI document does not declare a security scheme or show an authorization header in its examples. The API key is available in the Oriane workspace, but the exact header/query convention must be confirmed from the API-key panel or `#help-desk`; do not guess it in production.
6. The adapter should preserve `206`, `402`, `416`, and provider `requestId` information so the UI can distinguish partial results, exhausted credits, and pagination/anchor errors.

### What is already good enough

- Server-side provider boundary and secret isolation.
- Same-origin `/api/analyze` route and fallback behavior.
- Creator-selected source collection and evidence-oriented report.
- UI support for public links and local files as creator inputs.
- V2 rights simulator and transparent valuation remain provider-independent.
- The API can supply exactly the evidence fields needed for content fit, hooks, transcripts, on-screen text, and performance context once the adapter maps the response.

### Required implementation adjustment

Replace the generic Oriane analyze call with a contents-search adapter. Start with `projection=full`, a small `limit`, and URL-to-platform-ID parsing where possible. Normalize each result into `VideoEvidence`; pass that evidence to the existing DealGuard report/GMI reasoning layer. Keep local-file handling explicitly labeled as fallback until Oriane confirms video upload or an alternate ingestion route.

## 7. Key handoff checklist

When the hackathon team provides access:

1. Put keys in local `.env`.
2. Add the exact Oriane endpoint/request schema.
3. Call `/api/health` and inspect provider readiness.
4. Run one small Oriane request with one selected video.
5. Confirm normalized `VideoEvidence` fields.
6. Call GMI `/v1/models` and select an available model.
7. Run one structured report request.
8. Confirm Creator AI response and JSON parsing.
9. Confirm Compound integration mode/API or activate handoff mode.
10. Run the full browser test matrix with live data.

## Source notes

- [Oriane official site](https://www.oriane.xyz/) — video search, in-video signals, JSON/API/MCP description, and API docs link.
- [Oriane API docs entry](https://connect.oriane.xyz/rest/docs) — provider documentation surface; exact schema requires access.
- [GMI Cloud developer docs](https://www.gmicloud.ai/en/developers) — OpenAI-compatible endpoint and model discovery.
- [Lovable support](https://lovable.dev/support) — Lovable Cloud backend and integrations.
- [Lovable connectors](https://lovable.dev/connect) — connector/custom-connection model.
- [Compound](https://compound.mov/) — public editing, style memory, and posting capabilities; no public general API schema found.
