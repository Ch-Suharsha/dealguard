function roundTo50(value) {
  return Math.max(50, Math.round(value / 50) * 50);
}

function firstMoney(text) {
  const match = String(text || '').match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
  return match ? Number(match[1].replace(/,/g, '')) : 500;
}

function monthsFor(text, phrase) {
  const match = String(text || '').match(new RegExp(`(\\d+)\\s*(?:month|months|mo)\\s+(?:of\\s+)?${phrase}`, 'i'));
  return match ? Number(match[1]) : null;
}

function durationMultiplier(months, fallback) {
  if (!months) return fallback;
  if (months <= 1) return 0.25;
  if (months <= 3) return 0.5;
  if (months <= 6) return 0.75;
  if (months <= 12) return 1.2;
  return 1.5;
}

function performanceSignal(input = {}, intelligence = {}) {
  const rows = Array.isArray(intelligence.results) ? intelligence.results : [];
  const liveMetrics = rows.map(row => ({
    views: Number(row.viewsCount || 0),
    engagements: Number(row.likesCount || 0) + Number(row.commentsCount || 0) + Number(row.sharesCount || 0),
  })).filter(row => row.views > 0);
  const metadataMetrics = (input.videos || []).map(video => {
    const match = String(video.meta || '').match(/([\d,.]+)\s*([KMB])?\s*views/i);
    if (!match) return null;
    const scale = ({ K: 1e3, M: 1e6, B: 1e9 }[String(match[2] || '').toUpperCase()] || 1);
    return { views: Number(match[1].replace(/,/g, '')) * scale, engagements: 0 };
  }).filter(Boolean);
  const metrics = liveMetrics.length ? liveMetrics : metadataMetrics;
  if (!metrics.length) return { base: 500, source: 'default', averageViews: 0, engagementRate: 0 };
  const averageViews = metrics.reduce((sum, row) => sum + row.views, 0) / metrics.length;
  const totalViews = metrics.reduce((sum, row) => sum + row.views, 0);
  const engagementRate = metrics.reduce((sum, row) => sum + row.engagements, 0) / totalViews;
  const engagementMultiplier = 1 + Math.min(0.75, engagementRate * 10);
  const base = roundTo50(Math.max(250, (averageViews / 1000) * 5 * engagementMultiplier));
  return { base, source: liveMetrics.length ? 'oriane_live' : 'selected_video_signal', averageViews: Math.round(averageViews), engagementRate };
}

function computeDealRecommendation(input = {}, intelligence = {}) {
  const offer = String(input.offer || '');
  const brandOffer = firstMoney(offer);
  const signal = performanceSignal(input, intelligence);
  const base = signal.base;
  const paidUsage = /paid\s+(?:advertising|ads|media|usage)|whitelisting|spark\s+ads/i.test(offer);
  const exclusivity = /exclusiv(?:e|ity)|category\s+lock[- ]?in/i.test(offer);
  const rawFootage = /raw\s+(?:footage|files|clips)|project\s+files|source\s+files/i.test(offer);
  const unlimitedRevisions = /unlimited\s+revisions|unlimited\s+edits|open[- ]ended\s+(?:revisions|edits)/i.test(offer);
  const paidMonths = monthsFor(offer, '(?:paid\\s+)?(?:advertising|ads|media|usage)') || monthsFor(offer, 'whitelisting');
  const exclusivityMonths = monthsFor(offer, 'exclusivity') || monthsFor(offer, 'exclusive') || monthsFor(offer, 'category\\s+lock[- ]?in');
  const extraDeliverables = Math.max(0, (offer.match(/\b(?:video|reel|post|short)\b/gi) || []).length - 1);

  const breakdown = {
    base,
    paidUsage: paidUsage ? Math.round(base * durationMultiplier(paidMonths, 0.5)) : 0,
    exclusivity: exclusivity ? Math.round(base * durationMultiplier(exclusivityMonths, 0.5)) : 0,
    rawFootage: rawFootage ? Math.round(base * 0.4) : 0,
    revisions: unlimitedRevisions ? Math.round(base * 0.2) : 0,
    extraDeliverables: Math.round(base * 0.75 * extraDeliverables),
  };
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const fairRange = { min: roundTo50(total * 0.78), max: roundTo50(total * 0.97) };
  const recommendation = brandOffer >= fairRange.min ? 'ACCEPT' : 'COUNTER';
  const suggestedCounter = recommendation === 'ACCEPT' ? brandOffer : roundTo50(total);
  const risks = [];
  if (paidUsage) risks.push(`${paidMonths || 'Unspecified'} months paid usage`);
  else risks.push('Confirm whether paid usage is included');
  if (exclusivity) risks.push(`${exclusivityMonths || 'Unspecified'} months category exclusivity`);
  else risks.push('Confirm whether exclusivity is included');
  if (rawFootage) risks.push('Raw footage or source files');
  if (unlimitedRevisions) risks.push('Unlimited revisions');
  if (extraDeliverables) risks.push(`${extraDeliverables + 1} content deliverables`);

  return {
    recommendation,
    confidence: 0.87,
    fairRange,
    suggestedCounter,
    breakdown,
    risks,
    brandOffer,
    creatorSignal: signal,
    assumptions: [signal.source === 'oriane_live' ? `Creator base derived from live Oriane performance: ${signal.averageViews.toLocaleString()} average views and ${(signal.engagementRate * 100).toFixed(1)}% engagement` : `Creator base estimated from available selected-content signals: $${base.toLocaleString()}`, `Brand offered $${brandOffer.toLocaleString() || 'an unspecified amount'}`, 'Paid usage, exclusivity, deliverables, and source files are priced separately'],
    evidence: input.videos || [],
  };
}

module.exports = { computeDealRecommendation };
