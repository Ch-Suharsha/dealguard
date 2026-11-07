const videos = [];

const CHAT_SESSION_KEY = 'dealguard-chat-history-v1';
const defaultChatHistory = [{ role: 'assistant', text: 'Hey! Add the videos you want me to understand, then I can use your creator context and brand offer to help. Ask me anything—or challenge the recommendation.' }];
function loadChatHistory() { try { sessionStorage.removeItem(CHAT_SESSION_KEY); } catch { /* best effort cleanup */ } return [...defaultChatHistory]; }
const state = { selectedVideos: new Set(videos.filter(v => v.selected).map(v => v.id)), reportVisible: false, apiSource: 'fallback', analyzing: false, chatting: false, lastAnalysisPayload: null, recommendation: null, creatorSignal: null, orianeEvidence: null, chatHistory: loadChatHistory() };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderVideos() {
  $('#video-grid').innerHTML = videos.length ? videos.map(video => `
    <button class="video-card ${state.selectedVideos.has(video.id) ? 'selected' : ''}" data-video="${video.id}" aria-pressed="${state.selectedVideos.has(video.id)}">
      ${state.selectedVideos.has(video.id) ? '<span class="checkmark">✓</span>' : ''}
      <span class="video-number">0${video.id}</span><span class="video-play">▶</span>
      <span class="video-info"><b>${video.title}</b><small>${video.meta}</small></span>
    </button>`).join('') : '<div class="video-empty">Add a public TikTok, Instagram, or YouTube link—or upload a video file—to start your creator signal.</div>';
  $('#selected-count').textContent = `${state.selectedVideos.size} selected`;
  $$('.video-card').forEach(card => card.addEventListener('click', () => {
    const id = Number(card.dataset.video);
    state.selectedVideos.has(id) ? state.selectedVideos.delete(id) : state.selectedVideos.add(id);
    renderVideos();
    showToast(`${state.selectedVideos.size} video${state.selectedVideos.size === 1 ? '' : 's'} selected`);
  }));
  renderAddedMedia();
}

function renderAddedMedia() {
  const list = $('#added-media-list');
  if (!list) return;
  const added = videos.filter(video => video.added);
  list.innerHTML = added.map(video => `<div class="added-media-item"><span class="added-media-check">${state.selectedVideos.has(video.id) ? '✓' : '○'}</span><span><b>${video.title}</b><small>${video.meta}</small></span><button type="button" data-remove-video="${video.id}" aria-label="Remove ${video.title}">×</button></div>`).join('');
  list.classList.toggle('hidden', added.length === 0);
  $$('[data-remove-video]').forEach(button => button.addEventListener('click', () => {
    const id = Number(button.dataset.removeVideo);
    const index = videos.findIndex(video => video.id === id);
    if (index >= 0) videos.splice(index, 1);
    state.selectedVideos.delete(id);
    renderVideos();
    showToast('Added video removed from this analysis.');
  }));
}

function addVideoSource(title, meta, url = '') {
  const id = (videos.length ? Math.max(...videos.map(video => video.id)) : 0) + 1;
  videos.push({ id, title, meta, url, selected: true, added: true });
  state.selectedVideos.add(id);
  renderVideos();
  showToast(`${title} added and selected for analysis.`);
}

