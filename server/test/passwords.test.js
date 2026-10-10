const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword, withoutPassword, isBcryptHash } = require('../lib/passwords');

test('a hashed password verifies, a wrong one does not', () => {
  const hash = hashPassword('s3cret-pass');
  assert.ok(isBcryptHash(hash));
  assert.notEqual(hash, 's3cret-pass');
  assert.equal(verifyPassword('s3cret-pass', hash), true);
  assert.equal(verifyPassword('wrong', hash), false);
});

test('older accounts with a plain-text password still sign in', () => {
  assert.equal(verifyPassword('old-pass', 'old-pass'), true);
  assert.equal(verifyPassword('other', 'old-pass'), false);
});

test('missing or empty values never verify', () => {
  assert.equal(verifyPassword('', ''), false);
  assert.equal(verifyPassword(undefined, 'x'), false);
  assert.equal(verifyPassword('x', null), false);
});

test('withoutPassword removes the password column only', () => {
  assert.deepEqual(withoutPassword({ BuyerID: 1, Name: 'Rina', Password: 'x' }), { BuyerID: 1, Name: 'Rina' });
  assert.equal(withoutPassword(null), null);
});
