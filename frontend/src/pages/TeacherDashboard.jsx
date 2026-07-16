import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Sparkles, BarChart3, Users, Play, HelpCircle, 
  Settings, LogOut, FileDown, Layers, BookOpen, AlertCircle,
  Edit3, Trash2
} from 'lucide-react';

const TeacherDashboard = ({ setPage, user, handleLogout, setSelectedQuizForRoom, onEditQuiz, onUpdateUser, theme, setTheme }) => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalRooms: 0,
    totalStudents: 0,
    activeRooms: 0,
    averageScore: 0,
    aiGeneratedQuizzes: 0
  });

  const [charts, setCharts] = useState({
    quizPerformance: [],
    roomActivity: []
  });

  const [quizzes, setQuizzes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme State
  const isDark = theme === 'dark';

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileInstitution, setProfileInstitution] = useState(user?.institution || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileInstitution(user.institution || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    setUpdatingProfile(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: profileName, institution: profileInstitution })
      });
      const resData = await response.json();
      if (resData.success) {
        alert("✨ Profile updated successfully!");
        if (typeof onUpdateUser === 'function') {
          onUpdateUser(resData.data.user);
        }
        setShowProfileModal(false);
      } else {
        alert(resData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile: Connection error.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Fetch metrics from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quizzes/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const resData = await response.json();
        if (resData.success) {
          setStats(resData.data.stats);
          setCharts(resData.data.charts);
          setQuizzes(resData.data.recentQuizzes);
          setRooms(resData.data.recentRooms);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics from database:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLaunchRoom = (quiz) => {
    setSelectedQuizForRoom(quiz);
    setPage('live-room');
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setQuizzes(prev => prev.filter(q => q._id !== quizId));
        alert("Quiz deleted successfully.");
      } else {
        alert(resData.message || "Failed to delete quiz.");
      }
    } catch (err) {
      console.error("Delete request failed:", err);
      alert("Failed to delete quiz: Connection error.");
    }
  };

  // EXPORT EXCEL/CSV DATA HANDLER
  const exportCSVData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Quiz Title,Questions Count,Status,Total Students,Average Score"]
      .concat(quizzes.map(q => `"${q.title}",${q.questions.length},"Active",${stats.totalStudents},${stats.averageScore}`))
      .join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quizai_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Shared theme properties from StudentJoin
  const bgClass = isDark ? 'bg-[#0a0a0f] text-slate-100' : 'text-slate-900';
  
  const cardBgClass = isDark 
    ? 'bg-[#14121b] border-2 border-white shadow-[6px_6px_0px_#86EF6A] text-white' 
    : 'bg-white border-2 border-[#1d1c1c] shadow-[6px_6px_0px_#1d1c1c] text-[#1d1c1c]';
    
  const innerCardBgClass = isDark 
    ? 'bg-[#0d0b12] border-2 border-white shadow-[3px_3px_0px_#7ED8FF] text-white' 
    : 'bg-white border-2 border-[#1d1c1c] shadow-[3px_3px_0px_#1d1c1c] text-[#1d1c1c]';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative min-h-screen p-8 transition-all duration-500 select-none overflow-x-hidden ${bgClass}`}
      style={!isDark ? { background: 'linear-gradient(135deg, #FFFDE8 0%, #FFF5CC 50%, #FFE899 100%)' } : {}}
    >
      
      {/* Background radial overlays */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* DASHBOARD HEADER */}
      <header className="relative z-30 w-full max-w-7xl mx-auto py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        
        {/* Brand details */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setPage('landing')} 
            className={`w-[60px] h-[60px] rounded-full border-2 flex items-center justify-center font-sora font-[900] text-base cursor-pointer shadow-[0_4px_0_#000] hover:scale-105 active:scale-95 transition-all select-none ${
              isDark ? 'bg-[#14121b] border-white text-white shadow-[0_4px_0_#FFF]' : 'bg-black border-black text-white'
            }`}
          >
            Q⚡️
          </div>
          <div>
            <h1 className={`text-3xl font-sora font-[900] tracking-wider flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-[#1d1c1c]'
            }`}>
              Teacher Dashboard 
              <span className={`text-[10px] px-2.5 py-1 rounded-full border-2 font-black uppercase tracking-widest ${
                isDark ? 'bg-purple-950/40 border-purple-400 text-purple-300 shadow-[1px_1px_0_#fff]' : 'bg-[#ECEA8C] border-black text-black shadow-[1.5px_1.5px_0_#000]'
              }`}>
                PRO
              </span>
            </h1>
            <p className={`text-xs font-bold mt-1 tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Instructor: {user?.name || 'Academic'} | Academy: {user?.institution || 'QuizAI Academy'}
            </p>
          </div>
        </div>

        {/* TOP LEVEL ACTION BUTTONS & THEME TOGGLER */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          
          {/* LGT / DRK toggler pill matching StudentJoin exactly */}
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

          <button 
            onClick={() => setPage('quiz-creator')}
            className={`border-2 rounded-full px-5 py-3 font-black text-xs uppercase tracking-wider transition shadow-[3px_3px_0_#000] hover:shadow-[1.5px_1.5px_0_#000] active:translate-y-[1.5px] ${
              isDark 
                ? 'bg-purple-600 border-white text-white shadow-[3px_3px_0_#FFF] hover:shadow-[1.5px_1.5px_0_#FFF]' 
                : 'bg-white border-black text-[#1d1c1c]'
            }`}
          >
            + Manual Builder
          </button>

          <button 
            onClick={() => {
              setSelectedQuizForRoom(null);
              setPage('quiz-creator');
            }}
            className={`border-2 rounded-full px-5 py-3 font-[900] text-xs uppercase tracking-wider transition shadow-[3px_3px_0_#000] hover:shadow-[1.5px_1.5px_0_#000] active:translate-y-[1.5px] ${
              isDark 
                ? 'bg-[#86EF6A] border-white text-black shadow-[3px_3px_0_#FFF] hover:shadow-[1.5px_1.5px_0_#FFF]' 
                : 'bg-[#86EF6A] border-black text-black'
            }`}
          >
            ✨ Generate with AI
          </button>

          <button 
            onClick={() => setShowProfileModal(true)}
            className={`w-[48px] h-[48px] rounded-full border-2 flex items-center justify-center transition shadow-[3px_3px_0_#000] active:scale-95 ${
              isDark ? 'bg-[#14121b] border-white text-white shadow-[3px_3px_0_#FFF]' : 'bg-white border-black text-black'
            }`}
            title="Profile Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button 
            onClick={handleLogout}
            className={`w-[48px] h-[48px] rounded-full border-2 flex items-center justify-center transition shadow-[3px_3px_0_#000] active:scale-95 ${
              isDark 
                ? 'bg-[#14121b] border-white text-rose-400 shadow-[3px_3px_0_#FFF] hover:bg-rose-500/10' 
                : 'bg-[#F96C99]/20 border-black text-[#1d1c1c] hover:bg-[#F96C99]/30'
            }`}
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>

        </div>

      </header>

      {/* DASHBOARD STATISTICS TILES */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-6 gap-5 mb-12 relative z-10 w-full max-w-7xl mx-auto"
      >
        
        {/* STAT 1: Total Quizzes */}
        <motion.div variants={itemVariants} className={cardBgClass}>
          <span className={`text-[10px] font-black tracking-[0.12em] uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Quizzes</span>
          <h3 className={`text-4xl font-sora font-[900] tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalQuizzes}</h3>
          <span className="text-[10px] text-[#7ED8FF] font-black uppercase tracking-widest">Syllabus Stack</span>
        </motion.div>

        {/* STAT 2: Rooms Launched */}
        <motion.div variants={itemVariants} className={cardBgClass}>
          <span className={`text-[10px] font-black tracking-[0.12em] uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Rooms Launched</span>
          <h3 className={`text-4xl font-sora font-[900] tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalRooms}</h3>
          <span className="text-[10px] text-[#86EF6A] font-black uppercase tracking-widest">Game Sessions</span>
        </motion.div>

        {/* STAT 3: Total Students */}
        <motion.div variants={itemVariants} className={cardBgClass}>
          <span className={`text-[10px] font-black tracking-[0.12em] uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Students</span>
          <h3 className={`text-4xl font-sora font-[900] tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalStudents}</h3>
          <span className="text-[10px] text-[#F96C99] font-black uppercase tracking-widest">Audience Reach</span>
        </motion.div>

        {/* STAT 4: Active Rooms */}
        <motion.div variants={itemVariants} className={cardBgClass}>
          <span className={`text-[10px] font-black tracking-[0.12em] uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Rooms</span>
          <h3 className={`text-4xl font-sora font-[900] tracking-wider text-[#86EF6A] mb-2 flex items-center gap-1.5`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#86EF6A] animate-ping" />
            <span>{stats.activeRooms}</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Live Arena</span>
        </motion.div>

        {/* STAT 5: Average Score */}
        <motion.div variants={itemVariants} className={cardBgClass}>
          <span className={`text-[10px] font-black tracking-[0.12em] uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Average Score</span>
          <h3 className={`text-4xl font-sora font-[900] tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.averageScore}%</h3>
          <span className="text-[10px] text-[#86EF6A] font-black uppercase tracking-widest">Avg Accuracy</span>
        </motion.div>

        {/* STAT 6: AI Generated */}
        <motion.div variants={itemVariants} className={cardBgClass}>
          <span className={`text-[10px] font-black tracking-[0.12em] uppercase block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AI Generated</span>
          <h3 className={`text-4xl font-sora font-[900] tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.aiGeneratedQuizzes}</h3>
          <span className="text-[10px] text-[#F96C99] font-black uppercase tracking-widest">Gemini Cards</span>
        </motion.div>

      </motion.section>

      {/* CHARTS GRAPHICS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* CHART 1: QUIZ PERFORMANCE */}
        <div className={innerCardBgClass}>
          <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <span className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-wero-pink" /> Quiz Performance Trends
            </span>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Avg Correctness %</span>
          </div>

          <div className="flex flex-col gap-4 h-[220px] justify-between">
            {charts.quizPerformance.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className={`w-24 truncate text-xs font-bold text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.name}</span>
                <div className={`flex-1 rounded-full h-4 overflow-hidden border-2 ${isDark ? 'bg-white/5 border-white/15' : 'bg-slate-100 border-black/10'}`}>
                  <div 
                    className="bg-[#F96C99] h-full rounded-full transition-all duration-1000 shadow-lg flex items-center justify-end pr-2 border-r-2 border-black"
                    style={{ width: `${item.averageScore}%` }}
                  >
                    <span className="text-[9px] font-black text-white">{item.averageScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: PARTICIPATION & ACTIVITY */}
        <div className={innerCardBgClass}>
          <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <span className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-wero-blue" /> Weekly Room Activity
            </span>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Rooms Launched</span>
          </div>

          <div className="flex items-end justify-between h-[200px] pt-4 px-4">
            {charts.roomActivity.map((item, idx) => {
              const maxVal = Math.max(...charts.roomActivity.map(d => d.rooms), 1);
              const pct = (item.rooms / maxVal) * 85; 
              return (
                <div key={idx} className="flex flex-col items-center gap-3 h-full justify-end group">
                  <span className={`text-[10px] font-black opacity-0 group-hover:opacity-100 transition ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.rooms}</span>
                  <div 
                    className={`w-8 rounded-t-lg bg-[#7ED8FF] border-2 shadow-lg transition-all duration-1000 ${
                      isDark ? 'border-white' : 'border-black'
                    }`}
                    style={{ height: `${pct}%` }}
                  />
                  <span className={`text-[10px] font-black ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* QUIZZES & RESULTS LOGS TABLES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* RECENT QUIZZES (Span 2) */}
        <div className={`md:col-span-2 ${cardBgClass}`}>
          <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <h3 className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-wero-blue" /> Recent Quiz Syllabus
            </h3>
            
            <button 
              onClick={exportCSVData}
              className={`py-1.5 px-3.5 border-2 rounded-full font-black text-[10px] uppercase transition-all duration-250 flex items-center gap-1.5 active:translate-y-[1.5px] ${
                isDark 
                  ? 'bg-purple-600 border-white text-white shadow-[2.5px_2.5px_0_#FFF] hover:shadow-[1.5px_1.5px_0_#FFF]' 
                  : 'bg-[#ECEA8C] border-black text-[#1d1c1c] shadow-[2.5px_2.5px_0_#000]'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium border-collapse">
              <thead>
                <tr className={`border-b pb-3 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <th className={`py-3 text-[10px] font-black tracking-wider uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Quiz Name</th>
                  <th className={`py-3 text-[10px] font-black tracking-wider uppercase text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Questions</th>
                  <th className={`py-3 text-[10px] font-black tracking-wider uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Origin</th>
                  <th className={`py-3 text-[10px] font-black tracking-wider uppercase text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-black/10'}`}>
                {quizzes.map((q) => (
                  <tr key={q._id} className={`transition group ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-100/50'}`}>
                    <td className="py-4">
                      <span className={`font-extrabold block text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.title}</span>
                      <span className={`text-[10px] truncate max-w-xs block ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{q.description}</span>
                    </td>
                    <td className="py-4 text-center font-black text-[#86EF6A]">{q.questions.length} Items</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border-2 ${
                        q.description && q.description.includes('AI Generated')
                          ? isDark 
                            ? 'bg-purple-950/30 border-purple-400 text-purple-300' 
                            : 'bg-[#ECEA8C] border-black text-[#1d1c1c] shadow-[1.5px_1.5px_0_#000]'
                          : isDark
                            ? 'bg-[#0d0b12] border-white text-white shadow-[1.5px_1.5px_0_#FFF]'
                            : 'bg-[#7ED8FF]/15 border-black text-[#1d1c1c] shadow-[1.5px_1.5px_0_#000]'
                      }`}>
                        {q.description && q.description.includes('AI Generated') ? '🔮 AI' : '🎓 Manual'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2.5 items-center">
                        <button 
                          onClick={() => handleLaunchRoom(q)}
                          className={`py-1.5 px-3.5 rounded-full border-2 font-black text-[10px] transition flex items-center gap-1 active:translate-y-[1.5px] ${
                            isDark 
                              ? 'bg-[#86EF6A] border-white text-black shadow-[2.5px_2.5px_0_#FFF] hover:shadow-[1.5px_1.5px_0_#FFF]' 
                              : 'bg-[#86EF6A] border-black text-black shadow-[2.5px_2.5px_0_#000]'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" /> LAUNCH
                        </button>
                        
                        <button 
                          onClick={() => onEditQuiz(q)}
                          className={`p-2 rounded-xl border-2 transition active:translate-y-[1.5px] ${
                            isDark 
                              ? 'bg-[#14121b] border-white text-[#7ED8FF] shadow-[2.5px_2.5px_0_#FFF]' 
                              : 'bg-white border-black text-black shadow-[2.5px_2.5px_0_#000] hover:bg-slate-50'
                          }`}
                          title="Edit Quiz"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => handleDeleteQuiz(q._id)}
                          className={`p-2 rounded-xl border-2 transition active:translate-y-[1.5px] ${
                            isDark 
                              ? 'bg-[#14121b] border-white text-rose-400 shadow-[2.5px_2.5px_0_#FFF]' 
                              : 'bg-[#F96C99]/10 border-black text-[#1d1c1c] shadow-[2.5px_2.5px_0_#000] hover:bg-[#F96C99]/20'
                          }`}
                          title="Delete Quiz"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT LIVE ROOMS LOGS (Span 1) */}
        <div className={cardBgClass}>
          <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <h3 className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
              <Play className="w-4 h-4 text-wero-mint" /> Quiz Session Log
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {rooms.map((r) => (
              <div 
                key={r.id} 
                className={`p-4 rounded-xl border-2 transition flex justify-between items-center gap-3 ${
                  isDark ? 'bg-[#0d0b12] border-white shadow-[2px_2px_0_rgba(255,255,255,0.05)]' : 'bg-slate-50 border-black hover:bg-slate-100 shadow-[2px_2px_0_#000]'
                }`}
              >
                <div>
                  <span className={`font-[900] block text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{r.roomCode}</span>
                  <span className={`text-[10px] block truncate max-w-[140px] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{r.quizTitle}</span>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black block mb-1.5 border-2 ${
                    r.status === 'active' || r.status === 'waiting'
                      ? 'bg-purple-950/30 border-[#86EF6A] text-[#86EF6A] animate-pulse'
                      : isDark ? 'bg-slate-800 text-slate-500 border-slate-700/50' : 'bg-slate-200 text-slate-600 border-black/10'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-black ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{r.players} Contestants</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* PROFILE SETTINGS MODAL */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 rounded-3xl w-full max-w-md p-8 relative shadow-2xl transition-colors duration-300 ${
                isDark ? 'bg-[#0f0f15] border-white/20 text-white shadow-[6px_6px_0_#86EF6A]' : 'bg-white border-[#1d1c1c] text-[#1d1c1c] shadow-[6px_6px_0_#1d1c1c]'
              }`}
            >
              <h3 className="text-lg font-black tracking-tight mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-wero-pink" /> Profile Settings
              </h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Modify your creator credentials and academic institution details.</p>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className={`block text-[10px] font-black tracking-wider uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className={`w-full py-2.5 px-4 rounded-xl border-2 text-xs font-bold opacity-60 cursor-not-allowed ${
                      isDark ? 'bg-black/40 border-white/10 text-slate-500' : 'bg-slate-50 border-black/10 text-slate-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase mb-2">Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. John Watson"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={`w-full py-2.5 px-4 rounded-xl border-2 transition text-xs font-bold outline-none ${
                      isDark 
                        ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' 
                        : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-wider uppercase mb-2">Institution / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University"
                    value={profileInstitution}
                    onChange={(e) => setProfileInstitution(e.target.value)}
                    className={`w-full py-2.5 px-4 rounded-xl border-2 transition text-xs font-semibold outline-none ${
                      isDark 
                        ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' 
                        : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-3.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className={`flex-1 py-3 px-5 rounded-xl border-2 font-bold text-xs tracking-wider uppercase transition-all text-center ${
                      isDark 
                        ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
                        : 'border-black bg-white text-black shadow-[3px_3px_0_#1d1c1c] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className={`flex-1 py-3 px-5 rounded-xl border-2 font-extrabold text-xs tracking-wider uppercase transition-all text-center disabled:opacity-50 ${
                      isDark 
                        ? 'border-white/10 bg-slate-100 text-slate-900' 
                        : 'border-black bg-[#86EF6A] text-black shadow-[3px_3px_0_#1d1c1c] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {updatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default TeacherDashboard;
