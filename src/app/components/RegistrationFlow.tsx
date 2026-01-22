import { useState } from 'react';
import { Step1 } from './registration/Step1';
import { Step2 } from './registration/Step2';

interface RegistrationFlowProps {
  onComplete: () => void;
}

export function RegistrationFlow({ onComplete }: RegistrationFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleStep1Complete = (userName: string, userPhone: string) => {
    setName(userName);
    setPhone(userPhone);
    setStep(2);
  };

  const handleStep2Complete = (email: string, password: string) => {
    // Сохраняем данные регистрации
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userEmail', email);
    
    // Переходим к основному приложению
    onComplete();
  };

  if (step === 1) {
    return <Step1 onNext={handleStep1Complete} />;
  }

  return <Step2 onNext={handleStep2Complete} />;
}
