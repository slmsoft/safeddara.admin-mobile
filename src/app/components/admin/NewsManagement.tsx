import { useState, useEffect, useCallback } from 'react';
import { Search, Newspaper, Eye, Calendar, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  views: number;
  image: string;
  status: 'published' | 'draft';
  content?: string;
}

export function NewsManagement() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Открытие нового склона "Экстрим"',
      category: 'Новости курорта',
      author: 'Админ',
      date: '12 янв 2026',
      views: 1234,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      status: 'published',
      content: 'Полное описание новости...'
    },
    {
      id: '2',
      title: 'Чемпионат по сноубордингу',
      category: 'События',
      author: 'Петр Иванов',
      date: '10 янв 2026',
      views: 892,
      image: 'https://images.unsplash.com/photo-1519315901367-a16c76c64e46?w=800',
      status: 'published',
      content: 'Полное описание события...'
    },
    {
      id: '3',
      title: 'Новое меню в ресторане',
      category: 'Новости курорта',
      author: 'Мария Петрова',
      date: '08 янв 2026',
      views: 567,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      status: 'published',
      content: 'Полное описание новости...'
    },
    {
      id: '4',
      title: 'Скидки на ski-pass в январе',
      category: 'Акции',
      author: 'Админ',
      date: '05 янв 2026',
      views: 2145,
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
      status: 'published',
      content: 'Полное описание акции...'
    },
    {
      id: '5',
      title: 'Правила безопасности на склонах',
      category: 'Безопасность',
      author: 'Иван Сидоров',
      date: '03 янв 2026',
      views: 1876,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      status: 'published',
      content: 'Полное описание правил...'
    },
    {
      id: '6',
      title: 'Новогодние мероприятия',
      category: 'События',
      author: 'Елена Козлова',
      date: '01 янв 2026',
      views: 3421,
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
      status: 'published',
      content: 'Полное описание мероприятий...'
    },
    {
      id: '7',
      title: 'СПА-процедуры: что нового?',
      category: 'Новости курорта',
      author: 'Ольга Смирнова',
      date: '28 дек 2025',
      views: 678,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      status: 'draft',
      content: 'Черновик статьи...'
    },
    {
      id: '8',
      title: 'Фотоконкурс "Лучший момент"',
      category: 'Конкурсы',
      author: 'Админ',
      date: '25 дек 2025',
      views: 1245,
      image: 'https://images.unsplash.com/photo-1486673748761-cdb2f0f5314c?w=800',
      status: 'published',
      content: 'Полное описание конкурса...'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [viewingNews, setViewingNews] = useState<NewsItem | null>(null);

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const publishedCount = newsItems.filter(n => n.status === 'published').length;
  const draftCount = newsItems.filter(n => n.status === 'draft').length;
  const totalViews = newsItems.reduce((sum, n) => sum + n.views, 0);

  const stats = [
    { label: 'Всего новостей', value: newsItems.length.toString(), color: 'bg-blue-500', icon: '📰' },
    { label: 'Опубликовано', value: publishedCount.toString(), color: 'bg-green-500', icon: '✅' },
    { label: 'Черновики', value: draftCount.toString(), color: 'bg-yellow-500', icon: '📝' },
    { label: 'Просмотры', value: totalViews.toLocaleString(), color: 'bg-purple-500', icon: '👁️' }
  ];

  const handleAddNews = useCallback(() => {
    const newNews: NewsItem = {
      id: Date.now().toString(),
      title: '',
      category: 'Новости курорта',
      author: 'Админ',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      views: 0,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      status: 'draft',
      content: ''
    };
    setEditingNews(newNews);
    setIsModalOpen(true);
  }, []);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__newsAddHandler = handleAddNews;
    return () => {
      delete (window as any).__newsAddHandler;
    };
  }, [handleAddNews]);

  const handleEditNews = (news: NewsItem) => {
    setEditingNews({ ...news });
    setIsModalOpen(true);
  };

  const handleViewNews = (news: NewsItem) => {
    setViewingNews(news);
    setIsViewModalOpen(true);
  };

  const handleSaveNews = () => {
    if (!editingNews) return;
    
    if (!editingNews.title || !editingNews.category) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingNews.id && newsItems.find(n => n.id === editingNews.id)) {
      setNewsItems(newsItems.map(n => n.id === editingNews.id ? editingNews : n));
    } else {
      setNewsItems([...newsItems, editingNews]);
    }
    
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      setNewsItems(newsItems.filter(n => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`${stat.color} w-2 h-2 rounded-full`}></div>
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Все категории</option>
            <option value="Новости курорта">Новости курорта</option>
            <option value="События">События</option>
            <option value="Акции">Акции</option>
            <option value="Безопасность">Безопасность</option>
            <option value="Конкурсы">Конкурсы</option>
          </select>
          <button
            onClick={handleAddNews}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить новость
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium border ${
                item.status === 'published' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}>
                {item.status === 'published' ? 'Опубликовано' : 'Черновик'}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-200 mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-blue-400">{item.category}</p>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.views}</span>
                </div>
              </div>

              <div className="mb-3 pb-3 border-b border-[#1e2537]">
                <p className="text-xs text-gray-500">Автор: {item.author}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleViewNews(item)}
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Просмотр
                </button>
                <button 
                  onClick={() => handleEditNews(item)}
                  className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleDeleteNews(item.id)}
                  className="bg-[#0d1117] hover:bg-red-500/10 border border-[#1e2537] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Показано 1-{filteredNews.length} из {newsItems.length}
        </p>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">
            Назад
          </button>
          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
            1
          </button>
          <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">
            Далее
          </button>
        </div>
      </div>

      {/* Add/Edit News Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNews(null);
        }}
        title={editingNews?.id && newsItems.find(n => n.id === editingNews.id) ? 'Редактировать новость' : 'Добавить новость'}
        size="xl"
      >
        {editingNews && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                value={editingNews.title}
                onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Введите заголовок"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Категория *
                </label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Новости курорта">Новости курорта</option>
                  <option value="События">События</option>
                  <option value="Акции">Акции</option>
                  <option value="Безопасность">Безопасность</option>
                  <option value="Конкурсы">Конкурсы</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Автор
                </label>
                <input
                  type="text"
                  value={editingNews.author}
                  onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="Имя автора"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL изображения
              </label>
              <input
                type="text"
                value={editingNews.image}
                onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Содержание
              </label>
              <textarea
                value={editingNews.content || ''}
                onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 min-h-[200px] focus:outline-none focus:border-blue-500"
                placeholder="Полный текст новости..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Дата
                </label>
                <input
                  type="text"
                  value={editingNews.date}
                  onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="12 янв 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={editingNews.status}
                  onChange={(e) => setEditingNews({ ...editingNews, status: e.target.value as NewsItem['status'] })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNews(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveNews}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View News Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingNews(null);
        }}
        title={viewingNews?.title || ''}
        size="xl"
      >
        {viewingNews && (
          <div className="space-y-4">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={viewingNews.image}
                alt={viewingNews.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{viewingNews.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{viewingNews.views} просмотров</span>
              </div>
              <span className="text-blue-400">{viewingNews.category}</span>
              <span className="text-gray-500">Автор: {viewingNews.author}</span>
            </div>
            
            <div className="pt-4 border-t border-[#1e2537]">
              <p className="text-gray-300 whitespace-pre-wrap">
                {viewingNews.content || 'Содержание новости...'}
              </p>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingNews(null);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
