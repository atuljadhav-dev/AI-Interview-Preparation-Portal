from google import genai
import os
from utils.gemini_keys import getNextKey, GEMINI_KEYS

MODEL = os.getenv("MODEL", "gemini-2.5-flash")


class GeminiExhaustedError(Exception):
    """Custom exception to indicate all Gemini API keys are exhausted."""

    pass


def AIClient(content, config):
    attempts = 0
    maxAttempts = len(GEMINI_KEYS)  # number of keys to try

    while attempts < maxAttempts:
        apiKey = getNextKey()

        try:
            client = genai.Client(api_key=apiKey)
            response = client.models.generate_content(
                model=MODEL, contents=content, config=config
            )
            return response

        except Exception as e:
            attempts += 1

    raise GeminiExhaustedError("All Gemini API keys exhausted")
