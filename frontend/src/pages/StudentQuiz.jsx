import React, { useEffect, useState } from 'react';
import { Clock, ShieldAlert, Award, Sparkles, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

const StudentQuiz = ({ 
  setPage, studentName, roomCode, activeQuestion, socketSubmitAnswer, socketEmitCheatViolation,
  serverTimer, timerPaused, showRoundFeedback
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(1);

  // Anti-cheat warnings states
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [cheatAlert, setCheatAlert] = useState(null);

  const isMockRoom = !roomCode || roomCode.includes('-');

  // Client-side anti-cheat Tab Switch Visibility & Focus triggers
  useEffect(() => {
    const reportCheatViolation = (reason) => {
      // Disregard if answer is already locked or round finished
      if (locked || showFeedback) return;

      console.warn(`⚠️ Client-side cheat trigger: ${reason}`);
      if (socketEmitCheatViolation) {
        socketEmitCheatViolation(roomCode, studentName, reason);
      }

      setCheatWarnings(prev => {
        const nextWarnings = prev + 1;
        if (nextWarnings === 1) {
          setCheatAlert('Warning: Tab switching or focus loss detected. Maintain focus to avoid score penalties!');
        } else if (nextWarnings === 2) {
          setCheatAlert('Score Penalty: Secondary window blur detected. -50 points applied to score!');
          setScore(s => Math.max(0, s - 50));
        } else {
          setCheatAlert('Disqualified: Multiple cheat violations detected. Current round auto-submitted.');
          setLocked(true);
          setScore(s => Math.max(0, s - 100));
        }
        return nextWarnings;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) {
        reportCheatViolation('Tab Switched');
      }
    };

    const handleWindowBlur = () => {
      reportCheatViolation('Focus Lost');
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [locked, showFeedback, roomCode, studentName, socketEmitCheatViolation]);

  // Synchronize question changes
  useEffect(() => {
    if (activeQuestion) {
      setSelectedAnswer('');
      setLocked(false);
      setShowFeedback(showRoundFeedback);
      if (isMockRoom) {
        setTimer(activeQuestion.timeLimit || 20);
      }
    }
  }, [activeQuestion, showRoundFeedback, isMockRoom]);

  // Synchronized countdown ticker (only for offline mock simulation)
  useEffect(() => {
    if (isMockRoom && activeQuestion && timer > 0 && !showFeedback) {
      const tick = setTimeout(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleRoundTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(tick);
    }
  }, [timer, showFeedback, isMockRoom, activeQuestion]);

  // Sync server feedback trigger for online rooms
  useEffect(() => {
    if (!isMockRoom) {
      setShowFeedback(showRoundFeedback);
      if (showRoundFeedback) {
        setRank(Math.floor(1 + Math.random() * 3));
      }
    }
  }, [showRoundFeedback, isMockRoom]);

  const handleSelectOption = (opt) => {
    if (locked) return;
    setSelectedAnswer(opt);
  };

  const handleLockAnswer = () => {
    if (!selectedAnswer || locked) return;
    setLocked(true);

    const activeTimer = isMockRoom ? timer : serverTimer;
    const timeSpent = (activeQuestion.timeLimit || 20) - activeTimer;
    
    if (socketSubmitAnswer) {
      socketSubmitAnswer(roomCode, studentName, selectedAnswer, timeSpent);
    }

    // Immediate offline scoring simulator for standalone tests
    const isCorrect = String(selectedAnswer).toLowerCase().trim() === String(activeQuestion.correctAnswer).toLowerCase().trim();
    if (isCorrect) {
      // 100 base + speed bonus
      const speedBonus = activeTimer > (activeQuestion.timeLimit * 0.7) ? 50 : activeTimer > (activeQuestion.timeLimit * 0.4) ? 30 : 10;
      setScore(prev => prev + 100 + speedBonus);
    }
  };

  const handleRoundTimeout = () => {
    setShowFeedback(true);
    // Simulate rank shift
    setRank(Math.floor(1 + Math.random() * 3));
  };

  if (!activeQuestion) {
    return (
      <div 
        className="relative min-h-screen text-[#1c1c1e] flex items-center justify-center p-8 select-none"
        style={{
          background: 'linear-gradient(90deg, #F96C99 0%, #F3AE92 50%, #ECEA8C 100%)'
        }}
      >
        <div className="bg-white p-10 rounded-3xl border-4 border-[#1c1c1e] space-y-6 shadow-[6px_6px_0px_#1c1c1e] text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-[#ECEA8C] border-2 border-[#1c1c1e] flex items-center justify-center mx-auto font-black text-2xl shadow-[2px_2px_0px_#1c1c1e] animate-bounce">Q⚡️</div>
          <h3 className="text-2xl font-black font-sans text-[#1c1c1e] uppercase tracking-tight">GET READY! 🚀</h3>
          <p className="text-sm text-slate-700 font-bold leading-relaxed">
            The synchronized arena is launching. Warm up your response skills!
          </p>
          <div className="w-full bg-slate-100 border-2 border-[#1c1c1e] rounded-full h-4 overflow-hidden relative shadow-[2px_2px_0px_#1c1c1e]">
            <div className="bg-[#7ED8FF] h-full rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  const isCorrectChoice = String(selectedAnswer).toLowerCase().trim() === String(activeQuestion.correctAnswer).toLowerCase().trim();

  return (
    <div 
      className="relative min-h-screen text-[#1c1c1e] p-8 flex flex-col justify-between select-none"
      style={{
        background: 'linear-gradient(90deg, #F96C99 0%, #F3AE92 50%, #ECEA8C 100%)'
      }}
    >

      {/* STATUS HEADER BAR */}
      <header className="flex justify-between items-center relative z-10 border-b-2 border-[#1c1c1e] pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#1c1c1e] flex items-center justify-center font-black text-base text-[#1c1c1e] shadow-[2px_2px_0px_#1c1c1e]">Q⚡️</div>
          <div>
            <span className="text-sm font-black text-[#1c1c1e] block">{studentName}</span>
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest block">Rank: #{rank} in classroom</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[9px] font-black text-slate-800 uppercase block">Total Points</span>
            <span className="text-sm font-black text-slate-900 block">{score} pts</span>
          </div>

          <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white border-2 border-[#1c1c1e] shadow-[2px_2px_0px_#1c1c1e] font-black text-sm text-[#1c1c1e]">
            <Clock className={`w-4 h-4 text-[#F96C99] ${timerPaused ? '' : 'animate-spin'}`} />
            <span className="font-mono">{isMockRoom ? timer : serverTimer}s</span>
          </div>
        </div>
      </header>

      {/* CORE ACTIVE QUESTION CANVAS */}
      <main className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full z-10 py-12">
        
        {/* CHEATING ALERT WARNING BANNER */}
        {cheatAlert && (
          <div className="p-4 mb-6 rounded-2xl bg-red-100 border-2 border-red-500 text-red-700 text-center font-black shadow-[4px_4px_0px_#ef4444] animate-pulse flex items-center justify-between gap-3 relative z-20">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span className="text-xs text-left">{cheatAlert}</span>
            </div>
            <button 
              onClick={() => setCheatAlert(null)}
              className="px-3 py-1 bg-red-600 text-white border-2 border-black rounded-lg text-[9px] font-black uppercase transition active:translate-y-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ROUND REVIEW BANNER */}
        {showFeedback ? (
          <div className={`p-8 rounded-3xl border text-center shadow-2xl mb-8 ${
            isCorrectChoice 
              ? 'bg-wero-mint/10 border-wero-mint/30 text-wero-mint' 
              : 'bg-red-950/20 border-red-500/20 text-red-400'
          }`}>
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
              {isCorrectChoice ? (
                <CheckCircle className="w-6 h-6 text-wero-mint" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
            </div>
            <h3 className="text-2xl font-black font-sans tracking-tight mb-2 text-[#1c1c1e]">
              {isCorrectChoice ? 'AWESOME! ANSWER CORRECT' : 'INCORRECT ANSWER'}
            </h3>
            <p className="text-xs text-slate-800 max-w-sm mx-auto leading-relaxed border-t-2 border-black/10 pt-3 mb-2 font-bold">
              Correct Answer: <span className="text-[#1c1c1e] font-black underline">{activeQuestion.correctAnswer}</span>
            </p>
            {activeQuestion.explanation && (
              <p className="text-[10px] text-slate-600 max-w-md mx-auto italic font-bold">
                💡 {activeQuestion.explanation}
              </p>
            )}
          </div>
        ) : (
          /* ACTIVE PLAYING SCREEN */
          <div className="bg-white p-10 rounded-3xl border-4 border-[#1c1c1e] space-y-6 shadow-[6px_6px_0px_#1c1c1e] mb-8 relative text-[#1c1c1e]">
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-[9px] font-black text-slate-800 tracking-widest uppercase border-2 border-[#1c1c1e] shadow-[1px_1px_0px_#1c1c1e]">
              Question {activeQuestion.index + 1} of {activeQuestion.total}
            </span>
            <h3 className="text-lg md:text-xl font-black font-sans text-[#1c1c1e] leading-relaxed text-center">
              {activeQuestion.questionText}
            </h3>
          </div>
        )}

        {/* OPTIONS CLICK GRID */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {activeQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const showCorrect = showFeedback && opt === activeQuestion.correctAnswer;
            const showWrong = showFeedback && isSelected && !isCorrectChoice;
            
            return (
              <button
                key={idx}
                disabled={locked || showFeedback}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 rounded-2xl border-2 border-[#1c1c1e] text-xs font-black text-left transition-all duration-150 active:translate-y-0.5 flex items-center justify-between ${
                  showCorrect
                    ? 'bg-[#86EF6A] text-[#1c1c1e] shadow-[3px_3px_0px_#1c1c1e] scale-[1.01]'
                    : showWrong
                    ? 'bg-[#F96C99] text-[#1c1c1e] shadow-[3px_3px_0px_#1c1c1e]'
                    : isSelected
                    ? locked
                      ? 'bg-[#ECEA8C] text-[#1c1c1e] shadow-[3px_3px_0px_#1c1c1e] animate-pulse'
                      : 'bg-[#7ED8FF] text-[#1c1c1e] shadow-[3px_3px_0px_#1c1c1e] scale-[1.01]'
                    : 'bg-white text-[#1c1c1e] shadow-[3px_3px_0px_#1c1c1e] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded border border-[#1c1c1e] flex items-center justify-center font-black text-[9px] ${
                    isSelected ? 'bg-white text-[#1c1c1e] shadow-sm' : 'bg-slate-100 text-slate-700'
                  }`}>{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </div>
                {isSelected && locked && !showFeedback && (
                  <span className="text-[8px] font-black tracking-widest text-[#1c1c1e] uppercase bg-white/20 border border-black/10 px-2 py-0.5 rounded">Locked</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ANSWER SUBMISSION ACTION BUTTON */}
        {!locked && !showFeedback && selectedAnswer && (
          <button
            onClick={handleLockAnswer}
            className="w-full py-4 rounded-2xl bg-white border-2 border-black text-[#1c1c1e] font-black text-sm uppercase tracking-wider transition hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2"
          >
            <span>LOCK IN RESPONSE 🚀</span>
          </button>
        )}

      </main>

      {/* FOOTER */}
      <footer className="py-4 border-t-2 border-black/10 text-center text-[10px] font-black text-[#1c1c1e]/60 uppercase tracking-wider relative z-10">
        QuizAI synchronized gameplay console v1.0.0
      </footer>

    </div>
  );
};

export default StudentQuiz;
