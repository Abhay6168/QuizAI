import React, { useState } from 'react';
import { 
  Sparkles, FileText, ArrowLeft, Plus, Trash2, 
  Upload, CheckSquare, Layers, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';

const QuizCreator = ({ setPage, handleAIQuestionsLoad, quizToEdit, onClearEdit, theme, setTheme, isDark }) => {
  const [activeTab, setActiveTab] = useState(quizToEdit ? 'manual' : 'ai'); // 'ai' or 'manual'
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // AI Pipeline State
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [type, setType] = useState('mixed');
  const [language, setLanguage] = useState('English');

  // Manual Builder State
  const [quizTitle, setQuizTitle] = useState(quizToEdit ? quizToEdit.title : '');
  const [quizDesc, setQuizDesc] = useState(quizToEdit ? quizToEdit.description : '');
  const [manualQuestions, setManualQuestions] = useState(
    quizToEdit ? quizToEdit.questions : [
      {
        type: 'mcq',
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        marks: 10,
        difficulty: 'medium',
        topic: 'General Concept',
        timeLimit: 30
      }
    ]
  );
  const [settings, setSettings] = useState(
    quizToEdit ? quizToEdit.settings : {
      shuffleQuestions: false,
      shuffleOptions: false,
      negativeMarking: false,
      allowReattempt: true,
      showLeaderboard: true
    }
  );

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // AI Generation Pipeline Submit
  const handleAIGenerate = async (e) => {
    e.preventDefault();
    if (!file && !rawText) {
      alert("Please upload a document file or paste some reference text/notes first.");
      return;
    }

    setLoading(true);
    setProgress(15);
    
    // Simulate generation ticks
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 400);

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('text', rawText);
      formData.append('difficulty', difficulty);
      formData.append('count', count);
      formData.append('type', type);
      formData.append('language', language);

      const response = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      const resData = await response.json();
      if (resData.success) {
        setProgress(100);
        setTimeout(() => {
          clearInterval(interval);
          handleAIQuestionsLoad(resData.data.questions, { difficulty, language, title: file ? file.name.split('.')[0] : 'AI Generated Notes' });
          setPage('ai-review');
        }, 500);
      } else {
        alert(resData.message || 'Generation failed');
        setLoading(false);
        clearInterval(interval);
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Could not connect to the backend server. Please verify it is running on port 5000.");
      setLoading(false);
      clearInterval(interval);
    }
  };

  // Manual question list management
  const addQuestion = () => {
    setManualQuestions([...manualQuestions, {
      type: 'mcq',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      marks: 10,
      difficulty: 'medium',
      topic: 'General Concept',
      timeLimit: 30
    }]);
  };

  const removeQuestion = (idx) => {
    if (manualQuestions.length === 1) return;
    setManualQuestions(manualQuestions.filter((_, i) => i !== idx));
  };

  const updateQuestionText = (idx, val) => {
    const list = [...manualQuestions];
    list[idx].questionText = val;
    setManualQuestions(list);
  };

  const updateQuestionOption = (qIdx, optIdx, val) => {
    const list = [...manualQuestions];
    list[qIdx].options[optIdx] = val;
    setManualQuestions(list);
  };

  const setQuestionType = (idx, type) => {
    const list = [...manualQuestions];
    list[idx].type = type;
    list[idx].options = type === 'mcq' ? ['', '', '', ''] : ['True', 'False'];
    list[idx].correctAnswer = '';
    setManualQuestions(list);
  };

  // Save manual quiz
  const handleManualSave = async (e) => {
    e.preventDefault();
    if (!quizTitle) {
      alert("Please enter a Quiz Title");
      return;
    }

    const bodyData = {
      title: quizTitle,
      description: quizDesc || 'Manual Builder Quiz',
      questions: manualQuestions,
      settings
    };

    try {
      let response;
      if (quizToEdit) {
        response = await fetch(`http://localhost:5000/api/quizzes/${quizToEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(bodyData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(bodyData)
        });
      }

      const resData = await response.json();
      if (resData.success) {
        alert(quizToEdit ? "✨ Quiz updated successfully!" : "✨ Quiz saved successfully to your syllabus!");
        if (onClearEdit) onClearEdit();
        setPage('teacher-dashboard');
      } else {
        alert(resData.message || "Failed to save quiz to database.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving quiz: Could not connect to database/server.");
    }
  };

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

  const inputClass = isDark
    ? 'w-full py-2.5 px-4 rounded-xl bg-black/40 border border-white/10 text-white font-bold outline-none focus:border-[#86EF6A] text-xs'
    : 'w-full py-2.5 px-4 rounded-xl bg-white border-2 border-black text-black font-semibold outline-none focus:border-purple-600 text-xs';

  const labelClass = isDark
    ? 'block text-xs font-black tracking-wider text-slate-500 uppercase mb-2'
    : 'block text-xs font-black tracking-wider text-slate-700 uppercase mb-2';

  const selectClass = isDark
    ? 'w-full py-2.5 px-4 rounded-xl bg-black/40 border border-white/10 text-white font-bold appearance-none cursor-pointer outline-none text-xs'
    : 'w-full py-2.5 px-4 rounded-xl bg-white border-2 border-black text-black font-semibold appearance-none cursor-pointer outline-none text-xs';

  const primaryBtnClass = isDark
    ? 'w-full py-4 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-extrabold text-sm uppercase tracking-wider transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg'
    : 'w-full py-4 rounded-2xl bg-[#86EF6A] hover:bg-[#A8F08D] text-black border-2 border-black font-extrabold text-sm uppercase tracking-wider transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[4px_4px_0_#000]';

  const toggleSelectBtn = (l) => {
    const isSelected = difficulty === l;
    if (isDark) {
      return isSelected 
        ? 'py-2 rounded-xl text-xs font-bold transition capitalize bg-slate-100 text-slate-900 shadow-md font-extrabold'
        : 'py-2 rounded-xl text-xs font-bold transition capitalize bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10';
    } else {
      return isSelected
        ? 'py-2 rounded-xl text-xs font-black transition capitalize bg-[#ECEA8C] border-2 border-black text-black shadow-[2px_2px_0_#000]'
        : 'py-2 rounded-xl text-xs font-bold transition capitalize bg-white border-2 border-black text-slate-600 hover:bg-slate-50';
    }
  };

  return (
    <div className={`relative min-h-screen p-8 transition-all duration-500 overflow-x-hidden ${bgClass}`} style={bgStyle}>
      
      {/* GLOWS (Dark Theme Only) */}
      {isDark && (
        <>
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-wero-pink/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-wero-blue/5 blur-[120px] pointer-events-none" />
        </>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 relative z-10">
        <button 
          onClick={() => {
            if (onClearEdit) onClearEdit();
            setPage('teacher-dashboard');
          }}
          className={headerBtnClass}
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
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
          <span className={`text-xs font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Quiz Creator Studio</span>
        </div>
      </header>

      {/* MODE TABS SELECTOR */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className={tabOuterClass}>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-8 py-3 rounded-full text-xs font-black tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'ai' 
                ? isDark 
                  ? 'bg-slate-100 text-slate-900 shadow-md font-extrabold' 
                  : 'bg-[#86EF6A] border-2 border-black text-black shadow-[2px_2px_0_#000] font-extrabold'
                : isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'ai' ? 'text-wero-pink fill-wero-pink animate-pulse' : 'text-slate-400'}`} />
            <span>AI GENERATION</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-8 py-3 rounded-full text-xs font-black tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'manual' 
                ? isDark 
                  ? 'bg-slate-100 text-slate-900 shadow-md font-extrabold'
                  : 'bg-[#86EF6A] border-2 border-black text-black shadow-[2px_2px_0_#000] font-extrabold'
                : isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>MANUAL BUILDER</span>
          </button>
        </div>
      </div>

      {/* AI GENERATOR TAB CONTAINER */}
      {activeTab === 'ai' && (
        <section className="max-w-3xl mx-auto relative z-10">
          {loading ? (
            /* LOADING BLOCK */
            <div className={`${cardClass} p-12 text-center min-h-[350px] flex flex-col justify-center items-center`}>
              <div className="w-16 h-16 rounded-2xl bg-wero-pink/10 border border-wero-pink/20 flex items-center justify-center text-wero-pink mb-8 animate-spin">
                <Sparkles className="w-8 h-8 fill-wero-pink" />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Analyzing Document Pipeline</h2>
              <p className={`text-sm mb-8 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Extracting key topics, mapping questions schemas, and formatting answers with Gemini AI...</p>
              
              <div className={`w-full max-w-md rounded-full h-3 overflow-hidden border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-200 border-black/10'}`}>
                <div 
                  className="bg-wero-pink h-full rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase mt-3 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{progress}% PIPELINE INDEXED</span>
            </div>
          ) : (
            /* FORM UPLOAD BLOCK */
            <form onSubmit={handleAIGenerate} className="space-y-8">
              
              {/* UPLOAD FILE CONTAINER */}
              <div className={`${cardClass} p-10 text-center relative group`}>
                <input
                  type="file"
                  id="doc-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.ppt,.pptx,.docx,.txt"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/5 border border-white/5 text-slate-400 group-hover:scale-105 group-hover:text-wero-pink group-hover:bg-wero-pink/5' 
                      : 'bg-slate-100 border-2 border-black text-black shadow-[2px_2px_0_#000] group-hover:bg-purple-100 group-hover:scale-105'
                  }`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-1.5">
                    {file ? file.name : 'Upload Lecture Materials'}
                  </h3>
                  <p className={`text-xs max-w-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Drag & drop your files here or browse. Supports PDFs, PPTx, DOCx, or plain notes (Max 10MB)
                  </p>
                </div>
              </div>

              {/* OR TEXT AREA */}
              <div className="flex flex-col">
                <label className={labelClass}>Or Paste Custom Notes</label>
                <textarea
                  rows={4}
                  placeholder="Paste study guides, lesson summaries, or definitions here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* TUNING ACCENT PIPELINE CONFIGS */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border ${
                isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-2 border-black shadow-[4px_4px_0_#000]'
              }`}>
                
                {/* 1. DIFFICULTY */}
                <div>
                  <label className={labelClass}>Tuning Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'medium', 'hard'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setDifficulty(l)}
                        className={toggleSelectBtn(l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. QUESTION COUNT */}
                <div>
                  <label className={labelClass}>Questions Count</label>
                  <div className="relative">
                    <select
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      className={selectClass}
                    >
                      {[5, 10, 20, 50].map(c => (
                        <option key={c} value={c} className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>{c} Questions</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. QUESTION TYPES */}
                <div>
                  <label className={labelClass}>Type Distribution</label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className={selectClass}
                    >
                      <option value="mixed" className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>Mixed (MCQs & T/F)</option>
                      <option value="mcq" className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>MCQs Only (4 Options)</option>
                      <option value="tf" className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>True / False Only</option>
                    </select>
                  </div>
                </div>

                {/* 4. LANGUAGE */}
                <div>
                  <label className={labelClass}>Output Translation</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={selectClass}
                    >
                      <option value="English" className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>English (Primary)</option>
                      <option value="Hindi" className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>Hindi (हिन्दी)</option>
                      <option value="Marathi" className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>Marathi (मराठी)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* GENERATE SUBMIT ACTION */}
              <button type="submit" className={primaryBtnClass}>
                <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                <span>GENERATE INTELLIGENT QUIZ CARDS</span>
              </button>

            </form>
          )}
        </section>
      )}

      {/* MANUAL BUILDER TAB CONTAINER */}
      {activeTab === 'manual' && (
        <section className="max-w-4xl mx-auto relative z-10">
          <form onSubmit={handleManualSave} className="space-y-8">
            
            {/* QUIZ GENERAL INFORMATION CARD */}
            <div className={cardClass}>
              <h3 className="text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-wero-pink" /> Core Quiz Metadata
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Quiz Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced Calculus Unit 1"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Penalty / Negative marking</label>
                  <div className="flex items-center gap-3 py-3">
                    <input
                      type="checkbox"
                      id="neg-marking"
                      checked={settings.negativeMarking}
                      onChange={(e) => setSettings({ ...settings, negativeMarking: e.target.checked })}
                      className={`w-5 h-5 rounded cursor-pointer ${isDark ? 'accent-wero-pink bg-[#0f0f13]' : 'accent-purple-600'}`}
                    />
                    <label htmlFor="neg-marking" className={`text-xs font-bold select-none cursor-pointer flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      <AlertTriangle className="w-3.5 h-3.5 text-wero-pink" />
                      <span>-25 points on wrong answers</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  placeholder="Explain what skills or topics this quiz is designed to test..."
                  value={quizDesc}
                  onChange={(e) => setQuizDesc(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* QUESTIONS BUILDER CARDS GRID */}
            <div className="space-y-6">
              <h3 className={`text-sm font-black tracking-widest uppercase flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                <Layers className="w-4 h-4 text-wero-blue" /> Questions Stack ({manualQuestions.length})
              </h3>

              {manualQuestions.map((q, idx) => (
                <div key={idx} className={cardClass}>
                  
                  {/* Delete Badge */}
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className={`absolute top-6 right-6 p-2 rounded-xl transition ${
                      isDark 
                        ? 'bg-red-950/15 border border-red-500/10 hover:bg-red-950/30 text-red-400' 
                        : 'bg-red-50 border-2 border-red-500 text-red-500 shadow-[1.5px_1.5px_0_#000] hover:bg-red-100'
                    }`}
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs border ${
                      isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-100 border-black text-black'
                    }`}>
                      {idx + 1}
                    </span>
                    
                    {/* Q Type selector */}
                    <div className={`flex items-center gap-1.5 p-1 rounded-full border ${
                      isDark ? 'bg-slate-950 border-white/5' : 'bg-white border-2 border-black shadow-[2px_2px_0_#000]'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setQuestionType(idx, 'mcq')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider transition ${
                          q.type === 'mcq' 
                            ? isDark ? 'bg-white/10 text-white' : 'bg-[#ECEA8C] text-black border border-black shadow-[1px_1px_0_#000]' 
                            : 'text-slate-400'
                        }`}
                      >
                        MCQ (4 Options)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuestionType(idx, 'tf')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider transition ${
                          q.type === 'tf' 
                            ? isDark ? 'bg-white/10 text-white' : 'bg-[#ECEA8C] text-black border border-black shadow-[1px_1px_0_#000]'
                            : 'text-slate-400'
                        }`}
                      >
                        True / False
                      </button>
                    </div>
                  </div>

                  {/* QUESTION TEXT */}
                  <div>
                    <label className={labelClass}>Question String</label>
                    <input
                      type="text"
                      placeholder="Write your quiz question here..."
                      value={q.questionText}
                      onChange={(e) => updateQuestionText(idx, e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* MCQ OPTIONS */}
                  {q.type === 'mcq' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx}>
                          <label className="block text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5">
                            Option {String.fromCharCode(65 + optIdx)}
                          </label>
                          <input
                            type="text"
                            placeholder={`Enter Option ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) => updateQuestionOption(idx, optIdx, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`p-3 text-center rounded-xl border text-xs font-bold ${
                          isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-2 border-black text-black'
                        }`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ANSWER & EXPLANATIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                    
                    {/* Correct answer */}
                    <div className="md:col-span-1">
                      <label className={labelClass}>Correct Target Answer</label>
                      <div className="relative">
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => {
                            const list = [...manualQuestions];
                            list[idx].correctAnswer = e.target.value;
                            setManualQuestions(list);
                          }}
                          className={selectClass}
                        >
                          <option value="">Select Correct Answer</option>
                          {q.options.map((opt, optIdx) => (
                            <option key={optIdx} value={opt} className={isDark ? 'bg-[#0f0f13] text-white' : 'bg-white text-black'}>
                              {opt || `Empty Option ${String.fromCharCode(65 + optIdx)}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="md:col-span-2">
                      <label className={labelClass}>Detailed Solution Explanation</label>
                      <input
                        type="text"
                        placeholder="Provide details on why this answer is correct..."
                        value={q.explanation}
                        onChange={(e) => {
                          const list = [...manualQuestions];
                          list[idx].explanation = e.target.value;
                          setManualQuestions(list);
                        }}
                        className={inputClass}
                      />
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* ADD AND SAVE WORKFLOWS */}
            <div className="flex items-center gap-4 py-8">
              
              <button
                type="button"
                onClick={addQuestion}
                className={`py-3 px-6 rounded-xl border font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 ${
                  isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
                    : 'bg-white border-2 border-black text-black shadow-[3px_3px_0_#000] hover:bg-slate-50'
                }`}
              >
                <Plus className="w-4 h-4 text-wero-blue" /> Add Question Card
              </button>

              <button type="submit" className={primaryBtnClass}>
                <ShieldCheck className="w-4 h-4 text-wero-mint" />
                <span>SAVE QUIZ SYLLABUS</span>
              </button>

            </div>

          </form>
        </section>
      )}

    </div>
  );
};

export default QuizCreator;
