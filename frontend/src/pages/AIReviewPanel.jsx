import React, { useState } from 'react';
import { 
  CheckCircle, ArrowLeft, RefreshCw, Copy, Trash2, Edit3, 
  Save, ShieldAlert, CheckSquare, Square
} from 'lucide-react';

const AIReviewPanel = ({ setPage, aiQuestions, setAiQuestions, aiGenerationMeta, theme, setTheme, isDark }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [quizName, setQuizName] = useState(aiGenerationMeta?.title ? `${aiGenerationMeta.title} AI Quiz` : 'AI Generated Quiz');

  const handleToggleSelect = (idx) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter(i => i !== idx));
    } else {
      setSelectedIndices([...selectedIndices, idx]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIndices.length === aiQuestions.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(aiQuestions.map((_, idx) => idx));
    }
  };

  // PERMANENT CARD DELETE / REJECT
  const handleDeleteCard = (idx) => {
    const list = aiQuestions.filter((_, i) => i !== idx);
    setAiQuestions(list);
    setSelectedIndices(prev => prev.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
    console.log(`🗑️ Rejected question card at index ${idx + 1}.`);
  };

  const handleDuplicateCard = (idx) => {
    const list = [...aiQuestions];
    const duplicated = { ...list[idx], questionText: `[Copy] ${list[idx].questionText}` };
    list.splice(idx + 1, 0, duplicated);
    setAiQuestions(list);
    setSelectedIndices(prev => prev.map(i => i > idx ? i + 1 : i));
  };

  // INDIVIDUAL REGENERATION OF A QUESTION CARD BASED ON TOPIC
  const handleRegenerateCard = async (idx, currentTopic) => {
    console.log(`♻️ Regenerating question card at index: ${idx} for topic: "${currentTopic}"`);
    try {
      const response = await fetch('http://localhost:5000/api/ai/regenerate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          topic: currentTopic, 
          difficulty: aiGenerationMeta?.difficulty || 'medium',
          language: aiGenerationMeta?.language || 'English'
        })
      });

      const resData = await response.json();
      if (resData.success) {
        const list = [...aiQuestions];
        list[idx] = resData.data;
        setAiQuestions(list);
      }
    } catch (e) {
      console.warn("Regeneration failed, updating text locally.");
      const list = [...aiQuestions];
      list[idx].questionText = `[Regenerated] Fresh question testing your core knowledge on ${currentTopic}.`;
      setAiQuestions(list);
    }
  };

  // INDIVIDUAL AI REWRITE
  const handleRewriteCard = async (idx, currentCard) => {
    console.log(`🔮 Initiating AI Rewrite on index: ${idx} for concept: "${currentCard.concept}"`);
    try {
      const response = await fetch('http://localhost:5000/api/ai/rewrite', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          questionCard: currentCard,
          language: aiGenerationMeta?.language || 'English'
        })
      });

      const resData = await response.json();
      if (resData.success) {
        const list = [...aiQuestions];
        list[idx] = resData.data;
        setAiQuestions(list);
        console.log(`✅ Question successfully rewritten by Critic AI!`);
      }
    } catch (e) {
      console.warn("Rewrite failed, appending fallback decoration.");
      const list = [...aiQuestions];
      list[idx].questionText = `[Rewritten] ${list[idx].questionText}`;
      setAiQuestions(list);
    }
  };

  const handleSaveEdit = (idx, updatedCard) => {
    const list = [...aiQuestions];
    list[idx] = updatedCard;
    setAiQuestions(list);
    setEditingIndex(null);
  };

  // BULK APPROVE & SAVE
  const handleApproveAll = async () => {
    if (aiQuestions.length === 0) return;
    setSaving(true);

    try {
      const payload = {
        title: quizName,
        description: `AI Generated Quiz based on topic logs. Difficulty: ${aiGenerationMeta?.difficulty || 'medium'}`,
        questions: aiQuestions,
        settings: {
          shuffleQuestions: false,
          shuffleOptions: false,
          negativeMarking: false,
          allowReattempt: true,
          showLeaderboard: true
        }
      };

      const response = await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.success) {
        alert("🎉 AI generated quiz successfully approved and saved!");
        setPage('teacher-dashboard');
      } else {
        alert(resData.message || 'Approval failed');
      }
    } catch (err) {
      console.error("Express server down, failed to save quiz to database.", err);
      alert("Error saving quiz: Could not connect to database/server.");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Theme properties
  const bgClass = isDark ? 'bg-[#0a0a0f] text-slate-100' : 'text-slate-900';
  
  const cardBgClass = isDark 
    ? 'bg-[#14121b] border-2 border-white shadow-[6px_6px_0px_#86EF6A] text-white' 
    : 'bg-white border-2 border-[#1d1c1c] shadow-[6px_6px_0px_#1d1c1c] text-[#1d1c1c]';

  return (
    <div 
      className={`relative min-h-screen p-8 transition-all duration-500 select-none overflow-x-hidden ${bgClass}`}
      style={!isDark ? { background: 'linear-gradient(135deg, #FFFDE8 0%, #FFF5CC 50%, #FFE899 100%)' } : {}}
    >
      
      {/* Background radial glows */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* HEADER */}
      <header className="relative z-30 w-full max-w-7xl mx-auto py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setPage('quiz-creator')}
            className={`p-3 rounded-xl border-2 transition active:scale-95 ${
              isDark 
                ? 'bg-[#14121b] border-white/10 text-slate-300 hover:border-white' 
                : 'bg-white border-[#1d1c1c] text-black shadow-[3px_3px_0_#1d1c1c] hover:bg-slate-50'
            }`}
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <span className={`text-[10px] font-black tracking-widest uppercase block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Pipeline Output Review</span>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className={`text-2xl font-black font-sans bg-transparent border-b-2 transition outline-none pb-0.5 tracking-tight w-full max-w-md ${
                isDark 
                  ? 'border-transparent hover:border-slate-800 focus:border-slate-700 text-white' 
                  : 'border-transparent hover:border-black/20 focus:border-black text-black'
              }`}
            />
          </div>
        </div>

        {/* BULK ACTIONS OR SAVES */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          
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

          <button
            onClick={handleSelectAll}
            className={`py-2.5 px-4 rounded-xl border-2 font-bold text-xs tracking-wider uppercase transition flex items-center gap-1.5 active:scale-95 ${
              isDark 
                ? 'bg-[#14121b] border-white/10 text-white' 
                : 'bg-white border-[#1d1c1c] text-black shadow-[3px_3px_0_#1d1c1c] hover:bg-slate-50'
            }`}
          >
            {selectedIndices.length === aiQuestions.length ? 'Deselect All' : 'Select All'}
          </button>

          <button
            onClick={handleApproveAll}
            disabled={saving}
            className={`py-3.5 px-6 rounded-xl border-2 font-extrabold text-xs tracking-wider uppercase transition active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
              isDark 
                ? 'bg-slate-100 border-white text-slate-900 shadow-[3px_3px_0_#FFF] hover:scale-105' 
                : 'bg-[#86EF6A] border-[#1d1c1c] text-black shadow-[3px_3px_0_#1d1c1c] hover:scale-105'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'APPROVE ALL CARDS'}</span>
          </button>

        </div>
      </header>

      {/* QUESTION REVIEW CARD DECK GRID */}
      <section className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {aiQuestions.length === 0 ? (
          <div className={`${cardBgClass} p-12 text-center`}>
            <ShieldAlert className="w-12 h-12 text-wero-pink mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No generated questions left</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">You've deleted all items from the active deck. Go back to upload and generate again.</p>
            <button 
              onClick={() => setPage('quiz-creator')}
              className={`py-2.5 px-5 rounded-full border-2 text-xs font-black tracking-widest uppercase transition ${
                isDark ? 'bg-white border-white text-black' : 'bg-black border-black text-white'
              }`}
            >
              Start Over
            </button>
          </div>
        ) : (
          aiQuestions.map((q, idx) => {
            const isEditing = editingIndex === idx;
            const isSelected = selectedIndices.includes(idx);
            
            return (
              <div 
                key={idx} 
                className={`p-8 rounded-3xl border-2 transition-all duration-300 relative ${
                  isSelected 
                    ? isDark 
                      ? 'bg-[#14121b] border-wero-mint text-white shadow-[6px_6px_0px_#86EF6A]' 
                      : 'bg-white border-[#86EF6A] text-[#1d1c1c] shadow-[6px_6px_0px_#86EF6A]'
                    : isDark
                      ? 'bg-[#14121b] border-white/20 text-white shadow-[6px_6px_0px_rgba(255,255,255,0.05)] hover:border-white'
                      : 'bg-white border-[#1d1c1c] text-[#1d1c1c] shadow-[6px_6px_0px_#1d1c1c]'
                }`}
              >
                
                {/* Selection checkbox */}
                <button
                  onClick={() => handleToggleSelect(idx)}
                  className="absolute top-8 left-8 text-slate-500 hover:text-white"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-wero-mint" />
                  ) : (
                    <Square className={`w-5 h-5 ${isDark ? 'text-slate-700' : 'text-slate-400'}`} />
                  )}
                </button>
 
                <div className="pl-8 space-y-5">
                  
                  {/* TOP HEADER DETAILS */}
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] border ${
                          isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-100 border-black/10 text-black'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                          isDark ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-100 text-slate-600 border-black/10'
                        }`}>
                          ⚙️ {q.type === 'numerical' ? 'Numerical' : q.type === 'assertion-reason' ? 'Assertion/Reason' : 'MCQ'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                          isDark ? 'bg-wero-pink/10 text-wero-pink border-wero-pink/15' : 'bg-rose-100 text-rose-600 border-rose-300'
                        }`}>
                          🏷️ {q.topic}
                        </span>
                      </div>

                      {/* SCORECARD METADATA LINE */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                        }`}>
                          ⭐ Score: {q.qualityScore ? `${q.qualityScore}/10` : '9.0/10'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-300'
                        }`}>
                          🎓 Bloom: {q.bloomLevel || 'Apply'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-300'
                        }`}>
                          🧠 Concept: {q.concept || 'Theory'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-300'
                        }`}>
                          📈 Conf: {q.confidenceScore ? `${Math.round(q.confidenceScore * 100)}%` : '95%'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          isDark ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-300'
                        }`}>
                          ⏱️ Time: {q.estimatedSolvingTime || 45}s
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                          isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-300'
                        }`}>
                          📊 Diff: {q.difficulty || 'medium'}
                        </span>
                      </div>
                    </div>
 
                    {/* CARD ACTIONS */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleRewriteCard(idx, q)}
                        className={`py-1 px-2.5 rounded-lg border-2 transition active:scale-95 flex items-center gap-1 ${
                          isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800 shadow-[1.5px_1.5px_0_#1d1c1c]'
                        }`}
                        title="AI Rewrite"
                      >
                        <RefreshCw className="w-3 h-3 animate-pulse" />
                        <span className="text-[9px] font-black">REWRITE</span>
                      </button>
                      <button
                        onClick={() => handleRegenerateCard(idx, q.topic)}
                        className={`p-2 rounded-lg border-2 transition active:scale-95 ${
                          isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:border-white' : 'bg-white border-[#1d1c1c] text-black shadow-[2.5px_2.5px_0_#1d1c1c]'
                        }`}
                        title="Regenerate"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateCard(idx)}
                        className={`p-2 rounded-lg border-2 transition active:scale-95 ${
                          isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:border-white' : 'bg-white border-[#1d1c1c] text-black shadow-[2.5px_2.5px_0_#1d1c1c]'
                        }`}
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(isEditing ? null : idx)}
                        className={`p-2 rounded-lg border-2 transition active:scale-95 ${
                          isDark ? 'bg-white/5 border-white/10 text-[#7ED8FF] hover:border-white' : 'bg-white border-[#1d1c1c] text-black shadow-[2.5px_2.5px_0_#1d1c1c]'
                        }`}
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(idx)}
                        className={`p-2 rounded-lg border-2 transition active:scale-95 ${
                          isDark ? 'bg-[#14121b] border-white text-rose-400 shadow-[2.5px_2.5px_0_#FFF]' : 'bg-[#F96C99]/10 border-[#1d1c1c] text-[#1d1c1c] shadow-[2.5px_2.5px_0_#1d1c1c]'
                        }`}
                        title="Reject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
 
                  {/* EDIT INTERFACE */}
                  {isEditing ? (
                    <EditCardForm 
                      q={q} 
                      onSave={(updated) => handleSaveEdit(idx, updated)}
                      onCancel={() => setEditingIndex(null)}
                      isDark={isDark}
                    />
                  ) : (
                    /* VIEW INTERFACE */
                    <div className="space-y-4">
                      
                      <h4 className={`text-base font-extrabold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.questionText}</h4>
 
                      {/* OPTIONS LIST */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = opt === q.correctAnswer;
                          return (
                            <div 
                              key={optIdx} 
                              className={`p-3 rounded-xl text-xs font-semibold border-2 flex items-center justify-between ${
                                isCorrect 
                                  ? 'bg-wero-mint/10 border-wero-mint text-wero-mint shadow-sm' 
                                  : isDark ? 'bg-[#0d0b12] border-white/10 text-slate-400' : 'bg-slate-50 border-black/10 text-slate-700'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-wero-mint" />}
                            </div>
                          );
                        })}
                      </div>
 
                      {/* EXPLANATION */}
                      {q.explanation && (
                        <div className={`p-3 border-2 rounded-xl text-[10px] leading-relaxed font-semibold ${
                          isDark ? 'bg-[#0d0b12] border-white/10 text-slate-500' : 'bg-slate-100 border-black/10 text-slate-600'
                        }`}>
                          💡 Explanation: {q.explanation}
                        </div>
                      )}
 
                    </div>
                  )}
 
                </div>
              </div>
            );
          })
        )}
 
      </section>
 
    </div>
  );
};
 
