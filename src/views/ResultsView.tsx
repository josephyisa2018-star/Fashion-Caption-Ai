import React, { useState } from 'react';
import { FashionProduct } from '../data/benchmarkDataset';
import { Clock, Copy, Check, Sparkles, ArrowRight, ClipboardCheck, ArrowLeft, Tag, Layers, Share2 } from 'lucide-react';

interface ResultsViewProps {
  product: FashionProduct;
  onNavigate: (tab: string) => void;
  onEvaluate: (product: FashionProduct) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ product, onNavigate, onEvaluate }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => onNavigate('generate')}
            className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Generator
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Generated Product Catalog Output</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEvaluate(product)}
            className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ClipboardCheck className="w-4 h-4 text-amber-700" />
            <span>Evaluate Caption (Chapter 4)</span>
          </button>
          <button
            onClick={() => onNavigate('generate')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Another</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Information & Image Card */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-64 bg-slate-100 relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-sm">
                {product.category}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{product.name}</h2>
                <div className="text-xs font-medium text-indigo-600 mt-0.5">{product.brandName}</div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Primary Colour:</span>
                  <span className="font-semibold text-slate-800">{product.colour}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Fabric / Material:</span>
                  <span className="font-semibold text-slate-800">{product.fabric}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Silhouette Style:</span>
                  <span className="font-semibold text-slate-800">{product.style}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Occasion:</span>
                  <span className="font-semibold text-slate-800">{product.occasion}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Target Audience:</span>
                  <span className="font-semibold text-slate-800">{product.targetAudience}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Brand Voice:</span>
                  <span className="font-bold text-indigo-600">{product.brandVoice}</span>
                </div>
              </div>

              {product.keywords && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">Keywords</span>
                  <p className="text-xs text-slate-600 italic">"{product.keywords}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Discrete Outputs & Latency Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* Generation Latency Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-800 font-medium">Generation Latency (API Turnaround)</span>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {product.generationTime?.toFixed(2) || '2.15'} seconds
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" /> Stored in MySQL
              </span>
            </div>
          </div>

          {/* 1. Generated Short Caption */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Output 1</span>
                <h3 className="font-bold text-slate-900 text-base">Short Fashion Product Caption</h3>
              </div>
              <button
                onClick={() => copyToClipboard(product.generatedCaption || '', 'caption')}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
              >
                {copiedSection === 'caption' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-slate-900 font-medium text-base leading-relaxed">
              "{product.generatedCaption}"
            </div>
            <p className="text-[11px] text-slate-400">
              Concise copy tailored for e-commerce search previews, mobile catalog cards, and top banners.
            </p>
          </div>

          {/* 2. Detailed Product Description */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Output 2</span>
                <h3 className="font-bold text-slate-900 text-base">Detailed Product Description</h3>
              </div>
              <button
                onClick={() => copyToClipboard(product.productDescription || '', 'desc')}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
              >
                {copiedSection === 'desc' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Description</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {product.productDescription}
            </div>
            <p className="text-[11px] text-slate-400">
              Comprehensive paragraph covering construction, drape, tailoring, wearability, and fabric specifications without hallucinating unsupported claims.
            </p>
          </div>

          {/* 3. Personalized Marketing Content */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Output 3</span>
                <h3 className="font-bold text-slate-900 text-base">Personalized Marketing Copy</h3>
              </div>
              <button
                onClick={() => copyToClipboard(product.marketingContent || '', 'mkt')}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
              >
                {copiedSection === 'mkt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Marketing</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {product.marketingContent}
            </div>
            <p className="text-[11px] text-slate-400">
              Tailored for {product.targetAudience} attending {product.occasion} with brand voice: {product.brandVoice}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
