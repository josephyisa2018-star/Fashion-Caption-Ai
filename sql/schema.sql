-- ====================================================================
-- AI-DRIVEN FASHION PRODUCT CAPTIONING AND CONTENT GENERATION USING OPENAI
-- Undergraduate B.Sc. Computer Science Final Year Project Database Schema
-- Database Name: fashion_caption_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS fashion_caption_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fashion_caption_db;

-- --------------------------------------------------------------------
-- Table 1: Users
-- Stores application user credentials and profile information
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Table 2: Products
-- Stores fashion product metadata, attributes, and image reference
-- --------------------------------------------------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Table 3: Captions
-- Stores generated captions, product descriptions, marketing content,
-- and generation latency (seconds)
-- Relationship: products 1 ---- M captions
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS captions (
    caption_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    caption_text TEXT NOT NULL,
    product_description TEXT NOT NULL,
    marketing_content TEXT NOT NULL,
    generation_time DECIMAL(6, 2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_caption_product FOREIGN KEY (product_id) 
        REFERENCES products(product_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Table 4: Evaluations
-- Stores attribute-based metrics (TP, FP, FN, Accuracy, Precision, Recall,
-- F1-score) and 1-5 human ratings for Chapter Four analysis
-- --------------------------------------------------------------------
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
    CONSTRAINT fk_eval_caption FOREIGN KEY (caption_id) 
        REFERENCES captions(caption_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Indexes for query optimization
-- --------------------------------------------------------------------
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand_name);
CREATE INDEX idx_captions_product_id ON captions(product_id);
CREATE INDEX idx_evaluations_caption_id ON evaluations(caption_id);
