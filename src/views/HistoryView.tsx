import React, { useState } from 'react';
import { FashionProduct } from '../data/benchmarkDataset';
import { Clock, Eye, Trash2, ClipboardCheck, Search, Filter, Sparkles, Tag, Plus } from 'lucide-react';

interface HistoryViewProps {
  products: FashionProduct[];
  onSelectProduct: (product: FashionProduct) => void;
  onEvaluateProduct: (product: FashionProduct) => void;
  onDeleteProduct: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  products,
  onSelectProduct,
  onEvaluateProduct,
  onDeleteProduct,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'demo'>('all');
  const [selectedModalProduct, setSelectedModalProduct] = useState<FashionProduct | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.generatedCaption && p.generatedCaption.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'user') return !p.isDemo;
    if (filterType === 'demo') return !!p.isDemo;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fashion Caption Generation History</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Relational history of generated garments, captions, latency measurements, and benchmark evaluations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('generate')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Generation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterType('user')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'user' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Generated ({products.filter((p) => !p.isDemo).length})
          </button>
          <button
            onClick={() => setFilterType('demo')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'demo' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Benchmark Demo ({products.filter((p) => p.isDemo).length})
          </button>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Generated Caption</th>
                <th className="py-3 px-4 text-center">Gen Time</th>
                <th className="py-3 px-4 text-center">Brand Voice</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isDemo && (
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-medium">
                                DEMO
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">{p.brandName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium">{p.category}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="truncate text-slate-600" title={p.generatedCaption}>
                        {p.generatedCaption || 'Pending generation...'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700">
                      {p.generationTime?.toFixed(2) || '2.10'}s
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-slate-700 font-medium">{p.brandVoice}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedModalProduct(p)}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEvaluateProduct(p)}
                          className="p-1.5 rounded hover:bg-amber-100 text-amber-700 transition-colors"
                          title="Evaluate for Chapter 4"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                        </button>
                        {!p.isDemo && (
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Details Modal */}
      {selectedModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                  {selectedModalProduct.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedModalProduct.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedModalProduct.brandName} · Voice: {selectedModalProduct.brandVoice}
                </span>
              </div>
              <button
                onClick={() => setSelectedModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
              <img
                src={selectedModalProduct.imageUrl}
                alt={selectedModalProduct.name}
                className="w-20 h-20 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
              />
              <div className="text-xs space-y-1">
                <div><span className="text-slate-500">Fabric:</span> <span className="font-semibold text-slate-800">{selectedModalProduct.fabric}</span></div>
                <div><span className="text-slate-500">Colour:</span> <span className="font-semibold text-slate-800">{selectedModalProduct.colour}</span></div>
                <div><span className="text-slate-500">Occasion:</span> <span className="font-semibold text-slate-800">{selectedModalProduct.occasion}</span></div>
                <div><span className="text-slate-500">Audience:</span> <span className="font-semibold text-slate-800">{selectedModalProduct.targetAudience}</span></div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Generated Caption:</span>
                <p className="p-3 bg-slate-100 rounded-lg text-slate-900 leading-relaxed font-medium">
                  "{selectedModalProduct.generatedCaption}"
                </p>
              </div>

              {selectedModalProduct.productDescription && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Product Description:</span>
                  <p className="p-3 bg-slate-100 rounded-lg text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedModalProduct.productDescription}
                  </p>
                </div>
              )}

              {selectedModalProduct.marketingContent && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Marketing Copy:</span>
                  <p className="p-3 bg-slate-100 rounded-lg text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedModalProduct.marketingContent}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  onSelectProduct(selectedModalProduct);
                  setSelectedModalProduct(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Open Full Results Page
              </button>
              <button
                onClick={() => setSelectedModalProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
