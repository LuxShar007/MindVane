from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class StudentTrack(str, Enum):
    """
    Explicit student tracking paths supporting competitive examinations and school boards.
    """
    JEE = "JEE"
    NEET = "NEET"
    GATE = "GATE"
    UPSC = "UPSC"
    CAT = "CAT"
    CBSE_12TH = "CBSE_12TH"
    STATE_BOARDS = "STATE_BOARDS"

class StressTrigger(BaseModel):
    """
    A specific hidden stress trigger identified from text logs.
    """
    name: str = Field(
        ..., 
        description="The localized name or source of the hidden stress trigger (e.g. syllabus backlog, peer comparison)"
    )
    impact: str = Field(
        ..., 
        description="The computed impact rating of the stress trigger (e.g. Low, Medium, High, Severe)"
    )

class BurnoutAnalysisResponse(BaseModel):
    """
    Response model outlining the mental health workload and diagnostic indexes of a student.
    """
    anxietyScore: int = Field(
        ..., 
        ge=1, 
        le=100, 
        description="Calculated anxiety index scaled exactly from 1 to 100"
    )
    primaryTrend: str = Field(
        ..., 
        description="The dominant psychological tracking pattern detected in text logs"
    )
    triggers: List[StressTrigger] = Field(
        ..., 
        description="List of specific stress triggers with localized impact labels"
    )
    exercise: str = Field(
        ..., 
        description="An adaptive, customized mindfulness grounding drill recommended for relief"
    )
    encouragement: str = Field(
        ..., 
        description="A supportive, exam-contextual empathetic marquee sentence"
    )
    recommended_wave: str = Field(
        ..., 
        description="Binaural soundscape recommendation (e.g. '4Hz Theta Waves', '40Hz Gamma Waves')"
    )
    risk_flagged: bool = Field(
        ..., 
        description="Safety flag set to True if acute distress or self-harm warnings are triggered"
    )

class AtomicStep(BaseModel):
    """
    An individual actionable task designed to dismantle syllabus backlogs.
    """
    task_name: str = Field(
        ..., 
        description="Name of the actionable step to perform"
    )
    estimated_minutes: int = Field(
        ..., 
        ge=0, 
        description="The time in minutes estimated to finish the step"
    )
    priority: str = Field(
        ..., 
        description="The urgency tier of this action (e.g. High, Medium, Low)"
    )

class DeclutterResponse(BaseModel):
    """
    Structured framework designed to assist students in resolving study backlogs.
    """
    reassurance: str = Field(
        ..., 
        description="Structured reassuring counseling message addressing target backlog stress"
    )
    atomic_steps: List[AtomicStep] = Field(
        ..., 
        description="Sequential list of atomic tasks to de-clutter syllabus loads"
    )

# --- BACKWARDS COMPATIBILITY SCHEMAS ---
# Preserved to ensure existing endpoints and automated pytest routes continue to build
class JournalInput(BaseModel):
    exam: str = Field(..., description="Target exam or board exams (e.g. JEE, NEET, BOARDS, UPSC)")
    journal_text: str = Field(..., description="Self-reported text thoughts from the student")

class LegacyStressTrigger(BaseModel):
    trigger: str = Field(..., description="Identified stress source")
    impact: str = Field(..., description="Impact level")

class AnalysisResult(BaseModel):
    risk_flagged: bool = Field(..., description="True if self-harm or critical distress indicators are present")
    anxiety_score: int = Field(..., description="Calculated anxiety index from 1 to 100")
    emotional_trends: List[str] = Field(..., description="Top emotional states detected in text")
    stress_triggers: List[LegacyStressTrigger] = Field(..., description="List of itemized stressors")
    mindfulness_exercise: str = Field(..., description="Adaptive tailored exercise recommendation")
    encouragement: str = Field(..., description="Empathetic encouragement message")

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender, either 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatInput(BaseModel):
    message: str = Field(..., description="Latest user message")
    history: List[ChatMessage] = Field(..., description="Full chat history")
    exam: Optional[str] = Field("JEE", description="Target exam context for the chat")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Empathetic response from the companion")
