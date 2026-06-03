import React from 'react';
import { BookOpen, HelpCircle, Trophy, Milestone, Flame, FolderGit, RefreshCw, Award, Code, LogOut, Menu, X, Globe } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetProgress: () => void;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  currentUser: { id: string; email: string; displayName: string } | null;
  onLogout: () => void;
}

export default function Header({ progress, activeTab, setActiveTab, resetProgress, onUpdateProgress, currentUser, onLogout }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Compute user tier relative to XP
  const nextLevelXp = progress.level * 300;
  const xpPercentage = Math.min(100, Math.floor((progress.xp / nextLevelXp) * 100));

  // Flame style & label mapper based on streak length
  const getFlameStyles = (streak: number) => {
    if (streak <= 1) {
      return {
        flameClass: "text-zinc-400 fill-zinc-300 drop-shadow-sm animate-pulse",
        textClass: "text-zinc-650 bg-zinc-50 border-zinc-200 hover:bg-zinc-105",
        badge: "Ember ❄️",
        desc: "Active today. Lock-in tomorrow to ignite!"
      };
    } else if (streak >= 2 && streak <= 4) {
      return {
        flameClass: "text-amber-500 fill-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)] animate-pulse",
        textClass: "text-amber-850 bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-900",
        badge: "Rising Spark 🔥",
        desc: "2-4 days. Tactile coding muscles forming!"
      };
    } else if (streak >= 5 && streak <= 9) {
      return {
        flameClass: "text-orange-600 fill-orange-500 drop-shadow-[0_0_6px_rgba(234,88,12,0.6)] animate-pulse hover:scale-110 duration-200",
        textClass: "text-orange-850 bg-orange-50/70 border-orange-200 hover:bg-orange-50 text-orange-950",
        badge: "Blading Fire ⚡",
        desc: "5-9 days. Elite programming momentum!"
      };
    } else if (streak >= 10 && streak <= 14) {
      return {
        flameClass: "text-rose-600 fill-rose-500 drop-shadow-[0_0_8px_rgba(225,29,72,0.7)] animate-pulse hover:scale-110",
        textClass: "text-rose-850 bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-950",
        badge: "Supernova 🌟",
        desc: "10-14 days. Absolutely incredible devotion!"
      };
    } else {
      // 15+ days
      return {
        flameClass: "text-purple-600 fill-purple-400 drop-shadow-[0_0_12px_rgba(147,51,234,0.8)] animate-bounce duration-1000",
        textClass: "text-purple-850 bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-950",
        badge: "Cosmic Singularity 🔮",
        desc: "15+ days. Signed Ezra 0% Paste Champion!"
      };
    }
  };

  const flameStyles = getFlameStyles(progress.streakDays);

  const handleSimulateOneDayForward = () => {
    onUpdateProgress({
      streakDays: progress.streakDays + 1,
      lastActiveDate: new Date().toISOString()
    });
  };

  React.useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <header className="border-b border-gray-200 bg-white shadow-xs animate-fadeIn text-gray-900" id="lms-header">
      <div className="mx-auto flex max-w-7xl flex-col justify-between px-4 py-4 md:py-3 md:flex-row md:items-center gap-4">
        {/* Brand logo & Info / Mobile trigger row */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div>
            <h1 className="font-sans text-lg md:text-xl font-extrabold tracking-tight text-gray-950">
              Dezmils Software Academy
            </h1>
            <p className="text-xxs md:text-xs font-mono text-gray-500 leading-tight">Autonomous Web Development Practice Platform</p>
          </div>

          {/* Mobile Right status & Navigation toggle */}
          <div className="flex items-center gap-2 md:hidden shrink-0">
            {/* Minimal level/streak status pill */}
            <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 text-[10px] font-bold text-orange-950 font-mono">
              <span>Lvl {progress.level}</span>
              <span className="text-orange-300">•</span>
              <span className="flex items-center gap-0.5 text-orange-700">
                <Flame className="h-3 w-3 fill-orange-500 text-orange-600 animate-pulse" /> {progress.streakDays}d
              </span>
            </div>
            
            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:text-orange-650 hover:bg-orange-50/50 active:bg-orange-100 transition-colors cursor-pointer"
              id="mobile-nav-toggle"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* User Telemetry & Progress meters - DESKTOP ONLY */}
        <div className="hidden md:flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto font-sans">
          {/* Level & XP bar */}
          <div className="flex items-center justify-between sm:justify-start gap-3 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100 flex-1 sm:flex-initial">
            <div className="text-xs flex-1 sm:flex-initial">
              <div className="font-bold text-orange-950 text-[11px] md:text-xs">Lvl {progress.level} Student</div>
              <div className="mt-1 h-1.5 w-24 sm:w-20 md:w-24 overflow-hidden rounded bg-orange-100">
                <div 
                  className="h-full bg-orange-600 transition-all duration-305"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200 shrink-0">
              {progress.xp} XP
            </span>
          </div>

          {/* Streak details */}
          <div className={`flex items-center justify-between sm:justify-start gap-3 px-3 py-1.5 rounded-md border text-xs font-bold transition-all relative flex-1 sm:flex-initial ${flameStyles.textClass}`}>
            <div className="flex items-center gap-2">
              <Flame className={`h-4 w-4 shrink-0 col-span-1 ${flameStyles.flameClass}`} />
              <div className="flex flex-col text-left">
                <span className="flex items-center gap-1 text-[11px] md:text-xs">
                  <span>{progress.streakDays} Day Streak</span>
                  <span className="text-[9px] opacity-85 font-normal">({flameStyles.badge})</span>
                </span>
                <span className="text-[9px] font-mono font-normal opacity-75 hidden xl:inline-block max-w-[160px] truncate" title={flameStyles.desc}>
                  {flameStyles.desc}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleSimulateOneDayForward}
              className="ml-2 bg-white hover:bg-gray-150 text-gray-700 hover:text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-gray-250 shadow-xs transition-colors cursor-pointer shrink-0"
              title="Fast Forward 1 Day to test dynamic streak & color changes"
            >
              +1 Day
            </button>
          </div>

          {/* Active User Avatar & Info */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-150 border border-gray-250 px-2.5 py-1 rounded-md shrink-0 bg-slate-50">
              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-orange-600 text-white font-black font-sans text-xs">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase leading-none">Student</span>
                <span className="text-[11px] font-bold text-gray-900 leading-tight max-w-[100px] truncate" title={currentUser.displayName}>
                  {currentUser.displayName}
                </span>
              </div>
            </div>
          )}

          {/* Setup reset */}
          <button 
            onClick={resetProgress}
            className="flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-red-655 transition-colors cursor-pointer shrink-0"
            title="Reset tracks & reload"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="text-[11px] md:text-xs font-semibold">Reset</span>
          </button>

          {/* Secure log out */}
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer shrink-0"
            title="Log out from academic account"
          >
            <LogOut className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="text-[11px] md:text-xs font-semibold">Log Out</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation - DESKTOP ONLY */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex space-x-1 py-1 overflow-x-auto text-sm font-medium">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'curriculum'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>📚 Course Curriculum</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'practice'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Code className="h-4 w-4" />
              <span>💻 Practice Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('structures')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'structures'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FolderGit className="h-4 w-4" />
              <span>📁 Folder Architects</span>
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'forum'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>💬 Peer StackOverflow</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>🏆 Gamified Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Award className="h-4 w-4 text-blue-600" />
              <span>🏅 Achievements</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'border-orange-600 text-orange-600 bg-white font-extrabold'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Globe className="h-4 w-4 text-orange-500 shrink-0" />
              <span>🌐 My Live Portfolio</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn" id="mobile-sidebar-container">
          {/* Backdrop wrapper */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer content sliding from the left */}
          <div className="relative flex flex-col w-full max-w-[280px] h-full bg-white shadow-2xl border-r border-gray-150 transform transition-transform duration-300 ease-out py-6 animate-slideInLeft" id="mobile-sidebar-drawer">
            {/* Close button top right */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 p-1.5 transition-all cursor-pointer focus:outline-none"
              title="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Sidebar Branding Header */}
            <div className="px-5 pb-5 border-b border-gray-100">
              <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">Student Dashboard</span>
              <h2 className="text-gray-950 text-base font-extrabold tracking-tight font-sans mt-0.5">
                Dezmils Academy
              </h2>
            </div>

            {/* Sidebar Scrollable area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 font-sans">
              
              {/* Active User profile card */}
              {currentUser && (
                <div className="bg-slate-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white font-black font-sans text-xs shadow-xs">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase leading-none">Registered Student</span>
                      <span className="text-xs font-extrabold text-gray-950 leading-tight truncate mt-0.5" title={currentUser.displayName}>
                        {currentUser.displayName}
                      </span>
                    </div>
                  </div>

                  {/* Level & XP Gauge */}
                  <div className="pt-2 border-t border-gray-150/60 mt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 font-mono">
                      <span>Level {progress.level}</span>
                      <span className="text-orange-700">{progress.xp} XP</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded bg-gray-200">
                      <div 
                        className="h-full bg-orange-600 transition-all duration-300 rounded"
                        style={{ width: `${xpPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Streak info card */}
              <div className={`p-3.5 rounded-xl border text-xs font-bold transition-all relative space-y-2 ${flameStyles.textClass}`}>
                <div className="flex items-center gap-2">
                  <Flame className={`h-4.5 w-4.5 shrink-0 ${flameStyles.flameClass}`} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-extrabold text-gray-900 leading-tight">
                      {progress.streakDays} Day Streak
                    </span>
                    <span className="text-[9px] font-mono font-semibold text-orange-750 opacity-85 mt-0.5">
                      Badge: {flameStyles.badge}
                    </span>
                  </div>
                </div>
                
                <p className="text-[10px] font-normal leading-normal text-slate-705 text-slate-700">
                  {flameStyles.desc}
                </p>

                <button
                  onClick={handleSimulateOneDayForward}
                  className="w-full bg-white hover:bg-orange-100 text-gray-800 hover:text-orange-700 py-1.5 px-3 rounded-lg text-xxs font-mono font-bold border border-gray-250 transition-colors cursor-pointer text-center block shadow-xs"
                  title="Simulate adding +1 session day"
                >
                  🔥 Fast-Forward Streak (+1 Day)
                </button>
              </div>

              {/* Navigation Menu Links */}
              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">Academic Roadmap</span>
                
                <button
                  type="button"
                  onClick={() => { setActiveTab('curriculum'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'curriculum'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>Course Curriculum</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('practice'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'practice'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <Code className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>Practice Editor</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('structures'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'structures'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <FolderGit className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>Folder Architects</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('forum'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'forum'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <HelpCircle className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>Peer StackOverflow</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'stats'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <Trophy className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>Gamified Leaderboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('achievements'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'achievements'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <Award className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>Achievements</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('portfolio'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'portfolio'
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600 font-extrabold'
                      : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  <Globe className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>🌐 My Live Portfolio</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions inside Sidebar */}
            <div className="mt-auto px-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5 font-sans">
              <button 
                type="button"
                onClick={() => { resetProgress(); setIsSidebarOpen(false); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                title="Reset tracks & reload"
              >
                <RefreshCw className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <span>Reset System Tracks</span>
              </button>

              <button 
                type="button"
                onClick={() => { setIsSidebarOpen(false); onLogout(); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                title="Log out securely"
              >
                <LogOut className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>Sign Out Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
