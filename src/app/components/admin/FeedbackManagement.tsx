import { useState } from 'react';
import { Search, MessageSquare, Star, ThumbsUp, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending';
  avatar: string;
}

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: '1', name: 'Иван Петров', email: 'ivan@mail.ru', rating: 5, comment: 'Отличный курорт! Все на высшем уровне', date: '12 янв 2026', status: 'published', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '2', name: 'Мария Сидорова', email: 'maria@gmail.com', rating: 4, comment: 'Очень понравилось, но цены высоковаты', date: '11 янв 2026', status: 'published', avatar: 'https://i.pravatar.cc/150?img=45' },
    { id: '3', name: 'Алексей Морозов', email: 'alexey@inbox.ru', rating: 5, comment: 'Прекрасный сервис, приеду еще!', date: '10 янв 2026', status: 'pending', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: '4', name: 'Ольга Николаева', email: 'olga@mail.com', rating: 3, comment: 'Неплохо, но есть куда расти', date: '09 янв 2026', status: 'published', avatar: 'https://i.pravatar.cc/150?img=20' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  const filtered = feedbacks.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = feedbacks.filter(f => f.status === 'published').length;
  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0';

  const stats = [
    { label: 'Всего отзывов', value: feedbacks.length.toString(), icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Опубликовано', value: publishedCount.toString(), icon: ThumbsUp, color: 'bg-green-500' },
    { label: 'На модерации', value: pendingCount.toString(), icon: Star, color: 'bg-yellow-500' },
    { label: 'Средний рейтинг', value: avgRating, icon: Star, color: 'bg-purple-500' }
  ];

  const handleAddFeedback = () => {
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      name: '',
      email: '',
      rating: 5,
      comment: '',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setEditingFeedback(newFeedback);
    setIsModalOpen(true);
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setEditingFeedback({ ...feedback });
    setIsModalOpen(true);
  };

  const handleSaveFeedback = () => {
    if (!editingFeedback) return;
    
    if (!editingFeedback.name || !editingFeedback.comment) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingFeedback.id && feedbacks.find(f => f.id === editingFeedback.id)) {
      setFeedbacks(feedbacks.map(f => f.id === editingFeedback.id ? editingFeedback : f));
    } else {
      setFeedbacks([...feedbacks, editingFeedback]);
    }
    
    setIsModalOpen(false);
    setEditingFeedback(null);
  };

  const handleDeleteFeedback = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-200">Все отзывы</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Поиск..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500" 
                />
              </div>
              <button
                onClick={handleAddFeedback}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить отзыв
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase">Пользователь</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Отзыв</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Рейтинг</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Дата</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Статус</th>
                <th className="text-right p-4 pr-6 text-xs font-semibold text-gray-400 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-[#1e2537] hover:bg-[#0d1117] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-200">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><span className="text-sm text-gray-300">{f.comment}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4"><span className="text-sm text-gray-300">{f.date}</span></td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${f.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {f.status === 'published' ? 'Опубликован' : 'На модерации'}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditFeedback(f)}
                        className="p-2 hover:bg-[#1e2537] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteFeedback(f.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1e2537] flex items-center justify-between bg-[#0d1117]">
          <p className="text-sm text-gray-400">Показано {filtered.length} из {feedbacks.length}</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">Назад</button>
            <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">Далее</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Feedback Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFeedback(null);
        }}
        title={editingFeedback?.id && feedbacks.find(f => f.id === editingFeedback.id) ? 'Редактировать отзыв' : 'Добавить отзыв'}
        size="lg"
      >
        {editingFeedback && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя пользователя *
              </label>
              <input
                type="text"
                value={editingFeedback.name}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, name: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Введите имя"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editingFeedback.email}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, email: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Рейтинг
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setEditingFeedback({ ...editingFeedback, rating })}
                    className={`p-2 rounded-lg transition-colors ${
                      rating <= editingFeedback.rating
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-[#161b2e] text-gray-400 hover:bg-[#1e2537]'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${rating <= editingFeedback.rating ? 'fill-yellow-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Комментарий *
              </label>
              <textarea
                value={editingFeedback.comment}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, comment: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 min-h-[120px] focus:outline-none focus:border-blue-500"
                placeholder="Текст отзыва..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Дата
                </label>
                <input
                  type="text"
                  value={editingFeedback.date}
                  onChange={(e) => setEditingFeedback({ ...editingFeedback, date: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="12 янв 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={editingFeedback.status}
                  onChange={(e) => setEditingFeedback({ ...editingFeedback, status: e.target.value as Feedback['status'] })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">На модерации</option>
                  <option value="published">Опубликован</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFeedback(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveFeedback}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
