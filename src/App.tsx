/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { SimulatorView } from './components/SimulatorView';
import { ResourceInspectorView } from './components/ResourceInspectorView';
import { MappingTableView } from './components/MappingTableView';
import { ConjunctExplorerView } from './components/ConjunctExplorerView';
import { AndroidBlueprintView } from './components/AndroidBlueprintView';
import bijoyDataRaw from './data/bijoy_data.json';
import { CheckCircle2, Download, ExternalLink, Github, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  const stats = (bijoyDataRaw as { stats?: { totalDecodedXmls: number; totalJuktaPopups: number } }).stats || {
    totalDecodedXmls: 48,
    totalJuktaPopups: 19
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        xmlCount={stats.totalDecodedXmls}
        popupCount={stats.totalJuktaPopups}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && <SimulatorView />}
        {activeTab === 'inspector' && <ResourceInspectorView />}
        {activeTab === 'mapping' && <MappingTableView />}
        {activeTab === 'conjuncts' && <ConjunctExplorerView />}
        {activeTab === 'blueprint' && <AndroidBlueprintView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Extracted from <a href="https://github.com/yuzhong999/Original-Bijoy-keyboard" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-mono">yuzhong999/Original-Bijoy-keyboard</a>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>48 Decoded Android XMLs</span>
            <span>•</span>
            <span>19 Conjunct Popups</span>
            <span>•</span>
            <span>AnandaMJ TTF Included</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
