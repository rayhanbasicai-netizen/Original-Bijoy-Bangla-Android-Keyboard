import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Trash2,
  Volume2,
  VolumeX,
  Keyboard as KeyboardIcon,
  HelpCircle,
  Sparkles,
  Info,
  Check,
  Languages,
  Layers,
  ArrowUp,
  Delete,
  CornerDownLeft,
  Settings2
} from 'lucide-react';
import {
  applyBijoyKey,
  physicalKeyToBijoy,
  decomposeBengaliConjunct,
  getUnicodeHex,
  CONJUNCT_PRESETS,
  BIJOY_KEY_MAP
} from '../utils/bijoyEngine';
import bijoyDataRaw from '../data/bijoy_data.json';

interface SimulatorProps {
  onInsertText?: (text: string) => void;
}

export const SimulatorView: React.FC<SimulatorProps> = () => {
  const [text, setText] = useState<string>('আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।');
  const [cursorPos, setCursorPos] = useState<number>(text.length);
  const [isShift, setIsShift] = useState<boolean>(false);
  const [keyMode, setKeyMode] = useState<'bangla' | 'symbols' | 'english'>('bangla');
  const [hardwareTyping, setHardwareTyping] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [useAnandaFont, setUseAnandaFont] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
  const [recentKey, setRecentKey] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync cursor position from textarea
  const handleSelect = () => {
    if (textareaRef.current) {
      setCursorPos(textareaRef.current.selectionStart);
    }
  };

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext may be restricted by browser until interaction
    }
  };

  const handleKeyInput = (char: string) => {
    playClickSound();
    setRecentKey(char);
    const result = applyBijoyKey(text, char, cursorPos);
    setText(result.newText);
    setCursorPos(result.newCursor);

    // If shift was active and not locked, return to normal after typing one key (standard mobile behavior)
    if (isShift) {
      setIsShift(false);
    }

    // Keep textarea focused
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(result.newCursor, result.newCursor);
      }
    }, 10);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    setCursorPos(0);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Hardware keyboard interception
  useEffect(() => {
    if (!hardwareTyping) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is pressing Ctrl/Meta/Alt
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyInput('BACKSPACE');
        return;
      }

      // Handle Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        handleKeyInput('\n');
        return;
      }

      // Handle Space
      if (e.key === ' ') {
        e.preventDefault();
        handleKeyInput(' ');
        return;
      }

      if (keyMode === 'english') {
        // In English mode, let regular characters pass through
        return;
      }

      const mapped = physicalKeyToBijoy(e.key, e.shiftKey);
      if (mapped) {
        e.preventDefault();
        handleKeyInput(mapped);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hardwareTyping, keyMode, isShift, text, cursorPos]);

  // Layout rows
  // Row 1
  const normalRow1 = [
    { label: 'ঙ', char: 'ঙ', qwerty: 'q', popup: 'yuo_jukta_borno' },
    { label: 'য', char: 'য', qwerty: 'w' },
    { label: 'ড', char: 'ড', qwerty: 'e', popup: 'da_jukta_borno' },
    { label: 'প', char: 'প', qwerty: 'r', popup: 'pa_jukta_borno' },
    { label: 'ট', char: 'ট', qwerty: 't', popup: 'tta_jukta_borno' },
    { label: 'চ', char: 'চ', qwerty: 'y', popup: 'cho_jukta_borno' },
    { label: 'জ', char: 'জ', qwerty: 'u', popup: 'ja_jukta_borno' },
    { label: 'হ', char: 'হ', qwerty: 'i', popup: 'ha_jukta_borno' },
    { label: 'গ', char: 'গ', qwerty: 'o', popup: 'ga_jukta_borno' },
    { label: 'ড়', char: 'ড়', qwerty: 'p', popup: 'd_ra_jukta_borno' }
  ];

  const shiftRow1 = [
    { label: 'ং', char: 'ং', qwerty: 'Q', popup: 'yuo_jukta_borno' },
    { label: 'য়', char: 'য়', qwerty: 'W' },
    { label: 'ঢ', char: 'ঢ', qwerty: 'E', popup: 'da_jukta_borno' },
    { label: 'ফ', char: 'ফ', qwerty: 'R', popup: 'pa_jukta_borno' },
    { label: 'ঠ', char: 'ঠ', qwerty: 'T', popup: 'tta_jukta_borno' },
    { label: 'ছ', char: 'ছ', qwerty: 'Y', popup: 'cho_jukta_borno' },
    { label: 'ঝ', char: 'ঝ', qwerty: 'U', popup: 'ja_jukta_borno' },
    { label: 'ঞ', char: 'ঞ', qwerty: 'I', popup: 'ha_jukta_borno' },
    { label: 'ঘ', char: 'ঘ', qwerty: 'O', popup: 'ga_jukta_borno' },
    { label: 'ঢ়', char: 'ঢ়', qwerty: 'P', popup: 'd_ra_jukta_borno' }
  ];

  // Row 2
  const normalRow2 = [
    { label: 'ৃ', char: 'ৃ', qwerty: 'a' },
    { label: 'ু', char: 'ু', qwerty: 's' },
    { label: 'ি', char: 'ি', qwerty: 'd' },
    { label: 'া', char: 'া', qwerty: 'f', popup: 'shar_borno' },
    { label: '্', char: '্', qwerty: 'g' },
    { label: 'ব', char: 'ব', qwerty: 'h', popup: 'ba_jukta_borno' },
    { label: 'ক', char: 'ক', qwerty: 'j', popup: 'ka_jukta_borno' },
    { label: 'ত', char: 'ত', qwerty: 'k', popup: 'toa_jukta_borno' },
    { label: 'দ', char: 'দ', qwerty: 'l', popup: 'doa_jukta_borno' },
    { label: 'ৎ', char: 'ৎ', qwerty: ';' }
  ];

  const shiftRow2 = [
    { label: 'ৄ', char: 'ৄ', qwerty: 'A' },
    { label: 'ূ', char: 'ূ', qwerty: 'S' },
    { label: 'ী', char: 'ী', qwerty: 'D' },
    { label: 'অ', char: 'অ', qwerty: 'F', popup: 'shar_borno' },
    { label: '।', char: '।', qwerty: 'G' },
    { label: 'ভ', char: 'ভ', qwerty: 'H', popup: 'ba_jukta_borno' },
    { label: 'খ', char: 'খ', qwerty: 'J', popup: 'ka_jukta_borno' },
    { label: 'থ', char: 'থ', qwerty: 'K', popup: 'toa_jukta_borno' },
    { label: 'ধ', char: 'ধ', qwerty: 'L', popup: 'doa_jukta_borno' },
    { label: 'ঃ', char: 'ঃ', qwerty: ':' }
  ];

  // Row 3
  const normalRow3 = [
    { label: '্য', char: '্য', qwerty: 'z' },
    { label: 'ও', char: 'ও', qwerty: 'x' },
    { label: 'ে', char: 'ে', qwerty: 'c' },
    { label: 'র', char: 'র', qwerty: 'v', popup: 'la_jukta_borno' },
    { label: 'ন', char: 'ন', qwerty: 'b', popup: 'na_jukta_borno' },
    { label: 'স', char: 'স', qwerty: 'n', popup: 'sha_jukta_borno' },
    { label: 'ম', char: 'ম', qwerty: 'm', popup: 'ma_jukta_borno' }
  ];

  const shiftRow3 = [
    { label: '্র', char: '্র', qwerty: 'Z' },
    { label: 'ৗ', char: 'ৗ', qwerty: 'X' },
    { label: 'ৈ', char: 'ৈ', qwerty: 'C' },
    { label: 'ল', char: 'ল', qwerty: 'V', popup: 'la_jukta_borno' },
    { label: 'ণ', char: 'ণ', qwerty: 'B', popup: 'na_jukta_borno' },
    { label: 'ষ', char: 'ষ', qwerty: 'N', popup: 'sha_jukta_borno' },
    { label: 'শ', char: 'শ', qwerty: 'M', popup: 'ma_jukta_borno' }
  ];

  // Symbol rows
  const numRow1 = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '০'];
  const numRow2 = ['৳', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
  const numRow3 = ['_', '-', '+', '=', '/', '\\', ':', ';', '?', '।'];

  // English QWERTY
  const engRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const engRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const engRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  // Current decomposition
  const currentAnalysis = decomposeBengaliConjunct(text.trim().split(/\s+/).pop() || '');

  // Popups catalog
  const juktaPopups = (bijoyDataRaw as { juktaPopups?: Record<string, { fileName: string; items: string[] }> }).juktaPopups || {};

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <KeyboardIcon className="w-5 h-5 text-emerald-400" />
              Bijoy Virtual IME &amp; Hardware Keyboard Listener
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Type directly with mouse/touch or enable hardware typing to test physical QWERTY-to-Bijoy key interception.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Hardware Intercept Toggle */}
            <button
              onClick={() => setHardwareTyping(!hardwareTyping)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                hardwareTyping
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${hardwareTyping ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>Physical Keyboard: {hardwareTyping ? 'ON' : 'OFF'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 text-emerald-400 border-slate-700'
                  : 'bg-slate-850 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Typing click audio enabled' : 'Typing click audio muted'}
              aria-label="Toggle keyboard sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Font Toggle */}
            <button
              onClick={() => setUseAnandaFont(!useAnandaFont)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                useAnandaFont
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Font: {useAnandaFont ? 'AnandaMJ (Original)' : 'System Unicode'}
            </button>
          </div>
        </div>

        {/* Typing Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCursorPos(e.target.selectionStart);
            }}
            onSelect={handleSelect}
            placeholder="বাংলা লিখুন (Type or click the virtual keys below)..."
            rows={4}
            className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 text-lg sm:text-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 resize-y shadow-inner ${
              useAnandaFont ? 'font-ananda' : 'font-sans'
            }`}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>Characters: <strong className="text-slate-200">{text.length}</strong></span>
              <span>Words: <strong className="text-slate-200">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong></span>
              {recentKey && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-mono text-[11px]">
                  Last Key: {recentKey}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-slate-400 transition-colors border border-slate-700 hover:border-red-800/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Unicode Character Breakdown */}
        {text.trim().length > 0 && (
          <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 font-mono">Last Word Analysis:</span>
              <span className="text-base font-semibold text-emerald-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {currentAnalysis.base}
              </span>
              <span className="text-slate-400">
                Graphemes: {currentAnalysis.parts.join(' + ')}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 overflow-x-auto max-w-full">
              <span className="text-slate-500">Codepoints:</span>
              <span className="text-teal-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {currentAnalysis.codepoints.join(' ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Common Conjuncts Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Common Conjuncts (যুক্তবর্ণ শর্টকাট - Consonant + Hasanta + Consonant)</span>
          </div>
          <span className="text-[11px] text-slate-500">Click to insert directly</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CONJUNCT_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleKeyInput(preset.result)}
              title={preset.desc}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 text-slate-200 text-sm font-medium border border-slate-700/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Virtual Keyboard (Gboard Style) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl select-none">
        {/* Keyboard Header / Mode Switches */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setKeyMode('bangla')}
              className={`px-3 py-1 rounded-lg font-medium border transition-colors ${
                keyMode === 'bangla'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              বাংলা (Bijoy)
            </button>
            <button
              onClick={() => setKeyMode('symbols')}
              className={`px-3 py-1 rounded-lg font-medium border transition-colors ${
                keyMode === 'symbols'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              ?123 (সংখ্যা / চিহ্ন)
            </button>
            <button
              onClick={() => setKeyMode('english')}
              className={`px-3 py-1 rounded-lg font-medium border transition-colors ${
                keyMode === 'english'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              English (ABC)
            </button>
          </div>

          <div className="flex items-center gap-2">
            {keyMode === 'bangla' && (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {isShift ? 'Shift Mode (মহা-প্রাণ বর্ণ ও দীর্ঘ স্বর)' : 'Normal Mode (অল্প-প্রাণ বর্ণ ও হ্রস্ব স্বর)'}
              </span>
            )}
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div className="space-y-2">
          {keyMode === 'bangla' && (
            <>
              {/* Row 1 */}
              <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                {(isShift ? shiftRow1 : normalRow1).map((k) => (
                  <button
                    key={k.qwerty}
                    onClick={() => handleKeyInput(k.char)}
                    onContextMenu={(e) => {
                      if (k.popup) {
                        e.preventDefault();
                        setActivePopupKey(k.popup);
                      }
                    }}
                    className="relative group h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-slate-100 rounded-xl font-medium text-lg sm:text-xl flex items-center justify-center border border-slate-700 shadow-sm transition-all active:scale-95"
                  >
                    <span>{k.label}</span>
                    <span className="absolute top-1 right-1.5 text-[9px] font-mono text-slate-500 group-hover:text-slate-400">
                      {k.qwerty}
                    </span>
                    {k.popup && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePopupKey(k.popup!);
                        }}
                        className="absolute bottom-0.5 right-1 text-[8px] text-emerald-400 font-bold opacity-70 group-hover:opacity-100"
                        title="Click or right-click to view conjuncts"
                      >
                        ⋯
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-10 gap-1 sm:gap-1.5 px-2 sm:px-3">
                {(isShift ? shiftRow2 : normalRow2).map((k) => (
                  <button
                    key={k.qwerty}
                    onClick={() => handleKeyInput(k.char)}
                    onContextMenu={(e) => {
                      if (k.popup) {
                        e.preventDefault();
                        setActivePopupKey(k.popup);
                      }
                    }}
                    className={`relative group h-12 sm:h-14 active:text-white rounded-xl font-medium text-lg sm:text-xl flex items-center justify-center border shadow-sm transition-all active:scale-95 ${
                      k.char === '্'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40 active:bg-amber-600'
                        : 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 active:bg-emerald-600'
                    }`}
                  >
                    <span>{k.label}</span>
                    <span className="absolute top-1 right-1.5 text-[9px] font-mono text-slate-500 group-hover:text-slate-400">
                      {k.qwerty}
                    </span>
                    {k.popup && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePopupKey(k.popup!);
                        }}
                        className="absolute bottom-0.5 right-1 text-[8px] text-emerald-400 font-bold opacity-70 group-hover:opacity-100"
                        title="Click to view conjuncts"
                      >
                        ⋯
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Row 3 with Shift and Backspace */}
              <div className="flex gap-1 sm:gap-1.5">
                {/* Shift Key */}
                <button
                  onClick={() => setIsShift(!isShift)}
                  className={`w-14 sm:w-16 h-12 sm:h-14 rounded-xl flex items-center justify-center font-semibold text-xs border transition-colors shadow-sm ${
                    isShift
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400/50'
                      : 'bg-slate-750 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  aria-label="Shift Key"
                >
                  <ArrowUp className={`w-5 h-5 ${isShift ? 'stroke-[2.5]' : ''}`} />
                </button>

                {/* Main Middle Keys */}
                <div className="flex-1 grid grid-cols-7 gap-1 sm:gap-1.5">
                  {(isShift ? shiftRow3 : normalRow3).map((k) => (
                    <button
                      key={k.qwerty}
                      onClick={() => handleKeyInput(k.char)}
                      onContextMenu={(e) => {
                        if (k.popup) {
                          e.preventDefault();
                          setActivePopupKey(k.popup);
                        }
                      }}
                      className="relative group h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-slate-100 rounded-xl font-medium text-lg sm:text-xl flex items-center justify-center border border-slate-700 shadow-sm transition-all active:scale-95"
                    >
                      <span>{k.label}</span>
                      <span className="absolute top-1 right-1.5 text-[9px] font-mono text-slate-500 group-hover:text-slate-400">
                        {k.qwerty}
                      </span>
                      {k.popup && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePopupKey(k.popup!);
                          }}
                          className="absolute bottom-0.5 right-1 text-[8px] text-emerald-400 font-bold opacity-70 group-hover:opacity-100"
                        >
                          ⋯
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Backspace Key */}
                <button
                  onClick={() => handleKeyInput('BACKSPACE')}
                  className="w-14 sm:w-16 h-12 sm:h-14 rounded-xl bg-slate-750 hover:bg-slate-700 active:bg-red-700 text-slate-200 flex items-center justify-center border border-slate-700 shadow-sm transition-all active:scale-95"
                  aria-label="Backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {keyMode === 'symbols' && (
            <>
              {/* Symbols Row 1 */}
              <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                {numRow1.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => handleKeyInput(ch)}
                    className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 rounded-xl font-medium text-lg flex items-center justify-center border border-slate-700 shadow-sm"
                  >
                    {ch}
                  </button>
                ))}
              </div>

              {/* Symbols Row 2 */}
              <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
                {numRow2.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => handleKeyInput(ch)}
                    className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 rounded-xl font-medium text-lg flex items-center justify-center border border-slate-700 shadow-sm"
                  >
                    {ch}
                  </button>
                ))}
              </div>

              {/* Symbols Row 3 */}
              <div className="flex gap-1 sm:gap-1.5">
                <div className="flex-1 grid grid-cols-10 gap-1 sm:gap-1.5">
                  {numRow3.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => handleKeyInput(ch)}
                      className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 rounded-xl font-medium text-lg flex items-center justify-center border border-slate-700 shadow-sm"
                    >
                      {ch}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleKeyInput('BACKSPACE')}
                  className="w-14 sm:w-16 h-12 sm:h-14 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {keyMode === 'english' && (
            <>
              {/* English Row 1 */}
              <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                {engRow1.map((ch) => {
                  const letter = isShift ? ch.toUpperCase() : ch;
                  return (
                    <button
                      key={ch}
                      onClick={() => handleKeyInput(letter)}
                      className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 rounded-xl font-medium text-lg flex items-center justify-center border border-slate-700 shadow-sm"
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* English Row 2 */}
              <div className="grid grid-cols-9 gap-1 sm:gap-1.5 px-3">
                {engRow2.map((ch) => {
                  const letter = isShift ? ch.toUpperCase() : ch;
                  return (
                    <button
                      key={ch}
                      onClick={() => handleKeyInput(letter)}
                      className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 rounded-xl font-medium text-lg flex items-center justify-center border border-slate-700 shadow-sm"
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* English Row 3 */}
              <div className="flex gap-1 sm:gap-1.5">
                <button
                  onClick={() => setIsShift(!isShift)}
                  className={`w-14 sm:w-16 h-12 sm:h-14 rounded-xl flex items-center justify-center font-semibold text-xs border transition-colors ${
                    isShift ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-750 text-slate-300 border-slate-700'
                  }`}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>

                <div className="flex-1 grid grid-cols-7 gap-1 sm:gap-1.5">
                  {engRow3.map((ch) => {
                    const letter = isShift ? ch.toUpperCase() : ch;
                    return (
                      <button
                        key={ch}
                        onClick={() => handleKeyInput(letter)}
                        className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-100 rounded-xl font-medium text-lg flex items-center justify-center border border-slate-700 shadow-sm"
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleKeyInput('BACKSPACE')}
                  className="w-14 sm:w-16 h-12 sm:h-14 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {/* Row 4: Bottom row (Numbers/mode, Comma, Space, Dari, Enter) */}
          <div className="flex gap-1.5 sm:gap-2 pt-1">
            <button
              onClick={() => setKeyMode(keyMode === 'bangla' ? 'symbols' : 'bangla')}
              className="w-16 sm:w-20 h-12 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 shadow-sm flex items-center justify-center"
            >
              {keyMode === 'bangla' ? '?123' : 'বাংলা'}
            </button>

            <button
              onClick={() => handleKeyInput(',')}
              className="w-10 sm:w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-lg font-medium border border-slate-700 shadow-sm flex items-center justify-center"
            >
              ,
            </button>

            <button
              onClick={() => handleKeyInput(' ')}
              className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-slate-400 text-xs sm:text-sm font-medium border border-slate-700 shadow-sm flex items-center justify-center tracking-wider"
            >
              SPACE (স্থান)
            </button>

            <button
              onClick={() => handleKeyInput('।')}
              className="w-10 sm:w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-lg font-medium border border-slate-700 shadow-sm flex items-center justify-center"
            >
              ।
            </button>

            <button
              onClick={() => handleKeyInput('\n')}
              className="w-16 sm:w-20 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 font-bold border border-emerald-500 shadow-sm flex items-center justify-center"
              aria-label="Enter"
            >
              <CornerDownLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup Conjuncts Modal when user clicks/right-clicks a key that has a popup keyboard */}
      {activePopupKey && juktaPopups[activePopupKey] && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActivePopupKey(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Popup Conjunct Keyboard: <code className="text-emerald-300 font-mono">{juktaPopups[activePopupKey].fileName}</code>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from original APK resource XML ({juktaPopups[activePopupKey].items.length} characters)
                </p>
              </div>
              <button
                onClick={() => setActivePopupKey(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
              {juktaPopups[activePopupKey].items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleKeyInput(item);
                    setActivePopupKey(null);
                  }}
                  className="h-12 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-100 font-semibold text-lg border border-slate-700/80 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-800/80">
              Click any character to insert it directly at the cursor position.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
