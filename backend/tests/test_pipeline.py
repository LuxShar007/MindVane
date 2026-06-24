import sys
import os
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

# Adjust path to enable importing from app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.schemas import (
    BurnoutAnalysisResponse, 
    DeclutterResponse, 
    StressTrigger, 
    AtomicStep
)
from app.security import clean_payload_text

client = TestClient(app)

# ==============================================================================
# SECTION 1: CORE UTILITIES & SECURITY TESTS
# ==============================================================================

def test_security_sanitization_xss_protection():
    """
    Audit security sanitization routines.
    Confirm HTML tags, script blocks, and iframes are escaped to prevent XSS payloads
    while keeping authentic text intact.
    """
    # 1. Malicious script tags escaping check
    xss_payload = "I am stressed. <script>alert('XSS')</script> Can you help?"
    sanitized = clean_payload_text(xss_payload)
    
    assert "<script>" not in sanitized
    assert "&lt;script&gt;" in sanitized
    assert "I am stressed." in sanitized
    assert "Can you help?" in sanitized

    # 2. Malicious iframe embedding check
    iframe_payload = "Study notes here: <iframe src='http://malicious.site'></iframe>"
    sanitized_iframe = clean_payload_text(iframe_payload)
    
    assert "<iframe>" not in sanitized_iframe
    assert "&lt;iframe" in sanitized_iframe
    assert "Study notes here:" in sanitized_iframe


def test_pydantic_schema_validation_ranges():
    """
    Audit structural schema parsing parameters in BurnoutAnalysisResponse and DeclutterResponse.
    Pass mock payloads to validate constraints (e.g., ge=1, le=100 anxiety scores, risk overrides).
    """
    # 1. Valid BurnoutAnalysisResponse payload parsing
    valid_data = {
        "anxietyScore": 75,
        "primaryTrend": "Mock Exam Stress",
        "triggers": [
            {"name": "Syllabus Backlog", "impact": "High"}
        ],
        "exercise": "Box breathing 4s",
        "encouragement": "Take it slow.",
        "recommended_wave": "4Hz Theta Waves",
        "risk_flagged": False
    }
    obj = BurnoutAnalysisResponse(**valid_data)
    assert obj.anxietyScore == 75
    assert obj.risk_flagged is False
    assert len(obj.triggers) == 1
    assert obj.recommended_wave == "4Hz Theta Waves"
    
    # 2. Out-of-bounds anxietyScore range (ge=1, le=100) - high edge
    invalid_data_high = valid_data.copy()
    invalid_data_high["anxietyScore"] = 105
    with pytest.raises(ValidationError):
        BurnoutAnalysisResponse(**invalid_data_high)
        
    # 3. Out-of-bounds anxietyScore range (ge=1, le=100) - low edge
    invalid_data_low = valid_data.copy()
    invalid_data_low["anxietyScore"] = 0
    with pytest.raises(ValidationError):
        BurnoutAnalysisResponse(**invalid_data_low)
        
    # 4. Valid DeclutterResponse payload parsing
    valid_declutter = {
        "reassurance": "You can resolve this backlog step-by-step.",
        "atomic_steps": [
            {"task_name": "Read biology chapter 1", "estimated_minutes": 20, "priority": "High"},
            {"task_name": "Solve physics kinematics Q1", "estimated_minutes": 15, "priority": "Medium"}
        ]
    }
    declutter_obj = DeclutterResponse(**valid_declutter)
    assert len(declutter_obj.atomic_steps) == 2
    assert declutter_obj.atomic_steps[0].estimated_minutes == 20
    
    # 5. Invalid DeclutterResponse step estimated_minutes (must be ge=0)
    invalid_declutter = valid_declutter.copy()
    invalid_declutter["atomic_steps"] = [
        {"task_name": "Negative time constraint", "estimated_minutes": -5, "priority": "High"}
    ]
    with pytest.raises(ValidationError):
        DeclutterResponse(**invalid_declutter)

# ==============================================================================
# SECTION 2: ENDPOINT INTEGRATION TESTS
# ==============================================================================

