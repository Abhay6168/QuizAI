import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

// ============================================================================
// WERO-INSPIRED PREMIUM STACKING STORYTELLING WORKFLOW
// ============================================================================

// Card 1 Visual: Floating documents
const Card1Visual = ({ isActive, isDark }) => (
  <div className="relative w-full h-48 flex items-center justify-center gap-4 mt-6 overflow-hidden">
    {[
      { name: "AI_ML_NOTES.PDF", color: "bg-[#F96C99]", ext: "PDF" },
      { name: "LECTURE_SLIDES.PPTX", color: "bg-[#ECEA8C]", ext: "PPTX" },
      { name: "EXAM_GUIDE.DOCX", color: "bg-[#7ED8FF]", ext: "DOCX" }
    ].map((file, i) => (
      <motion.div
        key={i}
        className={`border-2 rounded-2xl p-4 w-28 md:w-32 flex flex-col justify-between h-36 relative z-10 ${
          isDark 
            ? 'bg-[#0d0b12] border-white shadow-[4px_4px_0_#FFF] text-white' 
            : 'bg-white border-black shadow-[4px_4px_0_#000] text-slate-800'
        }`}
        animate={isActive ? { y: [0, -12, 0] } : {}}
        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className={`text-[8px] font-black text-white px-2 py-0.5 rounded self-start ${file.color}`}>{file.ext}</span>
        <span className={`text-[9px] font-mono font-black break-all leading-tight mt-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{file.name}</span>
        <span className="text-[8px] font-black text-slate-400 mt-auto uppercase tracking-wider">📄 READ READY</span>
      </motion.div>
    ))}
  </div>
);

// Card 2 Visual: Brain receiving files
const Card2Visual = ({ isActive, isDark }) => (
  <div className="relative w-full h-48 flex items-center justify-center mt-6">
    <motion.div
      className={`w-24 h-24 rounded-full bg-purple-500/20 border-2 border-dashed flex items-center justify-center relative ${
        isDark ? 'border-purple-300' : 'border-purple-400'
      }`}
      animate={isActive ? { rotate: 360 } : {}}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
    <span className="absolute text-5xl animate-bounce">🧠</span>
    {[0, 1, 2].map((x) => (
      <motion.div
        key={x}
        className={`border-2 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase ${
          isDark 
            ? 'bg-[#0d0b12] border-white shadow-[3px_3px_0_#FFF] text-[#86EF6A]' 
            : 'bg-white border-black shadow-[3px_3px_0_#000] text-purple-700'
        }`}
        initial={{ opacity: 0, scale: 0.5, x: x === 0 ? -90 : x === 1 ? 90 : 0, y: x === 2 ? 80 : -70 }}
        animate={isActive ? { opacity: [0, 1, 0], scale: [0.6, 1, 0.4], x: 0, y: 0 } : {}}
        transition={{ duration: 2.8, delay: x * 0.9, repeat: Infinity, ease: "easeOut" }}
      >
        📑 PARSING
      </motion.div>
    ))}
  </div>
);

// Card 3 Visual: Floating topic chips
const Card3Visual = ({ isActive, isDark }) => (
  <div className="w-full mt-6 flex flex-wrap gap-2.5 justify-center px-4">
    {[
      { t: "Machine Learning", c: "bg-[#86EF6A] text-[#1D1C1C]" },
      { t: "Python Basics", c: "bg-[#7ED8FF] text-[#1D1C1C]" },
      { t: "Deep Learning", c: "bg-[#F96C99] text-white" },
      { t: "Statistics 101", c: "bg-[#ECEA8C] text-[#1D1C1C]" },
      { t: "Data Science", c: "bg-[#F3AE92] text-[#1D1C1C]" },
      { t: "Neural Networks", c: "bg-white text-[#1D1C1C]" }
    ].map((chip, i) => (
      <motion.div
        key={i}
        className={`border-2 rounded-full px-4 py-1.5 text-xs font-black ${chip.c} ${
          isDark ? 'border-white shadow-[3px_3px_0_#FFF]' : 'border-black shadow-[3px_3px_0_#000]'
        }`}
        animate={isActive ? { rotate: i % 2 === 0 ? [1, -2, 1] : [-1, 2, -1], scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        🏷️ {chip.t}
      </motion.div>
    ))}
  </div>
);

// Card 4 Visual: Question Generator typing
const Card4Visual = ({ isActive, isDark }) => {
  const [qIndex, setQIndex] = useState(0);
  const questions = [
    "What is Machine Learning?",
    "How do neural networks adjust weights?",
    "Identify the main sorting protocol."
  ];

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setQIndex((prev) => (prev + 1) % questions.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`border-2 rounded-2xl p-5 w-full max-w-sm mx-auto text-left ${
      isDark 
        ? 'bg-[#0d0b12] border-white shadow-[6px_6px_0_#FFF] text-white' 
        : 'bg-white border-black shadow-[6px_6px_0_#000] text-slate-800'
    }`}>
      <div className={`flex items-center gap-1.5 mb-3 border-b pb-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="text-[8px] font-black text-slate-400 uppercase ml-2">IntelliQuiz AI Writer</span>
      </div>
      <div className="text-[9px] font-mono font-black text-indigo-400 mb-2">⚡ QUESTION WRITER</div>
      <p className="text-xs font-bold leading-relaxed mb-4 min-h-[36px]">{questions[qIndex]}</p>
      <div className="space-y-2">
        {["A. Data-driven System", "B. Hardcoded Logic Block", "C. CSS Framework", "D. Manual Registry Log"].map((opt, i) => (
          <motion.div
            key={i}
            className={`border-2 rounded-xl p-2 text-[10px] font-bold ${
              i === 0 
                ? 'bg-[#86EF6A]/10 border-[#86EF6A] text-[#86EF6A]' 
                : isDark 
                  ? 'bg-white/5 border-white/10 text-slate-300' 
                  : 'bg-slate-55 border-slate-200 text-slate-800'
            }`}
            animate={i === 0 ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {opt}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Card 5 Visual: Solve/Answer Reveal
const Card5Visual = ({ isDark }) => (
  <div className={`border-2 rounded-2xl p-5 w-full max-w-sm mx-auto text-left ${
    isDark 
      ? 'bg-[#0d0b12] border-white shadow-[6px_6px_0_#FFF] text-white' 
      : 'bg-white border-black shadow-[6px_6px_0_#000] text-slate-800'
  }`}>
    <div className={`flex items-center justify-between mb-3 border-b pb-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50/10 border border-emerald-300/30 px-2 py-0.5 rounded">✓ AI SOLVER ACTIVE</span>
      <span className="text-[8px] font-mono text-slate-400">CONFIDENCE: 99.9%</span>
    </div>
    <div className="text-[9px] font-black uppercase mb-1">CORRECT ANSWER KEY</div>
    <div className={`border-2 rounded-xl p-3 mb-3 flex items-center justify-between ${
      isDark ? 'bg-[#86EF6A]/10 border-white text-[#86EF6A]' : 'bg-[#86EF6A]/20 border-black text-[#1D1C1C]'
    }`}>
      <span className="text-xs font-bold">Option A. Data-driven System</span>
      <span className="text-[9px] font-black text-emerald-600">✓ CORRECT</span>
    </div>
    <div className="text-[8px] font-black text-slate-400 mb-1">DETAILED EXPLANATION</div>
    <p className={`text-[9px] leading-relaxed font-bold p-2.5 rounded-xl ${
      isDark ? 'bg-white/5 border border-white/10 text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-600'
    }`}>
      AI engine validates that Machine Learning relies on models derived from sample datasets rather than standard hardcoded conditional workflows.
    </p>
  </div>
);

// Card 6 Visual: Edit/Revision Buttons
const Card6Visual = ({ isDark }) => (
  <div className="w-full mt-6 max-w-sm mx-auto flex flex-col gap-4">
    <div className={`border-2 rounded-2xl p-4 text-left ${
      isDark 
        ? 'bg-[#0d0b12] border-white shadow-[4px_4px_0_#FFF] text-white' 
        : 'bg-white border-black shadow-[4px_4px_0_#000] text-slate-800'
    }`}>
      <div className="text-[8px] font-bold text-slate-400">REVISION BOARD</div>
      <p className="text-[11px] font-bold mt-1 leading-snug">Perform edits or trigger question regenerations with absolute control.</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { text: "✏️ Edit Card", col: "bg-[#7ED8FF]" },
        { text: "❌ Delete", col: "bg-[#F96C99]" },
        { text: "🔄 Regenerate", col: "bg-[#ECEA8C]" },
        { text: "✅ Approve", col: "bg-[#86EF6A]" }
      ].map((btn, i) => (
        <motion.button
          key={i}
          className={`border-2 rounded-xl py-3 px-2 font-sora font-black text-[10px] text-[#1D1C1C] active:translate-y-0.5 active:shadow-none transition-all ${btn.col} ${
            isDark ? 'border-white shadow-[3px_3px_0_#FFF]' : 'border-black shadow-[3px_3px_0_#000]'
          }`}
          whileHover={{ scale: 1.05 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.6, delay: i * 0.15, repeat: Infinity }}
        >
          {btn.text}
        </motion.button>
      ))}
    </div>
  </div>
);

// Card 7 Visual: Live Room joining counter
const Card7Visual = ({ isActive, isDark }) => {
  const [count, setCount] = useState(48);
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setCount((prev) => (prev < 99 ? prev + 1 : 48));
    }, 900);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`border-2 rounded-2xl p-5 mt-6 text-left w-full max-w-sm mx-auto ${
      isDark 
        ? 'bg-[#0d0b12] border-white shadow-[6px_6px_0_#FFF] text-white' 
        : 'bg-white border-black shadow-[6px_6px_0_#000] text-slate-800'
    }`}>
      <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">LOBBY LIVE</span>
        </div>
        <span className="text-[8px] font-mono text-slate-400">SECURE WS CLIENT</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[8px] font-black text-slate-400 uppercase">ROOM CODE</span>
          <div className="text-3xl font-mono font-black text-[#86EF6A]">AI123</div>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-black text-slate-400 uppercase">PARTICIPANTS</span>
          <div className="text-xl font-mono font-black text-[#7ED8FF]">{count} JOINED</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {["RT", "JS", "PN", "AM", "KV", "SL"].map((stud, idx) => (
          <motion.div
            key={idx}
            className={`w-7 h-7 rounded-full bg-purple-500 border-2 flex items-center justify-center text-[9px] font-black text-white ${
              isDark ? 'border-white shadow-[1px_1px_0_#FFF]' : 'border-black shadow-[1px_1px_0_#000]'
            }`}
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, delay: idx * 0.1, repeat: Infinity }}
          >
            {stud}
          </motion.div>
        ))}
        <div className={`w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center text-[9px] font-black ${
          isDark ? 'border-white text-slate-400' : 'border-black text-slate-400'
        }`}>+</div>
      </div>
    </div>
  );
};

// Card 8 Visual: Swapping Leaderboard rows
const Card8Visual = ({ isActive, isDark }) => {
  const [players, setPlayers] = useState([
    { name: "🥇 Rahul", score: 980, color: "bg-[#86EF6A] text-slate-900" },
    { name: "🥈 Abhay", score: 950, color: "bg-[#7ED8FF] text-slate-900" },
    { name: "🥉 Priya", score: 920, color: "bg-[#F96C99] text-white" }
  ]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPlayers((prev) => {
        const next = [...prev];
        next[0].score = next[0].score + Math.floor(Math.random() * 26) - 13;
        next[1].score = next[1].score + Math.floor(Math.random() * 26) - 13;
        next[2].score = next[2].score + Math.floor(Math.random() * 26) - 13;
        return [...next].sort((a, b) => b.score - a.score);
      });
    }, 2200);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full max-w-sm mx-auto mt-6 flex flex-col gap-2.5">
      <div className={`text-[9px] font-black uppercase tracking-wider text-left pl-1 ${
        isDark ? 'text-slate-400' : 'text-[#1D1C1C]'
      }`}>LIVE SCORE TICKERS</div>
      <AnimatePresence mode="popLayout">
        {players.map((p, idx) => (
          <motion.div
            key={p.name}
            layout
            className={`border-2 rounded-xl p-3 flex items-center justify-between transition-all duration-500 ${
              isDark 
                ? `${p.color} border-white shadow-[3px_3px_0_#FFF]` 
                : `${p.color} border-black shadow-[3px_3px_0_#000]`
            }`}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <span className="text-xs font-black">{idx + 1}. {p.name}</span>
            <span className="font-mono font-black text-xs">{p.score} PTS</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Card 9 Visual: Analytics Bar chart
const Card9Visual = ({ isActive, isDark }) => (
  <div className={`border-2 rounded-2xl p-5 mt-6 text-left w-full max-w-sm mx-auto ${
    isDark 
      ? 'bg-[#0d0b12] border-white shadow-[6px_6px_0_#FFF] text-white' 
      : 'bg-white border-black shadow-[6px_6px_0_#000] text-slate-800'
  }`}>
    <div className="text-[9px] font-black text-slate-400 mb-4 uppercase">ANALYTICS PROGRESS METRICS</div>
    <div className={`h-28 w-full border-b-2 border-l-2 relative flex items-end justify-around px-2 pb-0.5 ${
      isDark ? 'border-white' : 'border-black'
    }`}>
      {[
        { label: "Accuracy", h: 78, col: "bg-[#86EF6A]" },
        { label: "Pacing", h: 62, col: "bg-[#7ED8FF]" },
        { label: "Activity", h: 90, col: "bg-[#F96C99]" }
      ].map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 w-16">
          <motion.div
            className={`w-8 rounded-t border-2 ${bar.col} ${isDark ? 'border-white' : 'border-black'}`}
            initial={{ height: 0 }}
            animate={{ height: isActive ? `${bar.h}px` : 0 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          />
          <span className="text-[8px] font-black tracking-wider text-slate-500 uppercase">{bar.label}</span>
        </div>
      ))}
    </div>
    <div className={`flex items-center justify-between mt-4 text-[9px] font-bold p-2 rounded-lg ${
      isDark ? 'text-slate-300 bg-white/5 border border-white/10' : 'text-slate-500 bg-slate-50 border border-slate-100'
    }`}>
      <span>Weak Topic: Memory Queues</span>
      <span className="text-rose-500 font-black">80% Stumble</span>
    </div>
  </div>
);

// Card 10 Visual: Custom plan compiler
const Card10Visual = ({ isActive, isDark }) => (
  <div className={`border-2 rounded-2xl p-5 mt-6 text-left w-full max-w-sm mx-auto ${
    isDark 
      ? 'bg-[#0d0b12] border-white shadow-[6px_6px_0_#FFF] text-white' 
      : 'bg-white border-black shadow-[6px_6px_0_#000] text-slate-800'
  }`}>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base">⭐</span>
      <span className="text-[8px] font-black text-purple-700 bg-purple-50/10 border border-purple-200/30 px-2 py-0.5 rounded">CUSTOM ADAPTOR</span>
    </div>
    <h4 className="text-xs font-black mb-1">Recovery Plan Configured</h4>
    <p className={`text-[9px] leading-relaxed mb-4 font-bold ${
      isDark ? 'text-slate-300' : 'text-slate-500'
    }`}>
      IntelliQuiz analyzed logs showing Abhay and Sarah missed recursion thresholds. Adaptive recovery deck generates instantly to restore score indices.
    </p>
    <motion.button
      className="w-full bg-[#86EF6A] border-2 border-black rounded-xl py-3 px-4 font-sora font-black text-[10px] text-[#1D1C1C] shadow-[3px_3px_0_#000] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#000] transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      DEPLOY RECOVERY DECK ➔
    </motion.button>
  </div>
);

// Metadata array defining step items
const workflowSteps = [
  {
    step: "01",
    title: "UPLOAD CONTENT",
    desc: "Upload any learning material to configure a diagnostic sweep.",
    bgGrad: "from-[#7ED8FF] to-blue-500 text-[#1D1C1C]",
    visual: (isActive, isDark) => <Card1Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "02",
    title: "AI READS EVERYTHING",
    desc: "Extracts deep structural formulas, context indices, tables, and notes.",
    bgGrad: "from-purple-600 to-pink-500 text-white",
    visual: (isActive, isDark) => <Card2Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "03",
    title: "TOPIC EXTRACTION",
    desc: "Automatically isolates topic matrices for targeted student reviews.",
    bgGrad: "from-[#86EF6A] to-emerald-400 text-[#1D1C1C]",
    visual: (isActive, isDark) => <Card3Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "04",
    title: "QUESTION GENERATION",
    desc: "Neural advisory designs questions with multiple difficulty bounds.",
    bgGrad: "from-orange-500 to-yellow-400 text-[#1D1C1C]",
    visual: (isActive, isDark) => <Card4Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "05",
    title: "GENERATE ANSWERS",
    desc: "Constructs correct answer paths and contextual explanations.",
    bgGrad: "from-pink-500 to-purple-600 text-white",
    visual: (isActive, isDark) => <Card5Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "06",
    title: "REVIEW AND EDIT",
    desc: "Revise parameters, modify options, or trigger custom overrides.",
    bgGrad: "from-blue-500 to-purple-600 text-white",
    visual: (isActive, isDark) => <Card6Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "07",
    title: "START LIVE QUIZ",
    desc: "Launch room structures and watch students synchronize live.",
    bgGrad: "from-cyan-400 to-emerald-400 text-[#1D1C1C]",
    visual: (isActive, isDark) => <Card7Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "08",
    title: "REAL-TIME LEADERBOARD",
    desc: "Gamified scores tick and swap ranks dynamically in real-time.",
    bgGrad: "from-yellow-400 to-orange-500 text-[#1D1C1C]",
    visual: (isActive, isDark) => <Card8Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "09",
    title: "AI ANALYTICS",
    desc: "Review classrooms, detect vulnerabilities, and track accuracies.",
    bgGrad: "from-pink-500 to-orange-400 text-[#1D1C1C]",
    visual: (isActive, isDark) => <Card9Visual isActive={isActive} isDark={isDark} />
  },
  {
    step: "10",
    title: "PERSONALIZED LEARNING",
    desc: "Custom adaptive study pipelines are compiled for struggling pupils.",
    bgGrad: "from-purple-600 to-blue-500 text-white",
    visual: (isActive, isDark) => <Card10Visual isActive={isActive} isDark={isDark} />
  }
];

// Stacking visual card component utilizing sticky math and useScroll progress mapping
const StackCard = ({ index, card, isDark, globalProgress, activeStep }) => {
  const cardRef = useRef(null);

  // Stagger stacked upwards (index 9 is 0px, index 8 is -8px, index 0 is -72px)
  // This keeps the top card (Card 10) perfectly centered and 100% visible, with the underlying layers neatly stacked above it
  const stickyTop = (index - 9) * 8;
  const zIndex = (index + 1) * 10;

  const totalCards = 10;
  const cardActiveWindow = 0.07;
  const cardStep = 0.085; // Snappy stacking timeline complete by ~83.5% progress

  const startProgress = index * cardStep;
  const endProgress = startProgress + cardActiveWindow;

  // We map the globalProgress [0, 1] directly to y and scale!
  const scrollPoints = [
    0,
    Math.max(0, startProgress - 0.02),
    startProgress,
    endProgress
  ];

  // We translate y from 1000px down to stickyTop
  const yPoints = [
    1000,
    1000,
    1000,
    stickyTop
  ];

  const scalePoints = [1, 1, 1, 1];

  // Map subsequent stacking steps
  for (let i = 1; i <= totalCards - index; i++) {
    const nextStackPoint = endProgress + i * cardStep;
    scrollPoints.push(Math.min(1, nextStackPoint));
    yPoints.push(stickyTop - i * 6);
    scalePoints.push(Math.max(0.85, 1 - i * 0.015));
  }

  // Ensure scroll points are unique & ascending for Framer Motion transforms
  const uniquePoints = [];
  const uniqueY = [];
  const uniqueScale = [];

  scrollPoints.forEach((pt, idx) => {
    const rounded = Math.round(pt * 10000) / 10000;
    if (idx === 0 || rounded > uniquePoints[uniquePoints.length - 1]) {
      uniquePoints.push(rounded);
      uniqueY.push(yPoints[idx]);
      uniqueScale.push(scalePoints[idx]);
    }
  });

  const scale = useTransform(globalProgress, uniquePoints, uniqueScale);
  const y = useTransform(globalProgress, uniquePoints, uniqueY);

  // High performance paint trees optimization: completely hide cards that are far away from viewport
  const visibility = useTransform(
    globalProgress,
    [0, Math.max(0, startProgress - 0.04), Math.max(0, startProgress - 0.03), 1],
    ["hidden", "hidden", "visible", "visible"]
  );

  const rotationDegrees = [0.8, -1.2, 1.5, -0.8, 1, -1.2, 1, -1.5, 0.8, -1][index % 10];
  const isActive = index === activeStep;

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        y,
        rotate: rotationDegrees,
        zIndex,
        visibility
      }}
      className={`absolute w-full h-[500px] md:h-[540px] rounded-[32px] p-8 md:p-12 flex flex-col justify-between overflow-hidden top-0 left-0 transform-gpu will-change-transform ${
        isDark 
          ? 'bg-gradient-to-br from-[#121018] to-[#1a1724] border-2 border-white shadow-[12px_12px_0px_#86EF6A] text-white' 
          : `border-[3px] border-black shadow-[12px_12px_0px_#000] bg-gradient-to-br ${card.bgGrad}`
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={`font-mono font-[900] text-2xl tracking-wider ${isDark ? 'text-slate-400' : 'opacity-40'}`}>STEP {card.step}</span>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${
            isDark ? 'bg-purple-600 border-white text-white shadow-[2px_2px_0_#FFF]' : 'bg-white border-black text-black shadow-[2px_2px_0_#000]'
          }`}>
            {card.step}
          </div>
        </div>
        <h3 className="font-sora font-[900] text-2xl md:text-3xl leading-none uppercase tracking-tight mt-2">
          {card.title}
        </h3>
        <p className={`text-xs md:text-sm font-semibold max-w-sm mt-1 leading-relaxed ${
          isDark ? 'text-slate-300' : 'opacity-95'
        }`}>
          {card.desc}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full py-4">
        {card.visual(isActive, isDark)}
      </div>

      <div className={`flex items-center justify-between text-[9px] font-black uppercase tracking-widest border-t pt-4 mt-2 ${
        isDark ? 'border-white/10 text-slate-400' : 'border-black/10 text-[#1D1C1C]'
      }`}>
        <span>INTELLIQUIZ FLOW MATRIX</span>
        <span>AUTO V.3</span>
      </div>
    </motion.div>
  );
};

// Left sticky branding + Right stacking deck workflow wrapper
const WorkflowSection = ({ isDark, setPage }) => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Track scroll progress of the entire tall scrolling track wrapper
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track active step based on scroll timeline progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const cardStep = 0.085;
      const index = Math.min(9, Math.max(0, Math.floor(latest / cardStep)));
      setActiveStep(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-[5200px] bg-transparent">
      {/* Pinned Viewport Container */}
      <section id="workflow" className="sticky top-0 w-full h-screen flex items-center justify-center py-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">

          {/* Left Stationary Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center py-6 gap-8">

            <div className="relative">
              <div className="flex flex-col gap-4">
                <div className={`inline-flex items-center gap-2 text-white border-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider w-fit shadow-[3px_3px_0_#000] ${
                  isDark ? 'bg-purple-600 border-white shadow-[3px_3px_0_#FFF]' : 'bg-[#F96C99] border-black shadow-[3px_3px_0_#000]'
                }`}>
                  🤖 AI WORKFLOW
                </div>

                <h2 className={`font-sora font-[900] text-[64px] sm:text-[80px] md:text-[96px] lg:text-[110px] leading-[0.82] tracking-[-0.06em] flex flex-col pt-4 ${
                  isDark ? 'text-white' : 'text-[#1D1C1C]'
                }`}>
                  <span>FROM FILE</span>
                  <span>TO LIVE</span>
                  <span>QUIZ</span>
                </h2>

                <p className={`text-sm md:text-base font-bold leading-relaxed max-w-sm mt-4 ${
                  isDark ? 'text-slate-300' : 'text-[#1D1C1C]/75'
                }`}>
                  Transform PDFs, PPTs, DOCX files and notes into real-time quizzes using Artificial Intelligence.
                </p>
              </div>
            </div>

          </div>

          {/* Right Side: Stacking Cards Container (Absolute Viewport-Fixed Context) */}
          <div className="lg:col-span-7 relative w-full h-[540px] overflow-visible">
            {workflowSteps.map((step, idx) => (
              <StackCard
                key={idx}
                index={idx}
                card={step}
                isDark={isDark}
                globalProgress={scrollYProgress}
                activeStep={activeStep}
              />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

const TeacherIntro = ({ setPage }) => {
  // Theme state: default light, toggles to dark
  const [theme, setTheme] = useState('light');

  // Active tab state for question bank
  const [activeTab, setActiveTab] = useState('science');

  // Student lobby lists
  const [roomStudents, setRoomStudents] = useState([
    { name: 'Alex', color: 'bg-emerald-500' },
    { name: 'Sarah', color: 'bg-indigo-500' },
    { name: 'Priya', color: 'bg-rose-500' },
    { name: 'Abhay', color: 'bg-sky-500' }
  ]);
  const [typingText, setTypingText] = useState('');
  const fullText = "What is the primary engine behind real-time parsing in IntelliQuiz?";

  // Typing simulation effect for Section 4
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        setTimeout(() => {
          setTypingText('');
          index = 0;
        }, 5000); // Wait and loop
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // Scoreboard sorting simulation state
  const [boardScores, setBoardScores] = useState([
    { id: 1, name: '🥇 Rahul', score: 850, color: 'border-[#86EF6A]/30' },
    { id: 2, name: '🥈 Priya', score: 820, color: 'border-[#7ED8FF]/30' },
    { id: 3, name: '🥉 Abhay', score: 790, color: 'border-purple-500/30' }
  ]);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setBoardScores(prev => {
        const updated = prev.map(student => {
          const increment = Math.floor(Math.random() * 50) + 10;
          return { ...student, score: student.score + increment };
        });
        // Sort updated scores
        return updated.sort((a, b) => b.score - a.score);
      });
    }, 3000);
    return () => clearInterval(scoreInterval);
  }, []);

  // Mock addition of students in Section 5
  useEffect(() => {
    const studentNames = ['Rohit', 'Sana', 'John', 'Vikram', 'Riya', 'Taylor', 'Kai', 'Chloe', 'Zayn', 'Maya', 'Kenji', 'Aisha', 'Elena', 'Diego', 'Omar'];
    const colors = ['bg-amber-500', 'bg-violet-500', 'bg-teal-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-sky-500'];
    const addInterval = setInterval(() => {
      setRoomStudents(prev => {
        if (prev.length < 16) {
          const randName = studentNames[prev.length % studentNames.length];
          const randCol = colors[prev.length % colors.length];
          return [...prev, { name: randName, color: randCol }];
        } else {
          return [
            { name: 'Alex', color: 'bg-emerald-500' },
            { name: 'Sarah', color: 'bg-indigo-500' },
            { name: 'Priya', color: 'bg-rose-500' },
            { name: 'Abhay', color: 'bg-sky-500' }
          ];
        }
      });
    }, 1800);
    return () => clearInterval(addInterval);
  }, []);

  // ====================================================
  // PREMIUM DIRECT GPU-ACCELERATED SCROLL PARALLAX
  // ====================================================
  const { scrollY } = useScroll();

  const [scrollVal, setScrollVal] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrollVal(window.scrollY);
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Raw scroll transforms for asset elements (books / texts)
  const yTextRaw = useTransform(scrollY, [0, 1000], [0, -1200]);
  const yLeftBookRaw = useTransform(scrollY, [0, 1000], [0, -700]);
  const yRightBookRaw = useTransform(scrollY, [0, 1000], [0, -700]);

  // Luxury Spring damping physics configurations for the parallax assets (books/text)
  const springHeavy = { damping: 35, stiffness: 90, mass: 1.2 };

  // Smooth spring transformations to eliminate parallax asset stutter
  const yText = useSpring(yTextRaw, springHeavy);
  const yLeftBook = useSpring(yLeftBookRaw, springHeavy);
  const yRightBook = useSpring(yRightBookRaw, springHeavy);

  const opacityText = useTransform(scrollY, [0, 1000], [1, 1]);
  const scaleText = useTransform(scrollY, [0, 1000], [1, 1]);
  const opacityBook = useTransform(scrollY, [0, 1000], [1, 1]);
  const scaleBook = useTransform(scrollY, [0, 1000], [1, 1]);

  // Framer Motion Animation Variants for Staggered Heading Lines
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.2
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1
      }
    }
  };

  // Dynamic Theme Color Tokens
  const isDark = theme === 'dark';
  const bgClass = isDark 
    ? 'bg-[#0b090f] text-white' 
    : 'bg-gradient-to-r from-[#F96C99] via-[#F3AE92] to-[#ECEA8C] text-[#1d1c1c]';
  const textClass = isDark ? 'text-white' : 'text-[#1d1c1c]';
  const subtextClass = isDark ? 'text-slate-200 font-bold' : 'text-[#1d1c1c]/95 font-bold';
  
  // Cyberpunk High-contrast Neo-Brutalist design tokens for dark mode!
  const cardBgClass = isDark 
    ? 'bg-[#14121b] border-2 border-white shadow-[6px_6px_0px_#86EF6A] text-white' 
    : 'bg-white border-2 border-black shadow-[6px_6px_0px_#000] text-black';
    
  const innerCardBgClass = isDark 
    ? 'bg-[#0d0b12] border-2 border-white shadow-[3px_3px_0px_#7ED8FF] text-white' 
    : 'bg-white border-2 border-black shadow-[3px_3px_0px_#000] text-black';
    
  const borderClass = isDark ? 'border-white/20' : 'border-black';

  return (
    <div className={`w-full min-h-screen overflow-x-clip selection:bg-purple-500 selection:text-white relative transition-all duration-700 ${bgClass}`}>
      
      {/* ====================================================
          BACKGROUND ORBS (Rendered in Dark Theme Only)
          ==================================================== */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[250vh] right-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-[500vh] left-10 w-[700px] h-[700px] bg-emerald-950/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[800vh] right-10 w-[800px] h-[800px] bg-sky-950/20 rounded-full blur-[150px] pointer-events-none" />
        </>
      )}

      {/* ====================================================
          CINEMATIC 3D CARD-FLIP SYSTEM (SHARED BOTTOM DOCK SPACE)
          ==================================================== */}
      <div 
        className="fixed bottom-8 left-0 right-0 mx-auto w-[92%] max-w-6xl z-50 flex justify-center items-center pointer-events-none"
        style={{ perspective: 1200 }}
      >
        {/* Face A: The Center Scroll Down Button */}
        <div
          className={`absolute bottom-0 left-1/2 z-20 pointer-events-auto origin-center transition-all duration-500 [transform-style:preserve-3d] [backface-visibility:hidden] ${
            scrolled 
              ? 'opacity-0 scale-90 [transform:translateX(-50%)_rotateX(90deg)] pointer-events-none' 
              : 'opacity-100 scale-100 [transform:translateX(-50%)_rotateX(0deg)]'
          }`}
        >
          <a 
            href="#workflow"
            className="bg-white border-2 border-black font-sora font-[800] text-sm uppercase tracking-widest text-[#1d1c1c] shadow-[0_5px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-[2px] active:translate-y-[4px] py-4 px-10 rounded-full flex items-center gap-3 transition-all duration-150 cursor-pointer select-none"
          >
            Scroll and discover what this means
            <span className="w-7 h-7 rounded-full bg-[#ECEA8C] border border-black flex items-center justify-center font-black">↓</span>
          </a>
        </div>

        {/* Face B: The Enlarged Sticky Three-Part Neo-Brutalist Navbar */}
        <header 
          className={`w-full flex items-center justify-between pointer-events-none origin-center transition-all duration-500 [transform-style:preserve-3d] [backface-visibility:hidden] ${
            scrolled 
              ? 'opacity-100 scale-100 [transform:rotateX(0deg)]' 
              : 'opacity-0 scale-90 [transform:rotateX(-90deg)] pointer-events-none'
          }`}
        >
          
          {/* Left Part: FAQ / TOP Pill + Brand Icon (Reference Overlapping Style) */}
          <div className="relative flex items-center pointer-events-auto">
            {/* Morphing FAQ / TOP Button */}
            <div 
              onClick={() => {
                if (scrollVal >= 200) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`border-2 rounded-full pl-[74px] pr-8 py-[18px] flex items-center gap-4 cursor-pointer select-none transition-all duration-150 ${
                isDark 
                  ? 'bg-purple-600 border-white text-white shadow-[0_5px_0_#FFF] hover:shadow-[0_2px_0_#FFF]' 
                  : 'bg-[#ECEA8C] border-black text-[#1d1c1c] shadow-[0_5px_0_#000] hover:shadow-[0_2px_0_#000]'
              } hover:translate-y-[2px] active:translate-y-[4px]`}
            >
              <span className="font-sora font-[900] text-sm uppercase tracking-widest">
                {scrollVal >= 200 ? 'TOP' : 'FAQ'}
              </span>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-black text-xs ${
                isDark ? 'bg-[#0b090f] border-white text-white' : 'bg-white border-black text-black'
              }`}>
                {scrollVal >= 200 ? '↑' : '?'}
              </div>
            </div>

            {/* Overlapping Black circle Brand Toggle */}
            <div 
              onClick={() => setPage('landing')} 
              className={`absolute -left-6 w-[70px] h-[70px] rounded-full border-2 flex items-center justify-center font-sora font-[900] text-lg cursor-pointer shadow-[0_5px_0_#000] hover:scale-105 active:scale-95 transition-all select-none z-10 ${
                isDark ? 'bg-[#14121b] border-white text-white shadow-[0_5px_0_#FFF]' : 'bg-black border-black text-white'
              }`}
              title="Go to Landing"
            >
              IQ
            </div>
          </div>

          {/* Center Part: Links Pill (Reference capitalization and normal weight style) */}
          <div className={`hidden md:flex items-center gap-14 border-2 rounded-full px-[70px] py-[18px] pointer-events-auto ${
            isDark 
              ? 'bg-[#14121b] border-white text-white shadow-[0_5px_0_#FFF]' 
              : 'bg-white border-black text-[#1d1c1c] shadow-[0_5px_0_#000]'
          }`}>
            <a href="#workflow" className={`text-[15px] font-bold transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Features</a>
            <a href="#editor" className={`text-[15px] font-bold transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Editor</a>
            <a href="#live" className={`text-[15px] font-bold transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Live Rooms</a>
            <a href="#analytics" className={`text-[15px] font-bold transition ${isDark ? 'text-white hover:text-[#86EF6A]' : 'text-[#1d1c1c] hover:text-purple-600'}`}>Insights</a>
          </div>

          {/* Right Part: Theme toggler & Smiley Button */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Theme switcher pill matching NL/EN layout */}
            <div className={`border-2 rounded-full p-2 flex items-center gap-2 ${
              isDark ? 'bg-[#14121b] border-white shadow-[0_5px_0_#FFF]' : 'bg-white border-black shadow-[0_5px_0_#000]'
            }`}>
              <button 
                onClick={() => setTheme('light')}
                className={`px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-200 ${
                  theme === 'light' 
                    ? 'bg-[#ECEA8C] border border-black text-[#1d1c1c]' 
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                LGT
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-purple-600 border border-black text-white' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                DRK
              </button>
            </div>

            {/* Smiley Button (Cute Cartoon Anime spec eyes mascot) */}
            <div 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-[70px] h-[70px] rounded-full border-2 flex items-center justify-center cursor-pointer hover:rotate-12 transition-all duration-300 select-none active:scale-95 ${
                isDark 
                  ? 'bg-[#14121b] border-white shadow-[0_5px_0_#FFF]' 
                  : 'bg-white border-black shadow-[0_5px_0_#000]'
              }`}
              title="Toggle Theme"
            >
              <svg viewBox="0 0 24 24" className="w-9 h-9" fill={isDark ? "white" : "black"}>
                {/* Left Cute Specular Eye */}
                <circle cx="7.5" cy="10" r="2.5" fill={isDark ? "white" : "black"} />
                <circle cx="6.7" cy="9.2" r="0.8" fill={isDark ? "black" : "white"} />
                <circle cx="8.3" cy="10.8" r="0.4" fill={isDark ? "black" : "white"} />

                {/* Right Cute Specular Eye */}
                <circle cx="16.5" cy="10" r="2.5" fill={isDark ? "white" : "black"} />
                <circle cx="15.7" cy="9.2" r="0.8" fill={isDark ? "black" : "white"} />
                <circle cx="17.3" cy="10.8" r="0.4" fill={isDark ? "black" : "white"} />

                {/* Cute smile */}
                <path d="M 10 15 Q 12 16.5 14 15" stroke={isDark ? "white" : "black"} strokeWidth="2.2" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>

        </header>
      </div>

      {/* ====================================================
          SECTION 1 - HERO (SPRING PARALLAX REDESIGN)
          ==================================================== */}
      <section className="h-screen w-full relative z-20 overflow-hidden flex flex-col justify-center items-center px-6 text-center">

        {/* Main centered text blocks - driven by yText, opacityText, scaleText */}
        <motion.div
          style={{ y: yText, opacity: opacityText, scale: scaleText }}
          className="max-w-6xl mx-auto flex flex-col items-center relative z-20 -mt-16"
        >

          <div className="relative">
            {/* Phase green rotating badge on top right of title */}
            <motion.div
              className="absolute -top-16 -right-16 md:-right-24 bg-[#86EF6A] text-black border-2 border-black w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center font-sora font-[900] text-[10px] md:text-xs leading-tight tracking-tight shadow-[0_6px_0_#000]"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <span>🤖 AI</span>
              <span>POWERED</span>
              <div className="w-5 h-5 rounded-full bg-white border border-black flex items-center justify-center mt-1 text-[8px]">➔</div>
            </motion.div>

            {/* Sora weight 900 large leading centered title */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <h1 className={`font-sora font-[900] text-[48px] sm:text-[80px] lg:text-[120px] leading-[0.88] tracking-[-0.055em] uppercase flex flex-col items-center ${isDark ? 'text-white' : 'text-[#1d1c1c]'
                }`}>
                <motion.span variants={lineVariants}>CREATE</motion.span>
                <motion.span variants={lineVariants}>SMART QUIZZES</motion.span>
                <motion.span variants={lineVariants}>WITH AI</motion.span>
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setPage('register')}
              className={`font-black text-xs tracking-widest uppercase py-4 px-8 rounded-xl active:scale-95 transition ${isDark
                ? 'bg-gradient-to-r from-[#86EF6A] to-[#7ED8FF] text-black hover:shadow-[0_0_20px_rgba(134,239,106,0.3)]'
                : 'bg-[#1d1c1c] text-white hover:bg-slate-800'
                }`}
            >
              START CREATING
            </button>
            <button
              onClick={() => setPage('register')}
              className={`font-black text-xs tracking-widest uppercase py-4 px-8 rounded-xl border transition ${isDark
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                : 'bg-white border-black/10 text-[#1d1c1c] hover:bg-slate-100'
                }`}
            >
              WATCH DEMO
            </button>
          </div>
        </motion.div>

        {/* ====================================================
            Stylized Floating Open Books (Double nested containers for complete GPU isolation)
            ==================================================== */}

        {/* Left Book - Warm Sunset Gradient */}
        <motion.div
          style={{ y: yLeftBook, opacity: opacityBook, scale: scaleBook }}
          className="absolute bottom-[-5%] sm:bottom-[-2%] md:bottom-[2%] left-[-4%] sm:left-[2%] md:left-[5%] w-[220px] sm:w-[340px] md:w-[440px] pointer-events-none z-10"
        >
          <motion.div
            animate={{
              y: [-15, 15],
              rotate: [-4, 3]
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
              <defs>
                <linearGradient id="warmBookGrad" x1="0%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#F96C99" />
                  <stop offset="100%" stopColor="#FF7D54" />
                </linearGradient>
              </defs>
              {/* Backing Cover */}
              <path
                d="M 50 350 L 50 130 C 50 130, 120 110, 200 130 C 280 110, 350 130, 350 130 L 350 350 C 350 350, 280 330, 200 350 C 120 330, 50 350, 50 350 Z"
                fill="#1d1c1c"
                stroke="#1d1c1c"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              {/* Left Page block */}
              <path
                d="M 60 340 L 60 120 C 100 105, 150 112, 195 125 L 195 345 C 150 332, 100 325, 60 340 Z"
                fill="url(#warmBookGrad)"
                stroke="#1d1c1c"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Right Page block */}
              <path
                d="M 205 125 C 250 112, 300 105, 340 120 L 340 340 C 300 325, 250 332, 205 345 L 205 125 Z"
                fill="url(#warmBookGrad)"
                stroke="#1d1c1c"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Spine */}
              <path d="M 200 130 L 200 350" stroke="#1d1c1c" strokeWidth="6" strokeLinecap="round" />
              {/* Simulated text lines */}
              <path d="M 80 160 H 170 M 80 200 H 150 M 80 240 H 170 M 80 280 H 140" stroke="#1d1c1c" strokeWidth="4" strokeLinecap="round" />
              <path d="M 230 160 H 320 M 230 200 H 300 M 230 240 H 320 M 230 280 H 290" stroke="#1d1c1c" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Right Book - Cool Purple Gradient */}
        <motion.div
          style={{ y: yRightBook, opacity: opacityBook, scale: scaleBook }}
          className="absolute bottom-[-5%] sm:bottom-[-2%] md:bottom-[2%] right-[-4%] sm:right-[2%] md:right-[5%] w-[220px] sm:w-[340px] md:w-[440px] pointer-events-none z-10"
        >
          <motion.div
            animate={{
              y: [15, -15],
              rotate: [3, -4]
            }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
              <defs>
                <linearGradient id="coolBookGrad" x1="100%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#F96C99" />
                  <stop offset="100%" stopColor="#D547FF" />
                </linearGradient>
              </defs>
              {/* Backing Cover */}
              <path
                d="M 50 350 L 50 130 C 50 130, 120 110, 200 130 C 280 110, 350 130, 350 130 L 350 350 C 350 350, 280 330, 200 350 C 120 330, 50 350, 50 350 Z"
                fill="#1d1c1c"
                stroke="#1d1c1c"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              {/* Left Page block */}
              <path
                d="M 60 340 L 60 120 C 100 105, 150 112, 195 125 L 195 345 C 150 332, 100 325, 60 340 Z"
                fill="url(#coolBookGrad)"
                stroke="#1d1c1c"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Right Page block */}
              <path
                d="M 205 125 C 250 112, 300 105, 340 120 L 340 340 C 300 325, 250 332, 205 345 L 205 125 Z"
                fill="url(#coolBookGrad)"
                stroke="#1d1c1c"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Spine */}
              <path d="M 200 130 L 200 350" stroke="#1d1c1c" strokeWidth="6" strokeLinecap="round" />
              {/* Simulated text lines */}
              <path d="M 80 160 H 170 M 80 200 H 150 M 80 240 H 170 M 80 280 H 140" stroke="#1d1c1c" strokeWidth="4" strokeLinecap="round" />
              <path d="M 230 160 H 320 M 230 200 H 300 M 230 240 H 320 M 230 280 H 290" stroke="#1d1c1c" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Old Scroll Button Deleted (Moved into shared 3D Perspective Dock container) */}

      </section>

      {/* ====================================================
          WERO-INSPIRED PREMIUM STORYTELLING WORKFLOW
          ==================================================== */}
      <WorkflowSection isDark={isDark} setPage={setPage} />

      {/* ====================================================
          SECTION 2 - UPLOAD ANYTHING (DRAG ZONE VAULT)
          ==================================================== */}


      {/* ====================================================
          SECTION 3 - LET AI DO THE WORK (5 SCROLL CARDS)
          ==================================================== */}


      {/* ====================================================
          SECTION 4 - QUIZ CREATION (SPLIT EDITOR SIM)
          ==================================================== */}

      {/* ====================================================
          SECTION 5 - LIVE QUIZ ROOMS (GO LIVE INSTANTLY)
          ==================================================== */}
      <section id="live" className="min-h-screen py-24 px-6 relative z-20">
        <motion.div 
          className="max-w-6xl mx-auto w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-6 ${
              isDark ? 'bg-rose-500/10 border-rose-500/25 text-rose-300' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'
            }`}>
              ⚡ Synchronous WebSocket Engine
            </div>
            <h2 className="font-sora font-[900] text-[40px] sm:text-[72px] leading-[0.9] tracking-[-0.04em] flex flex-col">
              <span>GO LIVE</span>
              <span className={isDark ? 'bg-gradient-to-r from-rose-400 to-[#7ED8FF] bg-clip-text text-transparent' : 'text-[#1d1c1c]'}>INSTANTLY.</span>
            </h2>
          </div>

          {/* Room Joiner Simulation Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`max-w-4xl mx-auto border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden transition-all duration-500 ${cardBgClass}`}
          >
            {/* Top scanning/loading line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse" />

            <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8 border-b pb-8 mb-8 ${borderClass}`}>
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider mb-1 block">ACTIVE ROOM INSTRUCTOR INTERFACE</span>
                <h3 className={`text-2xl font-black ${textClass}`}>Advanced Computing Exam 101</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className={`border px-6 py-3 rounded-2xl text-center ${innerCardBgClass}`}>
                  <span className="text-[9px] font-black text-slate-500 block uppercase">ROOM CODE</span>
                  <span className="text-2xl font-mono font-black text-[#86EF6A]">AI123</span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  LIVE STREAMING
                </div>
              </div>
            </div>

            {/* Active joining counts */}
            <div className="mb-6 flex items-center justify-between text-xs font-black text-slate-300">
              <span className={`font-black ${textClass}`}>STUDENTS JOINED: {roomStudents.length + 48}</span>
              <div className="flex items-center gap-2 text-[#7ED8FF]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7ED8FF] animate-ping" />
                <span>SYNCHRONIZING WITH SERVER LOBBIES</span>
              </div>
            </div>

            {/* Grid of bubble student participants popping into view */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <AnimatePresence>
                {roomStudents.map((stud, idx) => (
                  <motion.div
                    key={idx}
                    className={`border rounded-xl p-3.5 flex items-center gap-2.5 shadow-sm ${innerCardBgClass}`}
                    initial={{ scale: 0.6, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className={`w-2 h-2 rounded-full ${stud.color}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider truncate ${textClass}`}>{stud.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Radial underlying graphics */}
            {isDark && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.03)_0%,transparent_70%)] pointer-events-none" />
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ====================================================
          SECTION 6 - LEADERBOARD (LIVE SORTING GAME)
          ==================================================== */}
      <section className="min-h-screen py-24 px-6 relative z-20">
        <motion.div 
          className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="flex-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-6 ${
              isDark ? 'bg-purple-500/10 border-purple-500/25 text-purple-300' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'
            }`}>
              🏆 Real-time Gamification
            </div>

            <h2 className="font-sora font-[900] text-[40px] sm:text-[68px] leading-[0.9] tracking-[-0.04em] flex flex-col mb-6">
              <span>TURN LEARNING</span>
              <span>INTO</span>
              <span className={isDark ? 'bg-gradient-to-r from-purple-400 to-[#86EF6A] bg-clip-text text-transparent' : 'text-[#1d1c1c]'}>COMPETITION.</span>
            </h2>

            <p className={`text-base md:text-lg font-bold leading-relaxed max-w-md ${subtextClass}`}>
              Score calculations factor in speed, consistency, and absolute accuracy. Watch the scoreboard rearrange live as pupils submit answers!
            </p>
          </div>

          {/* Sorting Scoreboard simulator */}
          <div className="flex-1 w-full max-w-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={`border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-2xl transition-all duration-500 ${cardBgClass}`}
            >
              {/* Top scanning/loading line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />

              <div className={`flex items-center justify-between border-b pb-4 mb-6 ${borderClass}`}>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">LIVE LEADERBOARD SCORE TICK</span>
                <div className="flex items-center gap-1.5 text-[#86EF6A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86EF6A] animate-ping" />
                  <span className="text-[10px] font-mono font-bold">SIMULATION ENABLED</span>
                </div>
              </div>

              {/* Sorted motion items with scroll cascade entrance */}
              <div className="flex flex-col gap-3 relative">
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
                      <span className={`text-xs font-black uppercase tracking-wider ${textClass}`}>{student.name}</span>
                    </div>
                    <span className="text-xs font-mono font-black text-[#86EF6A] bg-[#86EF6A]/5 border border-[#86EF6A]/10 px-3 py-1 rounded-lg">
                      {student.score} PTS
                    </span>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ====================================================
          SECTION 8 - AI INSIGHTS (AI HELP FOR TEACHERS)
          ==================================================== */}
      <section id="analytics" className="min-h-screen py-24 px-6 relative z-20">
        <motion.div 
          className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="flex-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-6 ${
              isDark ? 'bg-violet-500/10 border-violet-500/25 text-violet-300' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'
            }`}>
              🤖 Neural Advisory Engine
            </div>

            <h2 className="font-sora font-[900] text-[40px] sm:text-[68px] leading-[0.9] tracking-[-0.04em] flex flex-col mb-6">
              <span>AI THAT</span>
              <span>HELPS</span>
              <span className={isDark ? 'bg-gradient-to-r from-violet-400 to-[#7ED8FF] bg-clip-text text-transparent' : 'text-[#1d1c1c]'}>TEACHERS.</span>
            </h2>

            <p className={`text-base md:text-lg font-bold leading-relaxed max-w-md mb-6 ${subtextClass}`}>
              IntelliQuiz generates student-specific cognitive summaries. Skip the math and let artificial intelligence diagnose where classes hit hurdles automatically.
            </p>
          </div>

          {/* AI Advisor Card deck */}
          <div className="flex-1 w-full max-w-md flex flex-col gap-4">
            {[
              { title: '🔴 WEAK AREAS DETECTED', desc: '80% of students fail to grasp Memory Leak concepts in C++', insight: 'IntelliQuiz recommends a rapid-fire quiz on pointers.' },
              { title: '🟢 CRITICAL IMPROVEMENTS', desc: 'Average pacing score on Object Oriented Modules has shot up by 25%', insight: 'Great job! Maintain the current course material.' },
              { title: '💡 SMART STUDY GENERATOR', desc: '3 students are performing far ahead of the current pacing guide', insight: 'Generates a custom advanced test suite for Sarah, Priya and Rahul.' }
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                className={`border rounded-2xl p-6 transition duration-300 relative overflow-hidden ${cardBgClass}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-[10px] font-black tracking-wider ${textClass}`}>{insight.title}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                    <span className="text-[7px] font-mono opacity-60">LIVE ADVISORY</span>
                  </div>
                </div>
                <p className={`text-xs mb-4 font-bold ${subtextClass}`}>{insight.desc}</p>
                <div className="text-[10px] font-black uppercase text-violet-500 bg-violet-500/5 border border-violet-500/10 p-3 rounded-lg flex items-center gap-2">
                  <span>💡</span> {insight.insight}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ====================================================
          SECTION 10 - QUIZ TEMPLATES (START WITH A TEMPLATE)
          ==================================================== */}
      <section className="min-h-screen py-24 px-6 relative z-20">
        <motion.div 
          className="max-w-6xl mx-auto w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-6 ${
              isDark ? 'bg-purple-500/10 border-purple-500/25 text-purple-300' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'
            }`}>
              📋 Ready to deploy gamemodes
            </div>
            <h2 className="font-sora font-[900] text-[40px] sm:text-[72px] leading-[0.9] tracking-[-0.04em] flex flex-col">
              <span>START WITH</span>
              <span className={isDark ? 'bg-gradient-to-r from-purple-400 to-[#7ED8FF] bg-clip-text text-transparent' : 'text-[#1d1c1c]'}>A TEMPLATE.</span>
            </h2>
          </div>

          {/* Visual Cards templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {[
              { name: '⚡ Rapid Fire', mode: 'Speed Focus', desc: 'Short timers to gauge instant intuition and quick responses.', color: 'hover:border-red-500/35', border: 'border-red-500' },
              { name: '✏️ Exam Mode', mode: 'Rigorous Quiz', desc: 'Standard question pacer with detailed citations and explanations.', color: 'hover:border-blue-500/35', border: 'border-blue-500' },
              { name: '💡 Practice Suite', mode: 'Self Paced', desc: 'Perfect for homework diagnostics with infinite retries.', color: 'hover:border-emerald-500/35', border: 'border-emerald-500' },
              { name: '🏆 Arena Combat', mode: 'Live Showdown', desc: 'Dynamic scoreboard sorting live in front of the classroom.', color: 'hover:border-purple-500/35', border: 'border-purple-500' },
              { name: '💬 Interview Prep', mode: 'Descriptive Focus', desc: 'Open conceptual questions powered by smart diagnostic reports.', color: 'hover:border-amber-500/35', border: 'border-amber-500' }
            ].map((temp, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 20, delay: idx * 0.1 }}
                className={`border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${cardBgClass} ${temp.color}`}
              >
                {/* Top colored indicator line/scanning loading bar */}
                <div className={`absolute top-0 left-0 w-full h-[2px] ${temp.border} opacity-50`} />

                <div>
                  <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">{temp.mode}</span>
                  <h4 className={`text-sm font-black tracking-wide mb-3 ${textClass}`}>{temp.name}</h4>
                  <p className={`text-xs font-bold ${subtextClass}`}>{temp.desc}</p>
                </div>
                <button
                  onClick={() => setPage('register')}
                  className="text-[9px] font-black uppercase text-[#86EF6A] hover:text-white border border-[#86EF6A]/10 hover:border-white/20 bg-white/5 py-2.5 px-4 rounded-xl mt-6 transition"
                >
                  DEPLOY TEMPLATE
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ====================================================
          SECTION 11 - TESTIMONIALS (TRUSTED BY EDUCATORS)
          ==================================================== */}
      <section className="min-h-screen py-24 px-6 relative z-20">
        <motion.div 
          className="max-w-6xl mx-auto w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-6 ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'
            }`}>
              💬 Classroom Validation
            </div>
            <h2 className="font-sora font-[900] text-[40px] sm:text-[72px] leading-[0.9] tracking-[-0.04em] flex flex-col">
              <span>TRUSTED BY</span>
              <span className={isDark ? 'bg-gradient-to-r from-emerald-400 to-[#7ED8FF] bg-clip-text text-transparent' : 'text-[#1d1c1c]'}>EDUCATORS.</span>
            </h2>
          </div>

          {/* 3 review grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { text: "“IntelliQuiz has completely cut my quiz prep time in half. I just drag in my slide presentations, and the generator sets up active rooms instantly.”", author: "Dr. Sarah Jenkins", school: "Stanford Computing Dept.", initial: "S", col: "from-indigo-500 to-indigo-700" },
              { text: "“The live scoreboard sorting creates massive engagement in my physics classes. Students are actively asking to stay in after class to play!”", author: "Marc Taylor", school: "Boston Science High School", initial: "M", col: "from-rose-500 to-rose-700" },
              { text: "“The AI insights are a lifesaver. It automatically identifies weak topics, so I can adjust my lecturing modules dynamically before exams.”", author: "Prof. Priya Nair", school: "MIT Dept of Physics", initial: "P", col: "from-violet-500 to-violet-700" }
            ].map((rev, idx) => (
              <motion.div
                key={idx}
                className={`border rounded-3xl p-8 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden group transition-all duration-500 ${cardBgClass}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 20, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <p className={`text-sm font-bold leading-relaxed mb-8 italic relative z-10 ${textClass}`}>
                  {rev.text}
                </p>

                <div className={`flex items-center gap-4 relative z-10 border-t pt-4 mt-4 ${borderClass}`}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rev.col} flex items-center justify-center font-black text-xs text-white`}>
                    {rev.initial}
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wide ${textClass}`}>{rev.author}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{rev.school}</p>
                  </div>
                </div>

                {/* Glowing halo behind card on hover */}
                {isDark && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ====================================================
          SECTION 12 - FINAL CTA (FULL SCREEN GLOW)
          ==================================================== */}
      <section className={`min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center relative z-20 overflow-hidden ${
        isDark ? 'bg-[#07050a]' : 'bg-transparent'
      }`}>

        {/* Big background radial glow */}
        {isDark && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#86EF6A]/5 to-[#7ED8FF]/5 rounded-full blur-[140px] pointer-events-none" />
        )}

        <motion.div
          className="max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-8 ${
            isDark ? 'bg-[#86EF6A]/10 border-[#86EF6A]/20 text-[#86EF6A]' : 'bg-slate-900/10 border-slate-900/20 text-slate-900'
          }`}>
            ✓ Free Tier Active No Credit Card Required
          </div>

          <h2 className="font-sora font-[900] text-[48px] sm:text-[76px] lg:text-[100px] leading-[0.88] tracking-[-0.055em] flex flex-col mb-10">
            <span>READY TO CREATE</span>
            <span className={isDark ? 'bg-gradient-to-r from-[#86EF6A] to-[#7ED8FF] bg-clip-text text-transparent' : 'text-[#1d1c1c]'}>
              YOUR FIRST QUIZ?
            </span>
          </h2>

          <p className={`text-base md:text-lg font-bold leading-relaxed max-w-xl mx-auto mb-12 ${subtextClass}`}>
            Deploy smart, fully synchronized classroom sessions in seconds. Join thousands of high-performance instructors worldwide.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              onClick={() => setPage('register')}
              whileHover={{ scale: 1.05, y: -4, boxShadow: isDark ? "0px 10px 30px rgba(134, 239, 106, 0.4)" : "0px 10px 25px rgba(29, 28, 28, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              className={`font-black text-sm tracking-widest uppercase py-5 px-12 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-[#86EF6A] text-[#1d1c1c] border-2 border-white' 
                  : 'bg-[#1d1c1c] text-white border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]'
              }`}
            >
              CREATE ACCOUNT
            </motion.button>
            <motion.button
              onClick={() => setPage('login')}
              whileHover={{ scale: 1.05, y: -4, boxShadow: isDark ? "0px 10px 30px rgba(126, 216, 255, 0.3)" : "0px 10px 25px rgba(29, 28, 28, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              className={`font-black text-sm tracking-widest uppercase py-5 px-12 rounded-2xl border-2 hover:scale-[1.03] active:scale-[0.97] transition-all ${
                isDark 
                  ? 'bg-transparent border-white text-white' 
                  : 'bg-white border-black text-[#1d1c1c] shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]'
              }`}
            >
              INSTRUCTOR LOGIN
            </motion.button>
          </div>

        </motion.div>
      </section>

      {/* ====================================================
          13. PREMIUM PRODUCT FOOTER
          ==================================================== */}
      <footer className={`w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center z-30 py-8 px-6 border-t text-[10px] font-black tracking-wider uppercase gap-4 ${borderClass} ${
        isDark ? 'text-slate-500' : 'text-[#1d1c1c]/60'
      }`}>
        <span>© 2026 IntelliQuiz Studio. All rights reserved.</span>

        <div className="flex items-center gap-6">
          <a href="#workflow" className="hover:text-white/80 transition">Privacy Policy</a>
          <a href="#workflow" className="hover:text-white/80 transition">Terms of Service</a>
          <a href="#workflow" className="hover:text-white/80 transition">AI Safety Guidelines</a>
        </div>
      </footer>

    </div>
  );
};

export default TeacherIntro;
