import React, { useRef, useEffect } from 'react';
import { Bell, Clock, ChevronRight, BookCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RevisionReminderProps {
  questions: any[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onGoToRevision: () => void;
}

export const RevisionReminder = ({
  questions,
  open,
  onToggle,
  onClose,
  onGoToRevision,
}: RevisionReminderProps) => {
  const revisionList = questions.filter(q => q.user_status === 'revision');
  const count = revisionList.length;
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const categoryColors: Record<string, string> = {
    Angular: 'text-rose-400 bg-rose-500/10',
    JavaScript: 'text-amber-400 bg-amber-500/10',
    TypeScript: 'text-blue-400 bg-blue-500/10',
    React: 'text-cyan-400 bg-cyan-500/10',
    'Node.js': 'text-emerald-400 bg-emerald-500/10',
    default: 'text-indigo-400 bg-indigo-500/10',
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={onToggle}
        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all relative ${
          open
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'
        }`}
      >
        <Bell size={17} className={open ? '' : 'group-hover:animate-pulse'} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-80 bg-[#0e0e1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-rose-400" />
                <span className="text-xs font-black uppercase tracking-widest text-rose-400">
                  Revision Queue
                </span>
              </div>
              {count > 0 && (
                <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                  {count} pending
                </span>
              )}
            </div>

            {/* Body */}
            <div className="max-h-72 overflow-y-auto">
              {count === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 px-5 text-center">
                  <BookCheck size={32} className="text-emerald-500/40" />
                  <p className="text-sm font-bold text-slate-400">All clear!</p>
                  <p className="text-xs text-slate-600">
                    No questions are currently flagged for revision. Keep it up!
                  </p>
                </div>
              ) : (
                <ul>
                  {revisionList.map((q, i) => {
                    const colorClass = categoryColors[q.category] || categoryColors.default;
                    return (
                      <li
                        key={q.id}
                        className={`px-5 py-3.5 flex items-start gap-3 hover:bg-white/[0.03] transition-colors ${
                          i !== revisionList.length - 1 ? 'border-b border-white/5' : ''
                        }`}
                      >
                        <span
                          className={`mt-0.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shrink-0 ${colorClass}`}
                        >
                          {q.category}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {q.question}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer CTA */}
            {count > 0 && (
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={() => { onGoToRevision(); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all"
                >
                  <Clock size={13} /> Start Revision Session
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
