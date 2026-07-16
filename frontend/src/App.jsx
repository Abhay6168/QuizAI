import React, { useState, useEffect, useRef } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentJoin from './pages/StudentJoin';
import TeacherDashboard from './pages/TeacherDashboard';
import QuizCreator from './pages/QuizCreator';
import AIReviewPanel from './pages/AIReviewPanel';
import LiveRoom from './pages/LiveRoom';
import StudentQuiz from './pages/StudentQuiz';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';
import TeacherIntro from './pages/TeacherIntro';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // App-wide state
  const [page, setPage] = useState('landing');
  const pageRef = useRef('landing');

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI' | 'MR'
  
  // Real-time synchronization states
  const [roomCode, setRoomCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [lobbyParticipants, setLobbyParticipants] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [socketActiveLeaderboard, setSocketActiveLeaderboard] = useState([]);
  const [socketFinishedResults, setSocketFinishedResults] = useState([]);
  const [serverTimer, setServerTimer] = useState(0);
  const [timerPaused, setTimerPaused] = useState(false);
  const [showRoundFeedback, setShowRoundFeedback] = useState(false);
  const [answersReceived, setAnswersReceived] = useState(0);
  const [roundStats, setRoundStats] = useState(null);
  
  // AI intermediate deck state
  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiGenerationMeta, setAiGenerationMeta] = useState(null);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [theme, setTheme] = useState('dark');
  const isDark = theme === 'dark';

  // Real-time WebSocket connection references
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Connect to Node.js backend server
    const socketInstance = io('http://localhost:5000', {
      autoConnect: false
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Connected to real-time WebSocket server!');
      setSocketConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server.');
      setSocketConnected(false);
    });

    socketInstance.on('roomJoined', ({ roomCode, quizTitle, inviteLink, role }) => {
      setRoomCode(roomCode);
      if (role === 'host') {
        setPage('live-room');
      }
    });

    socketInstance.on('playerJoined', ({ username, participants }) => {
      setLobbyParticipants(participants.map(p => ({ username: p.username, score: p.score || 0 })));
    });

    socketInstance.on('playerLeft', ({ username, participants }) => {
      setLobbyParticipants(participants.map(p => ({ username: p.username, score: p.score || 0 })));
    });

    socketInstance.on('quiz_started', () => {
      if (pageRef.current !== 'live-room') {
        setPage('student-quiz');
      }
    });

    socketInstance.on('questionStarted', (questionPayload) => {
      setActiveQuestion(questionPayload);
      setShowRoundFeedback(false);
      setAnswersReceived(0);
      setRoundStats(null);
    });

    socketInstance.on('timerUpdated', ({ remainingTime, isPaused }) => {
      setServerTimer(remainingTime);
      setTimerPaused(isPaused);
    });

    socketInstance.on('leaderboardUpdated', ({ correctAnswer, explanation, leaderboard, roundStats }) => {
      setSocketActiveLeaderboard(leaderboard);
      setRoundStats(roundStats);
      setShowRoundFeedback(true);
    });

    socketInstance.on('progressUpdated', ({ answersReceived }) => {
      setAnswersReceived(answersReceived);
    });

    socketInstance.on('quizEnded', ({ results }) => {
      setSocketFinishedResults(results);
      setPage('results');
    });

    socketInstance.on('error_message', ({ message }) => {
      alert(`⚠️ Room Error: ${message}`);
    });

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // 1. Sync URL path modifications to state (e.g. on direct entry or back/forward browser navigation)
  useEffect(() => {
    const path = location.pathname.substring(1); // remove leading slash
    const targetPage = path === '' ? 'landing' : path;
    
    // List of allowed route strings to map to pages
    const validPages = [
      'landing', 'login', 'register', 'student-join', 
      'teacher-dashboard', 'quiz-creator', 'ai-review', 
      'live-room', 'student-quiz', 'results', 'admin-dashboard', 'teacher-intro'
    ];

    if (validPages.includes(targetPage) && targetPage !== page) {
      setPage(targetPage);
    }
  }, [location.pathname]);

  // 2. Sync state modifications to URL path changes
  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    const targetPath = page === 'landing' ? '' : page;
    if (currentPath !== targetPath) {
      navigate('/' + targetPath);
    }
  }, [page]);

  // Restore user session if JWT is cached
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const resData = await response.json();
          if (resData.success) {
            setUser(resData.data.user);
            if (resData.data.user.role === 'admin') {
              setPage('admin-dashboard');
            } else {
              setPage('teacher-dashboard');
            }
          }
        } catch (e) {
          console.warn('Restore session connection offline. Standby.');
        }
      }
    };
    restoreSession();
  }, [token]);

  const handleLoginSuccess = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setPage('landing');
  };

  const handleAIQuestionsLoad = (questions, meta) => {
    setAiQuestions(questions);
    setAiGenerationMeta(meta);
  };

  // ==========================================
  // REAL-TIME WEBSOCKET SIMULATION & EVENTS
  // ==========================================

  // Emit Student lobby join requests
  const socketJoinRoom = (code, name) => {
    setRoomCode(code);
    setStudentName(name);
    
    if (socketRef.current) {
      socketRef.current.connect();
      socketRef.current.emit('joinRoom', { roomCode: code.toUpperCase().trim(), username: name.trim() });
    }

    return true;
  };

  const socketLeaveRoom = (code, name) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leaveRoom', { roomCode: code, username: name });
    }
  };

  const socketStartQuiz = (code) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('startQuiz', { roomCode: code });
    } else {
      handleSimulateMockStart();
    }
  };

  const socketNextQuestion = (code) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('nextQuestion', { roomCode: code });
    }
  };

  const socketPauseQuiz = (code) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('pauseQuiz', { roomCode: code });
    }
  };

  const socketResumeQuiz = (code) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('resumeQuiz', { roomCode: code });
    }
  };

  const socketEndQuiz = (code) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('endQuiz', { roomCode: code });
    }
  };

  const socketSubmitAnswer = (code, name, answer, timeSpent) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('submitAnswer', { roomCode: code, username: name, answer, timeSpent });
    }
  };

  const socketEmitCheatViolation = (code, name, reason) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('cheat_violation', { roomCode: code, username: name, reason });
    }
  };

  const socketCreateRoom = (quiz) => {
    setSelectedQuiz(quiz);
    if (socketRef.current) {
      socketRef.current.connect();
      socketRef.current.emit('createRoom', { quizId: quiz._id, settings: quiz.settings });
    } else {
      setPage('live-room');
    }
  };

  // Emits Teacher starts quiz
  const handleSimulateMockStart = () => {
    // We are simulating a high-fidelity local WebSocket gameplay countdown
    // delivering active question iterations to the active student view
    console.log("🎮 Launching synchronized simulation gameplay countdown ticks...");
    
    let activeQuizData = selectedQuiz;
    if (!activeQuizData) {
      // Load standard generated quiz if hosted quiz is absent
      activeQuizData = {
        title: aiGenerationMeta?.title || 'AI Generated Quiz',
        questions: aiQuestions.length > 0 ? aiQuestions : [
          {
            questionText: 'What is the primary role of AI in real-time quiz platforms?',
            options: ['Intelligent parsing', 'Synchronous latency', 'Animated graphics', 'Speed calculations'],
            correctAnswer: 'Intelligent parsing',
            explanation: 'AI drives parsing of PDFs, slides, and notes instantly.',
            timeLimit: 20
          }
        ]
      };
      setSelectedQuiz(activeQuizData);
    }

    // Set timeline delivery
    setTimeout(() => {
      // Transition student view if active student lobby is loaded
      if (studentName) {
        setPage('student-quiz');
        deliverMockQuestion(0, activeQuizData);
      }
    }, 3000); // match LiveRoom lobby countdowns
  };

  const deliverMockQuestion = (idx, quiz) => {
    const q = quiz.questions[idx];
    setActiveQuestion({
      index: idx,
      total: quiz.questions.length,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      timeLimit: q.timeLimit || 20
    });

    // Timeout review window transition
    setTimeout(() => {
      // Show Standby Results
      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx < quiz.questions.length) {
          deliverMockQuestion(nextIdx, quiz);
        } else {
          // Final podium results transition
          const finalStandings = [
            { rank: 1, name: 'Einstein_2.0', score: 320, accuracy: 100, avgSpeed: 1.8, insights: 'Incredible performance!', weakTopics: [], strongTopics: ['Core Concepts'] },
            { rank: 2, name: studentName || 'Alex_AI', score: 250, accuracy: 80, avgSpeed: 3.2, insights: 'Great job! Spend more time on databases.', weakTopics: ['Distributed Databases'], strongTopics: ['Core Concepts'] },
            { rank: 3, name: 'Sarah_Pro', score: 210, accuracy: 65, avgSpeed: 4.1, insights: 'Focus on thread buffers.', weakTopics: ['Web Dev'], strongTopics: ['Networks'] }
          ];
          setSocketFinishedResults(finalStandings);
          setPage('results');
        }
      }, 6000); // Standby score review window
    }, (q.timeLimit || 20) * 1000);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 antialiased font-sans select-none overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen w-full"
        >
          {/* 1. LANDING PAGE */}
          {page === 'landing' && (
            <Landing 
              setPage={setPage} 
              language={language} 
              setLanguage={setLanguage} 
            />
          )}

          {/* 1b. TEACHER HIGH-FIDELITY MARKETING EXPERIENCE PAGE */}
          {page === 'teacher-intro' && (
            <TeacherIntro 
              setPage={setPage}
            />
          )}

          {/* 2. AUTHENTICATION LOGIN */}
          {page === 'login' && (
            <Login 
              setPage={setPage} 
              handleLoginSuccess={handleLoginSuccess} 
            />
          )}

          {/* 3. AUTHENTICATION REGISTER */}
          {page === 'register' && (
            <Register 
              setPage={setPage} 
              handleLoginSuccess={handleLoginSuccess} 
            />
          )}

          {/* 4. STUDENT CODE LOBBY */}
          {page === 'student-join' && (
            <StudentJoin
              setPage={setPage}
              studentName={studentName}
              setStudentName={setStudentName}
              roomCode={roomCode}
              setRoomCode={setRoomCode}
              socketJoinRoom={socketJoinRoom}
              socketLeaveRoom={socketLeaveRoom}
              lobbyParticipants={lobbyParticipants}
            />
          )}

          {/* 5. TEACHER CENTRAL DASHBOARD */}
          {page === 'teacher-dashboard' && (
            <TeacherDashboard
              setPage={setPage}
              user={user}
              handleLogout={handleLogout}
              setSelectedQuizForRoom={socketCreateRoom}
              onEditQuiz={(quiz) => {
                setQuizToEdit(quiz);
                setPage('quiz-creator');
              }}
              onUpdateUser={(updatedUser) => setUser(updatedUser)}
              theme={theme}
              setTheme={setTheme}
            />
          )}

          {/* 6. QUIZ CREATOR */}
          {page === 'quiz-creator' && (
            <QuizCreator
              setPage={setPage}
              handleAIQuestionsLoad={handleAIQuestionsLoad}
              quizToEdit={quizToEdit}
              onClearEdit={() => setQuizToEdit(null)}
            />
          )}

          {/* 7. AI PIPELINE CARD DECK REVIEW PANEL */}
          {page === 'ai-review' && (
            <AIReviewPanel
              setPage={setPage}
              aiQuestions={aiQuestions}
              setAiQuestions={setAiQuestions}
              aiGenerationMeta={aiGenerationMeta}
              theme={theme}
              setTheme={setTheme}
              isDark={isDark}
            />
          )}

          {/* 8. TEACHER LIVE GAME supervisor */}
          {page === 'live-room' && (
            <LiveRoom
              setPage={setPage}
              selectedQuiz={selectedQuiz}
              lobbyParticipants={lobbyParticipants}
              setLobbyParticipants={setLobbyParticipants}
              roomCode={roomCode}
              setRoomCode={setRoomCode}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
              socketActiveLeaderboard={socketActiveLeaderboard}
              setSocketActiveLeaderboard={setSocketActiveLeaderboard}
              socketFinishedResults={socketFinishedResults}
              setSocketFinishedResults={setSocketFinishedResults}
              handleSimulateMockStart={handleSimulateMockStart}
              socketStartQuiz={socketStartQuiz}
              socketNextQuestion={socketNextQuestion}
              socketPauseQuiz={socketPauseQuiz}
              socketResumeQuiz={socketResumeQuiz}
              socketEndQuiz={socketEndQuiz}
              serverTimer={serverTimer}
              timerPaused={timerPaused}
              showRoundFeedback={showRoundFeedback}
              answersReceived={answersReceived}
              roundStats={roundStats}
            />
          )}

          {/* 9. STUDENT ACTIVE MULTIPLAYER ARENA */}
          {page === 'student-quiz' && (
            <StudentQuiz
              setPage={setPage}
              studentName={studentName}
              roomCode={roomCode}
              activeQuestion={activeQuestion}
              socketSubmitAnswer={socketSubmitAnswer}
              socketEmitCheatViolation={socketEmitCheatViolation}
              serverTimer={serverTimer}
              timerPaused={timerPaused}
              showRoundFeedback={showRoundFeedback}
            />
          )}

          {/* 10. FINAL WINNERS podium results */}
          {page === 'results' && (
            <Results
              setPage={setPage}
              studentName={studentName}
              socketFinishedResults={socketFinishedResults}
            />
          )}

          {/* 11. PLATFORM ADMINISTRATOR console */}
          {page === 'admin-dashboard' && (
            <AdminDashboard
              setPage={setPage}
              user={user}
              handleLogout={handleLogout}
            />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default App;
