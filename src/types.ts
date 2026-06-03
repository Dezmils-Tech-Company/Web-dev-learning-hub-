export interface CodeFile {
  name: string;
  path: string;
  initialContent: string;
  expectedContentSnippet: string; // Used as fallback check or guidance
  explanation: string; // Explains what this file does
  lineExplanations: { [lineNumber: number]: string }; // Line-by-line documentation
}

export interface Chapter {
  id: string;
  title: string;
  shortDesc: string;
  fullGuide: string;
  challengeInstruction: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  techStack: string; // 'HTML/CSS/JS' | 'React' | 'Next.js' | 'Django' | 'MERN' | 'Django Advanced'
  files: CodeFile[];
  activeFilePath: string;
  suggestedFileStructure: string; // Textual diagram of file tree
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface UserProgress {
  selectedLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  selectedStack: string | null;
  xp: number;
  level: number;
  completedChapters: string[]; // List of Chapter.id
  answeredQuizChapters: string[]; // List of Chapter.id
  completedchallenges: string[]; // List of Chapter.id
  badges: string[]; // List of Badge names
  streakDays: number;
  lastActiveDate: string; // ISO String
}

export interface ForumPost {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    reputation: number;
    level: string; // e.g., "Beginner", "Django Wizard"
  };
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  createdAt: string;
  answers: ForumAnswer[];
}

export interface ForumAnswer {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    reputation: number;
    level: string;
  };
  content: string;
  upvotes: number;
  createdAt: string;
  isInstructorVerified?: boolean;
}

export interface AchievementBadge {
  name: string;
  description: string;
  iconName: string; // Lucide icon ID
  xpRequired: number;
}

