/**
 * Bijoy Bengali Keyboard Engine & Conjunct Rules
 * Deconstructs and simulates Bijoy layout mappings, Unicode conversions, and conjunct assemblies.
 */

export interface BijoyKeyMapping {
  qwertyKey: string;
  normalLabel: string;
  normalChar: string;
  normalUnicode: string;
  shiftLabel: string;
  shiftChar: string;
  shiftUnicode: string;
  popupKey?: string;
  category: 'vowel' | 'consonant' | 'matra' | 'modifier' | 'punctuation' | 'number';
  description: string;
}

// Full Bijoy keyboard physical QWERTY key mapping
export const BIJOY_KEY_MAP: Record<string, BijoyKeyMapping> = {
  q: {
    qwertyKey: 'q',
    normalLabel: 'ঙ',
    normalChar: 'ঙ',
    normalUnicode: 'U+0999',
    shiftLabel: 'ং',
    shiftChar: 'ং',
    shiftUnicode: 'U+0982',
    popupKey: 'yuo_jukta_borno',
    category: 'consonant',
    description: 'Nga (ঙ) / Anusvara (ং)'
  },
  w: {
    qwertyKey: 'w',
    normalLabel: 'য',
    normalChar: 'য',
    normalUnicode: 'U+09AF',
    shiftLabel: 'য়',
    shiftChar: 'য়',
    shiftUnicode: 'U+09DF',
    category: 'consonant',
    description: 'Antasthya Ja (য) / Antasthya Ya (য়)'
  },
  e: {
    qwertyKey: 'e',
    normalLabel: 'ড',
    normalChar: 'ড',
    normalUnicode: 'U+09A1',
    shiftLabel: 'ঢ',
    shiftChar: 'ঢ',
    shiftUnicode: 'U+09A2',
    popupKey: 'da_jukta_borno',
    category: 'consonant',
    description: 'Dda (ড) / Ddha (ঢ)'
  },
  r: {
    qwertyKey: 'r',
    normalLabel: 'প',
    normalChar: 'প',
    normalUnicode: 'U+09AA',
    shiftLabel: 'ফ',
    shiftChar: 'ফ',
    shiftUnicode: 'U+09AB',
    popupKey: 'pa_jukta_borno',
    category: 'consonant',
    description: 'Pa (প) / Pha (ফ)'
  },
  t: {
    qwertyKey: 't',
    normalLabel: 'ট',
    normalChar: 'ট',
    normalUnicode: 'U+099F',
    shiftLabel: 'ঠ',
    shiftChar: 'ঠ',
    shiftUnicode: 'U+09A0',
    popupKey: 'tta_jukta_borno',
    category: 'consonant',
    description: 'Tta (ট) / Ttha (ঠ)'
  },
  y: {
    qwertyKey: 'y',
    normalLabel: 'চ',
    normalChar: 'চ',
    normalUnicode: 'U+0958',
    shiftLabel: 'ছ',
    shiftChar: 'ছ',
    shiftUnicode: 'U+0959',
    popupKey: 'cho_jukta_borno',
    category: 'consonant',
    description: 'Ca (চ) / Cha (ছ)'
  },
  u: {
    qwertyKey: 'u',
    normalLabel: 'জ',
    normalChar: 'জ',
    normalUnicode: 'U+099C',
    shiftLabel: 'ঝ',
    shiftChar: 'ঝ',
    shiftUnicode: 'U+099D',
    popupKey: 'ja_jukta_borno',
    category: 'consonant',
    description: 'Ja (জ) / Jha (ঝ)'
  },
  i: {
    qwertyKey: 'i',
    normalLabel: 'হ',
    normalChar: 'হ',
    normalUnicode: 'U+09B9',
    shiftLabel: 'ঞ',
    shiftChar: 'ঞ',
    shiftUnicode: 'U+099E',
    popupKey: 'ha_jukta_borno',
    category: 'consonant',
    description: 'Ha (হ) / Nya (ঞ)'
  },
  o: {
    qwertyKey: 'o',
    normalLabel: 'গ',
    normalChar: 'গ',
    normalUnicode: 'U+0997',
    shiftLabel: 'ঘ',
    shiftChar: 'ঘ',
    shiftUnicode: 'U+0998',
    popupKey: 'ga_jukta_borno',
    category: 'consonant',
    description: 'Ga (গ) / Gha (ঘ)'
  },
  p: {
    qwertyKey: 'p',
    normalLabel: 'ড়',
    normalChar: 'ড়',
    normalUnicode: 'U+09DC',
    shiftLabel: 'ঢ়',
    shiftChar: 'ঢ়',
    shiftUnicode: 'U+09DD',
    popupKey: 'd_ra_jukta_borno',
    category: 'consonant',
    description: 'Rra (ড়) / Rrha (ঢ়)'
  },
  a: {
    qwertyKey: 'a',
    normalLabel: 'ৃ',
    normalChar: 'ৃ',
    normalUnicode: 'U+09C3',
    shiftLabel: 'ৄ',
    shiftChar: 'ৄ',
    shiftUnicode: 'U+09C4',
    category: 'matra',
    description: 'Vocalic R Matra (ৃ) / Vocalic RR Matra (ৄ)'
  },
  s: {
    qwertyKey: 's',
    normalLabel: 'ু',
    normalChar: 'ু',
    normalUnicode: 'U+09C1',
    shiftLabel: 'ূ',
    shiftChar: 'ূ',
    shiftUnicode: 'U+09C2',
    category: 'matra',
    description: 'Hraswa U Kar (ু) / Dirgha U Kar (ূ)'
  },
  d: {
    qwertyKey: 'd',
    normalLabel: 'ি',
    normalChar: 'ি',
    normalUnicode: 'U+09BF',
    shiftLabel: 'ী',
    shiftChar: 'ী',
    shiftUnicode: 'U+09C0',
    category: 'matra',
    description: 'Hraswa I Kar (ি) / Dirgha I Kar (ী)'
  },
  f: {
    qwertyKey: 'f',
    normalLabel: 'া',
    normalChar: 'া',
    normalUnicode: 'U+09BE',
    shiftLabel: 'অ',
    shiftChar: 'অ',
    shiftUnicode: 'U+0985',
    popupKey: 'shar_borno',
    category: 'matra',
    description: 'Aa Kar (া) / Swar A (অ)'
  },
  g: {
    qwertyKey: 'g',
    normalLabel: '্',
    normalChar: '্',
    normalUnicode: 'U+09CD',
    shiftLabel: '।',
    shiftChar: '।',
    shiftUnicode: 'U+0964',
    category: 'modifier',
    description: 'Hasanta / Virama (্) / Dari (।)'
  },
  h: {
    qwertyKey: 'h',
    normalLabel: 'ব',
    normalChar: 'ব',
    normalUnicode: 'U+09AC',
    shiftLabel: 'ভ',
    shiftChar: 'ভ',
    shiftUnicode: 'U+09AD',
    popupKey: 'ba_jukta_borno',
    category: 'consonant',
    description: 'Ba (ব) / Bha (ভ)'
  },
  j: {
    qwertyKey: 'j',
    normalLabel: 'ক',
    normalChar: 'ক',
    normalUnicode: 'U+0995',
    shiftLabel: 'খ',
    shiftChar: 'খ',
    shiftUnicode: 'U+0996',
    popupKey: 'ka_jukta_borno',
    category: 'consonant',
    description: 'Ka (ক) / Kha (খ)'
  },
  k: {
    qwertyKey: 'k',
    normalLabel: 'ত',
    normalChar: 'ত',
    normalUnicode: 'U+09A4',
    shiftLabel: 'থ',
    shiftChar: 'থ',
    shiftUnicode: 'U+09A5',
    popupKey: 'toa_jukta_borno',
    category: 'consonant',
    description: 'Ta (ত) / Tha (থ)'
  },
  l: {
    qwertyKey: 'l',
    normalLabel: 'দ',
    normalChar: 'দ',
    normalUnicode: 'U+09A6',
    shiftLabel: 'ধ',
    shiftChar: 'ধ',
    shiftUnicode: 'U+09A7',
    popupKey: 'doa_jukta_borno',
    category: 'consonant',
    description: 'Da (দ) / Dha (ধ)'
  },
  ';': {
    qwertyKey: ';',
    normalLabel: 'ৎ',
    normalChar: 'ৎ',
    normalUnicode: 'U+09CE',
    shiftLabel: 'ঃ',
    shiftChar: 'ঃ',
    shiftUnicode: 'U+0983',
    category: 'consonant',
    description: 'Khanda Ta (ৎ) / Visarga (ঃ)'
  },
  z: {
    qwertyKey: 'z',
    normalLabel: '্য',
    normalChar: '্য',
    normalUnicode: 'U+09CD+U+09AF',
    shiftLabel: '্র',
    shiftChar: '্র',
    shiftUnicode: 'U+09CD+U+09B0',
    category: 'modifier',
    description: 'Ja-phala (্য) / Ra-phala (্র)'
  },
  x: {
    qwertyKey: 'x',
    normalLabel: 'ও',
    normalChar: 'ও',
    normalUnicode: 'U+0993',
    shiftLabel: 'ৗ',
    shiftChar: 'ৗ',
    shiftUnicode: 'U+09D7',
    category: 'vowel',
    description: 'O (ও) / Au Kar length mark (ৗ)'
  },
  c: {
    qwertyKey: 'c',
    normalLabel: 'ে',
    normalChar: 'ে',
    normalUnicode: 'U+09C7',
    shiftLabel: 'ৈ',
    shiftChar: 'ৈ',
    shiftUnicode: 'U+09C8',
    category: 'matra',
    description: 'E Kar (ে) / Oi Kar (ৈ)'
  },
  v: {
    qwertyKey: 'v',
    normalLabel: 'র',
    normalChar: 'র',
    normalUnicode: 'U+09B0',
    shiftLabel: 'ল',
    shiftChar: 'ল',
    shiftUnicode: 'U+09B2',
    popupKey: 'la_jukta_borno',
    category: 'consonant',
    description: 'Ra (র) / La (ল)'
  },
  b: {
    qwertyKey: 'b',
    normalLabel: 'ন',
    normalChar: 'ন',
    normalUnicode: 'U+09A8',
    shiftLabel: 'ণ',
    shiftChar: 'ণ',
    shiftUnicode: 'U+09A3',
    popupKey: 'na_jukta_borno',
    category: 'consonant',
    description: 'Dantya Na (ন) / Murdhanya Na (ণ)'
  },
  n: {
    qwertyKey: 'n',
    normalLabel: 'স',
    normalChar: 'স',
    normalUnicode: 'U+09B8',
    shiftLabel: 'ষ',
    shiftChar: 'ষ',
    shiftUnicode: 'U+09B7',
    popupKey: 'sha_jukta_borno',
    category: 'consonant',
    description: 'Dantya Sa (স) / Murdhanya Sa (ষ)'
  },
  m: {
    qwertyKey: 'm',
    normalLabel: 'ম',
    normalChar: 'ম',
    normalUnicode: 'U+09AE',
    shiftLabel: 'শ',
    shiftChar: 'শ',
    shiftUnicode: 'U+09B6',
    popupKey: 'ma_jukta_borno',
    category: 'consonant',
    description: 'Ma (ম) / Talabya Sa (শ)'
  },
  // Number row
  '1': { qwertyKey: '1', normalLabel: '১', normalChar: '১', normalUnicode: 'U+09E7', shiftLabel: '!', shiftChar: '!', shiftUnicode: 'U+0021', category: 'number', description: 'Ek (১)' },
  '2': { qwertyKey: '2', normalLabel: '২', normalChar: '২', normalUnicode: 'U+09E8', shiftLabel: '@', shiftChar: '@', shiftUnicode: 'U+0040', category: 'number', description: 'Dui (২)' },
  '3': { qwertyKey: '3', normalLabel: '৩', normalChar: '৩', normalUnicode: 'U+09E9', shiftLabel: '#', shiftChar: '#', shiftUnicode: 'U+0023', category: 'number', description: 'Tin (৩)' },
  '4': { qwertyKey: '4', normalLabel: '৪', normalChar: '৪', normalUnicode: 'U+09EA', shiftLabel: '৳', shiftChar: '৳', shiftUnicode: 'U+09F3', category: 'number', description: 'Char (৪) / Taka sign (৳)' },
  '5': { qwertyKey: '5', normalLabel: '৫', normalChar: '৫', normalUnicode: 'U+09EB', shiftLabel: '%', shiftChar: '%', shiftUnicode: 'U+0025', category: 'number', description: 'Panch (৫)' },
  '6': { qwertyKey: '6', normalLabel: '৬', normalChar: '৬', normalUnicode: 'U+09EC', shiftLabel: '^', shiftChar: '^', shiftUnicode: 'U+005E', category: 'number', description: 'Chhoy (৬)' },
  '7': { qwertyKey: '7', normalLabel: '৭', normalChar: '৭', normalUnicode: 'U+09ED', shiftLabel: 'ঁ', shiftChar: 'ঁ', shiftUnicode: 'U+0981', category: 'number', description: 'Sat (৭) / Chandrabindu (ঁ)' },
  '8': { qwertyKey: '8', normalLabel: '৮', normalChar: '৮', normalUnicode: 'U+09EE', shiftLabel: '*', shiftChar: '*', shiftUnicode: 'U+002A', category: 'number', description: 'Aat (৮)' },
  '9': { qwertyKey: '9', normalLabel: '৯', normalChar: '৯', normalUnicode: 'U+09EF', shiftLabel: '(', shiftChar: '(', shiftUnicode: 'U+0028', category: 'number', description: 'Noy (৯)' },
  '0': { qwertyKey: '0', normalLabel: '০', normalChar: '০', normalUnicode: 'U+09E6', shiftLabel: ')', shiftChar: ')', shiftUnicode: 'U+0029', category: 'number', description: 'Shunya (০)' }
};

