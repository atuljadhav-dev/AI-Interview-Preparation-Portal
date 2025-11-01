# AI Interview Preparation Portal

> An AI-powered platform designed for mock interview preparation, offering voice-based interviews, instant personalized feedback, comprehensive progress tracking, and robust profile management.
## ✨ Key Features

*   **User Authentication & Authorization**: Secure sign-up, sign-in, and session management with JWT and protected routes.
*   **Resume Management**: Upload PDF resumes, which are then parsed and converted into structured JSON data using AI.
*   **AI-Powered Interview Generation**: Dynamically generates tailored interview questions based on the job description, desired round (e.g., HR, Technical), and the user's resume.
*   **Interactive AI Interview Simulation**: Conducts conversational mock interviews where an AI interviewer asks questions one by one, simulating a real-world interview experience.
*   **Comprehensive Feedback System**: Provides instant, personalized feedback on interview performance, including strengths, weaknesses, a score (1-10), and detailed justification by evaluating user answers against model answers and job requirements.
*   **Interview & Conversation History**: Tracks all past interviews, their status, and saves the full conversation transcript between the user and the AI interviewer.
*   **User Profile**: Allows users to manage their uploaded resumes and personal information.

## 🛠️ Tech Stack

**Frontend:**
*   Next.js
*   React
*   Axios
*   JOSE (Javascript Object Signing and Encryption)
*   React Toastify
*   Tailwind CSS

**Backend:**
*   Flask
*   Pydantic
*   Bcrypt
*   PyJWT
*   PyMongo (MongoDB driver)
*   Python-dotenv
*   Google GenAI (Gemini-2.0-flash)
*   PyPDF
*   Flask-CORS

## 🚀 Installation

To set up and run the project locally, follow these steps:

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
3.  Create a `.env` file in the `backend` directory and add your MongoDB URI and JWT secret:
    ```
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` directory and add your backend API base URL:
    ```
    NEXT_PUBLIC_BASE_URL="http://localhost:5000" # Or your deployed backend URL
    ```

## Usage

### Running the Backend

From the `backend` directory:
```bash
python app.py
```
The backend server will start on `http://127.0.0.1:5000` (or another port if configured).

### Running the Frontend

From the `frontend` directory:
```bash
npm run dev
```
The frontend development server will start on `http://localhost:3000`. Open this URL in your browser to access the application.

## 🔧 How It Works

The AI Interview Preparation Portal operates as a full-stack application, with a Next.js frontend and a Flask backend, leveraging AI models for core functionalities.

**Overall Flow:**
1.  **User Interaction**: Users interact with the application through the Next.js frontend, managing their profile, uploading resumes, starting interviews, and reviewing feedback.
2.  **API Communication**: The frontend communicates with the Flask backend via RESTful API endpoints using `axios`.
3.  **Backend Processing**: The Flask backend handles user authentication, data storage (MongoDB), and orchestrates interactions with the AI service.

**Detailed Process:**

*   **Authentication**: Users sign up or sign in via the frontend. The backend validates credentials, uses `bcrypt` for password hashing, and issues a JSON Web Token (JWT) for session management, stored in an `authToken` cookie. Middleware on the frontend verifies this token for route protection.
*   **Resume Upload and Profile Creation**:
    *   Users upload their resumes as PDF files through the frontend.
    *   The Flask backend (`routes/profile.py`) receives the PDF, extracts text using `pypdf`.
    *   This extracted text is then sent to the AI service (`service/ai.py` -> `convertTextToJSON`) which structures the resume data into a JSON format.
    *   The structured resume is saved to MongoDB as part of the user's profile.
*   **Interview Creation**:
    *   A user initiates an interview by providing a job role, description, and selecting an interview round.
    *   The backend (`routes/interview.py`) sends this information, along with the user's resume, to the AI service (`service/ai.py` -> `generateQuestions`).
    *   The AI generates a set of tailored interview questions and their model answers, which are then stored in MongoDB, creating a new interview record.
*   **Interview Simulation**:
    *   During an active interview, the AI service (`service/ai.py` -> `AIInterviewStimulation`) acts as the interviewer.
    *   User responses are sent to the AI, which uses the provided questions, job description, and resume to simulate a realistic interview flow, asking questions one by one and awaiting user input.
    *   The entire conversation (user inputs and AI responses) is recorded and stored in MongoDB (`routes/conversation.py`).
*   **Feedback Generation**:
    *   Once an interview is concluded (e.g., when the AI indicates "quit"), the backend triggers the feedback generation process.
    *   The AI service (`service/ai.py` -> `generateFeedback`) analyzes the complete interview conversation, the user's resume, the job description, and the predefined questions/model answers.
    *   It generates a detailed evaluation, including identified strengths, weaknesses, a score from 1 to 10, and a justification.
    *   This feedback is stored in MongoDB and linked to the completed interview record.
*   **Data Storage**: MongoDB is utilized as the primary database, managed by `pymongo` via the `utils/db.py` module, storing user accounts, profiles, interview details, conversations, and feedback.
*   **AI Integration**: The `utils/ai.py` module acts as a client for the Google GenAI `gemini-2.0-flash` model, abstracting interactions for question generation, interview simulation, and feedback evaluation.