import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, HelpCircle, Code, GraduationCap } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: { id: string; email: string; displayName: string }) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local helper to load users from localStorage
  const getStoredUsers = (): any[] => {
    try {
      const stored = localStorage.getItem("dezmils_users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Local helper to save users to localStorage
  const saveStoredUsers = (users: any[]) => {
    try {
      localStorage.setItem("dezmils_users", JSON.stringify(users));
    } catch (e) {
      console.error("Could not persist local user list", e);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validations
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const users = getStoredUsers();

    if (isLogin) {
      // Login flow
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        setError('No account found with this email. Click register below to create one.');
        return;
      }
      if (foundUser.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      setSuccessMsg('Authenticating success! Welcome back.');
      setTimeout(() => {
        onLoginSuccess({
          id: foundUser.id,
          email: foundUser.email,
          displayName: foundUser.displayName,
        });
      }, 800);
    } else {
      // Register flow
      if (!displayName.trim()) {
        setError('Please provide a student name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('This email is already registered. Please log in instead.');
        return;
      }

      // Create new user profile
      const newUser = {
        id: `usr-${Date.now()}`,
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        password: password,
      };

      users.push(newUser);
      saveStoredUsers(users);

      setSuccessMsg('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess({
          id: newUser.id,
          email: newUser.email,
          displayName: newUser.displayName,
        });
      }, 1000);
    }
  };

  // Handle Quick Portal 1-Click login presets
  const handleQuickLogin = (preset: 'student' | 'new') => {
    const users = getStoredUsers();
    
    if (preset === 'student') {
      // Mock / existing student preset
      const emailPreset = 'learner@dezmils.com';
      const namePreset = 'Alex Carter';
      const passPreset = 'password123';

      let found = users.find(u => u.email === emailPreset);
      if (!found) {
        found = { id: 'usr-alex-preset', email: emailPreset, displayName: namePreset, password: passPreset };
        users.push(found);
        saveStoredUsers(users);
      }

      // Prepopulate an exemplary intermediate progress block inside localStorage so we have cool milestones
      const progressKey = `dezmils_progress_usr-alex-preset`;
      if (!localStorage.getItem(progressKey)) {
        const prepopulatedProgress = {
          selectedLevel: 'intermediate',
          selectedStack: 'React, Next.js & Django',
          xp: 450,
          level: 2,
          completedChapters: ['html-basics', 'css-flexbox'],
          answeredQuizChapters: ['html-basics', 'css-flexbox'],
          completedchallenges: ['html-basics'],
          badges: ['First Explorer', 'Portfolio Sculptor', 'CSS Flex Wizard'],
          streakDays: 4,
          lastActiveDate: new Date().toISOString()
        };
        localStorage.setItem(progressKey, JSON.stringify(prepopulatedProgress));
      }

      setSuccessMsg('Loading preconfigured Student Sandbox environment...');
      setTimeout(() => {
        onLoginSuccess({ id: found.id, email: found.email, displayName: found.displayName });
      }, 600);

    } else {
      // Mock / new apprentice login
      const emailPreset = 'guest@dezmils.com';
      const namePreset = 'Cody Apprentice';
      const passPreset = 'password123';

      let found = users.find(u => u.email === emailPreset);
      if (!found) {
        found = { id: 'usr-guest-preset', email: emailPreset, displayName: namePreset, password: passPreset };
        users.push(found);
        saveStoredUsers(users);
      }

      setSuccessMsg('Starting fresh academy track sandbox...');
      setTimeout(() => {
        onLoginSuccess({ id: found.id, email: found.email, displayName: found.displayName });
      }, 600);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 font-sans" id="auth-screen">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center bg-orange-600 text-white rounded-xl shadow-md mb-3">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
          Dezmils Software Academy
        </h1>
        <p className="text-xs text-gray-500 mt-1.5 font-mono">
          Learning Management & Development Sandbox
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
        {/* Toggle headers */}
        <div className="flex border-b border-gray-100 pb-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 text-center py-2 text-sm font-bold transition-all cursor-pointer ${
              isLogin ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Student Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 text-center py-2 text-sm font-bold transition-all cursor-pointer ${
              !isLogin ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Info alerts */}
        {error && (
          <div className="mb-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded animate-pulse">
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Display Name - Only on Register */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-wider mb-1">
                Full Name / Display Nickname
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g., Alex Carter"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full text-sm font-sans rounded border border-gray-200 pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:border-orange-650 focus:ring-1 focus:ring-orange-650/40 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="student@dezmils.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm font-sans rounded border border-gray-200 pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:border-orange-650 focus:ring-1 focus:ring-orange-650/40 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm font-sans rounded border border-gray-200 pl-10 pr-10 py-2.5 bg-white focus:outline-none focus:border-orange-650 focus:ring-1 focus:ring-orange-650/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password - Only on Register */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm font-sans rounded border border-gray-200 pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:border-orange-650 focus:ring-1 focus:ring-orange-650/40 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded bg-orange-600 px-4 py-3 font-sans text-sm font-semibold text-white hover:bg-orange-700 transition-all cursor-pointer shadow-xs mt-6"
          >
            <span>{isLogin ? 'Log In to Academy' : 'Create Student Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 1-Click Quick Sandbox Accounts divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-150"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Review Presets (Instant Access)</span>
          <div className="flex-grow border-t border-gray-150"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickLogin('student')}
            className="flex flex-col items-center justify-center text-center p-3 rounded-lg border border-orange-100 bg-orange-50/50 hover:bg-orange-55 hover:border-orange-200 transition-all cursor-pointer"
            title="Login as experienced student with progress data"
          >
            <span className="text-[11px] font-bold text-orange-950 font-sans">Alex Carter</span>
            <span className="text-[9px] font-mono text-orange-700 font-semibold mt-0.5">Preloaded Level 2 student</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('new')}
            className="flex flex-col items-center justify-center text-center p-3 rounded-lg border border-gray-250 bg-slate-50 hover:bg-slate-100 hover:border-gray-300 transition-all cursor-pointer"
            title="Start as fresh apprentice account"
          >
            <span className="text-[11px] font-bold text-gray-900 font-sans">Cody Apprentice</span>
            <span className="text-[9px] font-mono text-gray-500 font-semibold mt-0.5">Fresh 0 XP profile</span>
          </button>
        </div>

        <p className="text-center text-xxs text-gray-400 mt-6 leading-relaxed font-mono">
          🛡️ Sandbox Secure Security Authentication
        </p>
      </div>
    </div>
  );
}
