const assert = require('assert');
const { computeDealRecommendation } = require('./recommendation');

const base = computeDealRecommendation(
  { offer: 'Brand offers $500 for one 60-second TikTok.' },
  { results: [{ viewsCount: 10000, likesCount: 300, commentsCount: 20, sharesCount: 10 }] },
);
const expanded = computeDealRecommendation(
  { offer: 'Brand offers $1,200 for one TikTok plus 6 months paid advertising, 3 months exclusivity, and raw footage.' },
  { results: [{ viewsCount: 240100, likesCount: 9057, commentsCount: 96, sharesCount: 263 }] },
);

assert.notDeepStrictEqual(expanded.fairRange, base.fairRange, 'different offers must produce different fair ranges');
assert.notStrictEqual(expanded.suggestedCounter, base.suggestedCounter, 'different offers must produce different counters');
assert.equal(base.creatorSignal.source, 'oriane_live');
assert.equal(expanded.creatorSignal.source, 'oriane_live');
assert.notStrictEqual(base.breakdown.base, expanded.breakdown.base, 'creator performance must change the base value');
assert.ok(expanded.breakdown.paidUsage > 0);
assert.ok(expanded.breakdown.exclusivity > 0);
assert.ok(expanded.breakdown.rawFootage > 0);
console.log('recommendation regression checks passed');
