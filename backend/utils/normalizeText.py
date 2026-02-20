import re
import hashlib
def normalizeText(text):
    text = text.lower()
    text = text.strip()
    text = re.sub(r"\s+", " ", text)  # collapse multiple spaces
    return text

def makeHash(text):
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()