/**
 * Common Bengali conjunct combinations formed by Consonant + Hasanta (্) + Consonant
 */
export const CONJUNCT_PRESETS: { label: string; seq: string[]; result: string; desc: string }[] = [
  { label: 'ক্ষ', seq: ['ক', '্', 'ষ'], result: 'ক্ষ', desc: 'Ka + Hasanta + Ssa (ক্ষ)' },
  { label: 'জ্ঞ', seq: ['জ', '্', 'ঞ'], result: 'জ্ঞ', desc: 'Ja + Hasanta + Nya (জ্ঞ)' },
  { label: 'ঙ্ক', seq: ['ঙ', '্', 'ক'], result: 'ঙ্ক', desc: 'Nga + Hasanta + Ka (ঙ্ক)' },
  { label: 'ঙ্গ', seq: ['ঙ', '্', 'গ'], result: 'ঙ্গ', desc: 'Nga + Hasanta + Ga (ঙ্গ)' },
  { label: 'চ্চ', seq: ['চ', '্', 'চ'], result: 'চ্চ', desc: 'Ca + Hasanta + Ca (চ্চ)' },
  { label: 'চ্ছ', seq: ['চ', '্', 'ছ'], result: 'চ্ছ', desc: 'Ca + Hasanta + Cha (চ্ছ)' },
  { label: 'জ্জ', seq: ['জ', '্', 'জ'], result: 'জ্জ', desc: 'Ja + Hasanta + Ja (জ্জ)' },
  { label: 'ঞ্চ', seq: ['ঞ', '্', 'চ'], result: 'ঞ্চ', desc: 'Nya + Hasanta + Ca (ঞ্চ)' },
  { label: 'ঞ্জ', seq: ['ঞ', '্', 'জ'], result: 'ঞ্জ', desc: 'Nya + Hasanta + Ja (ঞ্জ)' },
  { label: 'ট্ট', seq: ['ট', '্', 'ট'], result: 'ট্ট', desc: 'Tta + Hasanta + Tta (ট্ট)' },
  { label: 'ণ্ড', seq: ['ণ', '্', 'ড'], result: 'ণ্ড', desc: 'Nna + Hasanta + Dda (ণ্ড)' },
  { label: 'ত্ত', seq: ['ত', '্', 'ত'], result: 'ত্ত', desc: 'Ta + Hasanta + Ta (ত্ত)' },
  { label: '্থ', seq: ['ত', '্', 'থ'], result: 'ত্থ', desc: 'Ta + Hasanta + Tha (ত্থ)' },
  { label: 'দ্ব', seq: ['দ', '্', 'ব'], result: 'দ্ব', desc: 'Da + Hasanta + Ba (দ্ব)' },
  { label: 'দ্ধ', seq: ['দ', '্', 'ধ'], result: 'দ্ধ', desc: 'Da + Hasanta + Dha (দ্ধ)' },
  { label: 'ন্ত', seq: ['ন', '্', 'ত'], result: 'ন্ত', desc: 'Na + Hasanta + Ta (ন্ত)' },
  { label: 'ন্দ', seq: ['ন', '্', 'দ'], result: 'ন্দ', desc: 'Na + Hasanta + Da (ন্দ)' },
  { label: 'ন্ধ', seq: ['ন', '্', 'ধ'], result: 'ন্ধ', desc: 'Na + Hasanta + Dha (ন্ধ)' },
  { label: 'ন্ন', seq: ['ন', '্', 'ন'], result: 'ন্ন', desc: 'Na + Hasanta + Na (ন্ন)' },
  { label: 'ম্প', seq: ['ম', '্', 'প'], result: 'ম্প', desc: 'Ma + Hasanta + Pa (ম্প)' },
  { label: 'ম্ভ', seq: ['ম', '্', 'ভ'], result: 'ম্ভ', desc: 'Ma + Hasanta + Bha (ম্ভ)' },
  { label: 'ম্ম', seq: ['ম', '্', 'ম'], result: 'ম্ম', desc: 'Ma + Hasanta + Ma (ম্ম)' },
  { label: 'ষ্ট', seq: ['ষ', '্', 'ট'], result: 'ষ্ট', desc: 'Ssa + Hasanta + Tta (ষ্ট)' },
  { label: 'ষ্ঠ', seq: ['ষ', '্', 'ঠ'], result: 'ষ্ঠ', desc: 'Ssa + Hasanta + Ttha (ষ্ঠ)' },
  { label: 'ষ্ণ', seq: ['ষ', '্', 'ণ'], result: 'ষ্ণ', desc: 'Ssa + Hasanta + Nna (ষ্ণ)' },
  { label: 'স্ত', seq: ['স', '্', 'ত'], result: 'স্ত', desc: 'Sa + Hasanta + Ta (স্ত)' },
  { label: 'স্থ', seq: ['স', '্', 'থ'], result: 'স্থ', desc: 'Sa + Hasanta + Tha (স্থ)' },
  { label: 'হ্ন', seq: ['হ', '্', 'ন'], result: 'হ্ন', desc: 'Ha + Hasanta + Na (হ্ন)' },
  { label: 'হ্ম', seq: ['হ', '্', 'ম'], result: 'হ্ম', desc: 'Ha + Hasanta + Ma (হ্ম)' },
  { label: 'হ্র', seq: ['হ', '্', 'র'], result: 'হ্র', desc: 'Ha + Hasanta + Ra (হ্র)' }
];

