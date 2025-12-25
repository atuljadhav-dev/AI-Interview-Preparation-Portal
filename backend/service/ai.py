from utils.ai import AIClient,GeminiExhaustedError
from pydantic import BaseModel
from datetime import datetime
timestamp=datetime.now()
class QAItem(BaseModel):
    """Defines the structure for a single question-answer pair."""
    question: str
    answer: str

def generateQuestions(job_description, resume, round_name="Technical Interview"):
    """
    Generates interview questions based on the provided role and skills.
    """

    prompt = f"""
    You are an interview assistant. 
    Based on the following data, generate 5 interview questions 
    and return them in **strict JSON array** format.

    data: job description: {job_description}
    data: resume: {resume}
    data: round name: {round_name}

    Example JSON:
    [
        {{"question": "What is OOP?", "answer": "OOP stands for Object-Oriented Programming..."}},
        {{"question": "Explain SOLID principles.", "answer": "SOLID is an acronym for..."}},
        {{"question": "How do you manage memory in C++?", "answer": "I manage memory using..."}},
        {{"question": "What is REST API?", "answer": "REST stands for Representational State Transfer..."}},
        {{"question": "How would you optimize a SQL query?", "answer": "Optimizing a SQL query involves..."}}
    ]
    """

    config = {
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "array",
            "items": QAItem.model_json_schema()  # ✅ just array of QAItem
        }
    }

    try:
        response = AIClient(prompt, config)
        return response
    except GeminiExhaustedError:
        return None

def generateConfig(questions,resume,jobDescription,round_name,content):
    return f"""
    You are an AI Interviewer conducting the {round_name}.  
Your role is to behave like a real human interviewer and ask questions one by one.  

### Candidate Data:
- Resume: {resume}
- Job Description: {jobDescription}
- Round Name: {round_name}

### Predefined Question Set:
{questions}

### Interview Content:
{content}
### Guidelines:
1. Start with a polite greeting that includes the candidate’s name (extracted from the resume).  
   Example: "Good morning||evening||afternoon, <Candidate Name>! Let’s begin with the interview." 
   Current Time :{timestamp} 
2. Ask questions strictly in the given order, one at a time.  
3. Do NOT skip, rephrase, or mix questions unless clarification is requested.  
4. Wait for the candidate’s response before moving to the next question.  
5. Maintain a professional and conversational tone throughout.  
6. If the candidate asks for clarification, provide only a short and clear explanation.  
7. After all questions are completed, conclude politely:  
   "Thank you for your time. We will get back to you soon."  
8. Do NOT give answers, feedback, or evaluation at any point.  
9. Ensure your output contains ONLY the interviewer’s dialogue, not internal reasoning or notes.  
10. When the interview is over return strictly only text "quit" no any extra text
Your job is to simulate the flow of a professional interview as naturally as possible.
"""
def AIInterviewStimulation(questions,resume,jobDescription,round_name,content):
    prompt=generateConfig(questions,resume,jobDescription,round_name,content)
    config={
        "response_mime_type": "text/plain",
        "system_instruction": prompt,
    }
    try:
        response = AIClient(prompt, config)
        return response.text
    except GeminiExhaustedError:
        return None
def generateSummary(jobTitle,resume, questionAnswer, userAnswer, job_description, round_name) :
    return f"""
    You are an AI interview assistant. 
    Your role is to evaluate candidate answers strictly and fairly.

    ### Input Data:
    - **Round Name**: {round_name}
    - **Job Description**: {job_description}
    - **Resume Data**: {resume}
    - **Interview Question And Model Answers**: {questionAnswer}
    - **User Answer **: {userAnswer}

    ### Instructions:
    1. Analyze the candidate's resume and match it with the job description.
    2. Compare the candidate’s answer to the provided **model answer**.
    3. Highlight **strengths** and **weaknesses** in the candidate’s response.
    4. Give a **score from 1 to 10** with justification.
    5. Output the result strictly in JSON format with the following schema:

    {{
        "roundName": "{round_name}",
        "jobTitle": "{jobTitle}",
        "evaluation": {{
            "strengths": ["..."],
            "weaknesses": ["..."],
            "score": 0,
            "justification": "..."
        }}
    }}
    """
def generateFeedback(jobTitle,resume, questionAnswer, userAnswer, job_description, round_name) :
    prompt=generateSummary(jobTitle,resume, questionAnswer, userAnswer, job_description, round_name)
    config={
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "roundName": {"type": "string"},
                "jobTitle": {"type": "string"},
                "evaluation": {
                    "type": "object",
                    "properties": {
                        "strengths": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "weaknesses": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "score": {"type": "integer", "minimum": 1, "maximum": 10},
                        "justification": {"type": "string"}
                    },
                    "required": ["strengths", "weaknesses", "score", "justification"]
                }
            },
            
        }
    }
    try:
        response = AIClient(prompt, config)
        return response.text
    except GeminiExhaustedError:
        return None

def convertTextToJSON(text):
    prompt=f"""
    Convert the following text to a JSON object. 
    Ensure the JSON is properly formatted.

    Text:
    {text}
    Do not add any extra information or explanation.
    Example JSON format:
    {{
        "key1": "value1",
        "key2": "value2",
        ...
    }}
    """
    config={
        "response_mime_type": "application/json",
    }
    try:
        response = AIClient(prompt, config)
        return response
    except GeminiExhaustedError:
        return None

