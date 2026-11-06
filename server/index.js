const http = require('http');
const fs = require('fs');
const path = require('path');
const { CompoundAdapter, GmiAdapter, OrianeAdapter, ProviderNotConfiguredError, providerHealth } = require('./integrations');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function loadDotEnv(filename) {
  if (!fs.existsSync(filename)) return;
  const contents = fs.readFileSync(filename, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

loadDotEnv(path.join(root, '.env'));
const port = Number(process.env.PORT || 4173);

function fallbackAnalysis(input = {}) {
  const offer = String(input.offer || '');
  const hasPaidUsage = /paid advertising|whitelisting|paid usage/i.test(offer);
  const hasExclusivity = /exclusivity|exclusive/i.test(offer);
  return {
    source: 'fallback',
    recommendation: 'COUNTER',
    confidence: 0.87,
    fairRange: { min: 1450, max: 1800 },
    suggestedCounter: 1850,
    risks: [
      hasPaidUsage ? '12 months paid advertising usage' : 'Confirm whether paid usage is included',
      hasExclusivity ? '6 months category exclusivity' : 'Confirm whether exclusivity is included',
      'Raw footage and unlimited revisions',
    ],
    assumptions: ['Base 60-second video is worth $500', 'Paid usage and exclusivity are priced separately'],
    evidence: input.videos || [],
  };
}

function fallbackChat(question) {
  return { source: 'fallback', answer: `I’m using your creator context and current offer. Focus first on paid usage, exclusivity, raw footage, and revision limits. Your question was: ${question}` };
}

function fallbackConcept() {
  return { source: 'handoff', title: 'I replaced my 5-tab AI workflow with one clean timeline.', hook: 'Show the outcome first, then the workflow.', format: '60-second creator-style sponsored video' };
}

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(payload));
}

function sendFile(response, pathname) {
  const safePath = path.normalize(path.join(dist, pathname === '/' ? 'index.html' : pathname));
  if (!safePath.startsWith(dist)) return sendJson(response, 403, { error: 'Forbidden' });
  fs.readFile(safePath, (error, data) => {
    if (error) return sendJson(response, 404, { error: 'Not found' });
    const type = safePath.endsWith('.html') ? 'text/html' : safePath.endsWith('.css') ? 'text/css' : 'application/javascript';
    response.writeHead(200, { 'Content-Type': type }); response.end(data);
  });
}

async function readBody(request) {
  let body = ''; for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

async function handleApi(request, response, pathname) {
  if (request.method === 'GET' && pathname === '/api/health') return sendJson(response, 200, { ok: true, providers: providerHealth() });
  try {
    const input = await readBody(request);
    if (request.method === 'POST' && pathname === '/api/analyze') {
      const adapter = new OrianeAdapter();
      if (adapter.configured) {
        try { return sendJson(response, 200, { source: 'live', provider: 'oriane', data: await adapter.analyze(input) }); }
        catch (error) { return sendJson(response, 200, { ...fallbackAnalysis(input), providerError: error.message, fallbackReason: 'oriane_request_failed' }); }
      }
      return sendJson(response, 200, fallbackAnalysis(input));
    }
    if (request.method === 'POST' && pathname === '/api/chat') {
      const adapter = new GmiAdapter();
      if (adapter.configured) {
        try {
          const result = await adapter.chat([{ role: 'system', content: 'You are DealGuard, a creator-side commercial negotiation assistant. Be concise and evidence-backed.' }, { role: 'user', content: JSON.stringify(input) }]);
          return sendJson(response, 200, { source: 'live', provider: 'gmi', answer: result.choices?.[0]?.message?.content || '' });
        } catch (error) { return sendJson(response, 200, { ...fallbackChat(input.question), providerError: error.message, fallbackReason: 'gmi_request_failed' }); }
      }
      return sendJson(response, 200, fallbackChat(input.question));
    }
    if (request.method === 'POST' && pathname === '/api/campaign-concept') {
      const adapter = new CompoundAdapter();
      if (adapter.configured) {
        try { return sendJson(response, 200, { source: 'live', provider: 'compound', data: await adapter.createConcept(input) }); }
        catch (error) { return sendJson(response, 200, { ...fallbackConcept(), providerError: error.message, fallbackReason: 'compound_request_failed' }); }
      }
      return sendJson(response, 200, fallbackConcept());
    }
    return sendJson(response, 404, { error: 'API route not found' });
  } catch (error) {
    const status = error instanceof ProviderNotConfiguredError ? 200 : 400;
    return sendJson(response, status, { error: error.message, provider: error.provider, missingConfiguration: error.missingConfiguration });
  }
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  if (pathname.startsWith('/api/')) return handleApi(request, response, pathname);
  return sendFile(response, pathname);
});

server.listen(port, '127.0.0.1', () => console.log(`DealGuard server running at http://127.0.0.1:${port}`));
