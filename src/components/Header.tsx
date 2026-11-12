import React from 'react';
import { Keyboard, FolderTree, TableProperties, Sparkles, Smartphone, ExternalLink, CheckCircle2 } from 'lucide-react';

export type ActiveTab = 'simulator' | 'inspector' | 'mapping' | 'conjuncts' | 'blueprint';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  xmlCount: number;
  popupCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  xmlCount,
  popupCount
}) => {
  const tabs = [
    { id: 'simulator' as ActiveTab, label: 'Bijoy Simulator', icon: Keyboard, badge: 'Live' },
    { id: 'inspector' as ActiveTab, label: 'Extracted XMLs', icon: FolderTree, badge: `${xmlCount}` },
    { id: 'mapping' as ActiveTab, label: 'Mapping Table', icon: TableProperties },
    { id: 'conjuncts' as ActiveTab, label: 'Juktakhar Conjuncts', icon: Sparkles, badge: `${popupCount}` },
    { id: 'blueprint' as ActiveTab, label: 'Android Blueprint', icon: Smartphone }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-3.5 gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              ব
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Original Bijoy Keyboard
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                    v3.0 Reference Extracted
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Extracted from <code className="text-slate-300 font-mono">BijoyGboard_Reference_Ingredients.zip</code> • 48 Decoded XMLs • Complete Conjunct &amp; Unicode Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Binary XMLs Decoded</span>
            </div>
            <a
              href="https://github.com/yuzhong999/Original-Bijoy-keyboard"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
