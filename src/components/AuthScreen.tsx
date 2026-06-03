import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, HelpCircle, Code, GraduationCap, Sparkles } from 'lucide-react';
import { 
  authenticateWithGoogle, 
  registerUserWithEmail, 
  loginUserWithEmail, 
  isFirebasePlaceholder 
} from '../firebase';

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

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const response = await authenticateWithGoogle();
      if (response.success && response.user) {
        if (response.mode === 'sandbox') {
          setSuccessMsg('Authenticated via secure Google Sandbox credentials! Welcome explorer.');
        } else {
          setSuccessMsg('Google login successful! Loading live sandbox session...');
        }
        setTimeout(() => {
          onLoginSuccess(response.user);
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate using Google provider.');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
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

    try {
      if (isLogin) {
        // Login flow via real/fallback firebase helper
        const response = await loginUserWithEmail(email, password);
        if (response.success && response.user) {
          if (response.mode === 'sandbox') {
            setSuccessMsg('Authenticated student sandbox successfully! Welcome back.');
          } else {
            setSuccessMsg('Successfully logged into live Academy track!');
          }
          setTimeout(() => {
            onLoginSuccess(response.user);
          }, 800);
        }
      } else {
        // Register flow via real/fallback firebase helper
        if (!displayName.trim()) {
          setError('Please provide a student name.');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        const response = await registerUserWithEmail(email, password, displayName);
        if (response.success && response.user) {
          if (response.mode === 'sandbox') {
            setSuccessMsg('Apprentice sandbox profile registered successfully! Logging you in...');
          } else {
            setSuccessMsg('Academy credentials created and certified!');
          }
          setTimeout(() => {
            onLoginSuccess(response.user);
          }, 1000);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please check inputs.');
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

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-150"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Or connect with</span>
          <div className="flex-grow border-t border-gray-150"></div>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-gray-250 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 text-sm font-bold transition-all cursor-pointer shadow-xs font-sans active:scale-98"
          id="google-signin-btn"
        >
          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 5.04c1.67 0 3.19.57 4.37 1.7l3.26-3.26C17.65 1.58 15 1 12 1 7.24 1 3.22 3.73 1.34 7.7l3.92 3.04C6.18 7.55 8.85 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.74-4.92 3.74-8.58z"
            />
            <path
              fill="#FBBC05"
              d="M5.26 14.74a7.199 7.199 0 010-4.48L1.34 7.22A11.967 11.967 0 001 12c0 1.7.35 3.32.99 4.8l4.27-3.06z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.11.75-2.53 1.19-4.27 1.19-3.15 0-5.82-2.51-6.74-5.7l-4.11 3.19C3.12 20.15 7.14 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {isFirebasePlaceholder ? (
          <div className="mt-4 bg-orange-50/60 border border-orange-100 rounded-lg p-3 text-left">
            <h5 className="text-[11px] font-extrabold text-orange-950 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-orange-600 animate-pulse" />
              <span>Sandbox Fallback Simulator Active</span>
            </h5>
            <p className="text-[10px] text-orange-800 leading-relaxed mt-0.5 font-medium">
              We have prebuilt a local-storage sandbox that simulates the complete accounts registration, progress milestones, and dynamic dashboards instantly. Approve the Firebase console terms in the UI panel to link your live Database!
            </p>
          </div>
        ) : (
          <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 text-left">
            <h5 className="text-[11px] font-extrabold text-emerald-950 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Live Firebase Cloud Sync Connected</span>
            </h5>
            <p className="text-[10px] text-emerald-800 leading-relaxed mt-0.5 font-medium">
              Your credentials will be authenticated and verified securely via the official live Firebase Auth SDK! 
              <br />
              <span className="text-[9px] opacity-80 font-mono">Note: Make sure "Email/Password" and "Google" sign-in methods are enabled in your Firebase console under Authentication &gt; Sign-In Method.</span>
            </p>
          </div>
        )}

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
