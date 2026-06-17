'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Terminal, LogOut, Code2, Bell, Shield, User } from 'lucide-react';

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Проекты', href: '/dashboard', icon: Code2 },
    { name: 'Уведомления', href: '/notifications', icon: Bell },
    { name: 'Панель управления', href: '/admin', icon: Shield },
  ];

  return (
    <header className="bg-[#0E1117]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center py-4">
        
        {/* левая колонка: лого */}
        <div className="flex items-center gap-3 justify-start">
          <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-lg">
            <Terminal className="text-blue-400 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white hidden md:block">
            Project<span className="text-blue-500">Hub</span>
          </h1>
        </div>

        {/* центральная колонка: вкладки навигации */}
        <nav className="flex justify-center gap-1 sm:gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-2 pb-2 transition-all border-b-2 font-medium tracking-wide text-sm sm:text-base ${
                pathname === item.href 
                  ? 'text-blue-400 border-blue-500' 
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" /> 
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* правая колонка: профиль и выход */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/profile" className="flex items-center gap-3 text-right hover:opacity-80 transition-opacity cursor-pointer group">
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {user?.role || 'DEVELOPER'}
              </p>
            </div>
            <div className="bg-slate-800 p-2 rounded-full border border-slate-700 group-hover:border-blue-500 transition-colors">
              <User className="text-slate-400 w-5 h-5 group-hover:text-blue-400" />
            </div>
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}