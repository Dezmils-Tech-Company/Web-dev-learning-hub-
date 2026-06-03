import React, { useState } from 'react';
import { Folder, FileCode, CheckCircle, HelpCircle, CornerDownRight, AlignLeft, ShieldAlert } from 'lucide-react';

interface StructureTopic {
  title: string;
  sub: string;
  files: {
    name: string;
    description: string;
    codeExample: string;
    howItWorks: string;
    alternative: string;
  }[];
}

const STRUCT_TOPICS: { [key: string]: StructureTopic } = {
  beginner: {
    title: "HTML / CSS / JS Vanilla Sandbox",
    sub: "Ideal for complete beginners with zero bundlers or dependencies.",
    files: [
      {
        name: "index.html",
        description: "The structural skeleton entry element of your portfolio.",
        codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header><h1>Alex Portfolio</h1></header>
  <script src="app.js"></script>
</body>
</html>`,
        howItWorks: "The browser parses the HTML nodes sequentially. It fetches styles from style.css and binds DOM controllers from app.js.",
        alternative: "Alternative: For modular HTML files, you can use server side injection, or import HTML blocks dynamically inside your main Javascript bundle."
      },
      {
        name: "style.css",
        description: "Controls the colors, structural grid frameworks, and sizing variables.",
        codeExample: `:root {
  --primary: #0284c7;
}
body {
  margin: 0;
  font-family: sans-serif;
}`,
        howItWorks: "Contains CSS variables and element rules overriding standard browser user-agent styles.",
        alternative: "Alternative: Use styled utility frameworks (e.g., Tailwind CSS) imported via CDN inside your index.html header link nodes."
      },
      {
        name: "app.js",
        description: "Enforces interactivity, parsing custom HTML tags, filters, and animation triggers.",
        codeExample: `document.addEventListener('DOMContentLoaded', () => {
  console.log("Portfolio online and responding!");
});`,
        howItWorks: "Runs client-side immediately after elements load in the Document Object Model.",
        alternative: "Alternative: Write as ES Modules by adding type=\"module\" to the script tag (e.g. <script type=\"module\" src=\"app.js\"></script>)."
      }
    ]
  },
  intermediate_react: {
    title: "Vite + React JS Modular Component Hierarchy",
    sub: "Used by professionals to pack layout files dynamically into SPA bundle registers.",
    files: [
      {
        name: "package.json",
        description: "Node packages manager containing build directives and library registries.",
        codeExample: `{
  "name": "portfolio-react",
  "dependencies": {
    "react": "^19.0.1",
    "lucide-react": "^0.546.0"
  }
}`,
        howItWorks: "Registers semantic dependencies so bundlers like Vite resolve them from node_modules.",
        alternative: "Alternative: Yarn workspaces or PNPM lockfiles for monorepo development configurations."
      },
      {
        name: "src/main.tsx",
        description: "Transcribes React core to the static document div placeholder element.",
        codeExample: `import { createRoot } from 'react-dom/client';
import App from './App';
createRoot(document.getElementById('root')!).render(<App />);`,
        howItWorks: "Mounts the Virtual DOM nodes into the standard root DOM element of index.html.",
        alternative: "Alternative: Direct SSR hydration engines if utilizing hydration frameworks like Next.js or Astro."
      },
      {
        name: "src/App.tsx",
        description: "Core React canvas rendering outer wrappers and matching state modules.",
        codeExample: `import Header from './components/Header';
export default function App() {
  return (
    <div>
      <Header />
    </div>
  );
}`,
        howItWorks: "Primary layout tree structuring and flowing modular details to custom sub-components.",
        alternative: "Alternative: React Router routes container configuration mapping view coordinates."
      }
    ]
  },
  intermediate_django: {
    title: "Django MVT (Model-View-Template) Directory layout",
    sub: "Structured python folder separation containing databases and server backends.",
    files: [
      {
        name: "manage.py",
        description: "Python CLI setup controller for administrative workspace triggers.",
        codeExample: `#!/usr/bin/env python
import os, sys
# Runs migrations, boots local developments servers`,
        howItWorks: "Django command utility managing databases, migrations, and running tests.",
        alternative: "Alternative: Custom deployment configs using WSGI or ASGI wrappers directly through Docker."
      },
      {
        name: "portfolio/settings.py",
        description: "Global configurations, permitted hosts, databases, and middleware keys.",
        codeExample: `INSTALLED_APPS = [
    'django.contrib.admin',
    'portfolio.apps.PortfolioConfig',
]`,
        howItWorks: "Registers framework configurations, active applications, and database engines (e.g. SQLite, PostgreSQL).",
        alternative: "Alternative: Environment variables (using django-dotenv) resolving keys securely without committing hardcode files."
      },
      {
        name: "portfolio/views.py",
        description: "HTTP backend responses retrieving records and outputting server context.",
        codeExample: `from django.http import JsonResponse
def project_api(request):
    return JsonResponse({"status": "live"})`,
        howItWorks: "Receives requests, formats dictionary data schemas as JSON response packages.",
        alternative: "Alternative: Django Rest Framework (DRF) serializers resolving database model mapping automatically."
      }
    ]
  },
  advanced_mern: {
    title: "MERN Full Stack Microservices & Controllers",
    sub: "Advanced fullstack backend-frontend folder arrangement resolving REST APIs with databases.",
    files: [
      {
        name: "config/db.js",
        description: "Database connection establishment file utilizing mongoose rules.",
        codeExample: `const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};`,
        howItWorks: "Initiates parallel asynchronous pooling requests to MongoDB cloud instances.",
        alternative: "Alternative: SQL Connection drivers (e.g., Prisma client, Sequalize config) if using relational SQL instances."
      },
      {
        name: "models/Project.js",
        description: "Explicit document definitions enforcing Mongoose collections structure.",
        codeExample: `const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  title: String,
  xpProvided: Number
});`,
        howItWorks: "Applies a strict document validator on the database to verify field data types.",
        alternative: "Alternative: TypeScript decorators directly compiling SQL schemas via TypeORM or NestJS."
      },
      {
        name: "controllers/projectController.js",
        description: "Query execution center handling REST status payload returns.",
        codeExample: `exports.getData = async (req, res) => {
  const data = await Project.find();
  res.status(200).json(data);
};`,
        howItWorks: "Asynchronously fetches collections and transfers structured arrays inside HTTP responses.",
        alternative: "Alternative: GraphQL Resolvers serving client queries through single API routes."
      }
    ]
  }
};

