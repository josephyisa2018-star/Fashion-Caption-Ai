import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Database, Cpu, Layout, FileSpreadsheet, Star, BarChart3, Layers } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Undergraduate B.Sc. Computer Science Final Year Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
            AI-Driven Fashion Product Captioning and Content Generation Using OpenAI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            A practical, three-tier e-commerce system that generates concise fashion captions, detailed garment descriptions, and personalized marketing copy with brand voice consistency and strict anti-hallucination guardrails — evaluated through attribute metrics and human ratings.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Caption</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Chapter 4 Results</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span>View History</span>
            </button>
          </div>
        </div>
      </section>

      {/* Four Research Objectives */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Research Framework</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Alignment to Research Objectives</h2>
          <p className="text-sm text-slate-500">Each objective directly corresponds to implemented system modules and Chapter Four results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Objective 1
              </span>
              <h3 className="font-semibold text-slate-900 mt-3 mb-2">Identify System Requirements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identified functional and non-functional requirements for fashion attributes (garment type, fabric, colour, style, occasion, audience) and validated input constraints.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Implemented in Section 5.1 & Table 4.1</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Objective 2
              </span>
              <h3 className="font-semibold text-slate-900 mt-3 mb-2">Consistent Brand Voice Captioning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engineered OpenAI multimodal prompts enforcing specific tones (Luxury, Elegant, Professional, Casual) without hallucinating unverified features.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Implemented in Section 5.2 & 5.3</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Objective 3
              </span>
              <h3 className="font-semibold text-slate-900 mt-3 mb-2">Personalized Description & Marketing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generated long-form technical product descriptions and marketing hooks personalized for target demographic and occasion context.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Implemented in Section 5.4 & Output Separation</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Objective 4
              </span>
              <h3 className="font-semibold text-slate-900 mt-3 mb-2">System Testing & Evaluation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empirically evaluated generated captions against human references via TP, FP, FN, Accuracy, Precision, Recall, F1-score, and Likert ratings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Implemented in Section 8-10 & Chapter 4 Dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture (Chapter 3 Methodology) */}
      <section className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">System Architecture</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Three-Tier Methodology Architecture</h2>
          <p className="text-sm text-slate-500">Flow of user input, multimodal prompt engineering, latency timing, and relational persistence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. Presentation Tier</h4>
                <span className="text-[11px] text-slate-500">Frontend UI</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Responsive forms for garment attributes, image upload/preview, output display cards, copy-to-clipboard actions, and evaluation sliders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. Application Tier</h4>
                <span className="text-[11px] text-slate-500">Flask / Express Backend</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Input validation, secure file handling, structured prompt synthesis with anti-hallucination guardrails, and start/end latency timing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. Data Tier</h4>
                <span className="text-[11px] text-slate-500">MySQL Database</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Stores relational tables: <code className="text-indigo-600">users</code>, <code className="text-indigo-600">products</code>, <code className="text-indigo-600">captions</code>, and <code className="text-indigo-600">evaluations</code> with cascade constraints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. AI Intelligence</h4>
                <span className="text-[11px] text-slate-500">OpenAI Multimodal API</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Consumes image and structured attributes to generate 3 discrete outputs (Caption, Description, Marketing) in strict JSON format.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Defense Scope Notice */}
      <section className="p-6 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Academic Scope & Defense Guidance (B.Sc. Level)</span>
        </div>
        <p>
          As per undergraduate curriculum guidelines, this system deliberately avoids unnecessary model training (CNN, LSTM, or Transformer fine-tuning) and instead demonstrates practical enterprise integration of modern Large Language Model APIs (OpenAI) into an end-to-end e-commerce software architecture. All metrics are calculated dynamically from actual ground-truth evaluations without hardcoded fabrication.
        </p>
      </section>
    </div>
  );
};
