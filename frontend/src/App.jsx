/**
 * @fileoverview MindVane — root application component orchestrating all views:
 * Welcome, Dashboard, Stress Analyzer, Chat Companion, and Backlog Declutterer.
 */
import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Send,
  AlertOctagon,
  Compass,
  Activity,
  Sparkles,
  Flame,
  PhoneCall,
  RefreshCw,
  Heart,
  MessageSquare,
  Smile,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import MoodSelector from './components/MoodSelector.jsx';
import StressLandscape from './components/StressLandscape.jsx';
import WellnessHistory, { appendWellnessEntry } from './components/WellnessHistory.jsx';

/** @type {ReadonlyArray<{name: string, number: string, hours: string}>} */
const HELPLINES = [
  { name: "KIRAN Mental Health Helpline", number: "1800-599-0019", hours: "24/7 (Toll-Free, Govt of India)" },
  { name: "Vandrevala Foundation", number: "+91 9999 666 555", hours: "24/7 (Call/WhatsApp)" },
  { name: "Tele-MANAS", number: "14416 / 1800-891-4416", hours: "24/7 (Toll-Free)" },
  { name: "AASRA Helpline", number: "+91 98204 66726", hours: "24/7" },
  { name: "Sneha India", number: "+91 44 2464 0050", hours: "24/7" }
];

/**
 * Returns the emoji associated with a given exam track identifier.
 *
 * @param {string} track - Exam track key (e.g. 'JEE', 'NEET')
 * @returns {string} Single emoji character
 */
const getExamTrackEmoji = (track) => {
  const MAP = {
    JEE: '🌌',
    NEET: '🩺',
    BOARDS: '📚',
    CAT: '💼',
    GATE: '⚙️',
    UPSC: '🏛️',
    CUET: '🎓',
  };
  return MAP[track] ?? '✏️';
};

/**
 * Returns Tailwind CSS class strings for the given exam track's color theme.
 *
 * @param {string} track - Exam track key
 * @returns {{ bg: string, border: string, activeBorder: string, text: string, glow: string }}
 */
const getExamTrackColor = (track) => {
  const COLOR_MAP = {
    JEE: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'border-blue-500/30 dark:border-blue-500/30',
      activeBorder: 'border-blue-500 dark:border-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'shadow-blue-500/10 dark:shadow-blue-500/30',
    },
    NEET: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/30 dark:border-emerald-500/30',
      activeBorder: 'border-emerald-500 dark:border-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/30',
    },
    BOARDS: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/30 dark:border-amber-500/30',
      activeBorder: 'border-amber-500 dark:border-amber-400',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/10 dark:shadow-amber-500/30',
    },
    CAT: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      border: 'border-purple-500/30 dark:border-purple-500/30',
      activeBorder: 'border-purple-500 dark:border-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
      glow: 'shadow-purple-500/10 dark:shadow-purple-500/30',
    },
    GATE: {
      bg: 'bg-zinc-500/15 dark:bg-zinc-700/25',
      border: 'border-zinc-300 dark:border-zinc-700',
      activeBorder: 'border-zinc-500 dark:border-zinc-400',
      text: 'text-zinc-700 dark:text-zinc-350',
      glow: 'shadow-zinc-500/10 dark:shadow-zinc-500/30',
    },
    UPSC: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      border: 'border-rose-500/30 dark:border-rose-500/30',
      activeBorder: 'border-rose-500 dark:border-rose-400',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'shadow-rose-500/10 dark:shadow-rose-500/30',
    },
    CUET: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      border: 'border-cyan-500/30 dark:border-cyan-500/30',
      activeBorder: 'border-cyan-500 dark:border-cyan-400',
      text: 'text-cyan-600 dark:text-cyan-400',
      glow: 'shadow-cyan-500/10 dark:shadow-cyan-500/30',
    },
  };
  return (
    COLOR_MAP[track] ?? {
      bg: 'bg-zinc-500/10 dark:bg-zinc-500/20',
      border: 'border-zinc-500/30',
      activeBorder: 'border-zinc-500 dark:border-zinc-400',
      text: 'text-zinc-600 dark:text-zinc-400',
      glow: 'shadow-zinc-500/10',
    }
  );
};



/** @type {ReadonlyArray<string>} */
const MOTTOS = [
  'De-cluttering chaotic backlogs...',
  'Visualizing cognitive workloads...',
  'Empathetic companion by your side...',
  'Your peace of mind, prioritized.',
];

/**
 * Root MindVane application component.
 * Manages global state, routing between views, and API communication.
 *
 * @returns {JSX.Element}
 */
