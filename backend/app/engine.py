import os
import random
from google import genai
from google.genai import types
from app.schemas import AnalysisResult, StressTrigger

# Check if GEMINI_API_KEY is present in environment
API_KEY = os.environ.get("GEMINI_API_KEY")

def get_genai_client():
    """
    Initialize the Google GenAI client if an API key is available.
    """
    if not API_KEY:
        return None
    try:
        # Uses the official google-genai SDK
        return genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Google GenAI Client: {e}")
        return None

def generate_simulated_analysis(exam: str, text: str, risk_flagged: bool = False) -> AnalysisResult:
    """
    Client-side simulation engine in python. Matches front-end parameters
    exactly to ensure fully verifiable test coverage even without API keys.
    """
    if risk_flagged:
        return AnalysisResult(
            risk_flagged=True,
            anxiety_score=96,
            emotional_trends=["Critical Overwhelm", "Extreme Isolation", "Helplessness"],
            stress_triggers=[
                StressTrigger(trigger="Severe Exam Pressure Burden", impact="High"),
                StressTrigger(trigger="Mental Health Emergency Trigger", impact="High")
            ],
            mindfulness_exercise="Emergency Safety Checklist: 1. Put away all books. 2. Contact one of the verified helplines immediately. 3. Sit near a window or drink cold water.",
            encouragement="Please pause right now. Your exam preparation, score, and career milestone do not define your life. There are people trained to support you through this exact feeling. Reach out."
        )

    lowercase_text = text.lower()
    base_score = 40
    if len(text) > 50:
        base_score += 10
    if len(text) > 150:
        base_score += 10
    if "stress" in lowercase_text or "anxious" in lowercase_text or "pressure" in lowercase_text:
        base_score += 12
    if "fail" in lowercase_text or "backlog" in lowercase_text or "revision" in lowercase_text:
        base_score += 10
    if "sleep" in lowercase_text or "night" in lowercase_text or "tired" in lowercase_text or "insomnia" in lowercase_text:
        base_score += 13
    if "hopeless" in lowercase_text or "cannot" in lowercase_text or "give up" in lowercase_text:
        base_score += 15

    final_score = min(max(base_score, 15), 100)

    triggers = []
    if "sleep" in lowercase_text or "night" in lowercase_text or "tired" in lowercase_text:
        triggers.append(StressTrigger(trigger="Sleep Quality Deprivation", impact="Severe"))
    if "mock" in lowercase_text or "test" in lowercase_text or "marks" in lowercase_text or "score" in lowercase_text:
        triggers.append(StressTrigger(trigger="Mock Exam Score Anxiety", impact="Severe"))
    if "parent" in lowercase_text or "expect" in lowercase_text or "family" in lowercase_text:
        triggers.append(StressTrigger(trigger="Socio-parental Pressure", impact="Elevated"))
    if "revision" in lowercase_text or "syllabus" in lowercase_text or "backlog" in lowercase_text:
        triggers.append(StressTrigger(trigger="Syllabus Accumulation Burden", impact="Elevated"))
    if "focus" in lowercase_text or "concentrate" in lowercase_text or "distract" in lowercase_text:
        triggers.append(StressTrigger(trigger="Cognitive Attentional Fatigue", impact="Moderate"))

    if not triggers:
        triggers.append(StressTrigger(trigger="General Competitive Exam Strain", impact="Moderate"))
        triggers.append(StressTrigger(trigger="Academic Performance Goal Pressure", impact="Moderate"))

    trends = []
    if final_score >= 80:
        trends.extend(["Severe Stress Loop", "Burnout State", "Extreme Exhaustion"])
    elif final_score >= 55:
        trends.extend(["Substantial Anxiety", "Revision Stress", "Mental fatigue"])
    else:
        trends.extend(["Mild Performance Anxiety", "Exam Preparation Focus"])

    # Empathy encouraging statements
    encouragements = [
        f"You are navigating an incredibly intense phase for {exam}. Remember, your health and peace of mind are worth far more than any exam rank.",
        "Taking it one topic, one page, or one hour at a time is enough. Please allow yourself to take a break today. You are doing your absolute best.",
        "Burnout is a signal that your mind needs rest, not a sign of weakness. Be gentle with your expectations of yourself.",
        "You have overcome tough papers and hard topics before. You are capable, but you are also human. Rest is productive too."
    ]
    selected_encouragement = random.choice(encouragements)

    # Mindfulness exercises
    exercises = [
        "Square Breathing Technique: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Complete 4 rounds.",
        "The 5-4-3-2-1 Grounding: Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste around you.",
        "Dual Mind Relaxer: List 5 items in your study room that are blue, then count backwards from 50 in intervals of 3.",
        "Progressive Muscle Relax: Squeeze your fists tightly for 7 seconds, then let go completely. Experience the sensation of release."
    ]
    selected_exercise = random.choice(exercises)

    return AnalysisResult(
        risk_flagged=False,
        anxiety_score=final_score,
        emotional_trends=trends,
        stress_triggers=triggers,
        mindfulness_exercise=selected_exercise,
        encouragement=selected_encouragement
    )

