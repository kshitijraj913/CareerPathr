import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Goal, Milestone, Task } from '../types';
import { ArrowLeft, Plus, Trash2, Edit2, CheckCircle, Clock, Loader2 } from 'lucide-react';

export default function GoalDetail() {
  const { id } = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMsForm, setShowMsForm] = useState(false);
  const [editingMs, setEditingMs] = useState<Milestone | null>(null);
  const [msForm, setMsForm] = useState({ title: '', description: '', deadline: '', status: 'Not Started' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Todo', milestoneId: '' });

  const load = async () => {
    if (!id) return;
    try {
      const [g, ms, ts] = await Promise.all([api.getGoal(id), api.getMilestones(id), api.getTasks({ goalId: id })]);
      setGoal(g); setMilestones(ms); setTasks(ts);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const handleMsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (editingMs) { await api.updateMilestone(editingMs._id, msForm); }
    else { await api.createMilestone(id, msForm); }
    setMsForm({ title: '', description: '', deadline: '', status: 'Not Started' });
    setEditingMs(null); setShowMsForm(false); load();
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createTask({ ...taskForm, goalId: id });
    setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Todo', milestoneId: '' });
    setShowTaskForm(false); load();
  };

  const handleMsComplete = async (ms: Milestone) => {
    await api.updateMilestone(ms._id, { status: 'Completed', progress: 100 });
    load();
  };

  const handleTaskComplete = async (t: Task) => {
    await api.updateTask(t._id, { status: 'Completed' });
    load();
  };

  const handleTaskDelete = async (t: Task) => {
    await api.deleteTask(t._id);
    load();
  };

  const handleMsDelete = async (ms: Milestone) => {
    if (confirm('Delete this milestone and its tasks?')) {
      await api.deleteMilestone(ms._id);
      load();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  if (!goal) return <div className="text-center py-16 text-gray-500">Goal not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/goals" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Goals
      </Link>

      {/* Goal Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{goal.title}</h1>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{goal.category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${goal.priority === 'High' ? 'bg-red-100 text-red-700' : goal.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{goal.priority}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${goal.status === 'Completed' ? 'bg-green-100 text-green-700' : goal.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{goal.status}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-600">{goal.progress}%</span>
          </div>
        </div>
        {goal.description && <p className="text-gray-600 mb-4">{goal.description}</p>}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-primary-600 h-3 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          {goal.startDate && <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>}
          {goal.targetDate && <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>}
        </div>
      </div>

      {/* Milestones */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Milestones ({milestones.length})</h2>
          <button onClick={() => { setMsForm({ title: '', description: '', deadline: '', status: 'Not Started' }); setEditingMs(null); setShowMsForm(true); }} className="btn-primary text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Milestone
          </button>
        </div>

        {showMsForm && (
          <form onSubmit={handleMsSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <input className="input" placeholder="Milestone title" value={msForm.title} onChange={e => setMsForm(f => ({ ...f, title: e.target.value }))} required />
            <textarea className="input" rows={2} placeholder="Description" value={msForm.description} onChange={e => setMsForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex gap-3">
              <input type="date" className="input flex-1" value={msForm.deadline} onChange={e => setMsForm(f => ({ ...f, deadline: e.target.value }))} />
              <select className="input w-auto" value={msForm.status} onChange={e => setMsForm(f => ({ ...f, status: e.target.value }))}>
                {['Not Started', 'In Progress', 'Completed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">{editingMs ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => { setShowMsForm(false); setEditingMs(null); }} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}

        {milestones.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No milestones yet. Break your goal into smaller steps!</p>
        ) : (
          <div className="space-y-3">
            {milestones.map(ms => (
              <div key={ms._id} className={`flex items-center gap-3 p-3 rounded-lg border ${ms.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <CheckCircle className={`w-5 h-5 flex-shrink-0 ${ms.status === 'Completed' ? 'text-green-500' : 'text-gray-300'}`} />
                <div className="flex-1">
                  <p className={`font-medium ${ms.status === 'Completed' ? 'text-green-700 line-through' : 'text-gray-900'}`}>{ms.title}</p>
                  {ms.deadline && <p className="text-xs text-gray-500">Due: {new Date(ms.deadline).toLocaleDateString()}</p>}
                </div>
                <div className="flex gap-1">
                  {ms.status !== 'Completed' && <button onClick={() => handleMsComplete(ms)} className="p-1 rounded hover:bg-green-100"><CheckCircle className="w-4 h-4 text-green-500" /></button>}
                  <button onClick={() => { setMsForm({ title: ms.title, description: ms.description, deadline: ms.deadline?.split('T')[0] || '', status: ms.status }); setEditingMs(ms); setShowMsForm(true); }} className="p-1 rounded hover:bg-gray-200"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => handleMsDelete(ms)} className="p-1 rounded hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks ({tasks.length})</h2>
          <button onClick={() => { setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Todo', milestoneId: '' }); setShowTaskForm(true); }} className="btn-primary text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>

        {showTaskForm && (
          <form onSubmit={handleTaskSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <input className="input" placeholder="Task title" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} required />
            <textarea className="input" rows={2} placeholder="Description" value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex gap-3">
              <input type="date" className="input flex-1" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} />
              <select className="input w-auto" value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}>
                {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
              </select>
              {milestones.length > 0 && (
                <select className="input w-auto" value={taskForm.milestoneId} onChange={e => setTaskForm(f => ({ ...f, milestoneId: e.target.value }))}>
                  <option value="">No milestone</option>
                  {milestones.map(ms => <option key={ms._id} value={ms._id}>{ms.title}</option>)}
                </select>
              )}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Add</button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}

        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No tasks yet</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t._id} className={`flex items-center gap-3 p-3 rounded-lg ${t.status === 'Completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                <CheckCircle className={`w-5 h-5 flex-shrink-0 cursor-pointer ${t.status === 'Completed' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`} onClick={() => t.status !== 'Completed' && handleTaskComplete(t)} />
                <div className="flex-1">
                  <p className={`text-sm ${t.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>{t.title}</p>
                  <div className="flex gap-2 mt-0.5">
                    {t.dueDate && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(t.dueDate).toLocaleDateString()}</span>}
                    <span className={`text-xs px-1.5 py-0 rounded ${t.priority === 'High' ? 'text-red-600' : t.priority === 'Medium' ? 'text-amber-600' : 'text-gray-400'}`}>{t.priority}</span>
                  </div>
                </div>
                <button onClick={() => handleTaskDelete(t)} className="p-1 rounded hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
