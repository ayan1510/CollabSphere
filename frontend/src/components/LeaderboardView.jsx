import React from 'react';
import * as Icons from 'lucide-react';

export default function LeaderboardView({ users, currentUser }) {
  // Sort users by points descending (only active users)
  const sortedUsers = [...users]
    .filter(u => u.status !== 'suspended')
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  // Top 3 podium spots
  const podiumUsers = sortedUsers.slice(0, 3);
  const regularUsers = sortedUsers.slice(3);

  // Helper to draw podium style badges
  const getPodiumBadgeColor = (index) => {
    switch (index) {
      case 0: // Gold
        return {
          border: 'border-amber-400 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.1)]',
          icon: <Icons.Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />,
          rank: 'Rank 1'
        };
      case 1: // Silver
        return {
          border: 'border-slate-300 bg-slate-900/40 shadow-[0_0_25px_rgba(203,213,225,0.06)]',
          icon: <Icons.Award className="w-6 h-6 text-slate-300" />,
          rank: 'Rank 2'
        };
      case 2: // Bronze
        return {
          border: 'border-amber-700 bg-amber-900/10 shadow-[0_0_25px_rgba(180,83,9,0.06)]',
          icon: <Icons.Medal className="w-6 h-6 text-amber-700" />,
          rank: 'Rank 3'
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Intro header */}
      <div className="glass-card p-5 text-left">
        <h3 className="text-sm font-bold text-white">Knowledge Champions Leaderboard</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Recognizing active contributors who share best practices, answer coworker questions, and upload resources. Earn points to level up and unlock company badges!
        </p>
      </div>

      {/* Podium Cards (1st, 2nd, 3rd) */}
      {podiumUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Second Place (drawn left in desktop view) */}
          {podiumUsers[1] && (
            <div className={`glass-card p-6 border flex flex-col items-center justify-between text-center relative md:order-1 ${getPodiumBadgeColor(1).border}`}>
              <div className="absolute top-3 right-3">
                {getPodiumBadgeColor(1).icon}
              </div>
              <span className="text-slate-450 text-4xs font-bold uppercase tracking-wider block mb-3">{getPodiumBadgeColor(1).rank}</span>
              <img
                src={podiumUsers[1].profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(podiumUsers[1].name)}`}
                alt={podiumUsers[1].name}
                className="w-16 h-16 rounded-full border border-slate-700 bg-slate-800 mb-3 shadow"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{podiumUsers[1].name}</h4>
                <span className="text-3xs text-slate-400 block">{podiumUsers[1].department}</span>
              </div>
              <div className="mt-4 px-3 py-1 bg-slate-950/80 rounded-full border border-slate-800 text-xs font-bold text-slate-200">
                {podiumUsers[1].points || 0} pts
              </div>
            </div>
          )}

          {/* First Place (Center, larger) */}
          {podiumUsers[0] && (
            <div className={`glass-card p-8 border flex flex-col items-center justify-between text-center relative md:order-2 md:-translate-y-3 ${getPodiumBadgeColor(0).border}`}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 p-1.5 bg-slate-900 border border-amber-400 rounded-full">
                {getPodiumBadgeColor(0).icon}
              </div>
              <span className="text-amber-400 text-3xs font-extrabold uppercase tracking-widest block mb-4 mt-1">{getPodiumBadgeColor(0).rank}</span>
              <img
                src={podiumUsers[0].profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(podiumUsers[0].name)}`}
                alt={podiumUsers[0].name}
                className="w-20 h-20 rounded-full border-2 border-amber-400 bg-slate-800 mb-3 shadow-lg"
              />
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white truncate max-w-[180px]">{podiumUsers[0].name}</h4>
                <span className="text-xs text-slate-350 block">{podiumUsers[0].department}</span>
              </div>
              <div className="mt-5 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-xs font-bold text-amber-400 glow-purple">
                {podiumUsers[0].points || 0} pts
              </div>
            </div>
          )}

          {/* Third Place (drawn right) */}
          {podiumUsers[2] && (
            <div className={`glass-card p-6 border flex flex-col items-center justify-between text-center relative md:order-3 ${getPodiumBadgeColor(2).border}`}>
              <div className="absolute top-3 right-3">
                {getPodiumBadgeColor(2).icon}
              </div>
              <span className="text-slate-450 text-4xs font-bold uppercase tracking-wider block mb-3">{getPodiumBadgeColor(2).rank}</span>
              <img
                src={podiumUsers[2].profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(podiumUsers[2].name)}`}
                alt={podiumUsers[2].name}
                className="w-16 h-16 rounded-full border border-slate-700 bg-slate-800 mb-3 shadow"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{podiumUsers[2].name}</h4>
                <span className="text-3xs text-slate-400 block">{podiumUsers[2].department}</span>
              </div>
              <div className="mt-4 px-3 py-1 bg-slate-950/80 rounded-full border border-slate-800 text-xs font-bold text-slate-200">
                {podiumUsers[2].points || 0} pts
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ranks 4+ Board Table */}
      {regularUsers.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-3xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-5 text-center w-16">Rank</th>
                  <th className="py-3 px-4">Contributor</th>
                  <th className="py-3 px-4">Department & Branch</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-5 text-right w-24">Points</th>
                </tr>
              </thead>
              <tbody>
                {regularUsers.map((user, idx) => {
                  const rank = idx + 4;
                  const isMe = user._id === currentUser._id;
                  return (
                    <tr
                      key={user._id}
                      className={`border-b border-slate-800/60 transition-colors text-xs ${
                        isMe ? 'bg-brand-500/5 hover:bg-brand-500/10' : 'hover:bg-slate-900/30'
                      }`}
                    >
                      <td className="py-3.5 px-5 text-center font-bold text-slate-400">
                        #{rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-3">
                        <img
                          src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full border border-slate-800 bg-slate-800"
                        />
                        <span className="truncate max-w-[150px]">{user.name}</span>
                        {isMe && (
                          <span className="px-1.5 py-0.5 bg-brand-500/15 text-brand-400 text-4xs font-bold rounded">You</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-350">
                        {user.department} • {user.branch}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.badges && user.badges.length > 0 ? (
                            user.badges.slice(0, 2).map((b, bIdx) => (
                              <span key={bIdx} className="px-1.5 py-0.5 bg-brand-500/5 border border-brand-500/15 text-brand-400 text-4xs rounded font-medium">
                                {b}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-650 text-4xs italic">None</span>
                          )}
                          {user.badges && user.badges.length > 2 && (
                            <span className="text-slate-500 text-4xs font-semibold">+{user.badges.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-slate-200">
                        {user.points || 0} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
