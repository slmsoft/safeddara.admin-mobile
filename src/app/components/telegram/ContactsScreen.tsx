import { motion } from 'motion/react';
import { User, Phone } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Алексей Петров', phone: '+992 900 123 456', status: 'онлайн' },
  { id: 2, name: 'Мария Иванова', phone: '+992 900 234 567', status: 'была 5 минут назад' },
  { id: 3, name: 'Дмитрий Сидоров', phone: '+992 900 345 678', status: 'был час назад' },
  { id: 4, name: 'Анна Козлова', phone: '+992 900 456 789', status: 'онлайн' },
  { id: 5, name: 'Сергей Морозов', phone: '+992 900 567 890', status: 'был вчера' },
];

export function ContactsScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 pt-8 pb-20"
    >
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Контакты</h1>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
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
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">{contact.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3 h-3 text-white/60" />
                  <p className="text-white/60 text-sm">{contact.phone}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-medium ${
                    contact.status === 'онлайн' ? 'text-green-300' : 'text-white/50'
                  }`}
                >
                  {contact.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