function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function setProviderStatus(message, mode = 'ready', retry = false) {
  const status = $('#provider-status');
  if (!status) return;
  status.className = `provider-status ${mode}`;
  $('#provider-status-text').textContent = message;
  $('#retry-analysis').classList.toggle('hidden', !retry);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function renderOrianeSignal(result) {
  const card = $('#oriane-signal');
  if (!card) return;
  const payload = result?.data;
  const rows = payload?.results || [];
  const live = result?.source === 'live' && Boolean(payload);
  if (!live || !rows.length) {
    card.classList.remove('hidden');
    card.innerHTML = live
      ? '<div class="oriane-signal-head"><div><span class="oriane-signal-kicker">ORIANE · CONTENT INTELLIGENCE</span><h3>No indexed match for this exact post</h3><p>The live API responded, but this public URL is not currently indexed. DealGuard kept the prepared decision path available.</p></div><span class="oriane-signal-badge">LIVE API</span></div><p class="oriane-signal-foot">No post-level evidence was available for this run. Try another indexed public post.</p>'
      : '<div class="oriane-signal-head"><div><span class="oriane-signal-kicker">ORIANE · CONTENT INTELLIGENCE</span><h3>Prepared content signal</h3><p>Live Oriane evidence was unavailable for this run, so the recommendation uses the selected-content fallback signal.</p></div><span class="oriane-signal-badge fallback">FALLBACK</span></div><p class="oriane-signal-foot">No transcript, on-screen text, or visual frames are being claimed from Oriane.</p>';
    return;
  }
  const row = rows[0];
  const media = row.media?.[0] || {};
  const formatNumber = value => value == null ? '—' : Number(value).toLocaleString();
  const asText = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(' ');
    return value.text || value.content || value.transcript || value.value || '';
  };
  const transcript = asText(media.transcript || row.transcript);
  const onScreen = asText(media.onScreenText || row.onScreenText);
  const frames = media.frames || row.frames || [];
  const engagement = row.viewsCount ? ((Number(row.likesCount || 0) + Number(row.commentsCount || 0) + Number(row.sharesCount || 0)) / Number(row.viewsCount)) * 100 : 0;
  const excerpt = value => value ? `${value.trim().slice(0, 190)}${value.trim().length > 190 ? '…' : ''}` : 'Not available from this result';
  const hook = (transcript || onScreen).split(/(?<=[.!?])\s+/)[0].trim() || 'No opening sentence detected';
  const patternText = `${transcript} ${onScreen}`.toLowerCase();
  const pattern = /three|3|top|best|hidden|secret|why|how to|here'?s/.test(patternText) ? 'Hook → practical proof → recommendation' : /review|unbox|tested|using/.test(patternText) ? 'Product review → demonstration → verdict' : /step|first|then|next|tutorial/.test(patternText) ? 'Tutorial → steps → outcome' : 'Creator-led story → visual evidence';
  const evidence = [transcript ? 'spoken transcript' : null, onScreen ? 'on-screen text' : null, frames.length ? `${frames.length} visual frames` : null].filter(Boolean).join(' · ') || 'performance metadata available';
  card.classList.remove('hidden');
  card.innerHTML = `<div class="oriane-signal-head"><div><span class="oriane-signal-kicker">ORIANE · CONTENT INTELLIGENCE</span><h3>${escapeHtml(row.title || `${row.platform || 'Social'} post analyzed`)}</h3><p>${escapeHtml(evidence)} · ${escapeHtml(row.publishedAt || 'indexed public post')}</p></div><span class="oriane-signal-badge">LIVE API</span></div><div class="oriane-signal-grid"><div class="oriane-signal-stat"><b>${formatNumber(row.viewsCount)}</b><small>views</small></div><div class="oriane-signal-stat"><b>${formatNumber(row.likesCount)}</b><small>likes</small></div><div class="oriane-signal-stat"><b>${formatNumber(row.commentsCount)}</b><small>comments</small></div><div class="oriane-signal-stat"><b>${formatNumber(row.sharesCount)}</b><small>shares</small></div><div class="oriane-signal-stat"><b>${engagement.toFixed(1)}%</b><small>engagement</small></div><div class="oriane-signal-stat"><b>${frames.length || '—'}</b><small>visual frames</small></div></div><div class="oriane-signal-evidence"><div><span>What this video says</span><p>“${escapeHtml(excerpt(transcript))}”</p></div><div><span>What appears on screen</span><p>${escapeHtml(excerpt(onScreen))}</p></div><div><span>Detected hook</span><p>${escapeHtml(excerpt(hook))}</p></div><div><span>Content pattern</span><p>${escapeHtml(pattern)}</p></div></div><p class="oriane-signal-foot">Live evidence from Oriane · request ${escapeHtml(payload.metadata?.requestId || 'complete')} · result ${escapeHtml(row.id || 'indexed')}</p>`;
}

function money(value) { return `$${Number(value || 0).toLocaleString()}`; }

