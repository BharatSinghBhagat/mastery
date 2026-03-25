import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { getQuestions } from './api';
import { Sidebar } from './components/Sidebar';
import { QuestionFeed } from './components/QuestionFeed';
import { UserStats } from './components/UserStats';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { Search, Bell, Menu, X, Zap, Users, Map } from 'lucide-react';
import { RevisionReminder } from './components/RevisionReminder';
import { AdminApproval } from './components/AdminApproval';
import { Roadmap } from './components/Roadmap';
import { DSAView } from './components/DSAView';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('all');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getQuestions(user?.id);
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, user]);

  // Close sidebar when changing category/filter on mobile
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveFilter('all');
    setDifficultyFilter('All');
    setSidebarOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setDifficultyFilter('All');
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse"></div>
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 py-4 glass bg-opacity-70 backdrop-blur-xl border-t-0 border-x-0 rounded-none">
          <div className="px-4 md:px-8 flex justify-between items-center">
            <div className="text-2xl font-black gradient-text tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              Mastery
            </div>
            <button 
              onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-indigo-400"
            >
              {authView === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </nav>
        <div className="pt-24 pb-12 px-4 md:container">
          {authView === 'login' ? (
            <Login onSwitch={() => setAuthView('register')} />
          ) : (
            <Register onSwitch={() => setAuthView('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — hidden on mobile unless open */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange}
          activeFilter={activeFilter}
          setActiveFilter={handleFilterChange}
          stats={{}}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content — full width on mobile, offset on desktop */}
      <main className="lg:pl-80 min-h-screen bg-[#050508] relative">
        {/* Sticky Header */}
        <header className="h-16 lg:h-20 px-4 lg:px-10 flex items-center justify-between sticky top-0 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 z-20">
          {/* Left: Hamburger (mobile) + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex text-[10px] uppercase font-black tracking-[0.25em] text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              {activeFilter} <span className="text-slate-700 mx-2">|</span> {activeCategory}
            </div>
          </div>

          {/* Right: Search + Bell */}
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/[0.03] border border-white/5 focus:border-indigo-500/30 w-56 lg:w-72 pl-10 h-10 text-xs rounded-xl transition-all m-0 font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <RevisionReminder
              questions={questions}
              open={notifOpen}
              onToggle={() => setNotifOpen(v => !v)}
              onClose={() => setNotifOpen(false)}
              onGoToRevision={() => {
                setActiveFilter('revision');
                setActiveCategory('All');
                setSearchQuery('');
              }}
            />

            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <div className="relative">
                <button 
                  onClick={() => setApprovalOpen(!approvalOpen)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    approvalOpen ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                  title="Apprentice Oversight"
                >
                  <Users size={20} />
                </button>
                <AnimatePresence>
                  {approvalOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setApprovalOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 z-50 glass p-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                      >
                        <div className="p-3 border-b border-white/5 mb-2 flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Apprentice Oversight</span>
                           <Users size={12} className="text-slate-600" />
                        </div>
                        <AdminApproval compact={true} />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-[1400px] mx-auto py-6 lg:py-12 px-4 lg:px-10 space-y-12 lg:space-y-20">
          {activeFilter === 'all' && activeCategory === 'All' && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Hero role={user?.role} onExplore={() => {
                const feed = document.getElementById('question-feed');
                if (feed) feed.scrollIntoView({ behavior: 'smooth' });
              }} />
              <UserStats questions={questions} />
            </motion.section>
          )}

          <section id="question-feed" className="relative scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 lg:mb-12 border-l-4 border-indigo-500/50 pl-5 lg:pl-8">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-indigo-400/70 font-black mb-2">Knowledge Stream</h4>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tighter leading-none">
                  {activeFilter === 'all' ? 'Core Library' : activeFilter === 'completed' ? 'Mastered Vault' : activeFilter === 'dsa' ? 'DSA Mastery' : 'Neural Revision'}
                </h2>
              </div>
              {user?.role === 'admin' && activeFilter !== 'admin' && activeFilter !== 'dsa' && (
                <button onClick={() => setActiveFilter('admin')} className="btn btn-primary h-12 px-6 rounded-xl text-sm self-start sm:self-auto">
                  Architect Panel
                </button>
              )}
            </div>
            {/* Difficulty filter pills */}
            {activeFilter !== 'admin' && activeFilter !== 'dsa' && (
              <div className="flex flex-wrap gap-2 mb-6 lg:mb-8">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(level => {
                  const colors: Record<string, string> = {
                    All: 'bg-white/5 border-white/10 text-slate-400 hover:text-white',
                    Beginner: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                    Intermediate: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                    Advanced: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                  };
                  const active = difficultyFilter === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level)}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all ${
                        active
                          ? colors[level] + ' ring-1 ring-current scale-105'
                          : 'bg-white/[0.02] border-white/5 text-slate-600 hover:border-white/10 hover:text-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
                {difficultyFilter !== 'All' && (
                  <span className="self-center text-[10px] text-slate-600 font-medium">
                    {questions
                      .filter(q => activeCategory === 'All' || q.category === activeCategory)
                      .filter(q => q.difficulty === difficultyFilter).length} questions
                  </span>
                )}
              </div>
            )}

            {activeFilter === 'admin' ? (
              <AdminDashboard />
            ) : activeFilter === 'dsa' ? (
              <DSAView />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                {loading ? (
                  <div className="col-span-2 flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : questions
                  .filter(q => activeCategory === 'All' || q.category === activeCategory)
                  .filter(q => {
                    if (activeFilter === 'completed') return q.user_status === 'completed';
                    if (activeFilter === 'revision') return q.user_status === 'revision';
                    return true;
                  })
                  .filter(q => difficultyFilter === 'All' || q.difficulty === difficultyFilter)
                  .filter(q => {
                    if (!searchQuery.trim()) return true;
                    const q2 = searchQuery.toLowerCase();
                    return q.question.toLowerCase().includes(q2) || q.category.toLowerCase().includes(q2);
                  })
                  .map((q, idx) => (
                    <QuestionFeed key={q.id} filterProps={{ question: q, index: idx, onRefresh: fetchAllData }} role={user?.role} />
                  ))
                }
              </div>
            )}
          </section>

          {activeFilter === 'all' && activeCategory === 'All' && <StorySection />}
        </div>

        <footer className="py-10 px-4 lg:px-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
            © 2026 JS Mastery Nexus. Developed by <span className="text-indigo-400/80">Bharat</span> 🛠️
          </p>
          <div className="flex gap-6">
            <button onClick={() => setRoadmapOpen(true)} className="hover:text-indigo-400 transition-colors uppercase tracking-widest font-bold">Roadmap</button>
            <a href="#" className="hover:text-indigo-400 transition-colors">Security</a>
          </div>
        </footer>

        <AnimatePresence>
          {roadmapOpen && (
            <Roadmap 
              onClose={() => setRoadmapOpen(false)} 
              category={activeCategory} 
              isAdmin={user?.role === 'admin' || user?.role === 'superadmin'}
              isSuperAdmin={user?.role === 'superadmin'}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
