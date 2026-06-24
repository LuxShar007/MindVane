"""
MindVane Engine — Handles Google GenAI SDK integration, prompt engineering,
and simulation fallbacks for all burnout analysis and backlog declutter endpoints.
"""
import os
from typing import Optional, List, Dict, Tuple
from google import genai
from google.genai import types
from app.schemas import (
    AnalysisResult, 
    StressTrigger, 
    LegacyStressTrigger, 
    BurnoutAnalysisResponse, 
    DeclutterResponse, 
    AtomicStep
)

# Load .env file manually if it exists from potential relative directories
env_paths = [
    ".env",
    "backend/.env",
    os.path.join(os.path.dirname(__file__), "..", ".env"),
    os.path.join(os.path.dirname(__file__), "..", "..", ".env")
]
for path in env_paths:
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip()
            break
        except (IOError, OSError, ValueError) as env_err:
            print(f"Warning: Failed to load .env from {path}: {env_err}")

# Check if GEMINI_API_KEY is present in environment
API_KEY = os.environ.get("GEMINI_API_KEY")

_client: Optional[genai.Client] = None

def get_genai_client() -> Optional[genai.Client]:
    """
    Initialize the Google GenAI client if an API key is available.
    Uses global caching to avoid repeated client creation overhead.
    """
    global _client
    if _client is not None:
        return _client
    if not API_KEY:
        return None
    try:
        # Uses the official google-genai SDK
        _client = genai.Client(api_key=API_KEY)
        return _client
    except Exception as e:
        print(f"Warning: Failed to initialize Google GenAI Client: {e}")
        return None

# --- NEW FULL-STACK ENGINE FUNCTIONS ---

def generate_burnout_analytics(exam: str, journal_entry: str, mood: str = "Anxious") -> BurnoutAnalysisResponse:
    """
    Analyze student journal entries for hidden burnout patterns using Gemini 2.5 Flash.
    """
    # 1. System instructions profiling based on Board exams vs Competitive exams
    is_board = exam in ["CBSE_12TH", "STATE_BOARDS"] or "board" in exam.lower()
    
    if is_board:
        profile_instruction = """
        Focus on school Board Exams anxiety, perfectionism, rote learning fatigue, 
        and parental/societal percentage benchmark stress.
        """
    else:
        profile_instruction = """
        Focus on Competitive Entrance Exams pressure, mock test percentile drops, 
        relative ranking anxiety, and negative marking dread.
        """

    system_instruction = f"""
    You are a supportive, expert mental health counselor for students. 
    Profile Instruction: {profile_instruction}
    
    Student's self-reported mood state is: {mood}. Incorporate this feeling contextually into your diagnostics and coping guidance.
    
    CRITICAL SAFETY REQUIREMENT: You must evaluate the student's entry for clinical self-harm or deep emotional crisis.
    If suicidal ideation or self-harm warnings are present, you MUST set `risk_flagged` to true immediately.
    
    You must output a structured JSON strictly matching the BurnoutAnalysisResponse schema.
    Be extremely precise and concise to minimize response latency.
    Keep the exercise parameter under 2 sentences, the encouragement parameter under 1 sentence, the coping_strategy parameter under 2 sentences, and each stress trigger name to 2-4 words.
    """

    client = get_genai_client()
    if not client:
        return get_simulated_burnout_analytics(exam, journal_entry, mood)

    try:
        prompt = f"Syllabus Track: {exam}\nStudent Mood: {mood}\nJournal Entry: {journal_entry}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,  # Objective Diagnostic Calculation
                response_mime_type="application/json",
                response_schema=BurnoutAnalysisResponse,
                system_instruction=system_instruction,
                max_output_tokens=350
            )
        )
        
        result = BurnoutAnalysisResponse.model_validate_json(response.text)
        
        # Override Wave configurations: anxiety Score > 60 -> '4Hz Theta Waves', else -> '40Hz Gamma Waves'
        if result.anxietyScore > 60:
            result.recommended_wave = '4Hz Theta Waves'
        else:
            result.recommended_wave = '40Hz Gamma Waves'
            
        return result
    except Exception as e:
        print(f"GenAI generate_burnout_analytics failed, falling back: {e}")
        return get_simulated_burnout_analytics(exam, journal_entry, mood)

