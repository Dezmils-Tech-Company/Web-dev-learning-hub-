import React, { useState, useEffect, useRef } from 'react';
import { Chapter, CodeFile, UserProgress } from '../types';
import { 
  Code, Play, Eye, Terminal, CheckCircle, AlertTriangle, 
  RefreshCw, ClipboardCopy, Info, Sparkles, ChevronRight,
  Database, Globe, Flame, Lock, ArrowRight, Zap, RefreshCw as LoopIcon
} from 'lucide-react';

interface PracticeEditorProps {
  chapters: Chapter[];
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
}

export default function PracticeEditor({ chapters, progress, onUpdateProgress }: PracticeEditorProps) {
  // Filter chapters matching active user level
  const levelChapters = chapters.filter(c => c.level === progress.selectedLevel);
  const defaultChapter = levelChapters[0] || chapters[0];

  const [activeChapter, setActiveChapter] = useState<Chapter>(defaultChapter);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile = activeChapter.files[activeFileIndex] || activeChapter.files[0];

  // Store edited code mapped to chapter + file keys in state
  const [codeStores, setCodeStores] = useState<Record<string, string>>({});
  
  // Paste warning alerts
  const [pasteWarning, setPasteWarning] = useState<string | null>(null);
  
  // Real-time compilation status and messages
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'visual' | 'console' | 'instructions'>('visual');
  const [practiceSuccess, setPracticeSuccess] = useState(false);

  // Synchronize state when the component mounts or active level changes
  useEffect(() => {
    const freshLevelChapters = chapters.filter(c => c.level === progress.selectedLevel);
    // Prefer selecting the first incomplete chapter
    const incomplete = freshLevelChapters.find(c => !progress.completedChapters.includes(c.id));
    const initialChapter = incomplete || freshLevelChapters[0] || chapters[0];
    setActiveChapter(initialChapter);
    setActiveFileIndex(0);
  }, [progress.selectedLevel, chapters]);

  // Current active code
  const storeKey = `${activeChapter.id}-${activeFile.name}`;
  const currentCode = codeStores[storeKey] !== undefined ? codeStores[storeKey] : activeFile.initialContent;

  const setCodeForCurrentFile = (val: string) => {
    setCodeStores(prev => ({
      ...prev,
      [storeKey]: val
    }));
    setPracticeSuccess(false);
  };

  // Reset current file back to template defaults
  const handleResetToTemplate = () => {
    setCodeForCurrentFile(activeFile.initialContent);
    addLog(`🔄 Reset ${activeFile.name} to template defaults.`);
  };

  // Log logger
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 19)]);
  };

  // Handle prevention of code copy-pasting
  const handlePastePrevented = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setPasteWarning("🚫 Copy-Paste Shield Triggered! Dezmils Academy strictly forbids pasting code to accelerate authentic muscle memory development. Please key in your solution.");
    addLog("⚠️ Warning: Blocked an external clipboard insertion attempt.");
    setTimeout(() => setPasteWarning(null), 8000);
  };

  // Run dynamic compilation simulation
  const handleRunSimulation = () => {
    addLog(`⚡ Initializing compiler validation for ${activeFile.name}...`);
    
    // Perform simple rule checks to see if they completed the challenge instruction
    const trimmed = currentCode.trim();
    const snippetToCheck = activeFile.expectedContentSnippet;
    
    const errors: string[] = [];
    if (trimmed === activeFile.initialContent.trim()) {
      errors.push("❌ Solution code is identical to starting template. Please type custom code.");
    }

    // Stack-specific parsing
    if (activeChapter.techStack === 'HTML/CSS/JS') {
      if (activeFile.name === 'index.html') {
        if (!currentCode.includes('<header>') && !currentCode.includes('<header')) {
          errors.push("❌ Missing semantic <header> block.");
        }
        if (!currentCode.includes('id="projects"') && !currentCode.includes("id='projects'")) {
          errors.push("❌ Missing section container with id='projects'.");
        }
        if (!currentCode.includes('<footer>') && !currentCode.includes('<footer')) {
          errors.push("❌ Missing <footer> tag.");
        }
      } else if (activeFile.name === 'style.css') {
        if (!currentCode.includes('flex')) {
          errors.push("❌ Expected Flexbox display rule (display: flex).");
        }
        if (!currentCode.includes('justify-content')) {
          errors.push("❌ Expecting space arrangement via justify-content.");
        }
      } else if (activeFile.name === 'app.js') {
        if (!currentCode.includes('addEventListener')) {
          errors.push("❌ Missing event binding wrapper 'addEventListener'.");
        }
      }
    } else if (activeChapter.techStack === 'React') {
      if (!currentCode.includes('useState')) {
        errors.push("❌ Missing reactive hook 'useState' invocation.");
      }
      if (!currentCode.includes('projects') && !currentCode.includes('filter')) {
        errors.push("❌ Missing project prop parsing or dynamic filter layout mapping.");
      }
    } else if (activeChapter.techStack === 'Next.js') {
      if (!currentCode.includes('<Link') && !currentCode.includes('Link')) {
        errors.push("❌ Link parameters are missing or not declared.");
      }
    } else if (activeChapter.techStack === 'Django') {
      if (!currentCode.includes('JsonResponse')) {
        errors.push("❌ Expecting server API View response to utilize JsonResponse.");
      }
    } else if (activeChapter.techStack === 'MERN') {
      if (!currentCode.includes('res.status')) {
        errors.push("❌ REST router implementation should specify Express status response (res.status).");
      }
    }

    // Add outputs
    if (errors.length > 0) {
      errors.forEach(err => addLog(err));
      addLog("🛑 Compilation failed with syntax or structural exceptions.");
      setPracticeSuccess(false);
    } else {
      addLog("✅ Code compiled successfully! No static telemetry exceptions detected.");
      addLog("🌟 Validation Passed! Tactile coordination is within professional standards.");
      setPracticeSuccess(true);

      // Award dynamic bonus XP for practicing (if not already completed)
      const isFirstPractice = !progress.completedchallenges.includes(activeChapter.id);
      if (isFirstPractice) {
        const bonusXp = 40;
        let finalXp = progress.xp + bonusXp;
        let finalLvl = progress.level;
        if (finalXp >= finalLvl * 300) {
          finalLvl += 1;
        }
        onUpdateProgress({
          xp: finalXp,
          level: finalLvl,
          completedchallenges: [...progress.completedchallenges, activeChapter.id]
        });
        addLog(`🎉 Awarded +40 Practice XP on the Student Telemetry Ledger!`);
      }
    }
  };

  // Run initial log
  useEffect(() => {
    setConsoleLogs([]);
    addLog(`📁 Sandbox session loaded: chapter "${activeChapter.title}"`);
    addLog(`🔧 Interactive environment active. Tech compiler status: online`);
  }, [activeChapter.id, activeFile.name]);

  // Quick keyboard shortcuts palettes specifically tailored
  const getMacros = () => {
    const core = [" {", " }", " (", " )", " => ", " = ", ' ""', " > ", " < "];
    if (activeChapter.techStack === 'HTML/CSS/JS') {
      return [...core, "<header>", "</header>", "<nav>", "</nav>", '<section id="projects">', '</section>', "<footer>", "</footer>", "display: flex;", "justify-content: space-between;"];
    } else if (activeChapter.techStack === 'React') {
      return [...core, "useState", "useEffect", "projects.filter", "projects.map", "className=", "filter === 'all'"];
    } else {
      return [...core, "JsonResponse", "res.status(200)", "async/await", "try/catch", "def projects_api", "Link href="];
    }
  };

  const handleInsertShortcut = (snippet: string) => {
    const textEl = document.getElementById('practice-textarea') as HTMLTextAreaElement;
    if (textEl) {
      const start = textEl.selectionStart;
      const end = textEl.selectionEnd;
      const updated = currentCode.substring(0, start) + snippet + currentCode.substring(end);
      setCodeForCurrentFile(updated);
      setTimeout(() => {
        textEl.focus();
        textEl.selectionStart = textEl.selectionEnd = start + snippet.length;
      }, 50);
    } else {
      setCodeForCurrentFile(currentCode + snippet);
    }
    addLog(`⌨️ Appended macro token: "${snippet}"`);
  };

  // Assemble source document contents for the real-time visual iframe preview
  const generatePreviewHtml = () => {
    if (activeChapter.techStack !== 'HTML/CSS/JS') {
      return '';
    }

    // Gather states of all 3 files (index.html, style.css, app.js) for premium sandbox compilation
    const getCodeOfFile = (fileName: string, fallback: string) => {
      const key = `${activeChapter.id}-${fileName}`;
      return codeStores[key] !== undefined ? codeStores[key] : fallback;
    };

    const chapterHtmlFile = activeChapter.files.find(f => f.name === 'index.html');
    const chapterCssFile = activeChapter.files.find(f => f.name === 'style.css');
    const chapterJsFile = activeChapter.files.find(f => f.name === 'app.js');

    const htmlCode = getCodeOfFile('index.html', chapterHtmlFile?.initialContent || '<h3> alex portfolio </h3>');
    const cssCode = getCodeOfFile('style.css', chapterCssFile?.initialContent || 'body { font-family: sans-serif; }');
    const jsCode = getCodeOfFile('app.js', chapterJsFile?.initialContent || '// Script code');

    // Return comprehensive iframe code with standard elegant layout wrapping
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          /* Global stylish canvas layout wrapper */
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 16px;
            background-color: #fafbfe;
            color: #1e293b;
            transition: all 0.2s ease;
          }
          header {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          nav {
            display: flex;
            gap: 12px;
            margin-top: 8px;
          }
          nav a, .filter-btn {
            text-decoration: none;
            color: #3b82f6;
            font-weight: 600;
            font-size: 13px;
            padding: 4px 8px;
            border-radius: 4px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            cursor: pointer;
          }
          .portfolio-grid, #projects {
            display: grid;
            grid-template-cols: 1fr;
            gap: 12px;
            margin-top: 16px;
          }
          .project-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          }
          .hidden {
            display: none !important;
          }
          footer {
            margin-top: 32px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
          }
          
          /* User specific CSS injections */
          ${cssCode}
        </style>
      </head>
      <body>
        <div id="live-root">
          ${htmlCode}
        </div>

        <script>
          // Clean standard console capture inside frame
          window.addEventListener('error', function(e) {
            parent.postMessage({ type: 'PREVIEW_ERROR', message: e.message }, '*');
          });

          try {
            ${jsCode}
          } catch(err) {
            parent.postMessage({ type: 'PREVIEW_ERROR', message: err.message }, '*');
          }
        </script>
      </body>
      </html>
    `;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 font-sans w-full overflow-hidden" id="practice-editor-container">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-orange-100 text-orange-950 px-2.5 py-0.5 text-xxs font-mono font-bold uppercase tracking-wider">
            💻 Real-time Code Sandbox
          </span>
          <h2 className="text-2xl font-black text-gray-950 mt-1">LMS Dynamic Practice Editor</h2>
          <p className="text-xs text-gray-500 mt-1">
            Hone your muscle memory in real-time. Code here with our strict copy-paste anti-vibe guard to complete design objectives.
          </p>
        </div>

        {/* Level Chapter Dropdown Selector */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg p-2 md:self-center">
          <span className="text-xxs font-mono font-bold text-slate-600 block shrink-0">CHAPTER:</span>
          <select 
            value={activeChapter.id}
            onChange={(e) => {
              const selected = chapters.find(c => c.id === e.target.value);
              if (selected) {
                setActiveChapter(selected);
                setActiveFileIndex(0);
              }
            }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-gray-800 outline-none cursor-pointer focus:border-blue-500"
          >
            {levelChapters.map((chap, idx) => (
              <option key={chap.id} value={chap.id}>
                {idx + 1}. {chap.title} ({chap.techStack})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Splitted Grid Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* LEFT COLUMN: ACTIVE WORKSPACE & CODEBOX (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* File selector header tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto">
                {activeChapter.files.map((file, fIdx) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFileIndex(fIdx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer text-xs font-mono transition-all font-bold ${
                      activeFileIndex === fIdx 
                        ? 'bg-orange-600 text-white shadow-xs' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Code className="h-3 w-3" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded tracking-wide border border-red-200">
                  <Lock className="h-2.5 w-2.5 shrink-0" />
                  <span>No Paste Safeguard</span>
                </span>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="bg-orange-50/50 border-b border-gray-200 px-4 py-3 text-xs leading-relaxed text-gray-700">
              <span className="font-bold text-orange-950 text-[11px] block uppercase font-mono tracking-wider mb-1">
                🎯 Target Objective:
              </span>
              <span>{activeChapter.challengeInstruction}</span>
            </div>

            {/* Warn message */}
            {pasteWarning && (
              <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700 font-bold font-mono animate-pulse">
                {pasteWarning}
              </div>
            )}

            {/* The Textarea editor */}
            <div className="flex bg-slate-950 text-slate-100 font-mono text-sm relative w-full overflow-hidden">
              {/* Line numbers gutter */}
              <div className="py-4 select-none text-right text-slate-600 bg-slate-900 min-w-[3rem] px-2 border-r border-slate-800 text-xs text-[11px]">
                {currentCode.split('\n').map((_, index) => (
                  <div key={index} className="h-6 flex items-center justify-end font-semibold">
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Editable Text area */}
              <textarea
                id="practice-textarea"
                value={currentCode}
                onChange={(e) => setCodeForCurrentFile(e.target.value)}
                onPaste={handlePastePrevented}
                className="flex-1 min-w-0 p-4 h-[350px] overflow-y-auto outline-none bg-slate-950 font-mono text-xs leading-6 resize-none whitespace-pre select-text tab-size"
                placeholder="// Start writing your target practice code line-by-line here..."
                spellCheck="false"
              />
            </div>

            {/* Keyboard shortcuts macro buttons */}
            <div className="p-3 bg-slate-50 border-t border-gray-200">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1.5">
                ⌨️ Tactile Synthesizer Palette (append code snippets safely without typing):
              </span>
              <div className="flex flex-wrap gap-1">
                {getMacros().map((macro, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertShortcut(macro)}
                    className="font-mono text-[9px] bg-white border border-gray-200 text-gray-700 rounded px-1.5 py-1 font-semibold hover:border-orange-500 hover:text-orange-600 cursor-pointer transition-colors active:scale-95"
                  >
                    {macro}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-gray-100 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <button
                onClick={handleResetToTemplate}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset Starter</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleRunSimulation}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Play className="h-3 w-3 fill-white" />
                  <span>Verify Compilation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Practice Achievements Progress Banner if complete */}
          {practiceSuccess && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-250 text-emerald-950 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Chapter Challenge Practiced!</h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Your code successfully validates the objective criteria! {progress.completedchallenges.includes(activeChapter.id) ? "No pending rewards left." : "+40 Performance XP points added to your portfolio ledger!"}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: PREVIEW PANE & SIMULATED RUNTIME (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs flex flex-col h-full min-h-[500px]">
            {/* Tab navigation headers */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPreviewTab('visual')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    previewTab === 'visual' ? 'bg-white text-orange-700 border border-gray-200 font-extrabold' : 'text-gray-500 hover:bg-gray-150'
                  }`}
                >
                  🖥️ Visual Render
                </button>
                <button
                  onClick={() => setPreviewTab('console')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all relative ${
                    previewTab === 'console' ? 'bg-white text-orange-700 border border-gray-200 font-extrabold' : 'text-gray-500 hover:bg-gray-150'
                  }`}
                >
                  🔍 Compiler Logs
                  {consoleLogs.length > 0 && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />}
                </button>
                <button
                  onClick={() => setPreviewTab('instructions')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    previewTab === 'instructions' ? 'bg-white text-orange-700 border border-gray-200' : 'text-gray-500 hover:bg-gray-150'
                  }`}
                >
                  📜 Guide Panel
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER WINDOW */}
            <div className="flex-1 bg-white p-4 overflow-y-auto flex flex-col justify-between">
              
              {/* TAB 1: VISUAL RENDER */}
              {previewTab === 'visual' && (
                <div className="flex-1 flex flex-col h-full">
                  {activeChapter.techStack === 'HTML/CSS/JS' ? (
                    <div className="flex flex-col h-full flex-1 min-h-[380px]">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-t-lg border border-slate-200 text-xxs font-mono text-slate-500">
                        <Globe className="h-3 w-3 text-emerald-500" />
                        <span>Mock Sandbox Browser Address: http://localhost:3000/{activeChapter.id}/preview</span>
                      </div>
                      <iframe
                        srcDoc={generatePreviewHtml()}
                        title="Tactile Code Practice visual compiler"
                        className="flex-1 w-full min-h-[340px] bg-white border-x border-b border-slate-200 rounded-b-lg"
                        sandbox="allow-scripts"
                      />
                    </div>
                  ) : (
                    /* SIMULATED FULLSTACK APPLICATION TESTBED OR VIEW RENDER */
                    <div className="flex-1 flex flex-col gap-4 text-left p-2">
                      <div className="bg-slate-900 text-white rounded-lg p-4 font-mono text-xs shadow-md border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                          <span className="text-orange-400 font-bold">💻 Simulated Framework Sandbox Engine</span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-blue-300 font-bold uppercase">{activeChapter.techStack} API Node</span>
                        </div>
                        
                        {activeChapter.techStack === 'React' || activeChapter.techStack === 'Next.js' ? (
                          /* REACT LAYOUT PREVIEW PANEL REPLICA */
                          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-sans">
                            <span className="text-xxs font-mono text-slate-500 block mb-2 uppercase">⚛️ Virtual DOM Mount Node:</span>
                            <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-3">
                              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                                <h5 className="font-sans font-bold text-slate-100 text-xs">Alex Portfolio Web-Deck</h5>
                                <span className="bg-emerald-500 text-slate-950 px-1 rounded text-[8px] font-bold">REACTIVE</span>
                              </div>
                              <div className="space-y-1 text-slate-300 text-xs font-mono">
                                <div className="text-[11px] text-sky-400 font-bold">Active Filter State: "all"</div>
                                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-850 space-y-1.5">
                                  <div className="text-xxs font-bold text-slate-500">Rendered Array Nodes:</div>
                                  <div className="text-emerald-400 text-xxs">✔ Alex App Landing Portfolio index (React)</div>
                                  <div className="text-emerald-400 text-xxs">✔ Automated Admin task list api (Django)</div>
                                </div>
                              </div>
                              <div className="flex gap-1.5 pt-1">
                                <button className="bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/50 text-orange-200 px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition-colors active:scale-95">All</button>
                                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] font-mono">React</button>
                                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] font-mono">Django</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* DJANGO OR MERN BACKEND ENDPOINT PLAYGROUND */
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-600 text-black font-extrabold px-1.5 py-0.5 rounded text-[10px]">GET</span>
                              <span className="text-slate-300 text-xs font-mono select-all">/api/portfolio/projects/highlights</span>
                            </div>

                            <div className="bg-slate-950 p-3 rounded border border-slate-850">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-slate-500 font-mono">HEADERS: 200 OK</span>
                                <span className="text-[10px] text-teal-400 font-mono">LATENCY: 42ms</span>
                              </div>
                              <pre className="text-xxs text-amber-300 overflow-x-auto whitespace-pre">
{`{
  "status": "success",
  "data": [
    { "id": 1, "title": "Advanced Portfolio Engine", "tech": "React/Next" },
    { "id": 2, "title": "Automated Task Manager API", "tech": "Django/SQLite" }
  ],
  "telemetry": {
    "acc_reputation": "Instructor Ezra Academic Ledger",
    "strict_anti_vibe_mode": true
  }
}`}
                              </pre>
                            </div>
                            <div className="flex justify-end pt-1">
                              <button 
                                onClick={() => addLog(`🔥 Sent diagnostic GET request to simulated Python-Django API router.`)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-[11px] font-bold border border-slate-750 transition-colors"
                              >
                                Send REST Query
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Design and telemetry specs info box */}
                      <div className="bg-gray-50 border border-gray-150 rounded-lg p-3.5 mt-4 text-xs">
                        <span className="font-bold text-gray-800 block text-xs flex items-center gap-1">
                          <Database className="h-4 w-4 text-blue-500 shrink-0" />
                          Backend Architectural Trace
                        </span>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          Your active practice chapter utilizes the <strong>{activeChapter.techStack}</strong> technology architecture framework standard. Code edits made on the left are live checked by our integrated local validation script when you run "Verify Compilation".
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: COMPILER LOGS */}
              {previewTab === 'console' && (
                <div className="flex-1 flex flex-col h-full bg-slate-950 text-zinc-300 rounded-lg p-4 font-mono text-xs min-h-[380px] justify-between border border-slate-800">
                  <div className="flex flex-col h-[320px] overflow-y-auto pr-1">
                    <div className="text-zinc-500 text-xxs font-bold mb-2 pb-1 border-b border-slate-900">
                      SYS DI DIAGNOSTICS LOG CONSOLE (MAX 20 LINES)
                    </div>
                    {consoleLogs.length === 0 ? (
                      <span className="text-zinc-650 italic">Console buffer is empty. Run compilation to see trace telemetry reports...</span>
                    ) : (
                      <div className="space-y-1.5 flex flex-col text-left">
                        {consoleLogs.map((log, lIdx) => {
                          const isError = log.includes('❌') || log.includes('🛑') || log.includes('⚠️');
                          const isSucc = log.includes('✅') || log.includes('🎉') || log.includes('🌟');
                          return (
                            <div 
                              key={lIdx} 
                              className={`text-[11px] leading-tight pb-0.5 border-b border-dashed border-slate-900/50 ${
                                isError ? 'text-rose-400' : isSucc ? 'text-emerald-400' : 'text-zinc-350'
                              }`}
                            >
                              {log}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-900 pt-3 flex justify-between items-center bg-slate-950">
                    <span className="text-[10px] text-zinc-500">Status: Listening to process.stderr</span>
                    <button
                      onClick={() => setConsoleLogs([])}
                      className="bg-slate-900 hover:bg-slate-850 text-zinc-400 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold"
                    >
                      Clear Terminal
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: EXTENDED HANDBOOK GUIDE PANEL */}
              {previewTab === 'instructions' && (
                <div className="flex-1 flex flex-col text-left gap-4 p-2">
                  <div className="bg-blue-50/50 border border-blue-150 rounded-lg p-4">
                    <h4 className="font-bold text-xs uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Curriculum Chapter Deep Dive:</span>
                    </h4>
                    <p className="text-xs text-gray-700 mt-2 font-medium leading-relaxed">
                      {activeChapter.shortDesc}
                    </p>
                  </div>

                  <div className="border-t border-gray-150 pt-3">
                    <h5 className="font-bold text-xs uppercase text-gray-500 tracking-wider mb-2">Workspace Layout Blueprint:</h5>
                    <pre className="font-mono text-xs bg-gray-50 border border-gray-150 p-3 rounded text-blue-900 overflow-x-auto whitespace-pre">
                      {activeChapter.suggestedFileStructure}
                    </pre>
                  </div>

                  <div className="border-t border-gray-150 pt-3">
                    <h5 className="font-bold text-xs uppercase text-gray-500 tracking-wider mb-1.5">Handy References:</h5>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Use standard semantic landmarks under HTML/CSS chapters to pass compilation successfully.</li>
                      <li>React models rely on standard import statements (e.g. keying elements React, useState) to load dynamic features.</li>
                      <li>Django answers must specify Pythonesque <code>JsonResponse</code> views controllers.</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
