import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Goal, Task } from '../types';
import {
  Target, CheckSquare, TrendingUp, Clock, AlertCircle,
  Loader2, ArrowRight, Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getGoals(), api.getTasks()])
      .then(([g, t]) => { setGoals(g); setTasks(t); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'In Progress').length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Completed') return false;
    const due = new Date(t.dueDate).toDateString();
    return due === new Date().toDateString();
  });
  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Completed') return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    return due > now && due <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  });
  const overallProgress = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals) : 0;

  const stats = [
    { label: 'Total Goals', value: totalGoals, icon: Target, color: 'bg-blue-500' },
    { label: 'Active Goals', value: activeGoals, icon: TrendingUp, color: 'bg-amber-500' },
    { label: 'Completed Goals', value: completedGoals, icon: CheckSquare, color: 'bg-green-500' },
    { label: 'Total Tasks', value: totalTasks, icon: CheckSquare, color: 'bg-purple-500' },
    { label: 'Tasks Done', value: completedTasks, icon: CheckSquare, color: 'bg-emerald-500' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, color: 'bg-primary-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here's your career planning overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card text-center">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks due today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map(t => (
                <div key={t._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-500' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700 flex-1">{t.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'Completed' ? 'bg-green-100 text-green-700' : t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.slice(0, 5).map(t => (
                <div key={t._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1">{t.title}</span>
                  <span className="text-xs text-gray-500">{new Date(t.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Goals */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Goals</h2>
          <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {goals.filter(g => g.status !== 'Completed').length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active goals. Create one to get started!</p>
            <Link to="/goals" className="text-primary-600 text-sm mt-2 inline-block hover:underline">Create Goal</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.filter(g => g.status !== 'Completed').slice(0, 4).map(g => (
              <Link key={g._id} to={`/goals/${g._id}`} className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{g.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{g.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${g.priority === 'High' ? 'bg-red-100 text-red-700' : g.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{g.priority}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary-600">{g.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
