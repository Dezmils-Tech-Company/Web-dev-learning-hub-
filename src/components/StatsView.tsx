import React from 'react';
import { UserProgress, EARNABLE_BADGES } from '../types';
import { 
  Trophy, Flame, Award, Cpu, BookOpen, Star, Sparkles, CheckCircle,
  FileCode, ArrowRight, Bookmark, CircleDot, User, Layers
} from 'lucide-react';

interface StatsViewProps {
  progress: UserProgress;
}

export default function StatsView({ progress }: StatsViewProps) {
  // Mock competitors inside active classroom environment
  const MOCK_LEADERBOARD = [
    { name: "Dev Mentor Ezra", level: 99, xp: 28400, badgeCount: 6, streak: 45, isMentor: true },
    { name: `${progress.selectedLevel ? progress.selectedLevel.charAt(0).toUpperCase() + progress.selectedLevel.slice(1) : ''} Student (You)`, level: progress.level, xp: progress.xp, badgeCount: progress.badges.length, streak: progress.streakDays, isUser: true },
    { name: "Jasmine Code", level: 8, xp: 2450, badgeCount: 4, streak: 12 },
    { name: "Tanya Dev", level: 5, xp: 1420, badgeCount: 2, streak: 8 },
    { name: "Luke Wizard", level: 4, xp: 1150, badgeCount: 3, streak: 4 },
    { name: "Sam Keyboard", level: 2, xp: 550, badgeCount: 1, streak: 3 },
  ].sort((a,b) => b.xp - a.xp);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 w-full overflow-hidden" id="stats-screen">
      {/* LEFT COLUMN: TELEMETRY & UNLOCKED BADGES GRID (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Statistics metrics card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-950 text-base">Student Performance Ledger</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your verifiable learning credentials on Dezmils Academy.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-5">
              <span className="text-xxs font-mono font-bold text-orange-700 uppercase tracking-widest block">Accumulated Skill</span>
              <span className="text-2xl font-black text-orange-950 mt-1 block">{progress.xp} XP</span>
              <p className="text-xxs text-orange-850 mt-1 font-mono">Next level at {progress.level * 300} XP</p>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
              <span className="text-xxs font-mono font-bold text-blue-700 uppercase tracking-widest block">Active Streak</span>
              <span className="text-2xl font-black text-blue-900 mt-1 block flex items-center gap-1">
                <Flame className={`h-6 w-6 shrink-0 ${
                  progress.streakDays <= 1 ? "text-zinc-400 fill-zinc-300" :
                  progress.streakDays <= 4 ? "text-amber-500 fill-amber-400 animate-pulse" :
                  progress.streakDays <= 9 ? "text-orange-600 fill-orange-500 animate-pulse" :
                  progress.streakDays <= 14 ? "text-rose-600 fill-rose-500 animate-pulse" :
                  "text-purple-600 fill-purple-400 animate-bounce"
                }`} />
                <span>{progress.streakDays} Days</span>
              </span>
              <p className="text-xxs text-blue-700/80 mt-1 font-mono">Keep committing code daily!</p>
            </div>

            <div className="bg-slate-50 border border-gray-250 rounded-lg p-5">
              <span className="text-xxs font-mono font-bold text-gray-500 uppercase tracking-widest block">Academic Milestones</span>
              <span className="text-2xl font-black text-gray-900 mt-1 block">{progress.completedChapters.length} / 5 Chapters</span>
              <p className="text-xxs text-gray-500 mt-1 font-mono">No vibe coding validated</p>
            </div>
          </div>
        </div>

        {/* Gamified Achievement Badges showcase */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="border-b border-gray-150 pb-3">
            <h3 className="font-bold text-gray-950 text-base">Verifiable Competency Badges</h3>
            <p className="text-xs text-gray-500 mt-0.5">Badges are unlocked by writing real code blocks with 0% code paste triggers.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EARNABLE_BADGES.map((badge) => {
              const matchesXp = progress.xp >= badge.xpRequired;
              const hasBadge = progress.badges.includes(badge.name) || matchesXp;

              return (
                <div 
                  key={badge.name} 
                  className={`p-4 rounded border flex gap-3.5 transition-all ${
                    hasBadge 
                      ? 'bg-white border-orange-200 ring-2 ring-orange-600/5' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`h-11 w-11 rounded flex items-center justify-center shrink-0 ${
                    hasBadge 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Award className="h-6 w-6" />
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {hasBadge ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-widest">
                          Unlocked
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                          {badge.xpRequired} XP req
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: COMPETITIVE CLASSROOM LEADERBOARD (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Leaderboard layout */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-black text-gray-950 text-sm flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-orange-500 shrink-0" />
            <span>Classroom Leaderboard</span>
          </h3>
          <p className="text-xxs text-gray-500 mt-1">
            Simulated classmate rankings based on coding exercises and correct chapter quiz validations.
          </p>

          <div className="mt-5 space-y-2">
            {MOCK_LEADERBOARD.map((item, idx) => {
              return (
                <div 
                  key={item.name}
                  className={`flex items-center justify-between p-2.5 rounded border text-xs transition-all ${
                    item.isUser 
                      ? 'bg-orange-55 bg-orange-50 border-orange-150 font-bold text-orange-950' 
                      : item.isMentor 
                        ? 'bg-orange-50 border-orange-100'
                        : 'bg-white border-gray-150'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xxs font-bold text-gray-400 w-4 block text-center">
                      #{idx + 1}
                    </span>
                    <span className="truncate">{item.name}</span>
                    {item.isMentor && (
                      <span className="bg-orange-600 text-white rounded text-[8px] font-bold px-1 uppercase shrink-0 font-mono">
                        MENTOR
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xxs font-bold text-gray-600">
                      {item.xp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-white">
          <span className="text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest block">
            Dezmils Credentials
          </span>
          <h4 className="font-black text-sm mt-1">LMS Certification Path</h4>
          <p className="text-xxs text-slate-300 mt-1.5 leading-relaxed">
            By demonstrating correct tactical code commits in each track, you earn your verified portfolio badge credential signed by Dev Master Ezra.
          </p>
          
          <div className="mt-4 pt-3 border-t border-slate-800 text-xxs text-slate-400 flex justify-between">
            <span>Verified Path</span>
            <span className="font-mono font-bold text-blue-400">0% PASTE RECORD</span>
          </div>
        </div>

      </div>
    </div>
  );
}