def analyze_journal_with_gemini(exam: str, text: str, risk_flagged: bool = False) -> AnalysisResult:
    """
    Analyze the journal entry using Google Gemini SDK or local fallback.
    """
    if risk_flagged:
        return generate_simulated_analysis(exam, text, risk_flagged=True)

    client = get_genai_client()
    if not client:
        return generate_simulated_analysis(exam, text)

    try:
        prompt = f"""
        You are a mental health expert and counselor analyzing a student's private journal entry.
        The student is preparing for the competitive examination: {exam}.
        Journal text entry: "{text}"
        
        Analyze the entry to extract:
        1. An anxiety score from 1 to 100 based on the verbal indicators of pressure, fatigue, hopelessness, sleeplessness, etc.
        2. Top 2-3 emotional trend tags (e.g. 'Syllabus Anxiety', 'Chronic Fatigue', 'Determination', 'Imposter Syndrome').
        3. A list of specific identified stress triggers with an impact rating ('Moderate', 'Elevated', 'Severe').
        4. A specific customized mindfulness exercise or cognitive technique to help them disrupt their current stress cycle.
        5. A warm, non-judgmental, exam-contextual empathetic encouragement message.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResult,
                system_instruction="You must analyze the text and output a valid JSON matching the specified schema. Keep triggers concise and realistic."
            )
        )
        return AnalysisResult.model_validate_json(response.text)
    except Exception as e:
        print(f"Google GenAI Call failed, falling back to simulation: {e}")
        return generate_simulated_analysis(exam, text)

def chat_companion_with_gemini(message: str, history_list: list, exam: str) -> str:
    """
    Converse with the student using Google Gemini SDK or local fallback.
    """
    client = get_genai_client()
    if not client:
        # Generate simulated companion chat response
        lower_msg = message.lower()
        if "sleep" in lower_msg or "tired" in lower_msg or "exhausted" in lower_msg:
            return "Sleep is often the first thing we sacrifice under competitive exam pressure, yet it is the foundation of cognitive functioning. Try setting a hard 'digital sunset' tonight. Can you commit to resting 7 hours today?"
        elif "mock" in lower_msg or "marks" in lower_msg or "score" in lower_msg:
            return f"Mock scores can feel like a direct verdict on your future, but they are actually diagnostic logs. They show you where to align your efforts for {exam}, not how smart you are. Let's make a plan to check your mistakes calmly."
        elif "fail" in lower_msg or "fear" in lower_msg or "scared" in lower_msg:
            return f"The fear of failure in examinations like {exam} is incredibly high due to social pressures. Try to decouple your identity from the outcome. You are a valuable person regardless of what sheet is printed on result day."
        else:
            return f"I hear you. The preparation journey for {exam} is grueling, and feeling this weight is part of the challenge. Tell me, what is one small thing you can control in your schedule right now to make you feel slightly more at peace?"

    try:
        # Convert history list to Gemini's expected contents format
        contents = []
        for h in history_list:
            role = h.role if hasattr(h, 'role') else h.get('role', 'user')
            content = h.content if hasattr(h, 'content') else h.get('content', '')
            gemini_role = "user" if role == "user" else "model"
            contents.append(types.Content(role=gemini_role, parts=[types.Part.from_text(text=content)]))

        # Append new message
        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

        system_instruction = f"""
        You are an empathetic, compassionate mental health digital companion for competitive exam students (such as JEE, NEET, UPSC, GATE, CAT).
        The student you are talking to is preparing for: {exam}.
        Your goal is to actively listen, validate their feelings, offer gentle exam-specific counseling support, and suggest healthy cognitive strategies.
        Keep your responses supportive, warm, relatively short, and grounded. Never diagnose medical conditions or give clinical advice.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        return response.text
    except Exception as e:
        print(f"Google GenAI Chat Call failed, falling back: {e}")
        return f"I hear your thoughts about this. Preparing for {exam} takes a lot of mental energy, and feeling this pressure is completely natural. Let's focus on taking a small step. What is one tiny study task you want to work on next?"
