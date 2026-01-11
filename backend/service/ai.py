from utils.ai import AIClient,GeminiExhaustedError
from pydantic import BaseModel
from datetime import datetime
import pytz
import httpx
from google.genai import types
tz_india = pytz.timezone('Asia/Kolkata')    
timestamp = datetime.now(tz_india).strftime("%Y-%m-%d %I:%M:%S %p IST")
class QAItem(BaseModel):
    """Defines the structure for a single question-answer pair."""
    question: str
    answer: str

def generateQuestions(jobDescription, resume, roundName="Technical Interview"):
    """
    Generates interview questions based on the provided role and skills.
    """

    prompt = f"""
    You are an interview assistant. 
    Based on the following data, generate interview questions 
    and return them in **strict JSON array** format.

    data: job description: {jobDescription}
    data: resume: {resume}
    data: round name: {roundName}

    Example JSON:
{{ "skills": ["Python", "Django", "REST APIs"],
    "questionAnswer": [
        {{"question": "What is OOP?", "answer": "OOP stands for Object-Oriented Programming..."}},
        {{"question": "Explain SOLID principles.", "answer": "SOLID is an acronym for..."}},
        {{"question": "How do you manage memory in C++?", "answer": "I manage memory using..."}},
        {{"question": "What is REST API?", "answer": "REST stands for Representational State Transfer..."}},
        {{"question": "How would you optimize a SQL query?", "answer": "Optimizing a SQL query involves..."}}
    ]
    }}
    Strictly follow the JSON format shown above.
    Only mention skills on which questions are generated.
    Question should be strictly related to the interview round.
    Minimum generate the 5 question. 
    Increase the number the question according to the job description.
    Generate at most 15 question.
    Answer should be given for each question.
    Do not give answer blank.
    """

    config = {
        "response_mime_type": "application/json",
        "response_schema": {
            "type":"object",
            "properties":{
                "skills":{
                    "type":"array",
                    "items":{"type":"string"}
                },
                "questionAnswer":{
                    "type":"array",
                    "items":QAItem.model_json_schema()
                }
            },
            "required":["skills","questionAnswer"]
        }
    }

    try:
        response = AIClient(prompt, config)
        return response
    except GeminiExhaustedError:
        return None

def generateConfig(questions,resume,jobDescription,roundName):
    return f"""
You are an AI Interviewer conducting the {roundName}.
Your role is to simulate a real human interviewer.
You must ask questions naturally, one at a time, and wait for the candidate’s response before continuing.

---

### 👤 Candidate Context
- Resume: {resume}
- Job Description: {jobDescription}
- Interview Round: {roundName}
- Current Time (IST): {timestamp} -use this to make the interview feel more real

---

### 📋 Predefined Question Set (DO NOT MODIFY)
{questions}

---

### 🎯 Interview Rules (STRICT)

1. **Opening**
    - Begin with a polite, professional greeting.
    - Extract the candidate’s name from the resume.
    - Example:
        “Good morning, <Candidate Name>! Let’s begin with the interview.”

2. **Question Flow**
    - Ask questions strictly in the provided order.
    - Ask **only one question at a time**.
    - Do NOT skip, reword, merge, or introduce new questions.

3. **Response Handling**
    - Always wait for the candidate’s reply before proceeding.
    - If the candidate asks for clarification:
    - Provide a **short, neutral explanation only**
    - Give hint of expected answer without revealing it.

4. **Tone & Style**
    - Maintain a professional, calm, and conversational tone.
    - Speak like a human interviewer, not a chatbot or evaluator.
    - Avoid robotic phrasing or repetitive language.

5. **Boundaries**
    - Do NOT:
        - Answer questions on behalf of the candidate
        - Provide feedback, hints, corrections, or evaluation
        - Comment on performance or correctness

6. **Authenticity Check**
    - If a response appears AI-generated or copy-pasted:
        - Politely ask the candidate to answer in their own words
        - User response should not consist decorated text or code blocks.
        - Example:
            ## **Architecture Approach**
        - If detected again, remind the candidate about authenticity.
        - If response consist of the emojis terminate the interview.
        - If it persists, terminate the interview politely.


7. **Conversation Scope**
    - You may answer candidate questions **only if**:
        - They are directly related to the interview
        - Or they clarify a previously asked question
    - Politely redirect if questions are off-topic.

8. **Termination Conditions**
    - End the interview if:
        - All predefined questions are completed, OR
        - The conversation exceeds **30 total exchanges**
        - The candidate uses abusive language.
        - User send irrelevant or nonsensical answers.
        - User is unresponsive for more than 2 consecutive questions.
        - User give decorated text or code blocks in more than 2 answers.

9. **Closing**
    - Conclude with:
        “Thank you for your time. We will get back to you soon.”

10. **Final Output Rule**
    - After the interview is finished, output **ONLY**:
        quit
    - No additional text, punctuation, or formatting.

---

### ⚠️ Output Constraint
- Output **only interviewer dialogue**
- Do NOT include reasoning, system notes, or explanations
- Do NOT use markdown, bullet points, or labels in responses

Your goal is to simulate a realistic, professional interview experience with natural human flow.
"""
def AIInterviewStimulation(questions,resume,jobDescription,roundName,content):
    prompt=generateConfig(questions,resume,jobDescription,roundName)
    config={
        "response_mime_type": "text/plain",
        "system_instruction": prompt,
    }
    try:
        response = AIClient(content, config)
        return response.text
    except GeminiExhaustedError:
        return None
    

