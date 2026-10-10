// Decides whether a bid can be placed on an auction.
// Returns { ok: true } or { ok: false, status, message }.
function evaluateBid({ auctionStatus, endTime, highestBid, maxBid, bidAmount, now = new Date() }) {
  const amount = Number(bidAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, status: 400, message: 'Bid amount must be a positive number.' };
  }
  if (auctionStatus === 'pending') {
    return { ok: false, status: 400, message: 'Auction is not online.' };
  }
  if (auctionStatus === 'closed' || (endTime && now > new Date(endTime))) {
    return { ok: false, status: 400, message: 'Auction is closed. No more bids allowed.', close: true };
  }
  const current = Math.max(Number(highestBid) || 0, Number(maxBid) || 0);
  if (amount <= current) {
    return { ok: false, status: 400, message: `Bid must be higher than the current highest bid of ${current}.` };
  }
  return { ok: true, amount };
}

module.exports = { evaluateBid };