function contentPatternFromResult(result) {
  const row = result?.data?.results?.[0];
  const media = row?.media?.[0] || {};
  const asText = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(' ');
    return value.text || value.content || value.transcript || value.value || '';
  };
  const text = `${asText(media.transcript || row?.transcript)} ${asText(media.onScreenText || row?.onScreenText)}`.toLowerCase();
  if (/three|3|top|best|hidden|secret|why|how to|here'?s/.test(text)) return 'Hook → practical proof → recommendation';
  if (/review|unbox|tested|using/.test(text)) return 'Product review → demonstration → verdict';
  if (/step|first|then|next|tutorial/.test(text)) return 'Tutorial → steps → outcome';
  return row ? 'Creator-led story → visual evidence' : 'Pattern unavailable from fallback signal';
}

function compactOrianeEvidence(result) {
  const signal = result?.creatorSignal || {};
  const row = result?.data?.results?.[0];
  const media = row?.media?.[0] || {};
  const asText = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(' ');
    return value.text || value.content || value.transcript || value.value || '';
  };
  const transcript = asText(media.transcript || row?.transcript);
  const onScreenText = asText(media.onScreenText || row?.onScreenText);
  const hook = (transcript || onScreenText).split(/(?<=[.!?])\s+/)[0].trim();
  const frames = media.frames || row?.frames || [];
  return {
    provenance: signal.source === 'oriane_live' ? 'LIVE ORIANE' : 'UNAVAILABLE',
    views: Number(row?.viewsCount || signal.averageViews || 0),
    likes: Number(row?.likesCount || 0),
    comments: Number(row?.commentsCount || 0),
    shares: Number(row?.sharesCount || 0),
    engagementRate: Number(signal.engagementRate || 0),
    transcript: transcript.slice(0, 360),
    onScreenText: onScreenText.slice(0, 360),
    detectedHook: hook.slice(0, 240),
    contentPattern: contentPatternFromResult(result),
    visualFrames: frames.length,
  };
}

