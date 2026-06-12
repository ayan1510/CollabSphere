import React from 'react';
import * as Icons from 'lucide-react';

export default function Navbar({ activeView, searchQuery, onSearchChange, apiOnline, sidebarOpen, setSidebarOpen }) {
  const getViewTitle = () => {
    switch (activeView) {
      case 'feed':
        return 'Knowledge Sharing Feed';
      case 'discovery':
        return 'Expert Directory';
      case 'qa':
        return 'Discussion & Q&A Forum';
      case 'communities':
        return 'Interest Circles';
      case 'library':
        return 'Learning Library';
      case 'leaderboard':
        return 'Gamification Leaderboard';
      case 'admin':
        return 'Admin Command Center';
      case 'profile':
        return 'Employee Profile Details';
      default:
        return 'CollabSphere Dashboard';
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 w-full lg:w-[calc(100%-16rem)] lg:ml-64 text-slate-300 transition-all duration-300">
      {/* Title & Hamburger Menu */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 bg-slate-950/60 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors lg:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <Icons.Menu className="w-4.5 h-4.5" />
        </button>
        <h2 className="text-sm md:text-lg font-bold font-sans text-white truncate max-w-[150px] md:max-w-none">{getViewTitle()}</h2>
      </div>

      {/* Global Search Bar (only relevant for search-friendly views) */}
      {(activeView === 'feed' || activeView === 'discovery' || activeView === 'qa' || activeView === 'library') ? (
        <div className="w-80 relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Icons.Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={
              activeView === 'discovery' 
                ? "Search experts by name or skill tag..." 
                : activeView === 'qa'
                ? "Search forum questions..."
                : "Search database..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all placeholder-slate-500"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')} 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div />
      )}

      {/* Right Side: Network Badge & Notifications */}
      <div className="flex items-center space-x-4">
        {/* Network sync status badge */}
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-3xs font-bold tracking-wider uppercase border ${
          apiOnline 
            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' 
            : 'bg-amber-500/5 border-amber-500/10 text-amber-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse glow-emerald' : 'bg-amber-500 animate-pulse'}`} />
          <span>{apiOnline ? 'Live Server Sync' : 'Demo Mode'}</span>
        </div>

        {/* Notifications mock bell */}
        <button className="p-1.5 bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors relative">
          <Icons.Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
