import React, { useState } from 'react';
import { UserProgress, EARNABLE_BADGES, PORTFOLIO_CHAPTERS } from '../types';
import { 
  Globe, Award, Bookmark, Download, FileCode, CheckCircle, 
  Terminal, ShieldCheck, Heart, Sparkles, Database, Laptop, Info, Share2, Printer
} from 'lucide-react';

interface MyPortfolioHubProps {
  progress: UserProgress;
  currentUser: { id: string; email: string; displayName: string } | null;
}

export default function MyPortfolioHub({ progress, currentUser }: MyPortfolioHubProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend'>('all');
  const [portfolioTheme, setPortfolioTheme] = useState<'slate' | 'cyber' | 'warm'>('slate');
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'proj-1': 24,
    'proj-2': 18,
    'proj-3': 42
  });
  const [dbFetchLog, setDbFetchLog] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Determine active level and total level chapters
  const trackChapters = PORTFOLIO_CHAPTERS.filter(c => c.level === progress.selectedLevel);
  const completedTrackChapters = trackChapters.filter(c => progress.completedChapters.includes(c.id));
  const isLevelCompleted = trackChapters.length > 0 && completedTrackChapters.length === trackChapters.length;

  // Let's check which individual features are unlocked
  const hasHtml = progress.completedChapters.includes('beg-html') || progress.completedChapters.length > 0;
  const hasCss = progress.completedChapters.includes('beg-css') || progress.completedChapters.some(id => id !== 'beg-html');
  const hasJs = progress.completedChapters.includes('beg-js') || progress.completedChapters.some(id => id !== 'beg-html' && id !== 'beg-css');
  const hasReact = progress.completedChapters.some(id => id.includes('react') || id.includes('next') || id.includes('django') || id.includes('mern'));
  const hasFullStack = progress.completedChapters.some(id => id.includes('next') || id.includes('django') || id.includes('mern'));

  // Handler for project liking (demonstrating React state interactions)
  const handleLikeProject = (id: string) => {
    if (!hasReact) {
      alert("🔒 Interactive React state hooks are locked! Pass your 'React Component States' challenge in the Curriculum to enable reactive components.");
      return;
    }
    setLikeCounts(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  // Handler for custom DB JSON query stimulation
  const handleQueryDatabase = () => {
    if (!hasFullStack) {
      alert("🔒 Full Stack routing triggers are locked! Solve a 'Django JSON Views' or 'MERN Controller' chapter to unlock API requests.");
      return;
    }
    const timestamp = new Date().toLocaleTimeString();
    setDbFetchLog(prev => [
      `[${timestamp}] GET /api/portfolio/projects?filter=${activeCategory}`,
      `[${timestamp}] MongoDB response: 200 OK (24ms latency)`,
      `[${timestamp}] Loaded ${activeCategory === 'all' ? 3 : 1} dynamic records from localized cluster.`,
      ...prev.slice(0, 5)
    ]);
  };

  // Mock download ZIP content exporter
  const handleExportPortfolio = () => {
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      // Trigger a raw text download containing a beautiful dynamic explanation of the student's code bundle
      const fileHeader = `========================================================================\n` +
                         `      DEZMINS SOFTWARE ACADEMY - OFFICIAL CERTIFIED COMPILATION BUNDLE   \n` +
                         `========================================================================\n\n` +
                         `Student name: ${currentUser?.displayName || "Academy Cadet"}\n` +
                         `Certified Level: ${progress.selectedLevel?.toUpperCase() || "WEB SPECIALIST"}\n` +
                         `Accredited Track: ${progress.selectedStack || "Modern Frontend Stack"}\n` +
                         `LMS Registration ID: DSA-C-${currentUser?.id.substring(0, 6).toUpperCase()}\n` +
                         `Date Certified: ${new Date().toLocaleDateString()}\n\n` +
                         `------------------------------------------------------------------------\n` +
                         `ABOUT YOUR COMPILED PORTFOLIO SOURCE CODE Folder\n` +
                         `------------------------------------------------------------------------\n` +
                         `This folder is pre-configured and completely optimized for local serving\n` +
                         `or hosting on Vercel, Netlify, or GitHub Pages.\n\n` +
                         `File Structure included in compilation:\n` +
                         `my-portfolio/\n` +
                         `├── index.html         - Skeletal structures compiled from Chapter 1\n` +
                         `├── style.css          - Styled typography, flex grids, and colors from Chapter 2\n` +
                         `└── app.js             - Interactive project filters from Chapter 3\n\n` +
                         `======================== [index.html Source Code] ======================\n` +
                         `<!DOCTYPE html>\n` +
                         `<html lang="en">\n` +
                         `<head>\n` +
                         `  <meta charset="UTF-8">\n` +
                         `  <title>${currentUser?.displayName}'s Software Engineering Portfolio</title>\n` +
                         `  <link rel="stylesheet" href="style.css">\n` +
                         `</head>\n` +
                         `<body>\n` +
                         `  <header class="header-container">\n` +
                         `    <h1 class="brand-title">${currentUser?.displayName}</h1>\n` +
                         `    <nav class="nav-links">\n` +
                         `      <a href="#projects">Projects</a>\n` +
                         `      <a href="#skills">Skills</a>\n` +
                         `      <a href="#contact">Contact</a>\n` +
                         `    </nav>\n` +
                         `  </header>\n` +
                         `  <main>\n` +
                         `    <section class="hero-section">\n` +
                         `      <h2>Transforming Code into Responsive Solutions</h2>\n` +
                         `      <p>Certified developer specializing in ${progress.selectedStack || "React development"}.</p>\n` +
                         `    </section>\n` +
                         `    <section id="projects">\n` +
                         `      <h2>Selected Works</h2>\n` +
                         `      <div class="projects-grid">\n` +
                         `         <!-- Compiled interactive tags -->\n` +
                         `      </div>\n` +
                         `    </section>\n` +
                         `  </main>\n` +
                         `  <script src="app.js"></script>\n` +
                         `</body>\n` +
                         `</html>\n\n` +
                         `======================== [style.css Source Code] ======================\n` +
                         `:root {\n` +
                         `  --primary: #0284c7;\n` +
                         `  --background: #fafbfe;\n` +
                         `  --text: #1e293b;\n` +
                         `}\n` +
                         `body { font-family: system-ui, sans-serif; background: var(--background); color: var(--text); }\n` +
                         `.header-container { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }\n` +
                         `.projects-grid { display: grid; grid-template-cols: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }\n\n` +
                         `========================= [app.js Source Code] =========================\n` +
                         `// Evaluator compiled filter event integrations\n` +
                         `console.log("Dezmils Portfolio Initialized for ${currentUser?.displayName}!");\n`;

      const element = document.createElement("a");
      const file = new Blob([fileHeader], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${currentUser?.displayName.toLowerCase().replace(/\s+/g, '_')}_certified_portfolio.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  // List of projects rendered inside their live portfolio
  const ALL_MOCK_PROJS = [
    { id: 'proj-1', title: 'Interactive Portfolio Base', desc: 'Core responsive layout built using valid HTML markup tags.', category: 'frontend', tech: 'HTML/CSS/JS' },
    { id: 'proj-2', title: 'Task Manager State Engine', desc: 'A declarative application utilizing React state hooks and parameters.', category: 'frontend', tech: 'React Hooks' },
    { id: 'proj-3', title: 'Server API Gateway', desc: 'Asynchronous Python/Node middleware serving true JSON endpoints.', category: 'backend', tech: 'Django/MERN' }
  ];

  const filteredProjects = ALL_MOCK_PROJS.filter(p => {
    if (!hasJs || activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 w-full overflow-hidden" id="portfolio-hub-container">
      
      {/* HEADER SECTION ROW */}
      <div className="lg:col-span-12 border-b border-gray-150 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded bg-orange-100 text-orange-900 px-2.5 py-0.5 text-xxs font-mono font-bold uppercase tracking-wider">
          🌐 Dynamic Portfolio Workshop
        </span>
        <h2 className="text-3xl font-black text-gray-950 mt-1">My Live Portfolio Workspace</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Here is your actual, dynamic personal portfolio! As you build, type, and verify code blocks inside the Course Curriculum, your portfolio upgrades itself from bare-bones markup to a modern, fully responsive full-stack platform.
        </p>
      </div>

      {/* LEFT COLUMN: EDUCATIONAL MENTOR AND PROGRESS PASSPORT (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Mentor Ezra Education Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xs relative overflow-hidden" id="mentor-portfolio-guide">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-55 to-transparent opacity-10 pointer-events-none" />
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
              alt="Mentor Ezra" 
              className="h-10 w-10 rounded-full object-cover border border-orange-200 shadow-xs"
            />
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-orange-600 block">Chief Academic Mentor</span>
              <h4 className="font-extrabold text-sm text-gray-900">Dev Master Ezra</h4>
            </div>
          </div>
          
          <div className="mt-4 bg-orange-50/50 border border-orange-100 rounded-lg p-3.5 text-xs text-orange-950 space-y-2 leading-relaxed text-left">
            <p className="font-bold">🧑‍🏫 Building Your Personal Brand:</p>
            <p>
              "The most important asset a developer owns is their portfolio. I don't believe in 'vibe coding' or copying generic templates. To truly earn your certification, you must understand how every line of code influences the compiled layout."
            </p>
            <p className="border-t border-orange-150 pt-2 text-xxs opacity-85">
              💡 <strong>Ezra's Pedagogical Tip:</strong> Try switching and clicking filter tabs in your Live Portfolio block below! If JavaScript is unlocked, you'll see DOM filtering in action instantly.
            </p>
          </div>
        </div>

        {/* Dynamic Portfolio Growth Passport */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-4 text-left">
          <div>
            <h3 className="font-bold text-sm text-gray-950">Portfolio Upgrade Landmarks</h3>
            <p className="text-[11px] text-gray-500">Track your verified asset enhancements.</p>
          </div>

          <div className="space-y-2.5">
            {/* HTML Bones Card */}
            <div className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all ${
              hasHtml ? 'bg-emerald-50/30 border-emerald-150 text-emerald-950' : 'bg-gray-55/60 border-gray-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <FileCode className={`h-4.5 w-4.5 shrink-0 ${hasHtml ? 'text-emerald-600' : 'text-gray-400'}`} />
                <div>
                  <span className="font-bold block">1. Semantic Markup (HTML)</span>
                  <span className="text-[10px] text-gray-500">Core structural elements & headings</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${
                hasHtml ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
              }`}>
                {hasHtml ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            {/* CSS Styles Card */}
            <div className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all ${
              hasCss ? 'bg-emerald-50/30 border-emerald-150 text-emerald-950' : 'bg-gray-55/60 border-gray-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`h-4.5 w-4.5 shrink-0 ${hasCss ? 'text-emerald-400 animate-pulse' : 'text-gray-400'}`} />
                <div>
                  <span className="font-bold block">2. Spacing & Colors (CSS)</span>
                  <span className="text-[10px] text-gray-500">Flexbox layout, margins, system fonts</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${
                hasCss ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
              }`}>
                {hasCss ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            {/* JS Interactions Card */}
            <div className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all ${
              hasJs ? 'bg-emerald-50/30 border-emerald-150 text-emerald-950' : 'bg-gray-55/60 border-gray-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <Globe className={`h-4.5 w-4.5 shrink-0 ${hasJs ? 'text-indigo-600' : 'text-gray-400'}`} />
                <div>
                  <span className="font-bold block">3. Event Filtering (JS)</span>
                  <span className="text-[10px] text-gray-500">Dynamic category filter selection</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${
                hasJs ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
              }`}>
                {hasJs ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            {/* React State Widget Card */}
            <div className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all ${
              hasReact ? 'bg-emerald-50/30 border-emerald-150 text-emerald-950' : 'bg-gray-55/60 border-gray-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <Heart className={`h-4.5 w-4.5 shrink-0 ${hasReact ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                <div>
                  <span className="font-bold block">4. State Management (React)</span>
                  <span className="text-[10px] text-gray-500">Interactive project like states & metrics</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${
                hasReact ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
              }`}>
                {hasReact ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            {/* Database integration Card */}
            <div className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all ${
              hasFullStack ? 'bg-emerald-50/30 border-emerald-150 text-emerald-950' : 'bg-gray-55/60 border-gray-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <Database className={`h-4.5 w-4.5 shrink-0 ${hasFullStack ? 'text-cyan-650' : 'text-gray-400'}`} />
                <div>
                  <span className="font-bold block">5. Backend Integration (MERN/Django)</span>
                  <span className="text-[10px] text-gray-500">Live mock REST data requests logs</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${
                hasFullStack ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
              }`}>
                {hasFullStack ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          </div>

          {/* Source Code exporter button */}
          <div className="border-t border-gray-150 pt-4 flex flex-col gap-2">
            <h5 className="font-bold text-xs uppercase text-gray-700 block">Deploy Your Finished Work:</h5>
            <p className="text-xxs text-gray-500 leading-normal">
              You can export your completed, verified portfolio files to run locally or upload directly to Vercel or GitHub Pages in one click!
            </p>
            <button
              onClick={handleExportPortfolio}
              disabled={isExporting}
              className="mt-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white rounded py-2 px-3 hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="border-t-2 border-r-2 border-white animate-spin rounded-full h-3 w-3" />
                  <span>Compiling ZIP Bundle...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Portfolio Code ZIP</span>
                </>
              )}
            </button>
            {exportComplete && (
              <p className="text-emerald-700 text-xxs font-mono font-bold text-center">
                ✓ Compilation bundle downloaded successfully!
              </p>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: PORTFOLIO PREVIEW AND DIPLOMA (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">

        {/* THE OFFICIAL ACADEMIC DIPLOMA SCREEN */}
        {isLevelCompleted ? (
          <div className="bg-slate-950 border-4 border-double border-orange-500/60 rounded-xl p-6 md:p-8 text-white relative shadow-2xl animate-fadeIn text-center flex flex-col items-center justify-center min-h-[300px]">
            {/* Top golden ribbon badge element */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-600/20 border border-orange-500 text-orange-400 font-mono text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400 fill-orange-500/20" />
              <span>Ezra Validated</span>
            </div>

            <Award className="h-14 w-14 text-orange-500 stroke-1 mt-2 animate-bounce" />

            <span className="text-[10px] font-mono font-extrabold text-orange-400 tracking-widest uppercase block mt-3">
              Dezmils Software Academy Accreditation
            </span>
            <h3 className="text-2xl font-black font-serif text-white tracking-tight mt-1">
              Diploma of Software Competency
            </h3>
            
            <p className="text-xs text-slate-400 max-w-lg mt-3 leading-relaxed">
              This certifies that student <strong className="text-white text-sm">{currentUser?.displayName}</strong> has completed all code checkpoints, knowledge checks, and curriculum goals for the <strong className="text-orange-400">{progress.selectedLevel?.toUpperCase()} LEVEL</strong> curriculum track. They have successfully constructed, styled, and optimized their personal:
            </p>

            <span className="inline-flex mt-4 items-center gap-1.5 bg-yellow-900/40 border border-yellow-700 text-yellow-300 font-sans text-xs font-black rounded-lg px-4 py-1.5 shadow-sm">
              👑 COMPILED DEVELOPER PORTFOLIO RESUME
            </span>

            <div className="mt-8 border-t border-slate-800 pt-5 w-full max-w-xl grid grid-cols-2 text-left font-mono text-[10px] text-slate-400 gap-y-3">
              <div>
                <span className="block text-slate-500 uppercase">TELEMETRY LEDGER STATS</span>
                <span className="font-bold text-slate-200">{progress.xp} XP / {progress.completedChapters.length} Modules</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase">ACADEMIC TRUST INDEX CERT</span>
                <span className="font-bold text-blue-400 select-all">DSA-CERT-{(currentUser?.id || "CADET").substring(0, 8).toUpperCase()}-{Math.floor(Math.random() * 89999 + 10000)}</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase">AUTHORIZED ACADEMY SIGNATURE</span>
                <span className="font-bold text-orange-400 font-serif italic text-[11px]">Instructor Dev Ezra</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase">COMPILATION SYSTEM ID</span>
                <span className="font-bold text-slate-200">100% NON-COWBOY STATIC CODE</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-4 py-2 rounded font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Certificate</span>
              </button>
              <button 
                onClick={handleExportPortfolio}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-5 py-2 rounded font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Certified Code Bundle</span>
              </button>
            </div>
          </div>
        ) : (
          /* PASSPORT PROGRESS SCREEN IF NOT YET FULLY COMPLETED MODULES */
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 md:p-6 text-white text-left font-sans flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded text-xxs font-mono font-bold text-blue-400 uppercase w-fit tracking-wider">
                🎓 Active Credentials Gateway
              </div>
              <h3 className="text-base font-black text-white">Your Certificate Roadmap Portfolio Progress</h3>
              <p className="text-xxs text-slate-400 max-w-md leading-relaxed">
                Unlock your official <strong>Dezmils Software Diploma & Portfolio bundle</strong> by completing all chapter modules in your selected track. Currently at <strong>{Math.floor((completedTrackChapters.length / trackChapters.length) * 100)}% completion</strong>.
              </p>
            </div>
            
            <div className="bg-slate-805 bg-slate-900 border border-slate-800 rounded px-4 py-3 flex flex-col items-center gap-1 shrink-0 text-center font-mono w-full sm:w-auto">
              <span className="text-[22px] font-black text-orange-400 leading-none">
                {completedTrackChapters.length} / {trackChapters.length}
              </span>
              <span className="text-[9px] uppercase text-slate-500 font-extrabold tracking-widest mt-1">Modules Passed</span>
              <div className="h-1 w-20 overflow-hidden bg-slate-850 rounded mt-1.5">
                <div 
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${(completedTrackChapters.length / trackChapters.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* LIVE PORTFOLIO BROWSER CONTAINER */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col">
          {/* Mock Browser Header Bar */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />
              </div>
              <div className="bg-white px-3 py-1 border border-gray-200 rounded text-xxs text-gray-500 font-mono flex items-center gap-1.5 min-w-[200px] md:min-w-[280px] shadow-xs">
                <Globe className="h-3 w-3 text-emerald-500" />
                <span>https://{currentUser?.displayName.toLowerCase().replace(/\s+/g, '-')}-portfolio.dsa</span>
              </div>
            </div>

            {/* Custom Theme Switcher (representing React functionality) */}
            {hasCss && (
              <div className="flex items-center gap-1 bg-gray-200/55 rounded p-1">
                <button
                  onClick={() => {
                    if (!hasReact) alert("🔒 Theme toggling requires the 'React Component State' hook curriculum solved!");
                    else setPortfolioTheme('slate');
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                    portfolioTheme === 'slate' ? 'bg-white text-gray-900 shadow-xxs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Slate
                </button>
                <button
                  onClick={() => {
                    if (!hasReact) alert("🔒 Theme toggling requires the 'React Component State' hook curriculum solved!");
                    else setPortfolioTheme('cyber');
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                    portfolioTheme === 'cyber' ? 'bg-white text-purple-700 shadow-xxs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Cyber
                </button>
                <button
                  onClick={() => {
                    if (!hasReact) alert("🔒 Theme toggling requires the 'React Component State' hook curriculum solved!");
                    else setPortfolioTheme('warm');
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                    portfolioTheme === 'warm' ? 'bg-white text-orange-700 shadow-xxs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Warm
                </button>
              </div>
            )}
          </div>

          {/* PORTFOLIO MOCK LIVE RENDER SCREEN */}
          {!hasHtml ? (
            /* LAYER 0: EMPTY WORKSTATION */
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[350px] bg-slate-50 gap-4" id="empty-portfolio-preview">
              <Laptop className="h-16 w-16 text-gray-300 stroke-1 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm text-gray-950">HTML Structural Elements Layer is Locked</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                  Your live portfolio requires valid markup tags. Navigate to the Course Curriculum and complete chapter 1 to build the initial headers, content sections, and page footer elements!
                </p>
              </div>
            </div>
          ) : (
            /* LAYER > 1: PORTFOLIO RENDERS */
            <div className={`p-6 text-left min-h-[380px] transition-all duration-300 ${
              !hasCss 
                ? 'bg-white text-black font-serif border-2 border-gray-400 m-2' /* Times New Roman, unstyled look */
                : portfolioTheme === 'cyber'
                  ? 'bg-zinc-950 text-purple-100 font-mono'
                  : portfolioTheme === 'warm'
                    ? 'bg-amber-50/20 text-orange-950 font-sans'
                    : 'bg-white text-slate-800 font-sans' /* Elegant Slate Theme */
            }`} id="actual-live-portfolio-panel">
              
              {/* Unstyled HTML Notice */}
              {!hasCss && (
                <div className="bg-yellow-100 text-yellow-905 text-xxs p-2 border border-yellow-200 rounded font-sans mb-4 leading-relaxed">
                  ⚠️ <strong>Visual Telemetry Alert:</strong> Your index.html is loaded, but <strong>style.css is complete blank!</strong> Standard HTML without styling has default Times New Roman font and no padding alignment. Head to Chapter 2 (Flexbox layout) to style it pro level!
                </div>
              )}

              {/* LIVE PORTFOLIO HEADER */}
              <div className={`flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 ${
                hasCss 
                  ? portfolioTheme === 'cyber'
                    ? 'border-purple-900/50'
                    : portfolioTheme === 'warm'
                      ? 'border-orange-200'
                      : 'border-slate-100'
                  : 'm-2 border-slate-500' /* Unstyled border */
              }`}>
                <div>
                  <h4 className={`font-serif tracking-tight leading-none ${
                    hasCss 
                      ? 'text-xl font-extrabold text-gray-950' 
                      : 'text-2xl underline font-bold' /* Unstyled big underline */
                  } ${
                    portfolioTheme === 'cyber' ? 'text-purple-400 font-mono' : ''
                  }`}>
                    {currentUser?.displayName || " Cadence Dev"}
                  </h4>
                  {hasCss && (
                    <span className={`text-[10px] font-mono font-bold mt-1 block uppercase ${
                      portfolioTheme === 'cyber' ? 'text-purple-500' : 'text-blue-600'
                    }`}>
                      Certified {progress.selectedLevel} Practitioner
                    </span>
                  )}
                </div>

                <ul className={`flex items-center gap-4 list-none ${
                  !hasCss ? 'mt-4 block font-serif list-disc pl-4 text-blue-700 underline' : 'mt-0 text-xs font-semibold'
                }`}>
                  <li><a href="#projects" className={hasCss ? "hover:text-orange-600 transition-colors" : ""}>Projects</a></li>
                  <li><a href="#skills" className={hasCss ? "hover:text-orange-600 transition-colors" : ""}>Academics</a></li>
                  <li><a href="#contact" className={hasCss ? "hover:text-orange-600 transition-colors" : ""}>Contact</a></li>
                </ul>
              </div>

              {/* PORTFOLIO MAIN BODY AREA */}
              <div className="py-6 space-y-6">
                
                {/* HERO WELCOME BANNER */}
                <div className="text-left">
                  <h5 className={`font-serif leading-tight ${
                    hasCss ? 'text-lg font-black text-gray-900' : 'text-xl font-bold'
                  } ${
                    portfolioTheme === 'cyber' ? 'text-zinc-100 font-mono' : ''
                  }`}>
                    Hi Explorer! Let's code responsive web solutions.
                  </h5>
                  <p className={`mt-2 ${
                    hasCss ? 'text-xs text-gray-500 leading-relaxed' : 'text-sm font-serif'
                  }`}>
                    I build accessible software interfaces and connect persistent database APIs. Explore my active projects telemetry and curriculum credentials down below.
                  </p>
                </div>

                {/* PROJECTS LIST WITH ACTIVE JS/REACT FILTERING */}
                <div id="projects" className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h6 className={`font-mono text-xs uppercase tracking-wider font-bold ${
                      hasCss ? 'text-slate-400' : 'font-serif underline'
                    }`}>
                      📁 Highlighted Project Nodes
                    </h6>

                    {/* DYNAMIC JS FILTER BUTTONS */}
                    {hasJs && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActiveCategory('all');
                            if (hasJs) handleQueryDatabase();
                          }}
                          className={`px-3 py-1 rounded text-xxs font-bold cursor-pointer transition-all ${
                            activeCategory === 'all' 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          All Works
                        </button>
                        <button
                          onClick={() => {
                            setActiveCategory('frontend');
                            if (hasJs) handleQueryDatabase();
                          }}
                          className={`px-3 py-1 rounded text-xxs font-bold cursor-pointer transition-all ${
                            activeCategory === 'frontend' 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Front-End
                        </button>
                        <button
                          onClick={() => {
                            setActiveCategory('backend');
                            if (hasJs) handleQueryDatabase();
                          }}
                          className={`px-3 py-1 rounded text-xxs font-bold cursor-pointer transition-all ${
                            activeCategory === 'backend' 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Back-End
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CARDS GRID */}
                  <div className={hasCss ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-4 font-serif"}>
                    {filteredProjects.map(proj => {
                      return (
                        <div 
                          key={proj.id}
                          className={`p-4 border transition-all ${
                            hasCss 
                              ? 'bg-white border-gray-150 rounded-lg hover:border-orange-500 hover:shadow-xs flex flex-col justify-between' 
                              : 'border-2 border-black m-2'
                          } ${
                            portfolioTheme === 'cyber' ? 'bg-zinc-900 border-purple-900/30 text-zinc-100' : ''
                          }`}
                        >
                          <div>
                            <span className="bg-orange-100 text-orange-900 px-2 py-0.5 rounded text-[8px] tracking-wider uppercase font-mono font-bold">
                              {proj.tech}
                            </span>
                            <h4 className={`mt-2 font-bold ${hasCss ? 'text-sm text-gray-950' : 'text-base underline font-bold'} ${
                              portfolioTheme === 'cyber' ? 'text-purple-300 font-mono' : ''
                            }`}>
                              {proj.title}
                            </h4>
                            <p className={`mt-1.5 block ${hasCss ? 'text-xxs text-gray-500' : 'text-xs'}`}>
                              {proj.desc}
                            </p>
                          </div>

                          {/* RECT INTERACTION HEART BUTTON */}
                          <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[9px] text-gray-400 font-mono uppercase">Telemetry Verified</span>
                            <button
                              onClick={() => handleLikeProject(proj.id)}
                              className={`flex items-center gap-1 cursor-pointer font-sans transition-transform active:scale-90 ${
                                hasReact 
                                  ? 'text-rose-600 hover:text-rose-700 font-bold text-[11px]' 
                                  : 'text-gray-400 text-xs font-serif'
                              }`}
                            >
                              <Heart className={`h-3 w-3 shrink-0 ${hasReact ? 'fill-rose-600 stroke-none' : 'stroke-gray-400'}`} />
                              <span>{likeCounts[proj.id]} Likes</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DB CALL CONSOLE PANEL OVERLAY (FOR FULLSTACK STUDENTS) */}
                {hasJs && (
                  <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs border border-slate-800 text-left">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="text-emerald-400 font-bold text-xxs uppercase tracking-wider flex items-center gap-1">
                        <Terminal className="h-3 w-3 inline text-emerald-500" />
                        <span>Interactive Frontend API Console</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        hasFullStack ? 'bg-emerald-950 border border-emerald-900 text-emerald-350' : 'bg-red-950 text-red-400 border border-red-900'
                      }`}>
                        {hasFullStack ? 'FULLSTACK API ONLINE' : 'CLIENT ONLY STANDALONE'}
                      </span>
                    </div>

                    {dbFetchLog.length === 0 ? (
                      <span className="text-slate-500 text-xxs italic">
                        *No HTTP requests triggered. Select filter categories above or trigger interaction to query the simulated database endpoints...
                      </span>
                    ) : (
                      <div className="space-y-1.5 flex flex-col text-xxs">
                        {dbFetchLog.map((log, lIdx) => (
                          <div key={lIdx} className="text-zinc-300 font-mono">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SKILLS CHIPS ACCREDITATION ROW */}
                <div id="skills" className="space-y-3">
                  <h6 className={`font-mono text-xs uppercase tracking-wider font-bold ${
                    hasCss ? 'text-slate-400' : 'font-serif underline'
                  }`}>
                    🏅 Unlocked Skill Grid
                  </h6>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {EARNABLE_BADGES.map(badge => {
                      const isUnlocked = progress.badges.includes(badge.name) || progress.xp >= badge.xpRequired;
                      if (!isUnlocked) return null;
                      return (
                        <span 
                          key={badge.name}
                          className={`inline-flex px-2.5 py-1 text-xxs font-mono font-bold rounded ${
                            hasCss 
                              ? 'bg-blue-100 border border-blue-200 text-blue-900' 
                              : 'border border-black bg-slate-100 font-serif'
                          }`}
                        >
                          ✔ {badge.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* COMPLETED PORTFOLIO ACCREDITED ACADEMY FOOTER */}
                <div className={`pt-4 border-t border-gray-250 flex flex-col md:flex-row items-center justify-between text-xxs text-gray-400 mt-6 ${
                  !hasCss ? 'font-serif m-2 text-sm text-slate-800' : ''
                }`}>
                  <span>© 2026 {currentUser?.displayName || " Cadence Dev"}. Built under master mentorship of Instructor Ezra.</span>
                  
                  <div className="flex gap-4 mt-2 md:mt-0 font-sans">
                    <span className="text-emerald-700 font-bold font-mono uppercase">105% VERIFIED ACCREDITATION</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
