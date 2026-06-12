import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function DiscoveryView({ users, currentUser, onSelectExpert, selectedExpert, expertPosts, onCloseModal }) {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Local filtering logic in addition to navbar global search
  const filteredUsers = users.filter(user => {
    // Hide suspended accounts
    if (user.status === 'suspended') return false;

    // Filter department
    if (selectedDept && user.department !== selectedDept) return false;

    // Filter branch
    if (selectedBranch && user.branch !== selectedBranch) return false;

    // Filter search string (name or skills)
    if (localSearch) {
      const q = localSearch.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchSkills = user.skills?.some(s => s.toLowerCase().includes(q));
      const matchDept = user.department?.toLowerCase().includes(q);
      if (!matchName && !matchSkills && !matchDept) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Filtering Header Toolbar */}
      <div className="glass-card p-4 md:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Search Skill or Name</label>
          <div className="relative">
            <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="e.g., PHP, React, Admin..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Filter by Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Product Management">Product Management</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Filter by Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="">All Branches</option>
            <option value="Kolkata Branch">Kolkata Branch</option>
            <option value="Delhi Branch">Delhi Branch</option>
            <option value="Mumbai Branch">Mumbai Branch</option>
            <option value="Headquarters">Headquarters</option>
          </select>
        </div>
      </div>

      {/* Grid of Expert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 col-span-full flex flex-col items-center justify-center space-y-3">
            <Icons.SearchX className="w-10 h-10 text-slate-650" />
            <h3 className="text-sm font-bold text-slate-400">No experts matched your query</h3>
            <p className="text-xs text-slate-500">Try searching for other tags like "PHP", "React", or change the department filters.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectExpert(user._id)}
              className="glass-card p-5 hover:border-brand-500/35 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Highlight background decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/5 rounded-full group-hover:bg-brand-500/10 blur-xl transition-all" />

              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center space-x-3.5">
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors flex items-center space-x-1.5">
                      <span>{user.name}</span>
                      {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-4xs font-bold rounded uppercase">Admin</span>
                      )}
                    </h3>
                    <span className="text-3xs text-slate-400 font-semibold block truncate">
                      {user.department} • {user.branch}
                    </span>
                  </div>
                </div>

                {/* Short Bio */}
                <p className="text-slate-350 text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {user.bio || 'This employee hasn\'t added a biography yet. Specialist in sharing workplace knowledge.'}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 text-slate-400 text-3xs font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-3xs italic">No skills listed yet</span>
                  )}
                </div>
              </div>

              {/* Footer Metrics */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-3xs font-semibold">
                <div className="flex items-center space-x-1">
                  <Icons.Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-slate-200 font-bold">{user.points || 0} Points</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icons.Award className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-slate-300 font-medium">
                    {user.badges && user.badges.length > 0 ? `${user.badges.length} Badges` : 'No Badges'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Profile Detail Overlay Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-slide-up max-h-[85vh] overflow-y-auto">
            {/* Modal glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close */}
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Profile Sidebar inside modal */}
              <div className="md:col-span-4 text-center md:text-left space-y-4">
                <img
                  src={selectedExpert.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(selectedExpert.name)}`}
                  alt={selectedExpert.name}
                  className="w-24 h-24 rounded-full border border-slate-700 bg-slate-800 mx-auto md:mx-0 shadow-lg"
                />
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white flex items-center justify-center md:justify-start space-x-1.5">
                    <span>{selectedExpert.name}</span>
                    {selectedExpert.role === 'admin' && (
                      <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-4xs font-bold rounded uppercase">Admin</span>
                    )}
                  </h2>
                  <span className="text-xs text-slate-400 block">{selectedExpert.department}</span>
                  <span className="text-xs text-slate-450 block">{selectedExpert.branch}</span>
                </div>

                <div className="p-3 bg-slate-950/65 border border-slate-850 rounded-xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Contributor Rating:</span>
                    <span className="font-bold text-amber-500 flex items-center space-x-0.5">
                      <Icons.Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{selectedExpert.points || 0} pts</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Badges:</span>
                    <span className="font-bold text-brand-400">{selectedExpert.badges?.length || 0}</span>
                  </div>
                </div>

                {/* Badges list */}
                {selectedExpert.badges && selectedExpert.badges.length > 0 && (
                  <div className="text-left space-y-1.5">
                    <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Unlocked Credentials</span>
                    <div className="space-y-1">
                      {selectedExpert.badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-brand-500/5 border border-brand-500/15 p-1.5 rounded-lg text-3xs">
                          <Icons.BadgeCheck className="w-3.5 h-3.5 text-brand-400" />
                          <span className="font-semibold text-slate-350">{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio & Activities */}
              <div className="md:col-span-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">About Employee</span>
                  <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/30 p-3 rounded-lg border border-slate-850">
                    {selectedExpert.bio || `${selectedExpert.name} is a vital member of the ${selectedExpert.department} team at the ${selectedExpert.branch}. Let's reach out to collaborate!`}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Specializations & Core Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExpert.skills && selectedExpert.skills.length > 0 ? (
                      selectedExpert.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-3xs font-semibold rounded-lg">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">No skills listed</span>
                    )}
                  </div>
                </div>

                {/* Published Playbooks */}
                <div className="space-y-3">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Shared Knowledge Playbooks ({expertPosts.length})</span>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {expertPosts.length === 0 ? (
                      <span className="block text-slate-500 text-xs italic">No knowledge shared yet on this portal.</span>
                    ) : (
                      expertPosts.map((post) => (
                        <div key={post._id} className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg text-left space-y-1">
                          <div className="flex justify-between items-center text-4xs text-slate-500">
                            <span>{post.category}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white">{post.title}</h4>
                          <p className="text-4xs text-slate-400 line-clamp-2 leading-relaxed">{post.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
