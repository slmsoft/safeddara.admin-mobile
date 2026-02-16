import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { getDeviceToken } from '../../api/auth';
import { SnowflakesBackground } from './registration/SnowflakesBackground';
import { SafeddaraLogo } from './registration/SafeddaraLogo';

interface LoginPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function LoginPage({ onBack, onSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(password);
      // Success - AuthContext will update isAuthenticated
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте пароль и попробуйте снова.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #8EA3FE 29.81%, #71BCF0 70.19%)' }}>
      {/* Snowflakes Background */}
      <SnowflakesBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center text-white/90 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="ml-1">Назад</span>
            </button>
          )}

          {/* Card with glass effect */}
          <div className="bg-white/15 backdrop-blur-xl rounded-[32px] px-7 pt-10 pb-12 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <SafeddaraLogo />
            </div>

            {/* Title */}
            <h1 className="text-center text-white text-[26px] font-bold mb-1 tracking-tight">
              Вход
            </h1>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-[1px] w-8 bg-white/40"></div>
              <p className="text-center text-white/70 text-sm">
                Введите пароль для входа в аккаунт
              </p>
              <div className="h-[1px] w-8 bg-white/40"></div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <div className="bg-red-500/20 border border-red-400/30 rounded-[20px] p-3">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Field */}
              <div>
                <label className="block text-white text-xs font-medium mb-2.5 pl-1">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Введите пароль"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] text-white text-[15px] placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-[3px] focus:ring-white/15 transition-all"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-white/60 pl-1">
                  Минимум 8 символов
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!password || password.length < 8 || isLoading}
                className="w-full bg-white/85 hover:bg-white/95 text-[#6B7CF5] font-bold text-[15px] py-3.5 rounded-[20px] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white/85 mt-7 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Вход...</span>
                  </>
                ) : (
                  <>
                    Войти
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="text-[11px] text-white/60 mb-4 leading-[1.5] px-2">
                Используется device token для идентификации устройства
              </p>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Нет аккаунта? <span className="font-semibold underline">Зарегистрироваться</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
