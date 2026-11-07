const STOP_WORDS = new Set([
  'about', 'after', 'also', 'because', 'brand', 'from', 'have', 'into', 'that', 'their', 'this',
  'through', 'with', 'your', 'and', 'for', 'the', 'you', 'are', 'our', 'will', 'one', 'two',
  'video', 'videos', 'post', 'posts', 'content', 'creator', 'audience', 'offer', 'month', 'months',
]);

function words(value) {
  return new Set(String(value || '').toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g)?.filter(word => !STOP_WORDS.has(word)) || []);
}

function asText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(' ');
  return value.text || value.content || value.transcript || value.value || '';
}

function intelligenceText(intelligence = {}) {
  return (Array.isArray(intelligence.results) ? intelligence.results : []).map(row => {
    const media = row.media?.[0] || {};
    return [row.title, row.description, asText(row.transcript), asText(media.transcript), asText(row.onScreenText), asText(media.onScreenText)].filter(Boolean).join(' ');
  }).join(' ');
}

function overlap(left, right) {
  let count = 0;
  for (const word of left) if (right.has(word)) count += 1;
  return count;
}

function boundaryConflict(boundary, offer) {
  return overlap(words(boundary), words(offer)) >= 1;
}

function computeAudienceFit(input = {}, intelligence = {}) {
  const context = input.creatorContext || {};
  const niche = String(context.niche || '').trim();
  const audience = String(context.audience || '').trim();
  const boundary = String(context.boundary || '').trim();
  const offer = String(input.offer || '').trim();
  const evidence = intelligenceText(intelligence);
  const live = Array.isArray(intelligence.results) && intelligence.results.length > 0;
  const creatorWords = words(`${niche} ${audience}`);
  const contextOverlap = overlap(creatorWords, words(offer));
  const evidenceOverlap = overlap(creatorWords, words(evidence));
  const conflict = boundaryConflict(boundary, offer);

  let score = 0;
  if (contextOverlap >= 2) score += 2;
  else if (contextOverlap === 1) score += 1;
  if (evidenceOverlap >= 2) score += 2;
  else if (evidenceOverlap === 1) score += 1;
  if (live && evidence) score += 1;
  if (conflict) score -= 3;

  let label = 'Moderate';
  if (conflict || (score <= 0 && (niche || audience || evidence))) label = 'Weak';
  else if (score >= 3) label = 'Strong';

  let sentence;
  if (conflict) {
    sentence = 'Weak fit: the offer overlaps with a creator boundary, so DealGuard recommends clarifying or removing that term before relying on the partnership.';
  } else if (!niche && !audience && !evidence) {
    sentence = 'Moderate fit: there is not enough supplied context or content text to make a stronger claim, so DealGuard is not inferring audience demographics.';
  } else if (label === 'Strong') {
    const basis = niche ? `your stated niche (“${niche}”)` : 'the available creator context';
    sentence = `Strong fit: the offer overlaps with ${basis} and the available Oriane content signal, without requiring DealGuard to invent audience demographics.`;
  } else if (label === 'Weak') {
    sentence = 'Weak fit: the offer has little overlap with the supplied creator context or available Oriane content text; no audience demographics were inferred.';
  } else if (niche || audience) {
    sentence = `Moderate fit: the offer has some overlap with ${niche ? `the stated niche (“${niche}”)` : 'the supplied creator context'}, but the available evidence does not justify a stronger audience claim.`;
  } else {
    sentence = 'Moderate fit: the live content signal provides limited topical evidence, but no audience demographics were inferred without creator-provided context.';
  }

  return { label, sentence, evidence: { creatorContextProvided: Boolean(niche || audience), niche: niche || null, audienceProvided: Boolean(audience), orianeEvidenceAvailable: live && Boolean(evidence), boundaryConflict: conflict } };
}

module.exports = { computeAudienceFit };
