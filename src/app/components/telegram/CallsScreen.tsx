import { motion } from 'motion/react';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Video } from 'lucide-react';

const calls = [
  { id: 1, name: 'Алексей Петров', time: '10:30', type: 'incoming', duration: '5 мин', isVideo: false },
  { id: 2, name: 'Мария Иванова', time: '09:15', type: 'outgoing', duration: '12 мин', isVideo: true },
  { id: 3, name: 'Дмитрий Сидоров', time: 'вчера', type: 'missed', duration: '', isVideo: false },
  { id: 4, name: 'Анна Козлова', time: 'вчера', type: 'incoming', duration: '3 мин', isVideo: true },
  { id: 5, name: 'Сергей Морозов', time: '2 дня назад', type: 'outgoing', duration: '25 мин', isVideo: false },
];

export function CallsScreen() {
  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-4 h-4 text-green-300" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-4 h-4 text-white/60" />;
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-red-300" />;
      default:
        return <PhoneIncoming className="w-4 h-4 text-white/60" />;
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
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Звонки</h1>

      <div className="space-y-3">
        {calls.map((call) => (
          <motion.div
            key={call.id}
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
                {call.isVideo ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <div>{getCallIcon(call.type)}</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">{call.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getCallIcon(call.type)}
                  <span className="text-white/60 text-sm">
                    {call.isVideo ? 'Видеозвонок' : 'Звонок'}
                    {call.duration && ` • ${call.duration}`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-white/50">{call.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
