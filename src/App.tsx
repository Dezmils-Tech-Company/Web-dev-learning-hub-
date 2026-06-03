/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CHAPTERS, MOCK_FORUM_POSTS, UserProgress, ForumPost, ForumAnswer } from './types';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import CurriculumView from './components/CurriculumView';
import FolderStructures from './components/FolderStructures';
import PeerForum from './components/PeerForum';
import StatsView from './components/StatsView';
import AchievementsGrid from './components/AchievementsGrid';
import PracticeEditor from './components/PracticeEditor';
import FloatingChatBot from './components/FloatingChatBot';

// Local storage key helper
const STORAGE_KEY = "dezmils_academy_progress";

const DEFAULTS_PROGRESS: UserProgress = {
  selectedLevel: null,
  selectedStack: null,
  xp: 0,
  level: 1,
  completedChapters: [],
  answeredQuizChapters: [],
  completedchallenges: [],
  badges: [],
  streakDays: 1,
  lastActiveDate: new Date().toISOString()
};

export default function App() {
  // Load progress from localStorage safely
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not reload saved progress state:", e);
    }
    return DEFAULTS_PROGRESS;
  });

  // Track active sub-view tab
  const [activeTab, setActiveTab] = useState<string>('curriculum');

  // Academic StackOverflow posts State
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const savedPosts = localStorage.getItem("dezmils_academy_posts");
      if (savedPosts) {
        return JSON.parse(savedPosts);
      }
    } catch {}
    return MOCK_FORUM_POSTS;
  });

  // Persist progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Calculate and update consecutive login days on mount & track selection
  useEffect(() => {
    if (progress.selectedLevel && progress.lastActiveDate) {
      const today = new Date();
      const lastActive = new Date(progress.lastActiveDate);

      // Extract raw date components to compare calendar dates safely
      const lastActiveDateOnly = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const diffTime = todayDateOnly.getTime() - lastActiveDateOnly.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Logged in exactly the next calendar day! Increment streak!
        setProgress(prev => ({
          ...prev,
          streakDays: prev.streakDays + 1,
          lastActiveDate: today.toISOString()
        }));
      } else if (diffDays > 1) {
        // Streak was broken! Reset to 1 day for today.
        setProgress(prev => ({
          ...prev,
          streakDays: 1,
          lastActiveDate: today.toISOString()
        }));
      } else if (diffDays === 0) {
        // Logged in on the same day. Just record the latest active timestamp of today.
        setProgress(prev => ({
          ...prev,
          lastActiveDate: today.toISOString()
        }));
      }
    }
  }, [progress.selectedLevel]);

  // Persist forum questions changes
  useEffect(() => {
    localStorage.setItem("dezmils_academy_posts", JSON.stringify(posts));
  }, [posts]);

  // Register track details on Welcome Selection
  const handleOnboardingSelected = (
    lvl: 'beginner' | 'intermediate' | 'advanced', 
    tech: string, 
    userName: string
  ) => {
    setProgress({
      selectedLevel: lvl,
      selectedStack: tech,
      xp: 50, // Register 50 XP immediately- granted for onboarding explorer!
      level: 1,
      completedChapters: [],
      answeredQuizChapters: [],
      completedchallenges: [],
      badges: ["First Explorer"], // Immediately awarded badge
      streakDays: 1,
      lastActiveDate: new Date().toISOString()
    });
    setActiveTab('curriculum');
  };

  // State mutator helper passed down to subpanels
  const handleUpdateProgress = (updated: Partial<UserProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...updated
    }));
  };

  // Reset training configuration
  const handleResetProgress = () => {
    if (window.confirm("Are you positive you wish to reset your academy training track? All current credentials, badges and chapters solved will be lost.")) {
      setProgress(DEFAULTS_PROGRESS);
      setPosts(MOCK_FORUM_POSTS);
      setActiveTab('curriculum');
    }
  };

  // Post new forum questioning
  const handleAddPost = (newPost: ForumPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // Add answers to existing forum post
  const handleAddAnswerToPost = (postId: string, content: string) => {
    setPosts(prev => {
      return prev.map(p => {
        if (p.id === postId) {
          const newAnswer: ForumAnswer = {
            id: `ans-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            author: {
              name: content.includes("Mentor Ezra") ? "Instructor Ezra (Special AI)" : `${progress.selectedLevel ? progress.selectedLevel.charAt(0).toUpperCase() + progress.selectedLevel.slice(1) : ''} Peer`,
              avatarUrl: content.includes("Mentor Ezra") 
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
              reputation: content.includes("Mentor Ezra") ? 25400 : 180,
              level: content.includes("Mentor Ezra") ? "Dezmils Mentor" : "Lvl 1 Classmate"
            },
            content,
            upvotes: 2,
            createdAt: new Date().toISOString(),
            isInstructorVerified: content.includes("Mentor Ezra")
          };
          return {
            ...p,
            answers: [...p.answers, newAnswer]
          };
        }
        return p;
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-150 flex flex-col font-sans" id="dezmils-root">
      
      {/* Onboard welcome check */}
      {!progress.selectedLevel ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <WelcomeScreen onSelected={handleOnboardingSelected} />
        </div>
      ) : (
        /* Logged-In Active Training Platform Visuals */
        <>
          <Header 
            progress={progress} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            resetProgress={handleResetProgress}
            onUpdateProgress={handleUpdateProgress}
          />

          <main className="flex-1 pb-16 bg-white shrink-0">
            {activeTab === 'curriculum' && (
              <CurriculumView
                chapters={PORTFOLIO_CHAPTERS}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {activeTab === 'practice' && (
              <div className="mx-auto max-w-7xl px-4 py-8">
                <PracticeEditor
                  chapters={PORTFOLIO_CHAPTERS}
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                />
              </div>
            )}

            {activeTab === 'structures' && (
              <FolderStructures />
            )}

            {activeTab === 'forum' && (
              <PeerForum
                posts={posts}
                progress={progress}
                onAddPost={handleAddPost}
                onAddAnswerToPost={handleAddAnswerToPost}
                selectedStack={progress.selectedStack}
              />
            )}

            {activeTab === 'stats' && (
              <StatsView progress={progress} />
            )}

            {activeTab === 'achievements' && (
              <div className="mx-auto max-w-7xl px-4 py-8">
                <AchievementsGrid progress={progress} />
              </div>
            )}
          </main>
          
          {/* Floating interactive QA bot */}
          <FloatingChatBot progress={progress} />
        </>
      )}

      {/* Footer Branding line */}
      <footer className="border-t border-gray-200 bg-white py-6" id="academy-footer">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-mono text-gray-500">
            © 2026 Dezmils Academy LMS. Handcrafted with precision. No Vibe Coding Core. Strict Copy-Paste Prevention Engine.
          </p>
        </div>
      </footer>
    </div>
  );
}
