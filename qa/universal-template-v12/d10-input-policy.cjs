'use strict';
const BAD_KEYS = new Set(['__proto__','constructor','prototype','answerKey','gradingKey','expected','expectedValue','correct','correctAnswer','solution']);
function hasBadKey(o) { return Boolean(o && typeof o === 'object' && Object.keys(o).some(k => BAD_KEYS.has(k))); }
function normalizeOperator(rawOp) {
  if (typeof rawOp !== 'string') return { ok: false, status: 'REJECTED', reason: 'INVALID_OPERATOR_TYPE' };
  if (rawOp !== rawOp.trim() || /\s/.test(rawOp)) return { ok: false, status: 'REJECTED', reason: 'WHITESPACE_IN_OPERATOR' };
  if (!rawOp) return { ok: false, status: 'REJECTED', reason: 'EMPTY_OPERATOR' };
  if (rawOp.length !== 1) return { ok: false, status: 'REJECTED', reason: 'MULTIPLE_OR_COMPOUND_OPERATOR' };
  const code = rawOp.codePointAt(0);
  if (code === 0x002B) return { ok: true, status: 'NORMALIZED', operator: 'ADD', symbol: '+' };
  if (code === 0x002D) return { ok: true, status: 'NORMALIZED', operator: 'SUB', symbol: '-' };
  if (code === 0x2212) return { ok: true, status: 'NORMALIZED', operator: 'SUB', symbol: '−' };
  if (code === 0x2013 || code === 0x2014) return { ok: false, status: 'REJECTED', reason: 'UNAPPROVED_DASH_GLYPH' };
  return { ok: false, status: 'REJECTED', reason: 'UNSUPPORTED_OPERATOR' };
}
function parseIntStrict(v) {
  if (typeof v === 'number') return Number.isInteger(v) && Number.isSafeInteger(v) ? v : null;
  if (typeof v === 'string' && /^[+-]?\d+$/.test(v.trim())) {
    const n = Number(v.trim());
    return Number.isSafeInteger(n) ? n : null;
  }
  return null;
}
function evaluateD10LabPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || hasBadKey(payload))
    return { ok: false, status: 'REJECTED', reason: 'INVALID_OR_FORBIDDEN_PAYLOAD' };
  if (payload.scope !== 'LAB_ONLY') return { ok: false, status: 'REJECTED', reason: 'SCOPE_MUST_BE_LAB_ONLY' };
  if (payload.steps !== undefined && payload.steps !== 1) return { ok: false, status: 'REJECTED', reason: 'MULTI_STEP_NOT_ALLOWED' };
  const op = normalizeOperator(payload.operator);
  if (!op.ok) return op;
  const n1 = parseIntStrict(payload.n1), n2 = parseIntStrict(payload.n2);
  if (n1 === null || n2 === null) return { ok: false, status: 'REJECTED', reason: 'INVALID_OPERAND_FORMAT' };
  const computed = op.operator === 'ADD' ? n1 + n2 : n1 - n2;
  const sumOk = (payload.sum === undefined || payload.sum === null || payload.sum === '') ? true : parseIntStrict(payload.sum) === computed;
  const ansOk = (payload.answer === undefined || payload.answer === null || payload.answer === '') ? true : parseIntStrict(payload.answer) === computed;
  return { ok: true, status: 'CHECKED', scope: 'LAB_ONLY', normalizedOp: op.operator, computedValue: computed, sumConsistent: sumOk, answerConsistent: ansOk, consistent: sumOk && ansOk };
}
module.exports = Object.freeze({ normalizeOperator, evaluateD10LabPayload });