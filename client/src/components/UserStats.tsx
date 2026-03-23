import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, BookOpen, Flame } from 'lucide-react';

export const UserStats = ({ questions }: { questions: any[] }) => {
  const total = questions.length;
  const completed = questions.filter(q => q.user_status === 'completed').length;
  const revision = questions.filter(q => q.user_status === 'revision').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: 'Intelligence Base', value: total, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Mastered Content', value: completed, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Strategic Revision', value: revision, icon: Flame, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { label: 'Mastery Yield', value: `${progress}%`, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-16">
      {stats.map((stat, i) => (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          key={stat.label} 
          className={`glass p-5 lg:p-8 relative overflow-hidden group hover:border-white/20 transition-all ${stat.border}`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] -z-10 translate-x-1/2 -translate-y-1/2 ${stat.bg.replace('10', '20')}`}></div>
          
          <div className="flex flex-col gap-6">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-extrabold mb-1">{stat.label}</p>
              <h3 className="text-2xl lg:text-4xl font-extrabold tracking-tighter">{stat.value}</h3>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
             <Target size={16} className="text-slate-800" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

