import re
import os
import nltk
from nltk.corpus import stopwords

nltk_data_dir = "/tmp/nltk_data"  # point to a temporary directory for nltk data
if not os.path.exists(nltk_data_dir):
    os.makedirs(nltk_data_dir, exist_ok=True)

nltk.data.path.append(
    nltk_data_dir
)  # add the temporary directory to nltk's search path

try:
    nltk.data.find(
        "tokenizers/punkt_tab"
    )  # check if the tokenizer is already downloaded
    nltk.data.find("corpora/stopwords")  # check if the stopwords are already downloaded
except LookupError:
    nltk.download("punkt_tab", download_dir=nltk_data_dir)
    nltk.download("stopwords", download_dir=nltk_data_dir)

STOP_WORDS = set(stopwords.words("english"))
# A mapping of common skill variations to their normalized forms for better matching
SKILL_MAP = {
    "react.js": "react",
    "reactjs": "react",
    "react": "react",
    "next.js": "nextjs",
    "nextjs": "nextjs",
    "node.js": "nodejs",
    "nodejs": "nodejs",
    "node": "nodejs",
    "express.js": "expressjs",
    "express": "expressjs",
    "mongodb": "mongodb",
    "mongo": "mongodb",
    "javascript": "javascript",
    "js": "javascript",
    "typescript": "typescript",
    "ts": "typescript",
    "rest api": "restapi",
    "restful api": "restapi",
    "apis": "restapi",
    "python": "python",
    "flask": "flask",
    "django": "django",
    "sql": "sql",
    "postgresql": "postgresql",
    "mysql": "mysql",
    "git": "git",
    "github": "git",
    "docker": "docker",
    "aws": "aws",
    "html": "html",
    "css": "css",
    "tailwind": "tailwind",
    "bootstrap": "bootstrap",
    "firebase": "firebase",
    "postman": "postman",
    "netlify": "netlify",
    "vercel": "vercel",
    "visual studio code": "vscode",
    "vscode": "vscode",
    "recharts": "recharts",
    "octokit": "octokit",
    "gemini api": "geminiapi",
    "gemini": "geminiapi",
    "ai": "ai",
    "artificial intelligence": "ai",
    "machine learning": "machinelearning",
    "ml": "machinelearning",
    "data analysis": "dataanalysis",
    "data analytics": "dataanalysis",
    "data science": "datascience",
    "data structures": "datastructures",
    "selenium": "selenium",
    "cypress": "cypress",
    "testcomplete": "testcomplete",
}
# A mapping of common section header variations to standardized section names for better detection
SECTION_MAP = {
    "experience": [
        "experience",
        "work history",
        "professional experience",
        "internships",
        "employment",
    ],
    "education": [
        "education",
        "qualification",
        "academic background",
        "academic profile",
    ],
    "projects": [
        "projects",
        "personal projects",
        "technical projects",
        "academic projects",
    ],
    "skills": [
        "skills",
        "technical skills",
        "technologies",
        "core competencies",
        "expertise",
    ],
    "summary": ["summary", "objective", "professional summary", "about me", "profile"],
}
# A list of strong action verbs to encourage impactful resume writing and improve ATS scoring
IMPACT_VERBS = [
    "built",
    "developed",
    "integrated",
    "managed",
    "designed",
    "implemented",
    "optimized",
    "architected",
]
# Common grammar patterns to flag for improvement, along with suggestions for more professional alternatives
GRAMMAR_RULES = {
    r"\bi am\b": "Avoid first-person 'I am'. Use action-oriented verbs like 'Developed' or 'Built'.",
    r"\bresponsible for\b": "Replace 'Responsible for' with strong impact verbs like 'Led' or 'Executed'.",
    r"\bhelp\b": "Use professional alternatives like 'Assisted' or 'Collaborated'.",
}


# The main function to detect and normalize skills from text, using the SKILL_MAP for consistent matching
def detect_all_skills(text):
    """Identifies and normalizes all skills present in text."""
    text_lower = text.lower()
    found = set()
    for variation, normalized in SKILL_MAP.items():
        if re.search(r"\b" + re.escape(variation) + r"\b", text_lower):
            found.add(normalized)  # Add the normalized skill to the set of found skills
    return found


