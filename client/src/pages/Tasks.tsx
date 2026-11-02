import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Task, Goal } from '../types';
import { CheckSquare, Plus, Trash2, Loader2, Clock, Filter } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Todo', goalId: '' });
  const [filterPriority, setFilterPriority] = useState('All');

  const load = async () => {
    try {
      const [ts, gs] = await Promise.all([api.getTasks(), api.getGoals()]);
      setTasks(ts); setGoals(gs);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createTask(taskForm);
    setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Todo', goalId: '' });
    setShowForm(false); load();
  };

  const handleComplete = async (t: Task) => {
    await api.updateTask(t._id, { status: t.status === 'Completed' ? 'Todo' : 'Completed' });
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) { await api.deleteTask(id); load(); }
  };

  const today = new Date().toDateString();
  const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const filtered = tasks.filter(t => {
    if (view === 'today') return t.dueDate && new Date(t.dueDate).toDateString() === today && t.status !== 'Completed';
    if (view === 'upcoming') return t.dueDate && new Date(t.dueDate) <= weekLater && t.status !== 'Completed';
    if (view === 'completed') return t.status === 'Completed';
    return true;
  }).filter(t => filterPriority === 'All' || t.priority === filterPriority);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const views = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Tasks</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {views.map(v => (
            <button key={v.key} onClick={() => setView(v.key)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === v.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {v.label}
            </button>
          ))}
        </div>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input w-auto text-sm">
          <option>All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Title *</label><input className="input" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div><label className="label">Description</label><textarea className="input" rows={2} value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Due Date</label><input type="date" className="input" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
                <div><label className="label">Priority</label><select className="input" value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}>{['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}</select></div>
              </div>
              <div><label className="label">Goal</label><select className="input" value={taskForm.goalId} onChange={e => setTaskForm(f => ({ ...f, goalId: e.target.value }))} required><option value="">Select goal</option>{goals.map(g => <option key={g._id} value={g._id}>{g.title}</option>)}</select></div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t._id} className={`card flex items-center gap-3 py-3 px-4 ${t.status === 'Completed' ? 'opacity-60' : ''}`}>
              <CheckSquare
                className={`w-5 h-5 flex-shrink-0 cursor-pointer ${t.status === 'Completed' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                onClick={() => handleComplete(t)}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${t.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>{t.title}</p>
                <div className="flex gap-3 mt-0.5">
                  {t.dueDate && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(t.dueDate).toLocaleDateString()}</span>}
                  <span className={`text-xs ${t.priority === 'High' ? 'text-red-600' : t.priority === 'Medium' ? 'text-amber-600' : 'text-gray-400'}`}>{t.priority}</span>
                  <span className={`text-xs px-1.5 rounded ${t.status === 'Completed' ? 'bg-green-100 text-green-700' : t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(t._id)} className="p-1 rounded hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
