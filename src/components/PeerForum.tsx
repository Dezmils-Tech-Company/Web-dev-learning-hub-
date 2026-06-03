import React, { useState } from 'react';
import { ForumPost, UserProgress } from '../types';
import { 
  PlusCircle, MessageSquare, ThumbsUp, ArrowRight, User, AlertCircle, 
  Settings, CheckCircle, Flame, Filter, Radio
} from 'lucide-react';

interface PeerForumProps {
  posts: ForumPost[];
  progress: UserProgress;
  onAddPost: (newPost: ForumPost) => void;
  onAddAnswerToPost: (postId: string, content: string) => void;
  selectedStack: string | null;
}

export default function PeerForum({ posts, progress, onAddPost, onAddAnswerToPost, selectedStack }: PeerForumProps) {
  // Navigation states
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(posts[0]?.id || null);

  // New question form inputs
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsString, setNewTagsString] = useState('react, state-issue');
  const [postingError, setPostingError] = useState('');
  const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);

  // Target post answer entry
  const [replyContent, setReplyContent] = useState('');
  const [answerError, setAnswerError] = useState('');

  const activePost = posts.find(p => p.id === activePostId) || posts[0];

  // Upvote counter
  const [votedPostIds, setVotedPostIds] = useState<string[]>([]);
  const [votedAnswerIds, setVotedAnswerIds] = useState<string[]>([]);

  const handleUpvotePost = (postId: string) => {
    if (votedPostIds.includes(postId)) return;
    setVotedPostIds(prev => [...prev, postId]);
  };

  const handleUpvoteAnswer = (ansId: string) => {
    if (votedAnswerIds.includes(ansId)) return;
    setVotedAnswerIds(prev => [...prev, ansId]);
  };

  // Create new question of Peer StackOverflow
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingError('');

    if (!newTitle.trim() || !newContent.trim()) {
      setPostingError("Question title and detailed context can never be blank.");
      return;
    }

    const newPostId = "post-" + Date.now();
    const tagsArray = newTagsString.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const initialPost: ForumPost = {
      id: newPostId,
      author: {
        name: `${progress.selectedLevel ? progress.selectedLevel.charAt(0).toUpperCase() + progress.selectedLevel.slice(1) : 'Dezmils'} Student (You)`,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        reputation: progress.xp,
        level: `${progress.level} Dev`
      },
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ["General"],
      upvotes: 1,
      createdAt: new Date().toISOString(),
      answers: []
    };

    onAddPost(initialPost);
    setActivePostId(newPostId);
    setIsCreatingQuestion(false);
    
    // Reset form fields
    setNewTitle('');
    setNewContent('');
    setNewTagsString('react, state');

    // Trigger AI Senior Mentor answer to mimic active class Q&As!
    setIsWaitingAnswer(true);
    try {
      const response = await fetch('/api/gemini/peer-ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: initialPost.title,
          content: initialPost.content,
          activeStack: selectedStack || "HTML/CSS/JS",
          tags: initialPost.tags
        })
      });

      const outcome = await response.json();
      if (outcome.success && outcome.answer) {
        // Feed generated reply into target post
        onAddAnswerToPost(newPostId, outcome.answer.content);
      }
    } catch {
      // Offline fallback generated reply
      onAddAnswerToPost(newPostId, `👋 Hey there! Excellent structural question regarding this portfolio milestone.\n\nMake sure to cross-check file directories inside your workspace tree. Avoid 'vibe-coding' or copy-pasting—use your core tactile keyboard memory! Let us know if this solves things.`);
    } finally {
      setIsWaitingAnswer(false);
    }
  };

  // Post manual custom user reaction answer
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setAnswerError('');

    if (!replyContent.trim()) {
      setAnswerError("Your reply comment cannot be empty!");
      return;
    }

    onAddAnswerToPost(activePost.id, replyContent.trim());
    setReplyContent('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 w-full overflow-hidden" id="peer-forum-screen">
      {/* LEFT COLUMN: ACTIVE QUESTIONS INDEX LAYOUT (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
              <span>💬 Academic QA Network</span>
              <span className="bg-blue-100 text-blue-600 rounded text-xs px-2 py-0.5">StackOverflow</span>
            </h3>
            <button
              onClick={() => setIsCreatingQuestion(true)}
              className="flex items-center gap-1 font-sans text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold rounded px-2.5 py-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Ask Peer</span>
            </button>
          </div>

          <p className="text-xxs text-gray-500 mt-1.5 leading-relaxed">
            Collaborate on portfolio bugs with classmates. Instant AI Teacher guidance will load recursively upon posting questions!
          </p>

          <div className="relative mt-4">
            <input
              type="text"
              readOnly
              value={`Filtering stack: ${selectedStack || "Self Allocation"}`}
              className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-600 outline-none"
            />
          </div>

          <div className="mt-4 space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {posts.map((post) => {
              const isActive = post.id === activePostId;
              const hasVoted = votedPostIds.includes(post.id);
              return (
                <button
                  key={post.id}
                  onClick={() => {
                    setActivePostId(post.id);
                    setIsCreatingQuestion(false);
                  }}
                  className={`w-full p-3 text-left rounded border transition-all block cursor-pointer ${
                    isActive 
                      ? 'border-orange-600 bg-orange-50/50' 
                      : 'border-gray-150 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xxs font-mono font-bold text-orange-650 text-orange-700 tracking-wider">
                    {post.tags.slice(0,2).join(" • ")}
                  </span>
                  <h4 className="font-bold text-xs text-gray-900 mt-0.5 leading-snug line-clamp-2">
                    {post.title}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                    <span className="truncate">Asked by {post.author.name}</span>
                    <div className="flex items-center gap-1.5 text-blue-700 font-bold shrink-0">
                      <MessageSquare className="h-3 w-3" />
                      <span>{post.answers.length} replies</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-xs text-orange-950 font-bold">
          🛡️ ANTI-VIBE NOTE:
          <p className="font-medium text-xxs text-gray-700 mt-1">
            Copying answers blindly bypasses brain formation. Use standard analytical guidelines to translate answers manually!
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE POST CONTEXT / CREATE FORM (8 cols) */}
      <div className="lg:col-span-8">
        
        {/* VIEW A: CREATE QUESTION FORM WIDGET */}
        {isCreatingQuestion ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="border-b border-gray-150 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-gray-950 text-base">Ask Academic Forum</h3>
                <p className="text-xs text-gray-500 mt-0.5">Describe your visual coding issue to the classmate pool.</p>
              </div>
              <button
                onClick={() => setIsCreatingQuestion(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-750 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase" htmlFor="title">
                  Question Title:
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., How to handle absolute centers with Flexbox layout grids?"
                  className="mt-1.5 w-full rounded border border-gray-300 bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-orange-600 focus:outline-none"
                />
                <span className="text-xxs text-gray-400 mt-1 block">Helpful keywords speed response triggers.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase" htmlFor="content">
                  Detailed Context (Describe where you are stuck):
                </label>
                <textarea
                  id="content"
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste your specific issue description, directory parameters, and line anomalies. Remember, tactile learning means describing accurately!"
                  className="mt-1.5 w-full rounded border border-gray-300 bg-white p-3 text-xs text-gray-900 focus:border-orange-600 focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase" htmlFor="tags">
                  Tags (Separated by commas):
                </label>
                <input
                  id="tags"
                  type="text"
                  value={newTagsString}
                  onChange={(e) => setNewTagsString(e.target.value)}
                  placeholder="e.g. css, flexbox, grid, beginner"
                  className="mt-1.5 w-full rounded border border-gray-300 bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-orange-600 focus:outline-none"
                />
              </div>

              {postingError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2 text-semibold">
                  ⚠️ {postingError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingQuestion(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer shadow"
                >
                  Broadcast Question
                </button>
              </div>
            </form>
          </div>
        ) : activePost ? (
          /* VIEW B: ACTIVE SELECTED POST DETAILS */
          <div className="flex flex-col gap-6">
            
            {/* Main Question Body */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                {/* Author Avatar and details */}
                <img
                  src={activePost.author.avatarUrl}
                  alt={activePost.author.name}
                  className="h-10 w-10 rounded bg-gray-100 object-cover shrink-0 border border-gray-200"
                />
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-gray-900">{activePost.author.name}</span>
                    <span className="bg-gray-100 border border-gray-200 rounded text-xxs px-1.5 py-0.5 text-gray-500">
                      Reputation: {activePost.author.reputation} XP
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{new Date(activePost.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-lg font-black text-gray-950 mt-1.5">{activePost.title}</h2>
                  
                  <div className="mt-4 text-xs font-sans text-gray-700 leading-relaxed whitespace-pre-line border-l-2 border-gray-200 pl-4 py-1 bg-slate-50/50 rounded">
                    {activePost.content}
                  </div>

                  {/* Tags mapping */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {activePost.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 border border-blue-150 text-blue-700 text-xxs font-mono px-2 py-0.5 rounded font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions (Upvote post) */}
                  <div className="mt-5 border-t border-gray-150 pt-4 flex justify-between items-center">
                    <button 
                      onClick={() => handleUpvotePost(activePost.id)}
                      disabled={votedPostIds.includes(activePost.id)}
                      className={`flex items-center gap-1.5 font-sans text-xs font-bold rounded px-3 py-1.5 cursor-pointer ${
                        votedPostIds.includes(activePost.id)
                          ? 'bg-orange-50 text-orange-600 border border-orange-255'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-150 border border-transparent'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{votedPostIds.includes(activePost.id) ? activePost.upvotes + 1 : activePost.upvotes} Upvotes</span>
                    </button>
                    
                    <span className="text-[10px] text-gray-400 font-mono">
                      Q-ID: {activePost.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Replies section */}
            <div>
              <h3 className="font-bold text-xs uppercase text-gray-400 tracking-widest pl-1 mb-3">
                Classroom Replies ({activePost.answers.length})
              </h3>

              {isWaitingAnswer && (
                <div className="bg-white rounded-lg border border-orange-150 p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div className="border-t-2 border-r-2 border-orange-600 animate-spin rounded-full h-6 w-6" />
                  <div className="text-xs">
                    <span className="font-bold text-orange-900 block font-sans">Instructor Ezra is typing an answer...</span>
                    <span className="text-gray-500 font-mono text-[10px] mt-0.5 block">Gemini analyzing code anomalies via peer agent API</span>
                  </div>
                </div>
              )}

              {activePost.answers.length === 0 && !isWaitingAnswer ? (
                <div className="bg-white rounded-lg border border-gray-150 p-6 text-center text-xs text-gray-500 leading-relaxed font-sans">
                  No classmate has responded to this thread yet. Type your answer proposal below so both candidates profit!
                </div>
              ) : (
                <div className="space-y-4">
                  {activePost.answers.map((ans) => {
                    const hasAnsvoted = votedAnswerIds.includes(ans.id);
                    return (
                      <div 
                        key={ans.id} 
                        className={`bg-white rounded-lg border p-5 ${
                          ans.isInstructorVerified 
                            ? 'border-emerald-200 relative' 
                            : 'border-gray-200'
                        }`}
                      >
                        {ans.isInstructorVerified && (
                          <span className="absolute top-3 right-4 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase font-mono tracking-wider border border-emerald-250">
                            ★ Principal Verified
                          </span>
                        )}

                        <div className="flex items-start gap-4">
                          <img
                            src={ans.author.avatarUrl}
                            alt={ans.author.name}
                            className={`h-9 w-9 rounded object-cover shrink-0 border ${
                              ans.isInstructorVerified ? 'border-emerald-300' : 'border-gray-250'
                            }`}
                          />
                          
                          <div className="flex-1 font-sans">
                            <div className="flex items-center gap-2 text-xxs text-gray-500">
                              <span className="font-bold text-gray-900">{ans.author.name}</span>
                              <span className="bg-gray-100 rounded px-1.5 py-0.5 text-[9px]">
                                Rep: {ans.author.reputation}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Answer response markdown emulation */}
                            <div className="mt-3 text-xs text-gray-800 font-sans leading-relaxed whitespace-pre-line prose max-w-none">
                              {ans.content}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                              <button
                                onClick={() => handleUpvoteAnswer(ans.id)}
                                disabled={votedAnswerIds.includes(ans.id)}
                                className={`flex items-center gap-1 text-xxs font-bold p-1 cursor-pointer transition-all ${
                                  hasAnsvoted ? 'text-orange-600 scale-105' : 'text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                <span>👍 Upvote Answer ({hasAnsvoted ? ans.upvotes + 1 : ans.upvotes})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Answer composition box */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-bold text-xs text-gray-900 uppercase">Write Your Peer Response Proposal:</h3>
              <p className="text-xxs text-gray-500 mt-1">Remember to clarify technical variables without using Vibe code advice!</p>
              
              <form onSubmit={handleSubmitAnswer} className="mt-3">
                <textarea
                  rows={4}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="e.g. Based on style layouts, remember to align vertical margins blocks using standard parent gaps instead of separate inline properties..."
                  className="w-full rounded border border-gray-300 bg-white p-3 text-xs text-gray-900 focus:border-orange-600 focus:outline-none font-sans leading-relaxed"
                />

                {answerError && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2 border border-red-200">
                    ⚠️ {answerError}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer shadow"
                  >
                    Post Answer
                  </button>
                </div>
              </form>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-150 p-12 text-center text-xs text-gray-500">
            Select an academic topic from the left panel index.
          </div>
        )}

      </div>
    </div>
  );
}
