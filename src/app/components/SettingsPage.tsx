import { ChevronLeft, ChevronRight, Camera, Check } from 'lucide-react';
import { useState } from 'react';

interface SettingsPageProps {
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function SettingsPage({ onBack, onWeatherClick, onLiveClick }: SettingsPageProps) {
  const [currentView, setCurrentView] = useState<'main' | 'appearance' | 'language'>('main');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [autoTheme, setAutoTheme] = useState(false);
  const [language, setLanguage] = useState<'ru' | 'kk' | 'en'>('ru');

  const languages = [
    { id: 'ru' as const, label: 'Русский' },
    { id: 'kk' as const, label: 'Қазақ тілі' },
    { id: 'en' as const, label: 'English' },
  ];

  // Main Settings View
  if (currentView === 'main') {
    return (
      <div className="min-h-screen bg-[#efeff4]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#efeff4]">
          <div className="h-11 flex items-center justify-between px-4">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            <button className="text-[#71bcf0] font-normal text-[17px]">
              Изм.
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center pt-6 pb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#71bcf0] to-[#8ea3fe] flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-[#71bcf0] rounded-full flex items-center justify-center shadow-lg border-4 border-[#efeff4]">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Settings Options */}
        <div className="px-4">
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Appearance */}
            <button
              onClick={() => setCurrentView('appearance')}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span className="flex-1 text-left text-[17px] text-gray-900">Оформление</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Language */}
            <button
              onClick={() => setCurrentView('language')}
              className="w-full px-4 py-3 flex items-center gap-3 active:bg-gray-50"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <span className="flex-1 text-left text-[17px] text-gray-900">Язык</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Appearance View
  if (currentView === 'appearance') {
    return (
      <div className="min-h-screen bg-[#efeff4]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#efeff4]">
          <div className="h-11 flex items-center justify-center px-4 relative">
            <button
              onClick={() => setCurrentView('main')}
              className="absolute left-4 text-[#71bcf0] font-normal text-[17px]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-semibold text-[17px] text-gray-900">Оформление</h1>
          </div>
        </div>

        {/* Content */}
        <div className="pt-6 px-4">
          {/* Section Title */}
          <div className="px-4 mb-3">
            <p className="text-[13px] text-gray-500 uppercase tracking-wide">ТЕМА</p>
          </div>

          {/* Theme Card */}
          <div className="bg-white rounded-xl p-6">
            {/* Theme Options */}
            <div className="flex gap-8 justify-center mb-8">
              {/* Light Theme */}
              <button
                onClick={() => setTheme('light')}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <div className="w-20 h-[120px] rounded-2xl bg-gradient-to-b from-blue-300 to-blue-200 p-2 flex flex-col gap-1.5">
                    <div className="w-full h-5 bg-blue-200 rounded-lg opacity-80"></div>
                    <div className="w-full h-5 bg-blue-200 rounded-lg opacity-60"></div>
                    <div className="w-full h-5 bg-blue-200 rounded-lg opacity-40"></div>
                  </div>
                </div>
                <span className="text-[15px] text-gray-900">Светлая</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  theme === 'light' ? 'border-[#71bcf0]' : 'border-gray-300'
                }`}>
                  {theme === 'light' && (
                    <div className="w-3 h-3 rounded-full bg-[#71bcf0]"></div>
                  )}
                </div>
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => setTheme('dark')}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <div className="w-20 h-[120px] rounded-2xl bg-gradient-to-b from-slate-700 to-slate-600 p-2 flex flex-col gap-1.5">
                    <div className="w-full h-5 bg-slate-600 rounded-lg opacity-80"></div>
                    <div className="w-full h-5 bg-slate-600 rounded-lg opacity-60"></div>
                    <div className="w-full h-5 bg-slate-600 rounded-lg opacity-40"></div>
                  </div>
                </div>
                <span className="text-[15px] text-gray-900">Темная</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  theme === 'dark' ? 'border-[#71bcf0]' : 'border-gray-300'
                }`}>
                  {theme === 'dark' && (
                    <div className="w-3 h-3 rounded-full bg-[#71bcf0]"></div>
                  )}
                </div>
              </button>
            </div>

            {/* Auto Theme Toggle */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <span className="text-[17px] text-gray-900">Автоматически</span>
              <button
                onClick={() => setAutoTheme(!autoTheme)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  autoTheme ? 'bg-[#34c759]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform shadow-sm ${
                    autoTheme ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Language View
  if (currentView === 'language') {
    return (
      <div className="min-h-screen bg-[#efeff4]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#efeff4]">
          <div className="h-11 flex items-center justify-center px-4 relative">
            <button
              onClick={() => setCurrentView('main')}
              className="absolute left-4 text-[#71bcf0] font-normal text-[17px]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-semibold text-[17px] text-gray-900">Язык</h1>
          </div>
        </div>

        {/* Content */}
        <div className="pt-6 px-4">
          <div className="bg-white rounded-xl overflow-hidden">
            {languages.map((lang, index) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`w-full px-4 py-3.5 flex items-center justify-between active:bg-gray-50 ${
                  index < languages.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-[17px] text-gray-900">{lang.label}</span>
                {language === lang.id && (
                  <Check className="w-5 h-5 text-[#71bcf0]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}