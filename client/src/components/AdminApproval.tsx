import React, { useEffect, useState } from 'react';
import { getUsers, approveUser, deleteUser, updateUserRole } from '../api';
import { UserCheck, Clock, Shield, Trash2, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const AdminApproval = ({ compact = false }: { compact?: boolean }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const isSuper = currentUser?.role === 'superadmin';

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
      setMessage('User approved!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setMessage('User deleted!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (id: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(id, newRole);
      setMessage(`Role updated to ${newRole}`);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingCount = users.filter(u => !u.is_approved).length;

  return (
    <div className={`${compact ? 'w-80 max-h-[400px] overflow-y-auto p-2' : 'space-y-6'}`}>
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider mb-4"
          >
            <CheckCircle size={14} /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {users.map((u) => (
          <motion.div 
            layout
            key={u.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`glass ${compact ? 'p-3' : 'p-5'} flex items-center justify-between group relative overflow-hidden border-white/5`}
          >
            <div className="flex items-center gap-3">
              <div className={`${compact ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl'} flex items-center justify-center border ${
                u.is_approved ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                {u.role === 'superadmin' ? <Shield size={compact ? 14 : 18} /> : 
                 u.role === 'admin' ? <Shield size={compact ? 14 : 18} className="opacity-70" /> : 
                 <UserCheck size={compact ? 14 : 18} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-slate-200 truncate max-w-[100px]`}>{u.username}</h3>
                  <span className={`text-[8px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    u.role === 'superadmin' ? 'bg-indigo-500/20 text-indigo-400' : 
                    u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {u.role}
                  </span>
                </div>
                {!u.is_approved && (
                  <span className="flex items-center gap-1 text-amber-400/70 text-[8px] font-black uppercase tracking-wider mt-0.5">
                    <Clock size={8} /> Pending
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              {!u.is_approved && (
                <button 
                  onClick={() => handleApprove(u.id)}
                  className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-all"
                  title="Approve"
                >
                  <UserCheck size={14} />
                </button>
              )}
              
              {isSuper && u.role !== 'superadmin' && (
                <div className="flex flex-col gap-1">
                  {u.role === 'user' ? (
                    <button 
                      onClick={() => handleChangeRole(u.id, 'admin')}
                      className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-all"
                      title="Promote to Admin"
                    >
                      <ChevronUp size={14} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleChangeRole(u.id, 'user')}
                      className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center hover:bg-amber-500/20 transition-all"
                      title="Demote to User"
                    >
                      <ChevronDown size={14} />
                    </button>
                  )}
                </div>
              )}

              {u.role !== 'superadmin' && (
                <button 
                  onClick={() => handleDelete(u.id)}
                  className={`w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition-all ${compact ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-6 px-4 border border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Clear Horizons</p>
          </div>
        )}
      </div>
    </div>
  );
};

