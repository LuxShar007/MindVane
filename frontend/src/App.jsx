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
  Moon
} from 'lucide-react';

// Help lines for the crisis override popup
const HELPLINES = [
  { name: "KIRAN Mental Health Helpline", number: "1800-599-0019", hours: "24/7 (Toll-Free, Govt of India)" },
  { name: "Vandrevala Foundation", number: "+91 9999 666 555", hours: "24/7 (Call/WhatsApp)" },
  { name: "Tele-MANAS", number: "14416 / 1800-891-4416", hours: "24/7 (Toll-Free)" },
  { name: "AASRA Helpline", number: "+91 98204 66726", hours: "24/7" },
  { name: "Sneha India", number: "+91 44 2464 0050", hours: "24/7" }
];

function StressLandscape({ anxietyScore }) {
  const isLow = anxietyScore < 40;
  const isMedium = anxietyScore >= 40 && anxietyScore < 75;
  const isHigh = anxietyScore >= 75;

  let title = "Serene Mindspace";
  let description = "Your cognitive load is within a healthy baseline. Keep doing what you're doing.";
  let bgGradient = "from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10";
  let borderColor = "border-emerald-200 dark:border-emerald-800/60";
  let titleColor = "text-emerald-600 dark:text-emerald-400";

  if (isMedium) {
    title = "Navigating Winds";
    description = "Moderate mental load detected. Take short breathing breaks to regain stability.";
    bgGradient = "from-amber-500/10 to-orange-500/5 dark:from-amber-950/20 dark:to-orange-950/10";
    borderColor = "border-amber-200 dark:border-amber-800/60";
    titleColor = "text-amber-600 dark:text-amber-400";
  } else if (isHigh) {
    title = "Stormy Horizon";
    description = "High emotional overload. Halt rigorous studying, step away, and seek support.";
    bgGradient = "from-rose-500/10 to-purple-500/5 dark:from-rose-950/20 dark:to-purple-950/10";
    borderColor = "border-rose-200 dark:border-rose-800/60";
    titleColor = "text-rose-500 dark:text-rose-400";
  }

  return (
    <div className={`bg-white dark:bg-[#121212] border ${borderColor} rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center gap-6 transition-all duration-500`}>
      <div className="flex-1 space-y-2">
        <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">Mental Landscape Visualization</span>
        <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
          {isLow && <Smile className="h-5 w-5" />}
          {isMedium && <Activity className="h-5 w-5" />}
          {isHigh && <AlertOctagon className="h-5 w-5" />}
          {title}
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          {description}
        </p>
      </div>

      <div className={`w-full md:w-64 h-36 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-850 relative bg-gradient-to-br ${isLow ? 'from-sky-100 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/40' : isMedium ? 'from-amber-50 to-orange-100/50 dark:from-slate-900 dark:to-amber-950/40' : 'from-purple-950/30 to-rose-950/40 dark:from-slate-950 dark:to-rose-950/30'} transition-all duration-500 flex items-center justify-center`}>
        <svg viewBox="0 0 300 120" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="hill-low" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="hill-medium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="hill-high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#be123c" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="sky-high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#31102f" />
            </linearGradient>
          </defs>

          {/* Low Anxiety (Serene Landscape) */}
          {isLow && (
            <g>
              {/* Calm Sun */}
              <circle cx="250" cy="35" r="18" fill="#fef08a" filter="drop-shadow(0px 0px 8px #fef08a)" />
              
              {/* Back Hill */}
              <path d="M 0 120 Q 90 60 180 85 T 300 95 L 300 120 L 0 120 Z" fill="#6ee7b7" opacity="0.6" />
              
              {/* Front Hill */}
              <path d="M 0 120 Q 120 75 220 90 T 300 105 L 300 120 L 0 120 Z" fill="url(#hill-low)" />
              
              {/* Puffy Clouds */}
              <path d="M 40 40 Q 45 32 53 35 Q 60 30 67 36 Q 73 37 72 43 Z" fill="#ffffff" opacity="0.9" />
              <path d="M 140 25 Q 148 15 158 18 Q 166 12 175 19 Q 182 21 180 28 Z" fill="#ffffff" opacity="0.75" />
              
              {/* Birds */}
              <path d="M 90 25 Q 93 21 95 25 Q 97 21 100 25" fill="none" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
              <path d="M 110 32 Q 112 29 114 32 Q 116 29 118 32" fill="none" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
              
              {/* Tiny tree */}
              <line x1="75" y1="90" x2="75" y2="78" stroke="#047857" strokeWidth="2.5" />
              <circle cx="75" cy="74" r="7" fill="#059669" />
              <circle cx="71" cy="76" r="5" fill="#34d399" />
            </g>
          )}

          {/* Medium Anxiety (Winds and Autumn) */}
          {isMedium && (
            <g>
              {/* Hazy Sun */}
              <circle cx="240" cy="45" r="15" fill="#fed7aa" opacity="0.8" />
              
              {/* Back Hill */}
              <path d="M 0 120 Q 80 75 160 90 T 300 98 L 300 120 L 0 120 Z" fill="#fde047" opacity="0.5" />
              
              {/* Front Hill */}
              <path d="M 0 120 Q 110 80 200 95 T 300 110 L 300 120 L 0 120 Z" fill="url(#hill-medium)" />
              
              {/* Wind Vectors */}
              <path d="M 20 30 Q 80 15 130 25 T 200 15" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.8" />
              <path d="M 50 50 Q 110 40 170 45 T 250 35" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
              
              {/* Falling leaves */}
              <path d="M 140 60 Q 142 55 145 60" fill="#d97706" opacity="0.8" />
              <path d="M 180 70 Q 183 67 185 71" fill="#ea580c" opacity="0.8" />
              
              {/* Leaning Tree */}
              <path d="M 90 98 Q 87 90 85 82" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
              {/* Leaf Cluster leaning left */}
              <ellipse cx="82" cy="77" rx="8" ry="6" fill="#ea580c" transform="rotate(-15 82 77)" />
              <ellipse cx="86" cy="73" rx="6" ry="5" fill="#fbbf24" transform="rotate(-15 86 73)" />
            </g>
          )}

          {/* High Anxiety (Stormy horizon) */}
          {isHigh && (
            <g>
              {/* Background gradient */}
              <rect width="300" height="120" fill="url(#sky-high)" opacity="0.3" />
              
              {/* Back Mountain (Jagged) */}
              <path d="M 0 120 L 40 85 L 90 100 L 150 70 L 220 95 L 300 75 L 300 120 Z" fill="#881337" opacity="0.4" />
              
              {/* Front Mountain */}
              <path d="M 0 120 L 50 95 L 110 105 L 180 80 L 240 102 L 300 90 L 300 120 Z" fill="url(#hill-high)" />
              
              {/* Storm Cloud */}
              <path d="M 120 30 Q 130 18 145 22 Q 155 12 170 18 Q 185 14 195 24 Q 205 28 200 38 Q 195 44 180 42 Q 165 44 150 42 Q 135 44 125 38 Z" fill="#475569" opacity="0.9" />
              <path d="M 130 34 Q 138 24 150 27 Q 158 18 170 23 Q 180 20 188 28 Z" fill="#334155" opacity="0.95" />
              
              {/* Lightning Bolts */}
              <path d="M 160 38 L 150 55 L 162 55 L 152 75" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0px 0px 4px #fbbf24)" />
              <path d="M 182 36 L 175 48 L 184 48 L 178 64" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0px 0px 3px #fbbf24)" />
              
              {/* Rain lines */}
              <line x1="130" y1="45" x2="120" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
              <line x1="145" y1="45" x2="135" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
              <line x1="165" y1="45" x2="155" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />
              <line x1="190" y1="45" x2="180" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
              <line x1="205" y1="45" x2="195" y2="70" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const [introFadeOut, setIntroFadeOut] = useState(false);

  const mottos = [
    "De-cluttering chaotic backlogs...",
    "Visualizing cognitive workloads...",
    "Empathetic companion by your side...",
    "Your peace of mind, prioritized."
  ];

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
      setCurrentMottoIndex((prev) => (prev + 1) % mottos.length);
    }, 700);

    return () => {
      clearInterval(progressTimer);
      clearInterval(mottoTimer);
    };
  }, []);

  const [exam, setExam] = useState('JEE');
  const [journalText, setJournalText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  // Backlog Declutterer State
  const [rawBacklog, setRawBacklog] = useState('');
  const [declutterResult, setDeclutterResult] = useState(null);
  const [isLoadingDeclutter, setIsLoadingDeclutter] = useState(false);
  const [view, setView] = useState('welcome'); // 'welcome' | 'launcher' | 'analyzer' | 'chat' | 'declutter'
  
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
  const runOfflineAnalysisSimulation = (targetExam, text) => {
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
        encouragement: "Please pause right now. Your exam preparation, score, and career milestone do not define your life. There are people trained to support you through this exact feeling. Reach out."
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

    return {
      risk_flagged: false,
      anxiety_score: finalScore,
      emotional_trends: trends,
      stress_triggers: triggers,
      mindfulness_exercise: selectedExercise,
      encouragement: selectedEncouragement
    };
  };

  // 1. Submit Journal for Analysis
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
        body: JSON.stringify({ exam, journal_text: journalText })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const normalizedData = {
        risk_flagged: data.risk_flagged ?? data.riskFlagged ?? false,
        anxiety_score: data.anxiety_score ?? data.anxietyScore ?? 50,
        emotional_trends: Array.isArray(data.emotional_trends)
          ? data.emotional_trends
          : (data.primaryTrend ? [data.primaryTrend] : (data.primary_trend ? [data.primary_trend] : ["General stress"])),
        stress_triggers: (data.stress_triggers ?? data.triggers ?? []).map(t => ({
          trigger: t.trigger ?? t.name ?? "General performance strain",
          impact: t.impact ?? "Medium"
        })),
        mindfulness_exercise: data.mindfulness_exercise ?? data.exercise ?? "Take a slow breath.",
        encouragement: data.encouragement ?? "You are doing your best."
      };
      setAnalysis(normalizedData);
      setFeedbackMsg("Analysis loaded from backend database.");
    } catch (error) {
      console.warn("Backend API not reachable. Running simulated UI response fallback...", error);
      // Run offline simulation
      const simulatedResult = runOfflineAnalysisSimulation(exam, journalText);
      setAnalysis(simulatedResult);
      setFeedbackMsg("Notice: Running in Client-side Emulated Mode (Offline Fallback)");
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
      setDeclutterResult(data);
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
          history: updatedHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.warn("Companion Chat API not reachable. Simulating empathetic companion response...", error);
      // Construct a smart simulated response
      let companionReply = "";
      const lowerMsg = userMessageText.toLowerCase();

      if (lowerMsg.includes('suicide') || lowerMsg.includes('kill myself') || lowerMsg.includes('die')) {
        companionReply = "I am deeply concerned to hear that. Your safety is absolute priority. Please reach out to KIRAN at 1800-599-0019 or Tele-MANAS at 14416 immediately. There are professionals ready to walk with you through this pain.";
      } else if (lowerMsg.includes('sleep') || lowerMsg.includes('tired') || lowerMsg.includes('exhausted')) {
        companionReply = "Sleep is often the first thing we sacrifice under competitive exam pressure, yet it is the foundation of cognitive functioning. Try setting a hard 'digital sunset' tonight. Can you commit to resting 7 hours today?";
      } else if (lowerMsg.includes('mock') || lowerMsg.includes('marks') || lowerMsg.includes('score')) {
        companionReply = "Mock scores can feel like a direct verdict on your future, but they are actually diagnostic logs. They show you where to align your efforts, not how smart you are. Let's make a plan to check your mistakes calmly.";
      } else if (lowerMsg.includes('fail') || lowerMsg.includes('fear') || lowerMsg.includes('scared')) {
        companionReply = "The fear of failure in examinations like " + exam + " is incredibly high due to social pressures. Try to decouple your identity from the outcome. You are a valuable person regardless of what sheet is printed on result day.";
      } else {
        companionReply = "I hear you. The preparation journey for " + exam + " is grueling, and feeling this weight is part of the challenge. Tell me, what is one small thing you can control in your schedule right now to make you feel slightly more at peace?";
      }

      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'assistant', content: companionReply }]);
        setIsLoadingChat(false);
      }, 700); // realistic delay
      return;
    } finally {
      if (base) {
        setIsLoadingChat(false);
      }
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
                {mottos[currentMottoIndex]}
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

      <div className="min-h-screen bg-zinc-50 dark:bg-darkBg text-zinc-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-300 bg-dot-grid bg-mesh-gradient relative">
      
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
              <div className="space-y-2">
                <label htmlFor="exam-select" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Target Examination
                </label>
                <select
                  id="exam-select"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accentPurple transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="JEE">JEE (Joint Entrance Examination)</option>
                  <option value="NEET">NEET (National Eligibility cum Entrance Test)</option>
                  <option value="BOARDS">Class 10 / 12 Board Exams (CBSE, ICSE, State Boards)</option>
                  <option value="CAT">CAT (Common Admission Test)</option>
                  <option value="GATE">GATE (Graduate Aptitude Test in Engineering)</option>
                  <option value="UPSC">UPSC (Union Public Service Commission)</option>
                </select>
              </div>

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
              <div className="space-y-2">
                <label htmlFor="exam-select-declutter" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Target Examination
                </label>
                <select
                  id="exam-select-declutter"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accentMagenta transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="JEE">JEE (Joint Entrance Examination)</option>
                  <option value="NEET">NEET (National Eligibility cum Entrance Test)</option>
                  <option value="BOARDS">Class 10 / 12 Board Exams (CBSE, ICSE, State Boards)</option>
                  <option value="CAT">CAT (Common Admission Test)</option>
                  <option value="GATE">GATE (Graduate Aptitude Test in Engineering)</option>
                  <option value="UPSC">UPSC (Union Public Service Commission)</option>
                </select>
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
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">Microscopic Study Framework Tasks</span>
                <div className="space-y-3">
                  {declutterResult.atomic_steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-50 dark:bg-black/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl px-4 py-3 gap-3">
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-accentMagenta/15 text-accentMagenta text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{step.task_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded-full font-mono font-bold">
                          ⏱️ {step.estimated_minutes} Min
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getImpactBadgeColor(step.priority)}`}>
                          {step.priority}
                        </span>
                      </div>
                    </div>
                  ))}
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
