import React from 'react';
import * as Icons from 'lucide-react';

export default function Sidebar({ user, activeView, onViewChange, onLogout, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'feed', label: 'Knowledge Feed', icon: 'Rss' },
    { id: 'discovery', label: 'Expert Directory', icon: 'Search' },
    { id: 'qa', label: 'Discussion Forum', icon: 'HelpCircle' },
    { id: 'communities', label: 'Interest Circles', icon: 'Users' },
    { id: 'library', label: 'Learning Library', icon: 'BookOpen' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'Award' },
  ];

  return (
    <aside className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 text-slate-300 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg">
          <Icons.Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white font-sans">
          Collab<span className="text-brand-400">Sphere</span>
        </span>
      </div>

      {/* User profile segment */}
      <div className="p-5 border-b border-slate-800/60 bg-slate-950/20">
        <div className="flex items-center space-x-3.5">
          <img
            src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-11 h-11 rounded-full border border-slate-700 bg-slate-800"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer" onClick={() => { onViewChange('profile'); if (setSidebarOpen) setSidebarOpen(false); }}>
              {user.name}
            </h3>
            <span className="text-3xs text-slate-400 font-medium block truncate">
              {user.department} • {user.branch}
            </span>
          </div>
        </div>

        {/* User points & badges summary */}
        <div className="mt-4 flex items-center justify-between p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg">
          <div className="flex items-center space-x-1.5">
            <Icons.Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-200">{user.points || 0} pts</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <Icons.Tag className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-300">
              {user.badges && user.badges.length > 0 ? `${user.badges.length} Badges` : 'No Badges'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = Icons[item.icon] || Icons.HelpCircle;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onViewChange(item.id); if (setSidebarOpen) setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600/15 border border-brand-500/20 text-brand-400 font-semibold'
                  : 'hover:bg-slate-800/50 hover:text-slate-100 text-slate-400'
              }`}
            >
              <IconComponent className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Profile specific button */}
        <button
          onClick={() => { onViewChange('profile'); if (setSidebarOpen) setSidebarOpen(false); }}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeView === 'profile'
              ? 'bg-brand-600/15 border border-brand-500/20 text-brand-400 font-semibold'
              : 'hover:bg-slate-800/50 hover:text-slate-100 text-slate-400'
          }`}
        >
          <Icons.User className="w-4.5 h-4.5" />
          <span>My Profile</span>
        </button>

        {/* Divider */}
        <div className="h-px bg-slate-800/80 my-4" />

        {/* Admin Command Center */}
        {user.role === 'admin' && (
          <button
            onClick={() => { onViewChange('admin'); if (setSidebarOpen) setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === 'admin'
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                : 'hover:bg-slate-800/50 hover:text-slate-100 text-slate-400'
            }`}
          >
            <Icons.ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
            <span>Admin Control Panel</span>
          </button>
        )}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-800/85">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-rose-400 transition-all duration-200"
        >
          <Icons.LogOut className="w-4.5 h-4.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
