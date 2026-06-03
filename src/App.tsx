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
import FooterDocumentModal from './components/FooterDocumentModal';
import AuthScreen from './components/AuthScreen';
import MyPortfolioHub from './components/MyPortfolioHub';

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
  // Track currently log in / authenticated user session details
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; displayName: string } | null>(() => {
    try {
      const stored = localStorage.getItem("dezmils_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Load progress from localStorage safely, keyed by user ID
  const [progress, setProgress] = useState<UserProgress>(DEFAULTS_PROGRESS);

  // Sync session state changing
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("dezmils_session", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("dezmils_session");
    }
  }, [currentUser]);

  // Handle active user configuration swaps dynamically
  useEffect(() => {
    if (currentUser) {
      const userStorageKey = `dezmils_progress_${currentUser.id}`;
      try {
        const stored = localStorage.getItem(userStorageKey);
        if (stored) {
          setProgress(JSON.parse(stored));
        } else {
          // Check for legacy unauthenticated progress to migrate
          const legacy = localStorage.getItem(STORAGE_KEY);
          if (legacy) {
            const legacyParsed = JSON.parse(legacy);
            if (legacyParsed.selectedLevel) {
              setProgress(legacyParsed);
              // Store it in user-specific storage too
              localStorage.setItem(userStorageKey, legacy);
            } else {
              setProgress(DEFAULTS_PROGRESS);
            }
          } else {
            setProgress(DEFAULTS_PROGRESS);
          }
        }
      } catch (e) {
        console.warn("Could not reload saved user progress block:", e);
        setProgress(DEFAULTS_PROGRESS);
      }
    } else {
      setProgress(DEFAULTS_PROGRESS);
    }
  }, [currentUser]);

  // Track active sub-view tab
  const [activeTab, setActiveTab] = useState<string>('curriculum');

  // Track active footer document to show in safe modal
  const [activeFooterDoc, setActiveFooterDoc] = useState<string | null>(null);

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

  // Persist progress changes to user specific storage
  useEffect(() => {
    if (currentUser) {
      const userStorageKey = `dezmils_progress_${currentUser.id}`;
      localStorage.setItem(userStorageKey, JSON.stringify(progress));
    }
  }, [progress, currentUser]);

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
      
      {/* Auth Screen Login / Register Gate */}
      {!currentUser ? (
        <div className="flex-grow flex items-center justify-center py-12 bg-slate-900/5 backdrop-blur-xs">
          <AuthScreen onLoginSuccess={(u) => setCurrentUser(u)} />
        </div>
      ) : (
        <>
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
                currentUser={currentUser}
                onLogout={() => {
                  if (window.confirm("Are you sure you would like to log out? Your user session progress is safely synchronized in local study slots.")) {
                    setCurrentUser(null);
                  }
                }}
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

                {activeTab === 'portfolio' && (
                  <MyPortfolioHub 
                    progress={progress}
                    currentUser={currentUser}
                  />
                )}
              </main>
              
              {/* Floating interactive QA bot */}
              <FloatingChatBot progress={progress} />
            </>
          )}
        </>
      )}

      {/* Footer Branding line */}
      <footer className="border-t border-slate-800 bg-slate-900 py-10" id="academy-footer">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-sans text-sm font-bold text-slate-200 tracking-tight block">
              Dezmils Software Academy
            </span>
            <p className="text-xxs font-mono text-slate-500 mt-1">
              © 2026 Dezmils Software Academy. All rights reserved. Handcrafted with precision.
            </p>
            {/* Social Media Row */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-3" id="footer-social-media">
              <a 
                href="https://github.com/dezmils" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-500 transition-all duration-200 flex items-center justify-center"
                title="GitHub Developer Community"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a 
                href="https://discord.gg/dezmils" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-500 transition-all duration-200 flex items-center justify-center"
                title="Discord Community Server"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.19,77.19,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C3,32.48-1.5,56.26.47,79.8A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.45-5c.87-.64,1.71-1.32,2.51-2a75.52,75.52,0,0,0,72.48,0c.8.71,1.64,1.39,2.51,2a68.43,68.43,0,0,1-10.45,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.57-16.56C129.2,50.19,124.32,26.69,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.86,46,53.82,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.1,46,96.06,53,91,65.69,84.69,65.69Z" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/school/dezmils" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-500 transition-all duration-200 flex items-center justify-center"
                title="LinkedIn Page"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a 
                href="https://x.com/dezmils" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-orange-500 transition-all duration-200 flex items-center justify-center"
                title="X (formerly Twitter) Space"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
            <a 
              href="#terms" 
              className="text-xs text-slate-400 hover:text-orange-500 transition-colors font-sans cursor-pointer font-medium"
              onClick={(e) => { e.preventDefault(); setActiveFooterDoc('terms'); }}
            >
              Terms of Service
            </a>
            <a 
              href="#privacy" 
              className="text-xs text-slate-400 hover:text-orange-500 transition-colors font-sans cursor-pointer font-medium"
              onClick={(e) => { e.preventDefault(); setActiveFooterDoc('privacy'); }}
            >
              Privacy Policy
            </a>
            <a 
              href="#contact" 
              className="text-xs text-slate-400 hover:text-orange-500 transition-colors font-sans cursor-pointer font-medium"
              onClick={(e) => { e.preventDefault(); setActiveFooterDoc('contact'); }}
            >
              Contact Us
            </a>
            <a 
              href="#community" 
              className="text-xs text-slate-400 hover:text-orange-500 transition-colors font-sans cursor-pointer font-medium"
              onClick={(e) => { e.preventDefault(); setActiveFooterDoc('community'); }}
            >
              Community Guidelines
            </a>
          </div>
        </div>
      </footer>

      {/* Conditional Rendering of Footer Document Modal */}
      {activeFooterDoc && (
        <FooterDocumentModal 
          documentType={activeFooterDoc} 
          onClose={() => setActiveFooterDoc(null)} 
        />
      )}
    </div>
  );
}
