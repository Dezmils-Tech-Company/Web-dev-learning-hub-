import React from 'react';
import { BookOpen, HelpCircle, Trophy, Milestone, Flame, FolderGit, RefreshCw, Award, Code } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetProgress: () => void;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
}

export default function Header({ progress, activeTab, setActiveTab, resetProgress, onUpdateProgress }: HeaderProps) {
  // Compute user tier relative to XP
  const nextLevelXp = progress.level * 300;
  const xpPercentage = Math.min(100, Math.floor((progress.xp / nextLevelXp) * 100));

  // Flame style & label mapper based on streak length
  const getFlameStyles = (streak: number) => {
    if (streak <= 1) {
      return {
        flameClass: "text-zinc-400 fill-zinc-300 drop-shadow-sm animate-pulse",
        textClass: "text-zinc-650 bg-zinc-50 border-zinc-200 hover:bg-zinc-100",
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

  return (
    <header className="border-b border-gray-200 bg-white shadow-xs" id="lms-header">
      <div className="mx-auto flex max-w-7xl flex-col justify-between px-4 py-4 md:py-3 md:flex-row md:items-center gap-4">
        {/* Brand logo & Info */}
        <div className="flex items-start md:items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-orange-650 bg-orange-600 text-white rounded-lg font-mono font-bold text-lg shrink-0 shadow-sm">
            DM
          </div>
          <div>
            <h1 className="font-sans text-lg md:text-xl font-bold tracking-tight text-gray-950 flex items-center gap-1.5">
              Dezmils Academy <span className="text-blue-600">LMS</span>
            </h1>
            <p className="text-xxs md:text-xs font-mono text-gray-500 leading-tight">Autonomous Web Development Practice Platform</p>
          </div>
        </div>

        {/* User Telemetry & Progress meters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto font-sans">
          {/* Level & XP bar */}
          <div className="flex items-center justify-between sm:justify-start gap-3 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100 flex-1 sm:flex-initial">
            <div className="text-xs flex-1 sm:flex-initial">
              <div className="font-bold text-orange-950 text-[11px] md:text-xs">Lvl {progress.level} Student</div>
              <div className="mt-1 h-1.5 w-24 sm:w-20 md:w-24 overflow-hidden rounded bg-orange-100">
                <div 
                  className="h-full bg-orange-600 transition-all duration-300"
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

          {/* Setup reset */}
          <button 
            onClick={resetProgress}
            className="flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-red-650 transition-colors cursor-pointer shrink-0"
            title="Reset tracks & reload"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="text-[11px] md:text-xs">Reset</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex space-x-1 py-1 overflow-x-auto text-sm font-medium">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'curriculum'
                  ? 'border-orange-655 border-orange-600 text-orange-600 bg-white font-extrabold'
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
          </nav>
        </div>
      </div>
    </header>
  );
}