// CHILD INNER FORM COMPONENT FOR LIVE EDITS
const EditCardForm = ({ q, onSave, onCancel, isDark }) => {
  const [questionText, setQuestionText] = useState(q.questionText);
  const [options, setOptions] = useState([...q.options]);
  const [correctAnswer, setCorrectAnswer] = useState(q.correctAnswer);
  const [explanation, setExplanation] = useState(q.explanation);
 
  const handleOptionChange = (idx, val) => {
    const list = [...options];
    list[idx] = val;
    setOptions(list);
  };
 
  const handleSave = () => {
    onSave({
      ...q,
      questionText,
      options,
      correctAnswer,
      explanation
    });
  };
 
  return (
    <div className="space-y-4 pt-2">
      <div>
        <label className={`block text-[10px] font-black uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Question Text</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className={`w-full py-2.5 px-3.5 rounded-xl border-2 transition text-xs font-bold outline-none ${
            isDark 
              ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' 
              : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
          }`}
        />
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt, idx) => (
          <div key={idx}>
            <label className={`block text-[9px] font-black uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Option {String.fromCharCode(65 + idx)}</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className={`w-full py-2.5 px-3.5 rounded-xl border-2 transition text-xs font-bold outline-none ${
                isDark 
                  ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' 
                  : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
              }`}
            />
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-[10px] font-black uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className={`w-full py-2.5 px-3 rounded-xl border-2 transition text-xs font-bold outline-none cursor-pointer ${
              isDark 
                ? 'bg-[#14121b] border-white/20 text-white' 
                : 'bg-slate-50 border-black/20 text-black'
            }`}
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt} className={isDark ? 'bg-[#14121b] text-white' : 'bg-white text-black'}>
                {opt || `Option ${String.fromCharCode(65 + idx)}`}
              </option>
            ))}
          </select>
        </div>
 
        <div>
          <label className={`block text-[10px] font-black uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>Explanation</label>
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className={`w-full py-2.5 px-3.5 rounded-xl border-2 transition text-xs font-bold outline-none ${
              isDark 
                ? 'bg-black/40 border-white/20 focus:border-[#86EF6A] text-white' 
                : 'bg-slate-50 border-black/20 focus:border-purple-600 text-black'
            }`}
          />
        </div>
      </div>
 
      <div className="flex gap-2 justify-end pt-3">
        <button
          type="button"
          onClick={onCancel}
          className={`py-2 px-4 rounded-lg border-2 font-black uppercase text-[10px] transition active:scale-95 ${
            isDark 
              ? 'bg-slate-800 border-white/10 text-slate-400' 
              : 'bg-white border-black text-black shadow-[2px_2px_0_#000]'
          }`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`py-2 px-4 rounded-lg border-2 font-black uppercase text-[10px] transition active:scale-95 ${
            isDark 
              ? 'bg-wero-pink border-white/10 text-white shadow-[2px_2px_0_#fff]' 
              : 'bg-[#86EF6A] border-black text-black shadow-[2px_2px_0_#000]'
          }`}
        >
          Save Changes
        </button>
      </div>
 
    </div>
  );
};
 
export default AIReviewPanel;
