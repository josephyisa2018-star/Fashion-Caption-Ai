import React, { useState } from 'react';
import { FashionProduct } from '../data/benchmarkDataset';
import { ClipboardCheck, ArrowLeft, CheckCircle2, ShieldCheck, Star, Sparkles, AlertCircle } from 'lucide-react';

interface EvaluationViewProps {
  product: FashionProduct;
  onSaveEvaluation: (evaluatedProduct: FashionProduct) => void;
  onNavigate: (tab: string) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({ product, onSaveEvaluation, onNavigate }) => {
  const [referenceCaption, setReferenceCaption] = useState(
    product.referenceCaption ||
    `${product.brandName} ${product.colour} ${product.fabric} ${product.name.toLowerCase()} styled for ${product.occasion.toLowerCase()}.`
  );

  const [tp, setTp] = useState(product.tp !== undefined ? product.tp : 5);
  const [fp, setFp] = useState(product.fp !== undefined ? product.fp : 1);
  const [fn, setFn] = useState(product.fn !== undefined ? product.fn : 1);

  // 5 Likert criteria (1 to 5)
  const [relevance, setRelevance] = useState(4);
  const [clarity, setClarity] = useState(4);
  const [quality, setQuality] = useState(5);
  const [brandVoiceRating, setBrandVoiceRating] = useState(5);
  const [overall, setOverall] = useState(4);

  // Compute metrics dynamically with safe 0-division handling
  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) * 100 : 0.0;
  const recall = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 0.0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0.0;
  const accuracy = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 0.0;
  const humanMeanRating = Math.round(((relevance + clarity + quality + brandVoiceRating + overall) / 5) * 10) / 10;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FashionProduct = {
      ...product,
      referenceCaption,
      tp,
      fp,
      fn,
      accuracy: Math.round(accuracy * 100) / 100,
      precision: Math.round(precision * 100) / 100,
      recall: Math.round(recall * 100) / 100,
      f1: Math.round(f1 * 100) / 100,
      humanRating: Math.round(humanMeanRating)
    };
    onSaveEvaluation(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => onNavigate('results')}
            className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Product
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Caption Performance Evaluation</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Chapter 4 Methodology
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium"
        >
          View Dashboard
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Step 1: Caption Comparison Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700">
              1. Ground-Truth vs AI Generated Caption
            </h2>
            <span className="text-xs text-slate-500 font-medium">{product.name} ({product.brandName})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                AI Generated Caption Under Test
              </span>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                "{product.generatedCaption || 'No caption available'}"
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                Voice: <strong className="text-indigo-600">{product.brandVoice}</strong> · Latency: <strong className="font-mono">{product.generationTime?.toFixed(2)}s</strong>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Human Reference / Ground-Truth Caption <span className="text-red-500">*</span>
              </label>
              <textarea
                value={referenceCaption}
                onChange={(e) => setReferenceCaption(e.target.value)}
                rows={4}
                required
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                placeholder="Enter reference ground-truth description containing expected fashion attributes..."
              />
              <span className="text-[11px] text-slate-400 block">
                Benchmark sentence containing the verified attributes (colour, fabric, garment type, style, occasion).
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Attribute-Based Confusion Matrix Entry */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700">
              2. Attribute-Based Fashion Evaluation (TP / FP / FN)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Important: This project evaluates important fashion attributes (product type, colour, fabric, style, occasion), NOT binary classification of entire sentences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* TP */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  True Positive (TP)
                </label>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Correct</span>
              </div>
              <input
                type="number"
                min="0"
                max="25"
                value={tp}
                onChange={(e) => setTp(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xl font-bold font-mono text-emerald-900 rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                Attributes correctly identified in caption (e.g., "{product.colour}", "{product.fabric}", "{product.category}").
              </p>
            </div>

            {/* FP */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  False Positive (FP)
                </label>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">Incorrect</span>
              </div>
              <input
                type="number"
                min="0"
                max="25"
                value={fp}
                onChange={(e) => setFp(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xl font-bold font-mono text-rose-900 rounded-lg border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] text-rose-800/80 leading-relaxed">
                Attributes hallucinated, unsupported, or incorrect in the AI generated output.
              </p>
            </div>

            {/* FN */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  False Negative (FN)
                </label>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Missed</span>
              </div>
              <input
                type="number"
                min="0"
                max="25"
                value={fn}
                onChange={(e) => setFn(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xl font-bold font-mono text-amber-900 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-amber-800/80 leading-relaxed">
                Important attributes present in reference caption that AI failed to include.
              </p>
            </div>
          </div>

          {/* Real-Time Formula Feedback */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
              Calculated Academic Performance Metrics (Dynamic Real-Time)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Accuracy</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-white">
                  {accuracy.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500 block">TP / (TP + FN)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Precision</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                  {precision.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500 block">TP / (TP + FP)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Recall</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-cyan-400">
                  {recall.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500 block">TP / (TP + FN)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-[11px] text-slate-400 block">F1-Score</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                  {f1.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500 block">2×(P×R)/(P+R)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Human Evaluation 1–5 Likert Scale */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700">
                3. Human Evaluation (1–5 Likert Scale)
              </h2>
              <span className="text-xs text-slate-500">
                Five academic criteria: 1 = Very Poor, 2 = Poor, 3 = Fair, 4 = Good, 5 = Excellent
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Mean Score</span>
              <span className="text-lg font-bold text-indigo-600 font-mono">{humanMeanRating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>1. Relevance</span>
                <span className="text-indigo-600 font-bold">{relevance} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={relevance}
                onChange={(e) => setRelevance(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">
                How accurately does the caption represent the garment?
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>2. Clarity</span>
                <span className="text-indigo-600 font-bold">{clarity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={clarity}
                onChange={(e) => setClarity(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">
                Is the grammar natural, concise, and easy to read?
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>3. Fashion Description Quality</span>
                <span className="text-indigo-600 font-bold">{quality} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">
                Appropriate use of fashion and tailoring terminology.
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>4. Brand Voice Consistency</span>
                <span className="text-indigo-600 font-bold">{brandVoiceRating} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={brandVoiceRating}
                onChange={(e) => setBrandVoiceRating(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">
                Adherence to the selected tone: <strong>{product.brandVoice}</strong>.
              </span>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>5. Overall Production Quality</span>
                <span className="text-indigo-600 font-bold">{overall} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={overall}
                onChange={(e) => setOverall(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">
                Ready for live e-commerce deployment without editorial revision.
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Save Evaluation & Update Chapter Four Dataset</span>
          </button>
        </div>
      </form>
    </div>
  );
};
