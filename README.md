# AI-DRIVEN FASHION PRODUCT CAPTIONING AND CONTENT GENERATION USING OPENAI

**Undergraduate B.Sc. Computer Science Final Year Project**  
**Aligned with Chapter Three Methodology and Chapter Four Performance Evaluation**

---

## 1. Project Title & Overview

**Title:** AI-DRIVEN FASHION PRODUCT CAPTIONING AND CONTENT GENERATION USING OPENAI  

This project implements an end-to-end web-based e-commerce content generation and evaluation system. It uses OpenAI's multimodal language model to convert fashion product attributes and garment images into:
1. **Concise Fashion Product Captions** (suitable for mobile cards and catalog headers)
2. **Detailed Garment Descriptions** (2–3 paragraphs on cut, fabric drape, construction, and versatility)
3. **Personalized Marketing Content** (social media hooks, occasion styling tips, and hashtags tailored for specific audiences)

The system enforces strict **anti-hallucination guardrails** (describing only visible or user-provided characteristics) and measures exact **generation latency**. It includes an empirical **attribute-based confusion matrix evaluation module** (True Positives, False Positives, False Negatives) and **human quality rating** (1–5 Likert scale) to provide complete empirical data for **Chapter Four** of an undergraduate dissertation.

---

## 2. Research Objectives & System Mapping

| Objective | Description | Implementation Evidence in Codebase |
| :--- | :--- | :--- |
| **Objective 1** | **Identify system requirements** for fashion product captioning. | Formalized in `sql/schema.sql`, input validation in `routes/products.py`, and Table 4.1 Functional Test Cases (TC01–TC08). |
| **Objective 2** | **Design and develop AI captioning** with consistent brand voice. | Implemented in `services/openai_service.py` with brand voice options (Professional, Elegant, Luxury, Casual, Modern, Minimalist) and anti-hallucination prompt constraints. |
| **Objective 3** | **Implement personalized descriptions & marketing copy**. | Dynamic prompt synthesis using target audience, occasion context, and keywords; separate discrete generation of descriptions and marketing hooks. |
| **Objective 4** | **Test and evaluate system performance**. | Attribute confusion matrix evaluation in `routes/evaluation.py` (Accuracy, Precision, Recall, F1-score), 5-criteria human Likert rating, latency profiling, and Chapter Four CSV Export. |

---

## 3. Technology Stack

### Backend
- **Python 3.10+**
- **Flask 3.x** (RESTful routing, Jinja2 template rendering, blueprints)
- **OpenAI Python SDK** (`openai>=1.40.0`)
- **mysql-connector-python** (parameterized MySQL database access)
- **python-dotenv** (environment secret isolation)
- **Werkzeug** (secure file upload handling)

### Database
- **MySQL 8.x** (`fashion_caption_db` with `users`, `products`, `captions`, and `evaluations` tables)
- Local SQLite fallback included for portable defense demonstrations on laptops without active MySQL daemons.

### Frontend
- **HTML5, CSS3, JavaScript**
- **Bootstrap 5 & Tailwind CSS** (clean, responsive e-commerce layout)
- **Chart.js** (dynamic performance metrics and latency visualization)
- **Bootstrap Icons & Lucide Icons**

---

## 4. System Architecture

The application adopts a clean, decoupled **Three-Tier Architecture**:

```
+--------------------------------------------------------------+
|                    PRESENTATION TIER                         |
|     HTML5 / CSS3 / JavaScript / Bootstrap 5 / React UI       |
|  - Garment Attribute Input Form                              |
|  - Image Upload & Live Preview                               |
|  - Output Cards (Caption, Description, Marketing)            |
|  - Real-Time Attribute Metric Sliders & Likert Scoring       |
+------------------------------+-------------------------------+
                               |  HTTP POST / GET
                               v
+--------------------------------------------------------------+
|                    APPLICATION TIER                          |
|             Flask Backend (or Node/Express Proxy)            |
|  - Input Validation & File Type Verification                 |
|  - Latency Stopwatch (start_time -> end_time)                |
|  - Structured Prompt Synthesis with Guardrails               |
|  - Metric Calculations (Accuracy, Precision, Recall, F1)     |
+---------------+------------------------------+---------------+
                |                              |
                v                              v
+-------------------------------+  +---------------------------+
|          DATA TIER            |  |         AI TIER           |
|            MySQL              |  |        OpenAI API         |
|      fashion_caption_db       |  |       (gpt-4o-mini)       |
| - users                       |  | - Multimodal reasoning    |
| - products                    |  | - Strict JSON completion  |
| - captions                    |  | - Zero unsupported claims |
| - evaluations                 |  +---------------------------+
+-------------------------------+
```

---

## 5. Database Setup (MySQL)

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal):
```bash
mysql -u root -p
```

2. Execute the schema script provided in `sql/schema.sql`:
```sql
CREATE DATABASE IF NOT EXISTS fashion_caption_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fashion_caption_db;
SOURCE sql/schema.sql;
```

3. Table structure summary:
   - `users`: User authentication credentials.
   - `products`: Product metadata, attributes, brand voice, and image file paths.
   - `captions`: Generated caption, description, marketing content, and generation time (s).
   - `evaluations`: Ground-truth reference caption, TP, FP, FN, Accuracy %, Precision %, Recall %, F1-score %, and human rating (1–5).

---

## 6. Installation & Execution Guide