def generateSummary(jobTitle,resume, questionAnswer, userAnswer, jobDescription, roundName,skills) :
    return f"""
You are an AI Interview Evaluator.

Your responsibility is to objectively, strictly, and fairly evaluate a candidate’s interview responses.
You must behave like a real technical/HR interviewer, not a tutor or assistant.

---

### 📌 Input Context

- **Round Name**: {roundName}
- **Job Title**: {jobTitle}
- **Job Description**: {jobDescription}
- **Candidate Resume**: {resume}
- **Interview Questions with Ideal (Model) Answers**: {questionAnswer}
- **Skills to be Rated**: {skills}
- **Candidate Responses (Conversation Format)**: {userAnswer}

---

### 🎯 Evaluation Rules (MANDATORY)

1. **Resume Alignment**
    - Check whether the candidate’s answers are consistent with their resume.
    - Penalize answers that claim experience or skills NOT supported by the resume.

2. **Answer Quality vs Model Answer**
    - Compare each candidate response with the corresponding model answer.
    - Evaluate:
        - Conceptual correctness
        - Practical depth
        - Relevance to the question
        - Real-world examples (if applicable)

3. **Originality & Authenticity Check**
    - Detect answers that appear:
        - AI-generated
        - Memorized
        - Copy-pasted from blogs, documentation, or tutorials
        - Decorated with excessive formatting (e.g., markdown, code blocks)
        - Example of decorated text:
            ## **Architecture Approach**
    - Indicators include:
        - Overly generic language
        - Perfect textbook structure without personalization
        - Buzzword-heavy responses without concrete examples
    - If detected:
        - Deduct marks
        - Explicitly mention this in **weaknesses**

4. **Strengths & Weaknesses**
    - Strengths must be **specific**, not generic (e.g., “good understanding of REST APIs”).
    - Weaknesses must clearly explain **what is missing or incorrect**.

5. **Scoring Guidelines (1–10)**
    - **9–10**: Excellent, deep understanding, resume-aligned, original answers
    - **7–8**: Strong answers with minor gaps
    - **5–6**: Average understanding, lacks depth or clarity
    - **3–4**: Weak answers, superficial or partially incorrect
    - **1–2**: Poor understanding or irrelevant responses

6. **Justification**
    - Clearly justify the score using:
        - Resume alignment
        - Answer quality
        - Practical depth
        - Authenticity

---

### 📤 Output Rules (STRICT)

- Output **ONLY valid JSON**
- Do NOT add explanations outside JSON
- Do NOT include markdown
- Do NOT add extra fields

---

### ✅ Required Output JSON Schema

{str({
    "roundName": "roundName",
    "jobTitle": "jobTitle",
    "skillsRating":[{"skillName": "rating (1-5)"}],
    "evaluation": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "score": "number (1-10)",
        "justification": "string"
    }
})}
"""
def generateFeedback(jobTitle,resume, questionAnswer, userAnswer, jobDescription, roundName,skills=None): 
    prompt=generateSummary(jobTitle,resume, questionAnswer, userAnswer, jobDescription, roundName,skills)
    config={
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "roundName": {"type": "string"},
                "jobTitle": {"type": "string"},
                "skillsRating": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "skillName": {"type": "string"},
                            "rating": {"type": "integer", "minimum": 1, "maximum": 5}
                        },
                        "required": ["skillName", "rating"]
                    }
                },
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
    You are converting raw resume text into a structured JSON object.

RULES (IMPORTANT):
- Preserve the original wording exactly inside all values.
- Do NOT correct spelling or grammar in the content.
- Do NOT normalize skill names or casing inside values.
- Do NOT infer or invent information that is not present.
- Do NOT omit any information from the text.
- You MAY create appropriate JSON keys and structure to represent the content clearly.
- Use arrays where multiple items exist.
- Use lowercase snake_case for JSON keys.
- If a section is missing, include it as an empty array or null.

OUTPUT REQUIREMENTS:
- Output VALID JSON ONLY.
- No explanations, comments, or extra text.

Resume Text:
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

