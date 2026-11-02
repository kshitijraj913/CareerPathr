import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Goal } from '../types';
import { Target, Plus, Loader2, Trash2, Edit2, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Career', 'Academic', 'Coding', 'Internship', 'Placement', 'Skills', 'Personal'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'Personal', priority: 'Medium', startDate: '', targetDate: '', status: 'Not Started' });
  const [filter, setFilter] = useState({ status: 'All', category: 'All' });

  const load = () => { api.getGoals().then(setGoals).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ title: '', description: '', category: 'Personal', priority: 'Medium', startDate: '', targetDate: '', status: 'Not Started' }); setEditingGoal(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      await api.updateGoal(editingGoal._id, form);
    } else {
      await api.createGoal(form);
    }
    resetForm();
    load();
  };

  const handleEdit = (g: Goal) => {
    setForm({ title: g.title, description: g.description, category: g.category, priority: g.priority, startDate: g.startDate?.split('T')[0] || '', targetDate: g.targetDate?.split('T')[0] || '', status: g.status });
    setEditingGoal(g);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this goal and all its milestones/tasks?')) {
      await api.deleteGoal(id);
      load();
    }
  };

  const handleComplete = async (g: Goal) => {
    await api.updateGoal(g._id, { status: 'Completed', progress: 100 });
    load();
  };

  const filtered = goals.filter(g => (filter.status === 'All' || g.status === filter.status) && (filter.category === 'All' || g.category === filter.category));

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Goals</h1>
          <p className="text-gray-500 mt-1">{goals.length} total goals</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="input w-auto">
          {['All', 'Not Started', 'In Progress', 'Completed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} className="input w-auto">
          {['All', ...CATEGORIES].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label><select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="label">Priority</label><select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Start Date</label><input type="date" className="input" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                <div><label className="label">Target Date</label><input type="date" className="input" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingGoal ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No goals found</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="text-primary-600 text-sm mt-2 hover:underline">Create your first goal</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(g => (
            <div key={g._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link to={`/goals/${g._id}`} className="font-semibold text-gray-900 hover:text-primary-600">{g.title}</Link>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{g.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${g.priority === 'High' ? 'bg-red-100 text-red-700' : g.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{g.priority}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(g)} className="p-1.5 rounded hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => handleDelete(g._id)} className="p-1.5 rounded hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  {g.status !== 'Completed' && <button onClick={() => handleComplete(g)} className="p-1.5 rounded hover:bg-green-50"><CheckCircle className="w-4 h-4 text-green-400" /></button>}
                </div>
              </div>
              {g.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{g.description}</p>}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className={`px-2 py-0.5 rounded ${g.status === 'Completed' ? 'bg-green-100 text-green-700' : g.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>{g.status}</span>
                <span>{g.progress}%</span>
              </div>
              {g.targetDate && <p className="text-xs text-gray-400 mt-2">Due: {new Date(g.targetDate).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
