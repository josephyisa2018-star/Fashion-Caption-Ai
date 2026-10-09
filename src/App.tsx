import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { GenerateView } from './views/GenerateView';
import { ResultsView } from './views/ResultsView';
import { HistoryView } from './views/HistoryView';
import { EvaluationView } from './views/EvaluationView';
import { DashboardView } from './views/DashboardView';
import { AcademicDocsView } from './views/AcademicDocsView';
import { FashionProduct, BENCHMARK_DATASET } from './data/benchmarkDataset';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'generate' | 'results' | 'history' | 'evaluation' | 'dashboard' | 'docs'>('home');
  const [products, setProducts] = useState<FashionProduct[]>(() => {
    try {
      const saved = localStorage.getItem('fashion_products_dataset');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved products:', e);
    }
    return BENCHMARK_DATASET;
  });

  const [selectedProduct, setSelectedProduct] = useState<FashionProduct>(products[0]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('fashion_products_dataset', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  const handleGenerated = (newProduct: FashionProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedProduct(newProduct);
    setCurrentTab('results');
  };

  const handleSelectProduct = (product: FashionProduct) => {
    setSelectedProduct(product);
    setCurrentTab('results');
  };

  const handleEvaluate = (product: FashionProduct) => {
    setSelectedProduct(product);
    setCurrentTab('evaluation');
  };

  const handleSaveEvaluation = (evaluatedProduct: FashionProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === evaluatedProduct.id ? evaluatedProduct : p))
    );
    setSelectedProduct(evaluatedProduct);
    setCurrentTab('dashboard');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const evaluationCount = products.filter((p) => p.accuracy !== undefined).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab as any)}
        evaluationCount={evaluationCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && <HomeView onNavigate={(tab) => setCurrentTab(tab as any)} />}
        {currentTab === 'generate' && <GenerateView onGenerated={handleGenerated} />}
        {currentTab === 'results' && (
          <ResultsView
            product={selectedProduct}
            onNavigate={(tab) => setCurrentTab(tab as any)}
            onEvaluate={handleEvaluate}
          />
        )}
        {currentTab === 'history' && (
          <HistoryView
            products={products}
            onSelectProduct={handleSelectProduct}
            onEvaluateProduct={handleEvaluate}
            onDeleteProduct={handleDeleteProduct}
            onNavigate={(tab) => setCurrentTab(tab as any)}
          />
        )}
        {currentTab === 'evaluation' && (
          <EvaluationView
            product={selectedProduct}
            onSaveEvaluation={handleSaveEvaluation}
            onNavigate={(tab) => setCurrentTab(tab as any)}
          />
        )}
        {currentTab === 'dashboard' && (
          <DashboardView
            products={products}
            onNavigate={(tab) => setCurrentTab(tab as any)}
          />
        )}
        {currentTab === 'docs' && <AcademicDocsView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            AI-DRIVEN FASHION PRODUCT CAPTIONING AND CONTENT GENERATION USING OPENAI
          </p>
          <p>
            Undergraduate B.Sc. Computer Science Final Year Project &copy; 2026. Aligned with Chapter Three & Four Methodology.
          </p>
        </div>
      </footer>
    </div>
  );
}
