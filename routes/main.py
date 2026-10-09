"""
Main Blueprint for AI Fashion Product Captioning System
Undergraduate B.Sc. Project
"""
from flask import Blueprint, render_template

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
    """Home page highlighting Project Title, Aim, 4 Research Objectives, and Architecture."""
    return render_template("index.html")
