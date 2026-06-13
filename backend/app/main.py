from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.schemas import (
    JournalInput, 
    BurnoutAnalysisResponse, 
    DeclutterResponse,
    ChatInput, 
    ChatResponse,
    AnalysisResult
)
from app.security import clean_payload_text, scan_for_crisis
from app.engine import (
    generate_burnout_analytics, 
    generate_backlog_breakdown,
    chat_companion_with_gemini,
    analyze_journal_with_gemini
)

# 1. Instantiate FastAPI application with explicit title and version
app = FastAPI(
    title="AntiGravity API",
    description="Backend micro-service validating student cognitive analytics & companion logic",
    version="2.0.0"
)

# 2. Configure CORSMiddleware allowing wildcard origin headers to prevent handshake failures
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic input contract for declutter backlog route
class BacklogInput(BaseModel):
    exam: str = Field(..., description="Target exam path (e.g. JEE, NEET, BOARDS, UPSC)")
    raw_backlog: str = Field(..., description="The student's raw backlog details to declutter")

# 3. Expose POST route pointing to /api/analyze-journal
@app.post("/api/analyze-journal", response_model=BurnoutAnalysisResponse)
async def analyze_journal(payload: JournalInput):
    """
    Ingests exam state and journal text to yield deep burnout analytics.
    """
    # 5 & 6. Ingest string cleansing and validate input length parameters (throw HTTP 400 if blank)
    cleaned_text = clean_payload_text(payload.journal_text)
    cleaned_exam = clean_payload_text(payload.exam)

    if not cleaned_text or cleaned_text.isspace():
        raise HTTPException(status_code=400, detail="Journal entry cannot be empty or purely whitespace.")
    if not cleaned_exam or cleaned_exam.isspace():
        raise HTTPException(status_code=400, detail="Exam track parameter cannot be empty or purely whitespace.")

    try:
        return generate_burnout_analytics(cleaned_exam, cleaned_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnostic analyzer execution failed: {str(e)}")

# Legacy support endpoint for previous frontend client configurations
@app.post("/_/backend/api/analyze-journal", response_model=AnalysisResult)
async def analyze_journal_legacy(payload: JournalInput):
    """
    Legacy endpoint mapping to standard frontend expected parameters.
    """
    cleaned_text = clean_payload_text(payload.journal_text)
    cleaned_exam = clean_payload_text(payload.exam)

    if not cleaned_text or cleaned_text.isspace():
        raise HTTPException(status_code=400, detail="Journal entry cannot be empty or purely whitespace.")
    if not cleaned_exam or cleaned_exam.isspace():
        raise HTTPException(status_code=400, detail="Exam track parameter cannot be empty or purely whitespace.")

    try:
        return analyze_journal_with_gemini(cleaned_exam, cleaned_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Legacy analyzer execution failed: {str(e)}")

# 4. Expose POST route pointing to /api/declutter-backlog (and legacy support)
@app.post("/api/declutter-backlog", response_model=DeclutterResponse)
@app.post("/_/backend/api/declutter-backlog", response_model=DeclutterResponse)
async def declutter_backlog(payload: BacklogInput):
    """
    Ingests backlog text to output an atomic de-clutter study framework.
    """
    cleaned_backlog = clean_payload_text(payload.raw_backlog)
    cleaned_exam = clean_payload_text(payload.exam)

    if not cleaned_backlog or cleaned_backlog.isspace():
        raise HTTPException(status_code=400, detail="Backlog description cannot be empty or purely whitespace.")
    if not cleaned_exam or cleaned_exam.isspace():
        raise HTTPException(status_code=400, detail="Exam track parameter cannot be empty or purely whitespace.")

    try:
        return generate_backlog_breakdown(cleaned_exam, cleaned_backlog)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backlog breakdown execution failed: {str(e)}")

# --- LEGACY WRAPPER ENDPOINTS ---
# Exposing chat companion to ensure existing frontend React chatbot continues to operate
@app.post("/api/chat-companion", response_model=ChatResponse)
@app.post("/_/backend/api/chat-companion", response_model=ChatResponse)
async def chat_companion(payload: ChatInput):
    """
    Ingest user chat message and history to reply empathetically.
    """
    cleaned_message = clean_payload_text(payload.message)
    if not cleaned_message or cleaned_message.isspace():
        raise HTTPException(status_code=400, detail="Chat message cannot be empty or purely whitespace.")

    sanitized_history = []
    recent_history = payload.history[-15:] if payload.history else []
    for h in recent_history:
        sanitized_history.append({
            "role": clean_payload_text(h.role),
            "content": clean_payload_text(h.content)
        })

    # Default to JEE context
    exam_context = "JEE"
    search_context = cleaned_message.lower() + " " + " ".join([h["content"].lower() for h in sanitized_history])
    for exam in ["NEET", "CAT", "GATE", "UPSC", "BOARDS", "JEE"]:
        if exam.lower() in search_context or ("board" in search_context and exam == "BOARDS"):
            exam_context = exam
            break

    reply = chat_companion_with_gemini(cleaned_message, sanitized_history, exam_context)
    return ChatResponse(reply=reply)
