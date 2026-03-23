import React from 'react';
import { ArrowRight, Terminal, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = ({ role, onExplore }: { role: string; onExplore: () => void }) => {
  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-24 -right-24 -z-10 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 -z-10 w-[400px] h-[400px] bg-rose-500/5 blur-[100px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-400">
            {role === 'admin' ? 'System Administrator' : 'Mastery Candidate'}
          </div>
          <div className="h-px w-12 bg-white/10"></div>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" /> 2026 Edition
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-extrabold mb-6 lg:mb-10 leading-[0.95] tracking-tighter">
          Master the <br />
          <span className="gradient-text">JS Interview.</span>
        </h1>
        
        <p className="text-lg lg:text-2xl text-slate-400 mb-8 lg:mb-12 leading-relaxed max-w-2xl font-light">
          A world-class repository of JavaScript, Angular, and React concepts—the personal journey of cracking elite tech interviews.
        </p>

        <div className="flex flex-wrap gap-6">
          <button onClick={onExplore} className="btn btn-primary text-base lg:text-xl px-7 py-4 lg:px-10 lg:py-5">
            Get Started <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary text-base lg:text-xl px-7 py-4 lg:px-10 lg:py-5 group">
            The Roadmap <Zap size={18} className="group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

        <div className="mt-10 lg:mt-20 flex flex-wrap gap-4 lg:gap-10 items-center">
          <div className="px-6 py-4 glass flex items-center gap-4 border-white/5">
             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Terminal size={24} />
             </div>
             <div>
                <p className="text-lg font-bold">500+</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Challenges</p>
             </div>
          </div>
          <div className="px-6 py-4 glass flex items-center gap-4 border-white/5">
             <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Zap size={24} />
             </div>
             <div>
                <p className="text-lg font-bold">4.9/5</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Success Rate</p>
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

