import { useState } from 'react';
import { Eye, EyeOff, ChevronLeft, Mail, Lock } from 'lucide-react';
import { SnowflakesBackground } from './SnowflakesBackground';
import { SafeddaraLogo } from './SafeddaraLogo';

interface Step2Props {
  onNext: (email: string, password: string) => void;
}

export function Step2({ onNext }: Step2Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext(email.trim(), password);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValid = isValidEmail(email) && password.length >= 8;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #8EA3FE 29.81%, #71BCF0 70.19%)' }}>
      {/* Snowflakes Background */}
      <SnowflakesBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Card with glass effect */}
          <div className="bg-white/15 backdrop-blur-xl rounded-[32px] px-7 pt-10 pb-12 shadow-2xl relative">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="absolute left-6 top-6 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-6 mt-6">
              <SafeddaraLogo />
            </div>

            {/* Title */}
            <h1 className="text-center text-white text-[26px] font-bold mb-1 tracking-tight">
              Email и пароль
            </h1>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-[1px] w-8 bg-white/40"></div>
              <p className="text-center text-white/70 text-sm">
                Шаг 2 из 2
              </p>
              <div className="h-[1px] w-8 bg-white/40"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-white text-xs font-medium mb-2.5 pl-1">
                  Email адрес
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] text-white text-[15px] placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-[3px] focus:ring-white/15 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white text-xs font-medium mb-2.5 pl-1">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Минимум 8 символов"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] text-white text-[15px] placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-[3px] focus:ring-white/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-white/85 hover:bg-white/95 text-[#6B7CF5] font-bold text-[15px] py-3.5 rounded-[20px] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white/85 mt-7 flex items-center justify-center gap-2"
              >
                Продолжить
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              {/* Footer */}
              <p className="text-center text-[11px] text-white/60 mt-5 leading-[1.5] px-2">
                Нажимая "Продолжить", вы соглашаетесь с{' '}
                <span className="text-white/90 font-medium underline underline-offset-2">условиями использования</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}