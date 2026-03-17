const { badRequest } = require('./httpErrors');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertNonEmptyString(value, field) {
  if (!isNonEmptyString(value)) throw badRequest(`Invalid ${field}`);
  return value.trim();
}

function assertOptionalString(value, field) {
  if (value == null) return undefined;
  if (typeof value !== 'string') throw badRequest(`Invalid ${field}`);
  return value;
}

function assertOptionalNumber(value, field) {
  if (value == null || value === '') return undefined;
  const num = Number(value);
  if (!Number.isFinite(num)) throw badRequest(`Invalid ${field}`);
  return num;
}

function assertStringEnum(value, field, allowed) {
  if (!isNonEmptyString(value)) throw badRequest(`Invalid ${field}`);
  const normalized = value.trim().toLowerCase();
  if (!allowed.includes(normalized)) throw badRequest(`Invalid ${field}`);
  return normalized;
}

function assertArray(value, field) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw badRequest(`Invalid ${field}`);
  return value;
}

module.exports = {
  assertNonEmptyString,
  assertOptionalString,
  assertOptionalNumber,
  assertStringEnum,
  assertArray,
};

