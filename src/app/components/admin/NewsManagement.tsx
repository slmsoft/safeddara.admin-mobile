import { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Eye, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi } from '../../../api/backendApi';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  image?: string;
  isPublished: boolean;
  publishedAt?: string;
}

export function NewsManagement() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [viewingNews, setViewingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.news.list();
      if (res.success && res.data?.news) {
        setNewsItems(res.data.news.map((n: any) => ({
          id: n.id,
          title: n.title,
          category: n.category || 'Новости курорта',
          content: n.content || '',
          image: n.image,
          isPublished: n.isPublished !== false,
          publishedAt: n.publishedAt,
        })));
      }
    } catch (e) {
      console.error('Load news:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = newsItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ['all', ...Array.from(new Set(newsItems.map(n => n.category)))];

  const handleAddNews = useCallback(() => {
    setEditingNews({
      id: '',
      title: '',
      category: 'Новости курорта',
      content: '',
      image: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    (window as any).__newsAddHandler = handleAddNews;
    return () => { delete (window as any).__newsAddHandler; };
  }, [handleAddNews]);

  const handleEditNews = (news: NewsItem) => {
    setEditingNews({ ...news });
    setIsModalOpen(true);
  };

  const handleViewNews = (news: NewsItem) => {
    setViewingNews(news);
    setIsViewModalOpen(true);
  };

  const handleSaveNews = async () => {
    if (!editingNews) return;
    if (!editingNews.title || !editingNews.category) {
      alert('Заполните заголовок и категорию');
      return;
    }
    setSaving(true);
    try {
      if (editingNews.id) {
        await adminApi.news.update(editingNews.id, {
          title: editingNews.title,
          content: editingNews.content,
          image: editingNews.image,
          category: editingNews.category,
          isPublished: editingNews.isPublished,
        });
      } else {
        await adminApi.news.create({
          title: editingNews.title,
          content: editingNews.content,
          image: editingNews.image,
          category: editingNews.category,
          isPublished: editingNews.isPublished,
        });
      }
      await loadNews();
      setIsModalOpen(false);
    } catch (e) {
      alert((e as Error).message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Удалить новость?')) return;
    try {
      await adminApi.news.delete(id);
      await loadNews();
    } catch (e) {
      alert((e as Error).message || 'Ошибка удаления');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Всего</p>
          <p className="text-2xl font-bold text-gray-200">{newsItems.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Опубликовано</p>
          <p className="text-2xl font-bold text-green-400">{newsItems.filter(n => n.isPublished).length}</p>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
          >
            <option value="all">Все категории</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group">
            <div className="relative h-40 overflow-hidden">
              <img src={item.image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium border ${item.isPublished ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                {item.isPublished ? 'Опубликовано' : 'Черновик'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-blue-400 mb-3">{item.category}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => handleViewNews(item)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs py-2 rounded-lg flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> Просмотр
                </button>
                <button onClick={() => handleEditNews(item)} className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button onClick={() => handleDeleteNews(item.id)} className="bg-[#0d1117] hover:bg-red-500/10 border border-[#1e2537] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2 rounded-lg">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && <p className="text-center text-gray-400 py-8">Нет новостей</p>}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingNews(null); }} title={editingNews?.id ? 'Редактировать' : 'Добавить новость'} size="xl">
        {editingNews && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок *</label>
              <input type="text" value={editingNews.title} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <input type="text" value={editingNews.category} onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" placeholder="Новости курорта" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL изображения</label>
              <input type="text" value={editingNews.image || ''} onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Содержание</label>
              <textarea value={editingNews.content || ''} onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 min-h-[200px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
              <select value={editingNews.isPublished ? '1' : '0'} onChange={(e) => setEditingNews({ ...editingNews, isPublished: e.target.value === '1' })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200">
                <option value="1">Опубликовано</option>
                <option value="0">Черновик</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button onClick={() => { setIsModalOpen(false); setEditingNews(null); }} className="px-4 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4" /> Отмена
              </button>
              <button onClick={handleSaveNews} disabled={saving} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setViewingNews(null); }} title={viewingNews?.title || ''} size="xl">
        {viewingNews && (
          <div className="space-y-4">
            {viewingNews.image && <img src={viewingNews.image} alt="" className="w-full h-64 object-cover rounded-lg" />}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="text-blue-400">{viewingNews.category}</span>
              {viewingNews.publishedAt && <span><Calendar className="w-4 h-4 inline mr-1" />{new Date(viewingNews.publishedAt).toLocaleDateString('ru-RU')}</span>}
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{viewingNews.content || '—'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
