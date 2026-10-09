"""
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
    
    # Ensure upload directory exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    
    # Initialize Database Schema
    try:
        init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Database initialization notice: {e}")
        
    # Register Blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(evaluation_bp)
    
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Fashion Captioning System on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
