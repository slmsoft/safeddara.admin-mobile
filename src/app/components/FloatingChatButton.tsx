import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingChatButtonProps {
  onClick?: () => void;
}

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="hidden lg:flex fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#00bcd4] to-[#0097a7] rounded-full items-center justify-center shadow-2xl hover:shadow-[#00bcd4]/50 transition-all z-50 group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
    >
      <MessageCircle className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" strokeWidth={2} />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#00bcd4] animate-ping opacity-20"></span>
    </motion.button>
  );
}
