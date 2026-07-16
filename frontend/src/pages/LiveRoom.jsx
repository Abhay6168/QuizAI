import React, { useEffect, useState } from 'react';
import { 
  Users, Play, ShieldAlert, Award, ArrowRight, 
  Clock, CheckCircle, BarChart3, HelpCircle
} from 'lucide-react';

const LiveRoom = ({ 
  setPage, selectedQuiz, lobbyParticipants, setLobbyParticipants, 
  roomCode, setRoomCode, socketStartQuiz, activeQuestion, 
  setActiveQuestion, socketActiveLeaderboard, setSocketActiveLeaderboard, 
  socketFinishedResults, setSocketFinishedResults, handleSimulateMockStart,
  socketNextQuestion, socketPauseQuiz, socketResumeQuiz, socketEndQuiz,
  serverTimer, timerPaused, showRoundFeedback,
  answersReceived, roundStats,
  theme, setTheme, isDark
}) => {
  const [gameState, setGameState] = useState('waiting'); // 'waiting' | 'countdown' | 'question' | 'timeout' | 'finished'
  const [counter, setCounter] = useState(3);
  const [timer, setTimer] = useState(0);

  // Helper to check if room is in offline mock simulation or online socket mode
  const isMockRoom = !roomCode || roomCode.includes('-');

  // Initialize room code if not present
  useEffect(() => {
    if (!roomCode) {
      const mockCode = 'AI' + Math.floor(1000 + Math.random() * 9000);
      setRoomCode(mockCode);
      setLobbyParticipants([]);
    }
  }, [roomCode]);

  // Sync gameState with socket events for online rooms
  useEffect(() => {
    if (!isMockRoom && activeQuestion) {
      if (showRoundFeedback) {
        setGameState('timeout');
      } else {
        setGameState('question');
      }
    }
  }, [activeQuestion, showRoundFeedback, isMockRoom]);

  // Handle countdown trigger
  const handleStartGame = () => {
    setGameState('countdown');
    if (isMockRoom) {
      handleSimulateMockStart(); // notify mock generator
    }

    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCounter(count);
      if (count === 0) {
        clearInterval(interval);
        setGameState('question');
        if (isMockRoom) {
          startQuestionTimer(0);
        }
      }
    }, 1000);

    if (!isMockRoom && socketStartQuiz) {
      socketStartQuiz(roomCode);
    }
  };

  const startQuestionTimer = (qIdx) => {
    const q = selectedQuiz.questions[qIdx];
    setActiveQuestion({
      index: qIdx,
      total: selectedQuiz.questions.length,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      timeLimit: q.timeLimit || 20
    });

    setTimer(q.timeLimit || 20);

    // Dynamic timer ticker
    const tick = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          showLeaderboardTimeout(qIdx);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const showLeaderboardTimeout = (qIdx) => {
    setGameState('timeout');
    const q = selectedQuiz.questions[qIdx];

    // Compute mock scores additions to simulate opponent student answering
    setLobbyParticipants(prev => {
      const updated = prev.map(p => {
        const randomChance = Math.random();
        const scoreGain = randomChance > 0.3 ? (100 + (Math.random() > 0.5 ? 50 : 30)) : 0;
        return {
          ...p,
          score: p.score + scoreGain
        };
      });
      return updated;
    });

    // Build Standby standings
    setTimeout(() => {
      // Advance to next question or terminate game
      const nextIdx = qIdx + 1;
      if (nextIdx < selectedQuiz.questions.length) {
        setGameState('question');
        startQuestionTimer(nextIdx);
      } else {
        finishGamePodium();
      }
    }, 6000); // 6 seconds showcase
  };

  const finishGamePodium = () => {
    setGameState('finished');
    const finalStandings = [...lobbyParticipants]
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => {
        const accuracy = Math.round(50 + Math.random() * 50);
        return {
          rank: idx + 1,
          name: p.username,
          score: p.score,
          accuracy,
          avgSpeed: Math.round((2.5 + Math.random() * 5) * 10) / 10,
          insights: `Excellent gameplay! Strong in the topic of AI structure. Focus on MCQ selection speed!`,
          weakTopics: ['Distributed Databases'],
          strongTopics: ['Core Intelligence']
        };
      });

    setSocketFinishedResults(finalStandings);
    setTimeout(() => {
      setPage('results');
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (socketNextQuestion) {
      socketNextQuestion(roomCode);
    }
  };

  const handleTogglePause = () => {
    if (timerPaused) {
      if (socketResumeQuiz) socketResumeQuiz(roomCode);
    } else {
      if (socketPauseQuiz) socketPauseQuiz(roomCode);
    }
  };

  const handleEndQuiz = () => {
    if (confirm("Are you sure you want to end the quiz early?")) {
      if (socketEndQuiz) socketEndQuiz(roomCode);
    }
  };

  // Dynamic Theme properties
  const bgClass = isDark ? 'bg-[#0a0a0f] text-slate-100' : 'text-[#1d1c1c]';
  const bgStyle = !isDark ? { background: 'linear-gradient(135deg, #FFFDE8 0%, #FFF5CC 50%, #FFE899 100%)' } : {};
  
  const headerLogoClass = isDark
    ? 'w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-sm text-white'
    : 'w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center font-black text-sm text-black shadow-[2px_2px_0px_#000]';

  const cardClass = isDark
    ? 'bg-[#14121b] border border-white/5 p-8 rounded-3xl space-y-4'
    : 'bg-white border-2 border-black p-8 rounded-3xl space-y-4 shadow-[6px_6px_0px_#1d1c1c] text-[#1d1c1c]';

  const inviteLinkClass = isDark
    ? 'p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4 flex-wrap'
    : 'p-4 rounded-xl border-2 border-black bg-white flex items-center justify-between gap-4 flex-wrap shadow-[3px_3px_0px_#000] text-black';

  const inviteCopyBtnClass = isDark
    ? 'py-1.5 px-3 rounded-lg bg-slate-900 text-[10px] font-black uppercase text-white tracking-wider border border-white/10 hover:bg-slate-800'
    : 'py-1.5 px-3 rounded-lg bg-slate-100 text-[10px] font-black uppercase text-black tracking-wider border-2 border-black hover:bg-slate-200 shadow-[2px_2px_0px_#000]';

  const playerPillClass = isDark
    ? 'p-3 rounded-xl border border-white/5 bg-white/[0.01] text-xs font-bold text-slate-200 flex items-center gap-2'
    : 'p-3 rounded-xl border-2 border-black bg-white text-xs font-extrabold text-[#1d1c1c] flex items-center gap-2 shadow-[2px_2px_0px_#000]';

  const startBtnClass = isDark
    ? 'w-full py-4 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-extrabold text-sm uppercase tracking-wider transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50'
    : 'w-full py-4 rounded-2xl bg-[#86EF6A] hover:bg-[#A8F08D] text-black border-2 border-black font-extrabold text-sm uppercase tracking-wider transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[4px_4px_0_#000] disabled:opacity-50';

  // Dynamic Invite Link Construction using window origin (resolves local ports e.g. 5173 automatically)
  const inviteLink = `${window.location.origin}/student-join?code=${roomCode}`;

  return (
    <div className={`relative min-h-screen p-8 flex flex-col justify-between transition-all duration-500 overflow-x-hidden ${bgClass}`} style={bgStyle}>
      
      {/* glows (Dark Theme Only) */}
      {isDark && (
        <>
          <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-wero-pink/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-wero-blue/5 blur-[120px] pointer-events-none" />
        </>
      )}

      {/* HEADER LOGO */}
      <header className="flex justify-between items-center relative z-10 border-b border-white/5 pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={headerLogoClass}>Q⚡️</div>
          <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Host Console</span>
        </div>

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
          <span className={`text-xs font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>
            Quiz: {selectedQuiz?.title || 'General Knowledge'}
          </span>
        </div>
      </header>

      {/* 1. WAITING LOBBY COMPONENT */}
      {gameState === 'waiting' && (
        <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto z-10 py-12 w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full mb-12">
            
            {/* LOBBY DATA DISPLAY (Left) */}
            <div className="space-y-6 text-center md:text-left">
              <span className="px-3.5 py-1 rounded-full bg-wero-pink/15 text-wero-pink font-bold border border-wero-pink/20 uppercase tracking-widest text-xs inline-block animate-pulse">
                Join Lobby Now
              </span>
              <h2 className={`text-5xl md:text-6xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#1d1c1c]'}`}>
                ROOM CODE: <span className="text-wero-pink font-black">{roomCode}</span>
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Share this room code with your students. They can access the live game arena instantly from their screens.
              </p>

              <div className={inviteLinkClass}>
                <div className="truncate text-xs font-bold">
                  Invite Link: <span className="text-wero-blue underline cursor-pointer">{inviteLink}</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    alert("Invite Link copied to clipboard!");
                  }}
                  className={inviteCopyBtnClass}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* LIVE-GENERATED QR CODE (Right) */}
            <div className="flex flex-col items-center justify-center">
              <div className={`p-5 rounded-3xl border-2 transition duration-300 ${
                isDark 
                  ? 'bg-[#14121b] border-white/10 shadow-2xl hover:scale-[1.02]' 
                  : 'bg-white border-black shadow-[6px_6px_0px_#000] hover:scale-[1.02]'
              }`}>
                {/* Dynamically requested live-scannable QR code matching color themes */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=${isDark ? 'ffffff' : '1d1c1c'}&bgcolor=${isDark ? '14121b' : 'ffffff'}&data=${encodeURIComponent(inviteLink)}`}
                  alt="Join QR Code" 
                  className="w-[180px] h-[180px] rounded-2xl block"
                />
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase mt-4 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Scan QR code to join lobby</span>
            </div>

          </div>

          {/* LOBBY MEMBERS CONTAINER */}
          <div className={cardClass}>
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <span className={`text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                <Users className="w-4 h-4 text-wero-blue" /> Contestants checked in
              </span>
              <span className="text-sm font-black text-wero-mint">{lobbyParticipants.length} Joined</span>
            </div>

            {lobbyParticipants.length === 0 ? (
              <div className={`text-center py-6 text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <Users className="w-4 h-4" /> Waiting for student connections...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[140px] overflow-y-auto">
                {lobbyParticipants.map((p, idx) => (
                  <div key={idx} className={playerPillClass}>
                    <div className="w-2.5 h-2.5 rounded-full bg-wero-mint animate-pulse" />
                    <span className="truncate">{p.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LAUNCH CTA */}
          <button
            onClick={handleStartGame}
            disabled={lobbyParticipants.length === 0}
            className={startBtnClass}
          >
            <Play className={`w-4 h-4 fill-current`} />
            <span>START SYNCHRONIZED QUIZ 🚀</span>
          </button>

        </main>
      )}

      {/* 2. COUNTDOWN OVERLAY SCREEN */}
      {gameState === 'countdown' && (
        <main className="flex-1 flex flex-col justify-center items-center text-center z-10">
          <div className="w-[180px] h-[180px] rounded-full border-4 border-wero-pink/40 flex items-center justify-center text-8xl font-black text-wero-pink shadow-[0_0_40px_rgba(255,107,139,0.15)] animate-pulse-slow">
            {counter}
          </div>
          <span className={`text-xs font-black tracking-widest uppercase mt-8 animate-pulse ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Prepare response inputs</span>
        </main>
      )}

      {/* 3. ACTIVE LIVE QUESTION TRACKER */}
      {gameState === 'question' && activeQuestion && (
        <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full z-10 py-12">
          
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <span className={`px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase ${
              isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-2 border-black text-black shadow-[1.5px_1.5px_0_#000]'
            }`}>
              Question {activeQuestion.index + 1} of {activeQuestion.total}
            </span>

            <div className="flex items-center gap-4">
              {!isMockRoom && (
                <>
                  <button
                    onClick={handleTogglePause}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-300' 
                        : 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-slate-50'
                    }`}
                  >
                    {timerPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                  <button
                    onClick={handleEndQuiz}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
                      isDark 
                        ? 'bg-red-950/40 hover:bg-red-900/40 border-red-500/20 text-red-400' 
                        : 'bg-red-50 border-2 border-red-500 text-red-600 shadow-[2px_2px_0px_#000] hover:bg-red-100'
                    }`}
                  >
                    🛑 End early
                  </button>
                </>
              )}
              <div className="flex items-center gap-2 text-wero-pink">
                <Clock className={`w-4 h-4 text-wero-pink ${timerPaused ? '' : 'animate-spin'}`} />
                <span className="font-extrabold text-lg font-mono">
                  {isMockRoom ? timer : serverTimer}s
                </span>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className={`text-xl md:text-2xl font-black text-center leading-relaxed ${isDark ? 'text-white' : 'text-black'}`}>
              {activeQuestion.questionText}
            </h3>

            {/* Submissions count progress bar */}
            <div className="space-y-2 border-t border-white/5 pt-6">
              <div className={`flex justify-between items-center text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Answers locked</span>
                <span className="text-wero-mint">
                  {isMockRoom ? (lobbyParticipants.length - 1) : answersReceived} / {lobbyParticipants.length} submitted
                </span>
              </div>
              <div className={`w-full border rounded-full h-2.5 overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-200 border-black/10'}`}>
                <div 
                  className="bg-wero-mint h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${lobbyParticipants.length > 0 
                      ? ((isMockRoom ? (lobbyParticipants.length - 1) : answersReceived) / lobbyParticipants.length) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {activeQuestion.options.map((opt, idx) => (
              <div key={idx} className={`p-4 rounded-2xl text-xs font-bold text-left flex items-center gap-2 border ${
                isDark 
                  ? 'bg-white/[0.01] border-white/5 text-slate-400' 
                  : 'bg-white border-2 border-black text-black shadow-[3px_3px_0px_#000]'
              }`}>
                <span className={`w-5 h-5 rounded flex items-center justify-center font-black text-[9px] ${
                  isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-black border border-black'
                }`}>{String.fromCharCode(65 + idx)}</span>
                <span>{opt}</span>
              </div>
            ))}
          </div>

        </main>
      )}

      {/* 4. ROUND END STANDBY LEADERBOARD SCREEN */}
      {gameState === 'timeout' && activeQuestion && (
        <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full z-10 py-12">
          
          <div className={`${cardClass} text-center bg-wero-pink/[0.01]`}>
            <span className="px-2.5 py-0.5 rounded bg-wero-mint/15 text-wero-mint text-[9px] font-black tracking-widest uppercase border border-wero-mint/20">
              Correct Answer
            </span>
            <h3 className="text-xl font-black">{activeQuestion.correctAnswer}</h3>
            {activeQuestion.explanation && (
              <p className={`text-xs max-w-md mx-auto leading-relaxed border-t border-white/5 pt-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                💡 {activeQuestion.explanation}
              </p>
            )}
          </div>

          {/* Live statistics breakdown */}
          {!isMockRoom && roundStats && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-wero-mint/10 border border-wero-mint/20 text-center shadow-lg">
                <span className="text-3xl font-black text-wero-mint block">{roundStats.correctCount}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">CORRECT ✅</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center shadow-lg">
                <span className="text-3xl font-black text-rose-400 block">{roundStats.wrongCount}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">INCORRECT ❌</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shadow-lg">
                <span className="text-3xl font-black text-slate-300 block">{roundStats.skippedCount}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">SKIPPED ⏳</span>
              </div>
            </div>
          )}

          {/* Standings table */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <span className={`text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                <Award className="w-4 h-4 text-wero-pink" /> Standby Leaderboard
              </span>
              <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Round Standings</span>
            </div>

            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
              {(socketActiveLeaderboard.length > 0 ? socketActiveLeaderboard : [...lobbyParticipants])
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((p, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl flex justify-between items-center border ${
                    isDark 
                      ? 'bg-white/[0.01] border-white/5' 
                      : 'bg-slate-50 border-2 border-black shadow-[2px_2px_0px_#000]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[9px] border ${
                        idx === 0 
                          ? 'bg-wero-pink text-slate-900 border-black shadow-[1px_1px_0px_#000]' 
                          : isDark ? 'bg-slate-950 border-white/10 text-slate-400' : 'bg-white border-black text-black'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>{p.username || p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-wero-mint block">{p.score} pts</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase mt-8 animate-pulse">
            <span>Auto next-question loading</span>
            <ArrowRight className="w-3.5 h-3.5 text-wero-pink" />
          </div>

        </main>
      )}

      {/* FOOTER */}
      <footer className={`py-4 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-wider relative z-10 ${
        isDark ? 'text-slate-600' : 'text-slate-700'
      }`}>
        QuizAI Real-Time Synchronization Socket Engine v1.0.0
      </footer>

    </div>
  );
};

export default LiveRoom;