def generate_backlog_breakdown(exam: str, raw_backlog: str) -> DeclutterResponse:
    """
    Break down chaotic syllabus backlogs into microscopic actionable steps.
    """
    system_instruction = f"""
    You are a student cognitive coach helping a student preparing for {exam}.
    De-clutter their syllabus backlog into EXACTLY 3 to 4 microscopic, low-friction actionable steps.
    Make each step highly specific, provide estimated_minutes (5 to 45 mins), and task priority ('High', 'Medium', 'Low').
    Include a warm, structuring reassurance sentence addressing their backlog overwhelm.
    Be extremely precise and concise to minimize response latency: limit the reassurance to 1 sentence, and keep task names to 3-6 words.
    You must return a structured JSON strictly matching the DeclutterResponse schema.
    """

    client = get_genai_client()
    if not client:
        return get_simulated_backlog_breakdown(exam, raw_backlog)

    try:
        prompt = f"Student Backlog: {raw_backlog}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.4,
                response_mime_type="application/json",
                response_schema=DeclutterResponse,
                system_instruction=system_instruction,
                max_output_tokens=300
            )
        )
        
        result = DeclutterResponse.model_validate_json(response.text)
        
        # Enforce exactly 3-4 steps constraint
        if len(result.atomic_steps) < 3 or len(result.atomic_steps) > 4:
            result.atomic_steps = result.atomic_steps[:4]
            while len(result.atomic_steps) < 3:
                result.atomic_steps.append(AtomicStep(
                    task_name="Revise standard high-yield equations page",
                    estimated_minutes=15,
                    priority="Medium"
                ))
                
        return result
    except Exception as e:
        print(f"GenAI generate_backlog_breakdown failed, falling back: {e}")
        return get_simulated_backlog_breakdown(exam, raw_backlog)

# --- RESILIENT SANDBOX FALLBACKS ---

def get_simulated_burnout_analytics(exam: str, journal_entry: str, mood: str = "Anxious") -> BurnoutAnalysisResponse:
    """
    Simulate burnout analytics for local sandbox development.
    """
    from app.security import scan_for_crisis
    risk_flagged = scan_for_crisis(journal_entry)

    if risk_flagged:
        return BurnoutAnalysisResponse(
            anxietyScore=95,
            primaryTrend="Critical Overwhelm State",
            triggers=[
                StressTrigger(name="Severe Academic Load", impact="Severe"),
                StressTrigger(name="Emotional Burnout Threshold", impact="Severe")
            ],
            exercise="Self-Care Checklist: Put books away, sip cool water, and contact helpline.",
            encouragement="Your safety and health are more valuable than any milestone. Please reach out.",
            recommended_wave="4Hz Theta Waves",
            risk_flagged=True,
            coping_strategy="Stop studying immediately. Focus on grounding techniques: touch 5 physical objects, sip water, and talk to a professional counselor."
        )

    lowercase_text = journal_entry.lower()
    base_score = 42
    if len(journal_entry) > 100:
        base_score += 15
    if "fail" in lowercase_text or "anxious" in lowercase_text or "stressed" in lowercase_text:
        base_score += 18
    if "sleep" in lowercase_text or "tired" in lowercase_text:
        base_score += 12

    score = min(max(base_score, 10), 100)
    wave = '4Hz Theta Waves' if score > 60 else '40Hz Gamma Waves'
    
    is_board = exam in ["CBSE_12TH", "STATE_BOARDS"] or "board" in exam.lower()
    trend = "School Perfectionism Fatigue" if is_board else "Competitive Percentile Pressure"

    triggers = []
    if "sleep" in lowercase_text or "tired" in lowercase_text:
        triggers.append(StressTrigger(name="Sleep Deprivation Study Loop", impact="High"))
    if "revision" in lowercase_text or "backlog" in lowercase_text:
        triggers.append(StressTrigger(name="Syllabus Backlog Burden", impact="High"))

    if not triggers:
        triggers.append(StressTrigger(name="General Course Schedule Strain", impact="Medium"))

    # Dynamic coping strategies based on selected mood/score
    if score > 75:
        coping = f"Step back from {exam} study for 20 mins. Write down only 1 topic to tackle next, and ignore all scores."
    elif mood.lower() in ["tired", "exhausted"]:
        coping = "Prioritize sleep hygiene: set a strict sleep window, shut off all screens, and review notes only in daylight."
    else:
        coping = f"Focus on active recall instead of re-reading. Break your {exam} syllabus into timeblocks of 25 minutes."

    return BurnoutAnalysisResponse(
        anxietyScore=score,
        primaryTrend=trend,
        triggers=triggers,
        exercise="Try box breathing: Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.",
        encouragement="Take it one subject at a time. Academic pressure is intense, but you are resilient.",
        recommended_wave=wave,
        risk_flagged=False,
        coping_strategy=coping
    )

