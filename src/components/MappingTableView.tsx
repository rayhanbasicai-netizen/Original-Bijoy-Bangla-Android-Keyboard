import React, { useState } from 'react';
import {
  Table,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { BIJOY_KEY_MAP, BijoyKeyMapping, getUnicodeHex } from '../utils/bijoyEngine';

export const MappingTableView: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const mappings: BijoyKeyMapping[] = Object.values(BIJOY_KEY_MAP);

  const filtered = mappings.filter((item) => {
    const matchesSearch =
      item.qwertyKey.toLowerCase().includes(search.toLowerCase()) ||
      item.normalLabel.includes(search) ||
      item.shiftLabel.includes(search) ||
      item.normalUnicode.toLowerCase().includes(search.toLowerCase()) ||
      item.shiftUnicode.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (char: string, keyId: string) => {
    navigator.clipboard.writeText(char);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleExportCSV = () => {
    const headers = [
      'QWERTY Key',
      'Normal Label',
      'Normal Output',
      'Normal Unicode',
      'Shift Label',
      'Shift Output',
      'Shift Unicode',
      'Popup Keyboard',
      'Category',
      'Description'
    ];

    const rows = filtered.map((m) => [
      m.qwertyKey,
      m.normalLabel,
      m.normalChar,
      m.normalUnicode,
      m.shiftLabel,
      m.shiftChar,
      m.shiftUnicode,
      m.popupKey || 'None',
      m.category,
      `"${m.description}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bijoy_key_mappings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Table Header / Filter toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-400" />
              Bijoy Key-by-Key Technical Mapping Specification
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive reference table conforming to Google AI Studio Analysis requirement #4.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by key, Bengali char, Unicode codepoint (e.g. 'j', 'ক', 'U+0995')..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Categories ({mappings.length})</option>
              <option value="consonant">Consonants (ব্যঞ্জনবর্ণ)</option>
              <option value="vowel">Vowels (স্বরবর্ণ)</option>
              <option value="matra">Matras / Kars (কার চিহ্ন)</option>
              <option value="modifier">Modifiers &amp; Hasanta (যুক্তচিহ্ন)</option>
              <option value="number">Numbers &amp; Signs (সংখ্যা ও প্রতীক)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Specification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">QWERTY Key</th>
                <th className="py-3 px-4">Normal Output</th>
                <th className="py-3 px-4">Normal Codepoint</th>
                <th className="py-3 px-4">Shift Output</th>
                <th className="py-3 px-4">Shift Codepoint</th>
                <th className="py-3 px-4">Popup / Conjuncts</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Notes &amp; Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((item) => (
                <tr
                  key={item.qwertyKey}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Physical Key */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                      {item.qwertyKey.toUpperCase()}
                    </span>
                  </td>

                  {/* Normal Output */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleCopy(item.normalChar, `${item.qwertyKey}-normal`)}
                      className="flex items-center gap-2 group/btn hover:text-emerald-400"
                      title="Click to copy"
                    >
                      <span className="text-xl font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {item.normalChar}
                      </span>
                      {copiedKey === `${item.qwertyKey}-normal` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Normal Unicode */}
                  <td className="py-3 px-4 font-mono text-emerald-400 text-[11px]">
                    {item.normalUnicode}
                  </td>

                  {/* Shift Output */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleCopy(item.shiftChar, `${item.qwertyKey}-shift`)}
                      className="flex items-center gap-2 group/btn hover:text-teal-400"
                      title="Click to copy"
                    >
                      <span className="text-xl font-bold text-teal-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {item.shiftChar}
                      </span>
                      {copiedKey === `${item.qwertyKey}-shift` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Shift Unicode */}
                  <td className="py-3 px-4 font-mono text-teal-400 text-[11px]">
                    {item.shiftUnicode}
                  </td>

                  {/* Popup XML */}
                  <td className="py-3 px-4">
                    {item.popupKey ? (
                      <span className="px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40 font-mono text-[10px]">
                        {item.popupKey}.xml
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      item.category === 'consonant'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : item.category === 'matra'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : item.category === 'modifier'
                        ? 'bg-red-950/60 text-red-300 border border-red-800/40'
                        : item.category === 'vowel'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.category}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-4 text-slate-300">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
