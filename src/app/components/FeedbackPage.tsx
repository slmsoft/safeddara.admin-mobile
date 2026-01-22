import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo2 from '../../imports/Logo2';
import { WhatsAppIcon, TelegramIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

interface FeedbackPageProps {
  onBack?: () => void;
}

export function FeedbackPage({ onBack }: FeedbackPageProps) {
  const socialLinks = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: InstagramIcon,
      url: 'https://instagram.com'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FacebookIcon,
      url: 'https://facebook.com'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      url: 'https://whatsapp.com'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: TelegramIcon,
      url: 'https://telegram.org'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            <h1 className="font-bold text-gray-900">Обратная связь</h1>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-5">
        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mb-4">
          <div className="w-28 h-28">
            <Logo2 />
          </div>
        </div>
        <h2 className="font-bold text-gray-900 mb-1">Safeddara</h2>
        <p className="text-sm text-gray-500 mb-1">Версия 3.5.25</p>
        <p className="text-xs text-gray-400">Powered by SLMTECH</p>
      </div>

      {/* Social Links */}
      <div className="px-5 py-4 flex-1">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-100">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <IconComponent />
                </div>
                <span className="flex-1 text-left font-medium text-gray-900">
                  {social.name}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}