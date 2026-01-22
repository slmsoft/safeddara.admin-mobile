import { motion } from 'motion/react';
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  HelpCircle,
  Shield,
  Database,
  ChevronRight,
} from 'lucide-react';

const settingsSections = [
  {
    title: 'Аккаунт',
    items: [
      { icon: User, label: 'Профиль', description: 'Имя, фото, номер' },
      { icon: Lock, label: 'Приватность', description: 'Кто может видеть ваши данные' },
      { icon: Shield, label: 'Безопасность', description: 'Двухэтапная проверка' },
    ],
  },
  {
    title: 'Настройки',
    items: [
      { icon: Bell, label: 'Уведомления', description: 'Звуки и вибрация' },
      { icon: Palette, label: 'Оформление', description: 'Темы и цвета' },
      { icon: Globe, label: 'Язык', description: 'Русский' },
    ],
  },
  {
    title: 'Дополнительно',
    items: [
      { icon: Database, label: 'Данные и память', description: 'Использование сети' },
      { icon: HelpCircle, label: 'Помощь', description: 'FAQ и поддержка' },
    ],
  },
];

export function SettingsScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 pt-8 pb-20"
    >
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Настройки</h1>

      {/* User Profile Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-6 p-6 rounded-2xl cursor-pointer"
        style={{
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl">Иван Иванов</h2>
            <p className="text-white/60 text-sm mt-1">+992 900 123 456</p>
          </div>
          <ChevronRight className="w-6 h-6 text-white/50" />
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-white/70 text-sm font-semibold mb-3 px-2">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={itemIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-2xl cursor-pointer"
                    style={{
                      backdropFilter: 'blur(24px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.label}</h4>
                        <p className="text-white/60 text-sm mt-0.5">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/50" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