def get_simulated_backlog_breakdown(exam: str, raw_backlog: str) -> DeclutterResponse:
    """
    Simulate backlog de-clutter for local sandbox development.
    """
    return DeclutterResponse(
        reassurance="Syllabus overload causes immediate paralysis. Break this block down to clear the pressure.",
        atomic_steps=[
            AtomicStep(
                task_name=f"Open one chapter of {exam} backlog and list top 3 core topics",
                estimated_minutes=15,
                priority="High"
            ),
            AtomicStep(
                task_name="Solve exactly 2 simple previous year questions for the first topic",
                estimated_minutes=25,
                priority="High"
            ),
            AtomicStep(
                task_name="Close books and summarize formula details from memory in 5 minutes",
                estimated_minutes=10,
                priority="Medium"
            )
        ]
    )

# --- BACKWARDS COMPATIBILITY WRAPPERS ---

def analyze_journal_with_gemini(exam: str, text: str, risk_flagged: bool = False, mood: str = "Anxious") -> AnalysisResult:
    """
    Wrapper mapping the new BurnoutAnalysisResponse schemas to the legacy AnalysisResult payload format.
    """
    # Safety keywords override
    from app.security import scan_for_crisis
    flagged = risk_flagged or scan_for_crisis(text)
    
    analytics = generate_burnout_analytics(exam, text, mood)
    
    legacy_triggers = []
    for t in analytics.triggers:
        legacy_triggers.append(LegacyStressTrigger(trigger=t.name, impact=t.impact))
        
    return AnalysisResult(
        risk_flagged=analytics.risk_flagged or flagged,
        anxiety_score=analytics.anxietyScore,
        emotional_trends=[analytics.primaryTrend],
        stress_triggers=legacy_triggers,
        mindfulness_exercise=analytics.exercise,
        encouragement=analytics.encouragement,
        coping_strategy=analytics.coping_strategy
    )

