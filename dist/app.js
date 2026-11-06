const videos = [
  { id: 1, title: 'The 3-tab AI workflow', meta: '42.8K views · 8.2% saves', selected: true },
  { id: 2, title: 'I tried 7 AI note apps', meta: '18.4K views · 5.4% saves', selected: true },
  { id: 3, title: 'Build this in 10 minutes', meta: '66.1K views · 11.8% saves', selected: true },
  { id: 4, title: 'The honest tool review', meta: '29.7K views · 6.9% saves', selected: true },
  { id: 5, title: 'My creator stack', meta: '51.3K views · 9.1% saves', selected: true },
];

const state = { selectedVideos: new Set(videos.filter(v => v.selected).map(v => v.id)), reportVisible: false, apiSource: 'fallback', analyzing: false, chatting: false, lastAnalysisPayload: null };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderVideos() {
  $('#video-grid').innerHTML = videos.map(video => `
    <button class="video-card ${state.selectedVideos.has(video.id) ? 'selected' : ''}" data-video="${video.id}" aria-pressed="${state.selectedVideos.has(video.id)}">
      ${state.selectedVideos.has(video.id) ? '<span class="checkmark">✓</span>' : ''}
      <span class="video-number">0${video.id}</span><span class="video-play">▶</span>
      <span class="video-info"><b>${video.title}</b><small>${video.meta}</small></span>
    </button>`).join('');
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

function addVideoSource(title, meta) {
  const id = Math.max(...videos.map(video => video.id)) + 1;
  videos.push({ id, title, meta, selected: true, added: true });
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

function appendMessage(text, role) {
  const message = document.createElement('div'); message.className = `chat-bubble ${role}`; message.textContent = text;
  $('#chat-messages').appendChild(message); $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
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
  const loading = document.createElement('div'); loading.className = 'chat-bubble assistant loading-bubble'; loading.setAttribute('aria-label', 'Creator AI is thinking'); loading.innerHTML = '<i></i><i></i><i></i>'; $('#chat-messages').appendChild(loading);
  try {
    const result = await apiRequest('/api/chat', { question: prompt, creatorContext: creatorContext(), offer: $('#offer-input').value });
    state.apiSource = result.source || 'fallback';
    setProviderStatus(state.apiSource === 'live' ? 'Live sponsor reasoning active' : 'Using prepared fallback reasoning', state.apiSource === 'live' ? 'ready' : 'warning');
    loading.remove();
    appendMessage(result.answer || assistantAnswer(prompt), 'assistant');
  } catch (error) {
    loading.remove();
    appendMessage(assistantAnswer(prompt), 'assistant');
    setProviderStatus(error.name === 'AbortError' ? 'Creator AI timed out · fallback answer used' : 'Creator AI unavailable · fallback answer used', 'warning');
  } finally {
    state.chatting = false; input.disabled = false; send.disabled = false; input.focus();
  }
}

function updateSimulator() {
  const base = 500;
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
  state.reportVisible = true; $('#report-section').classList.remove('hidden');
  setProviderStatus('Analyzing selected videos and offer…', 'loading');
  $('#report-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  try {
    const result = await apiRequest('/api/analyze', state.lastAnalysisPayload);
    state.apiSource = result.source || 'fallback';
    setProviderStatus(state.apiSource === 'live' ? 'Live sponsor analysis complete' : 'Analysis complete · prepared fallback data', state.apiSource === 'live' ? 'ready' : 'warning');
    showToast(`Deal analyzed · ${state.apiSource === 'live' ? 'live sponsor data' : 'fallback data'}`);
  } catch (error) {
    setProviderStatus(error.name === 'AbortError' ? 'Analysis timed out · retry when ready' : 'Analysis failed · retry when ready', 'error', true);
    showToast('Deal analyzed · local fallback kept the flow running');
  } finally {
    state.analyzing = false; analyzeButton.disabled = false; analyzeButton.innerHTML = 'Analyze this deal <span>→</span>';
  }
}

renderVideos();
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
$('#reset-offer').addEventListener('click', () => { $('#offer-input').value = 'Hey Suharsha! We love your practical AI content and would love to partner on a 60-second TikTok/Instagram video for ClipForge. We can offer $500 for the post. We\'d also like 12 months of paid advertising usage, 6 months of exclusivity against competing creator tools, the raw footage, and unlimited revisions. Let us know if you\'re interested!'; showToast('Demo offer restored.'); });
$('#add-video-link').addEventListener('click', () => {
  const input = $('#video-link');
  const value = input.value.trim();
  if (!value) { input.focus(); showToast('Paste a video link first.'); return; }
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) throw new Error('Unsupported protocol');
    addVideoSource(`${url.hostname.replace(/^www\./, '')} video`, `${url.hostname.replace(/^www\./, '')} link · ready to analyze`);
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
