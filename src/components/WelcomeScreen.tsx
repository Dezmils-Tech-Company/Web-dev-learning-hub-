import React, { useState } from 'react';
import { Milestone, ArrowRight, Code, Terminal, Layers } from 'lucide-react';

interface WelcomeScreenProps {
  onSelected: (level: 'beginner' | 'intermediate' | 'advanced', techStack: string, userName: string) => void;
}

export default function WelcomeScreen({ onSelected }: WelcomeScreenProps) {
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!userName.trim()) {
      setError('Please provide your name or nickname to register your portfolio certificate!');
      return;
    }
    if (!level) {
      setError('Please select your current software development level.');
      return;
    }

    // Auto-allocate tech-stack depends on selected level
    let techStack = 'HTML/CSS/JS';
    if (level === 'intermediate') {
      techStack = 'React, Next.js & Django';
    } else if (level === 'advanced') {
      techStack = 'MERN Stack, Next.js & Django';
    }

    onSelected(level, techStack, userName.trim());
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 font-sans" id="welcome-screen">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-850">
          🚀 Dezmils Software Academy
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
          Master Software Engineering Through <span className="text-orange-600">Immediate Practice</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
          Dezmils Software Academy provides active, hands-on learning designed to teach you structure, 
          logic, and line-by-line understanding of web development through hands-on Personal Portfolio projects.
        </p>
      </div>

      <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Student Name */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-800" htmlFor="student-name">
            Enter Student Name or Nickname:
          </label>
          <input
            id="student-name"
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setError('');
            }}
            placeholder="e.g., Alex Carter"
            className="mt-2 w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-orange-600 focus:outline-none"
          />
        </div>

        {/* Level Select grids */}
        <h2 className="text-sm font-semibold text-gray-800">Select Your Experience Level:</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {/* Complete Beginner Card */}
          <button
            type="button"
            onClick={() => {
              setLevel('beginner');
              setError('');
            }}
            className={`flex flex-col items-start rounded border p-5 text-left transition-all cursor-pointer ${
              level === 'beginner'
                ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-orange-100 text-orange-700">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-gray-900">Complete Beginner</h3>
            <p className="mt-1.5 text-xs text-gray-500">I know nothing or struggle with programming basics.</p>
            
            <div className="mt-4 w-full border-t border-gray-150 pt-3">
              <span className="text-xxs font-mono font-bold text-orange-700 block uppercase">
                Awarded Tech Stack:
              </span>
              <span className="mt-1 inline-block rounded bg-orange-100 text-orange-850 px-2 py-0.5 text-xs font-semibold">
                HTML, CSS & JavaScript
              </span>
            </div>
          </button>

          {/* Intermediate Card */}
          <button
            type="button"
            onClick={() => {
              setLevel('intermediate');
              setError('');
            }}
            className={`flex flex-col items-start rounded border p-5 text-left transition-all cursor-pointer ${
              level === 'intermediate'
                ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-100 text-blue-700">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-gray-900">Intermediate Dev</h3>
            <p className="mt-1.5 text-xs text-gray-500">I want to move from simple static web widgets to modular platforms.</p>
            
            <div className="mt-4 w-full border-t border-gray-150 pt-3">
              <span className="text-xxs font-mono font-bold text-blue-700 block uppercase">
                Awarded Tech Stack:
              </span>
              <span className="mt-1 inline-block rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-semibold">
                React, Next.js & Django
              </span>
            </div>
          </button>

          {/* Advanced Card */}
          <button
            type="button"
            onClick={() => {
              setLevel('advanced');
              setError('');
            }}
            className={`flex flex-col items-start rounded border p-5 text-left transition-all cursor-pointer ${
              level === 'advanced'
                ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-indigo-100 text-indigo-700">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-gray-900">Advanced Dev</h3>
            <p className="mt-1.5 text-xs text-gray-500">I want to build full production microservices and databases.</p>
            
            <div className="mt-4 w-full border-t border-gray-150 pt-3">
              <span className="text-xxs font-mono font-bold text-indigo-700 block uppercase">
                Awarded Tech Stack:
              </span>
              <span className="mt-1 inline-block rounded bg-indigo-100 text-indigo-800 px-2 py-0.5 text-xs font-semibold">
                MERN Stack, Next & Django
              </span>
            </div>
          </button>
        </div>

        {error && (
          <div className="mt-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            ⚠️ {error}
          </div>
        )}

        {/* Start button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleStart}
            className="flex items-center gap-2 rounded bg-orange-600 px-6 py-3 font-sans text-sm font-semibold text-white hover:bg-orange-700 transition-colors shadow-sm cursor-pointer"
          >
            <span>Begin Training</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        🛡️ <span className="font-semibold text-gray-700">Dezmils Software Academy</span> — Interactive, hands-on lessons for every stage of your coding career.
      </div>
    </div>
  );
}
