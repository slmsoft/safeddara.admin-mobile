import { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SafeddaraLogo } from '../registration/SafeddaraLogo';

interface AdminLoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    onLogin(username, password);
  };

  const quickLogin = (role: 'superadmin' | 'admin' | 'accountant') => {
    const credentials = {
      superadmin: { username: 'admin@safedara.tj', password: 'admin123' },
      admin: { username: 'manager@safedara.tj', password: 'manager123' },
      accountant: { username: 'accountant@safedara.tj', password: 'accountant123' }
    };
    
    const cred = credentials[role];
    setUsername(cred.username);
    setPassword(cred.password);
    onLogin(cred.username, cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 mt-5">
            <div className="w-[148px] h-[148px]">
              <SafeddaraLogo />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2">Safeddara-Admin</h1>
          <p className="text-gray-400">Войдите для доступа к панели управления</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#0d1117] border border-[#1e2537] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0f1323] border border-[#2a2f4a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="admin@safedara.tj"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-[#0f1323] border border-[#2a2f4a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2a2f4a] bg-[#0f1323] text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400">Запомнить меня</span>
              </label>
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Забыли пароль?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <LogIn className="w-5 h-5" />
              Войти
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2f4a]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1f37] text-gray-400">Или продолжить с</span>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => quickLogin('superadmin')}
              className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              🟣 Быстрый вход как Суперадмин
            </button>
            <button
              onClick={() => quickLogin('admin')}
              className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              🔵 Быстрый вход как Администратор
            </button>
            <button
              onClick={() => quickLogin('accountant')}
              className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              🟢 Быстрый вход как Бухгалтер
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2026 Safedara Resort. Все права защищены.
        </p>
      </div>
    </div>
  );
}