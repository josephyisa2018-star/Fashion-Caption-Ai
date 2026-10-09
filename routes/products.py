"""
Products and Caption Generation Blueprint
Undergraduate B.Sc. Project
"""
import os
import uuid
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from werkzeug.utils import secure_filename
from config import Config
from database.db import save_product, save_caption, get_history_records, get_caption_details, delete_caption_record
from services.openai_service import generate_fashion_content

products_bp = Blueprint("products", __name__)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@products_bp.route("/generate", methods=["GET", "POST"])
def generate():
    if request.method == "GET":
        return render_template("generate.html")
        
    # POST Request - Validate Inputs
    product_name = request.form.get("product_name", "").strip()
    category = request.form.get("category", "").strip()
    colour = request.form.get("colour", "").strip()
    fabric = request.form.get("fabric", "").strip()
    style = request.form.get("style", "").strip()
    occasion = request.form.get("occasion", "").strip()
    target_audience = request.form.get("target_audience", "").strip()
    brand_name = request.form.get("brand_name", "").strip()
    brand_voice = request.form.get("brand_voice", "Professional").strip()
    keywords = request.form.get("keywords", "").strip()
    additional_information = request.form.get("additional_information", "").strip()
    
    # Validation checks
    if not product_name or not category or not colour or not fabric or not brand_name:
        flash("Please fill in all mandatory product attributes (Name, Category, Colour, Fabric, Brand).", "danger")
        return render_template("generate.html", form_data=request.form)
        
    image_file = request.files.get("product_image")
    image_rel_path = "static/uploads/default_fashion.jpg"
    full_image_path = None
    
    if image_file and image_file.filename != "":
        if not allowed_file(image_file.filename):
            flash("Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.", "danger")
            return render_template("generate.html", form_data=request.form)
            
        filename = secure_filename(image_file.filename)
        unique_name = f"{uuid.uuid4().hex[:10]}_{filename}"
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        full_image_path = os.path.join(Config.UPLOAD_FOLDER, unique_name)
        image_file.save(full_image_path)
        image_rel_path = f"static/uploads/{unique_name}"
    
    product_dict = {
        "product_name": product_name,
        "category": category,
        "colour": colour,
        "fabric": fabric,
        "style": style or "Contemporary",
        "occasion": occasion or "Versatile",
        "target_audience": target_audience or "Fashion Consumers",
        "brand_name": brand_name,
        "brand_voice": brand_voice,
        "keywords": keywords,
        "additional_information": additional_information,
        "image_path": image_rel_path
    }
    
    # Generate content using OpenAI service (with latency measurement)
    ai_result = generate_fashion_content(product_dict, image_path=full_image_path)
    
    # Store Product and Generated Caption in MySQL database
    try:
        product_id = save_product(product_dict)
        caption_id = save_caption(
            product_id=product_id,
            caption_text=ai_result["caption"],
            description=ai_result["description"],
            marketing=ai_result["marketing_content"],
            generation_time=ai_result["generation_time"]
        )
        flash("Fashion caption and content generated successfully!", "success")
        return redirect(url_for("products.results", caption_id=caption_id))
    except Exception as e:
        flash(f"Database error while saving generation: {str(e)}", "danger")
        return render_template("generate.html", form_data=request.form)

@products_bp.route("/results/<int:caption_id>")
def results(caption_id):
    item = get_caption_details(caption_id)
    if not item:
        flash("Requested caption record was not found.", "warning")
        return redirect(url_for("products.history"))
    return render_template("results.html", item=item)

@products_bp.route("/history")
def history():
    records = get_history_records()
    return render_template("history.html", records=records)

@products_bp.route("/delete/<int:caption_id>", methods=["POST"])
def delete_item(caption_id):
    try:
        delete_caption_record(caption_id)
        flash("Record deleted successfully.", "info")
    except Exception as e:
        flash(f"Error deleting record: {e}", "danger")
    return redirect(url_for("products.history"))