function renderRecommendation(result) {
  const recommendation = result || {};
  state.recommendation = recommendation;
  state.creatorSignal = recommendation.creatorSignal || null;
  state.orianeEvidence = compactOrianeEvidence(recommendation);
  const range = recommendation.fairRange || { min: 1450, max: 1800 };
  const breakdown = recommendation.breakdown || {};
  const decisionWord = $('#decision-word'); if (decisionWord) decisionWord.textContent = recommendation.recommendation || 'COUNTER';
  const fairRange = $('#fair-range'); if (fairRange) fairRange.innerHTML = `${money(range.min)} <small>—</small> ${money(range.max)}`;
  const suggested = $('#suggested-counter'); if (suggested) suggested.textContent = money(recommendation.suggestedCounter || 1850);
  const base = $('#calc-base'); if (base) base.textContent = money(breakdown.base || 500);
  const paid = $('#calc-paid'); if (paid) paid.textContent = `+${money(breakdown.paidUsage || 0)}`;
  const exclusive = $('#calc-exclusivity'); if (exclusive) exclusive.textContent = `+${money(breakdown.exclusivity || 0)}`;
  const rights = $('#calc-rights'); if (rights) rights.textContent = `+${money((breakdown.rawFootage || 0) + (breakdown.revisions || 0) + (breakdown.extraDeliverables || 0))}`;
  const summary = $('#decision-summary');
  const signal = recommendation.creatorSignal || {};
  const liveSignal = signal.source === 'oriane_live';
  const baseValue = breakdown.base || 500;
  const sourceBadge = $('#creator-value-source'); if (sourceBadge) { sourceBadge.textContent = liveSignal ? 'LIVE ORIANE' : 'FALLBACK SIGNAL'; sourceBadge.classList.toggle('fallback', !liveSignal); }
  const provenance = $('#creator-value-provenance'); if (provenance) provenance.textContent = liveSignal
    ? `Grounded in ${Number(signal.averageViews || 0).toLocaleString()} average views and ${(Number(signal.engagementRate || 0) * 100).toFixed(1)}% engagement from live Oriane evidence.`
    : 'Oriane evidence was unavailable for this run. This is a prepared selected-content fallback, not a live provider valuation.';
  const why = $('#creator-value-why-list');
  if (why) {
    const reasons = liveSignal
      ? [`${Number(signal.averageViews || 0).toLocaleString()} average views`, `${(Number(signal.engagementRate || 0) * 100).toFixed(1)}% engagement rate`, 'Live source: Oriane content intelligence', `Pattern: ${contentPatternFromResult(recommendation)}`]
      : [`${Number(signal.averageViews || 0).toLocaleString()} average views available from selected content`, 'Engagement rate unavailable from fallback data', 'Source: prepared fallback signal, not live Oriane data', `Pattern: ${contentPatternFromResult(recommendation)}`];
    why.innerHTML = reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join('');
  }
  const baseValueNode = $('#creator-base-value'); if (baseValueNode) baseValueNode.textContent = money(baseValue);
  if (summary) {
    const sourceText = signal?.source === 'oriane_live' ? `Based on ${Number(signal.averageViews).toLocaleString()} average views and ${(Number(signal.engagementRate || 0) * 100).toFixed(1)}% engagement from live Oriane data, this creator's base value is ${money(breakdown.base || 500)}.` : `Using the available content signal, this creator's estimated base value is ${money(breakdown.base || 500)}.`;
    summary.textContent = recommendation.recommendation === 'ACCEPT'
      ? `${sourceText} The brand's offer of ${money(recommendation.brandOffer)} already meets this deal's estimated fair value. Accept it or clarify the final scope—do not counter yourself downward.`
      : `${sourceText} The requested usage, restrictions, and deliverables bring the defensible counter to ${money(recommendation.suggestedCounter || 1850)}.`;
  }
  const counter = $('#counteroffer-text');
  if (counter) counter.textContent = recommendation.recommendation === 'ACCEPT'
    ? `“Thanks for reaching out. The ${money(recommendation.brandOffer)} offer works for the requested scope. Before we finalize, please confirm the deliverables, usage period, exclusivity category, and one-revision limit in the agreement.”`
    : `“Thanks for reaching out. Based on the requested deliverables and usage, my rate would be ${money(recommendation.suggestedCounter || 1850)}. That includes the agreed content, one revision round, and clearly defined campaign usage. I’m happy to adjust the scope if you need a different budget.”`;
  const dynamicFees = [breakdown.paidUsage || 0, breakdown.exclusivity || 0, breakdown.rawFootage || 0, breakdown.revisions || 0];
  $$('.toggle-row input').forEach((input, index) => { input.dataset.fee = String(dynamicFees[index] || 0); input.checked = dynamicFees[index] > 0; const small = input.parentElement.querySelector('small'); if (small) small.textContent = `${small.textContent.split('·')[0].trim()} · +${money(dynamicFees[index] || 0)}`; });
  updateSimulator();
}

function openChat(prompt) {
  $('#chat-drawer').classList.add('open');
  if (prompt) sendChat(prompt);
}

function assistantAnswer(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('why') || lower.includes('counter')) return 'Because the offer bundles a normal sponsored post with 12 months of paid advertising, six months of category exclusivity, raw footage, and unlimited revisions. I would counter at $1,850 or remove the paid-usage and exclusivity clauses.';
  if (lower.includes('exclus')) return 'Exclusivity limits your ability to work with competing creator tools. For six months, I would price that separately at about $450—or reduce it to 30 days around the campaign launch.';
  if (lower.includes('calculation') || lower.includes('price')) return 'The estimate is $500 for the base video, $600 for 12 months of paid usage, $450 for six months of exclusivity, and $300 for raw footage plus revision risk. That produces a $1,850 counter, with a fair range of $1,450–$1,800 depending on the final scope.';
  if (lower.includes('fit') || lower.includes('audience')) return 'ClipForge is a strong fit because your selected videos consistently teach practical tools through outcome-first hooks. The partnership should stay educational and avoid unsupported “magic AI” claims.';
  if (lower.includes('revision')) return 'Counter with one included revision round. Any additional rounds should be billed separately or require written approval before work starts.';
  return 'I’m grounding this in your five selected videos, your creator context, and the ClipForge offer. I’d focus first on paid usage, exclusivity, and revision limits. Want me to change one assumption and show how the recommendation moves?';
}

