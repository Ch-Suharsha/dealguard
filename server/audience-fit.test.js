const assert = require('assert');
const { computeAudienceFit } = require('./audience-fit');

const strong = computeAudienceFit({ creatorContext: { niche: 'travel photography', audience: 'budget travelers' }, offer: 'Roamly travel planning app partnership' }, { results: [{ title: 'Hidden beaches travel guide', transcript: 'Three hidden beaches for travelers' }] });
assert.strictEqual(strong.label, 'Strong');
assert.match(strong.sentence, /travel photography/);
assert.match(strong.sentence, /without requiring DealGuard to invent audience demographics/);

const moderate = computeAudienceFit({ creatorContext: {}, offer: 'A general brand collaboration' }, { results: [] });
assert.strictEqual(moderate.label, 'Moderate');
assert.match(moderate.sentence, /not enough supplied context/);

const weak = computeAudienceFit({ creatorContext: { niche: 'travel photography', boundary: 'no gambling' }, offer: 'casino gambling promotion' }, { results: [] });
assert.strictEqual(weak.label, 'Weak');
assert.match(weak.sentence, /boundary/);

console.log('Audience fit tests passed');
