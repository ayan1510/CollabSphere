import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function AdminView({
  metrics,
  adminUsers,
  posts,
  onToggleStatus,
  onToggleRole,
  onDeletePost,
  onPinPost,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'posts'

  if (!metrics) {
    return (
      <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
        <Icons.Loader className="animate-spin w-8 h-8 text-brand-500" />
        <span className="text-xs">Assembling command data...</span>
      </div>
    );
  }

  // Safe variables in case aggregations are empty
  const totals = metrics.totals || { employees: 0, posts: 0, questions: 0, communities: 0 };
  const deptBreakdown = metrics.departmentBreakdown || [];
  const branchBreakdown = metrics.branchBreakdown || [];
  const topSkills = metrics.topSkills || [];
  const topContributors = metrics.topContributors || [];

  // Find max count for department bars scaling
  const maxDeptCount = Math.max(...deptBreakdown.map(d => d.count), 1);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Admin Panel Header navigation */}
      <div className="glass-card p-1.5 flex space-x-2 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 border border-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Icons.LineChart className="w-4 h-4" />
          <span>System Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'users'
              ? 'bg-slate-900 border border-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Icons.Users className="w-4 h-4" />
          <span>User Database</span>
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'posts'
              ? 'bg-slate-900 border border-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Icons.MessageSquare className="w-4 h-4" />
          <span>Content Moderation</span>
        </button>
      </div>

      {/* SECTION 1: OVERVIEW ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Card Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/15 rounded-xl text-blue-400">
                <Icons.UserCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-3xs font-bold uppercase tracking-wider">Total Users</span>
                <span className="text-lg font-bold text-white mt-0.5">{totals.employees}</span>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/15 rounded-xl text-purple-400">
                <Icons.FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-3xs font-bold uppercase tracking-wider">Playbooks</span>
                <span className="text-lg font-bold text-white mt-0.5">{totals.posts}</span>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-emerald-400">
                <Icons.HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-3xs font-bold uppercase tracking-wider">QA Threads</span>
                <span className="text-lg font-bold text-white mt-0.5">{totals.questions}</span>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/15 rounded-xl text-amber-400">
                <Icons.Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-3xs font-bold uppercase tracking-wider">Circles</span>
                <span className="text-lg font-bold text-white mt-0.5">{totals.communities}</span>
              </div>
            </div>
          </div>

          {/* Graphics Segment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Department bar chart */}
            <div className="glass-card p-5 lg:col-span-8 text-left space-y-4">
              <h3 className="text-xs font-bold text-white">Department Engagement (Staff Count)</h3>
              <div className="space-y-3 pt-2">
                {deptBreakdown.length === 0 ? (
                  <span className="text-slate-550 text-xs italic">No data recorded.</span>
                ) : (
                  deptBreakdown.map((dept) => {
                    const pct = (dept.count / maxDeptCount) * 100;
                    return (
                      <div key={dept._id} className="space-y-1">
                        <div className="flex justify-between text-3xs font-bold">
                          <span className="text-slate-300">{dept._id || 'General'}</span>
                          <span className="text-slate-400">{dept.count} Staff</span>
                        </div>
                        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Branch demographics */}
            <div className="glass-card p-5 lg:col-span-4 text-left space-y-4">
              <h3 className="text-xs font-bold text-white font-sans">Active Branch Demographics</h3>
              <div className="space-y-3.5 pt-1.5">
                {branchBreakdown.length === 0 ? (
                  <span className="text-slate-550 text-xs italic">No branch data.</span>
                ) : (
                  branchBreakdown.map((branch, idx) => (
                    <div key={branch._id} className="flex justify-between items-center bg-slate-950/45 p-2 border border-slate-850 rounded-lg text-3xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                        <span className="text-slate-350 font-bold">{branch._id}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md font-bold">{branch.count} Active</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Skill tags */}
            <div className="glass-card p-5 lg:col-span-6 text-left space-y-4">
              <h3 className="text-xs font-bold text-white">Most Prevalent Skills Tags</h3>
              <div className="flex flex-wrap gap-2 pt-1.5">
                {topSkills.length === 0 ? (
                  <span className="text-slate-550 text-xs italic">No skills catalogued.</span>
                ) : (
                  topSkills.map((skill) => (
                    <div key={skill._id} className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950/80 border border-slate-850 rounded-xl">
                      <span className="text-3xs font-bold text-slate-300">{skill._id}</span>
                      <span className="px-1.5 py-0.5 bg-slate-900 text-slate-400 text-4xs rounded font-extrabold">{skill.count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Contributors list */}
            <div className="glass-card p-5 lg:col-span-6 text-left space-y-4">
              <h3 className="text-xs font-bold text-white">Top Active Contributors</h3>
              <div className="space-y-2">
                {topContributors.map((c, idx) => (
                  <div key={c._id} className="flex items-center justify-between p-2 bg-slate-950/50 border border-slate-850/60 rounded-xl text-3xs">
                    <div className="flex items-center space-x-3.5">
                      <span className="font-bold text-slate-500 w-4 text-center">#{idx + 1}</span>
                      <img src={c.profileImage} alt={c.name} className="w-8 h-8 rounded-full border border-slate-800 bg-slate-800" />
                      <div className="text-left">
                        <span className="block font-bold text-slate-200">{c.name}</span>
                        <span className="block text-slate-450 text-4xs mt-0.5">{c.department}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold rounded-lg">{c.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: USER MANAGEMENT TABLE */}
      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-450 text-3xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-5">Employee</th>
                  <th className="py-3 px-4">Contact Email</th>
                  <th className="py-3 px-4">Credentials</th>
                  <th className="py-3 px-4">Branch Status</th>
                  <th className="py-3 px-5 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => {
                  const isSelf = user._id === currentUser._id;
                  return (
                    <tr key={user._id} className="border-b border-slate-800/60 transition-colors text-xs hover:bg-slate-900/30">
                      <td className="py-3.5 px-5 font-bold text-white flex items-center space-x-3.5">
                        <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full border border-slate-800 bg-slate-800" />
                        <div>
                          <span className="block font-bold text-slate-200">{user.name}</span>
                          <span className="block text-slate-500 text-3xs mt-0.5">{user.department}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-3xs">{user.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-4xs ${
                          user.role === 'admin' 
                            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                            : 'bg-slate-900 border border-slate-800 text-slate-450'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-350">
                        {user.branch} • <span className={`font-semibold ${user.status === 'active' ? 'text-emerald-450' : 'text-rose-450'}`}>
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Suspend / Active Toggle */}
                          <button
                            disabled={isSelf}
                            onClick={() => onToggleStatus(user._id)}
                            className={`px-2 py-1 rounded font-semibold text-3xs border transition-colors ${
                              user.status === 'active'
                                ? 'bg-rose-500/10 border-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white'
                                : 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                            } ${isSelf ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>

                          {/* Toggle Role admin <-> employee */}
                          <button
                            disabled={isSelf}
                            onClick={() => onToggleRole(user._id)}
                            className={`px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded font-semibold text-3xs transition-colors ${
                              isSelf ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                          >
                            {user.role === 'admin' ? 'Make Employee' : 'Make Admin'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: CONTENT MODERATION LIST */}
      {activeTab === 'posts' && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-white text-left">Governance Log: Remove / Pin Playbooks</h3>
          
          <div className="space-y-3">
            {posts.length === 0 ? (
              <span className="block text-slate-500 text-xs italic text-left">No posts catalogued.</span>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4 text-left text-xs">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 text-4xs font-bold uppercase rounded">{post.category}</span>
                      <span className="text-3xs text-slate-500 font-bold">{post.user?.name} ({post.user?.branch})</span>
                    </div>
                    <h4 className="font-bold text-white truncate">{post.title}</h4>
                    <p className="text-slate-450 text-3xs line-clamp-1">{post.content}</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Pin/Unpin */}
                    <button
                      onClick={() => onPinPost(post._id)}
                      className={`px-2 py-1 rounded font-semibold text-3xs border transition-colors flex items-center space-x-1 ${
                        post.pinned
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-slate-900 hover:text-slate-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icons.Pin className="w-3 h-3" />
                      <span>{post.pinned ? 'Unpin Post' : 'Pin Feed'}</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeletePost(post._id)}
                      className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white text-rose-400 rounded transition-colors"
                      title="Remove Content"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