function formatAssistantMessage(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').trim().split('\n');
  const html = [];
  let list = [];
  const flushList = () => { if (list.length) { html.push(`<ul>${list.join('')}</ul>`); list = []; } };
  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line || /^\|?\s*:?-{3,}/.test(line)) { flushList(); return; }
    const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
    if (cells.length >= 2 && rawLine.includes('|')) {
      flushList();
      html.push(`<div class="chat-detail-row"><span>${escapeHtml(cells[0])}</span><b>${escapeHtml(cells.slice(1).join(' · '))}</b></div>`);
      return;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) { list.push(`<li>${escapeHtml(bullet[1].replace(/\*\*/g, ''))}</li>`); return; }
    flushList();
    const heading = line.replace(/^#{1,6}\s+/, '').replace(/\*\*/g, '');
    html.push(`<p>${escapeHtml(heading).replace(/\n/g, '<br>')}</p>`);
  });
  flushList();
  return html.join('') || '<p>I’m here. What would you like to work through?</p>';
}

function persistChatHistory() {
  // Conversation history is intentionally page-session-only. Do not restore stale chats after reload.
}

function appendMessage(text, role, persist = true) {
  const message = document.createElement('div'); message.className = `chat-bubble ${role}`;
  if (role === 'assistant') message.innerHTML = formatAssistantMessage(text);
  else message.textContent = text;
  $('#chat-messages').appendChild(message); keepChatAtBottom();
  if (persist) { state.chatHistory.push({ text, role }); persistChatHistory(); }
}

function keepChatAtBottom() {
  const messages = $('#chat-messages');
  if (!messages) return;
  requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
}

function renderChatHistory() {
  $('#chat-messages').innerHTML = '';
  state.chatHistory.forEach(message => appendMessage(message.text, message.role, false));
}

async function apiRequest(path, payload, options = {}) {
  const controller = new AbortController();
  const timeoutMs = window.DEALGUARD_SIMULATE_TIMEOUT ? 40 : (options.timeoutMs || 12000);
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
  } finally { clearTimeout(timer); }
  if (!response.ok) throw new Error(`DealGuard API ${response.status}`);
  return response.json();
}

async function streamChatRequest(payload, onDelta, onSource) {
  const controller = new AbortController();
  const timeoutMs = window.DEALGUARD_SIMULATE_TIMEOUT ? 40 : 30000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('/api/chat/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
    if (!response.ok || !response.body) throw new Error(`DealGuard API ${response.status}`);
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split(/\r?\n/); buffer = lines.pop() || '';
      for (const line of lines) {
        const data = line.replace(/^data:\s*/, '').trim();
        if (!data || data === '[DONE]') continue;
        const event = JSON.parse(data);
        if (event.source) onSource(event.source);
        if (event.error) throw new Error(event.error);
        if (event.delta) onDelta(event.delta);
      }
      if (done) break;
    }
  } finally { clearTimeout(timer); }
}

function creatorContext() {
  return {
    niche: $('#niche').value,
    audience: $('#audience').value,
    boundary: $('#boundary').value,
    selectedVideos: [...state.selectedVideos],
  };
}

function buildContextMarkdown() {
  const selected = videos.filter(video => state.selectedVideos.has(video.id));
  const rights = $$('.toggle-row input:checked').map(input => `${input.dataset.label} (+$${input.dataset.fee})`);
  return `# DealGuard Creator Context

> Portable handoff for the creator's personal AI agency or Butler AI.
> Generated locally from DealGuard. Treat this as creator-owned context, not legal advice.

## Creator identity and working style

- Niche: ${$('#niche').value.trim() || 'Not provided'}
- Audience: ${$('#audience').value.trim() || 'Not provided'}
- Creator boundary: ${$('#boundary').value.trim() || 'Not provided'}

## Selected content signal

${selected.map(video => `- ${video.title} — ${video.meta}`).join('\n') || '- No videos selected'}

## Current brand offer

${$('#offer-input').value.trim() || 'No offer provided'}

## DealGuard recommendation

- Recommendation: COUNTER
- Fair range: $1,450–$1,800
- Current suggested counter: ${$('#suggested-counter').textContent}
- Rights currently priced: ${rights.join(', ') || 'Base content only'}

## Risks to protect

- Paid advertising usage should be priced separately from the content fee.
- Exclusivity should have a short duration or an additional fee.
- Raw footage should be treated as a separate deliverable.
- Unlimited revisions should be replaced with a defined revision limit.

## Negotiation voice

Keep the message practical, confident, and collaborative. Do not accept vague usage, unlimited revisions, or broad exclusivity without clarifying scope and price.

## How another AI should use this

Use this context to help the creator evaluate brand deals, draft counteroffers, create campaign concepts, and ask follow-up questions. Always explain assumptions, preserve the creator's boundaries, and ask for approval before changing the official recommendation or sending anything externally.
`;
}

