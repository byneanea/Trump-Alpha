import React from 'react';
import { LayoutDashboard, Radio, Crosshair, Settings, Eye } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intel', label: 'Intel Feed (Eyes)', icon: Eye },
    { id: 'strategy', label: 'Strategy (Hands)', icon: Crosshair },
  ];

  return (
    <div className="flex h-screen bg-terminal-bg text-gray-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-terminal-panel border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
            <span className="text-trump-red">TRUMP</span>
            <span className="text-gray-100">ALPHA</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Surveillance V2.0</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-blue-900/40 text-blue-400 border border-blue-900/50'
                  : 'hover:bg-gray-800 hover:text-white text-gray-400'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            System Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white uppercase tracking-tight">
            {navItems.find(n => n.id === activeTab)?.label}
          </h2>
          <div className="flex gap-4 items-center">
            <div className="text-xs font-mono text-gray-400">
               MKTS: <span className="text-emerald-400">OPEN</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-700"></div>
            <div className="text-xs font-mono text-trump-red font-bold">
               MAGA INDEX: +1.24%
            </div>
          </div>
        </div>
        
        <div className="p-8 pb-20 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};