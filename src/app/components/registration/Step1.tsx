import { useState } from 'react';
import { User, Phone } from 'lucide-react';
import { SnowflakesBackground } from './SnowflakesBackground';
import { SafeddaraLogo } from './SafeddaraLogo';

interface Step1Props {
  onNext: (name: string, phone: string) => void;
  onSwitchToLogin?: () => void;
}

export function Step1({ onNext, onSwitchToLogin }: Step1Props) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phoneNumber.length === 9) {
      onNext(name.trim(), `+992${phoneNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) {
      setPhoneNumber(value);
    }
  };

  const isValid = name.trim().length >= 2 && phoneNumber.length === 9;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #8EA3FE 29.81%, #71BCF0 70.19%)' }}>
      {/* Snowflakes Background */}
      <SnowflakesBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Card with glass effect */}
          <div className="bg-white/15 backdrop-blur-xl rounded-[32px] px-7 pt-10 pb-12 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <SafeddaraLogo />
            </div>

            {/* Title */}
            <h1 className="text-center text-white text-[26px] font-bold mb-1 tracking-tight">
              Создать аккаунт
            </h1>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-[1px] w-8 bg-white/40"></div>
              <p className="text-center text-white/70 text-sm">
                Шаг 1 из 2
              </p>
              <div className="h-[1px] w-8 bg-white/40"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-white text-xs font-medium mb-2.5 pl-1">
                  Ваше имя
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите полное имя"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] text-white text-[15px] placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-[3px] focus:ring-white/15 transition-all"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-white text-xs font-medium mb-2.5 pl-1">
                  Номер телефона
                </label>
                <div className="flex gap-2.5">
                  <div className="px-4 py-3.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] text-white font-semibold text-[15px] flex items-center justify-center min-w-[68px]">
                    +992
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="901234567"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] text-white text-[15px] placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-[3px] focus:ring-white/15 transition-all"
                    />
                  </div>
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

            {/* Switch to Login */}
            {onSwitchToLogin && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Уже есть аккаунт? <span className="font-semibold underline">Войти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}