from flask import Flask
from routes.auth import auth_bp
from routes.resume import resume_bp
from routes.interview import interview_bp
from routes.ai import ai_bp
from routes.conversation import con_bp
from routes.feedback import feedback_bp
from flask_cors import CORS
from utils.limiter import limiter
from routes.dashboard import dashboard_bp
from routes.ats import ats_bp
import os

app = Flask(__name__)
limiter.init_app(app)
orgins = os.getenv("CORS_ORIGINS", "").split(",")
CORS(
    app, supports_credentials=True, origins=orgins if orgins and orgins != [""] else "*"
)  # Allow all origins for testing, change in production
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(resume_bp, url_prefix="/api")
app.register_blueprint(interview_bp, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api/ai")
app.register_blueprint(con_bp, url_prefix="/api")
app.register_blueprint(feedback_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(ats_bp, url_prefix="/api/ats")


@app.route("/")
def hello_world():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(debug="true")
