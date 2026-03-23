import React, { useState } from 'react';
import { register } from '../api';
import { UserPlus, User, Lock, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = ({ onSwitch }: { onSwitch: () => void }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => onSwitch(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-purple-400" size={32} />
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-slate-400">Join the community of JS masters</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl mb-6 text-sm text-center">Registration successful! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              className="pl-12"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="pl-12"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.role === 'user' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-transparent border-slate-800 text-slate-500'}`}
             >
                <User size={16} /> User
             </button>
             <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'admin'})}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.role === 'admin' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-transparent border-slate-800 text-slate-500'}`}
             >
                <Lock size={16} /> Admin
             </button>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center py-4" disabled={loading || success}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Already have an account? <button onClick={onSwitch} className="text-indigo-400 font-semibold hover:underline">Sign in</button>
        </p>
      </motion.div>
    </div>
  );
};