def convertPDFToJSON(url):
    data=httpx.get(url).content
    if not data:
        return None
    prompt=f"""
    You are converting a resume document into a structured JSON object.

RULES (IMPORTANT):
- Preserve the original wording exactly inside all values.
- Do NOT correct spelling or grammar in the content.
- Do NOT normalize skill names or casing inside values.
- Do NOT infer or invent information that is not present.
- Do NOT omit any information visible in the document.
- You MAY create appropriate JSON keys and structure to represent the content clearly.
- Use arrays where multiple items exist.
- Use lowercase snake_case for JSON keys.
- If a section is missing, include it as an empty array or null.

OUTPUT REQUIREMENTS:
- Output VALID JSON ONLY.
- No explanations, comments, or extra text.
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
        response = AIClient([prompt,types.Part.from_bytes(data=data,mime_type='application/pdf')], config)
        return response
    except GeminiExhaustedError:
        return None

def generateATSReport(jobDescription, resume):
    prompt= f"""
    You are an expert Applicant Tracking System (ATS) and Technical Recruiter. 
    Analyze the attached resume against the Job Description provided below. 

    Job Description:
    {jobDescription}

    Resume: 
    {resume}

    Perform a deep analysis and output the results in strict JSON format. 
    Your analysis must cover the following sections based on industry standards:

    1. **Match Rate**: Calculate a percentage score (0-100) based on keyword matching and relevance.
    2. **Searchability**: Verify the presence of Name, Phone, Email, LinkedIn, and Location.
    3. **Hard Skills Analysis**: Compare skills in the resume vs. the job description. List 'Matched' and 'Missing'.
    4. **Soft Skills Analysis**: Identify key soft skills (limit to top relevant ones).
    5. **Formatting & Quality Check**:
        - Check for "Skill Casing" errors (e.g., writing 'react' instead of 'React' or 'Jquery' instead of 'jQuery').
        - Check for repetitive verbs or passive voice.
    6. **Recruiter Tips**: Identify if the resume uses measurable results (numbers/metrics) and if the word count is appropriate.

    Output valid JSON only. Structure the JSON exactly as follows:
    {{
        "atsScore": "integer",
        "summary": "string",
        "searchability": {{
            "namePresent": "boolean",
            "emailPresent": "boolean",
            "phonePresent": "boolean",
            "linkedinPresent": "boolean",
            "locationPresent": "boolean",
            "jobTitleMatch": "boolean"
        }},
        "skillsAnalysis": {{
            "hardSkillsMatched": ["list", "of", "skills"],
            "hardSkillsMissing": ["list", "of", "skills"],
            "softSkillsFound": ["list", "of", "skills"]
        }},
        "formattingCheck": {{
            "skillCasingErrors": ["list", "of", "incorrectly", "cased", "skills"],
            "usageOfActiveVoice": "stringComment",
            "repetitionCheck": "stringComment"
        }},
        "grammerCheck": {{
            "spellingErrorsFound": "boolean",
            "grammarIssuesFound": "boolean",
            "correctionsSuggested": ["list", "of", "corrections"]
        }},
        "recruiterTips": {{
            "measurableResultsFound": "boolean",
            "improvementSuggestions": ["list", "of", "actionable", "tips"]
        }},
        "recommendation": {{
            "interviewRecommendation": "string",
            "resumeRecommendation":"string"
        }}
    }}
    """
    config={
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "atsScore": {"type": "integer"},
                "summary": {"type": "string"},
                "searchability": {
                    "type": "object",
                    "properties": {
                        "namePresent": {"type": "boolean"},
                        "emailPresent": {"type": "boolean"},
                        "phonePresent": {"type": "boolean"},
                        "linkedinPresent": {"type": "boolean"},
                        "locationPresent": {"type": "boolean"},
                        "jobTitleMatch": {"type": "boolean"}
                    }
                },
                "skillsAnalysis": {
                    "type": "object",
                    "properties": {
                        "hardSkillsMatched": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "hardSkillsMissing": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "softSkillsFound": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    }
                },
                "formattingCheck": {
                    "type": "object",
                    "properties": {
                        "skillCasingErrors": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "usageOfActiveVoice": {"type": "string"},
                        "repetitionCheck": {"type": "string"}
                    }
                },
                "grammerCheck": {
                    "type": "object",
                    "properties": {
                        "spellingErrorsFound": {"type": "boolean"},
                        "grammarIssuesFound": {"type": "boolean"},
                        "correctionsSuggested": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    }
                },
                "recruiterTips": {
                    "type": "object",
                    "properties": {
                        "measurableResultsFound": {"type": "boolean"},
                        "improvementSuggestions": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    }
                },
                "recommendation": {
                    "type": "object",
                    "properties": {
                        "interviewRecommendation": {"type": "string"}
                        ,"resumeRecommendation":{"type":"string"}
                    }
                }
            }
        }
    }
    try:
        response = AIClient(prompt, config)
        return response
    except GeminiExhaustedError:
        return None
