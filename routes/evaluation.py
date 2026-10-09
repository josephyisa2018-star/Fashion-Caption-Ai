"""
Academic Evaluation and Chapter Four Performance Metrics Blueprint
Undergraduate B.Sc. Project
"""
import io
import csv
from flask import Blueprint, render_template, request, redirect, url_for, flash, Response
from database.db import get_caption_details, save_evaluation, get_all_evaluations, get_history_records

evaluation_bp = Blueprint("evaluation", __name__)

def compute_academic_metrics(tp: int, fp: int, fn: int):
    """
    Computes attribute-based Precision, Recall, F1-score, and Accuracy.
    Handles division-by-zero safely to return 0.0% without runtime error.
    """
    # Precision = TP / (TP + FP)
    precision = (tp / (tp + fp)) * 100 if (tp + fp) > 0 else 0.0
    
    # Recall = TP / (TP + FN)
    recall = (tp / (tp + fn)) * 100 if (tp + fn) > 0 else 0.0
    
    # F1-score = 2 * (Precision * Recall) / (Precision + Recall)
    if (precision + recall) > 0:
        f1 = 2 * (precision * recall) / (precision + recall)
    else:
        f1 = 0.0
        
    # Attribute-based Accuracy = (TP / Total Reference Attributes) * 100
    # Total Reference Attributes = TP + FN
    total_ref = tp + fn
    accuracy = (tp / total_ref) * 100 if total_ref > 0 else 0.0
    
    return round(accuracy, 2), round(precision, 2), round(recall, 2), round(f1, 2)

@evaluation_bp.route("/evaluation/<int:caption_id>", methods=["GET", "POST"])
def evaluate(caption_id):
    item = get_caption_details(caption_id)
    if not item:
        flash("Caption record not found for evaluation.", "danger")
        return redirect(url_for("products.history"))
        
    if request.method == "GET":
        return render_template("evaluation.html", item=item)
        
    # POST Request - Process Attribute Counts and Human Rating
    reference_caption = request.form.get("reference_caption", "").strip()
    try:
        tp = int(request.form.get("true_positive", 0))
        fp = int(request.form.get("false_positive", 0))
        fn = int(request.form.get("false_negative", 0))
        
        # 5 Likert sub-ratings (1-5)
        r_relevance = int(request.form.get("rate_relevance", 4))
        r_clarity = int(request.form.get("rate_clarity", 4))
        r_quality = int(request.form.get("rate_quality", 4))
        r_brand = int(request.form.get("rate_brand", 4))
        r_overall = int(request.form.get("rate_overall", 4))
        
        # Calculate human mean rating across the 5 criteria
        human_rating = round((r_relevance + r_clarity + r_quality + r_brand + r_overall) / 5)
    except (ValueError, TypeError):
        flash("Invalid numerical values entered for evaluation attributes.", "danger")
        return render_template("evaluation.html", item=item)
        
    accuracy, precision_score, recall_score, f1 = compute_academic_metrics(tp, fp, fn)
    
    try:
        save_evaluation(
            caption_id=caption_id,
            reference_caption=reference_caption,
            tp=tp,
            fp=fp,
            fn=fn,
            accuracy=accuracy,
            precision_score=precision_score,
            recall_score=recall_score,
            f1=f1,
            human_rating=human_rating
        )
        flash(f"Evaluation recorded! Accuracy: {accuracy}%, F1-Score: {f1}%, Human Rating: {human_rating}/5", "success")
        return redirect(url_for("evaluation.dashboard"))
    except Exception as e:
        flash(f"Database error saving evaluation: {str(e)}", "danger")
        return render_template("evaluation.html", item=item)

@evaluation_bp.route("/dashboard")
def dashboard():
    evaluations = get_all_evaluations()
    history = get_history_records()
    
    total_evals = len(evaluations)
    total_captions = len(history)
    
    if total_evals > 0:
        avg_acc = round(sum(float(e["accuracy"]) for e in evaluations) / total_evals, 2)
        avg_prec = round(sum(float(e["precision_score"]) for e in evaluations) / total_evals, 2)
        avg_rec = round(sum(float(e["recall_score"]) for e in evaluations) / total_evals, 2)
        avg_f1 = round(sum(float(e["f1_score"]) for e in evaluations) / total_evals, 2)
        avg_rating = round(sum(float(e["human_rating"]) for e in evaluations) / total_evals, 2)
        max_rating = max(int(e["human_rating"]) for e in evaluations)
        min_rating = min(int(e["human_rating"]) for e in evaluations)
    else:
        avg_acc = avg_prec = avg_rec = avg_f1 = avg_rating = 0.0
        max_rating = min_rating = 0
        
    if total_captions > 0:
        avg_time = round(sum(float(h["generation_time"]) for h in history) / total_captions, 2)
    else:
        avg_time = 0.0
        
    stats = {
        "total_evaluations": total_evals,
        "total_captions": total_captions,
        "avg_accuracy": avg_acc,
        "avg_precision": avg_prec,
        "avg_recall": avg_rec,
        "avg_f1": avg_f1,
        "avg_human_rating": avg_rating,
        "max_rating": max_rating,
        "min_rating": min_rating,
        "avg_generation_time": avg_time
    }
    
    return render_template("dashboard.html", evaluations=evaluations, stats=stats)

@evaluation_bp.route("/export-csv")
def export_csv():
    """Exports Chapter Four evaluation metrics to CSV."""
    evaluations = get_all_evaluations()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Required CSV header as defined in specification
    writer.writerow([
        "Product ID",
        "Product Name",
        "Reference Caption",
        "Generated Caption",
        "TP",
        "FP",
        "FN",
        "Accuracy (%)",
        "Precision (%)",
        "Recall (%)",
        "F1-score (%)",
        "Human Rating (1-5)",
        "Generation Time (s)"
    ])
    
    for row in evaluations:
        writer.writerow([
            row.get("product_id"),
            row.get("product_name"),
            row.get("reference_caption"),
            row.get("caption_text"),
            row.get("true_positive"),
            row.get("false_positive"),
            row.get("false_negative"),
            row.get("accuracy"),
            row.get("precision_score"),
            row.get("recall_score"),
            row.get("f1_score"),
            row.get("human_rating"),
            row.get("generation_time")
        ])
        
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=fashion_caption_evaluation_results.csv"}
    )
