import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function ProfileView({ user, onUpdateProfile, error }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.department);
  const [branch, setBranch] = useState(user.branch);
  const [bio, setBio] = useState(user.bio || '');
  const [skillsString, setSkillsString] = useState(user.skills?.join(', ') || '');
  
  // Custom seed for random avatar generation
  const [avatarSeed, setAvatarSeed] = useState(user.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    const skills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const profileImage = avatarSeed !== user.name
      ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`
      : user.profileImage;

    onUpdateProfile({ name, department, branch, bio, skills, profileImage });
    setIsEditing(false);
  };

  const randomizeAvatar = () => {
    const randomSeeds = ['Ayan', 'Alex', 'Sarah', 'Jessica', 'David', 'Klaus', 'Luna', 'Neo', 'Max', 'Zoe', 'Jordan', 'Sam'];
    const randomSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + Math.floor(Math.random() * 100);
    setAvatarSeed(randomSeed);
  };

  const currentAvatarUrl = avatarSeed !== user.name
    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`
    : user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up text-left">
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Background glowing sphere */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {error && (
          <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center space-x-2">
            <Icons.AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {!isEditing ? (
          // VIEW MODE
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left pb-6 border-b border-slate-800/80">
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-24 h-24 rounded-full border border-slate-700 bg-slate-800 shadow-md"
              />
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start space-x-2">
                      <span>{user.name}</span>
                      <span className="px-2 py-0.5 bg-brand-500/15 border border-brand-500/20 text-brand-400 text-4xs font-bold rounded uppercase">
                        {user.role}
                      </span>
                    </h2>
                    <span className="text-xs text-slate-400 block mt-1">
                      {user.department} • {user.branch}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-350 rounded-lg flex items-center justify-center space-x-1.5 transition-colors self-center sm:self-start"
                  >
                    <Icons.Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="flex items-center space-x-4 pt-1 justify-center sm:justify-start">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                    <Icons.Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-extrabold text-slate-200">{user.points || 0} pts</span>
                  </div>
                  <span className="text-slate-700">•</span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-350">
                    <Icons.Award className="w-4 h-4 text-brand-400" />
                    <span className="font-bold">{user.badges?.length || 0} Badges Earned</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2.5">
              <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Bio / Summary</span>
              <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-slate-850">
                {user.bio || 'Provide a bio description to help colleagues discover your expertise areas!'}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2.5">
              <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Core Skills & Tools</span>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1 bg-slate-950/80 border border-slate-850 text-slate-200 text-xs font-medium rounded-xl"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-650 text-xs italic">No skills listed yet</span>
                )}
              </div>
            </div>

            {/* Earned Badges details */}
            {user.badges && user.badges.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider block">Unlocked Badges</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.badges.map((badge, idx) => {
                    let badgeDesc = 'Earned for contributions to the workspace.';
                    if (badge === 'Initiate Contributor') badgeDesc = 'Earned by reaching 10 contribution points.';
                    if (badge === 'Knowledge Champion') badgeDesc = 'Earned by reaching 50 contribution points.';
                    if (badge === 'Top Mentor') badgeDesc = 'Earned by reaching 120 contribution points.';
                    if (badge === 'Intellectual Guru') badgeDesc = 'Earned by reaching 250 contribution points.';
                    return (
                      <div key={idx} className="p-3 bg-brand-500/5 border border-brand-500/15 rounded-xl flex items-center space-x-3 text-left">
                        <div className="p-1.5 bg-brand-600/10 rounded-lg text-brand-400">
                          <Icons.BadgeAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-white text-xs">{badge}</span>
                          <span className="block text-slate-400 text-4xs mt-0.5">{badgeDesc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <Icons.UserCog className="w-4.5 h-4.5 text-brand-400" />
                <span>Modify Credentials</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <Icons.X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Avatar customization */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
              <img
                src={currentAvatarUrl}
                alt="Avatar custom preview"
                className="w-16 h-16 rounded-full border border-slate-700 bg-slate-800"
              />
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <span className="block text-3xs font-bold text-slate-400 uppercase tracking-wider">Customize Profile Avatar</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Avatar seed string..."
                    value={avatarSeed}
                    onChange={(e) => setAvatarSeed(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={randomizeAvatar}
                    className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                  >
                    Random Seed
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Office Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Kolkata Branch">Kolkata Branch</option>
                  <option value="Delhi Branch">Delhi Branch</option>
                  <option value="Mumbai Branch">Mumbai Branch</option>
                  <option value="Headquarters">Headquarters</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Profile Biography</label>
              <textarea
                rows="4"
                placeholder="Share your specialization areas, what colleagues can learn from you..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Skills (comma separated tags)</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, Laravel, PHP, Project Management"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Icons.Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
