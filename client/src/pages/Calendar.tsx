import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Task, Milestone, Goal } from '../types';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTasks(), api.getGoals()])
      .then(async ([t, g]) => {
        setTasks(t); setGoals(g);
        const allMs: Milestone[] = [];
        for (const goal of g) {
          const ms = await api.getMilestones(goal._id);
          allMs.push(...ms);
        }
        setMilestones(allMs);
      })
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prev = () => setCurrentDate(new Date(year, month - 1));
  const next = () => setCurrentDate(new Date(year, month + 1));

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day).toDateString();
    const events: { type: string; title: string; color: string }[] = [];

    tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === date).forEach(t => {
      events.push({ type: 'task', title: t.title, color: t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700' });
    });
    milestones.filter(ms => ms.deadline && new Date(ms.deadline).toDateString() === date).forEach(ms => {
      events.push({ type: 'milestone', title: ms.title, color: 'bg-purple-100 text-purple-700' });
    });
    goals.filter(g => g.targetDate && new Date(g.targetDate).toDateString() === date).forEach(g => {
      events.push({ type: 'goal', title: g.title, color: 'bg-amber-100 text-amber-700' });
    });

    return events;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="page-title">Calendar</h1>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prev} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
          <button onClick={next} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="bg-white p-2 min-h-[80px]" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            const events = getEventsForDay(day);
            return (
              <div key={day} className={`bg-white p-2 min-h-[80px] ${isToday ? 'bg-primary-50' : ''}`}>
                <span className={`text-sm font-medium ${isToday ? 'text-primary-600 font-bold' : 'text-gray-700'}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {events.slice(0, 3).map((e, j) => (
                    <div key={j} className={`text-xs px-1 py-0.5 rounded truncate ${e.color}`}>{e.title}</div>
                  ))}
                  {events.length > 3 && <div className="text-xs text-gray-400">+{events.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" /> Tasks</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-200" /> Milestones</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-200" /> Goal Deadlines</span>
      </div>
    </div>
  );
}
