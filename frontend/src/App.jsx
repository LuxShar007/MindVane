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

function App() {
  const [exam, setExam] = useState('JEE');
  const [journalText, setJournalText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
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
      setAnalysis(data);
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
    <div className="min-h-screen bg-zinc-50 dark:bg-darkBg text-zinc-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-300 bg-dot-grid bg-mesh-gradient relative">
      
      {/* 1. HEADER */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accentPurple/10 border border-accentPurple/30 rounded-xl">
            <Brain className="h-6 w-6 text-accentPurple animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accentPurple to-accentMagenta inline neon-glow-purple">
              MindVane
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Burnout Tracker & Digital Companion for Exam Aspirants</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-accentPurple" />}
          </button>
          
          <span className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 font-mono hidden md:inline-block">
            {serverMode}
          </span>
          <span className="h-2 w-2 rounded-full bg-accentPurple animate-ping"></span>
        </div>
      </header>

      {/* 2. MAIN SPLIT-SCREEN DASHBOARD */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: JOURNAL INPUT & STRESS ANALYSIS (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Journal Form Card */}
          <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-accentPurple/5 dark:hover:shadow-accentPurple/5">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Compass className="w-40 h-40 text-accentPurple" />
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 dark:from-white to-zinc-500 dark:to-zinc-400 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accentPurple" />
              Journal & Burnout Analyzer
            </h2>

            <form onSubmit={generateAnalysis} className="space-y-4">
              {/* Exam Selection Dropdown */}
              <div className="space-y-2">
                <label 
                  htmlFor="exam-select" 
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                >
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

              {/* Journaling Textarea */}
              <div className="space-y-2">
                <label 
                  htmlFor="journal-textarea" 
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex justify-between"
                >
                  <span>Write down your thoughts</span>
                  <span className="text-zinc-400 dark:text-zinc-500 normal-case font-normal">Express freely about syllabus, tests, health, sleep</span>
                </label>
                <textarea
                  id="journal-textarea"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="I'm feeling incredibly overwhelmed. My mock marks have dropped, there's a huge revision backlog in physics/biology, and I barely sleep more than 4 hours. I feel like I'm letting everyone down..."
                  rows={6}
                  className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-4 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accentPurple transition-all font-light resize-none leading-relaxed text-sm"
                  required
                />
              </div>

              {/* Submit Button & Spinners */}
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

          {/* ANALYTICS OUTPUT SECTION (Bound to aria-live="polite") */}
          <div 
            aria-live="polite" 
            className="flex-1 flex flex-col justify-between"
          >
            {!analysis ? (
              // Empty/Intro State
              <div className="flex-1 bg-white/50 dark:bg-[#121212]/40 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px] transition-colors duration-300">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900/60 rounded-full border border-zinc-200 dark:border-zinc-800">
                  <Brain className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-400">No Stress Analysis Active</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-sm mt-1">
                    Fill out the journaling session above and hit "Analyze Stress Patterns" to parse your psychological workload, extract hidden stressors, and receive tailored advice.
                  </p>
                </div>
              </div>
            ) : analysis.risk_flagged ? (
              
              /* 3. CRISIS OVERRIDE POPUP */
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/80 rounded-2xl p-6 md:p-8 animate-blink-scarlet shadow-lg dark:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-600/10 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-500">
                    <AlertOctagon className="h-7 w-7 text-red-500 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-500">Crisis Alert & Assistance Required</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      Our system detected critical indicators of emotional crisis and severe distress in your journal. Please pause preparation immediately and contact one of the free support options below. You do not have to carry this load alone.
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
                        <a 
                          href={`tel:${line.number}`} 
                          className="mt-3 flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                          <span>{line.number}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-red-200 dark:border-red-950 pt-4 flex items-center justify-between text-xs text-red-500 dark:text-red-400/70">
                  <span>Free. Confidential. Available 24/7.</span>
                  <button 
                    onClick={() => setAnalysis(null)} 
                    className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline font-medium"
                  >
                    Reset Dashboard
                  </button>
                </div>
              </div>

            ) : (

              /* STRESS ANALYTICS VISUALIZATION DASHBOARD */
              <div className="space-y-6">
                
                {/* Visualizations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Anxiety Meter */}
                  <div className={`bg-white dark:bg-[#121212] border ${getAnxietyColor(analysis.anxiety_score).border} rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-500`}>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-1">Anxiety Index Meter</span>
                      <h4 className="text-sm text-zinc-800 dark:text-zinc-300 font-medium">Cognitive Stress Level</h4>
                    </div>

                    <div className="my-4 flex items-center justify-center relative">
                      {/* Radial Progress Bar */}
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="54"
                          stroke={darkMode ? "#1f2937" : "#e4e4e7"}
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="54"
                          stroke={getAnxietyColor(analysis.anxiety_score).hex}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 54}
                          strokeDashoffset={2 * Math.PI * 54 * (1 - analysis.anxiety_score / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
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
                        <span 
                          key={idx} 
                          className="px-3.5 py-1.5 rounded-xl bg-accentPurple/10 border border-accentPurple/30 text-accentPurple text-xs font-semibold flex items-center space-x-1.5"
                        >
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

                {/* Adaptive Mindfulness Exercise Widget */}
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

                {/* Empathetic Marquee */}
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

        </section>
        <section className="lg:col-span-5 bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex flex-col shadow-xl dark:shadow-2xl overflow-hidden min-h-[500px] lg:h-[calc(100vh-140px)] transition-all duration-300 hover:shadow-accentMagenta/5 dark:hover:shadow-accentMagenta/5">
          
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
                <span className="block text-[10px] text-zinc-500 dark:text-zinc-500">Real-time Psychological Support Companion</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Chat Messages Logs */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20"
            role="log"
            aria-label="Conversation with companion"
          >
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-accentPurple to-accentMagenta text-white rounded-br-none' 
                      : 'bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/60 text-zinc-800 dark:text-zinc-300 rounded-bl-none'
                  }`}
                >
                  <p className="font-light whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Simulated Chat Loader */}
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

          {/* Chat Send Form */}
          <form 
            onSubmit={sendMessage} 
            className="p-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#151515]/60 flex items-center space-x-2 transition-colors duration-300"
          >
            <div className="flex-1 relative">
              <label htmlFor="chat-message-input" className="sr-only">Type your response to the companion</label>
              <input
                id="chat-message-input"
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
              aria-label="Send message to companion"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>

        </section>

      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-black/60 py-4 px-6 text-center text-[10px] text-zinc-500 dark:text-zinc-600 font-mono mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto transition-colors duration-300">
        <p>© 2026 MindVane Micro-App. Created under Principal UI/UX accessibility guidelines.</p>
        <p className="flex items-center space-x-1.5">
          <Heart className="h-3 w-3 text-accentMagenta fill-accentMagenta" />
          <span>Prioritizing Exam Students' Mental Health.</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
