const bcrypt = require('bcryptjs');

const ROUNDS = 10;

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$.{53}$/.test(value);
}

function hashPassword(password) {
  return bcrypt.hashSync(String(password), ROUNDS);
}

// Accounts created before passwords were hashed still hold the plain text,
// so those are compared directly. New and updated accounts are always hashed.
function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string' || stored === '') return false;
  if (isBcryptHash(stored)) return bcrypt.compareSync(password, stored);
  return password === stored;
}

// Remove the password column before a user row is sent to the browser.
function withoutPassword(row) {
  if (!row || typeof row !== 'object') return row;
  const { Password, password, ...rest } = row;
  return rest;
}

module.exports = { hashPassword, verifyPassword, withoutPassword, isBcryptHash };
