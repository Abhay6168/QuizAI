import React, { useState } from 'react';
import { 
  Award, Sparkles, AlertCircle, CheckCircle, XCircle, 
  HelpCircle, RefreshCw, BarChart3, ChevronRight, CornerDownLeft
} from 'lucide-react';

const Results = ({ setPage, studentName, socketFinishedResults, theme, setTheme, isDark }) => {
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'leaderboard'
  
  // High fidelity default mock results if standalone/solo test
  const defaultResults = [
    { rank: 1, name: 'Einstein_2.0', score: 320, accuracy: 100, avgSpeed: 1.8, insights: 'Incredible performance! Solid mastery.', weakTopics: [], strongTopics: ['Core Intelligence', 'Web Dev'] },
    { rank: 2, name: studentName || 'Alex_AI', score: 260, accuracy: 80, avgSpeed: 3.2, insights: 'Awesome job! Strong understanding. Keep practicing speed bonuses.', weakTopics: ['Distributed Databases'], strongTopics: ['Core Intelligence'] },
    { rank: 3, name: 'Sarah_Pro', score: 210, accuracy: 65, avgSpeed: 4.1, insights: 'Good effort! Focus on reviewing thread-safe buffers.', weakTopics: ['Buffers', 'Web Dev'], strongTopics: ['Networks'] },
    { rank: 4, name: 'Alex_AI', score: 180, accuracy: 60, avgSpeed: 5.2, insights: 'Moderate score. Suggesting standard revision notes.', weakTopics: ['Networks'], strongTopics: ['Core Intelligence'] }
  ];

  const results = socketFinishedResults && socketFinishedResults.length > 0 
    ? socketFinishedResults 
    : defaultResults;

  // Find active student stats
  const activeStudentName = studentName || 'Alex_AI';
  const playerResult = results.find(r => r.name.toLowerCase() === activeStudentName.toLowerCase()) || results[1];

  const podium1st = results.find(r => r.rank === 1) || results[0];
  const podium2nd = results.find(r => r.rank === 2) || results[1];
  const podium3rd = results.find(r => r.rank === 3) || results[2];

  // Dynamic Theme properties
  const bgClass = isDark ? 'bg-[#0a0a0f] text-slate-100' : 'text-[#1d1c1c]';
  const bgStyle = !isDark ? { background: 'linear-gradient(135deg, #FFFDE8 0%, #FFF5CC 50%, #FFE899 100%)' } : {};

  const headerBtnClass = isDark 
    ? 'p-3 rounded-xl hover:bg-white/5 border border-white/5 transition flex items-center gap-2 text-xs text-slate-400 hover:text-white' 
    : 'p-3 rounded-xl border-2 border-black bg-white text-black shadow-[3px_3px_0_#000] hover:bg-slate-50 transition flex items-center gap-2 text-xs font-bold';

  const tabOuterClass = isDark
    ? 'bg-[#14121b] border border-white/5 rounded-full p-1.5 flex items-center gap-1 shadow-lg'
    : 'bg-white border-2 border-black rounded-full p-1.5 flex items-center gap-1 shadow-[4px_4px_0_#000]';

  const cardClass = isDark
    ? 'bg-[#14121b] border border-white/5 p-8 rounded-3xl space-y-4'
    : 'bg-white border-2 border-black p-8 rounded-3xl space-y-4 shadow-[6px_6px_0px_#1d1c1c] text-[#1d1c1c]';

  const tileClass = isDark
    ? 'bg-[#14121b] border border-white/5 p-6 rounded-2xl'
    : 'bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_#1d1c1c] text-[#1d1c1c]';

  const primaryBtnClass = isDark
    ? 'w-full py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition hover:scale-[1.01]'
    : 'w-full py-3.5 rounded-xl bg-[#86EF6A] hover:bg-[#A8F08D] text-black border-2 border-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition hover:scale-[1.01] shadow-[3px_3px_0_#000]';

  return (
    <div className={`relative min-h-screen p-8 flex flex-col justify-between transition-all duration-500 overflow-x-hidden ${bgClass}`} style={bgStyle}>
      
      {/* glows (Dark Theme Only) */}
      {isDark && (
        <>
          <div className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-wero-pink/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-wero-blue/5 blur-[120px] pointer-events-none" />
        </>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center relative z-10 border-b border-white/5 pb-4 flex-wrap gap-4">
        <button 
          onClick={() => setPage('landing')}
          className={headerBtnClass}
        >
          <CornerDownLeft className="w-3.5 h-3.5" /> Leave Game
        </button>

        <div className="flex items-center gap-4 flex-wrap">
          {/* LGT / DRK toggler pill */}
          <div className={`border-2 rounded-full p-1.5 flex items-center gap-1.5 transition-all duration-300 ${
            isDark ? 'bg-[#14121b] border-white shadow-[0_4px_0_#FFF]' : 'bg-white border-black shadow-[0_4px_0_#000]'
          }`}>
            <button 
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-200 ${
                theme === 'light' 
                  ? 'bg-[#ECEA8C] border border-black text-[#1d1c1c] shadow-[1px_1px_0_#000]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              LGT
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-purple-600 border border-white/20 text-white shadow-[1px_1px_0_#fff]' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              DRK
            </button>
          </div>
          <span className={`text-xs font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Game Over Ceremony</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full z-10 py-8 space-y-12">
        
        {/* PODIUM ANIMATION */}
        <section className="flex flex-col items-center justify-center pt-8">
          
          <span className={`px-3.5 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase mb-8 flex items-center gap-1.5 animate-bounce ${
            isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-2 border-black text-black shadow-[2.5px_2.5px_0_#000]'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-wero-pink" /> Game standings podium
          </span>

          {/* PODIUM COLUMNS */}
          <div className={`flex items-end justify-center gap-4 h-[250px] max-w-md w-full relative mb-12 border-b-2 pb-1 ${
            isDark ? 'border-white/10' : 'border-black'
          }`}>
            
            {/* 2nd place (Left) */}
            {podium2nd && (
              <div className="flex flex-col items-center justify-end h-full w-28 group">
                <span className={`text-xs font-bold mb-1 truncate max-w-[100px] ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{podium2nd.name}</span>
                <span className="text-[10px] font-black text-wero-mint mb-2">{podium2nd.score} pts</span>
                <div className={`w-full rounded-t-2xl h-[55%] flex items-center justify-center group-hover:scale-[1.02] transition duration-300 ${
                  isDark ? 'bg-[#1b1c24] border border-white/5 shadow-lg' : 'bg-slate-50 border-2 border-black border-b-0 shadow-[2px_-2px_0px_#000]'
                }`}>
                  <span className={`text-3xl font-black font-sans ${isDark ? 'text-slate-500' : 'text-black'}`}>2</span>
                </div>
              </div>
            )}

            {/* 1st place (Center) */}
            {podium1st && (
              <div className="flex flex-col items-center justify-end h-full w-32 group">
                <div className="w-7 h-7 rounded-full bg-wero-pink/15 flex items-center justify-center text-wero-pink mb-1 animate-pulse border border-wero-pink/25">👑</div>
                <span className={`text-xs font-extrabold mb-1 truncate max-w-[120px] ${isDark ? 'text-white' : 'text-black'}`}>{podium1st.name}</span>
                <span className="text-[10px] font-black text-wero-pink mb-2">{podium1st.score} pts</span>
                <div className={`w-full rounded-t-2xl h-[80%] flex items-center justify-center group-hover:scale-[1.02] transition duration-300 ${
                  isDark 
                    ? 'bg-wero-gradient border border-slate-900/10 shadow-[0_0_30px_rgba(255,107,139,0.12)]' 
                    : 'bg-[#F96C99] border-2 border-black border-b-0 shadow-[4px_-4px_0px_#000]'
                }`}>
                  <span className={`text-4xl font-black font-sans ${isDark ? 'text-slate-900' : 'text-white'}`}>1</span>
                </div>
              </div>
            )}

            {/* 3rd place (Right) */}
            {podium3rd && (
              <div className="flex flex-col items-center justify-end h-full w-28 group">
                <span className={`text-xs font-bold mb-1 truncate max-w-[100px] ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{podium3rd.name}</span>
                <span className="text-[10px] font-black text-wero-blue mb-2">{podium3rd.score} pts</span>
                <div className={`w-full rounded-t-2xl h-[35%] flex items-center justify-center group-hover:scale-[1.02] transition duration-300 ${
                  isDark ? 'bg-[#14151b] border border-white/5 shadow-lg' : 'bg-slate-200 border-2 border-black border-b-0 shadow-[2px_-2px_0px_#000]'
                }`}>
                  <span className={`text-3xl font-black font-sans ${isDark ? 'text-slate-600' : 'text-black'}`}>3</span>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* TABS VIEW CONTROLLER */}
        <div className="flex justify-center mb-10">
          <div className={tabOuterClass}>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-8 py-2.5 rounded-full text-xs font-black tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'insights' 
                  ? isDark 
                    ? 'bg-slate-100 text-slate-900 shadow-md font-extrabold' 
                    : 'bg-[#86EF6A] border-2 border-black text-black shadow-[2px_2px_0_#000] font-extrabold'
                  : isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-wero-pink fill-wero-pink animate-pulse" />
              <span>AI LEARNING INSIGHTS</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-8 py-2.5 rounded-full text-xs font-black tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'leaderboard' 
                  ? isDark 
                    ? 'bg-slate-100 text-slate-900 shadow-md font-extrabold'
                    : 'bg-[#86EF6A] border-2 border-black text-black shadow-[2px_2px_0_#000] font-extrabold'
                  : isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>FULL LEADERBOARD</span>
            </button>
          </div>
        </div>

        {/* 1. TAB: AI INSIGHTS & DETAILED USER PERFORMANCE */}
        {activeTab === 'insights' && playerResult && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* STATS TILES (Col 1) */}
            <div className="md:col-span-1 space-y-6">
              
              <div className={tileClass}>
                <span className={`text-[10px] font-black tracking-widest uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Final Score</span>
                <h3 className={`text-3xl font-black font-sans ${isDark ? 'text-white' : 'text-black'}`}>{playerResult.score} pts</h3>
                <span className="text-[9px] text-wero-mint font-bold">Accuracy: {playerResult.accuracy}%</span>
              </div>

              <div className={tileClass}>
                <span className={`text-[10px] font-black tracking-widest uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Response Speed</span>
                <h3 className={`text-3xl font-black font-sans ${isDark ? 'text-white' : 'text-black'}`}>{playerResult.avgSpeed}s</h3>
                <span className="text-[9px] text-wero-blue font-bold">Average time per MCQ</span>
              </div>

              <div className={tileClass}>
                <span className={`text-[10px] font-black tracking-widest uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Final Rank Placement</span>
                <h3 className="text-3xl font-black font-sans text-wero-pink">#{playerResult.rank}</h3>
                <span className={`text-[9px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Of {results.length} contestants</span>
              </div>

            </div>

            {/* AI SYSTEM INSIGHTS CONSOLE (Col 2 & 3) */}
            <div className="md:col-span-2 space-y-6">
              
              <div className={`${cardClass} bg-wero-pink/[0.01]`}>
                
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-wero-pink/10 border border-wero-pink/20 flex items-center justify-center text-wero-pink">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-black'}`}>AI Learning Insights Dashboard</h4>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Gemini Personal Performance Audit</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed font-semibold ${
                    isDark ? 'border-white/5 bg-white/[0.01] text-slate-300' : 'border-black bg-slate-50 text-black'
                  }`}>
                    💬 "{playerResult.insights}"
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Strong Topics */}
                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-wero-mint/5 border-wero-mint/10' : 'bg-emerald-50/50 border-emerald-500 text-black shadow-[2px_2px_0_#000]'
                    }`}>
                      <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1.5">Strongest Topics 🏆</span>
                      <div className="flex flex-wrap gap-1.5">
                        {playerResult.strongTopics.map((t, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            isDark ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-white border-black text-black'
                          }`}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Weak Topics */}
                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-wero-pink/5 border-wero-pink/10' : 'bg-rose-50/50 border-rose-400 text-black shadow-[2px_2px_0_#000]'
                    }`}>
                      <span className="text-[10px] font-black text-rose-500 uppercase block mb-1.5">Weakest Topics ⚠️</span>
                      <div className="flex flex-wrap gap-1.5">
                        {playerResult.weakTopics.map((t, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            isDark ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-white border-black text-black'
                          }`}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM WORKFLOW ACTION */}
                  <button 
                    onClick={() => {
                      alert("✨ Customized Quiz Synthesized!\nWe have parsed your weakest topic ('Distributed Databases') and generated a fresh 5-question personalized mock re-attempt quiz matching your target accuracy levels!");
                      setPage('student-join');
                    }}
                    className={primaryBtnClass}
                  >
                    <RefreshCw className="w-4 h-4 fill-current animate-spin" />
                    <span>LAUNCH PERSONALIZED AI REVIEW QUIZ</span>
                  </button>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* 2. TAB: LEADERBOARD LIST */}
        {activeTab === 'leaderboard' && (
          <section className={`max-w-3xl mx-auto p-8 rounded-3xl border ${
            isDark ? 'bg-[#14121b] border-white/5' : 'bg-white border-2 border-black shadow-[6px_6px_0px_#000]'
          }`}>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <span className={`text-xs font-black tracking-wider uppercase flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                <Award className="w-4 h-4 text-wero-pink animate-pulse" /> Final Classroom Scoreboard
              </span>
              <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{results.length} Contestants</span>
            </div>

            <div className="flex flex-col gap-4">
              {results.map((p, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition flex justify-between items-center ${
                    p.name.toLowerCase() === activeStudentName.toLowerCase()
                      ? isDark 
                        ? 'bg-wero-mint/10 border-wero-mint/30 shadow-md text-wero-mint' 
                        : 'bg-[#86EF6A] border-2 border-black text-black shadow-[3px_3px_0_#000] font-black'
                      : isDark
                        ? 'bg-white/[0.01] border-white/5 text-slate-300'
                        : 'bg-slate-50 border-2 border-black text-black shadow-[2px_2px_0_#000]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs border ${
                      p.rank === 1 
                        ? 'bg-wero-pink text-slate-900 border-black' 
                        : isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-black text-black'
                    }`}>
                      {p.rank}
                    </span>
                    <span className="font-extrabold text-sm">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.accuracy}% Accuracy</span>
                    <span className={`text-sm font-black ${isDark ? 'text-wero-mint' : 'text-black'}`}>{p.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className={`py-4 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-wider relative z-10 ${
        isDark ? 'text-slate-600' : 'text-slate-700'
      }`}>
        QuizAI Results Ceremony and personalized Insights console v1.0.0
      </footer>

    </div>
  );
};

export default Results;
