import html

# List of high-risk keywords indicating critical mental health crisis or self-harm
CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end my life", "better off dead", 
    "want to die", "self harm", "ending it all", "kill me", 
    "suicidal", "ending my life", "cut myself", "hang myself"
]

def sanitize_input_text(text: str) -> str:
    """
    Sanitize text input by escaping HTML tags to prevent XSS injections.
    """
    if not text:
        return ""
    # Escapes characters like <, >, &, ", and '
    return html.escape(text.strip())

def scan_for_crisis(text: str) -> bool:
    """
    Scan the text input for high-risk self-harm or suicidal keywords.
    Returns True if a crisis indicator is detected.
    """
    if not text:
        return False
    
    clean_text = text.lower()
    for keyword in CRISIS_KEYWORDS:
        if keyword in clean_text:
            return True
            
    return False
