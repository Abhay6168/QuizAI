import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Landing = ({ setPage }) => {
  // Capture active hover role state: null | 'teacher' | 'student'
  const [hoveredRole, setHoveredRole] = useState(null);

  // Framer Motion Animation Variants for Staggered Heading Lines
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.2
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 70 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden text-[#1d1c1c] select-none flex flex-col justify-between p-6 md:p-12 transition-all"
      style={{
        background: 'linear-gradient(90deg, #F96C99 0%, #F3AE92 50%, #ECEA8C 100%)'
      }}
    >
      
      {/* ====================================================
          1. HARDWARE-ACCELERATED BACKGROUND MORPH SHEETS
          ==================================================== */}
      
      {/* Teacher Hover Overlay (Green melting in) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(90deg, #86EF6A 0%, #A8F08D 20%, #F3AE92 55%, #ECEA8C 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredRole === 'teacher' ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      {/* Student Hover Overlay (Blue melting in) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(90deg, #F96C99 0%, #F3AE92 45%, #9EE1FF 80%, #7ED8FF 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredRole === 'student' ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      {/* ====================================================
          2. ATMOSPHERIC RADIAL GLOW BLOCKS
          ==================================================== */}

      {/* Large Green Glow Behind Teacher Section */}
      <motion.div 
        className="absolute left-[25%] top-[65%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(134,239,106,0.8) 0%, rgba(134,239,106,0.4) 35%, rgba(134,239,106,0.15) 60%, transparent 100%)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: hoveredRole === 'teacher' ? 1 : 0,
          scale: hoveredRole === 'teacher' ? 1 : 0.8
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Large Blue Glow Behind Student Section */}
      <motion.div 
        className="absolute right-[25%] top-[65%] translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(126,216,255,0.8) 0%, rgba(126,216,255,0.4) 35%, rgba(126,216,255,0.15) 60%, transparent 100%)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: hoveredRole === 'student' ? 1 : 0,
          scale: hoveredRole === 'student' ? 1 : 0.8
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* ====================================================
          3. HEADER SECTION (z-30)
          ==================================================== */}
      <motion.header 
        className="relative w-full flex justify-center items-center z-30 pt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Playful, reactive Framer Motion scale-on-hover capsule */}
        <motion.div 
          className="bg-transparent hover:bg-white px-6 py-2.5 rounded-full border border-transparent hover:border-slate-900/10 hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none"
          whileHover={{ scale: 1.06, y: -2 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Circular logo brand text */}
          <span className="font-sora font-[900] text-lg md:text-xl tracking-tight text-[#1c1c1e] flex items-center">
            InTeLLiQuiz
            {/* Playful Green-to-blue pulsing status indicator dot revealed on hover */}
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#86EF6A] to-[#7ED8FF] ml-2.5 animate-pulse shadow-[0_0_10px_rgba(134,239,106,0.4)]" />
          </span>
        </motion.div>
      </motion.header>

      {/* ====================================================
          4. HERO CENTER TITLE (z-20)
          ==================================================== */}
      <main className="flex-1 flex flex-col justify-between items-center text-center max-w-6xl mx-auto z-20 w-full px-4 py-8 md:py-12 pointer-events-none">
        
        {/* Giant header title with slow entrance animations */}
        <motion.div
          className="mt-6 md:mt-12 select-none"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h1 className="font-sora font-[900] text-[36px] sm:text-[60px] md:text-[88px] lg:text-[120px] leading-[0.88] tracking-[-0.055em] text-[#1d1c1c] flex flex-col">
            <motion.span variants={lineVariants} className="block">
              TRANSFORM
            </motion.span>
            
            <motion.span variants={lineVariants} className="block">
              KNOWLEDGE
            </motion.span>
            
            <motion.span variants={lineVariants} className="block">
              INTO CHALLENGE
            </motion.span>
          </h1>
        </motion.div>

        {/* ====================================================
            5. DUAL COLUMN ROLE SELECTION GRID (Coordinated Blur + Dim)
            ==================================================== */}
        <div className="flex items-center justify-center gap-8 md:gap-14 w-full max-w-4xl mt-12 md:mt-20 mb-20 md:mb-32 pointer-events-auto relative">
          
          {/* ================= TEACHER ROLE COLUMN ================= */}
          <motion.div 
            className="flex-1 flex flex-col items-center py-4 transition-all duration-500"
            onMouseEnter={() => setHoveredRole('teacher')}
            onMouseLeave={() => setHoveredRole(null)}
            initial={{ opacity: 0, y: 35 }}
            animate={{ 
              opacity: hoveredRole === 'student' ? 0.6 : 1,
              filter: hoveredRole === 'student' ? 'blur(2px)' : 'blur(0px)',
              y: 0
            }}
            transition={{ 
              opacity: { duration: 0.4 },
              filter: { duration: 0.4 },
              y: { duration: 1.2, delay: 2.0, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            {/* Label */}
            <span className="font-sora font-[900] text-[18px] md:text-[24px] text-[#1d1c1c] tracking-tight mb-2.5 uppercase">
              I'M A
            </span>

            {/* Relative Wrapper to position 👍 icon below the Teacher Box */}
            <div className="relative">
              
              <AnimatePresence>
                {hoveredRole === 'teacher' && (
                  <motion.div 
                    className="absolute top-full left-1/2 -translate-x-1/2 -mt-5 ml-[-10px] flex flex-col items-center pointer-events-none z-30"
                    initial={{ opacity: 0, scale: 0.7, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Floating Thumbs up */}
                    <motion.div 
                      className="text-[64px] md:text-[76px] drop-shadow-[0_8px_15px_rgba(0,0,0,0.08)] filter saturate-120 select-none"
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      👍
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Teacher Button (Transitions background strictly inside on hover) */}
              <motion.button 
                onClick={() => setPage('teacher-intro')}
                className="py-1.5 px-8 md:px-10 rounded-[10px] border border-black font-sora font-[800] text-[24px] md:text-[34px] leading-[34px] text-[#1d1c1c] flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: '#86EF6A' }}
                animate={{ 
                  y: hoveredRole === 'teacher' ? -5 : 0,
                  scale: hoveredRole === 'teacher' ? 1.05 : 1,
                  boxShadow: hoveredRole === 'teacher' 
                    ? '0px 20px 40px rgba(134,239,106,0.35)' 
                    : '0px 2px 8px rgba(0,0,0,0.03)'
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Scaleable Teacher label text inside button */}
                <motion.span
                  className="block"
                  animate={{
                    y: hoveredRole === 'teacher' ? -3 : 0,
                    scale: hoveredRole === 'teacher' ? 1.03 : 1
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  TeACHeR
                </motion.span>
              </motion.button>

            </div>
          </motion.div>

          {/* ABSOLUTE CENTERED VERTICAL SEPARATOR LINE */}
          <motion.div 
            className="h-24 w-[1.5px] bg-black/80 self-center pointer-events-none origin-center"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.0, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* ================= STUDENT ROLE COLUMN ================= */}
          <motion.div 
            className="flex-1 flex flex-col items-center py-4 transition-all duration-500"
            onMouseEnter={() => setHoveredRole('student')}
            onMouseLeave={() => setHoveredRole(null)}
            initial={{ opacity: 0, y: 35 }}
            animate={{ 
              opacity: hoveredRole === 'teacher' ? 0.6 : 1,
              filter: hoveredRole === 'teacher' ? 'blur(2px)' : 'blur(0px)',
              y: 0
            }}
            transition={{ 
              opacity: { duration: 0.4 },
              filter: { duration: 0.4 },
              y: { duration: 1.2, delay: 2.6, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            {/* Label */}
            <span className="font-sora font-[900] text-[18px] md:text-[24px] text-[#1d1c1c] tracking-tight mb-2.5 uppercase">
              I'M A
            </span>

            {/* Relative Wrapper to position 👍 icon below the Student Box */}
            <div className="relative">
              
              <AnimatePresence>
                {hoveredRole === 'student' && (
                  <motion.div 
                    className="absolute top-full left-1/2 -translate-x-1/2 -mt-5 ml-[-10px] flex flex-col items-center pointer-events-none z-30"
                    initial={{ opacity: 0, scale: 0.7, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Floating Thumbs up */}
                    <motion.div 
                      className="text-[64px] md:text-[76px] drop-shadow-[0_8px_15px_rgba(0,0,0,0.08)] filter saturate-120 select-none"
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      👍
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Student Button (Transitions background strictly inside on hover) */}
              <motion.button 
                onClick={() => setPage('student-join')}
                className="py-1.5 px-8 md:px-10 rounded-[10px] border border-black font-sora font-[800] text-[24px] md:text-[34px] leading-[34px] text-[#1d1c1c] flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: '#7ED8FF' }}
                animate={{ 
                  y: hoveredRole === 'student' ? -5 : 0,
                  scale: hoveredRole === 'student' ? 1.05 : 1,
                  boxShadow: hoveredRole === 'student' 
                    ? '0px 20px 40px rgba(126,216,255,0.35)' 
                    : '0px 2px 8px rgba(0,0,0,0.03)'
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Scaleable Student label text inside button */}
                <motion.span
                  className="block"
                  animate={{
                    y: hoveredRole === 'student' ? -3 : 0,
                    scale: hoveredRole === 'student' ? 1.03 : 1
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  STUDeNT
                </motion.span>
              </motion.button>

            </div>
          </motion.div>

        </div>

      </main>

      {/* 3. FOOTER SECTION */}
      <footer className="w-full flex justify-between items-center z-30 pb-4">
        
        {/* Circular infinity button with rotate-on-hover micro-interaction */}
        <button 
          onClick={() => alert("IntelliQuiz System v1.0.0. Styled exactly like the Wero homepage.")}
          className="w-10 h-10 rounded-full bg-[#1d1c1c] flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition group"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="flex items-center justify-center w-full h-full"
          >
            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-10 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm10 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
          </motion.div>
        </button>

        {/* Dynamic footer text with letter-spacing expansion */}
        <motion.span 
          className="text-[9px] font-black tracking-widest text-[#1d1c1c]/40 uppercase cursor-pointer hover:text-[#1d1c1c] transition-all duration-300"
          whileHover={{ letterSpacing: "0.24em" }}
        >
          IntelliQuiz Studio
        </motion.span>

      </footer>

    </div>
  );
};

export default Landing;
