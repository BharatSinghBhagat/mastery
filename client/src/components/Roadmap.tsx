import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, Rocket, Shield, Cpu, BookOpen, Code2, Layers, Zap, Globe, RefreshCcw, Edit3, Save, Plus, Trash2, Wand2 } from 'lucide-react';
import { getRoadmap, saveRoadmap, getAiRoadmap, deleteRoadmap } from '../api';

interface RoadmapStep {
  title: string;
  status: 'completed' | 'upcoming';
  items: string[];
}

interface RoadmapData {
  category: string;
  title: string;
  subtitle: string;
  steps: RoadmapStep[];
}

export const Roadmap = ({ onClose, category, isAdmin, isSuperAdmin }: { onClose: () => void; category: string; isAdmin: boolean; isSuperAdmin: boolean }) => {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<RoadmapData | null>(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRoadmap(category);
      setData(res);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setData(null); // No roadmap yet
      } else {
        setError('Failed to load the map.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [category]);

  const handleStartEdit = () => {
    setEditData(data || { category, title: `${category} Path`, subtitle: 'Custom curriculum', steps: [] });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editData) return;
    setLoading(true);
    try {
      const saved = await saveRoadmap(editData);
      setData(saved);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you absolutely sure you want to delete the ${category} roadmap? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteRoadmap(category);
      setData(null);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to delete roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    setLoading(true);
    try {
      const generated = await getAiRoadmap(category);
      setEditData({ ...generated, category });
    } catch (err) {
      alert('AI generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    if (!editData) return;
    setEditData({
      ...editData,
      steps: [...editData.steps, { title: 'New Phase', status: 'upcoming', items: ['A skill to learn'] }]
    });
  };

  const updateStep = (idx: number, field: keyof RoadmapStep, value: any) => {
    if (!editData) return;
    const newSteps = [...editData.steps];
    newSteps[idx] = { ...newSteps[idx], [field]: value };
    setEditData({ ...editData, steps: newSteps });
  };

  const removeStep = (idx: number) => {
    if (!editData) return;
    setEditData({ ...editData, steps: editData.steps.filter((_, i) => i !== idx) });
  };

  const updateItems = (idx: number, itemsString: string) => {
      updateStep(idx, 'items', itemsString.split('\n').filter(s => s.trim()));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050508]/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/[0.03]"
      >
        {/* Header */}
        <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0c0c11]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Rocket size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">
                {isEditing ? 'Architect Mode' : (data?.title || `${category} Roadmap`)}
              </h2>
              <p className="text-slate-500 font-medium text-[10px] tracking-[0.2em] uppercase">
                {isEditing ? 'Editing the Path of Discovery' : (data?.subtitle || 'Persistence Explorer')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                {isEditing ? (
                  <>
                    <button onClick={handleAiGenerate} className="hidden sm:flex items-center gap-2 btn btn-secondary h-10 px-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 border-indigo-500/20 bg-indigo-500/5">
                      <Wand2 size={14} /> AI Synthesis
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 btn btn-primary h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                      <Save size={14} /> Save Path
                    </button>
                    <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {isSuperAdmin && data && (
                        <button 
                            onClick={handleDelete}
                            className="w-10 h-10 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete Roadmap"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button onClick={handleStartEdit} className="flex items-center gap-2 btn btn-secondary h-10 px-4 text-[10px] font-black uppercase tracking-widest">
                        <Edit3 size={14} /> Edit Map
                    </button>
                  </div>
                )}
              </>
            )}
            {!isEditing && (
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-inner"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
          {loading && !isEditing ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20">
               <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
               <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest animate-pulse">Navigating the digital landscape...</p>
            </div>
          ) : isEditing && editData ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Map Title</label>
                        <input 
                            value={editData.title} 
                            onChange={e => setEditData({...editData, title: e.target.value})}
                            className="w-full bg-black/40 border border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:border-indigo-500/50 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Map Tagline</label>
                        <input 
                            value={editData.subtitle} 
                            onChange={e => setEditData({...editData, subtitle: e.target.value})}
                            className="w-full bg-black/40 border border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:border-indigo-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Voyage Milestones</h3>
                        <button onClick={addStep} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                            <Plus size={14} /> Add Step
                        </button>
                    </div>

                    {editData.steps.map((step, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-4 group">
                            <div className="flex items-center justify-between gap-4">
                                <input 
                                    value={step.title} 
                                    onChange={e => updateStep(idx, 'title', e.target.value)}
                                    placeholder="Step Title"
                                    className="flex-1 bg-transparent border-none p-0 text-lg font-black tracking-tight focus:ring-0 outline-none placeholder:text-slate-800"
                                />
                                <div className="flex items-center gap-3">
                                    <select 
                                        value={step.status}
                                        onChange={e => updateStep(idx, 'status', e.target.value)}
                                        className="bg-black/60 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest h-8 px-2 outline-none"
                                    >
                                        <option value="completed">Mastered</option>
                                        <option value="upcoming">Upcoming</option>
                                    </select>
                                    <button onClick={() => removeStep(idx)} className="text-rose-500 hover:text-rose-400 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 block">Skills to Master (one per line)</label>
                                <textarea 
                                    value={step.items.join('\n')}
                                    onChange={e => updateItems(idx, e.target.value)}
                                    placeholder="React Query&#10;Zustand&#10;Framer Motion"
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold focus:border-indigo-500/30 outline-none transition-all custom-scrollbar resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
             </motion.div>
          ) : data && data.steps.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative max-w-3xl mx-auto py-12 px-4">
              {/* Vertical connecting line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 hidden md:block"></div>
              
              <div className="space-y-24 relative">
                {data.steps.map((step, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Visual Card */}
                      <div className={`flex-1 w-full ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                        <div className={`glass p-8 rounded-[2.5rem] relative group border-white/[0.03] hover:border-indigo-500/30 transition-all duration-500
                            ${step.status === 'completed' ? 'shadow-[0_0_40px_rgba(99,102,241,0.05)]' : 'grayscale-[0.5] opacity-60'}
                        `}>
                            <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110
                                    ${step.status === 'completed' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-900 text-slate-500'}
                                `}>
                                    {step.status === 'completed' ? <Zap size={20} /> : <BookOpen size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tighter uppercase leading-none mb-1">{step.title}</h3>
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border
                                        ${step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-600 border-white/5'}
                                    `}>
                                        {step.status === 'completed' ? 'Mastered' : 'Locked'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                                {step.items.map((item, i) => (
                                    <span key={i} className="text-[10px] font-bold py-1.5 px-3 rounded-full bg-white/[0.03] border border-white/[0.05] text-slate-500 group-hover:text-slate-300 transition-colors">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                      </div>

                      {/* Line Pivot */}
                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-500
                            ${step.status === 'completed' ? 'bg-[#050508] border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'bg-slate-950 border-slate-800'}
                        `}>
                            {step.status === 'completed' ? <CheckCircle2 className="text-indigo-400" size={24} /> : <div className="w-2 h-2 rounded-full bg-slate-800 animate-pulse"></div>}
                        </div>
                      </div>

                      {/* Spacer for staggered effect */}
                      <div className="flex-1 hidden md:block"></div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-800">
                    <Layers size={48} />
                </div>
                <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase mb-2">Uncharted Territory</h3>
                    <p className="text-slate-500 font-medium text-xs max-w-xs mx-auto">No roadmap has been established for this category yet.</p>
                </div>
                {isAdmin && (
                    <button onClick={handleStartEdit} className="btn btn-primary h-12 px-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <Plus size={16} /> Forge the Path
                    </button>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-center bg-[#0c0c11]/80 backdrop-blur-md">
            <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.4em]">Integrated Discovery Engine v2.0</p>
        </div>
      </motion.div>
    </div>
  );
};



