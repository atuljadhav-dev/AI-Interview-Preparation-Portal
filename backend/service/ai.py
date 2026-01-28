from utils.ai import AIClient,GeminiExhaustedError
from pydantic import BaseModel
from utils.prompt import GENERATE_QUESTION, INTERVIEW_SIMULATION,GENERATE_FEEDBACK,TEXT_TO_JSON,PDF_TO_JSON,GENERATE_ATS_REPORT,GENERATE_ATS_FRIENDLY_RESUME,GENERATE_APPLICATION_EMAIL
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
    prompt = GENERATE_QUESTION.format(
        jobDescription=jobDescription,
        resume=resume,
        roundName=roundName
    )
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

def AIInterviewStimulation(questions,resume,jobDescription,roundName,content):
    '''Generate interview simulation based on questions, resume, jobDescription, roundName, content'''
    prompt=INTERVIEW_SIMULATION.format(
        questions=questions,
        resume=resume,
        jobDescription=jobDescription,
        roundName=roundName,
        timestamp=timestamp
    )
    config={
        "response_mime_type": "text/plain",
        "system_instruction": prompt,
    }
    try:
        response = AIClient(content, config)
        return response.text
    except GeminiExhaustedError:
        return None
    
def generateFeedback(jobTitle,resume, questionAnswer, userAnswer, jobDescription, roundName,skills=None):
    '''Generate feedback based on resume, questionAnswer, userAnswer, jobTitle, jobDescription, roundName''' 
    try:
        prompt=GENERATE_FEEDBACK.format(
        jobTitle=jobTitle,
        resume=resume,
        questionAnswer=questionAnswer,
        userAnswer=userAnswer,
        jobDescription=jobDescription,
        roundName=roundName,
        skills=skills if skills else "N/A"
        )
    except Exception as e:
        return None
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
                        "justification": {"type": "string"},
                        "codingAnalysis": {
                            "type": "object",
                            "properties": {
                                "logicCorrectness": {"type": "string"},
                                "timeComplexity": {"type": "string"},
                                "spaceComplexity": {"type": "string"},
                                "bestPractices": {"type": "string"}
                            },
                        }
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
    '''Convert raw resume text into a structured, domain-agnostic JSON object.'''
    prompt = TEXT_TO_JSON.format(text=text)
    config = {
        "response_mime_type": "application/json",
    }
    try:
        return AIClient(prompt, config)
    except GeminiExhaustedError:
        return None

def convertPDFToJSON(url):
    '''Convert resume PDF from URL into a structured, domain-agnostic JSON object.'''
    data = httpx.get(url).content
    if not data:
        return None

    prompt = PDF_TO_JSON
    config = {
        "response_mime_type": "application/json",
    }

    try:
        return AIClient(
            [prompt, types.Part.from_bytes(data=data, mime_type="application/pdf")],
            config
        )
    except GeminiExhaustedError:
        return None

def generateATSReport(jobDescription, resume):
    '''Generate an ATS report analyzing the resume against the job description.'''
    prompt = GENERATE_ATS_REPORT.format(
        jobDescription=jobDescription,
        resume=resume
    )
    config={
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "atsScore": {"type": "integer", "minimum": 0, "maximum": 100},
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
                        },
                        "missingCertifications": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    }
                },
                "projectsAnalysis": {
                    "type": "object",
                    "properties": {
                        "relevantProjectsFound": {"type": "boolean"},
                        "projectQualityScore": {"type": "integer", "minimum": 1, "maximum": 10},
                        "feedback": {"type": "string"}
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
                        "interviewRecommendation": {"type": "string"},
                        "resumeRecommendation":{"type":"string"}
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
    
def generateATSfriendlyResume(
    resume,
    jobDescription=None,
    atsReport=None,
    additionalResumes=None
):
    """
    Generates an ATS-optimized resume variant.
    Always returns STRUCTURED JSON.
    """
    additional_section = f"- Additional Resumes (REFERENCE ONLY):\n{additionalResumes}" if additionalResumes else ""
    jd_section = f"- Job Description:\n{jobDescription}" if jobDescription else ""
    report_section = f"- ATS Report (Gaps & Suggestions):\n{atsReport}" if atsReport else ""
    prompt = GENERATE_ATS_FRIENDLY_RESUME.format(
        resume=resume,
        additionalResumesSection=additional_section,
        jobDescriptionSection=jd_section,
        atsReportSection=report_section
    )
    
    config = {
        "response_mime_type": "application/json",
    }

    try:
        return AIClient(prompt, config)
    except GeminiExhaustedError:
        return None

def generateApplicationEmail(resume, jobDescription,additionalDetails=""):
    """
    Generates a professional job application email.
    Returns JSON so UI can render / edit.
    """
    prompt = GENERATE_APPLICATION_EMAIL.format(
        resume=resume,
        jobDescription=jobDescription,
        additionalDetails=additionalDetails if additionalDetails else "N/A"
    )

    config = {
        "response_mime_type": "application/json",
    }

    try:
        return AIClient(prompt, config)
    except GeminiExhaustedError:
        return None
