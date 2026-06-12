import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function CommunitiesView({
  communities,
  currentUser,
  onCreateCommunity,
  onJoinCommunity,
  onExploreCommunityFeed
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engineering');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    onCreateCommunity({ name, description, category });

    setName('');
    setDescription('');
    setCategory('Engineering');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Circle Hub Header Banner */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h3 className="text-sm font-bold text-white">Workspace Interest Circles</h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore specific branches or topic groups, exchange lessons, and align on department playbooks.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Launch a Circle</span>
        </button>
      </div>

      {/* Grid of Interest Circles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {communities.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 col-span-full flex flex-col items-center justify-center space-y-3">
            <Icons.Users className="w-10 h-10 text-slate-650" />
            <h3 className="text-sm font-bold text-slate-400">No interest circles found</h3>
            <p className="text-xs text-slate-500">Be the first to launch a community and invite department colleagues!</p>
          </div>
        ) : (
          communities.map((c) => {
            const isMember = c.members?.includes(currentUser._id);
            return (
              <div
                key={c._id}
                className="glass-card p-5 flex flex-col justify-between hover:border-slate-800 transition-all group relative overflow-hidden text-left"
              >
                {/* Visual Category Label */}
                <div className="absolute top-0 right-0 p-3">
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-400 text-4xs font-bold uppercase rounded-md">
                    {c.category}
                  </span>
                </div>

                <div className="space-y-3 mt-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors flex items-center space-x-1.5">
                    <Icons.Group className="w-4.5 h-4.5 text-brand-500" />
                    <span>{c.name}</span>
                  </h3>
                  
                  <p className="text-xs text-slate-350 leading-relaxed min-h-[2.5rem]">
                    {c.description}
                  </p>

                  <div className="flex items-center space-x-3 text-slate-400 text-3xs font-semibold">
                    <span className="flex items-center space-x-1">
                      <Icons.UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.members?.length || 0} Members</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>Created by {c.createdBy?.name || 'Administrator'}</span>
                  </div>
                </div>

                {/* Engagement Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-3.5 border-t border-slate-800/80">
                  <button
                    onClick={() => onJoinCommunity(c._id)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center space-x-1.5 focus:outline-none ${
                      isMember
                        ? 'bg-slate-900 border-slate-800 text-slate-450 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400'
                        : 'bg-brand-600/10 border-brand-500/15 text-brand-400 hover:bg-brand-600 hover:text-white'
                    }`}
                  >
                    {isMember ? (
                      <>
                        <Icons.Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                        <span>Leave Circle</span>
                      </>
                    ) : (
                      <>
                        <Icons.UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Join Circle</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onExploreCommunityFeed(c._id)}
                    className="py-1.5 bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Icons.Rss className="w-3.5 h-3.5" />
                    <span>Explore Feed</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Community overlay Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden animate-slide-up space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <Icons.Users className="w-4.5 h-4.5 text-brand-400" />
                <span>Launch an Interest Circle</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-white"
              >
                <Icons.X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Circle Name</label>
              <input
                type="text"
                required
                placeholder="e.g., PHP Development Hub, Kolkata Sales Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Description / Goal</label>
              <textarea
                required
                rows="4"
                placeholder="Describe what members will share, discuss, and what the onboarding goals of this group are..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Department Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Product Management">Product Management</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Icons.Send className="w-3.5 h-3.5" />
                <span>Launch Circle</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