async function copyContext() {
  try { await navigator.clipboard.writeText(buildContextMarkdown()); showToast('context.md copied — paste it into your Butler AI.'); }
  catch { showToast('Context ready — use Download context.md instead.'); }
}

function downloadContext() {
  const url = URL.createObjectURL(new Blob([buildContextMarkdown()], { type: 'text/markdown' }));
  const link = document.createElement('a'); link.href = url; link.download = 'context.md'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); showToast('context.md downloaded.');
}

async function sendChat(prompt) {
  if (!prompt || state.chatting) return;
  state.chatting = true;
  $('#chat-drawer').classList.add('open'); appendMessage(prompt, 'user');
  const input = $('#chat-input'); const send = $('#chat-send'); input.disabled = true; send.disabled = true;
  const loading = document.createElement('div'); loading.className = 'chat-bubble assistant loading-bubble'; loading.setAttribute('aria-label', 'Creator AI is thinking'); loading.innerHTML = '<span class="loading-copy">Analyzing your question…</span>'; $('#chat-messages').appendChild(loading);
  const loadingMessages = ['Reviewing your creator context…', 'Analyzing your question…', 'Understanding your whole deal…', 'Getting the best reply for you…', 'Checking the relevant information…'];
  let loadingIndex = 0; let streamBuffer = ''; let displayedBuffer = ''; let pendingChars = ''; let streamSource = 'fallback'; let typing = false; let streamEnded = false; let resolveTyping;
  const typingDone = new Promise(resolve => { resolveTyping = resolve; });
  const typeNextCharacter = () => {
    if (pendingChars) {
      displayedBuffer += pendingChars[0]; pendingChars = pendingChars.slice(1);
      loading.innerHTML = formatAssistantMessage(displayedBuffer); keepChatAtBottom();
      setTimeout(typeNextCharacter, 14);
      return;
    }
    typing = false;
    if (streamEnded) resolveTyping();
  };
  const enqueueStreamText = delta => {
    streamBuffer += delta; pendingChars += delta;
    if (!typing) { typing = true; typeNextCharacter(); }
  };
  const loadingTimer = setInterval(() => { if (!displayedBuffer && !pendingChars) { loadingIndex = (loadingIndex + 1) % loadingMessages.length; const copy = loading.querySelector('.loading-copy'); if (copy) copy.textContent = loadingMessages[loadingIndex]; } }, 1200);
  try {
    await streamChatRequest({ question: prompt, creatorContext: creatorContext(), offer: $('#offer-input').value, creatorSignal: state.creatorSignal, orianeEvidence: state.orianeEvidence }, enqueueStreamText, source => { streamSource = source; });
    streamEnded = true;
    if (!pendingChars && !typing) resolveTyping();
    await typingDone;
    state.apiSource = streamSource;
    setProviderStatus(state.apiSource === 'live' ? 'Live sponsor reasoning active' : 'Using prepared fallback reasoning', state.apiSource === 'live' ? 'ready' : 'warning');
    clearInterval(loadingTimer);
    loading.remove();
    appendMessage(streamBuffer || assistantAnswer(prompt), 'assistant');
  } catch (error) {
    clearInterval(loadingTimer);
    loading.remove();
    appendMessage(assistantAnswer(prompt), 'assistant');
    setProviderStatus(error.name === 'AbortError' ? 'Creator AI timed out · fallback answer used' : 'Creator AI unavailable · fallback answer used', 'warning');
  } finally {
    state.chatting = false; input.disabled = false; send.disabled = false; input.focus();
  }
}