export default function FolderStructures() {
  const [activeCategory, setActiveCategory] = useState<string>('beginner');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  const activeTopic = STRUCT_TOPICS[activeCategory] || STRUCT_TOPICS.beginner;
  const activeFile = activeTopic.files[selectedFileIndex] || activeTopic.files[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 font-sans" id="folder-architects-screen">
      <div className="border border-gray-200 bg-white rounded-lg p-6">
        <div>
          <span className="inline-block rounded bg-orange-100 text-orange-850 px-2.5 py-0.5 text-xxs font-bold uppercase tracking-wider text-orange-800">
            📁 Architecture & Basics
          </span>
          <h2 className="text-2xl font-black text-gray-950 mt-1">File Structure Architects</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Never guess where code belongs. Master the absolute basics of file placements across level tracks.
          </p>
        </div>

        {/* Categories picker */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-150 pb-4">
          <button
            onClick={() => { setActiveCategory('beginner'); setSelectedFileIndex(0); }}
            className={`px-4 py-2 text-xs font-semibold rounded pointer ${
              activeCategory === 'beginner' 
                ? 'bg-orange-600 text-white font-extrabold' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
             Beginner (HTML/JS)
          </button>
          <button
            onClick={() => { setActiveCategory('intermediate_react'); setSelectedFileIndex(0); }}
            className={`px-4 py-2 text-xs font-semibold rounded pointer ${
              activeCategory === 'intermediate_react' 
                ? 'bg-orange-600 text-white font-extrabold' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🛠️ React (Vite Modular)
          </button>
          <button
            onClick={() => { setActiveCategory('intermediate_django'); setSelectedFileIndex(0); }}
            className={`px-4 py-2 text-xs font-semibold rounded pointer ${
              activeCategory === 'intermediate_django' 
                ? 'bg-orange-600 text-white font-extrabold' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🐍 Django (MVT Python)
          </button>
          <button
            onClick={() => { setActiveCategory('advanced_mern'); setSelectedFileIndex(0); }}
            className={`px-4 py-2 text-xs font-semibold rounded pointer ${
              activeCategory === 'advanced_mern' 
                ? 'bg-orange-600 text-white font-extrabold' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔋 MERN (Full Stack)
          </button>
        </div>

        {/* Workspace Display breakdown */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full overflow-hidden">
          {/* File selector List (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="bg-slate-50 rounded border border-gray-150 p-4">
              <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Folder Layout:</h3>
              <p className="text-xs text-gray-600 mb-4">{activeTopic.sub}</p>

              <div className="space-y-1">
                {activeTopic.files.map((file, idx) => {
                  const isSelected = idx === selectedFileIndex;
                  return (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full flex items-center gap-2.5 p-3 rounded text-left text-xs font-mono transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-orange-50 border border-orange-200 font-bold text-orange-950' 
                          : 'border border-transparent bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <FileCode className={`h-4 w-4 shrink-0 ${isSelected ? 'text-orange-600' : 'text-gray-400'}`} />
                      <span className="truncate">{file.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-150 rounded-lg p-4 text-xs leading-relaxed text-blue-950">
              <h4 className="font-bold flex items-center gap-1">
                <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Why file layout is vital:</span>
              </h4>
              <p className="mt-1">
                Cowboy 'vibe coding' neglects directory schemas. High quality software demands defining static paths so build engines compile resources securely.
              </p>
            </div>
          </div>

          {/* Explanation Codes and Alternative breakdown (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Real code preview panel with explanations */}
            <div className="bg-slate-950 text-white rounded-lg border border-slate-800 overflow-hidden">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300 font-bold">📄 Code Template: {activeFile.name}</span>
                <span className="text-[10px] bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded px-2 py-0.5 font-mono uppercase font-bold">
                  Active view
                </span>
              </div>
              
              <div className="p-4 bg-slate-950">
                <pre className="font-mono text-xs leading-5 overflow-x-auto text-emerald-400">
                  {activeFile.codeExample}
                </pre>
              </div>
            </div>

            {/* In-depth descriptions */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-gray-400 tracking-wider">File Synopsis:</h4>
                <p className="text-sm font-bold text-gray-950 mt-1">{activeFile.description}</p>
              </div>

              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-gray-400 tracking-wider">How This File Operates:</h4>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">{activeFile.howItWorks}</p>
              </div>

              <div className="border-t border-gray-150 pt-4 bg-orange-50/40 p-4 rounded border border-orange-100">
                <h4 className="font-mono text-xs font-bold uppercase text-orange-870 text-orange-850 tracking-wider flex items-center gap-1 text-orange-800">
                  <span>⚙️ Architecture Alternative:</span>
                </h4>
                <p className="text-xs text-gray-850 leading-relaxed mt-1 text-gray-800">
                  {activeFile.alternative}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
