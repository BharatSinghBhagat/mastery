import React, { useEffect, useState } from 'react';
import { getUsers, approveUser, deleteUser } from '../api';
import { UserCheck, UserX, Clock, Shield, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminApproval = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveUser(id);
      setMessage('User approved successfully!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setMessage('User deleted successfully!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm tracking-wide"
          >
            <CheckCircle size={18} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {users.map((u) => (
          <motion.div 
            layout
            key={u.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-5 flex items-center justify-between group relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                u.is_approved ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                {u.role === 'admin' ? <Shield size={20} /> : <UserCheck size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-200">{u.username}</h3>
                  <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border ${
                    u.role === 'admin' ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-white/5 text-slate-500'
                  }`}>
                    {u.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {!u.is_approved ? (
                    <span className="flex items-center gap-1 text-amber-400/70 text-[10px] font-bold uppercase tracking-wider">
                      <Clock size={10} /> Pending Approval
                    </span>
                  ) : (
                    <span className="text-emerald-400/70 text-[10px] font-bold uppercase tracking-wider">Active Member</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!u.is_approved && (
                <button 
                  onClick={() => handleApprove(u.id)}
                  className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-all shadow-lg"
                  title="Approve User"
                >
                  <UserCheck size={18} />
                </button>
              )}
              <button 
                onClick={() => handleDelete(u.id)}
                className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                title="Delete User"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-10 glass border-dashed">
            <p className="text-slate-500 text-sm font-medium">No apprentices found in the nexus.</p>
          </div>
        )}
      </div>
    </div>
  );
};