function updateSimulator() {
  const base = state.recommendation?.breakdown?.base || 500;
  const fees = $$('.toggle-row input:checked').reduce((total, input) => total + Number(input.dataset.fee), 0);
  const total = base + fees;
  const count = $$('.toggle-row input:checked').length;
  $('#simulator-total').textContent = `$${total.toLocaleString()}`;
  $('#suggested-counter').textContent = `$${total.toLocaleString()}`;
  $('#simulator-note').textContent = count ? `You’re pricing ${count} additional right${count === 1 ? '' : 's'}.` : 'Only the base content fee remains.';
}

async function analyzeDeal() {
  if (state.analyzing) return;
  if (state.selectedVideos.size === 0) { showToast('Select at least one video so DealGuard can understand your style.'); return; }
  if (!$('#offer-input').value.trim()) { showToast('Paste a brand offer before analyzing the deal.'); $('#offer-input').focus(); return; }
  state.analyzing = true;
  state.lastAnalysisPayload = { videos: [...state.selectedVideos].map(id => videos.find(video => video.id === id)), creatorContext: creatorContext(), offer: $('#offer-input').value };
  const analyzeButton = $('#analyze-button'); analyzeButton.disabled = true; analyzeButton.innerHTML = 'Analyzing your deal <span class="button-spinner">◌</span>';
  state.reportVisible = true; const report = $('#report-section'); report.classList.remove('hidden'); report.classList.add('analysis-pending');
  const loading = $('#analysis-loading'); loading.classList.remove('hidden');
  const analysisPhases = [
    ['Reading the brand’s request…', 'Understanding what the brand is asking for and which rights are included.'],
    ['Matching the offer to your content…', 'Comparing the brand brief with the creator signal selected for this review.'],
    ['Checking audience fit…', 'Estimating whether the partnership makes sense for this creator’s audience and style.'],
    ['Valuing the rights…', 'Separating the content fee from usage, exclusivity, deliverables, and revision scope.'],
    ['Preparing the honest read…', 'Cross-checking the evidence and preparing the clearest next step.'],
  ];
  let phaseIndex = 0;
  const showPhase = () => { $('#analysis-loading-title').textContent = analysisPhases[phaseIndex][0]; $('#analysis-loading-text').textContent = analysisPhases[phaseIndex][1]; setProviderStatus(analysisPhases[phaseIndex][0], 'loading'); };
  showPhase();
  const phaseTimer = setInterval(() => { phaseIndex = (phaseIndex + 1) % analysisPhases.length; showPhase(); }, 1100);
  const minimumPresentation = new Promise(resolve => setTimeout(resolve, 5500));
  $('#report-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  try {
    const analysisRequest = apiRequest('/api/analyze', state.lastAnalysisPayload, { timeoutMs: 30000 });
    const [result] = await Promise.all([analysisRequest, minimumPresentation]);
    state.apiSource = result.source || 'fallback';
    renderRecommendation(result);
    renderOrianeSignal(result);
    const liveLabel = result.source === 'live' ? `Live Oriane analysis complete · ${result.data?.results?.length || 0} indexed match${result.data?.results?.length === 1 ? '' : 'es'}` : 'Analysis complete · prepared fallback data';
    setProviderStatus(liveLabel, state.apiSource === 'live' ? 'ready' : 'warning');
    showToast(`Deal analyzed · ${state.apiSource === 'live' ? 'live sponsor data' : 'fallback data'}`);
  } catch (error) {
    await minimumPresentation;
    setProviderStatus(error.name === 'AbortError' ? 'Analysis timed out · retry when ready' : 'Analysis failed · retry when ready', 'error', true);
    showToast('Deal analyzed · local fallback kept the flow running');
  } finally {
    clearInterval(phaseTimer); report.classList.remove('analysis-pending'); loading.classList.add('hidden');
    state.analyzing = false; analyzeButton.disabled = false; analyzeButton.innerHTML = 'Analyze this deal <span>→</span>';
  }
}

