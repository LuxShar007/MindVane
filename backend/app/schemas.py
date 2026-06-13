from pydantic import BaseModel, Field
from typing import List

class JournalInput(BaseModel):
    exam: str = Field(..., description="Target exam (e.g. JEE, NEET, CAT, GATE, UPSC)")
    journal_text: str = Field(..., description="Self-reported text thoughts from the student")

class StressTrigger(BaseModel):
    trigger: str = Field(..., description="Identified stress source")
    impact: str = Field(..., description="Impact level, e.g. Low, Medium, High, Moderate, Elevated, Severe")

class AnalysisResult(BaseModel):
    risk_flagged: bool = Field(..., description="True if self-harm or critical distress indicators are present")
    anxiety_score: int = Field(..., description="Calculated anxiety index from 1 to 100")
    emotional_trends: List[str] = Field(..., description="Top emotional states detected in text")
    stress_triggers: List[StressTrigger] = Field(..., description="List of itemized stressors with impact ratings")
    mindfulness_exercise: str = Field(..., description="Adaptive tailored exercise recommendation")
    encouragement: str = Field(..., description="Empathetic, exam-contextual encouragement message")

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender, either 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatInput(BaseModel):
    message: str = Field(..., description="Latest user message")
    history: List[ChatMessage] = Field(..., description="Full chat history including user and companion responses")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Empathetic response from the companion")
