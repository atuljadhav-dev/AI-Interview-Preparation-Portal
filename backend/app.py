from flask import Flask
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.interview import interview_bp
from routes.ai import ai_bp
from routes.conversation import con_bp
from routes.feedback import feedback_bp
from flask_cors import CORS
from utils.limiter import limiter
app = Flask(__name__)
limiter.init_app(app)
CORS(app, supports_credentials=True,origins=["https://techinterviewbuddy.vercel.app/","http://localhost:3000","https://placementready.vercel.app"])
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(interview_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(con_bp)
app.register_blueprint(feedback_bp)
@app.route('/')
def hello_world():
    return 'Hello, World!'
if __name__ == '__main__':
    app.run(debug="true")
