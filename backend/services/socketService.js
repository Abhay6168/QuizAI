const socketIO = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const { db } = require('../config/db');

// Helper to normalize room code (uppercase and alphanumeric only)
const getCleanCode = (code) => String(code || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();

// Redis Client Configuration
let redisClient = null;
let redisConnected = false;

// Fallback in-memory session store when Redis is unavailable
const memorySessions = {};

// Active room intervals registry for server-controlled countdown timer
const activeRoomTimers = {};

const getSession = async (roomCode) => {
  const cleanCode = getCleanCode(roomCode);
  if (redisConnected && redisClient) {
    try {
      const data = await redisClient.get(`room:session:${cleanCode}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Redis getSession error:', e);
    }
  }
  return memorySessions[cleanCode] || null;
};

const saveSession = async (roomCode, session) => {
  const cleanCode = getCleanCode(roomCode);
  if (redisConnected && redisClient) {
    try {
      // 12 hours TTL (Time-to-Live) for active room sessions
      await redisClient.set(`room:session:${cleanCode}`, JSON.stringify(session), {
        EX: 43200
      });
      return;
    } catch (e) {
      console.error('Redis saveSession error:', e);
    }
  }
  memorySessions[cleanCode] = session;
};

const deleteSession = async (roomCode) => {
  const cleanCode = getCleanCode(roomCode);
  if (redisConnected && redisClient) {
    try {
      await redisClient.del(`room:session:${cleanCode}`);
      return;
    } catch (e) {
      console.error('Redis deleteSession error:', e);
    }
  }
  delete memorySessions[cleanCode];
};

const clearRoomTimer = (roomCode) => {
  const cleanCode = getCleanCode(roomCode);
  if (activeRoomTimers[cleanCode]) {
    clearInterval(activeRoomTimers[cleanCode]);
    delete activeRoomTimers[cleanCode];
  }
};

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Attempt to initialize Redis Pub/Sub adapter
  (async () => {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
      const pubClient = createClient({ 
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 1) {
              return false; // stop retrying
            }
            return 500; // retry after 500ms
          }
        }
      });
      const subClient = pubClient.duplicate();

      pubClient.on('error', (err) => console.warn('⚠️ Redis Pub Client Error:', err.message));
      subClient.on('error', (err) => console.warn('⚠️ Redis Sub Client Error:', err.message));

      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      
      redisClient = pubClient;
      redisConnected = true;
      console.log('🔌 Socket.io Redis Adapter and Session Store initialized successfully!');
    } catch (err) {
      console.warn('⚠️ Redis connection failed. Socket.io falling back to local In-Memory session/adapter state.', err.message);
    }
  })();

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // ==========================================
    // 1. TEACHER CREATES ROOM
    // ==========================================
    socket.on('createRoom', async ({ quizId, settings }) => {
      try {
        const quiz = await db.quizzes.findById(quizId);
        if (!quiz) {
          socket.emit('error_message', { message: 'Quiz not found.' });
          return;
        }

        // Generate unique hyphenless room code e.g. "AI8302"
        const roomCode = 'AI' + Math.floor(1000 + Math.random() * 9000);
        const cleanCode = getCleanCode(roomCode);

        const newRoom = await db.rooms.create({
          roomCode: cleanCode,
          quiz: quizId,
          host: quiz.creator,
          status: 'waiting',
          participants: [],
          currentQuestionIndex: 0,
          settings: settings || {
            public: true,
            participantLimit: 50,
            hasWaitingRoom: false
          }
        });

        // Initialize session schema
        const session = {
          dbId: newRoom._id,
          quiz,
          participants: [],
          answersReceived: 0,
          currentQuestionIndex: 0,
          timerRemaining: 0,
          isPaused: false,
          hostSocketId: socket.id,
          status: 'waiting'
        };

        await saveSession(cleanCode, session);

        socket.join(cleanCode);
        socket.emit('roomJoined', {
          roomCode: cleanCode,
          quizTitle: quiz.title,
          inviteLink: `http://localhost:3000/join?code=${cleanCode}`,
          role: 'host'
        });

        console.log(`🏠 Room Created: ${cleanCode} for Quiz: "${quiz.title}"`);
      } catch (e) {
        console.error('Create room socket error:', e);
        socket.emit('error_message', { message: 'Failed to create room.' });
      }
    });

    // ==========================================
    // 2. STUDENT JOINS ROOM
    // ==========================================
    socket.on('joinRoom', async ({ roomCode, username }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);

        if (!session) {
          socket.emit('error_message', { message: 'Active room not found. Check code.' });
          return;
        }

        if (session.status !== 'waiting') {
          socket.emit('error_message', { message: 'Quiz is already in progress or has finished.' });
          return;
        }

        // Check if student already in room session
        const exists = session.participants.find(p => p.username === username);
        if (exists) {
          exists.socketId = socket.id; // update socket ID on reconnect
        } else {
          session.participants.push({
            username,
            socketId: socket.id,
            score: 0,
            answers: [],
            accuracy: 100,
            avgSpeed: 0,
            isMock: false,
            cheatViolations: 0
          });
        }

        await saveSession(cleanCode, session);
        socket.join(cleanCode);

        // Acknowledge join success to student
        socket.emit('roomJoined', {
          roomCode: cleanCode,
          quizTitle: session.quiz.title,
          inviteLink: `http://localhost:3000/join?code=${cleanCode}`,
          role: 'student'
        });

        // Notify everyone in the lobby
        io.to(cleanCode).emit('playerJoined', {
          username,
          participants: session.participants.map(p => ({ username: p.username, score: p.score }))
        });

        console.log(`👤 Student Joined lobby: "${username}" in Room ${cleanCode}`);

        // Automated mock contestants generator has been disabled to ensure real-time real users only.
      } catch (e) {
        console.error('Join room socket error:', e);
        socket.emit('error_message', { message: 'Failed to join lobby.' });
      }
    });

    // ==========================================
    // 2b. STUDENT LEAVES ROOM
    // ==========================================
    socket.on('leaveRoom', async ({ roomCode, username }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session) return;

        session.participants = session.participants.filter(p => p.username !== username);
        await saveSession(cleanCode, session);

        socket.leave(cleanCode);
        io.to(cleanCode).emit('playerLeft', {
          username,
          participants: session.participants.map(p => ({ username: p.username, score: p.score }))
        });

        console.log(`👤 Student Left lobby: "${username}" from Room ${cleanCode}`);
      } catch (e) {
        console.error('Leave room socket error:', e);
      }
    });

    // ==========================================
    // 3. TEACHER STARTS QUIZ
    // ==========================================
    socket.on('startQuiz', async ({ roomCode }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session) return;

        session.status = 'active';
        await db.rooms.findByIdAndUpdate(session.dbId, { status: 'active' });
        await saveSession(cleanCode, session);

        // Notify client side room has started
        io.to(cleanCode).emit('quiz_started');
        console.log(`🎮 Game Loop started for room: ${cleanCode}`);

        // Broadcast first question after 3-second lobby transition countdown
        setTimeout(() => {
          sendQuestion(io, cleanCode);
        }, 3000);
      } catch (e) {
        console.error('Start quiz error:', e);
      }
    });

    // ==========================================
    // 4. TEACHER DECAPITATES TO NEXT QUESTION
    // ==========================================
    socket.on('nextQuestion', async ({ roomCode }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session || session.status !== 'active') return;

        session.currentQuestionIndex++;
        if (session.currentQuestionIndex < session.quiz.questions.length) {
          session.answersReceived = 0;
          await saveSession(cleanCode, session);
          
          sendQuestion(io, cleanCode);
        } else {
          await finishQuizGame(io, cleanCode);
        }
      } catch (e) {
        console.error('Next question error:', e);
      }
    });

    // ==========================================
    // 5. TEACHER PAUSES QUIZ TIMER
    // ==========================================
    socket.on('pauseQuiz', async ({ roomCode }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session) return;

        session.isPaused = true;
        await saveSession(cleanCode, session);

        io.to(cleanCode).emit('timerUpdated', {
          remainingTime: session.timerRemaining,
          isPaused: true
        });
        console.log(`⏸️ Quiz paused in room: ${cleanCode}`);
      } catch (e) {
        console.error('Pause quiz error:', e);
      }
    });

    // ==========================================
    // 6. TEACHER RESUMES QUIZ TIMER
    // ==========================================
    socket.on('resumeQuiz', async ({ roomCode }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session) return;

        session.isPaused = false;
        await saveSession(cleanCode, session);

        io.to(cleanCode).emit('timerUpdated', {
          remainingTime: session.timerRemaining,
          isPaused: false
        });
        console.log(`▶️ Quiz resumed in room: ${cleanCode}`);
      } catch (e) {
        console.error('Resume quiz error:', e);
      }
    });

    // ==========================================
    // 7. TEACHER TERMINATES QUIZ EARLY
    // ==========================================
    socket.on('endQuiz', async ({ roomCode }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        clearRoomTimer(cleanCode);
        await finishQuizGame(io, cleanCode);
      } catch (e) {
        console.error('End quiz error:', e);
      }
    });

    // ==========================================
    // 8. STUDENT SUBMITS ANSWER
    // ==========================================
    socket.on('submitAnswer', async ({ roomCode, username, answer, timeSpent }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session || session.status !== 'active') return;

        // SERVER TIMER VALIDATION: Reject late submissions
        if (session.timerRemaining <= 0) {
          socket.emit('error_message', { message: 'Submission rejected: Timer already expired.' });
          return;
        }

        const participant = session.participants.find(p => p.username === username);
        if (!participant) return;

        // Ensure student hasn't already submitted
        const hasAnswered = participant.answers.some(a => a.questionIndex === session.currentQuestionIndex);
        if (hasAnswered) {
          socket.emit('error_message', { message: 'Answer already submitted for this question.' });
          return;
        }

        // Retrieve the dynamically assigned adaptive question for this student
        const question = participant.currentAssignedQuestion || session.quiz.questions[session.currentQuestionIndex];
        const isCorrect = String(answer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();

        // SCORING ENGINE (Base 100 + Speed Bonus: Remaining Time * 5)
        let roundScore = 0;
        if (isCorrect) {
          const remainingTime = Math.max(0, question.timeLimit - timeSpent);
          const speedMultiplier = 5;
          const speedBonus = Math.round(remainingTime * speedMultiplier);
          roundScore = 100 + speedBonus;
          session.answersReceived++; 
        } else {
          // Negative marking check
          if (session.quiz.settings && session.quiz.settings.negativeMarking) {
            roundScore = -25;
          }
        }

        participant.score += roundScore;
        participant.answers.push({
          questionIndex: session.currentQuestionIndex,
          submittedAnswer: answer,
          isCorrect,
          scoreEarned: roundScore,
          timeSpent
        });

        await saveSession(cleanCode, session);

        console.log(`📝 Adaptive Submission from "${username}": ${answer} (Correct: ${isCorrect}, Score: +${roundScore})`);

        // Notify host of progress in real time
        const answeredCount = session.participants.filter(p => p.answers.some(a => a.questionIndex === session.currentQuestionIndex)).length;
        if (session.hostSocketId) {
          io.to(session.hostSocketId).emit('progressUpdated', {
            answersReceived: answeredCount,
            totalParticipants: session.participants.length
          });
        }

        // Check if all non-mock participants have answered
        const realCount = session.participants.filter(p => !p.isMock).length;
        const realAnswers = session.participants.filter(p => !p.isMock && p.answers.some(a => a.questionIndex === session.currentQuestionIndex)).length;

        if (realAnswers >= realCount) {
          // Trigger timeout immediately since all humans locked in
          clearRoomTimer(cleanCode);
          await processQuestionEnd(io, cleanCode);
        }
      } catch (e) {
        console.error('Answer submission error:', e);
      }
    });

    // ==========================================
    // 9. ANTI-CHEAT SIGNAL VIOLATION
    // ==========================================
    socket.on('cheat_violation', async ({ roomCode, username, reason }) => {
      try {
        const cleanCode = getCleanCode(roomCode);
        const session = await getSession(cleanCode);
        if (!session) return;

        const participant = session.participants.find(p => p.username === username);
        if (!participant) return;

        if (!participant.cheatViolations) {
          participant.cheatViolations = 0;
        }

        participant.cheatViolations++;
        let penaltyScore = 0;
        let penaltyMsg = '';
        let disqualified = false;

        if (participant.cheatViolations === 1) {
          penaltyMsg = 'Warning: Tab switching or focus loss detected. Maintain focus to avoid penalties!';
        } else if (participant.cheatViolations === 2) {
          penaltyScore = -50;
          participant.score += penaltyScore;
          penaltyMsg = 'Score Penalty: Secondary window blur detected. -50 points applied to score!';
        } else {
          penaltyMsg = 'Disqualified: Multiple cheat violations detected. Current round auto-submitted.';
          disqualified = true;
          
          const hasAnswered = participant.answers.some(a => a.questionIndex === session.currentQuestionIndex);
          if (!hasAnswered) {
            const question = session.quiz.questions[session.currentQuestionIndex];
            participant.answers.push({
              questionIndex: session.currentQuestionIndex,
              submittedAnswer: '[DISQUALIFIED / CHEATING]',
              isCorrect: false,
              scoreEarned: -100,
              timeSpent: question.timeLimit
            });
            participant.score -= 100;
          }
        }

        await saveSession(cleanCode, session);

        console.log(`⚠️ Cheat Alert: "${username}" in room ${cleanCode}. Violations: ${participant.cheatViolations}. Penalty: ${penaltyScore}`);

        socket.emit('cheat_penalty', {
          violationsCount: participant.cheatViolations,
          message: penaltyMsg,
          scoreDeducted: penaltyScore,
          disqualified
        });

        // Inform teacher supervisor dashboard
        if (session.hostSocketId) {
          io.to(session.hostSocketId).emit('teacher_cheat_alert', {
            username,
            violationsCount: participant.cheatViolations,
            actionTaken: penaltyMsg
          });
        }
      } catch (e) {
        console.error('Anti-cheat socket error:', e);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

// ==========================================
// GAME LOOP ENGINE FLOW HELPERS
// ==========================================

const startServerTimer = (io, roomCode, timeLimit) => {
  const cleanCode = getCleanCode(roomCode);
  clearRoomTimer(cleanCode);

  let remaining = timeLimit;

  // Track timer limit inside active timers object
  const tick = setInterval(async () => {
    try {
      const session = await getSession(cleanCode);
      if (!session) {
        clearInterval(tick);
        return;
      }

      if (session.status !== 'active') {
        clearInterval(tick);
        return;
      }

      if (session.isPaused) {
        io.to(cleanCode).emit('timerUpdated', {
          remainingTime: session.timerRemaining,
          isPaused: true
        });
        return;
      }

      remaining--;
      session.timerRemaining = remaining;
      await saveSession(cleanCode, session);

      io.to(cleanCode).emit('timerUpdated', {
        remainingTime: remaining,
        isPaused: false
      });

      if (remaining <= 0) {
        clearInterval(tick);
        delete activeRoomTimers[cleanCode];
        await processQuestionEnd(io, cleanCode);
      }
    } catch (err) {
      console.error('Timer interval error:', err);
    }
  }, 1000);

  activeRoomTimers[cleanCode] = tick;
};

const sendQuestion = async (io, roomCode) => {
  const cleanCode = getCleanCode(roomCode);
  const session = await getSession(cleanCode);
  if (!session) return;

  session.answersReceived = 0;

  // Broadcast adaptive difficulty questions to participants individually
  session.participants.forEach(p => {
    // 1. Calculate user accuracy percentage
    const correctCount = p.answers.filter(a => a.isCorrect).length;
    const totalAnswered = p.answers.length;
    const accuracy = totalAnswered > 0 ? (correctCount / totalAnswered) : 0.8; // default to medium (80%)

    // 2. Map accuracy to target difficulty level
    let targetDifficulty = 'medium';
    if (accuracy > 0.8) targetDifficulty = 'hard';
    else if (accuracy < 0.5) targetDifficulty = 'easy';

    // 3. Select matching question from the quiz pool
    let pool = session.quiz.questions.filter(q => q.difficulty === targetDifficulty);
    if (pool.length === 0) {
      pool = session.quiz.questions;
    }

    // Pick question from pool index sequentially
    const poolIndex = session.currentQuestionIndex % pool.length;
    const selectedQ = pool[poolIndex] || session.quiz.questions[session.currentQuestionIndex];

    // Assign question on participant object to evaluate correctness during submitAnswer
    p.currentAssignedQuestion = selectedQ;

    // Send only to this specific participant's socket ID
    if (p.socketId && !p.socketId.startsWith('mock_')) {
      io.to(p.socketId).emit('questionStarted', {
        index: session.currentQuestionIndex,
        total: session.quiz.questions.length,
        questionText: selectedQ.questionText,
        type: selectedQ.type,
        options: selectedQ.options,
        timeLimit: selectedQ.timeLimit,
        difficulty: selectedQ.difficulty
      });
    }
  });

  // Host dashboard gets the standard quiz question index for monitoring progress
  if (session.hostSocketId) {
    const defaultQ = session.quiz.questions[session.currentQuestionIndex];
    io.to(session.hostSocketId).emit('questionStarted', {
      index: session.currentQuestionIndex,
      total: session.quiz.questions.length,
      questionText: defaultQ.questionText,
      type: defaultQ.type,
      options: defaultQ.options,
      timeLimit: defaultQ.timeLimit,
      difficulty: defaultQ.difficulty
    });
  }

  const defaultQ = session.quiz.questions[session.currentQuestionIndex];
  session.timerRemaining = defaultQ.timeLimit || 20;
  await saveSession(cleanCode, session);

  console.log(`📝 Adaptive Questions for Round ${session.currentQuestionIndex + 1} pushed to Room ${cleanCode}`);

  // Simulating mock opponents submissions dynamically
  session.participants.forEach(p => {
    if (p.isMock) {
      const assignedQ = p.currentAssignedQuestion || session.quiz.questions[session.currentQuestionIndex];
      const mockReactionTimeMs = 2000 + Math.random() * (assignedQ.timeLimit * 500);
      
      setTimeout(async () => {
        const s = await getSession(cleanCode);
        if (!s || s.status !== 'active') return;

        const mp = s.participants.find(x => x.username === p.username);
        if (!mp) return;

        const randomChance = Math.random();
        const isCorrect = randomChance > 0.3;
        let selectedAnswer = '';
        
        if (assignedQ.type === 'tf') {
          selectedAnswer = isCorrect ? assignedQ.correctAnswer : (assignedQ.options.find(o => o !== assignedQ.correctAnswer) || 'False');
        } else {
          selectedAnswer = isCorrect ? assignedQ.correctAnswer : assignedQ.options[Math.floor(Math.random() * assignedQ.options.length)];
        }

        const isActualCorrect = String(selectedAnswer).toLowerCase() === String(assignedQ.correctAnswer).toLowerCase();
        let roundScore = 0;
        if (isActualCorrect) {
          const remainingTime = Math.max(0, assignedQ.timeLimit - Math.round(mockReactionTimeMs / 1000));
          const speedMultiplier = 5;
          const speedBonus = Math.round(remainingTime * speedMultiplier);
          roundScore = 100 + speedBonus;
          s.answersReceived++;
        } else if (s.quiz.settings && s.quiz.settings.negativeMarking) {
          roundScore = -25;
        }

        mp.score += roundScore;
        mp.answers.push({
          questionIndex: s.currentQuestionIndex,
          submittedAnswer: selectedAnswer,
          isCorrect: isActualCorrect,
          scoreEarned: roundScore,
          timeSpent: Math.round(mockReactionTimeMs / 1000)
        });

        await saveSession(cleanCode, s);

        // Notify host of mock progress
        const answeredCount = s.participants.filter(x => x.answers.some(a => a.questionIndex === s.currentQuestionIndex)).length;
        if (s.hostSocketId) {
          io.to(s.hostSocketId).emit('progressUpdated', {
            answersReceived: answeredCount,
            totalParticipants: s.participants.length
          });
        }
      }, mockReactionTimeMs);
    }
  });

  // Start the server countdown timer
  startServerTimer(io, cleanCode, defaultQ.timeLimit || 20);
};

const processQuestionEnd = async (io, roomCode) => {
  const cleanCode = getCleanCode(roomCode);
  const session = await getSession(cleanCode);
  if (!session) return;

  const question = session.quiz.questions[session.currentQuestionIndex];

  // Fill in skipped answers for anyone who missed the timer
  session.participants.forEach(p => {
    const hasAnswered = p.answers.some(a => a.questionIndex === session.currentQuestionIndex);
    if (!hasAnswered) {
      p.answers.push({
        questionIndex: session.currentQuestionIndex,
        submittedAnswer: '',
        isCorrect: false,
        scoreEarned: 0,
        timeSpent: question.timeLimit
      });
    }
  });

  // Sort and build round leaderboard standings
  const standings = [...session.participants]
    .sort((a, b) => b.score - a.score)
    .map((p, idx) => ({
      rank: idx + 1,
      name: p.username,
      score: p.score,
      lastAnswerCorrect: p.answers.find(a => a.questionIndex === session.currentQuestionIndex)?.isCorrect,
      isMock: p.isMock
    }));

  // Calculate correct, wrong, skipped counts for the round stats
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  session.participants.forEach(p => {
    const ans = p.answers.find(a => a.questionIndex === session.currentQuestionIndex);
    if (!ans || ans.submittedAnswer === '') {
      skippedCount++;
    } else if (ans.isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  await saveSession(cleanCode, session);

  io.to(cleanCode).emit('leaderboardUpdated', {
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    leaderboard: standings,
    roundStats: { correctCount, wrongCount, skippedCount }
  });

  console.log(`⏱️ Round ${session.currentQuestionIndex + 1} timed out. standings transmitted.`);

  // AUTOMATED TRANSITION: Wait 6 seconds, then automatically advance to the next question or terminate the game
  setTimeout(async () => {
    try {
      const s = await getSession(cleanCode);
      if (!s || s.status !== 'active') return;

      s.currentQuestionIndex++;
      if (s.currentQuestionIndex < s.quiz.questions.length) {
        s.answersReceived = 0;
        await saveSession(cleanCode, s);
        await sendQuestion(io, cleanCode);
      } else {
        await finishQuizGame(io, cleanCode);
      }
    } catch (err) {
      console.error('Automated question transition error:', err);
    }
  }, 6000);
};

const finishQuizGame = async (io, roomCode) => {
  const cleanCode = getCleanCode(roomCode);
  const session = await getSession(cleanCode);
  if (!session) return;

  session.status = 'finished';
  await db.rooms.findByIdAndUpdate(session.dbId, { status: 'finished' });

  // Compute final statistics, average speeds, correct percentages, strong and weak topics
  const finalStandings = [...session.participants]
    .sort((a, b) => b.score - a.score);

  const resultsData = await Promise.all(finalStandings.map(async (p, idx) => {
    const totalQ = session.quiz.questions.length;
    const correctCount = p.answers.filter(a => a.isCorrect).length;
    const wrongCount = p.answers.filter(a => !a.isCorrect && a.submittedAnswer !== '').length;
    const skippedCount = p.answers.filter(a => a.submittedAnswer === '').length;
    const avgResponseTime = p.answers.reduce((acc, a) => acc + a.timeSpent, 0) / totalQ;
    const accuracy = Math.round((correctCount / totalQ) * 100);

    // Group strong vs weak topics
    const topicBreakdown = {};
    p.answers.forEach((ans) => {
      const q = session.quiz.questions[ans.questionIndex];
      if (q) {
        if (!topicBreakdown[q.topic]) {
          topicBreakdown[q.topic] = { correct: 0, total: 0 };
        }
        topicBreakdown[q.topic].total++;
        if (ans.isCorrect) topicBreakdown[q.topic].correct++;
      }
    });

    const weakTopics = [];
    const strongTopics = [];
    for (let t in topicBreakdown) {
      const acc = (topicBreakdown[t].correct / topicBreakdown[t].total) * 100;
      if (acc < 50) weakTopics.push(t);
      else strongTopics.push(t);
    }

    const aiInsights = `You scored ${p.score} points with ${accuracy}% accuracy. Strongest at ${strongTopics.join(', ') || 'General Concept'}. Suggested practice: Spend more time reviewing ${weakTopics.join(', ') || 'Advanced Topics'}. Focus on speed for MCQs!`;

    // Persist human student results
    if (!p.isMock) {
      await db.results.create({
        room: session.dbId,
        quizId: session.quiz._id,
        studentName: p.username,
        score: p.score,
        totalQuestions: totalQ,
        correctCount,
        wrongCount,
        skippedCount,
        averageResponseTime: Math.round(avgResponseTime * 10) / 10,
        weakTopics,
        strongTopics,
        insights: aiInsights
      });
    }

    return {
      rank: idx + 1,
      name: p.username,
      score: p.score,
      accuracy,
      correctCount,
      avgSpeed: Math.round(avgResponseTime * 10) / 10,
      weakTopics,
      strongTopics,
      insights: aiInsights,
      isMock: p.isMock
    };
  }));

  io.to(cleanCode).emit('quizEnded', { results: resultsData });
  console.log(`🏁 Quiz finished in room ${cleanCode}. Results emitted, connections closed.`);

  // Clean up active room session from Redis
  await deleteSession(cleanCode);
};

module.exports = { initializeSocket };
