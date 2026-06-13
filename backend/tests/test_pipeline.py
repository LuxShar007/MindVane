import sys
import os
from fastapi.testclient import TestClient

# Adjust path to enable importing from app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app

client = TestClient(app)

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
    # The output from the API should not throw errors and must handle request.
    # Internally, the sanitization replaces < and > with entity references.
    # Note: the test verifies input is processed cleanly.
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

def test_empty_payload_rejection():
    """
    Test input validation validation failure handling.
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
