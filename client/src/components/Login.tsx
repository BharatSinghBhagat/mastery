import React, { useState } from 'react';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = ({ onSwitch }: { onSwitch: () => void }) => {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(formData);
      loginUser(data.token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-6 lg:p-12 w-full max-w-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 gradient-bg"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

        <div className="text-center mb-10">
          <div className="bg-indigo-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-2xl">
            <LogIn className="text-indigo-400" size={36} />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black mb-2 tracking-tighter">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Continue your journey to mastery</p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-sm text-center font-bold tracking-wide animate-shake">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black ml-1">Identity</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Username" 
                className="pl-14 h-14"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black ml-1">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="pl-14 h-14"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center h-14 text-lg mt-4" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Authorize Session'}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 text-sm font-medium">
          New to the mastery? <button onClick={onSwitch} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Forge Account</button>
        </p>
      </motion.div>
    </div>
  );
};

