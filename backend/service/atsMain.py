import re
import os
import nltk
from nltk.corpus import stopwords
import io
from pypdf import PdfReader
import requests

nltkDir = "/tmp/nltk_data"

if not os.path.exists(nltkDir):
    os.makedirs(nltkDir, exist_ok=True)

nltk.data.path.append(nltkDir)

try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    # Download stopwords to the specified directory if not already present
    nltk.download("stopwords", download_dir=nltkDir)
# Load stop words once at the module level for efficiency
STOP_WORDS = set(stopwords.words("english"))

# Mapping of common skill variations to normalized skill names
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
# Mapping of common section name variations to normalized section names
SECTION_MAP = {
    "experience": [
        "experience",
        "work history",
        "professional experience",
        "internships",
        "employment",
    ],
    "education": ["education", "academic background"],
    "projects": ["projects", "technical projects"],
    "skills": ["skills", "technical skills"],
    "summary": ["summary", "objective", "profile"],
}
# List of strong action verbs to detect impact signals
IMPACT_VERBS = [
    "built",
    "developed",
    "integrated",
    "managed",
    "designed",
    "implemented",
    "optimized",
    "integrated",
    "managed",
    "architected",
    "led",
    "executed",
]
# Simple regex-based grammar improvement rules
GRAMMAR_RULES = {
    r"\bi am\b": "Avoid first-person language.",
    r"\bresponsible for\b": "Replace with strong action verbs like 'Led' or 'Executed'.",
    r"\bhelp\b": "Use professional alternatives like 'Assisted' or 'Collaborated'.",
    r"\bworked on\b": "Use stronger verbs like 'Developed' or 'Implemented'.",
    r"\bgained experience\b": "Use specific achievements instead of vague phrases.",
    r"\bteam player\b": "Show collaboration through achievements instead of buzzwords.",
    r"\bgreat communication skills\b": "Demonstrate communication through examples rather than stating it.",
}


def detectAllSkills(text):
    """
    Detect and normalize all skills found in text.
    Uses SKILL_MAP to reduce variation mismatch.
    """
    textLower = text.lower()
    found = set()

    for variation, normalized in SKILL_MAP.items():
        if re.search(r"\b" + re.escape(variation) + r"\b", textLower):
            found.add(normalized)

    return found


def detectSections(resumeText):
    """
    Detect standard resume sections using alias matching.
    """
    resumeLower = resumeText.lower()
    found = []

    for name, aliases in SECTION_MAP.items():
        for alias in aliases:
            if re.search(r"(?:^|\n)\s*" + re.escape(alias), resumeLower):
                found.append(name)
                break

    return found


def detectGrammarIssues(text):
    """
    Lightweight regex-based grammar improvement suggestions.
    """
    suggestions = []

    for pattern, advice in GRAMMAR_RULES.items():
        if re.search(pattern, text, re.IGNORECASE):
            suggestions.append(advice)

    return suggestions


def detectImpactSignals(resumeText):
    """
    Detect measurable metrics and count strong action verbs.
    """
    resumeLower = resumeText.lower()

    # Count action verb frequency
    verbCount = sum(resumeLower.count(v) for v in IMPACT_VERBS)

    # Detect measurable metrics (%, numbers, currency)
    metricsDetected = bool(re.search(r"\d+%|\$\d+|\d+\+?|\b\d+x\b", resumeText))

    return verbCount, metricsDetected


def calculateAtsReport(jobDescription, url):
    """
    Main ATS scoring engine.
    Returns structured deterministic report.
    """
    # Fetch and extract text from resume PDF
    docData = requests.get(url)
    f = io.BytesIO(docData.content)
    reader = PdfReader(f)
    resumeText = ""
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        resumeText += f"\n{text}"

    # Skill alignment with stronger penalty for missing skills
    resumeSkills = detectAllSkills(resumeText)
    jdSkills = detectAllSkills(jobDescription)
    matched = [s for s in jdSkills if s in resumeSkills]
    missing = [s for s in jdSkills if s not in resumeSkills]

    # Use a baseline of 10 skills to prevent excessive penalization for shorter job descriptions
    baseline = max(len(jdSkills), 10)

    skillCoverage = (len(matched) / baseline) * 100

    # Stronger penalty for missing skills
    missingPenalty = len(missing) * 2

    alignmentRaw = max(skillCoverage - missingPenalty, 0)

    alignmentScore = alignmentRaw * 0.35

    foundSections = detectSections(resumeText)

    sectionWeights = {
        "experience": 35,
        "skills": 35,
        "projects": 15,
        "education": 10,
        "summary": 5,
    }
    # Calculate section score based on found sections and their weights
    totalPossible = sum(sectionWeights.values())
    sectionPoints = sum(sectionWeights.get(s, 0) for s in foundSections)
    sectionPercentage = (sectionPoints / totalPossible) * 100
    structureScore = sectionPercentage * 0.20

    resumeLower = resumeText.lower()

    presence = {
        "email": bool(re.search(r"[\w\.-]+@[\w\.-]+", resumeText)),
        "linkedin": "linkedin.com" in resumeLower,
        "github": "github.com" in resumeLower,
    }
    # Each missing element reduces the score by 33.3%, so all 3 present gives 100%, 2 gives ~66.7%, 1 gives ~33.3%, and 0 gives 0%.
    presenceScore = (sum(presence.values()) / 3) * 100
    presenceScoreWeighted = presenceScore * 0.15
    # Detect impact signals
    verbCount, metricsDetected = detectImpactSignals(resumeText)
    # Cap verb score at 100% for 10 or more action verbs to prevent excessive scoring from very long resumes
    verbScore = min((verbCount / 10) * 100, 100)
    metricBonus = 20 if metricsDetected else 0
    # Combine verb score and metric bonus, but cap total impact score at 100%
    impactRaw = min(verbScore + metricBonus, 100)
    impactScore = impactRaw * 0.10
    # Optimize word count with a sweet spot between 450-650 words, but allow some flexibility
    wordCount = len(resumeText.split())

    if 450 <= wordCount <= 650:
        wcRaw = 100
    elif 350 <= wordCount <= 800:
        wcRaw = 70
    else:
        wcRaw = 40

    wcScore = wcRaw * 0.10
    # Combine all scores for final ATS score
    totalScore = (
        alignmentScore + structureScore + presenceScoreWeighted + impactScore + wcScore
    )

    # Diminishing returns above 95
    if totalScore > 95:
        totalScore = 95 + (totalScore - 95) * 0.5

    finalScore = round(totalScore)

    grammarSuggestions = detectGrammarIssues(resumeText)

    return {
        "alignment": {
            "matchedSkills": matched,
            "missingSkills": missing,
            "coveragePercentage": round(skillCoverage, 2),
            "scoreContribution": round(alignmentScore, 2),
        },
        "structure": {
            "sectionsFound": foundSections,
            "scoreContribution": round(structureScore, 2),
        },
        "presence": {
            "contactDetails": presence,
            "scoreContribution": round(presenceScoreWeighted, 2),
        },
        "impactSignals": {
            "actionVerbCount": verbCount,
            "metricsDetected": metricsDetected,
            "scoreContribution": round(impactScore, 2),
        },
        "lengthOptimization": {
            "wordCount": wordCount,
            "scoreContribution": round(wcScore, 2),
        },
        "grammarSuggestions": grammarSuggestions,
        "finalScore": finalScore,
    }