def calculate_final_score(matched_hard, jd_skills, found_sections, resume_text):
    """Calculates a realistic, professional-grade ATS score."""
    resume_lower = resume_text.lower()

    denominator = max(
        len(jd_skills), 12
    )  # Use 12 as a baseline to prevent inflated scores for very short job descriptions with few skills
    skill_score = (
        len(matched_hard) / denominator
    ) * 100  # Calculate skill match score, capping the denominator to 12 for fairness

    weights = {
        "experience": 35,
        "skills": 35,
        "projects": 15,
        "education": 10,
        "summary": 5,
    }  # Assign weights to different sections based on their importance in ATS scoring, with experience and skills being the most heavily weighted
    section_points = sum(
        weights.get(s, 0) for s in found_sections
    )  # Calculate section presence score based on the weighted importance of each section found in the resume

    presence = {
        "email": bool(re.search(r"[\w\.-]+@[\w\.-]+", resume_text)),
        "linkedin": "linkedin.com" in resume_lower,
        "github": "github.com" in resume_lower,
    }  # Check for the presence of key contact information and online profiles, which are important for ATS parsing and candidate evaluation
    presence_score = (
        sum(presence.values()) / 3
    ) * 100  # Calculate presence score based on the presence of email, LinkedIn, and GitHub, which are critical for ATS parsing and candidate evaluation

    verb_count = sum(
        1 for v in IMPACT_VERBS if v in resume_lower
    )  # Count the number of strong action verbs present in the resume, which can enhance the impact and professionalism of the resume, contributing to a higher ATS score
    impact_score = min(
        (verb_count / 8) * 100, 100
    )  # Calculate impact score based on the number of strong action verbs, capping at 8 verbs for a maximum score of 100, to encourage impactful resume writing without overemphasizing verb usage

    word_count = len(
        resume_text.split()
    )  # Calculate word count to evaluate resume length, which can affect ATS parsing and readability; ideal range is typically between 450 and 650 words for optimal ATS performance
    wc_score = (
        100 if 450 <= word_count <= 650 else 40
    )  # Assign a word count score based on whether the resume falls within the ideal range of 450-650 words, which is optimal for ATS parsing and readability; resumes that are too short or too long may receive a lower score

    total = (
        (skill_score * 0.40)
        + (section_points * 0.25)
        + (presence_score * 0.15)
        + (impact_score * 0.10)
        + (wc_score * 0.10)
    )  # Calculate the total ATS score by combining the individual scores with their respective weights, resulting in a comprehensive evaluation of the resume's alignment with ATS criteria, including skill matching, section presence, contact information, impact verbs, and word count

    if total > 95:
        total = (
            95 + (total - 95) * 0.5
        )  # Apply a diminishing returns formula for scores above 95 to prevent unrealistic perfect scores, ensuring that even highly optimized resumes receive a score that reflects the competitive nature of ATS evaluations

    return round(total), word_count


def calculate_ats_report(resume_text, job_description):
    """Main orchestrator for generating the multi-factor report."""
    resume_lower = resume_text.lower()

    resume_skills = detect_all_skills(resume_text)
    jd_skills = detect_all_skills(job_description)
    matched_hard = [
        s for s in jd_skills if s in resume_skills
    ]  # Identify which required skills from the job description are present in the resume, providing a clear indication of skill alignment for ATS scoring
    missing_hard = [
        s for s in jd_skills if s not in resume_skills
    ]  # Identify which required skills from the job description are missing in the resume, highlighting areas for improvement to increase ATS compatibility and candidate competitiveness

    found_sections = [
        name
        for name, aliases in SECTION_MAP.items()
        if any(re.search(r"(?:^|\n)\s*" + re.escape(a), resume_lower) for a in aliases)
    ]

    grammar_suggestions = []
    for pattern, advice in GRAMMAR_RULES.items():
        if re.search(pattern, resume_text, re.IGNORECASE):
            grammar_suggestions.append(advice)

    score, word_count = calculate_final_score(
        matched_hard, jd_skills, found_sections, resume_text
    )

    return {
        "score": score,
        "hardSkills": {"matched": matched_hard, "missing": missing_hard},
        "sections": found_sections,
        "grammarSuggestions": grammar_suggestions,
        "wordCount": word_count,
    }