def test_analyze_journal_normal():
    """
    Test standard, safe journaling text inputs.
    """
    response = client.post(
        "/_/backend/api/analyze-journal",
        json={
            "exam": "JEE",
            "journal_text": "I feel slightly stressed about mock exams and physics syllabus revision. I need to plan my time better."
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_flagged"] is False
    assert 1 <= data["anxiety_score"] <= 100
    assert isinstance(data["emotional_trends"], list)
    assert len(data["stress_triggers"]) > 0
    assert "mindfulness_exercise" in data
    assert "encouragement" in data


def test_analyze_journal_crisis():
    """
    Test crisis keyword triggers (suicidal ideation safety scanner).
    """
    response = client.post(
        "/_/backend/api/analyze-journal",
        json={
            "exam": "UPSC",
            "journal_text": "I want to end my life, everything is pointless. I am considering suicide."
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_flagged"] is True
    assert data["anxiety_score"] >= 90
    assert "mindfulness_exercise" in data
    assert "encouragement" in data


def test_analyze_journal_sanitization():
    """
    Test HTML escaping security parameters against XSS vector inputs.
    """
    payload_text = "I feel stressed. <script>alert('hack')</script>"
    response = client.post(
        "/_/backend/api/analyze-journal",
        json={
            "exam": "GATE",
            "journal_text": payload_text
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data is not None


def test_chat_companion():
    """
    Test basic chat companion interaction schema endpoints.
    """
    response = client.post(
        "/_/backend/api/chat-companion",
        json={
            "message": "I am feeling extremely tired today, my head hurts.",
            "history": [
                {"role": "user", "content": "Hello"},
                {"role": "assistant", "content": "Hi! How can I help you today?"}
            ]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert isinstance(data["reply"], str)
    assert len(data["reply"]) > 0


def test_chat_companion_fallback_states(monkeypatch):
    """
    Test the chatbot companion state machine / simulated fallback responses.
    Specifically tests greeting, parting, and state-aware followups (sleep, mock, fear, control).
    """
    # Force get_genai_client to return None to test the simulation fallback logic
    from app import engine
    monkeypatch.setattr(engine, "get_genai_client", lambda: None)
    
    # 1. Greeting
    reply = engine.chat_companion_with_gemini("hi there", [], "JEE")
    assert "MindVane Companion" in reply or "support" in reply
    
    # 2. Parting
    reply = engine.chat_companion_with_gemini("goodbye", [], "JEE")
    assert "Goodbye" in reply or "Take care" in reply
    
    # 3. Gratitude
    reply = engine.chat_companion_with_gemini("thank you so much", [], "JEE")
    assert "welcome" in reply or "here if you need to talk" in reply
    
    # 4. Crisis handling
    reply = engine.chat_companion_with_gemini("i want to die", [], "JEE")
    assert "KIRAN" in reply or "Tele-MANAS" in reply
    
    # 5. Sleep commit yes
    history = [
        {"role": "user", "content": "I am so tired"},
        {"role": "assistant", "content": "Can you commit to resting 7 hours today?"}
    ]
    reply = engine.chat_companion_with_gemini("yes, I can", history, "JEE")
    assert "great choice" in reply or "planning to sleep" in reply
    
    # 6. Sleep commit no
    reply = engine.chat_companion_with_gemini("no, too busy", history, "JEE")
    assert "completely understand" in reply or "even 6 hours" in reply
    
    # 7. Sleep planning
    history_planning = [
        {"role": "user", "content": "yes"},
        {"role": "assistant", "content": "What time are you planning to sleep tonight?"}
    ]
    reply = engine.chat_companion_with_gemini("around 11 PM", history_planning, "JEE")
    assert "turn off your phone" in reply
    
    # 8. Control schedule - study topic
    history_control = [
        {"role": "user", "content": "stressed"},
        {"role": "assistant", "content": "what is one small thing you can control in your schedule?"}
    ]
    reply = engine.chat_companion_with_gemini("I need to revise physics", history_control, "JEE")
    assert "Pomodoro" in reply or "starting point" in reply
    
    # 9. Control schedule - relaxation
    reply = engine.chat_companion_with_gemini("I will take a walk", history_control, "JEE")
    assert "prioritize your well-being" in reply or "short break" in reply
    
    # 10. Control schedule - idk/nothing
    reply = engine.chat_companion_with_gemini("nothing, I idk", history_control, "JEE")
    assert "three deep breaths" in reply


def test_empty_payload_rejection():
    """
    Test input validation failure handling (HTTP 400).
    """
    response = client.post(
        "/_/backend/api/analyze-journal",
        json={
            "exam": "JEE",
            "journal_text": "   "
        }
    )
    assert response.status_code == 400


def test_engine_generate_burnout_analytics():
    """
    Verify engine burnout analytics logic for Board and Competitive tracks.
    """
    from app.engine import generate_burnout_analytics
    from app.schemas import BurnoutAnalysisResponse
    
    # Test Competitive Exam Path
    result = generate_burnout_analytics("JEE", "I feel so stressed about mock ranks and percentile drop.")
    assert isinstance(result, BurnoutAnalysisResponse)
    assert 1 <= result.anxietyScore <= 100
    assert result.risk_flagged is False
    assert result.recommended_wave in ['4Hz Theta Waves', '40Hz Gamma Waves']
    
    # Test Board Exam Path
    result_board = generate_burnout_analytics("CBSE_12TH", "I am exhausted by parental expectation and percentage pressure.")
    assert isinstance(result_board, BurnoutAnalysisResponse)
    assert 1 <= result_board.anxietyScore <= 100


def test_engine_generate_backlog_breakdown():
    """
    Verify backlog declutter breakdown outputs.
    """
    from app.engine import generate_backlog_breakdown
    from app.schemas import DeclutterResponse
    
    result = generate_backlog_breakdown("JEE", "Backlog: 5 physics chapters, 3 chemistry chapters.")
    assert isinstance(result, DeclutterResponse)
    assert 3 <= len(result.atomic_steps) <= 4
    for step in result.atomic_steps:
        assert step.task_name is not None
        assert step.estimated_minutes >= 0
        assert step.priority in ["High", "Medium", "Low"]


def test_api_declutter_backlog():
    """
    Verify /api/declutter-backlog route returns structural declutter frameworks.
    """
    response = client.post(
        "/api/declutter-backlog",
        json={
            "exam": "NEET",
            "raw_backlog": "Need to revise genetics backlog, circular motion kinematics, and organic carbonyl chemistry."
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "reassurance" in data
    assert 3 <= len(data["atomic_steps"]) <= 4
    for step in data["atomic_steps"]:
        assert "task_name" in step
        assert step["estimated_minutes"] >= 0
        assert step["priority"] in ["High", "Medium", "Low"]


def test_api_declutter_backlog_empty_rejection():
    """
    Verify that blank backlog payload triggers HTTP 400 validation error.
    """
    response = client.post(
        "/api/declutter-backlog",
        json={
            "exam": "JEE",
            "raw_backlog": "    "
        }
    )
    assert response.status_code == 400


def test_analyze_journal_accepts_mood_parameter():
    """
    Verify that the analyze-journal endpoint correctly accepts and processes
    an optional 'mood' parameter without raising a server error.
    All recognised mood values must return HTTP 200 with a valid response.
    """
    for mood_value in ("Happy", "Sad", "Anxious", "Tired", "Angry"):
        response = client.post(
            "/_/backend/api/analyze-journal",
            json={
                "exam": "JEE",
                "journal_text": "Feeling overwhelmed with exam pressure and backlogs.",
                "mood": mood_value,
            },
        )
        assert response.status_code == 200, (
            f"Expected HTTP 200 for mood='{mood_value}', got {response.status_code}"
        )
        data = response.json()
        assert "anxiety_score" in data
        assert 1 <= data["anxiety_score"] <= 100


def test_analyze_journal_coping_strategy_in_response():
    """
    Verify that the burnout analysis response includes a 'coping_strategy' field
    containing a non-empty string when mood context is provided.
    This field enables the Hyper-Personalized Coping Strategy feature.
    """
    response = client.post(
        "/_/backend/api/analyze-journal",
        json={
            "exam": "NEET",
            "journal_text": "I am exhausted and anxious about biology mock results.",
            "mood": "Anxious",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "coping_strategy" in data, "Response must include 'coping_strategy' field"
    assert isinstance(data["coping_strategy"], str)
    assert len(data["coping_strategy"]) > 0, "coping_strategy must be a non-empty string"


def test_analyze_journal_cuet_track_support():
    """
    Verify that the CUET exam track is accepted by the API endpoint and
    processed without server-side errors. CUET was introduced alongside the
    challenge alignment improvements.
    """
    response = client.post(
        "/_/backend/api/analyze-journal",
        json={
            "exam": "CUET",
            "journal_text": "I am preparing for CUET and feeling overwhelmed by the vast syllabus.",
            "mood": "Tired",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["risk_flagged"] is False
    assert 1 <= data["anxiety_score"] <= 100
    assert isinstance(data["emotional_trends"], list)
    assert "mindfulness_exercise" in data

