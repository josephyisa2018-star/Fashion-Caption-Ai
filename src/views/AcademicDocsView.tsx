import React, { useState } from 'react';
import { BookOpen, Code2, Database, Terminal, FileCode, CheckCircle2, Copy, Check, Download } from 'lucide-react';

export const AcademicDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'methodology' | 'schema' | 'python' | 'defense'>('methodology');
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  const codeSnippets: Record<string, string> = {
    'app.py': `"""
AI-Driven Fashion Product Captioning and Content Generation Using OpenAI
Undergraduate B.Sc. Computer Science Final Year Project
Main Application Entry Point
"""
import os
from flask import Flask
from config import Config
from database.db import init_db
from routes.main import main_bp
from routes.products import products_bp
from routes.evaluation import evaluation_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    
    try:
        init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Database initialization notice: {e}")
        
    app.register_blueprint(main_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(evaluation_bp)
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)`,

    'services/openai_service.py': `"""
OpenAI Integration Service for Fashion Product Captioning
Undergraduate B.Sc. Project
"""
import time, os, json, base64
from config import Config

def construct_structured_prompt(product_data: dict) -> str:
    return f"""You are an expert e-commerce fashion copywriter and catalog content generator.

PRODUCT DETAILS PROVIDED BY USER:
- Product Name: {product_data.get('product_name')}
- Category: {product_data.get('category')}
- Primary Colour: {product_data.get('colour')}
- Fabric / Material: {product_data.get('fabric')}
- Silhouette / Style: {product_data.get('style')}
- Occasion: {product_data.get('occasion')}
- Target Audience: {product_data.get('target_audience')}
- Brand Name: {product_data.get('brand_name')}
- Desired Brand Voice / Tone: {product_data.get('brand_voice')}
- Essential Keywords: {product_data.get('keywords')}

STRICT ACADEMIC ANTI-HALLUCINATION GUARDRAILS:
1. Describe ONLY visible or user-provided characteristics.
2. Do NOT claim a fabric, colour, feature, size, brand, or functionality unless it is explicitly provided by the user or reasonably visible in the image.
3. Align the tone strictly to the specified brand voice: {product_data.get('brand_voice')}.
4. Personalize the marketing narrative specifically for the target audience: {product_data.get('target_audience')} and occasion: {product_data.get('occasion')}.

TASK: Generate three distinct, separated outputs in valid JSON format:
{{
  "caption": "A concise, elegant product caption (1-2 sentences, max 30-40 words).",
  "description": "A comprehensive product description (2-3 paragraphs) detailing cut, fabric, versatility.",
  "marketing_content": "Compelling promotional marketing copy with audience hook and 3-5 hashtags."
}}"""

def generate_fashion_content(product_data: dict, image_path: str = None) -> dict:
    api_key = Config.OPENAI_API_KEY
    start_time = time.time()
    
    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    prompt = construct_structured_prompt(product_data)
    
    response = client.chat.completions.create(
        model=Config.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "You are a professional fashion catalog system. You output strictly valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    
    end_time = time.time()
    generation_time = round(end_time - start_time, 2)
    parsed = json.loads(response.choices[0].message.content)
    
    return {
        "success": True,
        "caption": parsed.get("caption", "").strip(),
        "description": parsed.get("description", "").strip(),
        "marketing_content": parsed.get("marketing_content", "").strip(),
        "generation_time": generation_time
    }`,

    'database/db.py': `"""
MySQL Database Connection Layer
"""
import mysql.connector
from config import Config

def get_db_connection():
    conn = mysql.connector.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        port=Config.DB_PORT
    )
    return conn, "mysql"`,

    'sql/schema.sql': `-- Database: fashion_caption_db
CREATE DATABASE IF NOT EXISTS fashion_caption_db;
USE fashion_caption_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    colour VARCHAR(80) NOT NULL,
    fabric VARCHAR(100) NOT NULL,
    style VARCHAR(100) NOT NULL,
    occasion VARCHAR(100) NOT NULL,
    target_audience VARCHAR(120) NOT NULL,
    brand_name VARCHAR(120) NOT NULL,
    brand_voice VARCHAR(80) NOT NULL,
    keywords TEXT,
    additional_information TEXT,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS captions (
    caption_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    caption_text TEXT NOT NULL,
    product_description TEXT NOT NULL,
    marketing_content TEXT NOT NULL,
    generation_time DECIMAL(6, 2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
    caption_id INT NOT NULL,
    reference_caption TEXT NOT NULL,
    true_positive INT NOT NULL DEFAULT 0,
    false_positive INT NOT NULL DEFAULT 0,
    false_negative INT NOT NULL DEFAULT 0,
    accuracy DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    precision_score DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    recall_score DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    f1_score DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    human_rating INT NOT NULL DEFAULT 4,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caption_id) REFERENCES captions(caption_id) ON DELETE CASCADE
);`,

    'requirements.txt': `Flask>=3.0.0
openai>=1.40.0
mysql-connector-python>=8.3.0
python-dotenv>=1.0.1
Werkzeug>=3.0.3
requests>=2.31.0`,

    '.env.example': `OPENAI_API_KEY=your_openai_api_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fashion_caption_db
DB_PORT=3306
FLASK_SECRET_KEY=bsc_secret_key_2026`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Academic Documentation & Source Code
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
          Methodology & Python Flask Implementation
        </h1>
        <p className="text-sm text-slate-500">
          Inspect the complete Python codebase, MySQL schema, and methodology reference for project defense.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('methodology')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'methodology'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Chapter 3 Methodology
        </button>
        <button
          onClick={() => setActiveTab('python')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'python'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Python Flask Codebase
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'schema'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          MySQL Schema & Queries
        </button>
        <button
          onClick={() => setActiveTab('defense')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'defense'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Chapter 4 Defense Q&A Guide
        </button>
      </div>

      {/* Tab 1: Chapter 3 Methodology */}
      {activeTab === 'methodology' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Chapter Three: Research Methodology & System Design</h2>
            <p className="text-xs text-slate-500 mt-1">
              Design specifications for multimodal prompt synthesis, latency profiling, and attribute metric extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3.1 System Requirements Analysis</h3>
              <p>
                <strong>Functional Requirements:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Input validation for garment attributes (fabric, colour, category, style, occasion, audience).</li>
                <li>Secure file upload for image formats (JPG, PNG, WEBP) under 16MB.</li>
                <li>Structured prompt synthesis enforcing strict anti-hallucination guardrails.</li>
                <li>Three discrete outputs generated: Caption, Description, Marketing.</li>
                <li>Persistent relational storage in MySQL (<code className="text-indigo-600">fashion_caption_db</code>).</li>
                <li>Attribute-based confusion matrix calculation (TP, FP, FN, Accuracy, Precision, Recall, F1).</li>
                <li>Human Likert scale scoring (1–5) across five distinct quality criteria.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3.2 Prompt Engineering Strategy</h3>
              <p>
                Prompt design is the primary mechanism ensuring brand voice adherence and preventing hallucinated features:
              </p>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px]">
                "Describe ONLY visible or user-provided characteristics. Do NOT claim a fabric, colour, feature, size, brand, or functionality unless it is provided by the user or reasonably visible in the image."
              </div>
              <p className="text-slate-500">
                This rule forces zero unsupported claims, driving down False Positives (FP) and maintaining high precision.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Python Codebase Viewer */}
      {activeTab === 'python' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {Object.keys(codeSnippets).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`text-xs px-2.5 py-1 rounded font-mono transition-colors whitespace-nowrap ${
                    selectedFile === filename
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filename}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors self-end sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File Content</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 overflow-x-auto border border-slate-800">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{codeSnippets[selectedFile]}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: MySQL Schema */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Relational Schema (<code className="text-indigo-600 font-mono">fashion_caption_db</code>)</h2>
            <p className="text-xs text-slate-500 mt-1">
              Normalized entity-relationship structure designed with 1:M relationships and cascade constraints.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 overflow-x-auto border border-slate-800">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{codeSnippets['sql/schema.sql']}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Chapter 4 Defense Q&A Guide */}
      {activeTab === 'defense' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Defense Preparation: Common Examiner Questions & Answers</h2>
            <p className="text-xs text-slate-500 mt-1">
              Standard B.Sc. Computer Science project defense inquiries regarding OpenAI integration and evaluation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">
                Q1: Why did you use the OpenAI API instead of training a custom CNN-LSTM model?
              </h3>
              <p className="text-slate-600">
                <strong>Answer:</strong> Traditional CNN-LSTM models trained on general datasets (like MS-COCO or Flickr8k) lack specialized fashion vocabulary (e.g. "Ankara flared midi dress", "500 GSM French terry", "bias-cut cowl neck") and require tens of thousands of manually annotated images. Large multimodal language models like OpenAI are pre-trained on diverse web-scale visual data and can perform zero-shot and few-shot catalog copywriting with personalized tone in seconds, which is far more practical and accurate for modern e-commerce deployment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">
                Q2: How is attribute-based evaluation different from BLEU/ROUGE or standard classification?
              </h3>
              <p className="text-slate-600">
                <strong>Answer:</strong> BLEU and ROUGE evaluate n-gram word overlap, which heavily penalizes creative copywriting synonyms (e.g. "vibrant azure" vs "bright blue"). Standard binary classification formulas cannot be blindly applied to full sentences. Therefore, we extracted critical fashion attributes (product type, colour, fabric, style, occasion, audience) and evaluated them as True Positives (correctly generated), False Positives (hallucinated), and False Negatives (missed from reference), yielding meaningful Accuracy, Precision, Recall, and F1 scores.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">
                Q3: How do you prevent division by zero in the metric calculation?
              </h3>
              <p className="text-slate-600">
                <strong>Answer:</strong> In <code className="text-indigo-600">routes/evaluation.py</code> and client components, guards check if the denominator <code className="text-indigo-600">(TP + FP)</code> or <code className="text-indigo-600">(TP + FN)</code> is greater than zero before performing division. If zero, the function returns <code className="text-indigo-600">0.0%</code> safely rather than raising an unhandled ZeroDivisionError exception.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
