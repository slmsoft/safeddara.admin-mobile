import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { SnowflakesBackground } from './SnowflakesBackground';
import { SafeddaraLogo } from './SafeddaraLogo';
import { usersApi } from '../../../api/users';
import { getDeviceToken } from '../../../api/auth';

interface Step1OTPProps {
  phoneNumber: string;
  onVerify: (code: string) => void;
  onBack: () => void;
}

export function Step1OTP({ phoneNumber, onVerify, onBack }: Step1OTPProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Extract calling code and phone number
  const callingCode = phoneNumber.startsWith('+992') ? '+992' : '+992';
  const phoneNumberOnly = phoneNumber.replace(/^\+992/, '');

  // Send SMS code on mount
  useEffect(() => {
    const sendCode = async () => {
      setIsSendingCode(true);
      setError(null);
      try {
        const deviceToken = getDeviceToken();
        const response = await usersApi.sendSMSCode({
          callingCode: '+992',
          deviceToken,
          phoneNumber: phoneNumberOnly,
        });
      } catch (err: any) {
        const errorMessage = err.message || (err.success === false ? err.message : 'Ошибка при отправке SMS кода');
        setError(errorMessage);
      } finally {
        setIsSendingCode(false);
      }
    };

    sendCode();
  }, [phoneNumberOnly]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all filled
    if (newOtp.every(digit => digit !== '') && index === 3) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (code: string) => {
    if (code.length !== 4) return;

    setIsLoading(true);
    setError(null);

    try {
      const deviceToken = getDeviceToken();
      const response = await usersApi.verifySMSCode({
        callingCode: '+992', // API expects format with plus sign according to validate.go
        deviceToken,
        phoneNumber: phoneNumberOnly,
        smsCode: code,
      });

      if (response.success) {
        onVerify(code);
      } else {
        setError(response.message || 'Неверный код подтверждения');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при проверке кода');
      console.error('Error verifying SMS code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '']);
    setTimer(60);
    setError(null);
    setIsSendingCode(true);

    try {
      const deviceToken = getDeviceToken();
      await usersApi.sendSMSCode({
        callingCode: '+992', // API expects format with plus sign according to validate.go
        deviceToken,
        phoneNumber: phoneNumberOnly,
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка при повторной отправке кода');
      console.error('Error resending SMS code:', err);
    } finally {
      setIsSendingCode(false);
      inputRefs.current[0]?.focus();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
              onClick={onBack}
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
              Подтверждение
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-8 bg-white/40"></div>
              <p className="text-center text-white/70 text-sm">
                Шаг 1 из 2
              </p>
              <div className="h-[1px] w-8 bg-white/40"></div>
            </div>
            <p className="text-center text-white/60 text-xs mb-3">
              Код отправлен на телефон
            </p>
            <p className="text-center text-white font-semibold text-base mb-8">
              {phoneNumber}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-white text-xs text-center">{error}</p>
              </div>
            )}

            {/* Loading/Sending Status */}
            {isSendingCode && (
              <div className="mb-4">
                <p className="text-white/60 text-xs text-center">Отправка кода...</p>
              </div>
            )}

            {/* OTP Form */}
            <div>
              <p className="text-center text-white text-xs font-medium mb-4">
                Введите 4-значный код
              </p>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2.5 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-[64px] h-[64px] text-center text-2xl font-bold bg-white/20 backdrop-blur-md border border-white/25 rounded-[18px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/45 focus:ring-[3px] focus:ring-white/20 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-center mb-6">
                {timer > 0 ? (
                  <p className="text-xs text-white/60">
                    ● Отправить повторно через <span className="font-semibold text-white/80">{formatTimer(timer)}</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-xs text-white font-semibold hover:text-white/80 transition-colors underline underline-offset-2"
                  >
                    Отправить код повторно
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit(otp.join(''))}
                disabled={otp.some(digit => digit === '') || isLoading || isSendingCode}
                className="w-full bg-white/85 hover:bg-white/95 text-[#6B7CF5] font-bold text-[15px] py-3.5 rounded-[20px] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white/85"
              >
                {isLoading ? 'Проверка...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}