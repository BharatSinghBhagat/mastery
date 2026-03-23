import React, { useState } from 'react';
import { addQuestion, generateAIAnswer } from '../api';
import { motion } from 'framer-motion';
import { PlusCircle, Send, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    difficulty: 'Intermediate'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateAI = async () => {
    if (!formData.question.trim()) {
      alert("Please enter a Challenge Prompt (Question) first!");
      return;
    }
    setAiLoading(true);
    try {
      const res = await generateAIAnswer(formData.question);
      setFormData(prev => ({ ...prev, answer: res.answer }));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to generate answer. Check server logs or your API key.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addQuestion(formData);
      setStatus('success');
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        difficulty: 'Intermediate'
      });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="py-6 lg:py-12 max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-6 lg:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 gradient-bg"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl">
            <PlusCircle size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-1">Architect Dashboard</h2>
            <p className="text-slate-500 font-medium">Curate the knowledge base for future masters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black ml-1">Expertise Domain</label>
              <select 
                value={formData.category}
                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-sm font-bold"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="General">General</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="React">React</option>
                <option value="Angular">Angular</option>
                <option value="Node.js">Node.js</option>
                <option value="System Design">System Design</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black ml-1">Cognitive Depth</label>
              <select 
                value={formData.difficulty}
                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-sm font-bold"
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black ml-1">Challenge Prompt</label>
            <input 
              type="text" 
              placeholder="e.g., What is a closure in JavaScript?"
              className="h-14 px-6"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black ml-1">Architectural Solution</label>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-all bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 disabled:opacity-50"
              >
                {aiLoading ? <span className="animate-spin w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full"></span> : '✨'} 
                {aiLoading ? 'Synthesizing...' : 'Generate with AI'}
              </button>
            </div>
            <textarea 
              rows={8}
              placeholder="Provide a comprehensive, high-level breakdown..."
              className="px-6 py-5"
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="btn btn-primary w-full justify-center h-16 text-xl tracking-wide group"
          >
            {status === 'success' ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-3">
                <CheckCircle size={24} className="text-emerald-400" /> Published to Nexus
              </motion.div>
            ) : status === 'loading' ? (
              <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Processing...
              </div>
            ) : (
              <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                <Send size={22} className="group-hover:rotate-12 transition-transform" /> Commit Knowledge
              </div>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
