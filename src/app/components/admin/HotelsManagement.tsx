import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Maximize, Edit2, Trash2, Eye, Save, CalendarX } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi, type Accommodation } from '../../../api/backendApi';

interface BlockedDateItem {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

const typeToCategory: Record<string, string> = {
  cottage: 'Коттеджи',
  hotel_room: 'Гостиницы',
  safedara_room: 'Гостиница Safedara',
};

function accToHotel(a: Accommodation) {
  return {
    id: a.id,
    name: a.title,
    category: typeToCategory[a.type] || a.type,
    type: a.type,
    price: a.pricePerNight,
    guests: a.capacity,
    area: a.area ?? 0,
    image: a.images?.[0] || '',
    amenities: a.amenities || [],
    isAvailable: a.isAvailable,
    beds: a.beds ?? a.capacity,
    description: a.description,
  };
}

export function HotelsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<ReturnType<typeof accToHotel> | null>(null);
  const [viewingHotel, setViewingHotel] = useState<ReturnType<typeof accToHotel> | null>(null);
  const [hotels, setHotels] = useState<ReturnType<typeof accToHotel>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blockedDatesModalOpen, setBlockedDatesModalOpen] = useState(false);
  const [blockedDatesHotel, setBlockedDatesHotel] = useState<ReturnType<typeof accToHotel> | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDateItem[]>([]);
  const [newBlockStart, setNewBlockStart] = useState('');
  const [newBlockEnd, setNewBlockEnd] = useState('');

  const loadHotels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.accommodations.list();
      if (res.success && res.data?.accommodations) {
        setHotels(res.data.accommodations.map(accToHotel));
      }
    } catch (e) {
      console.error('Load accommodations:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  const handleAdd = useCallback(() => {
    setEditingHotel({
      id: '',
      name: '',
      category: 'Гостиницы',
      type: 'hotel_room',
      price: 0,
      guests: 2,
      area: 0,
      image: '',
      amenities: [],
      isAvailable: true,
      beds: 2,
      description: '',
    });
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    (window as any).__hotelsAddHandler = handleAdd;
    return () => { delete (window as any).__hotelsAddHandler; };
  }, [handleAdd]);

  const filteredHotels = hotels.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleEdit = (h: ReturnType<typeof accToHotel>) => {
    setEditingHotel({ ...h });
    setIsModalOpen(true);
  };

  const handleView = (h: ReturnType<typeof accToHotel>) => {
    setViewingHotel(h);
    setIsViewModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingHotel) return;
    setSaving(true);
    try {
      if (editingHotel.id) {
        await adminApi.accommodations.update(editingHotel.id, {
          type: editingHotel.type,
          title: editingHotel.name,
          description: editingHotel.description || undefined,
          capacity: editingHotel.guests,
          pricePerNight: editingHotel.price,
          area: editingHotel.area || undefined,
          beds: editingHotel.beds,
          images: editingHotel.image ? [editingHotel.image] : [],
          amenities: editingHotel.amenities,
          isAvailable: editingHotel.isAvailable,
        });
      } else {
        await adminApi.accommodations.create({
          type: editingHotel.type,
          title: editingHotel.name,
          description: editingHotel.description,
          capacity: editingHotel.guests,
          pricePerNight: editingHotel.price,
          area: editingHotel.area,
          beds: editingHotel.beds,
          images: editingHotel.image ? [editingHotel.image] : [],
          amenities: editingHotel.amenities,
        });
      }
      await loadHotels();
      setIsModalOpen(false);
    } catch (e) {
      alert((e as Error).message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить номер?')) return;
    try {
      await adminApi.accommodations.delete(id);
      await loadHotels();
    } catch (e) {
      alert((e as Error).message || 'Ошибка удаления');
    }
  };

  const openBlockedDates = async (hotel: ReturnType<typeof accToHotel>) => {
    setBlockedDatesHotel(hotel);
    setBlockedDatesModalOpen(true);
    setNewBlockStart('');
    setNewBlockEnd('');
    try {
      const res = await adminApi.accommodations.blockedDates.list(hotel.id);
      if (res.success && res.data?.blockedDates) {
        setBlockedDates(res.data.blockedDates);
      } else {
        setBlockedDates([]);
      }
    } catch (e) {
      setBlockedDates([]);
    }
  };

  const addBlockedDate = async () => {
    if (!blockedDatesHotel || !newBlockStart || !newBlockEnd) return;
    const start = new Date(newBlockStart);
    const end = new Date(newBlockEnd);
    if (end <= start) {
      alert('Дата окончания должна быть позже даты начала');
      return;
    }
    try {
      const res = await adminApi.accommodations.blockedDates.create(blockedDatesHotel.id, {
        startDate: newBlockStart,
        endDate: newBlockEnd,
      });
      if (res.success && res.data?.blockedDate) {
        setBlockedDates([...blockedDates, res.data.blockedDate]);
        setNewBlockStart('');
        setNewBlockEnd('');
      }
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    }
  };

  const removeBlockedDate = async (blockId: string) => {
    if (!confirm('Удалить блокировку?')) return;
    try {
      await adminApi.accommodations.blockedDates.delete(blockId);
      setBlockedDates(blockedDates.filter(b => b.id !== blockId));
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    }
  };

  const formatBlockDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  const categories = ['all', ...Array.from(new Set(hotels.map(h => h.category)))];
  const availableCount = hotels.filter(h => h.isAvailable).length;

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
          <p className="text-2xl font-bold text-gray-200">{hotels.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Доступно</p>
          <p className="text-2xl font-bold text-green-400">{availableCount}</p>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group">
            <div className="relative h-40 overflow-hidden">
              <img
                src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium border ${
                hotel.isAvailable ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {hotel.isAvailable ? 'Доступно' : 'Недоступно'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-1">{hotel.name}</h3>
              <p className="text-xs text-blue-400 mb-3">{hotel.category}</p>
              <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <div className="flex items-center gap-1"><Users className="w-3 h-3" />до {hotel.guests}</div>
                {hotel.area > 0 && <div className="flex items-center gap-1"><Maximize className="w-3 h-3" />{hotel.area}м²</div>}
              </div>
              <div className="mb-3 pb-3 border-b border-[#1e2537]">
                <span className="text-lg font-bold text-gray-200">{hotel.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400 ml-1">смн/ночь</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleView(hotel)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs py-2 rounded-lg flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> Просмотр
                </button>
                <button onClick={() => openBlockedDates(hotel)} className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 p-2 rounded-lg" title="Заблокировать даты">
                  <CalendarX className="w-3 h-3" />
                </button>
                <button onClick={() => handleEdit(hotel)} className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(hotel.id)} className="bg-[#0d1117] hover:bg-red-500/10 border border-[#1e2537] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2 rounded-lg">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <p className="text-center text-gray-400 py-8">Нет номеров</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHotel?.id ? 'Редактирование' : 'Добавить номер'} size="lg">
        {editingHotel && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название</label>
              <input
                type="text"
                value={editingHotel.name}
                onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Тип</label>
                <select
                  value={editingHotel.type}
                  onChange={(e) => {
                    const t = e.target.value;
                    setEditingHotel({ ...editingHotel, type: t, category: typeToCategory[t] || t });
                  }}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
                >
                  <option value="hotel_room">Гостиницы</option>
                  <option value="safedara_room">Гостиница Safedara</option>
                  <option value="cottage">Коттеджи</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Цена (смн/ночь)</label>
                <input
                  type="number"
                  value={editingHotel.price || ''}
                  onChange={(e) => setEditingHotel({ ...editingHotel, price: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Гостей</label>
                <input
                  type="number"
                  value={editingHotel.guests || ''}
                  onChange={(e) => setEditingHotel({ ...editingHotel, guests: parseInt(e.target.value) || 0, beds: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Площадь (м²)</label>
                <input
                  type="number"
                  value={editingHotel.area || ''}
                  onChange={(e) => setEditingHotel({ ...editingHotel, area: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Доступен</label>
                <select
                  value={editingHotel.isAvailable ? '1' : '0'}
                  onChange={(e) => setEditingHotel({ ...editingHotel, isAvailable: e.target.value === '1' })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
                >
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL изображения</label>
              <input
                type="text"
                value={editingHotel.image || ''}
                onChange={(e) => setEditingHotel({ ...editingHotel, image: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Удобства (через запятую)</label>
              <input
                type="text"
                value={editingHotel.amenities?.join(', ') || ''}
                onChange={(e) => setEditingHotel({ ...editingHotel, amenities: e.target.value.split(',').map(a => a.trim()).filter(Boolean) })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg">Отмена</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={blockedDatesModalOpen} onClose={() => setBlockedDatesModalOpen(false)} title={blockedDatesHotel ? `Заблокированные даты: ${blockedDatesHotel.name}` : 'Заблокированные даты'} size="lg">
        {blockedDatesHotel && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Даты, когда номер недоступен для бронирования. Гости не смогут выбрать эти даты.</p>
            <div className="flex gap-2 flex-wrap">
              <input
                type="date"
                value={newBlockStart}
                onChange={(e) => setNewBlockStart(e.target.value)}
                className="bg-[#161b2e] border border-[#1e2537] rounded-lg px-3 py-2 text-sm text-gray-300"
              />
              <input
                type="date"
                value={newBlockEnd}
                onChange={(e) => setNewBlockEnd(e.target.value)}
                className="bg-[#161b2e] border border-[#1e2537] rounded-lg px-3 py-2 text-sm text-gray-300"
              />
              <button onClick={addBlockedDate} className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 rounded-lg text-sm">
                Добавить блокировку
              </button>
            </div>
            <div className="space-y-2">
              {blockedDates.length === 0 ? (
                <p className="text-sm text-gray-500">Нет заблокированных дат</p>
              ) : (
                blockedDates.map((b) => (
                  <div key={b.id} className="flex items-center justify-between bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-300">
                      {formatBlockDate(b.startDate)} — {formatBlockDate(b.endDate)}
                    </span>
                    <button onClick={() => removeBlockedDate(b.id)} className="text-red-400 hover:text-red-300 text-sm">
                      Удалить
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Информация об отеле" size="lg">
        {viewingHotel && (
          <div className="space-y-4">
            <div className="flex gap-6">
              <img src={viewingHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={viewingHotel.name} className="w-48 h-48 object-cover rounded-lg" />
              <div className="flex-1 space-y-3">
                <div><p className="text-xs text-gray-400 mb-1">Название</p><p className="font-semibold text-gray-200">{viewingHotel.name}</p></div>
                <div><p className="text-xs text-gray-400 mb-1">Категория</p><p className="text-sm text-gray-300">{viewingHotel.category}</p></div>
                <div><p className="text-xs text-gray-400 mb-1">Цена</p><p className="text-sm text-gray-300">{viewingHotel.price.toLocaleString()} смн/ночь</p></div>
                <div><p className="text-xs text-gray-400 mb-1">Гостей</p><p className="text-sm text-gray-300">до {viewingHotel.guests}</p></div>
                {viewingHotel.area > 0 && <div><p className="text-xs text-gray-400 mb-1">Площадь</p><p className="text-sm text-gray-300">{viewingHotel.area} м²</p></div>}
              </div>
            </div>
            {viewingHotel.amenities?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Удобства</p>
                <div className="flex flex-wrap gap-2">
                  {viewingHotel.amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-xs">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
