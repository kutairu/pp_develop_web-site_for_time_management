'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import Navbar from '../../components/Navbar';
import { LayoutDashboard, CheckCircle, ListTodo, Activity, Plus } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch('/auth/me').then(setUser);
    apiFetch('/stats').then(setStats);
  }, []);

  const cards = [
    { title: 'Проектов', val: stats?.projectCount || 0, icon: LayoutDashboard, color: 'text-blue-400' },
    { title: 'Задач всего', val: stats?.allTasks || 0, icon: ListTodo, color: 'text-purple-400' },
    { title: 'Завершено', val: stats?.completedTasks || 0, icon: CheckCircle, color: 'text-green-400' },
    { title: 'В работе', val: stats?.inWorkTasks || 0, icon: Activity, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-300">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-black text-white mb-8">Панель управления</h2>
        
        {/* Карточки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {cards.map((c, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center backdrop-blur-sm shadow-xl">
              <div className="flex justify-center mb-4"><c.icon className={`${c.color} w-8 h-8`} /></div>
              <p className="text-4xl font-black text-white mb-2">{c.val}</p>
              <p className="text-slate-500 font-mono uppercase text-xs tracking-widest">{c.title}</p>
            </div>
          ))}
        </div>

        {/* таблица последних задач */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Последние задачи</h3>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-all font-bold text-sm">
              <Plus className="w-4 h-4" /> Новая задача
            </button>
          </div>
          
          <div className="space-y-4">
            {stats?.recentTasks?.map((task: any) => (
              <div key={task.id} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-slate-800/50">
                <div>
                  <p className="text-white font-bold">{task.title}</p>
                  <p className="text-xs text-slate-500 font-mono">Проект: {task.project.title}</p>
                </div>
                <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">{task.status}</span>
              </div>
            ))}
            {stats?.recentTasks?.length === 0 && <p className="text-center text-slate-600 py-10">Нет задач. Создайте первую!</p>}
          </div>
        </div>
      </main>
    </div>
  );
}