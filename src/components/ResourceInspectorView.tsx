import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  Image as ImageIcon,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  Code2,
  Cpu,
  Layers
} from 'lucide-react';
import bijoyDataRaw from '../data/bijoy_data.json';

export const ResourceInspectorView: React.FC = () => {
  const allXmls = (bijoyDataRaw as { allXmls?: Record<string, string> }).allXmls || {};
  const dexStrings = (bijoyDataRaw as { dexStrings?: string[] }).dexStrings || [];
  const inventory = (bijoyDataRaw as { inventory?: string }).inventory || '';

  const fileKeys = Object.keys(allXmls).sort();
  const [selectedFile, setSelectedFile] = useState<string>(
    fileKeys.includes('res/xml/bangla.xml') ? 'res/xml/bangla.xml' : fileKeys[0] || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [codeSearch, setCodeSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'xml' | 'drawables' | 'dex' | 'docs'>('xml');

  // Filtered files
  const filteredFiles = fileKeys.filter((f) =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFileContent = allXmls[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFileContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.split('/').pop() || 'resource.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Drawables catalog
  const drawableNames = [
    'a_kar.png', 'aa_kar.png', 'abc.png', 'abc_kb.png', 'b_one.png', 'bijoy_kb.png',
    'bijoyandroidicon.png', 'bisorga.png', 'bn.png', 'delete.png', 'delete_1.png',
    'delete_4.png', 'delete_b.png', 'delete_nw.png', 'delete_q.png', 'delete_q3.png',
    'delete_w.png', 'dhree.png', 'dhru_kar.png', 'english.png', 'enter.png',
    'ja_fola.png', 'jukta.png', 'ka.png', 'more.png', 'more_1.png', 'more_l.png',
    'oi_kar.png', 'oikar_20_karnapuli.png', 'one.png', 'ra_fola.png', 'ree_kar.png',
    'ref.png', 'rshee_kar.png', 'rshu_kar.png', 'shift.png', 'shift_1.png',
    'shift_2.png', 'shift_3.png', 'shift_4.png', 'sign.png', 'sym_keyboard_delete.png',
    'sym_keyboard_return.png', 'sym_keyboard_search.png', 'unos.png'
  ];

  return (
    <div className="space-y-6">
      {/* Top Description Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-400" />
              Decoded Resources &amp; APK Asset Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Original Android binary XMLs have been automatically parsed into standard indented XML syntax with namespaces intact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('xml')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCategory === 'xml'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Decoded XMLs ({fileKeys.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('drawables')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCategory === 'drawables'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Graphics &amp; Icons ({drawableNames.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('dex')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCategory === 'dex'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>DEX Strings</span>
            </button>

            <button
              onClick={() => setActiveCategory('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCategory === 'docs'
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manifest &amp; Docs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on Category */}
      {activeCategory === 'xml' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* File Tree / List Sidebar */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col h-[650px]">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search XML files..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs font-mono">
              {filteredFiles.map((fpath) => {
                const isSelected = selectedFile === fpath;
                const isImportant = fpath.includes('bangla.xml') || fpath.includes('bangla_shift.xml') || fpath.includes('ka_jukta');
                return (
                  <button
                    key={fpath}
                    onClick={() => setSelectedFile(fpath)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : isImportant ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{fpath}</span>
                    </div>
                    {isImportant && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col h-[650px]">
            {/* Viewer Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white font-mono">{selectedFile}</span>
                <span className="text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {currentFileContent.split('\n').length} lines
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-auto border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed">
              <pre>
                {currentFileContent.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-slate-900/60 py-0.5">
                    <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0 font-sans text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 whitespace-pre">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Drawables & Graphics View */}
      {activeCategory === 'drawables' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Extracted Keyboard Icon Graphics ({drawableNames.length} PNG assets)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These original icons were extracted directly from <code className="text-slate-300 font-mono">res/drawable/</code>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {drawableNames.map((name) => (
              <div
                key={name}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center group hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img
                    src={`/reference_ingredients/original_resources/res/drawable/${name}`}
                    alt={name}
                    className="max-h-full max-w-full object-contain filter invert contrast-125"
                    onError={(e) => {
                      // Fallback if inverted image is hard to see
                      (e.target as HTMLElement).style.filter = 'none';
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate w-full" title={name}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEX Strings View */}
      {activeCategory === 'dex' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Extracted Dalvik Bytecode Strings (from classes.dex)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Printable identifier strings and symbols extracted from the compiled Dalvik bytecode (<code className="text-slate-300 font-mono">classes_dex_strings.txt</code>).
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
            {dexStrings.map((str, idx) => (
              <div key={idx} className="flex hover:bg-slate-900 py-0.5">
                <span className="w-12 text-slate-600 text-right pr-4 shrink-0 font-sans select-none">
                  {idx + 1}
                </span>
                <span className="text-emerald-300">{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Docs & Manifest */}
      {activeCategory === 'docs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Manifest */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Decoded AndroidManifest.xml
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 max-h-96 overflow-auto">
              <pre>{allXmls['AndroidManifest.xml'] || 'Manifest not loaded'}</pre>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              FILE_INVENTORY.md Summary
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 max-h-96 overflow-auto whitespace-pre-wrap">
              {inventory || 'Inventory not loaded'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
