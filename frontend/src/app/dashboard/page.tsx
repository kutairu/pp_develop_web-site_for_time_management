'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { Terminal, Plus, LogOut, Clock, Code2, Trash2, Bell, Shield, User, X } from 'lucide-react';
import Navbar from '../../components/Navbar';

interface Project {
  id: string;
  title: string;
  description: string;
  priority: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

const BACKGROUND_CODE = "01001100 function init() { return true; } 10110001 import { data } from 'module'; 01101111 const server = new Server(); 10001010 if (status === 200) { connect(); } 01010101 ".repeat(80);

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  // состояния для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');

  useEffect(() => {
    // загружаем профиль пользователя
    apiFetch('/auth/me')
      .then(setCurrentUser)
      .catch(() => router.push('/login'));

    // загружаем проекты
    apiFetch('/projects')
      .then(setProjects)
      .catch(console.error);
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const newProject = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ title: newTitle, description: newDesc, priority: newPriority }),
      });
      setProjects([newProject, ...projects]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewPriority('MEDIUM');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // чтобы не было перехода внутрь проекта при клике на корзину
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;
    try {
      await apiFetch(`/projects/${projectId}`, { method: 'DELETE' });   
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-300 font-sans relative overflow-hidden">
    
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/*навигационная панель*/}
        <Navbar user={currentUser} />

        <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-white">Мои проекты</h2>
              <p className="text-slate-500 mt-2 font-mono">Всего инициализировано: {projects.length}</p>
            </div>
            {/* кнопка открытия модального окна */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-0.5 transition-all flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Создать проект
            </button>
          </div>

          {/* список проектов */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => (
              <div 
                key={p.id} 
                onClick={() => router.push(`/projects/${p.id}`)}
                className="group bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:bg-slate-900 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between h-56 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
                        p.priority === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        p.priority === 'LOW' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        Приоритет: {p.priority}
                      </span>
                    </div>
                    {/* кнопка удаления */}
                    <button 
                      onClick={(e) => handleDeleteProject(e, p.id)}
                      className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white line-clamp-1 mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 flex-1 font-mono">
                    {p.description || '// Описание не задано...'}
                  </p>
                  
                  <div className="flex items-center text-slate-600 text-sm gap-1 font-mono mt-4">
                    <Clock className="w-4 h-4" />
                    <span>Обновлено недавно</span>
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full bg-slate-900/30 border border-dashed border-slate-700 rounded-2xl p-16 text-center flex flex-col items-center backdrop-blur-sm">
                <Terminal className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">Отсутствуют активные процессы</h3>
                <p className="text-slate-500 font-mono text-sm mb-6">Инициализируйте новую рабочую среду для старта.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-slate-800 text-white px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-mono"
                >
                  &gt; создать_проект
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/*модальное окно создания проекта*/}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E1117] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl shadow-blue-900/10 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Новый проект</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-mono text-slate-400 mb-2">Название проекта *</label>
                <input 
                  type="text" required autoFocus
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={newTitle} onChange={e => setNewTitle(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-slate-400 mb-2">Описание</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                  value={newDesc} onChange={e => setNewDesc(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-slate-400 mb-2">Приоритет</label>
                <select 
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                  value={newPriority} onChange={e => setNewPriority(e.target.value)}
                >
                  <option value="LOW">Низкий</option>
                  <option value="MEDIUM">Средний</option>
                  <option value="HIGH">Высокий</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 text-slate-400 hover:text-white font-medium transition-colors">
                  Отмена
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-500 transition-all font-semibold">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}