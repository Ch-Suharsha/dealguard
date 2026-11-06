const DEFAULT_TIMEOUT = 20000;

class ProviderNotConfiguredError extends Error {
  constructor(provider, missingConfiguration) {
    super(`${provider} is not configured`);
    this.name = 'ProviderNotConfiguredError';
    this.provider = provider;
    this.missingConfiguration = missingConfiguration;
  }
}

function withTimeout(ms, signal) {
  return AbortSignal.any([signal, AbortSignal.timeout(ms)]);
}

async function requestJson(url, options = {}, timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: withTimeout(timeoutMs, controller.signal) });
    const text = await response.text();
    let body;
    try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
    if (!response.ok) {
      const error = new Error(`Provider returned ${response.status}`);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

class OrianeAdapter {
  constructor(env = process.env) {
    this.key = env.ORIANE_API_KEY;
    this.baseUrl = (env.ORIANE_API_BASE_URL || '').replace(/\/$/, '');
    this.path = env.ORIANE_ANALYZE_PATH || '/api/analyze';
    this.timeoutMs = Number(env.ORIANE_TIMEOUT_MS || DEFAULT_TIMEOUT);
  }

  get configured() { return Boolean(this.key && this.baseUrl && this.path); }

  async analyze(input) {
    if (!this.configured) throw new ProviderNotConfiguredError('oriane', ['ORIANE_API_KEY', 'ORIANE_API_BASE_URL', 'ORIANE_ANALYZE_PATH']);
    return requestJson(`${this.baseUrl}${this.path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videos: input.videos,
        creatorContext: input.creatorContext,
        brandContext: input.brandContext,
      }),
    }, this.timeoutMs);
  }
}

class GmiAdapter {
  constructor(env = process.env) {
    this.key = env.GMI_API_KEY;
    this.baseUrl = (env.GMI_BASE_URL || 'https://api.gmi-serving.com/v1').replace(/\/$/, '');
    this.model = env.GMI_MODEL || 'deepseek-ai/DeepSeek-V4';
    this.timeoutMs = Number(env.GMI_TIMEOUT_MS || 30000);
  }

  get configured() { return Boolean(this.key); }

  async listModels() {
    if (!this.configured) throw new ProviderNotConfiguredError('gmi', ['GMI_API_KEY']);
    return requestJson(`${this.baseUrl}/models`, { headers: { Authorization: `Bearer ${this.key}` } }, this.timeoutMs);
  }

  async chat(messages, { json = false } = {}) {
    if (!this.configured) throw new ProviderNotConfiguredError('gmi', ['GMI_API_KEY']);
    const body = { model: this.model, temperature: 0.2, messages, stream: false };
    if (json) body.response_format = { type: 'json_object' };
    return requestJson(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, this.timeoutMs);
  }
}

class CompoundAdapter {
  constructor(env = process.env) {
    this.key = env.COMPOUND_API_KEY;
    this.baseUrl = (env.COMPOUND_API_BASE_URL || '').replace(/\/$/, '');
    this.path = env.COMPOUND_RENDER_PATH || '/v1/video-concepts';
    this.timeoutMs = Number(env.COMPOUND_TIMEOUT_MS || 30000);
  }

  get configured() { return Boolean(this.key && this.baseUrl); }

  async createConcept(concept) {
    if (!this.configured) throw new ProviderNotConfiguredError('compound', ['COMPOUND_API_KEY', 'COMPOUND_API_BASE_URL']);
    return requestJson(`${this.baseUrl}${this.path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(concept),
    }, this.timeoutMs);
  }
}

function providerHealth(env = process.env) {
  const oriane = new OrianeAdapter(env);
  const gmi = new GmiAdapter(env);
  const compound = new CompoundAdapter(env);
  return {
    oriane: { configured: oriane.configured, mode: oriane.configured ? 'live' : 'fallback' },
    gmi: { configured: gmi.configured, mode: gmi.configured ? 'live' : 'fallback' },
    compound: { configured: compound.configured, mode: compound.configured ? 'live' : 'handoff' },
    lovable: { configured: Boolean(env.LOVABLE_API_KEY || env.LOVABLE_PROJECT_ID), mode: 'build-platform' },
  };
}

module.exports = { CompoundAdapter, GmiAdapter, OrianeAdapter, ProviderNotConfiguredError, providerHealth };