function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const [introFadeOut, setIntroFadeOut] = useState(false);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setIntroProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIntroFadeOut(true), 200);
          setTimeout(() => setShowIntro(false), 900);
          return 100;
        }
        return prev + 1;
      });
    }, 25); // ~2.5s total loading time

    const mottoTimer = setInterval(() => {
      setCurrentMottoIndex((prev) => (prev + 1) % MOTTOS.length);
    }, 700);

    return () => {
      clearInterval(progressTimer);
      clearInterval(mottoTimer);
    };
  }, []);

  /** @type {[string, function(string): void]} */
  const [exam, setExam] = useState('JEE');
  /** @type {[string, function(string): void]} */
  const [mood, setMood] = useState('Anxious');
  const [journalText, setJournalText] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Backlog Declutterer State
  const [rawBacklog, setRawBacklog] = useState('');
  const [declutterResult, setDeclutterResult] = useState(null);
  const [isLoadingDeclutter, setIsLoadingDeclutter] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const handleToggleStep = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  /** @type {[string, function(string): void]} Routing state: 'welcome' | 'launcher' | 'analyzer' | 'chat' | 'declutter' */
  const [view, setView] = useState('welcome');
  
  // Chat Companion State
  const [chatHistory, setChatHistory] = useState([
    { 
      role: 'assistant', 
      content: "Hi! I am your MindVane Companion. Competitive exams can take a massive mental toll, and it's easy to overlook hidden stress patterns. Feel free to talk about your preparation, schedule, sleep, or whatever is on your mind. How are you holding up today?" 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // Loading & UI States
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [serverMode, setServerMode] = useState('Checking...');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Theme Switch State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Check server connectivity and determine base URL
  const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    return '';
  };

  useEffect(() => {
    const checkServer = async () => {
      try {
        const url = getBaseUrl();
        // Just a simple health check or environment display
        if (url) {
          setServerMode('Localhost Development Mode (Port 8000)');
        } else {
          setServerMode('Vercel Production Mode (Relative Routes)');
        }
      } catch (err) {
        console.warn("Server check failed: ", err);
        setServerMode('Stand-alone Sandbox Mode');
      }
    };
    checkServer();
  }, []);

  // Helper simulation in case backend is offline
  const runOfflineAnalysisSimulation = (targetExam, text, selectedMood = 'Anxious') => {
    const lowercaseText = text.toLowerCase();
    
    // High-risk keywords matching suicide/self-harm
    const highRiskKeywords = ['suicide', 'kill myself', 'end my life', 'better off dead', 'want to die', 'self harm', 'ending it all', 'die', 'kill', 'suicidal'];
    const isRiskFlagged = highRiskKeywords.some(keyword => lowercaseText.includes(keyword));

    if (isRiskFlagged) {
      return {
        risk_flagged: true,
        anxiety_score: 96,
        emotional_trends: ["Critical Overwhelm", "Extreme Isolation", "Helplessness"],
        stress_triggers: [
          { trigger: "Severe Exam Pressure Burden", impact: "High" },
          { trigger: "Mental Health Emergency Trigger", impact: "High" }
        ],
        mindfulness_exercise: "Emergency Safety Checklist: 1. Put away all books. 2. Contact one of the verified helplines immediately. 3. Sit near a window or drink cold water.",
        encouragement: "Please pause right now. Your exam preparation, score, and career milestone do not define your life. There are people trained to support you through this exact feeling. Reach out.",
        coping_strategy: "Stop studying immediately. Focus on grounding techniques: touch 5 physical objects, sip water, and talk to a professional counselor."
      };
    }

    // Dynamic scoring calculation based on length and stressful terms
    let baseScore = 40;
    if (text.length > 50) baseScore += 10;
    if (text.length > 150) baseScore += 10;
    if (lowercaseText.includes('stress') || lowercaseText.includes('anxious') || lowercaseText.includes('pressure')) baseScore += 12;
    if (lowercaseText.includes('fail') || lowercaseText.includes('backlog') || lowercaseText.includes('revision')) baseScore += 10;
    if (lowercaseText.includes('sleep') || lowercaseText.includes('night') || lowercaseText.includes('tired') || lowercaseText.includes('insomnia')) baseScore += 13;
    if (lowercaseText.includes('hopeless') || lowercaseText.includes('cannot') || lowercaseText.includes('give up')) baseScore += 15;
    
    const finalScore = Math.min(Math.max(baseScore, 15), 100);

    // Triggers deduction
    const triggers = [];
    if (lowercaseText.includes('sleep') || lowercaseText.includes('night') || lowercaseText.includes('tired')) {
      triggers.push({ trigger: "Sleep Quality Deprivation", impact: "Severe" });
    }
    if (lowercaseText.includes('mock') || lowercaseText.includes('test') || lowercaseText.includes('marks') || lowercaseText.includes('score')) {
      triggers.push({ trigger: "Mock Exam Score Anxiety", impact: "Severe" });
    }
    if (lowercaseText.includes('parent') || lowercaseText.includes('expect') || lowercaseText.includes('family')) {
      triggers.push({ trigger: "Socio-parental Pressure", impact: "Elevated" });
    }
    if (lowercaseText.includes('revision') || lowercaseText.includes('syllabus') || lowercaseText.includes('backlog')) {
      triggers.push({ trigger: "Syllabus Accumulation Burden", impact: "Elevated" });
    }
    if (lowercaseText.includes('focus') || lowercaseText.includes('concentrate') || lowercaseText.includes('distract')) {
      triggers.push({ trigger: "Cognitive Attentional Fatigue", impact: "Moderate" });
    }

    if (triggers.length === 0) {
      triggers.push({ trigger: "General Competitive Exam Strain", impact: "Moderate" });
      triggers.push({ trigger: "Academic Performance Goal Pressure", impact: "Moderate" });
    }

    // Emotional trends
    const trends = [];
    if (finalScore >= 80) {
      trends.push("Severe Stress Loop", "Burnout State", "Extreme Exhaustion");
    } else if (finalScore >= 55) {
      trends.push("Substantial Anxiety", "Revision Stress", "Mental fatigue");
    } else {
      trends.push("Mild Performance Anxiety", "Exam Preparation Focus");
    }

    // Empathetic encouragements
    const encouragements = [
      `You are navigating an incredibly intense phase for ${targetExam === 'BOARDS' ? 'your Board Exams' : targetExam}. Remember, your health and peace of mind are worth far more than any exam rank.`,
      `Taking it one topic, one page, or one hour at a time is enough. Please allow yourself to take a break today. You are doing your absolute best.`,
      `Burnout is a signal that your mind needs rest, not a sign of weakness. Be gentle with your expectations of yourself.`,
      `You have overcome tough papers and hard topics before. You are capable, but you are also human. Rest is productive too.`
    ];
    const selectedEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    // Mindfulness widget recommendation
    const exercises = [
      "Square Breathing Technique: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Complete 4 rounds.",
      "The 5-4-3-2-1 Grounding: Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste around you.",
      "Dual Mind Relaxer: List 5 items in your study room that are blue, then count backwards from 50 in intervals of 3.",
      "Progressive Muscle Relax: Squeeze your fists tightly for 7 seconds, then let go completely. Experience the sensation of release."
    ];
    const selectedExercise = exercises[Math.floor(Math.random() * exercises.length)];

    // Dynamic coping strategies based on selected mood/score
    let coping = `Focus on active recall instead of re-reading. Break your ${targetExam} syllabus into timeblocks of 25 minutes.`;
    if (finalScore > 75) {
      coping = `Step back from ${targetExam} study for 20 mins. Write down only 1 topic to tackle next, and ignore all exam marks.`;
    } else if (selectedMood.toLowerCase() === 'tired' || selectedMood.toLowerCase() === 'exhausted') {
      coping = "Prioritize sleep hygiene: set a strict sleep window, shut off all screens, and review notes only in daylight.";
    }

    return {
      risk_flagged: false,
      anxiety_score: finalScore,
      emotional_trends: trends,
      stress_triggers: triggers,
      mindfulness_exercise: selectedExercise,
      encouragement: selectedEncouragement,
      coping_strategy: coping
    };
  };

  /**
   * Submits the journal entry to the backend for burnout analysis.
   * On success, normalizes the API response and records the session to wellness history.
   * Falls back to the offline simulation if the backend is unreachable.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   * @returns {Promise<void>}
   */
  const generateAnalysis = async (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    setIsLoadingAnalysis(true);
    setFeedbackMsg('');
    const base = getBaseUrl();

    try {
      const response = await fetch(`${base}/_/backend/api/analyze-journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, journal_text: journalText, mood })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const rawTriggers = Array.isArray(data.stress_triggers) 
        ? data.stress_triggers 
        : (Array.isArray(data.triggers) ? data.triggers : []);

      const normalizedData = {
        risk_flagged: !!(data.risk_flagged || data.riskFlagged),
        anxiety_score: Number(data.anxiety_score || data.anxietyScore || 50),
        emotional_trends: Array.isArray(data.emotional_trends)
          ? data.emotional_trends
          : (data.primaryTrend ? [data.primaryTrend] : (data.primary_trend ? [data.primary_trend] : ["General stress"])),
        stress_triggers: rawTriggers.map(t => ({
          trigger: t.trigger || t.name || "General performance strain",
          impact: t.impact || "Medium"
        })),
        mindfulness_exercise: data.mindfulness_exercise || data.exercise || "Take a slow breath.",
        encouragement: data.encouragement || "You are doing your best.",
        coping_strategy: data.coping_strategy || null
      };
      setAnalysis(normalizedData);
      // Persist entry to localStorage wellness history tracker
      if (!normalizedData.risk_flagged) {
        appendWellnessEntry({ exam, mood, anxietyScore: normalizedData.anxiety_score });
      }
      setFeedbackMsg('Analysis loaded from backend.');
    } catch {
      // Backend unreachable — run client-side emulation fallback
      const simulatedResult = runOfflineAnalysisSimulation(exam, journalText, mood);
      setAnalysis(simulatedResult);
      if (!simulatedResult.risk_flagged) {
        appendWellnessEntry({ exam, mood, anxietyScore: simulatedResult.anxiety_score });
      }
      setFeedbackMsg('Notice: Running in Client-side Emulated Mode (Offline Fallback)');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // 3. Submit Backlog to Declutter
  const generateDeclutter = async (e) => {
    e.preventDefault();
    if (!rawBacklog.trim()) return;

    setIsLoadingDeclutter(true);
    setFeedbackMsg('');
    setCompletedSteps({}); // Reset progress tracker for new session
    const base = getBaseUrl();

    try {
      const response = await fetch(`${base}/api/declutter-backlog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, raw_backlog: rawBacklog })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const normalizedData = {
        reassurance: data.reassurance || "Syllabus backlog breakdown complete.",
        atomic_steps: (Array.isArray(data.atomic_steps) ? data.atomic_steps : []).map(step => ({
          task_name: step.task_name || "Study key concepts",
          estimated_minutes: Number(step.estimated_minutes || 0),
          priority: step.priority || "Medium"
        }))
      };
      setDeclutterResult(normalizedData);
      setFeedbackMsg("Backlog framework loaded from backend.");
    } catch (error) {
      console.warn("Backend API not reachable for declutter. Running simulated UI response fallback...", error);
      
      const mockSteps = [
        {
          task_name: `Open one chapter of ${exam} backlog and list top 3 core topics`,
          estimated_minutes: 15,
          priority: "High"
        },
        {
          task_name: `Solve exactly 3 simple previous year questions for the first topic`,
          estimated_minutes: 25,
          priority: "High"
        },
        {
          task_name: `Close books and summarize formula details from memory in 5 minutes`,
          estimated_minutes: 10,
          priority: "Medium"
        },
        {
          task_name: `Schedule a 10-minute active recall session tomorrow morning`,
          estimated_minutes: 10,
          priority: "Low"
        }
      ];

      setDeclutterResult({
        reassurance: `Syllabus overload in ${exam} causes immediate paralysis. Break this block down to clear the pressure.`,
        atomic_steps: mockSteps
      });
      setFeedbackMsg("Notice: Running in Client-side Emulated Mode (Offline Fallback)");
    } finally {
      setIsLoadingDeclutter(false);
    }
  };


  // 2. Chat Companion Sender
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoadingChat) return;

    const userMessageText = chatInput.trim();
    const updatedHistory = [...chatHistory, { role: 'user', content: userMessageText }];
    
    setChatHistory(updatedHistory);
    setChatInput('');
    setIsLoadingChat(true);

    const base = getBaseUrl();

    try {
      const response = await fetch(`${base}/_/backend/api/chat-companion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessageText,
          history: updatedHistory,
          exam: exam
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setIsLoadingChat(false);
    } catch (error) {
      console.warn("Companion Chat API not reachable. Simulating empathetic companion response...", error);
      // Construct a smart simulated response
      let companionReply = "";
      const lowerMsg = userMessageText.toLowerCase();

      // Find the last assistant message in history to maintain context
      const lastAssistantMsg = [...chatHistory].reverse().find(msg => msg.role === 'assistant')?.content || "";
      const lastAssistantMsgLower = lastAssistantMsg.toLowerCase();

      // Common helper definitions for checking user response types
      const isYes = ['yes', 'yeah', 'yep', 'sure', 'ok', 'will do', 'i can', 'try', 'definitely', 'agree'].some(word => lowerMsg.includes(word));
      const isNo = ['no', 'cannot', "can't", 'hard', 'difficult', 'impossible', 'busy', 'not now', 'nah'].some(word => lowerMsg.includes(word));

      // 1. Basic greeting / parting / gratitude handling
      if (['hello', 'hi ', 'hi!', 'hey ', 'hey!', 'greetings', 'who are you', 'what can you do'].some(word => lowerMsg.startsWith(word) || lowerMsg === 'hi')) {
        companionReply = "Hello! I am your MindVane Companion. I'm here to support you with exam stress, study backlogs, or sleep fatigue. How are you feeling right now?";
      } else if (['thank you', 'thanks', 'tanks', 'ty'].some(word => lowerMsg.includes(word))) {
        companionReply = "You're very welcome! Remember to take things one step at a time. I'm always here if you need to talk.";
      } else if (['bye', 'goodbye', 'see you'].some(word => lowerMsg.includes(word))) {
        companionReply = "Goodbye! Take care of yourself, and don't forget to take a break when you need it.";
      }
      // 2. High-risk crisis handling
      else if (lowerMsg.includes('suicide') || lowerMsg.includes('kill myself') || lowerMsg.includes('end my life') || lowerMsg.includes('want to die') || lowerMsg.includes('die')) {
        companionReply = "I am deeply concerned to hear that. Your safety is absolute priority. Please reach out to KIRAN at 1800-599-0019 or Tele-MANAS at 14416 immediately. There are professionals ready to walk with you through this pain.";
      }
      // 3. State-aware check: Sleep commitment follow-up
      else if (lastAssistantMsgLower.includes('resting 7 hours today?')) {
        if (isYes) {
          companionReply = "That is a great choice! Your brain will process and store information much better after a solid rest. What time are you planning to sleep tonight?";
        } else if (isNo) {
          companionReply = "I completely understand. When exam prep is intense, sleep feels like lost time. Could you try even 6 hours, or maybe a quick 20-minute nap during the day?";
        } else {
          companionReply = "Got it. Remember, sleep isn't a reward for studying; it's a requirement. Try to prioritize at least a little rest tonight. What is another worry on your mind?";
        }
      }
      // 4. State-aware check: Sleep time planning follow-up
      else if (lastAssistantMsgLower.includes('planning to sleep tonight?')) {
        companionReply = "Got it. Try to turn off your phone and computer screens 15 minutes before that time to let your brain settle. Sleep well when you do!";
      }
      // 5. State-aware check: Control schedule follow-up
      else if (lastAssistantMsgLower.includes('what is one small thing you can control')) {
        const isStudyOrTask = ['study', 'revision', 'math', 'physics', 'chemistry', 'biology', 'chapter', 'mock', 'test', 'syllabus', 'backlog', 'read', 'solve'].some(word => lowerMsg.includes(word));
        const isRelaxOrCare = ['sleep', 'sleeping', 'nap', 'walk', 'music', 'break', 'eat', 'exercise', 'relax', 'meditate', 'rest'].some(word => lowerMsg.includes(word));
        const isIdk = ["don't know", 'not sure', 'none', 'idk', 'nothing'].some(word => lowerMsg.includes(word));

        if (isStudyOrTask) {
          companionReply = "Focusing on that is a great starting point. Try breaking it down into a single 25-minute Pomodoro session today. How does that sound?";
        } else if (isRelaxOrCare) {
          companionReply = "Choosing to prioritize your well-being is highly productive. Taking even a short break helps clear cognitive overload. Enjoy your rest!";
        } else if (isIdk) {
          companionReply = "That's okay. When overwhelmed, even choosing to take three deep breaths right now is a small thing you can control. Let's do that together.";
        } else {
          companionReply = "That sounds like a manageable step. Take it slow, and focus only on this single task for now. You've got this.";
        }
      }
      // 6. State-aware check: Mock test follow-up
      else if (lastAssistantMsgLower.includes('diagnostic logs')) {
        if (isYes || lowerMsg.includes('plan') || lowerMsg.includes('how') || lowerMsg.includes('help')) {
          companionReply = "Excellent. First, pick just one mock test paper. Find two questions you got wrong due to simple calculation errors, and correct them. That's your only goal for now. Does that feel doable?";
        } else if (isNo || lowerMsg.includes('hard') || lowerMsg.includes('sad') || lowerMsg.includes('stress')) {
          companionReply = "It is incredibly frustrating when effort doesn't translate to scores immediately. But learning is non-linear. Give yourself some grace today.";
        } else {
          companionReply = "Analyzing mistakes is tough but it is the fastest way to improve. Let me know if you want to break down specific study topics.";
        }
      }
      // 7. State-aware check: Doable question follow-up
      else if (lastAssistantMsgLower.includes('does that feel doable?')) {
        if (isYes) {
          companionReply = "Fantastic! Go ahead and tackle those two errors. Take it one step at a time.";
        } else {
          companionReply = "No worries. If that feels like too much, just closing the mock test and taking a break is a perfectly fine choice today.";
        }
      }
      // 8. State-aware check: Fear of failure follow-up
      else if (lastAssistantMsgLower.includes('decouple your identity')) {
        const isSocialWorry = ['parent', 'family', 'future', 'fail', 'career', 'job', 'expect'].some(word => lowerMsg.includes(word));
        if (isSocialWorry) {
          companionReply = "Those worries are very real and heavy to carry. But remember, your family and future self will care more about your health and resilience than a single rank.";
        } else if (isYes || ['thanks', 'thank you', 'ok', 'true', 'agree'].some(word => lowerMsg.includes(word))) {
          companionReply = "I'm glad that resonates with you. You are doing your best, and that is more than enough. How are you feeling now?";
        } else {
          companionReply = "It's a journey to decouple our worth from test scores. Keep reminding yourself that you are worthy regardless of the outcome. What else is on your mind?";
        }
      }
      // 9. Routine habit checks (e.g. sleep timings, meals, study breaks, workspace)
      else if (["12 am", "12pm", "midnight", "1 am", "2 am", "3 am", "sleep late", "late night study"].some(time => lowerMsg.includes(time))) {
        companionReply = "Sleeping after 11 PM or around midnight disrupts deep REM cycles, which are critical for memory consolidation. Try to shift your bedtime to 9-10 PM for better recovery.";
      } else if (["skip meal", "skip breakfast", "skip lunch", "skip dinner", "no time to eat", "not eating"].some(phrase => lowerMsg.includes(phrase))) {
        companionReply = "Your brain requires a steady supply of glucose to maintain focus and recall. Never skip meals during intense prep; keep healthy snacks nearby.";
      } else if (["study straight", "study for hours", "without break", "no breaks", "studying continuously"].some(phrase => lowerMsg.includes(phrase))) {
        companionReply = "Studying for long stretches without resting causes cognitive saturation. Try the Pomodoro technique: study for 50 minutes, then take a strict 10-minute rest.";
      } else if (["study on bed", "study in bed", "lying down", "lay down"].some(phrase => lowerMsg.includes(phrase))) {
        companionReply = "Studying in bed signals to your brain that it is time to sleep, reducing concentration. Try sitting at a dedicated study desk or table.";
      }
      // 10. Standard keyword matching if no active follow-up context
      else if (lowerMsg.includes('sleep') || lowerMsg.includes('tired') || lowerMsg.includes('exhausted') || lowerMsg.includes('insomnia') || lowerMsg.includes('fatigue')) {
        companionReply = "Sleep is often the first thing we sacrifice under competitive exam pressure, yet it is the foundation of cognitive functioning. Try setting a hard 'digital sunset' tonight. Can you commit to resting 7 hours today?";
      } else if (lowerMsg.includes('mock') || lowerMsg.includes('marks') || lowerMsg.includes('score') || lowerMsg.includes('percentile') || lowerMsg.includes('rank')) {
        companionReply = "Mock scores can feel like a direct verdict on your future, but they are actually diagnostic logs. They show you where to align your efforts, not how smart you are. Let's make a plan to check your mistakes calmly.";
      } else if (lowerMsg.includes('fail') || lowerMsg.includes('fear') || lowerMsg.includes('scared') || lowerMsg.includes('anxious') || lowerMsg.includes('worry')) {
        companionReply = "The fear of failure in examinations like " + exam + " is incredibly high due to social pressures. Try to decouple your identity from the outcome. You are a valuable person regardless of what sheet is printed on result day.";
      } else {
        companionReply = "I hear you. The preparation journey for " + exam + " is grueling, and feeling this weight is part of the challenge. Tell me, what is one small thing you can control in your schedule right now to make you feel slightly more at peace?";
      }

      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'assistant', content: companionReply }]);
        setIsLoadingChat(false);
      }, 700); // realistic delay
    }
  };

  // Dynamic colors helper
  const getAnxietyColor = (score) => {
    if (score < 40) return { border: 'border-accentEmerald', text: 'text-accentEmerald', bg: 'bg-accentEmerald/10', hex: '#10b981' };
    if (score < 75) return { border: 'border-accentAmber', text: 'text-accentAmber', bg: 'bg-accentAmber/10', hex: '#f59e0b' };
    return { border: 'border-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10', hex: '#ef4444' };
  };

  const getImpactBadgeColor = (impact) => {
    if (impact === 'Moderate' || impact === 'Low') return 'bg-accentEmerald/20 text-accentEmerald border border-accentEmerald/30';
    if (impact === 'Elevated' || impact === 'Medium') return 'bg-accentAmber/20 text-accentAmber border border-accentAmber/30';
    return 'bg-rose-950 text-rose-400 border border-rose-800';
  };

  return (
    <>
      {showIntro && (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040d1a] text-white transition-all duration-700 ease-in-out ${introFadeOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} bg-dot-grid bg-mesh-gradient no-print`}>
          {/* Glow Effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#60a5fa]/10 rounded-full blur-[80px] pointer-events-none animate-pulse-fast"></div>
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-[#f97316]/10 rounded-full blur-[70px] pointer-events-none animate-pulse"></div>

          <div className="relative flex flex-col items-center space-y-6 text-center px-6 max-w-md">
            {/* Logo Animation Container */}
            <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md animate-logo-entrance">
              <svg className="w-12 h-12 text-[#60a5fa] animate-logo-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="url(#moon-grad)" stroke="none" />
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="1" fill="#fff" className="animate-ping" />
                <path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="#ea580c" />
                <defs>
                  <linearGradient id="moon-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Title with letter entrance spacing */}
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#a855f7] to-[#ea580c] animate-title-grow font-sans uppercase">
                MindVane
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-[#60a5fa] to-[#a855f7] mx-auto rounded-full"></div>
            </div>

            {/* Cycling Mottos */}
            <div className="h-8 flex items-center justify-center">
              <p className="text-xs font-mono text-zinc-400 tracking-wide transition-all duration-300">
                {MOTTOS[currentMottoIndex]}
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 space-y-2">
              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-[#60a5fa] via-[#a855f7] to-[#ea580c] transition-all duration-75 ease-out shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                  style={{ width: `${introProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>INITIALIZING SYSTEM</span>
                <span>{introProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skip Navigation Link — keyboard and screen-reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-accentPurple focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-semibold focus:shadow-xl"
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        role="main"
        className="min-h-screen bg-zinc-50 dark:bg-darkBg text-zinc-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-300 bg-dot-grid bg-mesh-gradient relative"
      >
      
      {/* 1. HEADER */}
      {view !== 'welcome' && (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300 no-print">
          <div className="flex items-center space-x-3">
            <div className="p-0.5 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950/50">
              <img src="/logo.png" alt="MindVane Logo" className="h-9 w-9 rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accentPurple to-accentMagenta inline neon-glow-purple">
                MindVane
              </h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Burnout Tracker & Student Health Companion</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Header Navigation tabs */}
            <nav className="flex items-center space-x-1 mr-1 md:mr-2">
              <button
                onClick={() => setView('launcher')}
                className={`px-2 py-1 md:px-3.5 md:py-2 rounded-xl text-[10px] md:text-xs font-semibold tracking-wide transition-all duration-300 ${view === 'launcher' ? 'bg-gradient-to-r from-accentPurple to-accentMagenta text-white shadow-md' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('analyzer')}
                className={`px-2 py-1 md:px-3.5 md:py-2 rounded-xl text-[10px] md:text-xs font-semibold tracking-wide transition-all duration-300 ${view === 'analyzer' ? 'bg-gradient-to-r from-accentPurple to-accentMagenta text-white shadow-md' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
              >
                Stress Tracker
              </button>
              <button
                onClick={() => setView('chat')}
                className={`px-2 py-1 md:px-3.5 md:py-2 rounded-xl text-[10px] md:text-xs font-semibold tracking-wide transition-all duration-300 ${view === 'chat' ? 'bg-gradient-to-r from-accentPurple to-accentMagenta text-white shadow-md' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setView('declutter')}
                className={`px-2 py-1 md:px-3.5 md:py-2 rounded-xl text-[10px] md:text-xs font-semibold tracking-wide transition-all duration-300 ${view === 'declutter' ? 'bg-gradient-to-r from-accentPurple to-accentMagenta text-white shadow-md' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
              >
                Declutter
              </button>
            </nav>

            {/* Global Active Track Selector */}
            <div className="relative inline-block no-print">
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className={`appearance-none bg-zinc-50 dark:bg-zinc-900 border rounded-xl pl-7 pr-7 py-2 text-[10px] md:text-xs font-bold font-mono tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-accentPurple transition-all duration-300 ${getExamTrackColor(exam).bg} ${getExamTrackColor(exam).border} ${getExamTrackColor(exam).text}`}
              >
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="CUET">CUET</option>
                <option value="BOARDS">BOARDS</option>
                <option value="CAT">CAT</option>
                <option value="GATE">GATE</option>
                <option value="UPSC">UPSC</option>
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                {getExamTrackEmoji(exam)}
              </div>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-60">
                ▼
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 md:p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" /> : <Moon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accentPurple" />}
            </button>
            
            <span className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 font-mono hidden lg:inline-block">
              {serverMode}
            </span>
            <span className="h-2 w-2 rounded-full bg-accentPurple animate-ping"></span>
          </div>
        </header>
      )}

      {/* 2. DYNAMIC PAGES */}

      {/* A. Welcome View */}
      {view === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 view-transition-container animate-slide-fade-in">
          <div className="max-w-2xl space-y-8 glass-panel rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-accentPurple/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accentMagenta/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4">
              <div className="inline-flex p-3.5 bg-gradient-to-tr from-accentPurple/15 to-accentMagenta/10 border border-accentPurple/30 rounded-2xl text-accentPurple mb-2 animate-bounce">
                <Brain className="h-10 w-10 text-accentPurple" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentPurple via-accentMagenta to-orange-500">MindVane</span>
              </h2>
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
                Your premium academic sanctuary. Analyze mental burnout indicators, receive tailor-made counseling resources, and de-clutter chaotic syllabus loads smoothly with 144Hz smoothness.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Select Your Target Examination Track
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                {['JEE', 'NEET', 'CUET', 'BOARDS', 'CAT', 'GATE', 'UPSC'].map((track) => {
                  const isSelected = exam === track;
                  const colors = getExamTrackColor(track);
                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setExam(track)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 transform cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
                        isSelected 
                          ? `${colors.bg} ${colors.activeBorder} ${colors.text} shadow-md ${colors.glow} font-bold ring-2 ring-accentPurple/25`
                          : 'bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="text-2xl mb-1.5 transition-transform duration-300 hover:scale-110">{getExamTrackEmoji(track)}</span>
                      <span className="text-xs font-mono tracking-wider">{track}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setView('launcher')}
                className="px-8 py-4 bg-gradient-to-r from-accentPurple to-accentMagenta text-white font-bold text-base rounded-2xl shadow-lg shadow-accentPurple/30 hover:shadow-accentPurple/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
              >
                <span>Get Started</span>
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. Launcher Recommendation View */}
      {view === 'launcher' && (
        <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 flex flex-col justify-center space-y-8 view-transition-container animate-slide-fade-in">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-accentPurple font-bold">Academic Modules</span>
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white">Choose Your Destination</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Select from our premium mental-health companion services. We recommend starting with the Stress Diagnostics Tracker first to build your cognitive profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Stress Analyzer (Recommended) */}
            <div 
              onClick={() => setView('analyzer')}
              className="glass-panel-interactive rounded-2xl p-6 border border-accentPurple/40 flex flex-col justify-between cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-3 right-3 bg-gradient-to-r from-accentPurple to-accentMagenta text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse-fast">
                Recommended Start
              </div>
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-accentPurple/10 border border-accentPurple/30 rounded-xl text-accentPurple">
                  <Activity className="h-6 w-6 text-accentPurple" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Stress & Burnout Analyzer</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-light">
                    Write down your thoughts to calculate your anxiety score baseline, isolate hidden stressors, and render your dynamic mental stress landscape.
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center text-xs font-bold text-accentPurple">
                <span>Open Tracker</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>

            {/* Backlog Declutterer */}
            <div 
              onClick={() => setView('declutter')}
              className="glass-panel-interactive rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-accentMagenta/10 border border-accentMagenta/30 rounded-xl text-accentMagenta">
                  <Compass className="h-6 w-6 text-accentMagenta" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Syllabus Backlog Declutterer</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-light">
                    Feeling overwhelmed by exam syllabus logs? Put in your raw topics list to break them down into microscopic, time-capped actionable steps.
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center text-xs font-bold text-accentMagenta">
                <span>Open Declutterer</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>

            {/* Chat Companion */}
            <div 
              onClick={() => setView('chat')}
              className="glass-panel-interactive rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-500">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Empathetic Companion Chat</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-light">
                    A quiet, safe space to vent about competitive exams, mock grades, and parental expectations. Chat with a supportive AI companion.
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center text-xs font-bold text-blue-500">
                <span>Open Chat</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>
          </div>

          {/* Wellness History Tracker \u2014 localStorage-backed session history */}
          <WellnessHistory />
        </div>
      )}


      {/* C. Stress Analyzer View */}
      {view === 'analyzer' && (
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 view-transition-container animate-slide-fade-in print:block print:p-0">
          
          {/* Journal Form Card */}
          <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-accentPurple/5 dark:hover:shadow-accentPurple/5 no-print">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Compass className="w-40 h-40 text-accentPurple" />
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 dark:from-white to-zinc-500 dark:to-zinc-400 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accentPurple" />
              Journal & Burnout Analyzer
            </h2>

            <form onSubmit={generateAnalysis} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl transition-all duration-300">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Active Syllabus Track:</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold font-mono tracking-wide transition-all duration-300 ${getExamTrackColor(exam).bg} ${getExamTrackColor(exam).border} ${getExamTrackColor(exam).text}`}>
                    {getExamTrackEmoji(exam)} {exam}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-light">(Adjust this globally in the top header)</span>
                </div>
              </div>

              <MoodSelector mood={mood} onMoodChange={setMood} />

              <div className="space-y-2">
                <label htmlFor="journal-textarea" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex justify-between">
                  <span>Write down your thoughts</span>
                  <span className="text-zinc-400 dark:text-zinc-500 normal-case font-normal">Express freely about syllabus, tests, health, sleep</span>
                </label>
                <textarea
                  id="journal-textarea"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="I'm feeling incredibly overwhelmed. My mock marks have dropped, there's a huge revision backlog in physics/biology, and I barely sleep more than 4 hours. I feel like I'm letting everyone down..."
                  rows={5}
                  className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-4 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accentPurple transition-all font-light resize-none leading-relaxed text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-500 italic">
                  {feedbackMsg && `* ${feedbackMsg}`}
                </span>
                <button
                  type="submit"
                  disabled={isLoadingAnalysis || !journalText.trim()}
                  className="relative group overflow-hidden bg-gradient-to-r from-accentPurple to-accentMagenta text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-accentPurple/20 hover:shadow-accentPurple/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
                >
                  {isLoadingAnalysis ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Processing Mind State...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 text-white" />
                      <span>Analyze Stress Patterns</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ANALYTICS OUTPUT */}
          <div aria-live="polite" className="flex-1 flex flex-col justify-between">
            {!analysis ? (
              <div className="flex-1 bg-white/50 dark:bg-[#121212]/40 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px] transition-colors duration-300">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900/60 rounded-full border border-zinc-200 dark:border-zinc-800">
                  <Brain className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-400">No Stress Analysis Active</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-sm mt-1">
                    Fill out the journaling session above and hit "Analyze Stress Patterns" to parse your mental diagnostics report.
                  </p>
                </div>
              </div>
            ) : analysis.risk_flagged ? (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/80 rounded-2xl p-6 md:p-8 animate-blink-scarlet shadow-lg dark:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-600/10 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-500">
                    <AlertOctagon className="h-7 w-7 text-red-500 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-500">Crisis Alert & Assistance Required</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      Our system detected critical indicators of emotional crisis and severe distress in your journal. Please contact one of the free support options below. You do not have to carry this load alone.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <span className="block text-xs uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold">Immediate Student Support Helplines</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {HELPLINES.map((line, idx) => (
                      <div key={idx} className="bg-white dark:bg-black/40 border border-red-100 dark:border-red-900/40 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
                        <div>
                          <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-100">{line.name}</span>
                          <span className="block text-[11px] text-zinc-500 mt-0.5">{line.hours}</span>
                        </div>
                        <a href={`tel:${line.number}`} className="mt-3 flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors">
                          <PhoneCall className="h-3.5 w-3.5" />
                          <span>{line.number}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-red-200 dark:border-red-950 pt-4 flex items-center justify-between text-xs text-red-500 dark:text-red-400/70">
                  <span>Free. Confidential. Available 24/7.</span>
                  <button onClick={() => setAnalysis(null)} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline font-medium">
                    Reset Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 print:space-y-4">
                
                {/* Print Header */}
                <div className="hidden print:flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="MindVane Logo" className="h-10 w-10 rounded-xl border border-zinc-200" />
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">MindVane Diagnostics Report</h2>
                      <p className="text-[10px] text-zinc-500 font-mono">Burnout Tracker & Student Health Companion</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-600">
                    <div><strong>Target Exam:</strong> {exam}</div>
                    <div><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                {/* PDF Print Options panel */}
                <div className="flex items-center justify-between no-print bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Diagnostics Summary</h3>
                    <p className="text-xs text-zinc-500">Generate a portable report of your active analysis.</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-accentPurple to-accentMagenta hover:from-accentPurple/95 hover:to-accentMagenta/95 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 duration-150"
                  >
                    <Activity className="h-3.5 w-3.5" />
                    <span>Save Report (PDF)</span>
                  </button>
                </div>

                <StressLandscape anxietyScore={analysis.anxiety_score} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Anxiety Meter */}
                  <div className={`bg-white dark:bg-[#121212] border ${getAnxietyColor(analysis.anxiety_score).border} rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-500`}>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-1">Anxiety Index Meter</span>
                      <h4 className="text-sm text-zinc-800 dark:text-zinc-300 font-medium">Cognitive Stress Level</h4>
                    </div>

                    <div className="my-4 flex items-center justify-center relative">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="54" stroke={darkMode ? "#1f2937" : "#e4e4e7"} strokeWidth="8" fill="transparent" />
                        <circle cx="64" cy="64" r="54" stroke={getAnxietyColor(analysis.anxiety_score).hex} strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - analysis.anxiety_score / 100)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className={`text-3xl font-extrabold tracking-tight ${getAnxietyColor(analysis.anxiety_score).text} neon-glow-magenta`}>
                          {analysis.anxiety_score}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold">Score</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-zinc-200 dark:border-zinc-800/80 pt-3">
                      <span className="text-zinc-500">Classification:</span>
                      <span className={`font-semibold ${getAnxietyColor(analysis.anxiety_score).text}`}>
                        {analysis.anxiety_score >= 75 ? 'Elevated Burden (Rose)' : analysis.anxiety_score >= 40 ? 'Moderate Burden (Amber)' : 'Stable Baseline (Emerald)'}
                      </span>
                    </div>
                  </div>

                  {/* Primary Emotional Trends */}
                  <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-1">Emotional Vectors</span>
                      <h4 className="text-sm text-zinc-800 dark:text-zinc-300 font-medium">Primary State Trends</h4>
                    </div>

                    <div className="my-3 flex flex-wrap gap-2 content-center items-center flex-1">
                      {analysis.emotional_trends.map((trend, idx) => (
                        <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-accentPurple/10 border border-accentPurple/30 text-accentPurple text-xs font-semibold flex items-center space-x-1.5">
                          <Flame className="h-3 w-3 text-accentPurple" />
                          <span>{trend}</span>
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-3 text-[11px] text-zinc-500">
                      Emotional states isolated from vocabulary frequency analysis.
                    </div>
                  </div>
                </div>

                {/* Triggers Card */}
                <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-3">Hidden Stress Triggers</span>
                  <ul className="space-y-3" role="list">
                    {analysis.stress_triggers.map((trig, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-zinc-50 dark:bg-black/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl px-4 py-2.5">
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{trig.trigger}</span>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getImpactBadgeColor(trig.impact)}`}>
                          {trig.impact}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mindfulness Exercise */}
                <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg flex items-start space-x-4">
                  <div className="p-3 bg-accentPurple/10 border border-accentPurple/30 rounded-xl text-accentPurple mt-0.5">
                    <Compass className="h-5 w-5 text-accentPurple" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">Adaptive Mindfulness Exercise</span>
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Recommended Relief Protocol</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mt-1">{analysis.mindfulness_exercise}</p>
                  </div>
                </div>

                {/* Tailored Coping Strategy */}
                {analysis.coping_strategy && (
                  <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 shadow-lg flex items-start space-x-4 transition-all duration-500">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mt-0.5 flex-shrink-0">
                      <Shield className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-500 font-bold block">Hyper-Personalized Coping Strategy</span>
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Tailored for Your Mood &amp; Exam Track</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mt-1">{analysis.coping_strategy}</p>
                    </div>
                  </div>
                )}

                {/* Marquee */}
                <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 px-1 overflow-hidden shadow-lg relative">
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#121212] to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#121212] to-transparent z-10 pointer-events-none"></div>
                  <div className="whitespace-nowrap flex overflow-hidden">
                    <div className="animate-marquee inline-block text-xs font-medium text-accentPurple select-none">
                      {analysis.encouragement} • Take deep breaths • You are more than a rank • Rest is also progress • Keep going gently •
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>
      )}

      {/* D. Chat Companion View */}
      {view === 'chat' && (
        <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-140px)] view-transition-container animate-slide-fade-in print:hidden">
          <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex flex-col flex-1 overflow-hidden shadow-xl dark:shadow-2xl">
            
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#151515]/60 flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-accentMagenta/10 border border-accentMagenta/30 rounded-lg text-accentMagenta">
                  <MessageSquare className="h-4 w-4 text-accentMagenta" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accentMagenta to-accentPurple inline neon-glow-magenta">
                    Companion Chat
                  </h2>
                  <span className="block text-[10px] text-zinc-500 dark:text-zinc-500">Real-time Support Companion</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-full px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold">ACTIVE</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20" role="log" aria-label="Conversation logs">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-accentPurple to-accentMagenta text-white rounded-br-none' 
                      : 'bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 text-zinc-800 dark:text-zinc-300 rounded-bl-none'
                  }`}>
                    <p className="font-light whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoadingChat && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl rounded-bl-none px-4 py-3.5 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-accentMagenta rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-accentPurple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-accentMagenta rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium">Companion is writing...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Suggestion Chips */}
            <div className="px-4 py-2 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-55/30 dark:bg-[#151515]/30 flex flex-wrap gap-2 items-center select-none">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Suggested:</span>
              {[
                { label: "Trouble sleeping 🥱", text: "I am having trouble sleeping lately." },
                { label: "Low mock score stress 🩺", text: "I am really stressed about my low mock exam scores." },
                { label: "Backlog overwhelm 📚", text: "I have a huge backlog and I don't know where to start." },
                { label: "Fear of failure 😰", text: "I'm feeling scared that I might fail my exam." }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChatInput(chip.text);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-650 dark:text-zinc-400 hover:bg-accentMagenta/10 hover:border-accentMagenta/40 hover:text-accentMagenta transition-all duration-200 select-none cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Form */}
            <form onSubmit={sendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#151515]/60 flex items-center space-x-2 transition-colors duration-300">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask advice, express stress, or chat..."
                  className="w-full bg-zinc-100 dark:bg-[#1c1c1f] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-10 py-3 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-accentMagenta transition-all font-light"
                  required
                  disabled={isLoadingChat}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600">
                  <Smile className="h-4 w-4" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoadingChat || !chatInput.trim()}
                className="bg-accentMagenta hover:bg-accentMagenta/90 text-white p-3 rounded-xl transition-all shadow-lg shadow-accentMagenta/10 hover:shadow-accentMagenta/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </form>
          </div>
        </main>
      )}

      {/* E. Backlog Declutterer View */}
      {view === 'declutter' && (
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 view-transition-container animate-slide-fade-in print:hidden">
          
          {/* Declutter Form */}
          <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-accentMagenta/5 dark:hover:shadow-accentMagenta/5">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Compass className="w-40 h-40 text-accentMagenta" />
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 dark:from-white to-zinc-500 dark:to-zinc-400 flex items-center gap-2">
              <Compass className="h-5 w-5 text-accentMagenta" />
              Syllabus Backlog Declutterer
            </h2>

            <form onSubmit={generateDeclutter} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl transition-all duration-300">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Active Syllabus Track:</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold font-mono tracking-wide transition-all duration-300 ${getExamTrackColor(exam).bg} ${getExamTrackColor(exam).border} ${getExamTrackColor(exam).text}`}>
                    {getExamTrackEmoji(exam)} {exam}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-light">(Adjust this globally in the top header)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="backlog-textarea" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex justify-between">
                  <span>Describe your raw backlog list</span>
                  <span className="text-zinc-400 dark:text-zinc-500 normal-case font-normal">Mention chapters and topics you need to cover</span>
                </label>
                <textarea
                  id="backlog-textarea"
                  value={rawBacklog}
                  onChange={(e) => setRawBacklog(e.target.value)}
                  placeholder="I have a backlog of 3 chapters in physics (Rotational Motion, Waves, Thermodynamics) and 2 chapters in organic chemistry. I am extremely behind and stressed."
                  rows={4}
                  className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-4 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accentMagenta transition-all font-light resize-none leading-relaxed text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-500 italic">
                  {feedbackMsg && `* ${feedbackMsg}`}
                </span>
                <button
                  type="submit"
                  disabled={isLoadingDeclutter || !rawBacklog.trim()}
                  className="relative group overflow-hidden bg-gradient-to-r from-accentMagenta to-accentPurple text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-accentMagenta/20 hover:shadow-accentMagenta/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
                >
                  {isLoadingDeclutter ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Creating Action Plan...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="h-4 w-4 text-white" />
                      <span>Declutter Syllabus Backlog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Output */}
          {declutterResult && (
            <div className="space-y-6 animate-slide-fade-in">
              <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg flex items-start space-x-4">
                <div className="p-3 bg-accentMagenta/10 border border-accentMagenta/30 rounded-xl text-accentMagenta mt-0.5 animate-pulse">
                  <Sparkles className="h-5 w-5 text-accentMagenta" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">Study Coach Reassurance</span>
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">De-clutter Strategy Advice</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mt-1">{declutterResult.reassurance}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">Microscopic Study Framework Tasks</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Clear tasks sequentially to complete your session</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-accentMagenta to-accentPurple">
                      {Math.round((Object.values(completedSteps).filter(Boolean).length / declutterResult.atomic_steps.length) * 100)}% Cleared
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                      ({Object.values(completedSteps).filter(Boolean).length} of {declutterResult.atomic_steps.length} tasks)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800/60 rounded-full overflow-hidden border border-zinc-200/20">
                  <div 
                    className="h-full bg-gradient-to-r from-accentMagenta to-accentPurple transition-all duration-500 ease-out shadow-[0_0_8px_rgba(236,72,153,0.3)]"
                    style={{ width: `${Math.round((Object.values(completedSteps).filter(Boolean).length / declutterResult.atomic_steps.length) * 100)}%` }}
                  ></div>
                </div>

                {/* Celebratory Banner when 100% complete */}
                {Object.values(completedSteps).filter(Boolean).length === declutterResult.atomic_steps.length && (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 text-center animate-pulse shadow-md">
                    <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400 block">
                      🎉 Backlog De-cluttered Successfully!
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-light block mt-1">
                      You cleared all tasks for this session. Take a well-deserved break!
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  {declutterResult.atomic_steps.map((step, idx) => {
                    const isDone = !!completedSteps[idx];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleToggleStep(idx)}
                        className={`flex flex-col md:flex-row md:items-center justify-between border rounded-xl px-4 py-3 gap-3 cursor-pointer select-none transition-all duration-300 ${
                          isDone 
                            ? 'bg-zinc-150/40 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800/60 opacity-60' 
                            : 'bg-zinc-50 dark:bg-black/30 border-zinc-100 dark:border-zinc-800/40 hover:border-accentMagenta/30 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all duration-305 font-bold text-[10px] ${
                            isDone 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-305 dark:border-zinc-700 text-zinc-500'
                          }`}>
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span className={`text-xs font-medium transition-all duration-300 ${
                            isDone ? 'line-through text-zinc-400 dark:text-zinc-650' : 'text-zinc-700 dark:text-zinc-300'
                          }`}>
                            {step.task_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded-full font-mono font-bold">
                            ⏱️ {step.estimated_minutes} Min
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getImpactBadgeColor(step.priority)}`}>
                            {step.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* 3. FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-black/60 py-4 px-6 text-center text-[10px] text-zinc-500 dark:text-zinc-600 font-mono mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto transition-colors duration-300 no-print">
        <p>© 2026 MindVane Micro-App. Created under Principal UI/UX accessibility guidelines.</p>
        <p className="flex items-center space-x-1.5">
          <Heart className="h-3 w-3 text-accentMagenta fill-accentMagenta" />
          <span>Prioritizing Exam Students' Mental Health.</span>
        </p>
      </footer>
    </div>
    </>
  );
}

export default App;