def chat_companion_with_gemini(message: str, history_list: List[Any], exam: str) -> str:
    """
    Empathetic chatbot companion using Google GenAI SDK.
    """
    def run_simulation() -> str:
        lower_msg = message.lower()
        exam_name = "Board Exams" if exam in ["CBSE_12TH", "STATE_BOARDS"] else exam
        
        # Find the last assistant message in history to maintain context
        last_assistant_msg = ""
        if history_list:
            for h in reversed(history_list):
                role = h.role if hasattr(h, 'role') else h.get('role', 'user')
                content = h.content if hasattr(h, 'content') else h.get('content', '')
                if role in ['assistant', 'model']:
                    last_assistant_msg = content
                    break
        
        last_assistant_msg_lower = last_assistant_msg.lower()
        
        # Common helper definitions for checking user response types
        yes_keywords = ['yes', 'yeah', 'yep', 'sure', 'ok', 'will do', 'i can', 'try', 'definitely', 'agree']
        no_keywords = ['no', 'cannot', "can't", 'hard', 'difficult', 'impossible', 'busy', 'not now', 'nah']
        
        is_yes = any(word in lower_msg for word in yes_keywords)
        is_no = any(word in lower_msg for word in no_keywords)
        
        # 1. Basic greeting / parting / gratitude handling
        greetings = ['hello', 'hi ', 'hi!', 'hey ', 'hey!', 'greetings', 'who are you', 'what can you do']
        if any(lower_msg.startswith(g) for g in greetings) or lower_msg == 'hi':
            return "Hello! I am your MindVane Companion. I'm here to support you with exam stress, study backlogs, or sleep fatigue. How are you feeling right now?"
        elif any(word in lower_msg for word in ['thank you', 'thanks', 'tanks', 'ty']):
            return "You're very welcome! Remember to take things one step at a time. I'm always here if you need to talk."
        elif any(word in lower_msg for word in ['bye', 'goodbye', 'see you']):
            return "Goodbye! Take care of yourself, and don't forget to take a break when you need it."
            
        # 2. High-risk crisis handling
        elif any(word in lower_msg for word in ['suicide', 'kill myself', 'end my life', 'want to die', 'die']):
            return "I am deeply concerned to hear that. Your safety is absolute priority. Please reach out to KIRAN at 1800-599-0019 or Tele-MANAS at 14416 immediately. There are professionals ready to walk with you through this pain."
            
        # 3. State-aware check: Sleep commitment follow-up
        elif 'resting 7 hours' in last_assistant_msg_lower:
            if is_yes:
                return "That is a great choice! Your brain will process and store information much better after a solid rest. What time are you planning to sleep tonight?"
            elif is_no:
                return "I completely understand. When exam prep is intense, sleep feels like lost time. Could you try even 6 hours, or maybe a quick 20-minute nap during the day?"
            else:
                return "Got it. Remember, sleep isn't a reward for studying; it's a requirement. Try to prioritize at least a little rest tonight. What is another worry on your mind?"
                
        # 4. State-aware check: Sleep time planning follow-up
        elif 'planning to sleep tonight?' in last_assistant_msg_lower:
            return "Got it. Try to turn off your phone and computer screens 15 minutes before that time to let your brain settle. Sleep well when you do!"
            
        # 5. State-aware check: Control schedule follow-up
        elif 'what is one small thing you can control' in last_assistant_msg_lower or 'one small thing you can control' in last_assistant_msg_lower:
            is_study_or_task = any(word in lower_msg for word in ['study', 'revision', 'math', 'physics', 'chemistry', 'biology', 'chapter', 'mock', 'test', 'syllabus', 'backlog', 'read', 'solve'])
            is_relax_or_care = any(word in lower_msg for word in ['sleep', 'sleeping', 'nap', 'walk', 'music', 'break', 'eat', 'exercise', 'relax', 'meditate', 'rest'])
            is_idk = any(word in lower_msg for word in ["don't know", 'not sure', 'none', 'idk', 'nothing'])
            
            if is_study_or_task:
                return "Focusing on that is a great starting point. Try breaking it down into a single 25-minute Pomodoro session today. How does that sound?"
            elif is_relax_or_care:
                return "Choosing to prioritize your well-being is highly productive. Taking even a short break helps clear cognitive overload. Enjoy your rest!"
            elif is_idk:
                return "That's okay. When overwhelmed, even choosing to take three deep breaths right now is a small thing you can control. Let's do that together."
            else:
                return "That sounds like a manageable step. Take it slow, and focus only on this single task for now. You've got this."
                
        # 6. State-aware check: Mock test follow-up
        elif 'diagnostic logs' in last_assistant_msg_lower:
            if is_yes or 'plan' in lower_msg or 'how' in lower_msg or 'help' in lower_msg:
                return "Excellent. First, pick just one mock test paper. Find two questions you got wrong due to simple calculation errors, and correct them. That's your only goal for now. Does that feel doable?"
            elif is_no or any(word in lower_msg for word in ['hard', 'sad', 'stress']):
                return "It is incredibly frustrating when effort doesn't translate to scores immediately. But learning is non-linear. Give yourself some grace today."
            else:
                return "Analyzing mistakes is tough but it is the fastest way to improve. Let me know if you want to break down specific study topics."
                
        # 7. State-aware check: Doable question follow-up
        elif 'does that feel doable?' in last_assistant_msg_lower:
            if is_yes:
                return "Fantastic! Go ahead and tackle those two errors. Take it one step at a time."
            else:
                return "No worries. If that feels like too much, just closing the mock test and taking a break is a perfectly fine choice today."
                
        # 8. State-aware check: Fear of failure follow-up
        elif 'decouple your identity' in last_assistant_msg_lower:
            is_social_worry = any(word in lower_msg for word in ['parent', 'family', 'future', 'fail', 'career', 'job', 'expect'])
            if is_social_worry:
                return "Those worries are very real and heavy to carry. But remember, your family and future self will care more about your health and resilience than a single rank."
            elif is_yes or any(word in lower_msg for word in ['thanks', 'thank you', 'ok', 'true', 'agree']):
                return "I'm glad that resonates with you. You are doing your best, and that is more than enough. How are you feeling now?"
            else:
                return "It's a journey to decouple our worth from test scores. Keep reminding yourself that you are worthy regardless of the outcome. What else is on your mind?"
                
        # 9. Routine habit checks (e.g. sleep timings, meals, study breaks, workspace)
        elif any(time in lower_msg for time in ["12 am", "12pm", "midnight", "1 am", "2 am", "3 am", "sleep late", "late night study"]):
            return "Sleeping after 11 PM or around midnight disrupts deep REM cycles, which are critical for memory consolidation. Try to shift your bedtime to 9-10 PM for better recovery."
        elif any(phrase in lower_msg for phrase in ["skip meal", "skip breakfast", "skip lunch", "skip dinner", "no time to eat", "not eating"]):
            return "Your brain requires a steady supply of glucose to maintain focus and recall. Never skip meals during intense prep; keep healthy snacks nearby."
        elif any(phrase in lower_msg for phrase in ["study straight", "study for hours", "without break", "no breaks", "studying continuously"]):
            return "Studying for long stretches without resting causes cognitive saturation. Try the Pomodoro technique: study for 50 minutes, then take a strict 10-minute rest."
        elif any(phrase in lower_msg for phrase in ["study on bed", "study in bed", "lying down", "lay down"]):
            return "Studying in bed signals to your brain that it is time to sleep, reducing concentration. Try sitting at a dedicated study desk or table."

        # 10. Standard keyword matching if no active follow-up context
        elif "sleep" in lower_msg or "tired" in lower_msg or "exhausted" in lower_msg or "insomnia" in lower_msg or "fatigue" in lower_msg:
            return "Sleep is often the first thing we sacrifice under intensive preparation pressure. Try setting a hard digital sunset tonight. Can you commit to resting 7 hours today?"
        elif "mock" in lower_msg or "marks" in lower_msg or "score" in lower_msg or "percentile" in lower_msg or "rank" in lower_msg:
            return f"Practice scores are diagnostic logs showing where to align your efforts for {exam_name}, not a rating of your intelligence."
        elif "fail" in lower_msg or "fear" in lower_msg or "scared" in lower_msg or "anxious" in lower_msg or "worry" in lower_msg:
            return f"The fear of failure in examinations like {exam_name} is normal due to expectations. Try to decouple your identity from the results."
        else:
            return f"I hear you. The preparation journey for {exam_name} takes massive energy. What is one small thing you can control in your schedule right now to make you feel slightly more at peace?"

    client = get_genai_client()
    if not client:
        return run_simulation()

    try:
        contents = []
        for h in history_list:
            role = h.role if hasattr(h, 'role') else h.get('role', 'user')
            content = h.content if hasattr(h, 'content') else h.get('content', '')
            gemini_role = "user" if role == "user" else "model"
            contents.append(types.Content(role=gemini_role, parts=[types.Part.from_text(text=content)]))

        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

        system_instruction = f"""
        You are an empathetic, compassionate mental health digital companion for students preparing for: {exam}.
        Your goal is to validate feelings, offer support, suggest healthy cognitive strategies, and gently correct unhealthy daily routine habits described by the student (such as sleeping too late, e.g., at 12 AM/midnight or later instead of the recommended 9-10 PM; skipping meals; studying on the bed; or studying without regular breaks).
        Provide clear, constructive recommendations on how to adjust their routine to optimize their mental well-being and cognitive performance.
        Keep responses warm, supportive, precise, and extremely short (strictly 1 to 2 sentences maximum). Do not use paragraphs or lists. Never give clinical advice.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                max_output_tokens=150
            )
        )
        return response.text
    except Exception as e:
        print(f"GenAI companion chat failed, falling back to simulation: {e}")
        return run_simulation()
