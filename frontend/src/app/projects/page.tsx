'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { CheckCircle2, Circle, Clock, Trash2, Plus, ArrowLeft } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
}

// выносим основную логику в отдельный компонент
function ProjectBoard() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // плучаем ID из URL: ?id=123
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (id) {
      apiFetch(`/projects/${id}/tasks`).then(setTasks).catch(console.error);
    }
  }, [id]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !id) return;
    try {
      const task = await apiFetch(`/projects/${id}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title: newTaskTitle })
      });
      setTasks([...tasks, task]);
      setNewTaskTitle('');
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    try {
      await apiFetch(`/projects/${id}/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiFetch(`/projects/${id}/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-300 font-sans p-8">
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Назад в Дашборд
        </button>

        <h1 className="text-3xl font-black text-white mb-8 border-b border-slate-800 pb-4">Задачи проекта</h1>

        <form onSubmit={addTask} className="flex gap-4 mb-8">
          <input 
            type="text" placeholder="Что нужно сделать?" 
            className="flex-1 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} 
          />
          <button className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-500 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Добавить
          </button>
        </form>

        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between bg-slate-900/40 p-5 rounded-xl border border-slate-800 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4">
                <button onClick={() => updateStatus(task.id, task.status)} className="focus:outline-none transition-transform hover:scale-110">
                  {task.status === 'TODO' && <Circle className="text-slate-500 w-6 h-6" />}
                  {task.status === 'IN_PROGRESS' && <Clock className="text-yellow-500 w-6 h-6" />}
                  {task.status === 'DONE' && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                </button>
                <span className={`text-lg ${task.status === 'DONE' ? 'line-through text-slate-600' : 'text-white'}`}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// оборачиваем в Suspense для успешной статической выгрузки
export default function ProjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E1117] flex items-center justify-center text-blue-500">Загрузка...</div>}>
      <ProjectBoard />
    </Suspense>
  );
}