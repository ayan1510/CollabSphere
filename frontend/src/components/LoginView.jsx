import React, { useState } from 'react';

export default function LoginView({ onLogin, onRegister, error, isLoading }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [branch, setBranch] = useState('Kolkata Branch');
  const [skillsString, setSkillsString] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      const skills = skillsString
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      onRegister({ name, email, password, department, branch, skills, bio });
    } else {
      onLogin(email, password);
    }
  };

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4 md:p-6 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-8 items-center z-10 animate-fade-in">
        {/* Left column: Brand Intro */}
        <div className="md:col-span-6 space-y-6 text-left hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl glow-purple">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-sans">
              Collab<span className="text-brand-400">Sphere</span>
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold font-sans text-white leading-tight">
            Connect Expertise.<br />
            <span className="gradient-text font-extrabold">Discover Knowledge.</span>
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Unlock your organization's collective intelligence. Find experts across branches, share playbooks, participate in peer Q&As, and earn recognitions.
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-800 max-w-sm">
            <div className="flex items-center space-x-3 text-slate-300 text-sm">
              <span className="flex-shrink-0 w-2.5 h-2.5 bg-emerald-500 rounded-full glow-emerald" />
              <span>Stack Overflow style Q&A engine</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300 text-sm">
              <span className="flex-shrink-0 w-2.5 h-2.5 bg-brand-500 rounded-full glow-purple" />
              <span>Cross-branch searchable Expert Directories</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300 text-sm">
              <span className="flex-shrink-0 w-2.5 h-2.5 bg-indigo-500 rounded-full" />
              <span>Admin Center for metrics & content governance</span>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-6">
          <div className="glass-card p-6 md:p-8 relative">
            <div className="md:hidden flex items-center justify-center space-x-2 mb-6">
              <div className="p-1.5 bg-brand-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">CollabSphere</span>
            </div>

            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-bold font-sans text-white">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isRegister ? 'Fill in your details to register as an employee' : 'Log in to join your company workspace'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ayan Mondal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Customer Support">Customer Support</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Branch</label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                      >
                        <option value="Kolkata Branch">Kolkata Branch</option>
                        <option value="Delhi Branch">Delhi Branch</option>
                        <option value="Mumbai Branch">Mumbai Branch</option>
                        <option value="Headquarters">Headquarters</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, PHP, AI Integration, CSS"
                      value={skillsString}
                      onChange={(e) => setSkillsString(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Short Bio</label>
                    <textarea
                      placeholder="Tell us what you specialize in..."
                      rows="2"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-dark-950 flex justify-center items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isRegister ? 'Register & Enter Portal' : 'Log In'}</span>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-brand-400 hover:text-brand-300 text-xs font-medium focus:outline-none"
              >
                {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
              </button>
            </div>

            {/* QUICK DEMO CREDENTIALS SECTION */}
            {!isRegister && (
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <span className="block text-slate-400 text-2xs font-bold uppercase tracking-wider text-center mb-3">
                  🚀 Quick Demo Accounts
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => fillDemoCredentials('employee@test.com', 'password123')}
                    className="p-2.5 bg-slate-900/80 hover:bg-slate-800/60 border border-slate-800 text-left rounded-lg transition-all text-xs group"
                  >
                    <span className="block font-semibold text-slate-200 group-hover:text-white">🧑‍💼 Employee Account</span>
                    <span className="block text-slate-500 text-3xs mt-0.5">employee@test.com</span>
                  </button>
                  <button
                    onClick={() => fillDemoCredentials('admin@test.com', 'password123')}
                    className="p-2.5 bg-slate-900/80 hover:bg-slate-800/60 border border-slate-800 text-left rounded-lg transition-all text-xs group"
                  >
                    <span className="block font-semibold text-slate-200 group-hover:text-white">🛡️ HR Admin Account</span>
                    <span className="block text-slate-500 text-3xs mt-0.5">admin@test.com</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
