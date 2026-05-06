import os
import itertools

# Load keys from environment
GEMINI_KEYS = os.getenv("GEMINI_KEYS", "").split(",")

if not GEMINI_KEYS or GEMINI_KEYS == [""]:
    raise RuntimeError("No GEMINI_KEYS found in environment")

# Round-robin iterator
keyCycle = itertools.cycle(GEMINI_KEYS)

def getNextKey():
    return next(keyCycle)
