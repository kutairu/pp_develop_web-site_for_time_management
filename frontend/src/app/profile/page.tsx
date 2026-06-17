'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import Navbar from '../../components/Navbar';
import { User, Mail, Shield, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiFetch('/auth/me').then(data => {
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
      });
      setMessage('Данные успешно сохранены!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-300">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-black text-white mb-8 border-b border-slate-800 pb-4">Личный кабинет</h2>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800/50">
            <div className="bg-blue-600/20 p-6 rounded-full border border-blue-500/30">
              <User className="text-blue-400 w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{user?.name || 'Загрузка...'}</h3>
              <div className="flex gap-2 mt-2">
                <span className="bg-slate-800 text-slate-300 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-1 border border-slate-700">
                  <Shield className="w-3 h-3" /> {user?.role === 'USER' ? 'Разработчик' : user?.role}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-mono text-slate-400 mb-2">
                <User className="w-4 h-4" /> Имя пользователя
              </label>
              <input 
                type="text" required
                className="w-full p-4 bg-black/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                value={name} onChange={e => setName(e.target.value)} 
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-mono text-slate-400 mb-2">
                <Mail className="w-4 h-4" /> Email адрес
              </label>
              <input 
                type="email" required
                className="w-full p-4 bg-black/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                value={email} onChange={e => setEmail(e.target.value)} 
              />
            </div>

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 font-medium">
                <CheckCircle className="w-5 h-5" /> {message}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-blue-500 transition-all font-semibold flex items-center gap-2 w-full justify-center">
                <Save className="w-5 h-5" />
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}