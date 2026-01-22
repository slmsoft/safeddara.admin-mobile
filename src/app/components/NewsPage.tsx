import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  date: string;
  title: string;
  image: string;
  content: string;
}

interface NewsPageProps {
  onBack?: () => void;
  initialNewsId?: string; // Добавляем поддержку начальной новости
}

export function NewsPage({ onBack, initialNewsId }: NewsPageProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const newsItems: NewsItem[] = [
    {
      id: '1',
      date: '29.12.2025',
      title: 'Ведущие курорты Евразийского континента...',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      content: `В зимнем сезоне 2025–2026 владельцы сезонных ски-пассов смогут кататься сразу в нескольких крупных горных курортах Казахстана, Узбекистана, Азербайджана и России.

Shymbulak совместно с курортами-участниками Евразийского Альянса Горных Курортов (ЕАГК) объявляет о запуске акции «Горнолыжный сезон без границ», которая будет действовать в зимнем сезоне 2025 – 2026 годов.

Теперь владельцы сезонного ски-пасса, приобретённого на курортах Shymbulak или Oi-Qaragai в Казахстане, Amirsoy в Узбекистане, Shahdag в Азербайджане или Rosa Khutor в России смогут получить бесплатный ски-пасс сроком до пяти дней на каждом из курортов-партнёров. Условие участия в акции - проживание в отелях курорта-партнёра либо в рекомендованных им местах размещения.

Акция «Горнолыжный сезон без границ» стала практическим шагом в развитии идеи Межгосударственного горного туристического маршрута.`
    },
    {
      id: '2',
      date: '29.12.2025',
      title: 'Shymbulak напомнил о правилах безопасно...',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      content: `Курорт Shymbulak напоминает всем гостям о важности соблюдения правил безопасности на склонах.

Перед началом катания необходимо ознакомиться с картой склонов, уровнями сложности трасс и правилами поведения. Обязательно используйте защитное снаряжение: шлем, защиту для спины и суставов.

Следите за погодными условиями и предупреждениями администрации курорта. Не выходите за пределы обозначенных трасс и не катайтесь в состоянии алкогольного опьянения.

Инструкторы курорта всегда готовы помочь начинающим лыжникам и сноубордистам освоить базовые навыки безопасного катания.

Помните: ваша безопасность - наш приоритет!`
    },
    {
      id: '3',
      date: '29.12.2025',
      title: 'Режим работы курорта в новогодние празд...',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      content: `Уважаемые гости! Информируем вас о режиме работы курорта Shymbulak в период новогодних праздников.

31 декабря 2025 года:
Подъёмники работают с 9:00 до 16:00
Рестораны и кафе - до 18:00

1 января 2026 года:
Подъёмники работают с 10:00 до 17:00
Специальная новогодняя программа для гостей

2-8 января 2026 года:
Обычный режим работы с 9:00 до 17:00

В новогоднюю ночь на территории курорта пройдёт праздничная программа с фейерверком, живой музыкой и развлечениями для всей семьи.

Бронирование столиков в ресторанах доступно по телефону +7 (727) 330 93 00.

С наступающим Новым годом!`
    },
    {
      id: '4',
      date: '28.12.2025',
      title: 'Открытие новой трассы для фрирайда',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      content: `Курорт Shymbulak рад объявить об открытии новой трассы для любителей фрирайда!

Новая зона расположена на высоте 3200 метров и предлагает уникальные возможности для катания по целине. Протяжённость маршрута - 2.5 км с перепадом высот 600 метров.

Доступ к трассе осуществляется через подъёмник "Талгар". Обязательно наличие лавинного снаряжения и сопровождение гида.

Курорт организует групповые туры с профессиональными инструкторами каждую субботу и воскресенье. Запись по телефону горнолыжной школы.`
    }
  ];

  // Автоматически открываем выбранную новость при загрузке
  useEffect(() => {
    if (initialNewsId) {
      const news = newsItems.find(item => item.id === initialNewsId);
      if (news) {
        setSelectedNews(news);
      }
    }
  }, [initialNewsId]);

  if (selectedNews) {
    return <NewsDetailPage news={selectedNews} onBack={() => setSelectedNews(null)} />;
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Header - Mobile & Desktop */}
      <div className="bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95 z-10"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            
            <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">Новости</h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block max-w-[1400px] mx-auto px-8">
          <div className="flex items-center gap-3 py-8">
            <button
              onClick={() => onBack && onBack()}
              className="flex items-center justify-center text-gray-600 hover:text-[#71bcf0] transition-colors"
              type="button"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={2} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Новости</h1>
          </div>
        </div>
      </div>

      {/* News Grid - Mobile: 1 column, Desktop: 4 columns */}
      <div className="max-w-[402px] lg:max-w-[1400px] mx-auto">
        <div className="px-4 lg:px-8 pt-6 lg:pt-8 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-6">
            {newsItems.map((news, index) => (
              <NewsCard
                key={news.id}
                news={news}
                index={index}
                onClick={() => setSelectedNews(news)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewsCardProps {
  news: NewsItem;
  index: number;
  onClick: () => void;
}

function NewsCard({ news, index, onClick }: NewsCardProps) {
  return (
    <div
      onClick={() => onClick && onClick()}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">{news.date}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2">{news.title}</h3>
      </div>
    </div>
  );
}

interface NewsDetailPageProps {
  news: NewsItem;
  onBack: () => void;
}

function NewsDetailPage({ news, onBack }: NewsDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image with Title Overlay */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-9 pt-6 text-white">
          <h1 className="text-2xl font-bold leading-tight">
            {news.title.replace('...', '')}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="px-5 pt-6 pb-24">
          {/* Section Label */}
          <div className="mb-8">
            <p className="text-lg font-semibold text-gray-500">Новости</p>
          </div>

          {/* Full Text Content */}
          <div className="prose prose-gray max-w-none">
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-6 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Date */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Опубликовано: {news.date}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}