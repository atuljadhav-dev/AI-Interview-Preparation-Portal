from pypdf import PdfReader
def is_poor_extraction(text: str) -> bool:
    lines = [l.strip() for l in text.splitlines() if l.strip()]

    # Too short for a resume
    if len(text) < 500:
        return True

    # Excessive single-word or very short lines
    single_word_lines = sum(1 for l in lines if len(l.split()) <= 2)
    if single_word_lines / max(len(lines), 1) > 0.4:
        return True

    # Missing key sections
    keywords = ["experience", "education", "skills", "project"]
    if not any(k.lower() in text.lower() for k in keywords):
        return True

    return False

def process_resume_pdf(file):
    """
    Handles file size validation, page count limits, and text extraction.
    Returns (extracted_text, error_message, status_code)
    """
    try:
        reader = PdfReader(file)
        # Limit page count to prevent resource exhaustion
        if len(reader.pages) > 3:
            return None, "PDF too long (Max 3 pages)", 400
            
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text() or ""
        
        if not extracted_text.strip():
            return None, "Could not extract text from PDF", 400
            
        return extracted_text, None, 200
    except Exception as e:
        return None, f"Failed to read PDF file: {str(e)}", 500
