import React, { useState } from 'react';
import { 
  Users, Layers, BarChart3, Terminal, Play, 
  Trash2, ShieldCheck, Settings, LogOut, ArrowRight, CornerDownLeft
} from 'lucide-react';

const AdminDashboard = ({ setPage, user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'teachers' | 'quizzes' | 'logs'

  // Admin Mock Database Collections Data
  const mockTeachers = [
    { id: 't_1', name: 'Dr. Sarah Smith', email: 'sarah.smith@harvard.edu', institution: 'Harvard University', status: 'Approved', joined: '2026-05-24' },
    { id: 't_2', name: 'Professor Alan Turing', email: 'alan@cambridge.edu', institution: 'Coaching Institute', status: 'Approved', joined: '2026-05-27' },
    { id: 't_3', name: 'Dr. Jane Miller', email: 'jane.miller@edtech.com', institution: 'EdTech Company', status: 'Pending Approval', joined: '2026-05-30' }
  ];

  const mockQuizzes = [
    { id: 'q_1', title: 'Data Structures and Algorithms', questions: 20, difficulty: 'hard', creator: 'sarah.smith@harvard.edu', rooms: 8 },
    { id: 'q_2', title: 'Web Development Basics', questions: 10, difficulty: 'easy', creator: 'alan@cambridge.edu', rooms: 15 },
    { id: 'q_3', title: 'AI Ethics and Policies', questions: 5, difficulty: 'medium', creator: 'jane.miller@edtech.com', rooms: 2 }
  ];

  const mockSystemLogs = [
    { time: '10:45:02', level: 'info', service: 'SocketServer', msg: 'Room created: AI-4092 bound successfully.' },
    { time: '10:45:12', level: 'info', service: 'AuthModule', msg: 'User Registered: Dr. Jane Miller (EdTech Company)' },
    { time: '10:46:18', level: 'warning', service: 'GeminiPipeline', msg: 'REST call failed; initiated mock question regeneration fallback.' },
    { time: '10:47:04', level: 'info', service: 'SocketServer', msg: 'Student Einstein_2.0 successfully connected to room AI-4092.' },
    { time: '10:47:32', level: 'error', service: 'SocketServer', msg: 'Socket connection reset: Handshake timeout for socket_id 9912.' }
  ];

  return (
    <div className="relative min-h-screen bg-[#08080a] text-slate-100 p-8 flex flex-col justify-between select-none">
      
      {/* glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-red-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-slate-950/20 blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-center justify-center font-extrabold text-xl text-red-400 shadow-xl">
            A⚡️
          </div>
          <div>
            <h1 className="text-3xl font-black font-sans tracking-tight text-white flex items-center gap-2">
              System Admin console <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/15 uppercase tracking-widest animate-pulse">ROOT</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Platform Management Console | Welcome, Master Admin {user?.name}</p>
          </div>
        </div>

        {/* TOP LEVEL ACTION BUTTONS */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <button 
            onClick={() => setPage('teacher-dashboard')}
            className="flex-1 md:flex-none py-3 px-5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
          >
            <CornerDownLeft className="w-4 h-4" /> Teacher Mode
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/20 text-red-400 flex items-center justify-center transition"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ADMIN TABS CONTROLLER */}
      <div className="flex justify-start mb-8 border-b border-white/5 pb-1 z-10 relative">
        {['metrics', 'teachers', 'quizzes', 'logs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-sans font-black text-xs uppercase tracking-wider transition ${
              activeTab === tab 
                ? 'border-b-2 border-red-500 text-red-400 font-extrabold' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT TILES */}
      <main className="flex-1 z-10 relative space-y-8">
        
        {/* 1. METRICS PANEL */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Global Active Sessions</span>
                <h3 className="text-3xl font-black font-sans text-red-400 mb-2">4 Active</h3>
                <span className="text-[10px] text-slate-500">Live synchronized rooms</span>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Global Registered Teachers</span>
                <h3 className="text-3xl font-black font-sans text-white mb-2">48 Teachers</h3>
                <span className="text-[10px] text-slate-500">Colleges, Coaching Institutes</span>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Global Database Quizzes</span>
                <h3 className="text-3xl font-black font-sans text-white mb-2">282 Quizzes</h3>
                <span className="text-[10px] text-slate-500">AI Generated + Manual</span>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Total System Connections</span>
                <h3 className="text-3xl font-black font-sans text-wero-mint mb-2">4,904 Hits</h3>
                <span className="text-[10px] text-slate-500">200ms socket sync lag</span>
              </div>
            </section>

            {/* Platform statistics */}
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                <BarChart3 className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-extrabold text-white">Global Database Collection Statistics</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-4xl font-sans font-black text-white block mb-1">8</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Mongoose Collections</span>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-4xl font-sans font-black text-white block mb-1">2.4MB</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">File uploads size</span>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-4xl font-sans font-black text-white block mb-1">99.9%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Socket server uptime</span>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-4xl font-sans font-black text-white block mb-1">0</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Crashes registered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE TEACHERS PANEL */}
        {activeTab === 'teachers' && (
          <div className="glass-card p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" /> Platform Teachers & Institutions ({mockTeachers.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-white/5 pb-3 text-slate-500">
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase">Name</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase">Email</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase">Institution</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase">Status</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {mockTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.01] transition">
                      <td className="py-4 font-bold text-white">{t.name}</td>
                      <td className="py-4 text-slate-400">{t.email}</td>
                      <td className="py-4 font-semibold">{t.institution}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          t.status === 'Approved' ? 'bg-wero-mint/10 text-wero-mint' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => alert(`Reviewing credential files associated with teacher: ${t.name}`)}
                          className="py-1.5 px-3 rounded bg-slate-900 border border-slate-700 hover:bg-slate-100 hover:text-slate-900 font-extrabold text-[9px] uppercase transition"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MANAGE QUIZZES PANEL */}
        {activeTab === 'quizzes' && (
          <div className="glass-card p-8 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400" /> Platform Quizzes Directory ({mockQuizzes.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-white/5 pb-3 text-slate-500">
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase">Title</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase text-center">Questions</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase">Creator</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase text-center">Rooms Played</th>
                    <th className="py-3 text-[10px] font-black tracking-wider uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {mockQuizzes.map((q) => (
                    <tr key={q.id} className="hover:bg-white/[0.01] transition">
                      <td className="py-4 font-bold text-white">{q.title}</td>
                      <td className="py-4 text-center text-wero-pink font-bold">{q.questions} Cards</td>
                      <td className="py-4 text-slate-400">{q.creator}</td>
                      <td className="py-4 text-center font-semibold text-wero-blue">{q.rooms} Played</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => alert(`Deleting quiz ${q.title} from global registry.`)}
                          className="p-2 rounded bg-red-950/15 border border-red-500/10 hover:bg-red-950/30 text-red-400 transition"
                          title="Remove Quiz"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. LIVE SYSTEM LOGS */}
        {activeTab === 'logs' && (
          <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-red-400" /> Live Docker System Logs
              </h3>
              <span className="text-[9px] font-black text-red-400 tracking-widest uppercase animate-pulse">● System Streaming</span>
            </div>

            {/* LOG SCREEN TERMINAL BOX */}
            <div className="p-5 rounded-2xl bg-black border border-white/5 font-mono text-[10px] leading-relaxed max-h-[300px] overflow-y-auto space-y-3.5 pr-2">
              {mockSystemLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="text-slate-600">{log.time}</span>
                  <span className={`px-1.5 py-0.5 rounded font-black uppercase text-[8px] ${
                    log.level === 'error' 
                      ? 'bg-red-950 text-red-400 border border-red-500/20' 
                      : log.level === 'warning'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-900 text-slate-400 border border-white/5'
                  }`}>{log.level}</span>
                  <span className="text-red-400/90 font-bold">{log.service}:</span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="py-4 border-t border-white/5 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider relative z-10">
        QuizAI root administrative panel controls v1.0.0
      </footer>

    </div>
  );
};

export default AdminDashboard;
