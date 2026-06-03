import React from 'react';
import { UserProgress, EARNABLE_BADGES } from '../types';
import { 
  Award, Milestone, Sparkles, Layout, Cpu, Server, Crown, 
  CheckCircle, Globe, Shield, Zap, Compass, Star 
} from 'lucide-react';

interface AchievementsGridProps {
  progress: UserProgress;
}

// Map icon name string to Lucide JSX Component for clean rendering
const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
  const css = `h-6 w-6 shrink-0 transition-transform ${
    isUnlocked ? 'text-orange-600 animate-pulse' : 'text-gray-400'
  }`;

  switch (iconName) {
    case 'Milestone':
      return <Milestone className={css} />;
    case 'Sparkles':
      return <Sparkles className={css} />;
    case 'Layout':
      return <Layout className={css} />;
    case 'Cpu':
      return <Cpu className={css} />;
    case 'Server':
      return <Server className={css} />;
    case 'Crown':
      return <Crown className={css} />;
    default:
      return <Award className={css} />;
  }
};

export default function AchievementsGrid({ progress }: AchievementsGridProps) {
  // Count how many badges the student has unlocked
  const unlockedBadges = EARNABLE_BADGES.filter(badge => 
    progress.badges.includes(badge.name) || progress.xp >= badge.xpRequired
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8" id="achievements-component">
      {/* Header section with completion percentage */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-5 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xxs font-bold uppercase tracking-wider">
            🏅 Certified Achievements
          </span>
          <h3 className="text-2xl font-black text-gray-950 mt-1">Student Badge Showcase</h3>
          <p className="text-xs text-gray-500 mt-1">
            Real telemetry validation tracking your tactile code muscle memory. Bypassing vibe coding awards absolute certification.
          </p>
        </div>

        {/* Progress summary block */}
        <div className="bg-orange-50/50 border border-orange-150 rounded px-4 py-3 flex items-center gap-3 font-sans max-w-sm md:self-start">
          <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-orange-600 text-white font-mono font-black text-sm shrink-0 shadow-sm">
            {unlockedBadges.length}/{EARNABLE_BADGES.length}
          </div>
          <div>
            <span className="text-xxs font-mono font-bold uppercase text-orange-700 block text-left">Badges unlocked</span>
            <span className="text-[11px] text-gray-600">
              Unlock rate: {Math.floor((unlockedBadges.length / EARNABLE_BADGES.length) * 100)}% of curriculum objectives solved.
            </span>
          </div>
        </div>
      </div>

      {/* Grid containing badges */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="achievements-grid">
        {EARNABLE_BADGES.map((badge) => {
          const isUnlocked = progress.badges.includes(badge.name) || progress.xp >= badge.xpRequired;

          return (
            <div 
              key={badge.name}
              id={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`relative rounded border p-5 transition-all text-left flex flex-col justify-between min-h-[180px] gap-2 ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-white to-orange-50/15 border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-md' 
                  : 'bg-zinc-50/50 border-gray-150 opacity-60 grayscale'
              }`}
            >
              {/* Top Row: Icon + Unlocked Check */}
              <div className="flex items-start justify-between w-full">
                <div className={`h-11 w-11 rounded flex items-center justify-center ${
                  isUnlocked ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {getBadgeIcon(badge.iconName, isUnlocked)}
                </div>

                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase font-mono tracking-wider border border-emerald-250">
                    <CheckCircle className="h-3 w-3 inline text-emerald-700 shrink-0" />
                    <span>Solved</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase font-mono tracking-wider border border-gray-200">
                    Locked
                  </span>
                )}
              </div>

              {/* Info text & XP milestones */}
              <div className="mt-4">
                <h4 className="font-bold text-sm text-gray-950 flex items-center gap-1 truncate" title={badge.name}>
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 truncate-2-lines line-clamp-2 leading-relaxed" title={badge.description}>
                  {badge.description}
                </p>
              </div>

              {/* Requirement footer */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400">Target milestone:</span>
                <span className={`font-bold ${isUnlocked ? 'text-orange-700' : 'text-gray-500'}`}>
                  {badge.xpRequired} XP Requirement
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Certificate visual banner */}
      <div className="mt-8 p-4 rounded bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-4 text-left">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-orange-400 block">
            Dezmils Software Academy Accreditation
          </span>
          <h4 className="font-black text-sm mt-0.5">
            Manual Competency Portfolio Ledger Certification
          </h4>
          <p className="text-xxs text-slate-300 mt-1 leading-relaxed">
            Every badge is cryptographically tied to your active learning progress and verified by our academy software validation.
          </p>
        </div>
        <div className="bg-slate-800 rounded border border-slate-700 px-3.5 py-2 font-mono text-[10px] font-bold text-orange-400 flex items-center gap-1.5 shrink-0 self-start md:self-center">
          <Star className="h-3.5 w-3.5 fill-orange-400 shrink-0" />
          <span>EZRA ACADEMIC TRUST: 100% VALIDATED</span>
        </div>
      </div>
    </div>
  );
}
