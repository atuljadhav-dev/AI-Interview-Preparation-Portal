from pypdf import PdfReader
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
    if not any(k.lower() in text.lower() for k in keywords):
        return True

    return False

def processResumePdf(file):
    """
    Handles file size validation, page count limits, and text extraction.
    Returns (extractedText, errormessage, statusCode)
    """
    try:
        reader = PdfReader(file)
        # Limit page count to prevent resource exhaustion
        if len(reader.pages) > 3:
            return None, "PDF too long (Max 3 pages)", 400
            
        extractedText = ""
        for page in reader.pages:
            extractedText += page.extract_text() or ""
        
        if not extractedText.strip():
            return None, "Could not extract text from PDF", 400
            
        return extractedText, None, 200
    except Exception as e:
        return None, f"Failed to read PDF file: {str(e)}", 500
