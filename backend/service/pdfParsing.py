import re
import pdfplumber
import fitz  # PyMuPDF


def isPoorExtraction(text: str) -> bool:
    lines = [l.strip() for l in text.splitlines() if l.strip()]

    # Too short for a resume
    if len(text) < 500:
        return True

    # Excessive single-word or very short lines
    singleWordLines = sum(1 for l in lines if len(l.split()) <= 2)
    if singleWordLines / max(len(lines), 1) > 0.4:
        return True

    # Missing key sections
    keywords = ["experience", "education", "skills", "project"]
    if not any(k in text.lower() for k in keywords):
        return True

    return False


def extract_with_pdfplumber(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        if len(pdf.pages) > 3:
            return None, "PDF too long (Max 3 pages)", 400

        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    return text.strip(), None, 200


def extract_with_pymupdf(file):
    text = ""
    doc = fitz.open(stream=file.read(), filetype="pdf")

    if len(doc) > 3:
        return None, "PDF too long (Max 3 pages)", 400

    for page in doc:
        text += page.get_text() + "\n"

    return text.strip(), None, 200


def processResumePdf(file):
    """
    Primary: pdfplumber
    Fallback: PyMuPDF
    """

    try:
        # ---------- 1️⃣ Try pdfplumber ----------
        file.seek(0)
        text, error, status = extract_with_pdfplumber(file)

        if text and len(text) > 200:
            cleaned = re.sub(r"\s+", " ", text)
            return cleaned, None, 200

        # ---------- 2️⃣ Fallback to PyMuPDF ----------
        file.seek(0)
        text, error, status = extract_with_pymupdf(file)

        if text and len(text) > 200:
            cleaned = re.sub(r"\s+", " ", text)
            return cleaned, None, 200

        return None, "Could not extract meaningful text from PDF", 400

    except Exception as e:
        return None, "Failed to read PDF file", 500
