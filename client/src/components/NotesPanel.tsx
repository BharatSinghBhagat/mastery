import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotes, addNote, editNote, deleteNote } from '../api';
import { Plus, Trash2, Pencil, Check, X, StickyNote, Loader } from 'lucide-react';

interface Note {
  id: number;
  note_text: string;
  created_at: string;
  updated_at: string;
}

export const NotesPanel = ({ questionId }: { questionId: number }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchNotes = async () => {
    try {
      const data = await getNotes(questionId);
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [questionId]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setAdding(true);
    try {
      const note = await addNote(questionId, newNote);
      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setShowInput(false);
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (noteId: number) => {
    if (!editText.trim()) return;
    try {
      const updated = await editNote(noteId, editText);
      setNotes(notes.map(n => (n.id === noteId ? updated : n)));
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (noteId: number) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.note_text);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-amber-400/80">
          <StickyNote size={12} />
          My Notes {notes.length > 0 && <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px]">{notes.length}</span>}
        </div>
        <button
          onClick={() => setShowInput(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${
            showInput
              ? 'bg-white/5 border-white/10 text-slate-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          {showInput ? <X size={12} /> : <Plus size={12} />}
          {showInput ? 'Cancel' : 'Add Note'}
        </button>
      </div>

      {/* New Note Input */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-3">
              <textarea
                ref={inputRef}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAdd(); }}
                placeholder="Write your quick reminder... (Ctrl+Enter to save)"
                rows={2}
                className="w-full bg-transparent border-none text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none font-medium leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAdd}
                  disabled={adding || !newNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-all disabled:opacity-40"
                >
                  {adding ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                  Save Note
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader size={16} className="animate-spin text-slate-600" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-xs text-slate-700 text-center py-4 italic">
          No notes yet — add your first quick reminder!
        </p>
      ) : (
        <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          <AnimatePresence initial={false}>
            {notes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all"
              >
                {editingId === note.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleEdit(note.id); }}
                      rows={3}
                      autoFocus
                      className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-sm text-slate-200 resize-none focus:outline-none font-medium"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white bg-white/5 transition-all font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEdit(note.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all font-bold"
                      >
                        <Check size={11} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                        {note.note_text}
                      </p>
                      <p className="text-[10px] text-slate-700 mt-2 font-medium">
                        {note.updated_at !== note.created_at ? 'Edited ' : ''}{formatDate(note.updated_at)}
                      </p>
                    </div>
                    {/* Action buttons — appear on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
