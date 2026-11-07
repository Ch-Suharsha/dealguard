const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const { CompoundAdapter, GmiAdapter, OrianeAdapter, ProviderNotConfiguredError, providerHealth } = require('./integrations');
const { computeDealRecommendation } = require('./recommendation');
const execFileAsync = promisify(execFile);

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
  const recommendation = computeDealRecommendation(input);
  return {
    source: 'fallback',
    ...recommendation,
  };
}

function fallbackChat(question) {
  return { source: 'fallback', answer: `I’m using your creator context and current offer. Focus first on paid usage, exclusivity, raw footage, and revision limits. Your question was: ${question}` };
}

function fallbackConcept() {
  return { source: 'handoff', title: 'I replaced my 5-tab AI workflow with one clean timeline.', hook: 'Show the outcome first, then the workflow.', format: '60-second creator-style sponsored video' };
}

function creatorMessages(input = {}) {
  return [
    { role: 'system', content: 'You are DealGuard, a thoughtful creator-side commercial negotiation advisor. Talk like a sharp, empathetic human advisor in a chat: answer the creator directly, explain the reasoning plainly, and ask one useful follow-up when appropriate. Keep replies concise (usually 2–5 short paragraphs). Do not use Markdown tables, bold markers, headings, or raw formatting. If you need a list, use simple short bullets. Base claims on the supplied creator context and offer; do not invent performance data.' },
    { role: 'user', content: JSON.stringify(input) },
  ];
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

async function extractDocument(input = {}) {
  const raw = String(input.data || '');
  if (!raw) throw new Error('No document data provided');
  const encoded = raw.includes(',') ? raw.slice(raw.indexOf(',') + 1) : raw;
  if (Buffer.byteLength(encoded, 'base64') > 15 * 1024 * 1024) throw new Error('Document is larger than the 15 MB limit');
  if (input.type === 'text/plain' || /\.(txt|md)$/i.test(String(input.name || ''))) return { text: Buffer.from(encoded, 'base64').toString('utf8'), filename: input.name || 'document.txt' };
  if (input.type !== 'application/pdf' && !/\.pdf$/i.test(String(input.name || ''))) throw new Error('Only PDF, TXT, and Markdown offer documents are supported');
  const filename = path.join(os.tmpdir(), `dealguard-${crypto.randomUUID()}.pdf`);
  await fs.promises.writeFile(filename, Buffer.from(encoded, 'base64'));
  try {
    const { stdout } = await execFileAsync('pdftotext', [filename, '-'], { maxBuffer: 4 * 1024 * 1024 });
    return { text: stdout.trim(), filename: input.name || 'offer.pdf' };
  } finally { await fs.promises.unlink(filename).catch(() => {}); }
}

async function handleApi(request, response, pathname) {
  if (request.method === 'GET' && pathname === '/api/health') return sendJson(response, 200, { ok: true, providers: providerHealth() });
  try {
    const input = await readBody(request);
    if (request.method === 'POST' && pathname === '/api/extract-document') return sendJson(response, 200, await extractDocument(input));
    if (request.method === 'POST' && pathname === '/api/analyze') {
      const adapter = new OrianeAdapter();
      if (adapter.configured) {
        try {
          const intelligence = await adapter.analyze(input);
          return sendJson(response, 200, { source: 'live', provider: 'oriane', ...computeDealRecommendation(input, intelligence), data: intelligence });
        }
        catch (error) { return sendJson(response, 200, { ...fallbackAnalysis(input), providerError: error.message, fallbackReason: 'oriane_request_failed' }); }
      }
      return sendJson(response, 200, fallbackAnalysis(input));
    }
    if (request.method === 'POST' && pathname === '/api/chat/stream') {
      const adapter = new GmiAdapter();
      response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      if (!adapter.configured) {
        response.write('data: {"source":"fallback"}\n\n');
        response.write(`data: ${JSON.stringify({ delta: fallbackChat(input.question).answer })}\n\n`);
        response.write('data: [DONE]\n\n'); response.end(); return;
      }
      try {
        response.write('data: {"source":"live"}\n\n');
        await adapter.chatStream(creatorMessages(input), delta => response.write(`data: ${JSON.stringify({ delta })}\n\n`));
        response.write('data: [DONE]\n\n'); response.end();
      } catch (error) {
        response.write(`data: ${JSON.stringify({ error: error.message })}\n\n`); response.end();
      }
      return;
    }
    if (request.method === 'POST' && pathname === '/api/chat') {
      const adapter = new GmiAdapter();
      if (adapter.configured) {
        try {
          const result = await adapter.chat(creatorMessages(input));
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
