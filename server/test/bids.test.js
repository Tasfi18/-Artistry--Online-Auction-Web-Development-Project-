const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateBid } = require('../lib/bids');

const now = new Date('2026-01-01T12:00:00Z');
const open = { auctionStatus: 'active', endTime: '2026-01-02T00:00:00Z', highestBid: 500, maxBid: 500, now };

test('accepts a bid above the current highest bid', () => {
  assert.deepEqual(evaluateBid({ ...open, bidAmount: '650' }), { ok: true, amount: 650 });
});

test('rejects a bid equal to or below the highest bid', () => {
  assert.equal(evaluateBid({ ...open, bidAmount: 500 }).ok, false);
  assert.equal(evaluateBid({ ...open, highestBid: 300, maxBid: 700, bidAmount: 600 }).ok, false);
});

test('rejects bids on pending and closed auctions', () => {
  assert.match(evaluateBid({ ...open, auctionStatus: 'pending', bidAmount: 900 }).message, /not online/);
  assert.match(evaluateBid({ ...open, auctionStatus: 'closed', bidAmount: 900 }).message, /closed/);
});

test('rejects a bid after the end time even if the status is still active', () => {
  const result = evaluateBid({ ...open, endTime: '2026-01-01T11:59:00Z', bidAmount: 900 });
  assert.equal(result.ok, false);
  assert.match(result.message, /closed/);
});

test('rejects amounts that are not positive numbers', () => {
  for (const bidAmount of ['abc', -5, 0, null]) {
    assert.equal(evaluateBid({ ...open, bidAmount }).status, 400);
  }
});

test('the first bid only has to beat the starting price', () => {
  assert.equal(evaluateBid({ ...open, highestBid: 100, maxBid: null, bidAmount: 101 }).ok, true);
});