/**
 * Convert a physical key press into Bijoy output character
 */
export function physicalKeyToBijoy(key: string, isShift: boolean): string | null {
  const lowerKey = key.toLowerCase();
  const entry = BIJOY_KEY_MAP[lowerKey] || BIJOY_KEY_MAP[key];
  if (!entry) return null;
  return isShift ? entry.shiftChar : entry.normalChar;
}

/**
 * Inserts or deletes text at a given cursor position
 */
export function applyBijoyKey(
  currentText: string,
  keyInput: string,
  cursorPos: number
): { newText: string; newCursor: number } {
  if (keyInput === 'BACKSPACE') {
    if (cursorPos === 0) return { newText: currentText, newCursor: 0 };
    const before = currentText.slice(0, cursorPos - 1);
    const after = currentText.slice(cursorPos);
    return { newText: before + after, newCursor: cursorPos - 1 };
  }
  
  if (keyInput === 'DELETE') {
    if (cursorPos >= currentText.length) return { newText: currentText, newCursor: cursorPos };
    const before = currentText.slice(0, cursorPos);
    const after = currentText.slice(cursorPos + 1);
    return { newText: before + after, newCursor: cursorPos };
  }

  const before = currentText.slice(0, cursorPos);
  const after = currentText.slice(cursorPos);
  const newText = before + keyInput + after;
  return { newText, newCursor: cursorPos + keyInput.length };
}

/**
 * Returns formatted Unicode codepoints for a given string (e.g., U+0995 U+09CD U+09B7)
 */
export function getUnicodeHex(str: string): string {
  if (!str) return '';
  return Array.from(str)
    .map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');
}

/**
 * Check if character is inside Bengali Unicode block (0x0980 - 0x09FF)
 */
export function isBengaliChar(char: string): boolean {
  if (!char) return false;
  const cp = char.charCodeAt(0);
  return cp >= 0x0980 && cp <= 0x09FF;
}

/**
 * Decomposes a Bengali word into constituent characters and analyzes conjuncts
 */
export function decomposeBengaliConjunct(text: string): {
  base: string;
  parts: string[];
  codepoints: string[];
  hasHasanta: boolean;
} {
  const parts = Array.from(text);
  const codepoints = parts.map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
  const hasHasanta = parts.includes('্');

  return {
    base: text,
    parts,
    codepoints,
    hasHasanta
  };
}
