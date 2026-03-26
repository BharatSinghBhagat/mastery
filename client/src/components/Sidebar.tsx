import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  ChevronRight,
  Zap,
  X,
  Trash2,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { deleteCurriculum, getTopics, addTopic, deleteTopic } from '../api';
import { PlusCircle } from 'lucide-react';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  stats: any;
  onClose?: () => void;
}

export const Sidebar = ({ activeCategory, setActiveCategory, activeFilter, setActiveFilter, stats, onClose }: SidebarProps) => {
  const { user, logoutUser } = useAuth();
  const [categories, setCategories] = React.useState<string[]>(['All']);
  const [showAddTopic, setShowAddTopic] = React.useState(false);
  const [newTopicName, setNewTopicName] = React.useState('');

  const fetchTopics = async () => {
    try {
      const data = await getTopics();
      const topicNames = data.map((t: any) => t.name);
      setCategories(['All', ...topicNames]);
    } catch (err) {
      console.error('Failed to fetch topics', err);
    }
  };

  React.useEffect(() => {
    fetchTopics();
  }, []);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    try {
      await addTopic(newTopicName.trim());
      setNewTopicName('');
      setShowAddTopic(false);
      fetchTopics();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add topic');
    }
  };

  const handleDeleteTopic = async (e: React.MouseEvent, cat: string) => {
    e.stopPropagation();
    if (cat === 'All') return;
    
    // First confirm deletion of curriculum
    if (!window.confirm(`DANGER: Are you sure you want to delete the entire ${cat} curriculum? This will delete ALL questions and the roadmap for this category.`)) return;
    
    try {
      await deleteCurriculum(cat); // Delete questions/roadmap
      await deleteTopic(cat);      // Delete topic entry
      setCategories(prev => prev.filter(c => c !== cat));
      if (activeCategory === cat) setActiveCategory('All');
    } catch (err) {
      alert('Failed to delete topic.');
    }
  };
  
  const NavButton = ({ id, icon: Icon, label, filterValue, colorClass }: any) => (
    <button 
      onClick={() => setActiveFilter(filterValue)}
      className={`w-full group flex items-center gap-5 px-6 py-5 rounded-2xl text-[13px] transition-all relative overflow-hidden ${activeFilter === filterValue ? `bg-white/[0.07] text-white font-bold shadow-xl` : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'}`}
    >
      <div className={`transition-all duration-300 ${activeFilter === filterValue ? colorClass : 'text-slate-600 group-hover:text-slate-400'}`}>
        <Icon size={18} strokeWidth={activeFilter === filterValue ? 2.5 : 2} />
      </div>
      <span className="tracking-wide">{label}</span>
      {activeFilter === filterValue && (
        <motion.div 
          layoutId="activeGlow"
          className={`absolute left-0 w-1.5 h-8 rounded-full ${colorClass.replace('text', 'bg')} shadow-[0_0_12px_rgba(99,102,241,0.5)]`}
        />
      )}
    </button>
  );

  return (
    <aside className="w-72 lg:w-80 h-full bg-[#09090f] border-r border-white/5 flex flex-col p-5 overflow-hidden">
      {/* Sidebar background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 -z-10 blur-[80px]"></div>

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 mb-6">
          <div className="text-2xl font-black gradient-text flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white">
               <Zap size={20} fill="currentColor" />
            </div>
            <span>Mastery</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar px-2">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-extrabold px-5 mb-4">Focus</h4>
            <NavButton id="dash" icon={LayoutDashboard} label="Intelligence" filterValue="all" colorClass="text-indigo-400" />
            <NavButton id="comp" icon={CheckCircle2} label="Mastered" filterValue="completed" colorClass="text-emerald-400" />
            <NavButton id="rev" icon={Clock} label="Revision" filterValue="revision" colorClass="text-rose-400" />
            <NavButton id="dsa" icon={Brain} label="DSA Mastery" filterValue="dsa" colorClass="text-fuchsia-400" />
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between px-5 mb-4">
               <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-extrabold">Curriculum</h4>
               {(user?.role === 'admin' || user?.role === 'superadmin') && (
                 <button 
                  onClick={() => setShowAddTopic(!showAddTopic)}
                  className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-500/20 transition-all border border-white/5"
                  title="Add New Topic"
                 >
                   <PlusCircle size={14} />
                 </button>
               )}
             </div>

             {showAddTopic && (
               <motion.form 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddTopic}
                className="px-5 mb-4 space-y-2"
               >
                 <input 
                  type="text" 
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  placeholder="Topic name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-500/50 outline-none"
                  autoFocus
                 />
                 <div className="flex gap-2">
                   <button type="submit" className="flex-1 bg-indigo-500 text-white rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-widest">Save</button>
                   <button type="button" onClick={() => setShowAddTopic(false)} className="flex-1 bg-white/5 text-slate-400 rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                 </div>
               </motion.form>
             )}

             <div className="grid grid-cols-1 gap-1">
               {categories.map(cat => (
                 <div key={cat} className="group/cat relative">
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-sm transition-all ${activeCategory === cat ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                      <span className="flex items-center gap-4">
                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeCategory === cat ? 'bg-indigo-400 scale-150 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`}></span>
                        {cat}
                      </span>
                      {activeCategory === cat && <ChevronRight size={14} className="text-indigo-400" />}
                    </button>
                    
                     {user?.role === 'superadmin' && cat !== 'All' && (
                        <button 
                         onClick={(e) => handleDeleteTopic(e, cat)}
                         className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover/cat:opacity-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                         title="Delete Entire Topic"
                        >
                          <Trash2 size={12} />
                        </button>
                     )}
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 mx-2">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-xs text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-bold border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={16} /> Secure Exit
          </button>
        </div>
      </div>
    </aside>
  );
};

