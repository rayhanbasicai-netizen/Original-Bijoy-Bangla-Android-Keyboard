import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import bijoyDataRaw from '../data/bijoy_data.json';
import { decomposeBengaliConjunct, getUnicodeHex } from '../utils/bijoyEngine';

export const ConjunctExplorerView: React.FC = () => {
  const juktaPopups = (bijoyDataRaw as { juktaPopups?: Record<string, { fileName: string; items: string[] }> }).juktaPopups || {};
  const popupKeys = Object.keys(juktaPopups).sort();

  const [selectedPopup, setSelectedPopup] = useState<string>(
    popupKeys.includes('ka_jukta_borno') ? 'ka_jukta_borno' : popupKeys[0] || ''
  );
  const [selectedItem, setSelectedItem] = useState<string>('ক্ষ');
  const [copied, setCopied] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const currentPopup = juktaPopups[selectedPopup] || { fileName: '', items: [] };

  const handleCopy = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const analysis = decomposeBengaliConjunct(selectedItem);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Bengali Juktakhar (যুক্তবর্ণ) Popup Catalog &amp; Conjunct Decomposer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Extracted from all 19 original XML popup definitions in the APK (<code className="text-slate-300 font-mono">res/xml/*_jukta_borno.xml</code>).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Popup Sets Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
            Popup Keyboard Groups ({popupKeys.length})
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {popupKeys.map((pKey) => {
              const data = juktaPopups[pKey];
              const isSelected = selectedPopup === pKey;
              const displayName = pKey
                .replace('_jukta_borno', ' যুক্তবর্ণ')
                .replace('shar_borno', 'স্বরবর্ণ (Vowels)')
                .replace('signs', 'চিহ্ন (Signs & Symbols)');

              return (
                <button
                  key={pKey}
                  onClick={() => {
                    setSelectedPopup(pKey);
                    if (data.items.length > 0) {
                      setSelectedItem(data.items[0]);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{data.items[0] || 'ব'}</span>
                    <span className="text-xs">{displayName}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      isSelected
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {data.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Conjunct Grid & Deep Inspector */}
        <div className="lg:col-span-8 space-y-5">
          {/* Grid of Characters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Conjuncts in <code className="text-emerald-300 font-mono">{currentPopup.fileName}</code>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select any conjunct below to inspect its decomposition and Unicode sequence.
                </p>
              </div>

              <span className="text-xs text-slate-500">
                {currentPopup.items.length} characters
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
              {currentPopup.items.map((char, idx) => {
                const isSelected = selectedItem === char;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedItem(char)}
                    className={`h-14 rounded-xl flex items-center justify-center text-xl font-bold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
                    }`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Conjunct Breakdown Inspector */}
          {selectedItem && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Selected Conjunct Analysis
                </span>

                <button
                  onClick={() => handleCopy(selectedItem)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Character'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl font-bold text-emerald-400 shadow-inner">
                  {selectedItem}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="text-sm font-semibold text-white">
                    Keystroke Decomposition (Bijoy Composition Formula):
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {analysis.parts.map((p, i) => (
                      <React.Fragment key={i}>
                        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold text-base border border-slate-700">
                          {p === '্' ? '্ (hasanta)' : p}
                        </span>
                        {i < analysis.parts.length - 1 && (
                          <span className="text-slate-500 font-bold">+</span>
                        )}
                      </React.Fragment>
                    ))}
                    <ArrowRight className="w-4 h-4 text-emerald-400 mx-1 hidden sm:inline" />
                    <span className="px-3 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 font-bold text-base border border-emerald-800/40">
                      {selectedItem}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-mono pt-1">
                    Unicode Codepoints: <strong className="text-teal-400">{analysis.codepoints.join(' ')}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