### Prerequisites
- Python 3.10 or higher
- Git
- MySQL Server (optional; system falls back gracefully to SQLite if offline)

### Step 1: Clone Repository & Create Virtual Environment
```bash
git clone <repository_url>
cd fashion_captioning

python3 -m venv venv
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your API key and database credentials:
```env
OPENAI_API_KEY=sk-proj-yourActualKeyHere
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fashion_caption_db
DB_PORT=3306
FLASK_SECRET_KEY=fashion_caption_bsc_secret_2026
```

### Step 4: Run Flask Application
```bash
python app.py
```
Open your browser and navigate to: `http://localhost:5000`

---

## 7. How to Generate Captions & Content

1. Open **Generate** from the navigation bar.
2. Either click **Demo Presets** (e.g. *African Print*, *Silk Gown*, *Linen Blazer*, *Streetwear*) or enter your own product information:
   - **Product Name:** Classic African Print Dress
   - **Category:** Women's Dress
   - **Colour:** Blue and Gold
   - **Fabric:** Ankara Cotton
   - **Silhouette / Style:** Elegant Flared Midi
   - **Occasion:** Wedding
   - **Target Audience:** Young Women
   - **Brand Name:** Pheebemi Fashion
   - **Brand Voice:** Elegant
   - **Keywords:** African print, stylish, wedding
3. Upload an image file (JPG, PNG, or WEBP).
4. Click **Generate Caption & Content with OpenAI**.
5. The system measures execution latency and displays the 3 discrete outputs on the Results screen.

---

## 8. How Performance Metrics are Calculated

Unlike binary classification on entire text paragraphs, this system evaluates **discrete garment attributes**:
- **True Positive (TP):** An attribute correctly generated by AI matching the ground truth.
- **False Positive (FP):** An attribute generated by AI that is incorrect or unsupported by the image/input (hallucination).
- **False Negative (FN):** An important attribute in the ground-truth reference that the AI missed.

### Formulas:
$$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}} \times 100$$

$$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}} \times 100$$

$$\text{F1-score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

$$\text{Accuracy} = \frac{\text{TP}}{\text{Total Reference Attributes } (\text{TP} + \text{FN})} \times 100$$

*Division-by-zero protection:* If any denominator equals zero, the function returns `0.00%` rather than throwing an exception.

### Human Likert Evaluation (1–5 Scale):
1. **Relevance** (1–5)
2. **Clarity** (1–5)
3. **Fashion Description Quality** (1–5)
4. **Brand Voice Consistency** (1–5)
5. **Overall Production Quality** (1–5)

$$\text{Mean Human Rating} = \frac{\sum \text{Ratings}}{\text{Number of Evaluations}}$$

---

## 9. Chapter Four Results & CSV Export

1. Navigate to **Chapter 4 Results** in the top navigation bar.
2. Review:
   - **KPI Summary Cards:** Total Products Tested, Avg Accuracy, Avg Precision, Avg Recall, Avg F1-Score, Mean Human Rating, and Avg Latency.
   - **Table 4.1:** Functional Verification Test Results (TC01–TC08).
   - **Table 4.2:** Individual Caption Evaluation Results.
   - **Table 4.3:** Performance Metrics Breakdown.
   - **Table 4.4:** Generation Latency Distribution.
   - **Table 4.5:** Human Evaluation Results.
   - **Table 4.6:** Overall System Summary.
3. Click **Export Evaluation CSV** to download `fashion_caption_evaluation_results.csv` containing all 13 empirical columns for immediate insertion into your thesis document.

---

## 10. Test Cases (Table 4.1)

| Test ID | Test Case | Input | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC01** | Garment Image Upload | Valid JPG file (&lt;16MB) | Image validated, uploaded to static/uploads | File accepted and displayed | **Pass** |
| **TC02** | Invalid File Rejection | PDF file | Upload blocked; error flashed | Rejected with validation message | **Pass** |
| **TC03** | AI Caption Generation | Valid product attributes | 1-2 sentence caption generated | Accurate caption returned | **Pass** |
| **TC04** | Brand Voice Adherence | Brand Voice: Luxury | Opulent, elevated tone | Luxury tone applied without hallucinations | **Pass** |
| **TC05** | Audience Personalization | Audience: Young Professionals | Targeted corporate marketing copy | Relevant corporate hook produced | **Pass** |
| **TC06** | MySQL Persistence | Generated record | Stored with foreign key linkage | Inserted into products & captions | **Pass** |
| **TC07** | Metric Calculation | TP=6, FP=0, FN=1 | Acc=85.71%, F1=92.31% | Correct metric output | **Pass** |
| **TC08** | CSV Data Export | Export button trigger | 13-column CSV downloaded | Valid CSV generated | **Pass** |

---

## 11. Troubleshooting

- **Issue:** `ModuleNotFoundError: No module named 'openai'`  
  **Fix:** Run `pip install -r requirements.txt` inside your activated virtual environment.
- **Issue:** `MySQL Connection Refused (Can't connect to MySQL server on 'localhost')`  
  **Fix:** Ensure your MySQL service is running (`sudo systemctl start mysql`). If running without MySQL, the application automatically uses `fashion_caption_local.db` (SQLite) without breaking.
- **Issue:** `OpenAI AuthenticationError (Incorrect API key)`  
  **Fix:** Check `.env` and verify that `OPENAI_API_KEY` is set to an active OpenAI API key.
