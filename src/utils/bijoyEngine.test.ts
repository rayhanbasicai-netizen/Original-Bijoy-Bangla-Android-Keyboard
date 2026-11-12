import test from 'node:test';
import assert from 'node:assert/strict';
import {
  physicalKeyToBijoy,
  applyBijoyKey,
  getUnicodeHex,
  isBengaliChar,
  decomposeBengaliConjunct,
  BIJOY_KEY_MAP,
  CONJUNCT_PRESETS
} from './bijoyEngine';

test('physicalKeyToBijoy maps unshifted and shifted keys accurately', () => {
  // 'j' should map to 'ক', shift+'j' to 'খ'
  assert.equal(physicalKeyToBijoy('j', false), 'ক');
  assert.equal(physicalKeyToBijoy('j', true), 'খ');

  // 'g' should map to '্' (hasanta), shift+'g' to '।' (dari)
  assert.equal(physicalKeyToBijoy('g', false), '্');
  assert.equal(physicalKeyToBijoy('g', true), '।');

  // 'f' should map to 'া' (aa kar), shift+'f' to 'অ' (vowel a)
  assert.equal(physicalKeyToBijoy('f', false), 'া');
  assert.equal(physicalKeyToBijoy('f', true), 'অ');

  // '4' should map to '৪', shift+'4' to '৳' (taka sign)
  assert.equal(physicalKeyToBijoy('4', false), '৪');
  assert.equal(physicalKeyToBijoy('4', true), '৳');

  // unmapped key
  assert.equal(physicalKeyToBijoy('?', false), null);
});

test('applyBijoyKey inserts characters at cursor correctly', () => {
  const step1 = applyBijoyKey('', 'ক', 0);
  assert.equal(step1.newText, 'ক');
  assert.equal(step1.newCursor, 1);

  const step2 = applyBijoyKey(step1.newText, 'া', step1.newCursor);
  assert.equal(step2.newText, 'কা');
  assert.equal(step2.newCursor, 2);

  const step3 = applyBijoyKey(step2.newText, 'ল', step2.newCursor);
  assert.equal(step3.newText, 'কাল');
  assert.equal(step3.newCursor, 3);

  // Backspace test
  const step4 = applyBijoyKey(step3.newText, 'BACKSPACE', step3.newCursor);
  assert.equal(step4.newText, 'কা');
  assert.equal(step4.newCursor, 2);
});

test('decomposeBengaliConjunct decomposes juktakhar with hasanta', () => {
  const result = decomposeBengaliConjunct('ক্ষ');
  assert.equal(result.base, 'ক্ষ');
  assert.equal(result.hasHasanta, true);
  assert.deepEqual(result.parts, ['ক', '্', 'ষ']);
  assert.deepEqual(result.codepoints, ['U+0995', 'U+09CD', 'U+09B7']);
});

test('getUnicodeHex formats hex codepoints', () => {
  assert.equal(getUnicodeHex('ক'), 'U+0995');
  assert.equal(getUnicodeHex('বাংলা'), 'U+09AC U+09BE U+0982 U+09B2 U+09BE');
});

test('isBengaliChar correctly validates character ranges', () => {
  assert.equal(isBengaliChar('ক'), true);
  assert.equal(isBengaliChar('০'), true);
  assert.equal(isBengaliChar('A'), false);
  assert.equal(isBengaliChar(' '), false);
});

test('CONJUNCT_PRESETS has valid definitions and non-empty entries', () => {
  assert.ok(CONJUNCT_PRESETS.length > 20);
  const ksha = CONJUNCT_PRESETS.find(c => c.label === 'ক্ষ');
  assert.ok(ksha);
  assert.deepEqual(ksha?.seq, ['ক', '্', 'ষ']);
});
