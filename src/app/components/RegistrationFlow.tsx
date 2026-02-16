import { useState } from 'react';
import { Step1 } from './registration/Step1';
import { Step1OTP } from './registration/Step1OTP';
import { Step2 } from './registration/Step2';
import { Step2OTP } from './registration/Step2OTP';
import { usersApi } from '../../api/users';
import { getDeviceToken, saveAuth } from '../../api/auth';

interface RegistrationFlowProps {
  onComplete: () => void;
  onSwitchToLogin?: () => void;
}

export function RegistrationFlow({ onComplete, onSwitchToLogin }: RegistrationFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [smsCode, setSmsCode] = useState('');

  // Step 1: Name and Phone -> Step 1 OTP
  const handleStep1Complete = (userName: string, userPhone: string) => {
    setName(userName);
    setPhone(userPhone);
    setStep(2); // Переход к Step1OTP
  };

  // Step 1 OTP verified -> Step 2: Email and Password
  const handleStep1OTPVerify = (code: string) => {
    setSmsCode(code);
    setStep(3); // Переход к Step2
  };

  // Step 2: Email and Password -> Step 2 OTP
  const handleStep2Complete = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setStep(4); // Переход к Step2OTP
  };

  // Step 2 OTP verified -> Complete registration
  const handleStep2OTPVerify = async (emailCode: string) => {
    try {
      // Parse name into firstName and lastName
      // If only one word provided, use it as firstName and empty lastName
      const nameParts = name.trim().split(/\s+/).filter(part => part.length > 0);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // Extract calling code and phone number
      const callingCode = '+992'; // API expects format with plus sign according to validate.go
      const phoneNumberOnly = phone.replace(/^\+992/, '');

      // Register user
      const deviceToken = getDeviceToken();
      
      // Validate all required fields according to Swagger
      // Note: lastName is required in Swagger, but we'll allow empty string if user only provided first name
      if (!callingCode || !deviceToken || !email || !emailCode || !firstName || !password || !phoneNumberOnly || !smsCode) {
        const missingFields = [];
        if (!callingCode) missingFields.push('callingCode');
        if (!deviceToken) missingFields.push('deviceToken');
        if (!email) missingFields.push('email');
        if (!emailCode) missingFields.push('emailCode');
        if (!firstName) missingFields.push('firstName');
        if (!password) missingFields.push('password');
        if (!phoneNumberOnly) missingFields.push('phoneNumber');
        if (!smsCode) missingFields.push('smsCode');
        
        alert('Ошибка: Отсутствуют обязательные поля: ' + missingFields.join(', '));
        return;
      }
      
      // If lastName is empty, use firstName as lastName (some APIs require both fields)
      const finalLastName = lastName || firstName;
      
      // Backend accepts only "IOS" or "Android" (not "web")
      // For web applications, use "Android" as default
      const registrationData = {
        callingCode: callingCode.trim(),
        deviceToken: deviceToken.trim(),
        deviceType: 'Android', // Backend only accepts "IOS" or "Android"
        email: email.trim(),
        emailCode: emailCode.trim(),
        firstName: firstName.trim(),
        lastName: finalLastName.trim(),
        password: password.trim(),
        phoneNumber: phoneNumberOnly.trim(),
        smsCode: smsCode.trim(),
      };
      
      console.log('[Registration] Sending registration data:', {
        ...registrationData,
        password: '***', // Don't log password
      });
      console.log('[Registration] Full data check:', {
        callingCode: registrationData.callingCode,
        deviceToken: registrationData.deviceToken,
        deviceType: registrationData.deviceType,
        email: registrationData.email,
        emailCode: registrationData.emailCode,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        password: '***',
        phoneNumber: registrationData.phoneNumber,
        smsCode: registrationData.smsCode,
        allFieldsPresent: Object.values(registrationData).every(v => v !== '' && v !== null && v !== undefined),
      });
      
      const registerResponse = await usersApi.register(registrationData);

      if (registerResponse.success) {
        // API returns {"auth": {"session": "...", "expiresAt": "..."}}
        let sessionId = null;
        if (registerResponse.data && typeof registerResponse.data === 'object') {
          const auth = (registerResponse.data as any).auth;
          if (auth && auth.session) {
            sessionId = auth.session;
          }
        }

        // If no sessionId from registration, try login
        if (!sessionId) {
          try {
            const loginResponse = await usersApi.login({
              deviceToken,
              password,
            });

            if (loginResponse.success && loginResponse.data && typeof loginResponse.data === 'object') {
              const auth = (loginResponse.data as any).auth;
              if (auth && auth.session) {
                sessionId = auth.session;
              }
            }
          } catch (loginError) {
            console.error('Login after registration failed:', loginError);
          }
        }

        // Save session if available
        if (sessionId) {
          // Get expiresAt from auth response
          let expiresAt: string | Date = new Date(Date.now() + 40 * 60 * 1000); // Default 40 minutes
          if (registerResponse.data && typeof registerResponse.data === 'object') {
            const auth = (registerResponse.data as any).auth;
            if (auth && auth.expiresAt) {
              expiresAt = auth.expiresAt;
            }
          }
          saveAuth(sessionId, expiresAt);
        }

        // Сохраняем данные регистрации
        localStorage.setItem('isRegistered', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userEmail', email);
        
        // Переходим к основному приложению
        onComplete();
      } else {
        console.error('Registration failed:', registerResponse);
        const errorMsg = registerResponse.message || 'Неизвестная ошибка регистрации';
        alert('Ошибка регистрации: ' + errorMsg);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // Extract detailed error message
      let errorMsg = 'Неизвестная ошибка';
      if (error.message) {
        errorMsg = error.message;
      } else if (error.success === false && error.message) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      alert('Ошибка регистрации: ' + errorMsg);
    }
  };

  // Render based on current step
  if (step === 1) {
    return <Step1 onNext={handleStep1Complete} onSwitchToLogin={onSwitchToLogin} />;
  }

  if (step === 2) {
    return (
      <Step1OTP
        phoneNumber={phone}
        onVerify={handleStep1OTPVerify}
        onBack={() => setStep(1)}
      />
    );
  }

  if (step === 3) {
    return <Step2 onNext={handleStep2Complete} onBack={() => setStep(2)} />;
  }

  // step === 4
  return (
    <Step2OTP
      email={email}
      phoneNumber={phone}
      smsCode={smsCode}
      onVerify={handleStep2OTPVerify}
      onBack={() => setStep(3)}
    />
  );
}
