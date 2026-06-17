'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import Navbar from '../../components/Navbar';
import { BellRing, Info, AlertTriangle } from 'lucide-react';

export default function NotificationsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch('/auth/me').then(setUser);
  }, []);

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-300">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-10">
          <BellRing className="text-blue-500 w-8 h-8" />
          <h2 className="text-3xl font-black text-white">Уведомления</h2>
        </div>

        <div className="space-y-4">
          {/*статичные примеры уведомлений!*/}
          {[
            { msg: 'Добро пожаловать в ProjectHub! Начните с создания проекта.', type: 'info', time: '1 час назад' },
            { msg: 'Система безопасности: выполнен вход в аккаунт.', type: 'warn', time: '2 часа назад' },
          ].map((n, i) => (
            <div key={i} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex gap-4 items-start backdrop-blur-sm">
              {n.type === 'info' ? <Info className="text-blue-400 w-6 h-6 shrink-0" /> : <AlertTriangle className="text-yellow-500 w-6 h-6 shrink-0" />}
              <div className="flex-1">
                <p className="text-white leading-relaxed">{n.msg}</p>
                <p className="text-xs text-slate-600 font-mono mt-2">{n.time}</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}