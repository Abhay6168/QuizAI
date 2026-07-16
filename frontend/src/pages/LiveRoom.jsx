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
  answersReceived, roundStats
}) => {
  const [gameState, setGameState] = useState('waiting'); // 'waiting' | 'countdown' | 'question' | 'timeout' | 'finished'
  const [counter, setCounter] = useState(3);
  const [timer, setTimer] = useState(0);

  // Helper to check if room is in offline mock simulation or online socket mode
  const isMockRoom = !roomCode || roomCode.includes('-');

  // Initialize offline simulation if socket server is offline or solo test is requested
  useEffect(() => {
    if (!roomCode) {
      // Generate a mock code
      const mockCode = 'AI-' + Math.floor(1000 + Math.random() * 9000);
      setRoomCode(mockCode);
      
      // Seed default solo lobby students
      const defaultLobby = [
        { username: 'Alex_AI', score: 0 },
        { username: 'Sarah_Pro', score: 0 },
        { username: 'Dexter_99', score: 0 }
      ];
      setLobbyParticipants(defaultLobby);
      
      // Auto register more mock joins to build classroom hype
      setTimeout(() => {
        setLobbyParticipants(prev => [...prev, { username: 'CuriousGeorge', score: 0 }]);
      }, 1500);
      setTimeout(() => {
        setLobbyParticipants(prev => [...prev, { username: 'Einstein_2.0', score: 0 }]);
      }, 3000);
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

  return (
    <div className="relative min-h-screen bg-[#08080a] text-slate-100 p-8 flex flex-col justify-between select-none">
      
      {/* glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-wero-pink/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-wero-blue/5 blur-[120px] pointer-events-none" />

      {/* HEADER LOGO */}
      <header className="flex justify-between items-center relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-sm text-white">Q⚡️</div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Host Console</span>
        </div>

        <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
          Quiz: {selectedQuiz?.title || 'General Knowledge'}
        </span>
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
              <h2 className="text-5xl md:text-6xl font-black font-sans tracking-tight text-white leading-none">
                ROOM CODE: <span className="text-wero-pink font-black">{roomCode}</span>
              </h2>
              <p className="text-sm text-slate-400 max-w-sm">
                Share this room code with your students. They can access the live game arena instantly from their screens.
              </p>

              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <div className="truncate text-xs font-bold text-slate-400">
                  Invite Link: <span className="text-wero-blue underline cursor-pointer">http://localhost:3000/join?code={roomCode}</span>
                </div>
                <button 
                  onClick={() => alert("Invite Link copied to clipboard!")}
                  className="py-1.5 px-3 rounded-lg bg-slate-900 text-[10px] font-black uppercase text-white tracking-wider border border-white/10 hover:bg-slate-800"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* MOCK QR CODE GRAPHIC (Right) */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-2xl relative group hover:scale-[1.02] transition duration-300">
                {/* Simulated QR blocks canvas */}
                <div className="w-[180px] h-[180px] bg-slate-900 rounded-2xl flex flex-wrap p-3 gap-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-wero-gradient opacity-15 pointer-events-none" />
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-[22px] h-[22px] rounded ${
                        i % 2 === 0 || i % 7 === 0 ? 'bg-slate-100 shadow-md' : 'bg-transparent'
                      }`} 
                    />
                  ))}
                  {/* Anchor block corners */}
                  <div className="absolute top-3 left-3 w-10 h-10 border-[6px] border-white rounded bg-slate-900" />
                  <div className="absolute top-3 right-3 w-10 h-10 border-[6px] border-white rounded bg-slate-900" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 border-[6px] border-white rounded bg-slate-900" />
                </div>
              </div>
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase mt-4">Scan QR code to join lobby</span>
            </div>

          </div>

          {/* LOBBY MEMBERS CONTAINER */}
          <div className="w-full glass-card p-8 rounded-3xl border border-white/5 mb-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <span className="text-xs font-black tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-wero-blue" /> Contestants checked in
              </span>
              <span className="text-sm font-black text-wero-mint">{lobbyParticipants.length} Joined</span>
            </div>

            {lobbyParticipants.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                <Users className="w-4 h-4" /> Waiting for student connections...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[140px] overflow-y-auto">
                {lobbyParticipants.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] text-xs font-bold text-slate-200 flex items-center gap-2">
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
            className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-extrabold text-sm uppercase tracking-wider transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Play className="w-4 h-4 text-slate-900 fill-slate-900" />
            <span>START SYNCHRONIZED QUIZ 🚀</span>
          </button>

        </main>
      )}

      {/* 2. COUNTDOWN OVERLAY SCREEN */}
      {gameState === 'countdown' && (
        <main className="flex-1 flex flex-col justify-center items-center text-center z-10">
          <div className="w-[180px] h-[180px] rounded-full border-4 border-wero-pink/40 flex items-center justify-center text-8xl font-black font-sans text-wero-pink shadow-[0_0_40px_rgba(255,107,139,0.15)] animate-pulse-slow">
            {counter}
          </div>
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase mt-8 animate-pulse">Prepare response inputs</span>
        </main>
      )}

      {/* 3. ACTIVE LIVE QUESTION TRACKER */}
      {gameState === 'question' && activeQuestion && (
        <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full z-10 py-12">
          
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 tracking-widest uppercase">
              Question {activeQuestion.index + 1} of {activeQuestion.total}
            </span>

            <div className="flex items-center gap-4">
              {!isMockRoom && (
                <>
                  <button
                    onClick={handleTogglePause}
                    className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/10 text-slate-300 transition"
                  >
                    {timerPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                  <button
                    onClick={handleEndQuiz}
                    className="py-1.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-xs font-bold border border-red-500/20 text-red-400 transition"
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

          <div className="glass-card p-10 rounded-3xl border border-white/5 space-y-8 shadow-2xl mb-8">
            <h3 className="text-xl md:text-2xl font-black font-sans text-white leading-relaxed text-center">
              {activeQuestion.questionText}
            </h3>

            {/* Submissions count progress bar */}
            <div className="space-y-2 border-t border-white/5 pt-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Answers locked</span>
                <span className="text-wero-mint">
                  {isMockRoom ? (lobbyParticipants.length - 1) : answersReceived} / {lobbyParticipants.length} submitted
                </span>
              </div>
              <div className="w-full bg-white/5 border border-white/5 rounded-full h-2.5 overflow-hidden">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQuestion.options.map((opt, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-xs text-slate-400 font-bold text-left flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-950 flex items-center justify-center font-black text-[9px]">{String.fromCharCode(65 + idx)}</span>
                <span>{opt}</span>
              </div>
            ))}
          </div>

        </main>
      )}

      {/* 4. ROUND END STANDBY LEADERBOARD SCREEN */}
      {gameState === 'timeout' && activeQuestion && (
        <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full z-10 py-12">
          
          <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4 mb-8 text-center bg-wero-pink/[0.01]">
            <span className="px-2.5 py-0.5 rounded bg-wero-mint/15 text-wero-mint text-[9px] font-black tracking-widest uppercase border border-wero-mint/20">
              Correct Answer
            </span>
            <h3 className="text-xl font-black text-white">{activeQuestion.correctAnswer}</h3>
            {activeQuestion.explanation && (
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed border-t border-white/5 pt-3">
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
          <div className="glass-card p-6 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <span className="text-xs font-black tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-wero-pink" /> Standby Leaderboard
              </span>
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">RoundStandings</span>
            </div>

            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
              {(socketActiveLeaderboard.length > 0 ? socketActiveLeaderboard : [...lobbyParticipants])
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[9px] ${
                        idx === 0 ? 'bg-wero-pink text-slate-900 shadow-md' : 'bg-slate-950 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">{p.username || p.name}</span>
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
      <footer className="py-4 border-t border-white/5 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider relative z-10">
        QuizAI Real-Time Synchronization Socket Engine v1.0.0
      </footer>

    </div>
  );
};

export default LiveRoom;
