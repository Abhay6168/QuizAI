import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Key, Users, CheckCircle, Sparkles, CornerDownLeft, 
  Trophy, Target, Zap, Flame, BrainCircuit, LineChart, 
  Award, RefreshCw, Smartphone, LogIn, UserPlus, LogOut, ChevronDown
} from 'lucide-react';

const StudentJoin = ({ 
  setPage, 
  studentName, 
  setStudentName, 
  roomCode, 
  setRoomCode, 
  socketJoinRoom, 
  socketLeaveRoom,
  lobbyParticipants = [] 
}) => {
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('weak');

  // Simulated authenticated student user state
  const [studentUser, setStudentUser] = useState(null); // null means not authenticated yet
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Simulated scoreboards, tickers, timers, achievements
  const [boardScores, setBoardScores] = useState([
    { id: 1, name: '🥇 Rahul', score: 1450, color: 'border-yellow-500/30' },
    { id: 2, name: '🥈 Abhay', score: 1390, color: 'border-slate-300/30' },
    { id: 3, name: '🥉 Priya', score: 1320, color: 'border-amber-600/30' }
  ]);

  const [simStudents, setSimStudents] = useState([
    { name: 'Chloe_12', color: 'bg-emerald-500' },
    { name: 'Zayn_04', color: 'bg-indigo-500' },
    { name: 'Maya_99', color: 'bg-rose-500' }
  ]);

  // Section 3 simulated states
  const [sec3Timer, setSec3Timer] = useState(10);
  const [sec3Points, setSec3Points] = useState(100);

  // Section 8 AI simulated state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Refs for smooth navigation scrolling
  const heroRef = useRef(null);
  const lobbyRef = useRef(null);
  const featuresRef = useRef(null);
  const rankingsRef = useRef(null);
  const aiRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Simulated score additions
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setBoardScores(prev => {
        const updated = prev.map(student => {
          const increment = Math.floor(Math.random() * 45) + 15;
          return { ...student, score: student.score + increment };
        });
        return updated.sort((a, b) => b.score - a.score);
      });
    }, 2800);
    return () => clearInterval(scoreInterval);
  }, []);

  // Section 3 timer simulation
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSec3Timer(prev => {
        if (prev <= 1) {
          setSec3Points(100);
          return 10;
        }
        const nextTime = prev - 1;
        setSec3Points(100 + (nextTime * 5));
        return nextTime;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Simulated live joining contestants in Section 2
  useEffect(() => {
    const names = ['Kenji', 'Elena', 'Diego', 'Omar', 'Aisha', 'Rohit', 'Sana', 'John'];
    const colors = ['bg-amber-500', 'bg-violet-500', 'bg-teal-500', 'bg-cyan-500', 'bg-fuchsia-500'];
    
    const joinInterval = setInterval(() => {
      setSimStudents(prev => {
        if (prev.length < 8) {
          const randName = names[prev.length % names.length] + '_' + Math.floor(Math.random() * 90 + 10);
          const randCol = colors[prev.length % colors.length];
          return [...prev, { name: randName, color: randCol }];
        } else {
          return [
            { name: 'Chloe_12', color: 'bg-emerald-500' },
            { name: 'Zayn_04', color: 'bg-indigo-500' },
            { name: 'Maya_99', color: 'bg-rose-500' }
          ];
        }
      });
    }, 2400);

    return () => clearInterval(joinInterval);
  }, []);

  // Form handle join lobby
  const handleJoin = (e) => {
    if (e) e.preventDefault();
    if (!studentName || !roomCode) {
      setError('Please provide your name and the active Room Code');
      return;
    }
    setError('');

    // Sockets interface call
    const success = socketJoinRoom(roomCode.toUpperCase().trim(), studentName.trim());
    if (success) {
      setJoined(true);
    } else {
      // Local fallback simulation
      setJoined(true);
    }
  };

  const handleAiGen = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 4000);
    }, 2200);
  };

  // Auth form handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (!authEmail || !authPassword) {
        setAuthError('All fields are required');
        return;
      }
      setAuthError('');
      // Simulate successful login
      const mockUser = {
        name: authEmail.split('@')[0].toUpperCase(),
        email: authEmail,
        xp: 14200,
        avgSpeed: '1.2s',
        accuracy: '88%',
        badges: 4
      };
      setStudentUser(mockUser);
      setStudentName(mockUser.name);
    } else {
      if (!authName || !authEmail || !authPassword) {
        setAuthError('All fields are required');
        return;
      }
      setAuthError('');
      // Simulate successful signup
      const mockUser = {
        name: authName.toUpperCase(),
        email: authEmail,
        xp: 1000,
        avgSpeed: '0.0s',
        accuracy: '0%',
        badges: 0
      };
      setStudentUser(mockUser);
      setStudentName(mockUser.name);
    }
  };

  // Design system theme configuration matching TeacherIntro CSS perfectly!
  const isDark = theme === 'dark';
  
  const bgClass = isDark 
    ? 'bg-[#0b090f] text-white' 
    : 'bg-gradient-to-r from-[#F96C99] via-[#F3AE92] to-[#ECEA8C] text-[#1d1c1c]';

  const textClass = isDark ? 'text-white' : 'text-[#1D1C1C]';
  
  const subtextClass = isDark ? 'text-slate-300 font-bold' : 'text-[#1D1C1C]/90 font-bold';

  const labelClass = isDark ? 'text-slate-400' : 'text-slate-700';

  const cardBgClass = isDark 
    ? 'bg-[#14121b] border-2 border-white shadow-[6px_6px_0px_#86EF6A] text-white' 
    : 'bg-white border-2 border-black shadow-[6px_6px_0px_#000] text-[#1D1C1C]';
    
  const innerCardBgClass = isDark 
    ? 'bg-[#0d0b12] border-2 border-white shadow-[3px_3px_0px_#7ED8FF] text-white' 
    : 'bg-white border-2 border-black shadow-[3px_3px_0px_#000] text-[#1D1C1C]';
    
  const borderClass = isDark ? 'border-white/10' : 'border-black';

  return (
    <div className={`w-full min-h-screen overflow-x-clip selection:bg-purple-500 selection:text-white relative transition-all duration-700 ${bgClass}`}>
      
      {/* Cinematic Background Orbs */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[200vh] right-1/4 w-[800px] h-[800px] bg-emerald-950/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-[400vh] left-10 w-[700px] h-[700px] bg-rose-950/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[600vh] right-10 w-[800px] h-[800px] bg-sky-950/20 rounded-full blur-[150px] pointer-events-none" />
        </>
      )}

      {/* Enlarged Sticky Three-Part Neo-Brutalist Navbar (Copied EXACTLY from TeacherIntro layout) */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* Left Part: Overlapping brand pill */}
        <div className="relative flex items-center">
          <div 
            onClick={() => setPage('landing')} 
            className={`absolute -left-3 w-[66px] h-[66px] rounded-full border-2 flex items-center justify-center font-sora font-[900] text-base cursor-pointer shadow-[0_4px_0_#000] hover:scale-105 active:scale-95 transition-all select-none z-10 ${
              isDark ? 'bg-[#14121b] border-white text-white shadow-[0_4px_0_#FFF]' : 'bg-black border-black text-white'
            }`}
            title="Go to Landing"
          >
            IQ
          </div>

          <div 
            onClick={() => scrollToRef(heroRef)}
            className={`border-2 rounded-full pl-[74px] pr-6 py-[15px] flex items-center gap-3 cursor-pointer select-none transition-all duration-150 ${
              isDark 
                ? 'bg-purple-600 border-white text-white shadow-[0_4px_0_#FFF] hover:shadow-[0_2px_0_#FFF]' 
                : 'bg-[#ECEA8C] border-black text-[#1d1c1c] shadow-[0_4px_0_#000] hover:shadow-[0_2px_0_#000]'
            } hover:translate-y-[1px] active:translate-y-[3px]`}
          >
            <span className="font-sora font-[900] text-[11px] uppercase tracking-widest">
              ARENA
            </span>
          </div>
        </div>

        {/* Center Part: Links Pill (Duplicated capitalization and weight style) */}
        <div className={`hidden lg:flex items-center gap-10 border-2 rounded-full px-[50px] py-[15px] ${
          isDark 
            ? 'bg-[#14121b] border-white text-white shadow-[0_4px_0_#FFF]' 
            : 'bg-white border-black text-[#1d1c1c] shadow-[0_4px_0_#000]'
        }`}>
          <button onClick={() => scrollToRef(lobbyRef)} className={`text-[13px] font-black uppercase tracking-wider transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Lobby</button>
          <button onClick={() => scrollToRef(featuresRef)} className={`text-[13px] font-black uppercase tracking-wider transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Pacing</button>
          <button onClick={() => scrollToRef(rankingsRef)} className={`text-[13px] font-black uppercase tracking-wider transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Rankings</button>
          <button onClick={() => scrollToRef(aiRef)} className={`text-[13px] font-black uppercase tracking-wider transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>AI practice</button>
        </div>

        {/* Right Part: Theme toggler & Profile smiley option */}
        <div className="flex items-center gap-3">
          
          {/* LGT / DRK toggler pill matching EN/NL layout exactly */}
          <div className={`border-2 rounded-full p-1.5 flex items-center gap-1.5 ${
            isDark ? 'bg-[#14121b] border-white shadow-[0_4px_0_#FFF]' : 'bg-white border-black shadow-[0_4px_0_#000]'
          }`}>
            <button 
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                theme === 'light' 
                  ? 'bg-[#ECEA8C] border border-black text-[#1d1c1c]' 
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              LGT
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-purple-600 border border-black text-white' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              DRK
            </button>
          </div>

          {/* Smiley theme mascot / Toggle */}
          <div 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-[54px] h-[54px] rounded-full border-2 flex items-center justify-center cursor-pointer hover:rotate-12 transition-all duration-300 select-none active:scale-95 ${
              isDark 
                ? 'bg-[#14121b] border-white shadow-[0_4px_0_#FFF]' 
                : 'bg-white border-black shadow-[0_4px_0_#000]'
            }`}
            title="Toggle Theme"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill={isDark ? "white" : "black"}>
              <circle cx="7.5" cy="10" r="2.5" fill={isDark ? "white" : "black"} />
              <circle cx="6.7" cy="9.2" r="0.8" fill={isDark ? "black" : "white"} />
              <circle cx="8.3" cy="10.8" r="0.4" fill={isDark ? "black" : "white"} />
              <circle cx="16.5" cy="10" r="2.5" fill={isDark ? "white" : "black"} />
              <circle cx="15.7" cy="9.2" r="0.8" fill={isDark ? "black" : "white"} />
              <circle cx="17.3" cy="10.8" r="0.4" fill={isDark ? "black" : "white"} />
              <path d="M 10 15 Q 12 16.5 14 15" stroke={isDark ? "white" : "black"} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* User profile dropdown if logged in */}
          {studentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`px-4 py-3 rounded-xl border flex items-center gap-1.5 text-xs font-black uppercase transition ${
                  isDark ? 'bg-white/5 border-white/15 text-white hover:bg-white/10' : 'bg-white border-black text-black hover:bg-black/5'
                }`}
              >
                <span>🎮 {studentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-3 w-56 rounded-2xl p-4 shadow-2xl z-50 border ${
                      isDark ? 'bg-[#14121b] border-white/20 text-white' : 'bg-white border-black text-black'
                    }`}
                  >
                    <div className="border-b pb-2 mb-3 border-white/10 text-left">
                      <span className="text-[9px] font-black uppercase text-slate-500">Contestant XP</span>
                      <span className="text-sm font-mono font-black text-[#86EF6A] block">{studentUser.xp} XP</span>
                    </div>

                    <div className="space-y-2 mb-4 text-xs font-bold text-left">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Accuracy:</span>
                        <span>{studentUser.accuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Response Speed:</span>
                        <span>{studentUser.avgSpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Badges:</span>
                        <span>{studentUser.badges}/5 🏆</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStudentUser(null);
                        setStudentName('');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-500 hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> LOG OUT
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => {
                setStudentUser(null);
                setStudentName('');
              }}
              className="px-4 py-3 text-xs font-black uppercase bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" /> SIGN IN
            </button>
          )}

        </div>
      </header>

      {/* ====================================================
          AUTHENTICATION SPLASH GATE (ASK FIRST TO LOGIN OR SIGNUP)
          ==================================================== */}
      <AnimatePresence>
        {!studentUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-2xl transition-all duration-300 ${isDark ? 'bg-[#09070eed]' : 'bg-[#1c1c1e]/60'}`}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-4xl rounded-[32px] overflow-hidden flex flex-col md:flex-row relative z-50 my-8 transition-all duration-300 ${cardBgClass}`}
            >
              {/* Left Column: Exciting Arena Intro features list */}
              <div className={`flex-1 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r text-left transition-all duration-300 ${isDark ? 'bg-gradient-to-br from-purple-900/40 via-indigo-950/40 to-slate-950/40 border-white/10' : 'bg-slate-50 border-black/10'}`}>
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center font-black text-sm text-white mb-6 shadow-md">
                    IQ
                  </div>
                  <h3 className={`font-sora font-black text-2xl mb-2 uppercase tracking-tight ${textClass}`}>JOIN THE MULTIPLAYER ARENA</h3>
                  <p className={`text-xs leading-relaxed mb-6 font-bold ${subtextClass}`}>
                    Authenticate your credentials to access exclusive contestant multipliers, accuracy history tracking, and diagnostic feedback modules.
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: <Trophy className="w-4 h-4 text-yellow-400" />, title: 'Climb leaderboards', desc: 'Secure XP rankings and compare speed pacings.' },
                      { icon: <Award className="w-4 h-4 text-[#7ED8FF]" />, title: 'Unlock Achievements', desc: 'Earn badges for perfect accuracy and response pacers.' },
                      { icon: <BrainCircuit className="w-4 h-4 text-[#86EF6A]" />, title: 'AI Advisory reports', desc: 'Get diagnostic sheets for weak concept nodes.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className={`text-xs font-black uppercase ${textClass}`}>{item.title}</h4>
                          <p className={`text-[10px] ${labelClass}`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`mt-8 pt-6 border-t flex items-center gap-2 text-[10px] font-black tracking-wider ${isDark ? 'border-white/5 text-slate-500' : 'border-black/10 text-slate-600'}`}>
                  <span>SECURED ARENA PROTOCOLS</span>
                  <span>•</span>
                  <span>V.3.1</span>
                </div>
              </div>

              {/* Right Column: Dynamic login/signup switch form */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-left">
                
                {/* Form header toggles */}
                <div className={`flex gap-4 mb-8 border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                    }}
                    className={`pb-2 text-sm font-black uppercase transition ${authMode === 'login' ? 'text-purple-600 border-b-2 border-purple-600' : `${labelClass} hover:text-black`}`}
                  >
                    SIGN IN
                  </button>
                  <button 
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError('');
                    }}
                    className={`pb-2 text-sm font-black uppercase transition ${authMode === 'signup' ? 'text-purple-600 border-b-2 border-purple-600' : `${labelClass} hover:text-black`}`}
                  >
                    REGISTER
                  </button>
                </div>

                {authError && (
                  <div className={`p-3 mb-6 rounded-xl text-xs text-center font-bold ${isDark ? 'bg-red-950/40 border border-red-500/20 text-red-400' : 'bg-red-100 border border-red-500 text-red-700 shadow-sm'}`}>
                    ⚠️ {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  
                  {authMode === 'signup' && (
                    <div>
                      <label className={`block text-[10px] font-black tracking-wider ${labelClass} uppercase mb-2`}>Gamer Tag / Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="e.g. Einstein_2.0"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition text-sm font-black uppercase outline-none ${
                            isDark ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={`block text-[10px] font-black tracking-wider ${labelClass} uppercase mb-2`}>Contestant Email</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        placeholder="contestant@intelliquiz.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition text-sm font-bold outline-none ${
                          isDark ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-black tracking-wider ${labelClass} uppercase mb-2`}>Security Key</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition text-sm font-bold outline-none ${
                          isDark ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 ${isDark ? 'bg-white text-black hover:bg-[#86EF6A]' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-[3px_3px_0px_#000] border-2 border-black'}`}
                  >
                    {authMode === 'login' ? (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>ENTER CONTESTANT GATE</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>CREATE CONTESTANT PROFILE</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Continue as Guest fallback option */}
                <div className={`mt-6 border-t pt-4 text-center ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <button
                    onClick={() => {
                      // Generate random guest username
                      const randName = 'GUEST_' + Math.floor(Math.random() * 900 + 100);
                      const mockGuest = {
                        name: randName,
                        email: 'guest@intelliquiz.com',
                        xp: 0,
                        avgSpeed: '0.0s',
                        accuracy: '0%',
                        badges: 0
                      };
                      setStudentUser(mockGuest);
                      setStudentName(randName);
                    }}
                    className={`text-[10px] font-black uppercase underline tracking-widest transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#1D1C1C]/60 hover:text-purple-600'}`}
                  >
                    CONTINUE AS GUEST CONTESTANT
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOBBY ACTIVE OVERLAY STATE (Rendered when student submits room join code) */}
      <AnimatePresence>
        {joined && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl ${isDark ? 'bg-[#09070ed0]' : 'bg-[#1c1c1e]/60'}`}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className={`w-full max-w-lg p-8 md:p-10 rounded-[32px] text-center relative overflow-hidden transition-all duration-300 ${cardBgClass}`}
            >
              {/* Top scanning line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#86EF6A] via-cyan-400 to-[#86EF6A] animate-pulse" />

              <div className="w-20 h-20 rounded-full bg-[#86EF6A]/10 border-2 border-[#86EF6A] flex items-center justify-center mx-auto text-emerald-500 mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-[#86EF6A]" />
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-4 ${isDark ? 'bg-white/5 border border-white/10 text-emerald-300' : 'bg-[#86EF6A]/20 border border-[#86EF6A] text-emerald-800 font-black shadow-sm'}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                LOBBY CODE: {roomCode.toUpperCase()}
              </div>

              <h2 className={`font-sora font-black text-3xl mb-2 ${textClass}`}>Welcome to the Arena, {studentName}!</h2>
              <p className={`text-sm mb-8 max-w-sm mx-auto font-bold leading-relaxed ${subtextClass}`}>
                Waiting for the instructor to launch the live countdown parameters. Warm up your response skills!
              </p>

              <div className={`border-2 p-6 rounded-2xl text-left mb-8 relative ${innerCardBgClass}`}>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#7ED8FF] to-transparent animate-pulse" />
                
                <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <span className={`text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${labelClass}`}>
                    <Users className="w-4 h-4 text-purple-400" /> CONTESTANTS PREPPED
                  </span>
                  <span className="text-xs font-mono font-black text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {lobbyParticipants.length || 4} ACTIVE
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-1">
                  {(lobbyParticipants.length > 0 ? lobbyParticipants : [
                    { username: studentName },
                    { username: 'Rahul' },
                    { username: 'Priya' },
                    { username: 'Abhay' }
                  ]).map((p, idx) => (
                    <div 
                       key={idx} 
                       className={`py-2.5 px-4 rounded-xl text-xs font-black border flex items-center gap-2 transition ${
                         p.username === studentName 
                           ? 'bg-[#86EF6A]/20 border-[#86EF6A] text-[#1c1c1e] shadow-md' 
                           : isDark 
                           ? 'bg-white/5 border-white/5 text-slate-300' 
                           : 'bg-slate-50 border-black/10 text-slate-800'
                       }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${p.username === studentName ? 'bg-[#86EF6A] animate-ping' : 'bg-purple-500'}`} />
                      <span className="truncate uppercase tracking-wider">{p.username}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase animate-pulse ${labelClass}`}>
                <Sparkles className="w-4 h-4 text-[#7ED8FF]" />
                <span>LIVE SOCKET STREAM SECURED</span>
              </div>

              <button
                onClick={() => {
                  setJoined(false);
                  if (socketLeaveRoom) {
                    socketLeaveRoom(roomCode, studentName);
                  }
                }}
                className="mt-6 text-xs font-black uppercase text-rose-500 hover:underline tracking-widest transition"
              >
                LEAVE ROOM
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          HERO SECTION (ENTER THE QUIZ ARENA)
          ==================================================== */}
      <section ref={heroRef} className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 py-20 text-center z-20">
        
        {/* Floating Cyberpunk Stickers */}
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-12 left-10 md:left-24 bg-rose-500 border-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider z-20 text-white ${
            isDark ? 'border-white shadow-[3px_3px_0px_#FFF]' : 'border-black shadow-[3px_3px_0px_#000]'
          }`}
        >
          ⚡ LIVE NOW
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-36 left-8 md:left-28 bg-[#86EF6A] text-black border-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider z-20 ${
            isDark ? 'border-white shadow-[3px_3px_0px_#FFF]' : 'border-black shadow-[3px_3px_0px_#000]'
          }`}
        >
          🎯 ACCURACY BONUS
        </motion.div>

        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-20 right-10 md:right-28 bg-[#7ED8FF] text-black border-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider z-20 ${
            isDark ? 'border-white shadow-[3px_3px_0px_#FFF]' : 'border-black shadow-[3px_3px_0px_#000]'
          }`}
        >
          🏆 TOP PLAYER
        </motion.div>

        <motion.div 
          animate={{ y: [0, 8, 0], rotate: [3, -3, 3] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-28 right-8 md:right-32 bg-purple-600 border-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider z-20 text-white ${
            isDark ? 'border-white shadow-[3px_3px_0px_#FFF]' : 'border-black shadow-[3px_3px_0px_#000]'
          }`}
        >
          🔥 SPEED MATTERS
        </motion.div>

        {/* Hero Heading Content */}
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className={`text-xs font-black uppercase tracking-widest border px-4 py-1.5 rounded-full mb-6 flex items-center gap-2 transition-all ${
            isDark ? 'bg-white/5 border-white text-slate-300' : 'bg-white/50 border-black text-[#1c1c1e] shadow-[2px_2px_0px_#000]'
          }`}>
            <Trophy className="w-3.5 h-3.5 text-[#86EF6A]" /> JOIN • COMPETE • WIN
          </span>

          <h1 className={`font-sora font-[900] text-[60px] sm:text-[96px] md:text-[115px] leading-[0.82] tracking-[-0.06em] flex flex-col mb-8 uppercase ${textClass}`}>
            <span>ENTER THE</span>
            <span className={isDark ? "bg-gradient-to-r from-[#86EF6A] via-[#7ED8FF] to-pink-500 bg-clip-text text-transparent" : "text-[#1c1c1e]"}>QUIZ ARENA.</span>
          </h1>

          <p className={`text-base md:text-xl font-bold leading-relaxed max-w-2xl mb-12 ${subtextClass}`}>
            Join live quiz competitions, earn points, climb leaderboards, unlock achievements, and improve with AI-powered feedback.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 z-30">
            <motion.button
              onClick={() => scrollToRef(lobbyRef)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-5 font-black uppercase text-sm tracking-widest rounded-2xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#86EF6A] border-white text-black shadow-[6px_6px_0px_#FFF] hover:bg-[#86EF6A]/90' 
                  : 'bg-[#86EF6A] border-black text-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[4px] active:shadow-none'
              }`}
            >
              JOIN A QUIZ 🚀
            </motion.button>
            <motion.button
              onClick={() => scrollToRef(featuresRef)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-5 font-black uppercase text-sm tracking-widest rounded-2xl border-2 transition-all ${
                isDark 
                  ? 'bg-white/5 border-white text-white shadow-[6px_6px_0px_#FFF] hover:bg-white/10' 
                  : 'bg-white border-black text-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[4px] active:shadow-none'
              }`}
            >
              WATCH DEMO 🎮
            </motion.button>
          </div>
        </div>

        {/* Animated Leaderboard Visual Rankings */}
        <div className="mt-20 w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden transition-all duration-500 ${cardBgClass}`}
          >
            {/* Top scanning bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#86EF6A] to-transparent animate-pulse" />

            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${borderClass}`}>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">LIVE ARENA LEADERS SHIFT</span>
              <div className="flex items-center gap-1.5 text-[#86EF6A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#86EF6A] animate-ping" />
                <span className="text-[9px] font-mono font-bold">SIMULATION ACTIVE</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 relative">
              {boardScores.map((student, idx) => (
                <motion.div
                  key={student.id}
                  layout
                  className={`border rounded-xl p-3 flex items-center justify-between transition-all duration-500 ${innerCardBgClass} ${student.color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 w-5">#{idx + 1}</span>
                    <span className={`text-xs font-black uppercase tracking-wider ${textClass}`}>{student.name}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#86EF6A]">
                    {student.score} PTS
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          SECTION 2 (JOIN IN SECONDS)
          ==================================================== */}
      <section ref={lobbyRef} className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-[#86EF6A]/10 border-2 border-[#86EF6A]/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit text-[#86EF6A] mb-6">
                🔑 ACCESS PORTAL
              </div>

              <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-6 uppercase ${textClass}`}>
                <span>JOIN IN</span>
                <span className={isDark ? "bg-gradient-to-r from-purple-400 to-[#7ED8FF] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>SECONDS.</span>
              </h2>

              <p className={`text-sm md:text-base font-bold leading-relaxed max-w-sm mb-6 ${subtextClass}`}>
                Students can enter a room code and username to instantly join any live quiz. No messy logins needed.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 w-full flex flex-col md:flex-row gap-8 items-stretch">
            
            {/* Interactive Live Lobby Form card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex-1 border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden transition-all duration-500 ${cardBgClass}`}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#7ED8FF] to-transparent animate-pulse" />

              <div className="text-center mb-6">
                <h3 className={`text-lg font-black uppercase tracking-tight flex items-center justify-center gap-1.5 ${textClass}`}>
                  <Smartphone className="w-5 h-5 text-purple-400" /> ENTRY TERMINAL
                </h3>
              </div>

              {error && (
                <div className="p-3 mb-6 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-400 text-center font-bold">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className={`block text-[10px] font-black tracking-wider ${labelClass} uppercase mb-2`}>Contestant Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="ENTER USERNAME"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition text-sm font-black uppercase tracking-wider outline-none ${
                        isDark ? 'bg-black/40 border-white/20 focus:border-[#7ED8FF] text-white' : 'bg-black/5 border-black/20 focus:border-purple-600 text-black'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-black tracking-wider ${labelClass} uppercase mb-2`}>Room Arena Code</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. AI123"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition text-sm font-extrabold uppercase tracking-widest text-center outline-none ${
                        isDark ? 'bg-black/40 border-white/20 focus:border-[#7ED8FF] text-white' : 'bg-black/5 border-black/20 focus:border-purple-600 text-black'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-black hover:bg-[#86EF6A] hover:text-black border-2 border-black font-black text-xs uppercase tracking-widest transition duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                >
                  ENTER ARENA LOBBY 🚀
                </button>
              </form>
            </motion.div>

            {/* Simulated Live Queue stream card */}
            <div className="flex-1 w-full max-w-sm flex flex-col justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden transition-all duration-500 h-full ${innerCardBgClass}`}
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#86EF6A] to-transparent animate-pulse" />

                <div className={`flex items-center justify-between border-b pb-3 mb-4 ${borderClass}`}>
                  <span className={`text-[9px] font-black uppercase ${labelClass} tracking-wider`}>LIVE QUEUE FROM WEB SOCKETS</span>
                  <span className="w-2 h-2 rounded-full bg-[#86EF6A] animate-ping" />
                </div>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                  <AnimatePresence>
                    {simStudents.map((stud, idx) => (
                      <motion.div
                        key={idx}
                        className={`border rounded-xl p-3 flex items-center gap-2.5 ${
                          isDark ? 'bg-black/30 border-white/10' : 'bg-black/5 border-black/10'
                        }`}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                      >
                        <span className={`w-2 h-2 rounded-full ${stud.color}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${textClass}`}>{stud.name} prepped</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 3 (EVERY SECOND COUNTS)
          ==================================================== */}
      <section ref={featuresRef} className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border-2 border-pink-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit text-pink-400 mb-6">
              ⚡ RESPONSIVENESS MATRIX
            </div>

            <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-6 uppercase ${textClass}`}>
              <span>EVERY</span>
              <span>SECOND</span>
              <span className={isDark ? "bg-gradient-to-r from-pink-400 to-[#86EF6A] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>COUNTS.</span>
            </h2>

            <p className={`text-base md:text-lg font-bold leading-relaxed max-w-md ${subtextClass}`}>
              The faster you submit correct answers, the higher your streak multiplier climbs. Speed combined with precision is the key to conquering lists.
            </p>
          </div>

          {/* Interactive Speed/Timer simulation visual card */}
          <div className="flex-1 w-full max-w-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-2xl transition-all duration-500 ${cardBgClass}`}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" />

              <div className={`flex items-center justify-between border-b pb-4 mb-6 ${borderClass}`}>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">GAMEPLAY STREAK PACE</span>
                <span className="text-pink-400 text-xs font-black">FAST PACE V.2</span>
              </div>

              {/* Graphical Timer Dial */}
              <div className="flex items-center justify-around mb-8">
                <div className="relative w-28 h-28 rounded-full border-4 border-dashed border-pink-500 flex items-center justify-center animate-spin-slow">
                  <div className="text-center absolute">
                    <span className={`text-4xl font-mono font-black ${textClass}`}>{sec3Timer}s</span>
                    <span className="text-[8px] font-black text-slate-400 block uppercase">TIMER TICK</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">SCORE METRIC</span>
                  <span className="text-3xl font-mono font-black text-[#86EF6A] block">+{sec3Points} PTS</span>
                  <span className="text-[9px] font-mono text-purple-400 font-bold block">1.5X MULTIPLIER ACTIVE</span>
                </div>
              </div>

              {/* Point allocation metrics cards */}
              <div className="flex flex-col gap-2.5">
                {[
                  { text: 'Correct Answer', val: '100 Points', col: `${borderClass} ${textClass}` },
                  { text: '🥇 Fastest Response', val: '+50 Bonus', col: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500' },
                  { text: '🥈 Second Response', val: '+40 Bonus', col: `border-slate-400/20 bg-slate-400/5 ${textClass}` },
                  { text: '🥉 Third Response', val: '+30 Bonus', col: 'border-amber-600/20 bg-amber-600/5 text-amber-500' }
                ].map((item, idx) => (
                  <div key={idx} className={`border rounded-xl px-4 py-3.5 flex items-center justify-between font-bold text-xs ${item.col}`}>
                    <span className="uppercase tracking-wider">{item.text}</span>
                    <span className="font-mono">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 4 (CLIMB THE RANKINGS)
          ==================================================== */}
      <section ref={rankingsRef} className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          
          {/* Sorting Scoreboard simulator visual */}
          <div className="flex-1 w-full max-w-md order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-2xl transition-all duration-500 ${cardBgClass}`}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#86EF6A] to-transparent animate-pulse" />

              <div className={`flex items-center justify-between border-b pb-4 mb-6 ${borderClass}`}>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">LIVE RANKINGS ENGINE</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86EF6A] animate-ping" />
                  <span className="text-[8px] font-mono text-slate-400">SHIFTING IN REALS</span>
                </div>
              </div>

              {/* Sorted scoreboard lists */}
              <div className="flex flex-col gap-3">
                {boardScores.map((student, index) => (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.15 }}
                    className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-500 ${innerCardBgClass} ${student.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-5">#{index + 1}</span>
                      <span className={`text-xs font-black uppercase tracking-wider`}>{student.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-[#86EF6A]">
                        {student.score} PTS
                      </span>
                      <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 rounded animate-pulse">▲</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-[#86EF6A]/10 border-2 border-[#86EF6A]/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit text-[#86EF6A] mb-6">
              🏆 GAMIFIED RANKINGS
            </div>

            <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-6 uppercase ${textClass}`}>
              <span>CLIMB THE</span>
              <span className={isDark ? "bg-gradient-to-r from-[#86EF6A] via-cyan-400 to-[#7ED8FF] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>RANKINGS.</span>
            </h2>

            <p className={`text-base md:text-lg font-bold leading-relaxed max-w-md ${subtextClass}`}>
              Compete against classmates and move up the leaderboard in real time. Experience massive engagement as scores shuffle dynamically!
            </p>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 5 (UNLOCK ACHIEVEMENTS)
          ==================================================== */}
      <section className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border-2 border-purple-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-purple-400 mb-6">
              🏅 REWARD PROTOCOLS
            </div>
            <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col uppercase ${textClass}`}>
              <span>UNLOCK</span>
              <span className={isDark ? "bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent" : "text-[#1c1c1e]"}>ACHIEVEMENTS.</span>
            </h2>
          </div>

          {/* Grid of achievement badge cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {[
              { name: '🏆 Quiz Champion', mode: 'ARENA DOMINANCE', desc: 'Secure 1st place in any live room quiz competition.', border: 'border-yellow-500', glow: 'hover:border-yellow-500/40' },
              { name: '⚡ Fast Thinker', mode: 'SPEED DEMON', desc: 'Submit correct answers in under 1 second 3 consecutive times.', border: 'border-cyan-500', glow: 'hover:border-cyan-500/40' },
              { name: '🎯 Accuracy King', mode: 'ABSOLUTE PRECI', desc: 'Achieve a flawless 100% correct score card in any long-form room.', border: 'border-emerald-500', glow: 'hover:border-emerald-500/40' },
              { name: '🔥 Streak Master', mode: 'HOT STREAKS', desc: 'Build and maintain a consecutive streak of 10 correct conceptual answers.', border: 'border-rose-500', glow: 'hover:border-rose-500/40' },
              { name: '🧠 Smart Learner', mode: 'AI COGNITIVE', desc: 'Perfect your scores on a weak topic diagnosed by the AI engine.', border: 'border-purple-500', glow: 'hover:border-purple-500/40' }
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 20, delay: idx * 0.1 }}
                className={`border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${cardBgClass} ${badge.glow}`}
              >
                {/* Top colored scanning light bar */}
                <div className={`absolute top-0 left-0 w-full h-[2px] ${badge.border} opacity-50`} />

                <div>
                  <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">{badge.mode}</span>
                  <h4 className={`text-sm font-black tracking-wide mb-3 ${textClass}`}>{badge.name}</h4>
                  <p className={`text-xs font-bold leading-relaxed ${subtextClass}`}>{badge.desc}</p>
                </div>

                <div className="mt-6 flex items-center justify-between text-[10px] font-black text-[#86EF6A]">
                  <span>REWARD UNLOCKED</span>
                  <span>🏆</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 6 (TRACK YOUR PROGRESS)
          ==================================================== */}
      <section className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#7ED8FF]/10 border-2 border-[#7ED8FF]/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit text-[#7ED8FF] mb-6">
              📈 DIAGNOSTIC METRICS
            </div>

            <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-6 uppercase ${textClass}`}>
              <span>TRACK YOUR</span>
              <span className={isDark ? "bg-gradient-to-r from-[#7ED8FF] via-purple-400 to-[#86EF6A] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>PROGRESS.</span>
            </h2>

            <p className={`text-sm md:text-base font-bold leading-relaxed max-w-sm mb-6 ${subtextClass}`}>
              Monitor your precision levels, response latency averages, and pacing histories after every quiz to optimize revision cycles.
            </p>
          </div>

          {/* Graphical Dashboard Panel visual card */}
          <div className="lg:col-span-7 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden transition-all duration-500 ${cardBgClass}`}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#7ED8FF] to-transparent animate-pulse" />

              <span className={`text-[10px] font-black uppercase ${labelClass} block mb-6 tracking-widest`}>PERSONAL ANALYTICS PANEL</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                
                {/* Accuracy Circular visual block */}
                <div className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center ${innerCardBgClass}`}>
                  <div className="w-16 h-16 rounded-full border-4 border-[#86EF6A] flex items-center justify-center mb-3">
                    <span className={`text-sm font-mono font-black ${textClass}`}>88%</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase ${labelClass}`}>ACCURACY</span>
                </div>

                {/* Average Score */}
                <div className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center ${innerCardBgClass}`}>
                  <span className={`text-2xl font-mono font-black mb-3 ${isDark ? 'text-[#7ED8FF]' : 'text-purple-600'}`}>920 PTS</span>
                  <span className={`text-[9px] font-black uppercase ${labelClass}`}>AVG RESPONSE SCORE</span>
                </div>

                {/* Response Latency */}
                <div className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center ${innerCardBgClass}`}>
                  <div className="mb-3 flex items-center gap-1.5">
                    <span className="text-2xl font-mono font-black text-pink-500">1.2s</span>
                    <span className="text-[7px] text-pink-500 bg-pink-500/10 px-1 rounded uppercase font-black">FAST</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase ${labelClass}`}>AVG RESPONSE LATENCY</span>
                </div>

              </div>

              {/* Performance trends visual chart block */}
              <div className={`border p-5 rounded-2xl text-left ${isDark ? 'bg-black/30 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <span className={`text-[9px] font-black uppercase ${labelClass} block mb-3`}>CONTESTANT PERFORMANCE TRENDS (PAST 5 QUIZZES)</span>
                
                {/* Simulated vertical grid chart blocks */}
                <div className={`h-28 flex items-end justify-between gap-4 pt-4 border-b ${borderClass}`}>
                  <div className={`flex-1 border hover:bg-[#86EF6A]/20 transition rounded-t-lg h-[40%] flex items-center justify-center text-[8px] font-mono ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-black/10 text-slate-700'}`}>Quiz 1</div>
                  <div className={`flex-1 border hover:bg-[#86EF6A]/20 transition rounded-t-lg h-[55%] flex items-center justify-center text-[8px] font-mono ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-black/10 text-slate-700'}`}>Quiz 2</div>
                  <div className={`flex-1 border hover:bg-[#86EF6A]/20 transition rounded-t-lg h-[70%] flex items-center justify-center text-[8px] font-mono ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-black/10 text-slate-700'}`}>Quiz 3</div>
                  <div className={`flex-1 border hover:bg-[#86EF6A]/20 transition rounded-t-lg h-[65%] flex items-center justify-center text-[8px] font-mono ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-black/10 text-slate-700'}`}>Quiz 4</div>
                  <div className="flex-1 bg-gradient-to-t from-emerald-500 to-[#86EF6A] rounded-t-lg h-[92%] flex items-center justify-center text-[8px] font-mono font-black text-black">Quiz 5</div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 7 (LEARN WITH AI)
          ==================================================== */}
      <section className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border-2 border-violet-500/25 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit text-violet-500 mb-6">
              🤖 AI DECK GENERATORS
            </div>

            <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-6 uppercase ${textClass}`}>
              <span>LEARN</span>
              <span>WITH</span>
              <span className={isDark ? "bg-gradient-to-r from-violet-400 to-[#7ED8FF] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>AI INTEL.</span>
            </h2>

            <p className={`text-base md:text-lg font-bold leading-relaxed max-w-md ${subtextClass}`}>
              Our Neural AI processes answer patterns, diagnoses conceptual blindspots, and recommends custom, localized revision tasks to patch up missing modules.
            </p>
          </div>

          {/* AI Advisor Panel Visual Card */}
          <div className="flex-1 w-full max-w-md flex flex-col gap-4">
            
            {/* Header tabs toggle simulation */}
            <div className={`flex gap-2 mb-2 border p-1.5 rounded-xl ${isDark ? 'bg-black/40 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <button 
                onClick={() => setActiveTab('weak')}
                className={`flex-1 py-2 text-center rounded-lg text-[10px] font-black uppercase transition ${activeTab === 'weak' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🔴 WEAK TOPICS
              </button>
              <button 
                onClick={() => setActiveTab('strong')}
                className={`flex-1 py-2 text-center rounded-lg text-[10px] font-black uppercase transition ${activeTab === 'strong' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🟢 STRONG TOPICS
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'weak' ? (
                <motion.div
                  key="weak"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`border rounded-2xl p-6 transition duration-300 relative overflow-hidden ${cardBgClass}`}
                >
                  <div className={`flex items-center justify-between mb-3 border-b pb-2 ${borderClass}`}>
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">COGNITIVE GAP DETECTED</span>
                    <div className="flex items-center gap-1.5 text-rose-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[8px] font-mono uppercase font-black">CRITICAL</span>
                    </div>
                  </div>
                  <h4 className={`text-base font-black mb-2 ${textClass}`}>Memory Allocation & Leakage in C++</h4>
                  <p className={`text-xs font-bold leading-relaxed mb-6 ${subtextClass}`}>
                    Performance pacing drops by 45% during pointer assignments or dynamic stack alloc references.
                  </p>
                  
                  <div className="text-[10px] font-black uppercase text-violet-500 bg-violet-500/5 border border-violet-500/10 p-3 rounded-lg flex items-start gap-2.5">
                    <span>💡</span> 
                    <span>AI Recommendation: Run a localized Practice Suite on Stack Pointer diagnostics.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="strong"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`border rounded-2xl p-6 transition duration-300 relative overflow-hidden ${cardBgClass}`}
                >
                  <div className={`flex items-center justify-between mb-3 border-b pb-2 ${borderClass}`}>
                    <span className="text-[9px] font-black text-[#86EF6A] uppercase tracking-widest">STRENGTH UNLOCKED</span>
                    <span className="text-[8px] font-mono uppercase font-black text-[#86EF6A]">MASTERY</span>
                  </div>
                  <h4 className={`text-base font-black mb-2 ${textClass}`}>Object Oriented Architecture Principles</h4>
                  <p className={`text-xs font-bold leading-relaxed mb-6 ${subtextClass}`}>
                    Excellent sub-0.8s response averages. Flawless 100% correct streak maintained on module tests.
                  </p>
                  
                  <div className="text-[10px] font-black uppercase text-[#86EF6A] bg-[#86EF6A]/5 border border-[#86EF6A]/10 p-3 rounded-lg flex items-start gap-2.5">
                    <span>🔥</span> 
                    <span>Expertise Met: You are performing in the top 2% of Stanford Computing cohorts.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 8 (PERSONALIZED PRACTICE)
          ==================================================== */}
      <section ref={aiRef} className="min-h-screen py-24 px-6 relative z-20 flex items-center">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#86EF6A]/10 border-2 border-[#86EF6A]/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit text-[#86EF6A] mb-6">
              🧪 ACCURACY BOOSTERS
            </div>

            <h2 className={`font-sora font-[900] text-[48px] sm:text-[76px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-6 uppercase ${textClass}`}>
              <span>PERSONALIZED</span>
              <span className={isDark ? "bg-gradient-to-r from-[#86EF6A] via-cyan-400 to-[#7ED8FF] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>PRACTICE.</span>
            </h2>

            <p className={`text-sm md:text-base font-bold leading-relaxed max-w-sm mb-6 ${subtextClass}`}>
              Generate custom self-paced review tasks based on past question slips to guarantee 100% conceptual absorption.
            </p>
          </div>

          {/* AI Generator Simulator card block */}
          <div className="lg:col-span-7 w-full max-w-lg">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden transition-all duration-500 ${cardBgClass}`}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#86EF6A] to-transparent animate-pulse" />

              <span className={`text-[10px] font-black uppercase ${labelClass} block mb-6 tracking-widest`}>ACCURACY GENERATOR MODULE</span>

              <div className={`border rounded-2xl p-5 mb-6 relative overflow-hidden ${innerCardBgClass}`}>
                <div className={`flex items-center justify-between mb-4 border-b pb-2 ${borderClass}`}>
                  <span className="text-[9px] font-black text-purple-400 uppercase">SUITE SPECIFICATIONS</span>
                  <span className="text-[8px] font-mono text-[#86EF6A] bg-[#86EF6A]/5 px-2 py-0.5 rounded border border-[#86EF6A]/20">AUTO-QUEUED</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={labelClass}>Target Focus:</span>
                    <span className={`${textClass} uppercase font-black tracking-wide`}>Memory Leak Diagnostics</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={labelClass}>Pacing Level:</span>
                    <span className="text-pink-500 uppercase font-black tracking-wide">Advanced III</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={labelClass}>Total Diagnostics:</span>
                    <span className={`${textClass} font-mono font-black`}>10 Question Suite</span>
                  </div>
                </div>
              </div>

              {/* Action Button trigger simulation */}
              <button
                onClick={handleAiGen}
                disabled={aiGenerating}
                className="w-full py-4 rounded-xl bg-white text-black border-2 border-black font-black hover:bg-[#86EF6A] transition text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50"
              >
                {aiGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                    <span>AI CRUNCHING DATA...</span>
                  </>
                ) : aiSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>AI SUITE GENERATED! READY</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4 text-purple-500" />
                    <span>GENERATE AI PRACTICE SUITE</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {aiSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 text-center font-black uppercase tracking-wider"
                  >
                    🚀 Practice Arena initialized! You can access this inside your Student Account.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ====================================================
          FINAL CTA
          ==================================================== */}
      <section className={`relative min-h-[90vh] flex flex-col justify-center items-center px-6 py-20 text-center z-20 overflow-hidden border-t-2 ${
        isDark ? 'bg-[#07050a] border-white/5' : 'bg-[#F9F6F0] border-black/5'
      }`}>
        
        {/* Underlay glow rings */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#86EF6A] bg-[#86EF6A]/5 border border-[#86EF6A]/10 px-4 py-1.5 rounded-full mb-6">
            🚀 JOIN THE ULTIMATE CHALLENGE
          </span>

          <h2 className={`font-sora font-[900] text-[56px] sm:text-[96px] leading-[0.85] tracking-[-0.05em] flex flex-col mb-8 uppercase ${textClass}`}>
            <span>READY TO</span>
            <span className={isDark ? "bg-gradient-to-r from-pink-500 via-purple-500 to-[#7ED8FF] bg-clip-text text-transparent" : "text-[#1c1c1e]"}>COMPETE?</span>
          </h2>

          <p className={`text-base md:text-lg font-bold leading-relaxed max-w-md mb-12 ${subtextClass}`}>
            Step in, earn score streak multipliers, climb the arena leaderboards, and excel with precision AI feedback today.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.button
              onClick={() => scrollToRef(lobbyRef)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-5 font-black uppercase text-sm tracking-widest rounded-2xl border-2 transition-all ${
                isDark 
                  ? 'bg-[#86EF6A] border-white text-black shadow-[6px_6px_0px_#FFF] hover:bg-[#86EF6A]/90' 
                  : 'bg-[#86EF6A] border-black text-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[4px] active:shadow-none'
              }`}
            >
              JOIN QUIZ LOBBY 🚀
            </motion.button>
            
            <motion.button
              onClick={() => setPage('register')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-5 font-black uppercase text-sm tracking-widest rounded-2xl border-2 transition-all ${
                isDark 
                  ? 'bg-white/5 border-white text-white shadow-[6px_6px_0px_#FFF] hover:bg-white/10' 
                  : 'bg-white border-black text-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[4px] active:shadow-none'
              }`}
            >
              CREATE ACCOUNT 🛡️
            </motion.button>
          </div>
        </div>

        {/* Footer branding */}
        <div className="absolute bottom-8 left-0 right-0 text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center justify-center gap-2">
          <span>INTELLIQUIZ COGNITION HUB</span>
          <span>•</span>
          <span>ESTABLISHED 2026</span>
        </div>
      </section>

    </div>
  );
};

export default StudentJoin;
