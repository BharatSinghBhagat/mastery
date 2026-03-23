import React, { useState } from 'react';
import { ThumbsUp, MapPin, ChevronDown, ChevronUp, CheckCircle, Clock, Terminal, StickyNote } from 'lucide-react';
import { likeQuestion, markAsAsked, updateProgress } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { NotesPanel } from './NotesPanel';

export const QuestionCard = ({ question, role, onRefresh, index }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await likeQuestion(question.id);
    onRefresh();
  };

  const handleMarkAsAsked = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsAsked(question.id);
    onRefresh();
  };

  const setStatus = async (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdating(true);
    try {
      await updateProgress(question.id, status);
      onRefresh();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`glass p-5 lg:p-8 group cursor-pointer transition-all duration-500 relative overflow-hidden ${isExpanded ? 'bg-white/[0.05] border-white/20' : 'hover:scale-[1.01] hover:bg-white/[0.04] hover:border-white/10'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Accent glow on hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
            {question.category}
          </div>
          {question.user_status === 'completed' && (
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle size={12} fill="currentColor" className="opacity-20" /> Mastered
            </div>
          )}
          {question.user_status === 'revision' && (
            <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
              <Clock size={12} fill="currentColor" className="opacity-20" /> Revision
            </div>
          )}
        </div>
        <div className="flex gap-6">
           <button onClick={handleLike} className="flex items-center gap-2 group/btn" title="Like this insight">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${question.has_liked ? 'bg-indigo-500/20 text-indigo-400 scale-110' : 'bg-white/5 text-slate-500 group-hover/btn:text-indigo-400 group-hover/btn:bg-indigo-500/10'}`}>
                <ThumbsUp size={14} fill={question.has_liked ? 'currentColor' : 'none'} />
             </div>
             <span className={`text-xs font-bold transition-colors ${question.has_liked ? 'text-indigo-400' : 'text-slate-600 group-hover/btn:text-indigo-400'}`}>{question.likes}</span>
           </button>
           <button onClick={handleMarkAsAsked} className="flex items-center gap-2 group/btn" title="Marked as Asked in Interviews">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${question.has_asked ? 'bg-rose-500/20 text-rose-400 scale-110' : 'bg-white/5 text-slate-500 group-hover/btn:text-rose-400 group-hover/btn:bg-rose-500/10'}`}>
                <MapPin size={14} fill={question.has_asked ? 'currentColor' : 'none'} />
             </div>
             <span className={`text-xs font-bold transition-colors ${question.has_asked ? 'text-rose-400' : 'text-slate-600 group-hover/btn:text-rose-400'}`}>{question.asked_count}</span>
           </button>
        </div>
      </div>

      <h3 className="text-lg lg:text-2xl font-bold mb-4 leading-snug group-hover:text-white transition-colors tracking-tight">
        {question.question}
      </h3>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6 lg:mt-10">
        <div className="flex flex-wrap gap-2">
           <button 
             disabled={updating}
             onClick={(e) => setStatus(question.user_status === 'completed' ? 'todo' : 'completed', e)}
             className={`h-9 lg:h-11 px-4 lg:px-5 rounded-xl flex items-center gap-2 border font-bold text-xs transition-all ${question.user_status === 'completed' ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'}`}
           >
             <CheckCircle size={14} /> Mark Mastered
           </button>
           <button 
             disabled={updating}
             onClick={(e) => setStatus(question.user_status === 'revision' ? 'todo' : 'revision', e)}
             className={`h-9 lg:h-11 px-4 lg:px-5 rounded-xl flex items-center gap-2 border font-bold text-xs transition-all ${question.user_status === 'revision' ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-rose-500/30 hover:text-rose-400'}`}
           >
             <Clock size={14} /> Set Revision
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); setShowNotes(v => !v); }}
             className={`h-9 lg:h-11 px-4 lg:px-5 rounded-xl flex items-center gap-2 border font-bold text-xs transition-all ${showNotes ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/5 text-slate-400 hover:border-amber-500/30 hover:text-amber-400'}`}
           >
             <StickyNote size={14} /> My Notes
           </button>
        </div>
        <button className={`flex items-center gap-2 text-xs lg:text-sm font-bold transition-all self-start sm:self-auto ${isExpanded ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-300'}`}>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {isExpanded ? 'Collapse' : 'Reveal Solution'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pt-8 mt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-indigo-400/60 mb-2">
                 <Terminal size={12} /> Solution Architecture
              </div>
              <div className="text-base lg:text-lg text-slate-300 leading-relaxed font-light whitespace-pre-wrap selection:bg-indigo-500/30">
                {question.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Panel — fixed height, does not expand card */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NotesPanel questionId={question.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


