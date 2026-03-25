import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, RotateCcw, Link, ChevronDown, ChevronUp } from 'lucide-react';
import { getDSABoard, addDSASection, addDSAQuestion, updateDSAProgress } from '../api';
import { useAuth } from '../context/AuthContext';

export const DSAView = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'revision'>('all');

  // Admin states
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [addQuestionSecId, setAddQuestionSecId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', link: '', level: 'Easy' });

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const data = await getDSABoard();
      setSections(data);
      if (data.length > 0 && !expandedSection) {
        setExpandedSection(data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    try {
      await addDSASection({ name: newSectionName });
      setNewSectionName('');
      setShowAddSection(false);
      fetchBoard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add section');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newQuestion.title.trim()) return;
    try {
      await addDSAQuestion({ section_id: sectionId, ...newQuestion });
      setNewQuestion({ title: '', link: '', level: 'Easy' });
      setAddQuestionSecId(null);
      fetchBoard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add question');
    }
  };

  const handleToggleProgress = async (qId: string, currentStatus: string, toggleTo: 'completed' | 'revision') => {
    const newStatus = currentStatus === toggleTo ? 'todo' : toggleTo;
    try {
      // Optimistic update
      setSections(prev => prev.map(sec => ({
        ...sec,
        questions: sec.questions.map((q: any) => 
          q.id === qId ? { ...q, user_status: newStatus } : q
        )
      })));
      await updateDSAProgress(qId, newStatus);
    } catch (err) {
      console.error(err);
      fetchBoard(); // Revert on failure
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Hard': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-6 mb-6 border-b border-white/5 pb-2">
        <button 
          onClick={() => setFilterMode('all')}
          className={`text-[11px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${filterMode === 'all' ? 'border-fuchsia-500 text-fuchsia-400' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/10'}`}
        >
          All Topics
        </button>
        <button 
          onClick={() => setFilterMode('completed')}
          className={`text-[11px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${filterMode === 'completed' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/10'}`}
        >
          Completed
        </button>
        <button 
          onClick={() => setFilterMode('revision')}
          className={`text-[11px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${filterMode === 'revision' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/10'}`}
        >
          Needs Revision
        </button>
      </div>
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowAddSection(!showAddSection)}
            className="btn btn-primary bg-fuchsia-600 hover:bg-fuchsia-700 shadow-[0_0_20px_rgba(192,38,211,0.3)] text-xs h-10 px-4 rounded-xl flex items-center gap-2"
          >
            <Plus size={14} /> Add Section
          </button>
        </div>
      )}

      {showAddSection && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl glass border-fuchsia-500/30 flex gap-3 items-end overflow-hidden"
          onSubmit={handleCreateSection}
        >
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Section Name (e.g. Logic, Arrays)</label>
            <input 
              type="text" 
              className="input-field w-full" 
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              placeholder="Enter section name..."
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary h-12 px-6 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl">Save</button>
        </motion.form>
      )}

      <div className="space-y-4">
        {sections.map(sec => ({
          ...sec,
          filteredQuestions: sec.questions.filter((q: any) => filterMode === 'all' ? true : q.user_status === filterMode)
        })).filter(sec => filterMode === 'all' || sec.filteredQuestions.length > 0).map(section => (
          <div key={section.id} className="glass rounded-2xl overflow-hidden border-white/5 transition-all">
            <button 
              className="w-full flex justify-between items-center p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center border border-fuchsia-500/20">
                  <span className="font-black">{section.name.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg flex-1 justify-between font-bold text-white tracking-wide">{section.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {filterMode === 'all' ? section.questions.length : section.filteredQuestions.length} {filterMode === 'all' ? 'Questions' : 'Matches'}
                    {filterMode === 'all' && (
                      <>
                        <span className="mx-2">•</span> 
                        {section.questions.filter((q: any) => q.user_status === 'completed').length} Completed
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-slate-500">
                {expandedSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 pt-2"
                >
                  <div className="space-y-2 mt-4">
                    {section.filteredQuestions.map((q: any) => (
                      <div key={q.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getLevelColor(q.level)}`}>
                              {q.level}
                            </span>
                            {q.link && (
                              <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 opacity-70 hover:opacity-100 transition-opacity" title="Solve this problem">
                                <Link size={12} />
                              </a>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-200 truncate pr-4">{q.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleToggleProgress(q.id, q.user_status, 'completed')}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                              q.user_status === 'completed' 
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                              : 'bg-white/5 border-white/5 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30'
                            }`}
                          >
                            <Check size={14} /> Done
                          </button>
                          <button 
                            onClick={() => handleToggleProgress(q.id, q.user_status, 'revision')}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                              q.user_status === 'revision' 
                              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                              : 'bg-white/5 border-white/5 text-slate-500 hover:text-rose-400 hover:border-rose-500/30'
                            }`}
                          >
                            <RotateCcw size={14} /> Revision
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {section.filteredQuestions.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                        No questions found matching this filter
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      {addQuestionSecId === section.id ? (
                        <form onSubmit={e => handleCreateQuestion(e, section.id)} className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Question Title</label>
                              <input required type="text" className="input-field w-full text-xs" value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} placeholder="e.g. Two Sum" />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Problem Link (Optional)</label>
                              <input type="url" className="input-field w-full text-xs" value={newQuestion.link} onChange={e => setNewQuestion({...newQuestion, link: e.target.value})} placeholder="https://leetcode.com/..." />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Difficulty level</label>
                              <select className="input-field w-full text-xs" value={newQuestion.level} onChange={e => setNewQuestion({...newQuestion, level: e.target.value})}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setAddQuestionSecId(null)} className="btn bg-white/5 hover:bg-white/10 text-xs px-4 h-9 rounded-lg">Cancel</button>
                            <button type="submit" className="btn btn-primary bg-fuchsia-600 hover:bg-fuchsia-700 text-xs px-4 h-9 rounded-lg">Add Question</button>
                          </div>
                        </form>
                      ) : (
                        <button 
                          onClick={() => setAddQuestionSecId(section.id)}
                          className="w-full py-3 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-fuchsia-400 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/5 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                        >
                          <Plus size={14} /> Add Question
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {sections.length === 0 && !loading && (
          <div className="text-center py-20 glass rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 mx-auto flex flex-col items-center justify-center mb-4 border border-fuchsia-500/20 shadow-[0_0_30px_rgba(192,38,211,0.2)]">
               <span className="font-extrabold text-2xl">?</span>
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-1">No DSA Sections Yet</h3>
            {isAdmin ? <p className="text-sm text-slate-500">Click "Add Section" to create your first curriculum.</p> : <p className="text-sm text-slate-500">The curriculum is currently empty.</p>}
          </div>
        )}

        {sections.length > 0 && sections.filter(sec => filterMode === 'all' || sec.questions.filter((q: any) => q.user_status === filterMode).length > 0).length === 0 && (
          <div className="text-center py-12 glass rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-slate-300 mb-1">No matches found</h3>
            <p className="text-sm text-slate-500">You don't have any questions marked as {filterMode} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
