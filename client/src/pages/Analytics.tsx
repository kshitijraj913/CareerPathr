import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  if (!data) return null;

  const categoryData = Object.entries(data.categoryStats).map(([name, v]) => ({ name, completed: v.completed, total: v.total }));
  const taskStatusData = [
    { name: 'Todo', value: data.todoTasks },
    { name: 'In Progress', value: data.inProgressTasks },
    { name: 'Completed', value: data.completedTasks },
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="page-title">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Goals', value: data.totalGoals, color: 'text-blue-600' },
          { label: 'Completed Goals', value: data.completedGoals, color: 'text-green-600' },
          { label: 'Total Tasks', value: data.totalTasks, color: 'text-purple-600' },
          { label: 'Task Completion', value: `${data.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0}%`, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray={`${data.overallProgress * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{data.overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Status */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h2>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {taskStatusData.map((_, i) => <Cell key={i} fill={['#94a3b8', '#3b82f6', '#10b981'][i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">No tasks yet</p>
          )}
        </div>
      </div>

      {/* Category Progress */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Goals by Category</h2>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#e2e8f0" name="Total" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-8">No goals yet</p>
        )}
      </div>
    </div>
  );
}
