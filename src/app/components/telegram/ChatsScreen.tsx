import { motion } from 'motion/react';
import { User, Check, CheckCheck } from 'lucide-react';

const chats = [
  {
    id: 1,
    name: 'Алексей Петров',
    lastMessage: 'Привет! Как дела?',
    time: '10:30',
    unread: 3,
    status: 'read',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    lastMessage: 'Спасибо за помощь!',
    time: '09:15',
    unread: 0,
    status: 'read',
  },
  {
    id: 3,
    name: 'Дмитрий Сидоров',
    lastMessage: 'Встречаемся завтра?',
    time: 'вчера',
    unread: 15,
    status: 'delivered',
  },
  {
    id: 4,
    name: 'Анна Козлова',
    lastMessage: 'Отлично, договорились!',
    time: 'вчера',
    unread: 0,
    status: 'read',
  },
  {
    id: 5,
    name: 'Сергей Морозов',
    lastMessage: 'Увидимся на встрече',
    time: '2 дня назад',
    unread: 1,
    status: 'sent',
  },
];

export function ChatsScreen() {
  const formatBadge = (count: number) => {
    return count > 99 ? '99+' : count.toString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-300" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-white/60" />;
      case 'sent':
        return <Check className="w-4 h-4 text-white/60" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 pt-8 pb-20"
    >
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Чаты</h1>

      <div className="space-y-3">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
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
                className="w-12 h-12 rounded-full flex items-center justify-center relative"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg">{chat.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(chat.status)}
                  <p className="text-white/60 text-sm truncate">{chat.lastMessage}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-white/50">{chat.time}</span>
                {chat.unread > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full"
                    style={{
                      background: 'linear-gradient(to bottom right, #ef4444, #dc2626)',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {formatBadge(chat.unread)}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