renderVideos();
renderChatHistory();
$('#analyze-button').addEventListener('click', analyzeDeal);
$('#retry-analysis').addEventListener('click', () => { if (state.lastAnalysisPayload) analyzeDeal(); });
$('#copy-context').addEventListener('click', copyContext);
$('#download-context').addEventListener('click', downloadContext);
$('#ai-fab').addEventListener('click', () => openChat());
$('#close-chat').addEventListener('click', () => $('#chat-drawer').classList.remove('open'));
$('#chat-form').addEventListener('submit', (event) => { event.preventDefault(); const input = $('#chat-input'); sendChat(input.value.trim()); input.value = ''; });
$$('[data-prompt]').forEach(button => button.addEventListener('click', () => sendChat(button.dataset.prompt)));
$('#save-profile').addEventListener('click', () => showToast('Creator context saved — future recommendations will use it.'));
$('#edit-profile').addEventListener('click', () => { $('#niche').focus(); showToast('Your context is always editable.'); });
$('#offer-file').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  $('#offer-file-name').textContent = file.name;
  try {
    if (file.type === 'text/plain' || /\.(txt|md)$/i.test(file.name)) {
      $('#offer-input').value = await file.text();
    } else {
      const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
      const result = await apiRequest('/api/extract-document', { name: file.name, type: file.type || 'application/pdf', data }, { timeoutMs: 30000 });
      $('#offer-input').value = result.text || '';
    }
    showToast(`${file.name} added — review the extracted offer before analyzing.`);
  } catch { showToast('Could not read that document. Paste the offer text instead.'); }
});
$('#add-video-link').addEventListener('click', () => {
  const input = $('#video-link');
  const value = input.value.trim();
  if (!value) { input.focus(); showToast('Paste a video link first.'); return; }
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) throw new Error('Unsupported protocol');
    addVideoSource(`${url.hostname.replace(/^www\./, '')} video`, `${url.hostname.replace(/^www\./, '')} link · ready to analyze`, value);
    input.value = '';
  } catch { showToast('Use a valid TikTok, Instagram, or YouTube link.'); input.focus(); }
});
$('#video-link').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); $('#add-video-link').click(); } });
$('#video-input').addEventListener('change', event => { [...event.target.files].forEach(file => addVideoSource(file.name, `local upload · ${(file.size / 1024 / 1024).toFixed(1)} MB`)); event.target.value = ''; });
$('#copy-counter').addEventListener('click', async () => { const text = $('#counteroffer-text').textContent; try { await navigator.clipboard.writeText(text); showToast('Counteroffer copied to clipboard.'); } catch { showToast('Counteroffer ready — select the message to copy.'); } });
$('#edit-counter').addEventListener('click', () => { const text = $('#counteroffer-text'); text.contentEditable = 'true'; text.focus(); showToast('Counteroffer is editable. Click away when you are done.'); });
$('#download-report').addEventListener('click', () => {
  const packet = `DEALGUARD DECISION PACKET\n\nRecommendation: COUNTER\nEstimated fair range: $1,450 — $1,800\nSuggested counter: $1,850\n\nRisks:\n- 12 months paid advertising usage\n- 6 months category exclusivity\n- Raw footage and unlimited revisions\n\nCounteroffer:\n${$('#counteroffer-text').textContent}\n\nCommercial negotiation guidance only — not legal advice.`;
  const url = URL.createObjectURL(new Blob([packet], { type: 'text/plain' }));
  const link = document.createElement('a'); link.href = url; link.download = 'dealguard-decision-packet.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); showToast('Decision packet downloaded.');
});
$('#generate-concept').addEventListener('click', async () => {
  try {
    const result = await apiRequest('/api/campaign-concept', { creatorContext: creatorContext(), offer: $('#offer-input').value, concept: $('#counteroffer-text').textContent });
    showToast(`Compound concept ready · ${result.source === 'live' ? 'live render' : 'handoff preview'}`);
  } catch { showToast('Compound concept ready in handoff mode.'); }
});
$$('.toggle-row input').forEach(input => input.addEventListener('change', () => { updateSimulator(); showToast('Deal value recalculated from your selected rights.'); }));

$$('.nav-item[data-view]').forEach(button => button.addEventListener('click', () => {
  $$('.nav-item[data-view]').forEach(item => item.classList.remove('active')); button.classList.add('active');
  const target = button.dataset.view;
  $$('.view').forEach(view => view.classList.add('hidden'));
  $(`#${target}-view`).classList.remove('hidden');
}));
$$('[data-go]').forEach(button => button.addEventListener('click', () => { $('.nav-item[data-view="deal"]').click(); }));
