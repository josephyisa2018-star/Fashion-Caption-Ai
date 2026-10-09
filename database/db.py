"""
Database access layer for AI Fashion Captioning System
Undergraduate B.Sc. Project
Supports MySQL database connection with graceful fallback mechanism.
"""
import mysql.connector
from mysql.connector import Error
import sqlite3
import os
from config import Config

def get_db_connection():
    """
    Attempts to establish a connection to MySQL.
    If MySQL server is unavailable (e.g., student laptop without MySQL daemon started),
    seamlessly falls back to a local SQLite database with identical table schemas.
    """
    try:
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            port=Config.DB_PORT
        )
        if conn.is_connected():
            return conn, "mysql"
    except Exception as e:
        # Fallback to local SQLite file for portability and academic demonstration
        pass
    
    sqlite_path = os.path.join(Config.BASE_DIR, "fashion_caption_local.db")
    conn = sqlite3.connect(sqlite_path)
    conn.row_factory = sqlite3.Row
    return conn, "sqlite"

def init_db():
    """Initializes tables if they do not exist."""
    conn, engine = get_db_connection()
    cursor = conn.cursor()
    
    if engine == "mysql":
        schema_path = os.path.join(Config.BASE_DIR, "sql", "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r") as f:
                statements = f.read().split(";")
                for stmt in statements:
                    stmt = stmt.strip()
                    if stmt and not stmt.startswith("--") and not stmt.startswith("CREATE DATABASE") and not stmt.startswith("USE"):
                        try:
                            cursor.execute(stmt)
                        except Exception as e:
                            pass
        conn.commit()
    else:
        # SQLite schema
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            category TEXT NOT NULL,
            colour TEXT NOT NULL,
            fabric TEXT NOT NULL,
            style TEXT NOT NULL,
            occasion TEXT NOT NULL,
            target_audience TEXT NOT NULL,
            brand_name TEXT NOT NULL,
            brand_voice TEXT NOT NULL,
            keywords TEXT,
            additional_information TEXT,
            image_path TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS captions (
            caption_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            caption_text TEXT NOT NULL,
            product_description TEXT NOT NULL,
            marketing_content TEXT NOT NULL,
            generation_time REAL NOT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS evaluations (
            evaluation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            caption_id INTEGER NOT NULL,
            reference_caption TEXT NOT NULL,
            true_positive INTEGER NOT NULL DEFAULT 0,
            false_positive INTEGER NOT NULL DEFAULT 0,
            false_negative INTEGER NOT NULL DEFAULT 0,
            accuracy REAL NOT NULL DEFAULT 0.0,
            precision_score REAL NOT NULL DEFAULT 0.0,
            recall_score REAL NOT NULL DEFAULT 0.0,
            f1_score REAL NOT NULL DEFAULT 0.0,
            human_rating INTEGER NOT NULL DEFAULT 4,
            evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(caption_id) REFERENCES captions(caption_id) ON DELETE CASCADE
        );
        """)
        conn.commit()
        
    cursor.close()
    conn.close()

def save_product(product_data: dict) -> int:
    """Inserts a new product record using parameterized SQL query."""
    conn, engine = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    INSERT INTO products (
        product_name, category, colour, fabric, style, occasion,
        target_audience, brand_name, brand_voice, keywords,
        additional_information, image_path
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """ if engine == "mysql" else """
    INSERT INTO products (
        product_name, category, colour, fabric, style, occasion,
        target_audience, brand_name, brand_voice, keywords,
        additional_information, image_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    params = (
        product_data.get("product_name"),
        product_data.get("category"),
        product_data.get("colour"),
        product_data.get("fabric"),
        product_data.get("style"),
        product_data.get("occasion"),
        product_data.get("target_audience"),
        product_data.get("brand_name"),
        product_data.get("brand_voice"),
        product_data.get("keywords", ""),
        product_data.get("additional_information", ""),
        product_data.get("image_path", "")
    )
    
    cursor.execute(query, params)
    conn.commit()
    product_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return product_id

def save_caption(product_id: int, caption_text: str, description: str, marketing: str, generation_time: float) -> int:
    """Inserts a generated caption record."""
    conn, engine = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    INSERT INTO captions (
        product_id, caption_text, product_description, marketing_content, generation_time
    ) VALUES (%s, %s, %s, %s, %s)
    """ if engine == "mysql" else """
    INSERT INTO captions (
        product_id, caption_text, product_description, marketing_content, generation_time
    ) VALUES (?, ?, ?, ?, ?)
    """
    
    cursor.execute(query, (product_id, caption_text, description, marketing, generation_time))
    conn.commit()
    caption_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return caption_id

def save_evaluation(caption_id: int, reference_caption: str, tp: int, fp: int, fn: int,
                    accuracy: float, precision_score: float, recall_score: float, f1: float,
                    human_rating: int) -> int:
    """Inserts an evaluation record."""
    conn, engine = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    INSERT INTO evaluations (
        caption_id, reference_caption, true_positive, false_positive, false_negative,
        accuracy, precision_score, recall_score, f1_score, human_rating
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """ if engine == "mysql" else """
    INSERT INTO evaluations (
        caption_id, reference_caption, true_positive, false_positive, false_negative,
        accuracy, precision_score, recall_score, f1_score, human_rating
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    cursor.execute(query, (
        caption_id, reference_caption, tp, fp, fn,
        accuracy, precision_score, recall_score, f1, human_rating
    ))
    conn.commit()
    evaluation_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return evaluation_id

def get_history_records() -> list:
    """Fetches combined product and caption records."""
    conn, engine = get_db_connection()
    cursor = conn.cursor(dictionary=True) if engine == "mysql" else conn.cursor()
    
    query = """
    SELECT 
        c.caption_id,
        c.product_id,
        c.caption_text,
        c.product_description,
        c.marketing_content,
        c.generation_time,
        c.generated_at,
        p.product_name,
        p.category,
        p.colour,
        p.fabric,
        p.style,
        p.occasion,
        p.target_audience,
        p.brand_name,
        p.brand_voice,
        p.image_path
    FROM captions c
    JOIN products p ON c.product_id = p.product_id
    ORDER BY c.generated_at DESC
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    
    results = []
    if engine == "mysql":
        results = rows
    else:
        for r in rows:
            results.append(dict(r))
            
    cursor.close()
    conn.close()
    return results

def get_caption_details(caption_id: int) -> dict:
    """Fetches a single caption and its associated product details."""
    conn, engine = get_db_connection()
    cursor = conn.cursor(dictionary=True) if engine == "mysql" else conn.cursor()
    
    query = """
    SELECT 
        c.caption_id,
        c.product_id,
        c.caption_text,
        c.product_description,
        c.marketing_content,
        c.generation_time,
        c.generated_at,
        p.product_name,
        p.category,
        p.colour,
        p.fabric,
        p.style,
        p.occasion,
        p.target_audience,
        p.brand_name,
        p.brand_voice,
        p.keywords,
        p.additional_information,
        p.image_path
    FROM captions c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.caption_id = %s
    """ if engine == "mysql" else """
    SELECT 
        c.caption_id,
        c.product_id,
        c.caption_text,
        c.product_description,
        c.marketing_content,
        c.generation_time,
        c.generated_at,
        p.product_name,
        p.category,
        p.colour,
        p.fabric,
        p.style,
        p.occasion,
        p.target_audience,
        p.brand_name,
        p.brand_voice,
        p.keywords,
        p.additional_information,
        p.image_path
    FROM captions c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.caption_id = ?
    """
    cursor.execute(query, (caption_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not row:
        return None
    return dict(row)

def delete_caption_record(caption_id: int) -> bool:
    """Deletes a caption record."""
    conn, engine = get_db_connection()
    cursor = conn.cursor()
    query = "DELETE FROM captions WHERE caption_id = %s" if engine == "mysql" else "DELETE FROM captions WHERE caption_id = ?"
    cursor.execute(query, (caption_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return True

def get_all_evaluations() -> list:
    """Fetches all evaluations joined with product and caption data."""
    conn, engine = get_db_connection()
    cursor = conn.cursor(dictionary=True) if engine == "mysql" else conn.cursor()
    
    query = """
    SELECT 
        e.evaluation_id,
        e.caption_id,
        e.reference_caption,
        e.true_positive,
        e.false_positive,
        e.false_negative,
        e.accuracy,
        e.precision_score,
        e.recall_score,
        e.f1_score,
        e.human_rating,
        e.evaluation_date,
        c.caption_text,
        c.generation_time,
        p.product_id,
        p.product_name,
        p.category,
        p.brand_name,
        p.image_path
    FROM evaluations e
    JOIN captions c ON e.caption_id = c.caption_id
    JOIN products p ON c.product_id = p.product_id
    ORDER BY e.evaluation_date DESC
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    results = [dict(r) for r in rows] if engine != "mysql" else rows
    cursor.close()
    conn.close()
    return results