// Full chapters database structured specifically for building a Portfolio!
export const PORTFOLIO_CHAPTERS: Chapter[] = [
  // --- BEGINNER: HTML/CSS/JS PORTFOLIO ---
  {
    id: "beg-html",
    title: "Portfolio Layout using HTML semantic structure",
    shortDesc: "Learn how to build the bones of your portfolio using semantic HTML elements (header, main, section, footer).",
    level: "beginner",
    techStack: "HTML/CSS/JS",
    activeFilePath: "index.html",
    suggestedFileStructure: `my-portfolio/
├── index.html
├── style.css
└── app.js`,
    quiz: {
      question: "Which HTML5 semantic tag is best suited for wrapping the main navigation links of your portfolio?",
      options: ["<header>", "<nav>", "<section>", "<div>"],
      answerIndex: 1,
      explanation: "The <nav> tag is specifically designed to house navigation blocks, helping search engines and accessibility tools parse your page hierarchy."
    },
    fullGuide: `Welcome to Web Development! Every web app starts with HTML (HyperText Markup Language).

We will design a Personal Portfolio. Your portfolio consists of:
1. **Header**: Your brand, and a navigation bar.
2. **Hero Section**: A warm greeting, your title (e.g., "Junior Dev"), and a call-to-action button.
3. **Projects Section**: Visual list of your applications.
4. **Skills list**: Grid of your tech stacks.
5. **Footer**: Copyright details.

We use **semantic HTML** like \`<header>\`, \`<main>\`, \`<section>\`, and \`<footer>\` instead of random \`<div>\` elements. This makes your webpage accessible and search-engine optimized (SEO). No more Vibe Coding—every tag has a defined utility!`,
    challengeInstruction: "Let's structure your core index.html. Add a <header> with your name, a <section id=\"projects\">, a <section id=\"skills\">, and a <footer>. Enter your code in the workspace below. Note: Copy-pasting is disabled to build your muscle memory! Type or click word macros below.",
    files: [
      {
        name: "index.html",
        path: "index.html",
        initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alex the Dev - Portfolio</title>
</head>
<body>
  <!-- STEP 1: Add a Header block here -->

  <!-- STEP 2: Add a Main block with Hero and Projects sections -->

  <!-- STEP 3: Add a Footer block at the end -->
</body>
</html>`,
        expectedContentSnippet: `<header>`,
        explanation: "The primary entry file defining structural components of your Portfolio.",
        lineExplanations: {
          1: "Defines the document type as HTML5.",
          2: "Root container element for the HTML code.",
          5: "Sets metadata about charset encoding.",
          6: "Sets the title that appears in the browser tab."
        }
      }
    ]
  },
  {
    id: "beg-css",
    title: "Styling the Portfolio using CSS layout grid & flexbox",
    shortDesc: "Apply colors, typography, margins, and center elements neatly both vertically and horizontally.",
    level: "beginner",
    techStack: "HTML/CSS/JS",
    activeFilePath: "style.css",
    suggestedFileStructure: `my-portfolio/
├── index.html
├── style.css   <-- Active
└── app.js`,
    quiz: {
      question: "Which flexbox property dictates how main-axis children are aligned inside a flex container?",
      options: ["align-items", "justify-content", "flex-wrap", "margin-auto"],
      answerIndex: 1,
      explanation: "justify-content governs horizontal distribution if the flex-direction is row (the default), while align-items handles cross-axis distribution."
    },
    fullGuide: `CSS (Cascading Style Sheets) brings your portfolio to life.

Today, we style our Portfolio using:
1. **CSS Flexbox**: Ideal for 1-dimensional layouts such as headers, lists, or centering items.
2. **CSS Variables**: Set global color-schemes once and reference them everywhere (e.g., '--primary-color').
3. **Responsive Media Queries**: Ensure it fits beautiful screens in notebooks and compact mobile screens.

Remember, a clean layout requires precise margins, paddings, and line-heights. This eliminates 'Vibe styling' where things are moved randomly until they fit!`,
    challengeInstruction: "Let's write style.css. Set primary blue (#0284c7) and orange (#ea580c) details. Create a flex box header with a spaced out layout (.header { display: flex; justify-content: space-between; }). Add styles to the editor below.",
    files: [
      {
        name: "style.css",
        path: "style.css",
        initialContent: `/* Style definitions for Alex's Portfolio */
:root {
  --primary: #0284c7;
  --secondary: #ea580c;
  --background: #ffffff;
}

body {
  font-family: sans-serif;
  color: #333333;
}

/* Add header styling below to flex & space-between items */
`,
        expectedContentSnippet: `display: flex`,
        explanation: "Defines color registers, typographic defaults, layout structures, and styling animations.",
        lineExplanations: {
          2: "Sets CSS custom properties for global primary color codes.",
          3: "Defines the secondary theme accent color.",
          7: "Declares modern, readable body-copy font."
        }
      }
    ]
  },
  {
    id: "beg-js",
    title: "Adding Dynamic Filtering of Projects using JavaScript",
    shortDesc: "Program a clean interactive state using events to filter project categories dynamically.",
    level: "beginner",
    techStack: "HTML/CSS/JS",
    activeFilePath: "app.js",
    suggestedFileStructure: `my-portfolio/
├── index.html
├── style.css
└── app.js    <-- Active`,
    quiz: {
      question: "Which JavaScript function correctly registers a callback when a user clicks on an element?",
      options: ["element.addEventListener('click', fn)", "element.onclickEvent(fn)", "element.bind('click', fn)", "element.trigger('click', fn)"],
      answerIndex: 0,
      explanation: "addEventListener receives the standard event name ('click') and executes the registered callback function."
    },
    fullGuide: `JavaScript provides brains to your portfolio's skeletal HTML and styling.

In this lesson, you write a filter menu for your project page. When the user clicks "React Projects" or "Django Projects", the portfolio filters list items gracefully by parsing a 'data-category' custom attribute on the element. Let's work directly with DOM selection:
- \`document.querySelectorAll()\`
- \`element.classList.toggle()\`
- Action event bindings.`,
    challengeInstruction: "Write JavaScript inside app.js. Bind click listeners to filter buttons. Iterate over projects, comparing element category attribute. Hide/show them using style.display of block or none.",
    files: [
      {
        name: "app.js",
        path: "app.js",
        initialContent: `// Filter portfolio projects based on Category label
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    
    // Add logic here to filter projectCards
    
  });
});`,
        expectedContentSnippet: `addEventListener`,
        explanation: "Performs DOM operations, listens to click events, and manages page state dynamically.",
        lineExplanations: {
          2: "Selects all elements representing project filter action tags.",
          3: "Selects interactive list elements of portfolio grids.",
          5: "Attaches modern click handlers down each tag array."
        }
      }
    ]
  },

  // --- INTERMEDIATE: REACT/NEXT/DJANGO ---
  {
    id: "int-react",
    title: "React JS: Building reusable Portfolio Component States",
    shortDesc: "Understand JSX, Props, and state management (useState) by structuring modular component panels.",
    level: "intermediate",
    techStack: "React",
    activeFilePath: "PortfolioGrid.jsx",
    suggestedFileStructure: `react-portfolio/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── PortfolioGrid.jsx  <-- Active
│   └── App.jsx
├── package.json
└── vite.config.js`,
    quiz: {
      question: "In React, how do you enforce state mutations that trigger a component re-render?",
      options: ["Direct assignment (state = newValue)", "Calling the setter function returned by useState Hook", "Calling forceUpdate()", "Mutating document.getElementById directly"],
      answerIndex: 1,
      explanation: "useState state variables must always be updated via the provided setter function to inform React's Virtual DOM of state diff updates."
    },
    fullGuide: `Intermediate development demands modular architecture! React replaces basic DOM queries with a virtual declarative model.

You construct a reusable Portfolio section:
- **JSX**: Unified structure and syntax.
- **Props**: Passing details (e.g., project titles) into nested layout nodes.
- **State Hooks (\`useState\`)**: Registering active tabs, counting likes on projects.

No more vibe coding where you manually select elements and rewrite document nodes—React automates DOM updates depending on dynamic state bindings!`,
    challengeInstruction: "Construct a functional React component named 'PortfolioGrid' that receives a 'projects' prop array, stores a selected category state with useState, and returns filtered elements mapped to HTML tags.",
    files: [
      {
        name: "PortfolioGrid.jsx",
        path: "src/components/PortfolioGrid.jsx",
        initialContent: `import React, { useState } from 'react';

export default function PortfolioGrid({ projects }) {
  const [filter, setFilter] = useState('all');

  // STEP: Filter projects list based on active state criteria
  const filtered = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="portfolio-section">
      {/* ADD: Filter tab buttons here */}
      
      {/* MAP list elements */}
    </div>
  );
}`,
        expectedContentSnippet: `useState`,
        explanation: "Integrates modern declarative UI components, custom reactive variables, and data pipeline mapping.",
        lineExplanations: {
          1: "Imports React Core along with State Management hooks library.",
          3: "Declares functional component receiving destructured React props.",
          4: "Sets reactive filter state default tag value as 'all'."
        }
      }
    ]
  },
  {
    id: "int-next",
    title: "Next.js: Dashboard Routing File Structure basics",
    shortDesc: "Learn file-based route layouts using routing folders (app/layout.tsx, app/page.tsx, app/projects/page.tsx).",
    level: "intermediate",
    techStack: "Next.js",
    activeFilePath: "page.tsx",
    suggestedFileStructure: `nextjs-portfolio/
└── src/
    └── app/
        ├── layout.tsx
        ├── page.tsx            <-- Active (Home)
        └── projects/
            └── page.tsx        <-- Projects Route`,
    quiz: {
      question: "Which file inside a subfolder directory defines a valid static/dynamic web page route inside Next.js 13+ App router?",
      options: ["route.js", "page.tsx", "index.tsx", "main.js"],
      answerIndex: 1,
      explanation: "Under Next.js App Router folders, page.tsx/page.js holds the component exports mapped directly to that URL path segment."
    },
    fullGuide: `Next.js introduces **File-Based Routing** and **Server Components** for faster page rendering speeds.

To understand file structure basics:
- **Folders** represent route paths (e.g., \`app/projects/\` represents \`yourwebsite.com/projects\`).
- **page.tsx** exposes the React view corresponding to the route.
- **layout.tsx** defines shared UI blocks (header, sidebar, footer wrappers) wrapping around child views without losing state values on page changes.

Let's master routing folder structures to construct multi-page Portfolios like a pro backend developer!`,
    challengeInstruction: "Let's edit your app router landing page (app/page.tsx). Set up metadata exports and return a functional dashboard wrapper component highlighting portfolio links.",
    files: [
      {
        name: "page.tsx",
        path: "src/app/page.tsx",
        initialContent: `import Link from 'next/link';

export const metadata = {
  title: 'My Professional Portfolio Hub',
};

export default function HomePage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Welcome to my Digital Hub</h1>
      <p className="mt-2 text-gray-600">Built using modern Next.js File routing components.</p>
      
      <div className="mt-6 flex gap-4">
        {/* ADD NEXT LINK components to /projects, /about */}
        
      </div>
    </main>
  );
}`,
        expectedContentSnippet: `<Link`,
        explanation: "Utilizes Next.js Server Side SEO metadata configurations and Client transition links.",
        lineExplanations: {
          1: "Imports Next Link component for rapid SPA route movements.",
          3: "Explores structural static metadata for immediate SEO crawl validation."
        }
      }
    ]
  },
  {
    id: "int-django",
    title: "Django: Portfolio Backend Routing & JSON API Views",
    shortDesc: "Understand Python server route frameworks, mapping URLs and returning visual JSON response entities.",
    level: "intermediate",
    techStack: "Django",
    activeFilePath: "views.py",
    suggestedFileStructure: `django_portfolio/
├── portfolio/
│   ├── settings.py
│   ├── urls.py
│   └── views.py          <-- Active
├── manage.py
└── db.sqlite3`,
    quiz: {
      question: "Which Django API Class allows sending clean structured data objects in true web JSON response format?",
      options: ["HttpResponse", "JsonResponse", "HTMLResponse", "RenderResponse"],
      answerIndex: 1,
      explanation: "JsonResponse helper class automatically dumps data arrays into standard JSON format with correct Content-Type header registers."
    },
    fullGuide: `Django is an elite Python web frame empowering robust server backends.

To transition from mere client widgets to rich database stacks, backend portfolios need API endpoints. Inside Django:
1. **views.py**: Governs routing requests, querying db inputs, returning payloads.
2. **urls.py**: Matches incoming request paths with python functions located in views.py.

Let's examine how Django parses client headers, formats dynamic dictionary arrays, and maps queries safely.`,
    challengeInstruction: "Write view logic in views.py returning dynamic portfolio project arrays via JsonResponse, implementing clean REST patterns.",
    files: [
      {
        name: "views.py",
        path: "portfolio/views.py",
        initialContent: `from django.http import JsonResponse

def project_api_list(request):
    """
    API endpoint listing our portfolio projects dynamically
    """
    projects_data = [
        {"id": 1, "title": "Dezmils App", "tech": "React"},
        {"id": 2, "title": "Task System", "tech": "Django"},
    ]
    
    # Return response as JsonResponse list
    return JsonResponse({"projects": projects_data})`,
        expectedContentSnippet: `JsonResponse`,
        explanation: "Python Django routing views executing backend controller tasks.",
        lineExplanations: {
          1: "Imports core django HTTP helpers.",
          3: "Defines view controllers processing python web system objects."
        }
      }
    ]
  },

  // --- ADVANCED: MERN, NEXT.JS, ADVANCED DJANGO ---
  {
    id: "adv-mern",
    title: "MERN Stack: Express DB connection & REST Controllers",
    shortDesc: "Map live portfolio counters to MongoDB collections via express server routes and schema queries.",
    level: "advanced",
    techStack: "MERN",
    activeFilePath: "projectController.js",
    suggestedFileStructure: `mern-portfolio-backend/
├── config/
│   └── db.js
├── models/
│   └── Project.js
├── controllers/
│   └── projectController.js <-- Active
├── server.js
└── package.json`,
    quiz: {
      question: "Which Express route middleware method correctly parses incoming POST payloads in JSON format?",
      options: ["express.urlencoded()", "express.json()", "bodyParser.text()", "express.raw()"],
      answerIndex: 1,
      explanation: "express.json() is built-in middleware for parsing raw body string bytes directly into request.body JSON."
    },
    fullGuide: `MERN (MongoDB, Express, React, Node) represents an advanced full-stack JavaScript environment.

Here, you set up an **Express REST Controller** to manage a portfolio database:
- **Mongoose models** define strict document field shapes for MongoDB databases.
- **REST Controller functions** handle asynchronous queries (\`Project.find()\`, \`Project.create()\`) using \`async/await\` blocks to eliminate runtime blocking.

We must use secure try-catch error boundaries instead of cowboy styling where exceptions crash Node endpoints!`,
    challengeInstruction: "Synthesize an asynchronous express handler resolving Project models in ProjectController and serving them to REST client calls.",
    files: [
      {
        name: "projectController.js",
        path: "controllers/projectController.js",
        initialContent: `// Mock mongoose models representing database structures
const ProjectModel = {
  find: async () => [
    { title: "Advanced Portfolio Engine", category: "React/Next" }
  ]
};

exports.getPortfolioHighlights = async (req, res) => {
  try {
    const data = await ProjectModel.find();
    // Return expressive express status response
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};`,
        expectedContentSnippet: `res.status`,
        explanation: "Advanced Node backend controller script mapping databases and API calls safely.",
        lineExplanations: {
          2: "Creates standard schema mock object simulating actual asynchronous MongoDB tables.",
          7: "Declares asynchronous export module managing server API request parameters."
        }
      }
    ]
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    author: {
      name: "Tanya Dev",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      reputation: 345,
      level: "Beginner"
    },
    title: "How to fix broken margins in HTML vertical lists?",
    content: "Hi team! I'm creating my bio card for my portfolio. I added list items, but they are aligning directly against each other, and my custom border is overlapping. Should i use margin or padding and does display inline-block change things?",
    tags: ["HTML", "CSS", "Margins", "Portfolio"],
    upvotes: 12,
    createdAt: "2026-06-03T10:00:00Z",
    answers: [
      {
        id: "ans-1-1",
        author: {
          name: "Dev Master Ezra",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          reputation: 12000,
          level: "Dezmils Mentor"
        },
        content: "Great question! Displaying elements as inline-block ignores vertical margins on parent flex structures sometimes. Use 'display: flex' on your list wrapper, set 'flex-direction: column' and implement the 'gap' property (e.g., gap: 1rem). That provides uniform spacing without margin-collapse issues!",
        upvotes: 24,
        createdAt: "2026-06-03T10:15:00Z",
        isInstructorVerified: true
      },
      {
        id: "ans-1-2",
        author: {
          name: "Django Wizard Luke",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop",
          reputation: 890,
          level: "Django pro"
        },
        content: "If you want them formatted like cards, try setting display: inline-block with margins block-wise. Also make sure box-sizing: border-box is active globally!",
        upvotes: 4,
        createdAt: "2026-06-03T10:30:00Z"
      }
    ]
  },
  {
    id: "post-2",
    author: {
      name: "Sam K.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      reputation: 152,
      level: "Intermediate"
    },
    title: "Why does my React portfolio grid infinite loop when fetching api?",
    content: "I added an API fetch call directly in my Component body and updated state variables. Now the application is making hundreds of requests per second. How do I restrict this from happening?",
    tags: ["React", "API", "useEffect", "Hooks"],
    upvotes: 18,
    createdAt: "2026-06-02T14:22:00Z",
    answers: [
      {
        id: "ans-2-1",
        author: {
          name: "Dev Master Ezra",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          reputation: 12000,
          level: "Dezmils Mentor"
        },
        content: "Ah, classic rookie loop! Placing fetch inside your component body means every state update triggers a re-render, which re-runs components, causing a fresh fetch, triggering a state change, and looping indefinitely. Wrap your async call inside a 'useEffect' hook with an empty dependency array (useEffect(() => { ... }, [])). This ensures it fires exactly once upon mount!",
        upvotes: 38,
        createdAt: "2026-06-02T14:40:00Z",
        isInstructorVerified: true
      }
    ]
  }
];

export const EARNABLE_BADGES: AchievementBadge[] = [
  { name: "First Explorer", description: "Enrolled in Dezmils Software Academy and selected knowledge track.", iconName: "Milestone", xpRequired: 50 },
  { name: "Portfolio Sculptor", description: "Completed an HTML structural challenge with pristine code logic.", iconName: "Sparkles", xpRequired: 150 },
  { name: "CSS Flex Wizard", description: "Passed a CSS layout module challenge.", iconName: "Layout", xpRequired: 300 },
  { name: "State Pilot", description: "Successfully componentized React portfolio dynamics.", iconName: "Cpu", xpRequired: 500 },
  { name: "Server Titan", description: "Routed Django backend API models and handled queries.", iconName: "Server", xpRequired: 800 },
  { name: "Full Stack Overlord", description: "Tapped advanced MERN controllers and handled database models.", iconName: "Crown", xpRequired: 1200 }
];
