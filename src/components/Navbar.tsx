import React from 'react';
import { Sparkles, History, BarChart3, PlusCircle, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  evaluationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, evaluationCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                FashionCaption AI
              </span>
              <span className="text-[11px] text-slate-500 font-medium block leading-tight">
                B.Sc. Final Project · OpenAI
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'home'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('generate')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'generate'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Generate Caption
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'history'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setCurrentTab('evaluation')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'evaluation'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Evaluation</span>
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Chapter 4 Results</span>
            </button>
            <button
              onClick={() => setCurrentTab('docs')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'docs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Python & Code</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('generate')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
