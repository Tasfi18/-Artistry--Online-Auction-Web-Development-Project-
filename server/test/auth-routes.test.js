const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
const { hashPassword, isBcryptHash } = require('../lib/passwords');

// A stand-in for the MySQL connection, so the routes run without a database.
const calls = [];
let nextResult = [];
const fakeDb = {
  query(sql, params, cb) {
    if (typeof params === 'function') { cb = params; params = []; }
    calls.push({ sql, params });
    const result = typeof nextResult === 'function' ? nextResult(sql, params) : nextResult;
    setImmediate(() => cb(null, result));
  },
};
const dbPath = path.join(__dirname, '../db_connection/Connect_db.js');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: fakeDb };

const app = express();
app.use(express.json());
app.use('/api/admin', require('../routes/Admins'));
app.use('/api/buyers', require('../routes/Buyers'));
app.use('/api/artists', require('../routes/Artists'));

let server, base;
test.before(() => new Promise((resolve) => {
  server = app.listen(0, () => { base = `http://127.0.0.1:${server.address().port}`; resolve(); });
}));
test.after(() => server.close());
test.beforeEach(() => { calls.length = 0; nextResult = []; });

const post = (url, body) => fetch(base + url, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});

test('buyer sign-up stores a hashed password', async () => {
  nextResult = { insertId: 7 };
  const res = await post('/api/buyers/signup', { name: 'Rina', email: 'rina@example.com', password: 'pass1234' });
  assert.equal(res.status, 201);
  assert.equal((await res.json()).buyerID, 7);
  const stored = calls[0].params[2];
  assert.ok(isBcryptHash(stored));
});

test('artist sign-up rejects a missing password', async () => {
  const res = await post('/api/artists/signup', { name: 'Arif', email: 'arif@example.com' });
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test('buyer sign-in works with the right password and fails with a wrong one', async () => {
  nextResult = [{ BuyerID: 3, Password: hashPassword('pass1234') }];
  let res = await post('/api/buyers/signin', { email: 'rina@example.com', password: 'pass1234' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).buyerID, 3);

  res = await post('/api/buyers/signin', { email: 'rina@example.com', password: 'nope' });
  assert.equal(res.status, 401);
});

test('admin login never sends the password back', async () => {
  nextResult = [{ AdminID: 1, Email: 'admin@example.com', Password: hashPassword('admin-pass') }];
  const res = await post('/api/admin/login', { email: 'admin@example.com', password: 'admin-pass' });
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.admin.Email, 'admin@example.com');
  assert.equal('Password' in body.admin, false);
});

test('profile lookups never send the password back', async () => {
  nextResult = [{ ArtistID: 2, Name: 'Arif', Password: 'secret' }];
  const res = await fetch(`${base}/api/artists/user/2`);
  const [artist] = await res.json();
  assert.equal(artist.Name, 'Arif');
  assert.equal('Password' in artist, false);
});
