import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Target } from 'lucide-react';

export const StorySection = () => {
  return (
    <section className="container py-32 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[160px] rounded-full -z-10"></div>
      
      <div className="grid md:grid-cols-2 gap-24 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-400 mb-6">The Origin</div>
          <h2 className="text-5xl md:text-6xl font-black mb-10 leading-[1.1] tracking-tighter">My Preparation <br /><span className="gradient-text">Architected.</span></h2>
          <div className="space-y-8 text-lg text-slate-400 leading-relaxed font-light">
            <p>
              When I began my journey, the ecosystem was a chaotic void of information. I spent a year distilling the silence from the noise, focusing on the elite concepts that define the top 1% of engineers.
            </p>
            <p>
              This platform isn't just a list—it's a curated neural map of everything I learned. From advanced closures to low-level system design, every question is a battle-tested insight designed to save you a thousand hours.
            </p>
            <div className="grid grid-cols-1 gap-6 pt-6">
              <div className="flex gap-6 items-start p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Target size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Precision Curriculum</h4>
                  <p className="text-sm text-slate-500">Only the elite challenges encountered at Tier-1 tech giants.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Star size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Architectural Insights</h4>
                  <p className="text-sm text-slate-500">Understand the 'why' behind the design, not just the syntax.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass p-12 relative overflow-hidden group border-white/10"
        >
          <div className="absolute -bottom-24 -right-24 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
            <CheckCircle2 size={300} strokeWidth={1} />
          </div>
          <div className="flex items-center gap-4 mb-12">
             <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white">
                <CheckCircle2 size={24} />
             </div>
             <h3 className="text-3xl font-black tracking-tight">Success Record</h3>
          </div>
          <ul className="space-y-8">
            <li className="flex justify-between items-end border-b border-white/5 pb-6 group/item">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">Impact</p>
                <span className="text-slate-300 font-medium text-lg">Elite Offers Secured</span>
              </div>
              <span className="text-4xl font-extrabold gradient-text tracking-tighter">12+</span>
            </li>
            <li className="flex justify-between items-end border-b border-white/5 pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">Effort</p>
                <span className="text-slate-300 font-medium text-lg">Deep Preparation</span>
              </div>
              <span className="text-4xl font-extrabold gradient-text tracking-tighter">4 Mo.</span>
            </li>
            <li className="flex justify-between items-end border-b border-white/5 pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">Scope</p>
                <span className="text-slate-300 font-medium text-lg">Curated Artifacts</span>
              </div>
              <span className="text-4xl font-extrabold gradient-text tracking-tighter">150+</span>
            </li>
            <li className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">Assurance</p>
                <span className="text-slate-300 font-medium text-lg">Systematic Confidence</span>
              </div>
              <span className="text-4xl font-extrabold gradient-text tracking-tighter">100%</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

