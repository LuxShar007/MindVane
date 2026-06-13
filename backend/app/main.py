from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import JournalInput, AnalysisResult, ChatInput, ChatResponse
from app.security import sanitize_input_text, scan_for_crisis
from app.engine import analyze_journal_with_gemini, chat_companion_with_gemini

app = FastAPI(
    title="MindVane API",
    description="Backend API for MindVane mental health micro-app",
    version="1.0.0"
)

# Enable CORS for frontend compatibility (development and deployment hosts)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/_/backend/api/analyze-journal", response_model=AnalysisResult)
async def analyze_journal(payload: JournalInput):
    """
    Sanitize journal text, run crisis triggers, and perform stress analysis.
    """
    clean_text = sanitize_input_text(payload.journal_text)
    clean_exam = sanitize_input_text(payload.exam)

    if not clean_text:
        raise HTTPException(status_code=400, detail="Journal entry cannot be empty.")

    # 1. Security Check: Crisis scanning
    risk_flagged = scan_for_crisis(clean_text)

    # 2. Process via Gemini SDK or Simulation
    result = analyze_journal_with_gemini(clean_exam, clean_text, risk_flagged)
    return result

@app.post("/_/backend/api/chat-companion", response_model=ChatResponse)
async def chat_companion(payload: ChatInput):
    """
    Sanitize chat messages, extract history contexts, and respond empathetically.
    """
    clean_message = sanitize_input_text(payload.message)
    if not clean_message:
        raise HTTPException(status_code=400, detail="Chat message cannot be empty.")

    # Sanitize and bound history to the last 15 interactions for token efficiency
    sanitized_history = []
    recent_history = payload.history[-15:] if payload.history else []
    for h in recent_history:
        sanitized_history.append({
            "role": sanitize_input_text(h.role),
            "content": sanitize_input_text(h.content)
        })

    # Deduce target exam from text context, defaulting to standard JEE
    exam_context = "JEE"
    search_context = clean_message.lower() + " " + " ".join([h["content"].lower() for h in sanitized_history])
    for exam in ["NEET", "CAT", "GATE", "UPSC", "BOARDS", "JEE"]:
        if exam.lower() in search_context or ("board" in search_context and exam == "BOARDS"):
            exam_context = exam
            break

    # Get response from companion
    reply = chat_companion_with_gemini(clean_message, sanitized_history, exam_context)
    return ChatResponse(reply=reply)
