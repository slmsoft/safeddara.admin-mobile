import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { backendApi } from '../../api/backendApi';

interface NewsItem {
  id: string;
  date: string;
  title: string;
  image: string;
  content: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

function apiToNewsItem(n: { id: string; title: string; content: string; image?: string | null; publishedAt?: string | null }): NewsItem {
  const d = n.publishedAt ? new Date(n.publishedAt) : new Date();
  return {
    id: n.id,
    date: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    title: n.title,
    image: n.image || DEFAULT_IMAGE,
    content: n.content || '',
  };
}

interface NewsPageProps {
  onBack?: () => void;
  initialNewsId?: string;
}

export function NewsPage({ onBack, initialNewsId }: NewsPageProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendApi.getNews()
      .then((res) => {
        if (res.success && res.data?.news) {
          setNewsItems(res.data.news.map(apiToNewsItem));
        }
      })
      .catch((err) => console.warn('News load failed:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!initialNewsId || newsItems.length === 0) return;
    const news = newsItems.find((item) => item.id === initialNewsId);
    if (news) setSelectedNews(news);
    else {
      backendApi.getNewsItem(initialNewsId)
        .then((res) => {
          if (res.success && res.data?.news) setSelectedNews(apiToNewsItem(res.data.news));
        })
        .catch(() => {});
    }
  }, [initialNewsId, newsItems]);

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
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-10 h-10 border-2 border-[#71bcf0] border-t-transparent rounded-full" />
            </div>
          ) : (
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
          )}
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