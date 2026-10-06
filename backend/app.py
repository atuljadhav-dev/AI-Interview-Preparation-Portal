from flask import Flask, jsonify
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
from routes.job import job_bp
from routes.code import code_bp
from routes.aptitude import aptitude_bp
from utils.jwt import verifyJWT
import os

app = Flask(__name__)
limiter.init_app(app)
orgins = os.getenv("CORS_ORIGINS", "").split(",")
CORS(
    app, supports_credentials=True, origins=orgins if orgins and orgins != [""] else "*"
)  # Allow all origins for testing, change in production

resume_bp.before_request(verifyJWT)
interview_bp.before_request(verifyJWT)
con_bp.before_request(verifyJWT)
feedback_bp.before_request(verifyJWT)
dashboard_bp.before_request(verifyJWT)
ats_bp.before_request(verifyJWT)
job_bp.before_request(verifyJWT)
code_bp.before_request(verifyJWT)
aptitude_bp.before_request(verifyJWT)
ai_bp.before_request(verifyJWT)
auth_bp.before_request(verifyJWT)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(resume_bp, url_prefix="/api")
app.register_blueprint(interview_bp, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api/ai")
app.register_blueprint(con_bp, url_prefix="/api")
app.register_blueprint(feedback_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(ats_bp, url_prefix="/api/ats")
app.register_blueprint(job_bp, url_prefix="/api")
app.register_blueprint(code_bp, url_prefix="/api/code")
app.register_blueprint(aptitude_bp, url_prefix="/api/aptitude")


@app.route("/", methods=["GET"])
def hello_world():
    return jsonify({"message": "Hello, World!"}), 200


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


if __name__ == "__main__":
    app.run(debug="true")

