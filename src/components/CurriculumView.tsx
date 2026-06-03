import React, { useState, useEffect } from 'react';
import { Chapter, CodeFile, UserProgress } from '../types';
import { 
  Play, CheckCircle, AlertTriangle, HelpCircle, 
  ChevronRight, Award, FileText, MousePointer, Info, Cpu, Check, X
} from 'lucide-react';

interface CurriculumViewProps {
  chapters: Chapter[];
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
}

export default function CurriculumView({ chapters, progress, onUpdateProgress }: CurriculumViewProps) {
  // Filter chapters matching active user level
  const levelChapters = chapters.filter(c => c.level === progress.selectedLevel);
  
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = levelChapters[activeChapterIndex] || levelChapters[0] || chapters[0];

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile: CodeFile = activeChapter.files[activeFileIndex] || activeChapter.files[0];

  // Code editor content
  const [editorContent, setEditorContent] = useState('');
  
  // Highlighted hover line for details
  const [hoveredLineNum, setHoveredLineNum] = useState<number | null>(null);

  // Quiz active state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizStatus, setQuizStatus] = useState<'correct' | 'incorrect' | null>(null);

  // Code simulation evaluation result
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    isCorrect: boolean;
    message: string;
    lineBreakdowns?: string[];
    alternatives?: string;
  } | null>(null);

  // Initialize editor content when Chapter or active File changes
  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.initialContent);
      setEvaluationResult(null);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setQuizStatus(null);
    }
  }, [activeChapter.id, activeFileIndex]);

  // Handle prevention of code copy-pasting silently
  const handlePastePrevented = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  // Keyboard shortcut macros to append code instantly
  const getMacrosForStack = (stack: string) => {
    const common = [" {", " }", " (", " )", " => ", " = ", ' ""', " > ", " < "];
    
    switch(stack) {
      case 'HTML/CSS/JS':
        return [
          ...common,
          "<header>", "</header>", 
          "<nav>", "</nav>", 
          '<section id="projects">', '</section>', 
          '<section id="skills">', '<footer>', '</footer>',
          "display: flex;", "justify-content: space-between;", "align-items: center;", "gap: 1rem;",
          'document.querySelectorAll(".filter-btn")', 'addEventListener("click", () => {', 'classList.toggle("hidden")'
        ];
      case 'React':
        return [
          ...common,
          "useState('all')", "useEffect(() => {", "projects.map(p => (", "key={p.id}", "className=\"portfolio-grid\"", "projects.filter(p => p.category === filter)"
        ];
      case 'Next.js':
        return [
          ...common,
          '<Link href="/projects">', "export const metadata = {", "title: 'Digital Portfolio'", "layout.tsx", "page.tsx", "app/projects/page.tsx"
        ];
      case 'Django':
        return [
          ...common,
          "def project_api_list(request):", "projects_data = [", "JsonResponse({\"projects\": projects_data})", "from django.http import JsonResponse"
        ];
      case 'MERN':
        return [
          ...common,
          "const ProjectModel = { find: async () => { } }", "exports.getPortfolioHighlights = async (req, res) => {", "res.status(200).json({ success: true, data })", "catch (error) {"
        ];
      default:
        return common;
    }
  };

  const macros = getMacrosForStack(activeChapter.techStack);

  const handleInsertMacro = (macroText: string) => {
    // Append macro text to cursor location or editor end
    const textEl = document.getElementById('portfolio-textarea') as HTMLTextAreaElement;
    if (textEl) {
      const start = textEl.selectionStart;
      const end = textEl.selectionEnd;
      const updated = editorContent.substring(0, start) + macroText + editorContent.substring(end);
      setEditorContent(updated);
      setTimeout(() => {
        textEl.focus();
        textEl.selectionStart = textEl.selectionEnd = start + macroText.length;
      }, 50);
    } else {
      setEditorContent(prev => prev + macroText);
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === activeChapter.quiz.answerIndex;
    if (isCorrect) {
      setQuizStatus('correct');
      
      // Award XP points for Quiz answers
      if (!progress.answeredQuizChapters.includes(activeChapter.id)) {
        const addedXp = 50;
        let newXp = progress.xp + addedXp;
        let level = progress.level;
        if (newXp >= level * 300) {
          level += 1;
        }
        
        onUpdateProgress({
          xp: newXp,
          level,
          answeredQuizChapters: [...progress.answeredQuizChapters, activeChapter.id]
        });
      }
    } else {
      setQuizStatus('incorrect');
    }
  };

  // Compile and Evaluate code using the fullstack server API proxy to Google Gemini
  const handleEvaluateChallenge = async () => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const response = await fetch('/api/gemini/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapterTitle: activeChapter.title,
          challengeInstruction: activeChapter.challengeInstruction,
          fileName: activeFile.name,
          fileContent: editorContent,
          techStack: activeChapter.techStack
        })
      });

      const outcome = await response.json();
      if (outcome.success) {
        setEvaluationResult({
          isCorrect: outcome.isCorrect,
          message: outcome.message,
          lineBreakdowns: outcome.lineBreakdowns,
          alternatives: outcome.alternatives
        });

        // If Correct, reward beautiful XP and Badge logic!
        if (outcome.isCorrect) {
          let updatedCompleted = [...progress.completedChapters];
          if (!updatedCompleted.includes(activeChapter.id)) {
            updatedCompleted.push(activeChapter.id);
          }

          let addedXp = 100;
          let newXp = progress.xp + addedXp;
          let level = progress.level;
          if (newXp >= level * 300) {
            level += 1;
          }

          // Badge logic allocation
          let updatedBadges = [...progress.badges];
          if (activeChapter.level === 'beginner' && !updatedBadges.includes('Portfolio Sculptor')) {
            updatedBadges.push('Portfolio Sculptor');
          }
          if (activeChapter.techStack === 'React' && !updatedBadges.includes('State Pilot')) {
            updatedBadges.push('State Pilot');
          }
          if (activeChapter.techStack === 'Django' && !updatedBadges.includes('Server Titan')) {
            updatedBadges.push('Server Titan');
          }
          if (activeChapter.techStack === 'MERN' && !updatedBadges.includes('Full Stack Overlord')) {
            updatedBadges.push('Full Stack Overlord');
          }

          onUpdateProgress({
            completedChapters: updatedCompleted,
            xp: newXp,
            level,
            badges: updatedBadges
          });
        }
      } else {
        setEvaluationResult({
          isCorrect: false,
          message: outcome.message || "Failed to finalize evaluation."
        });
      }
    } catch (err: any) {
      setEvaluationResult({
        isCorrect: false,
        message: "Network request is offline or failed. Make sure server API is responsive. Error: " + err.message
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 w-full overflow-hidden" id="curriculum-container">
      {/* LEFT NAVIGATION PATHWAY & GUIDE PANEL (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Track Progression Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex bg-blue-50 border border-blue-200 rounded p-3 mb-4 items-center justify-between text-xs font-mono font-bold text-blue-700">
            <span>TRACK: {progress.selectedLevel?.toUpperCase()} LEVEL</span>
            <span className="bg-blue-600 text-white rounded px-2 py-0.5">{activeChapter.techStack}</span>
          </div>

          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">LMS Learning Pathway:</h2>
          
          <div className="mt-2.5 space-y-1.5">
            {levelChapters.map((chap, idx) => {
              const isCompleted = progress.completedChapters.includes(chap.id);
              const isActive = chap.id === activeChapter.id;

              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setActiveFileIndex(0);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition-colors cursor-pointer text-xs ${
                    isActive 
                      ? 'border-orange-600 bg-orange-50/50 text-orange-955 font-bold'
                      : 'border-gray-150 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 font-mono text-[10px] font-bold text-gray-600">
                      {idx + 1}
                    </span>
                    <span className="truncate">{chap.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-2">
                    {isCompleted ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                        ✓
                      </span>
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Chapter Handbook Guide */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{activeChapter.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{activeChapter.shortDesc}</p>
          </div>

          <div className="border-t border-gray-150 pt-4 text-sm text-gray-700 leading-relaxed max-h-[300px] overflow-y-auto pr-1">
            <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider mb-2">Architectural Theory & Specs:</h4>
            {activeChapter.fullGuide.split('\n\n').map((para, i) => (
              <p key={i} className="mb-3">{para}</p>
            ))}
          </div>

          {/* Interactive File Structure basics */}
          <div className="border-t border-gray-150 pt-4">
            <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider flex items-center gap-1">
              <span>📁 Dynamic Workspace structure:</span>
            </h4>
            <pre className="mt-2 p-3 font-mono text-xs bg-gray-50 rounded border border-gray-200 text-blue-900 overflow-x-auto whitespace-pre">
              {activeChapter.suggestedFileStructure}
            </pre>
            <p className="text-xxs font-mono text-gray-500 mt-1">
              *The code file structure defines where dynamic templates load in professional repos.
            </p>
          </div>
        </div>

        {/* Level Quiz Validation */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 mb-3">
            <span>📝 Chapter Knowledge Check (+50 XP)</span>
          </h3>
          <p className="text-xs text-gray-600 mb-4">{activeChapter.quiz.question}</p>

          <div className="space-y-2">
            {activeChapter.quiz.options.map((opt, keyIdx) => {
              const isSelected = selectedQuizOption === keyIdx;
              const isCorrectAnswer = keyIdx === activeChapter.quiz.answerIndex;
              return (
                <button
                  key={keyIdx}
                  disabled={quizSubmitted && quizStatus === 'correct'}
                  onClick={() => {
                    setSelectedQuizOption(keyIdx);
                    setQuizStatus(null);
                  }}
                  className={`w-full text-left p-3 text-xs rounded border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'border-orange-600 bg-orange-50/50 font-semibold text-orange-950' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-orange-600" />}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className={`mt-4 p-3 rounded text-xs border ${
              quizStatus === 'correct' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="font-bold flex items-center gap-1">
                {quizStatus === 'correct' ? '🌟 Correct!' : '❌ Incorrect alternative.'}
              </div>
              <p className="mt-1">{activeChapter.quiz.explanation}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleQuizSubmit}
              disabled={selectedQuizOption === null}
              className="px-4 py-2 font-sans bg-orange-600 text-white rounded font-semibold text-xs hover:bg-orange-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Verify Knowledge
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT EDITOR & INTEGRATED SANDBOX AREA (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6" id="editor-workspace">
        
        {/* Editor Code Header */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-600" />
              <span className="font-mono text-xs font-bold text-gray-700">{activeFile.name} ({activeChapter.techStack})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase">
                Active Codebox
              </span>
            </div>
          </div>

          {/* Line Explanations Hover Panel */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2 text-xs text-gray-600 font-mono">
            <Info className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="text-[11px]">
              {hoveredLineNum !== null && activeFile.lineExplanations[hoveredLineNum] ? (
                <span className="text-blue-900 font-bold font-sans">
                  Line {hoveredLineNum} Detail: {activeFile.lineExplanations[hoveredLineNum]}
                </span>
              ) : (
                "Hover or key code lines to inspect how they operate step-by-step."
              )}
            </span>
          </div>

          {/* Textarea Codebox */}
          <div className="flex bg-slate-950 text-slate-100 font-mono text-sm relative w-full overflow-hidden rounded-b-lg">
            {/* Fake Gutter line numbers */}
            <div className="py-4 select-none text-right text-slate-600 bg-slate-900 min-w-[3rem] px-2 border-r border-slate-800 text-xs">
              {editorContent.split('\n').map((_, index) => (
                <div 
                  key={index} 
                  className={`h-6 flex items-center justify-end font-semibold ${
                    hoveredLineNum === index + 1 ? 'text-white' : ''
                  }`}
                  onMouseEnter={() => setHoveredLineNum(index + 1)}
                  onMouseLeave={() => setHoveredLineNum(null)}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Editable code Area */}
            <textarea
              id="portfolio-textarea"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              onPaste={handlePastePrevented}
              className="flex-1 min-w-0 p-4 h-[350px] overflow-y-auto outline-none bg-slate-950 font-mono text-xs leading-6 resize-none whitespace-pre select-text tab-size"
              placeholder="// Compose your portfolio practice code here..."
              spellCheck="false"
            />
          </div>

          {/* Interactive Keyboard Macro Buttons (Helper) */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <span className="text-xxs font-mono font-bold text-gray-500 uppercase block mb-1.5">
              💡 Tactile Code Palette (Click blocks to compose without pasting):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {macros.map((macro, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertMacro(macro)}
                  className="font-mono text-[10px] bg-white border border-gray-200 text-gray-700 rounded px-2 py-1 font-semibold hover:border-orange-500 hover:text-orange-600 cursor-pointer transition-colors active:scale-95"
                >
                  {macro}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Instructions & Actions list */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-bold text-sm text-gray-900 uppercase">🎯 Portfolio Challenge Instruction:</h3>
          <p className="mt-2 text-xs text-gray-700 font-sans leading-relaxed">
            {activeChapter.challengeInstruction}
          </p>

          <div className="mt-5 flex gap-3 justify-end">
            <button
              onClick={() => setEditorContent(activeFile.initialContent)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
            >
              Reset Sandbox
            </button>
            <button
              onClick={handleEvaluateChallenge}
              disabled={isEvaluating}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors cursor-pointer shadow-sm"
            >
              {isEvaluating ? (
                <>
                  <div className="border-t-2 border-r-2 border-white animate-spin rounded-full h-3 w-3" />
                  <span>AI Mentor Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Verify & Commit Workspace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Senior Mentor Dynamic Breakdown Results */}
        {evaluationResult && (
          <div className={`rounded-lg border p-5 ${
            evaluationResult.isCorrect 
              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
              : 'bg-red-50/50 border-red-200 text-red-950'
          }`}>
            <div className="flex items-start gap-3">
              {evaluationResult.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <span className="text-xxs font-mono font-bold tracking-wider block uppercase opacity-75">
                  AI Mentor Feedback & Review:
                </span>
                <p className="mt-1.5 text-xs text-gray-800 font-bold leading-relaxed whitespace-pre-line">
                  {evaluationResult.message}
                </p>

                {evaluationResult.lineBreakdowns && evaluationResult.lineBreakdowns.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <span className="text-xxs font-mono font-bold tracking-widest uppercase text-gray-500 block mb-2">
                      Line-by-Line Execution Logic (No vibe coding):
                    </span>
                    <ul className="space-y-1.5 font-sans text-xs text-gray-700">
                      {evaluationResult.lineBreakdowns.map((bk, bIdx) => (
                        <li key={bIdx} className="flex gap-2">
                          <span className="text-blue-600 font-bold font-mono">▸</span>
                          <span>{bk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluationResult.alternatives && (
                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <span className="text-xxs font-mono font-bold tracking-widest uppercase text-gray-500 block mb-1">
                      Professional Alternative Layout Tip:
                    </span>
                    <div className="mt-1 font-mono text-xs bg-white border border-gray-200 rounded p-2.5 text-gray-800 overflow-x-auto whitespace-pre">
                      {evaluationResult.alternatives}
                    </div>
                  </div>
                )}

                {evaluationResult.isCorrect && (
                  <div className="mt-4 bg-emerald-100 border border-emerald-200 rounded p-3 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                    <Award className="h-5 w-5 fill-emerald-800 text-white" />
                    <span>Success! +100 XP added to student telemetry ledger. Proceed to the next chapter!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
