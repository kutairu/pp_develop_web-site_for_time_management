'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { Terminal } from 'lucide-react';

const BACKGROUND_CODE = "01001100 function init() { return true; } 10110001 import { data } from 'module'; 01101111 const server = new Server(); 10001010 if (status === 200) { connect(); } 01010101 ".repeat(80);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1117] flex items-center justify-center relative overflow-hidden p-4 font-sans text-slate-300">
      {/*декоративный фон с кодом*/}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-[0.10] text-blue-500 font-mono text-sm leading-relaxed break-all p-4">
        {BACKGROUND_CODE}
      </div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/*лого*/}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-lg">
              <Terminal className="text-blue-400 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Project<span className="text-blue-500">Hub</span>
            </h1>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center text-white">Вход в систему</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-mono text-slate-400 mb-2">Email адрес</label>
            <input 
              type="email" required
              className="w-full p-4 bg-black/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-slate-400 mb-2">Пароль</label>
            <input 
              type="password" required
              className="w-full p-4 bg-black/50 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-0.5 transition-all mt-2">
            Войти
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-mono">
          Нет аккаунта? <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition-colors">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}