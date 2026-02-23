import { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, Trash2, Eye, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi } from '../../../api/backendApi';

interface Category {
  id: number;
  title: string;
  order: number;
  items: Array<{ id: string; name: string; price: number; image?: string; isAvailable: boolean }>;
}

export function RestaurantManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; categoryId: number; name: string; price: number; image?: string; isAvailable: boolean } | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: number; title: string; order: number } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.restaurants.categories();
      if (res.success && res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (e) {
      console.error('Load restaurant:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allItems = categories.flatMap(c => c.items.map(i => ({ ...i, categoryName: c.title, categoryId: c.id })));
  const filteredItems = allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddCategory = () => {
    setEditingCategory({ id: 0, title: 'Новая категория', order: categories.length });
    setIsCatModalOpen(true);
  };

  const handleEditCategory = (c: Category) => {
    setEditingCategory({ id: c.id, title: c.title, order: c.order });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    setSaving(true);
    try {
      if (editingCategory.id) {
        await adminApi.restaurants.updateCategory(editingCategory.id, { title: editingCategory.title, order: editingCategory.order });
      } else {
        await adminApi.restaurants.createCategory({ title: editingCategory.title, order: editingCategory.order });
      }
      await loadData();
      setIsCatModalOpen(false);
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Удалить категорию и все блюда?')) return;
    try {
      await adminApi.restaurants.deleteCategory(id);
      await loadData();
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    }
  };

  const handleAddItem = (categoryId: number) => {
    setEditingItem({ id: '', categoryId, name: '', price: 0, image: '', isAvailable: true });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: { id: string; name: string; price: number; image?: string; isAvailable: boolean }, categoryId: number) => {
    setEditingItem({ ...item, categoryId });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    if (!editingItem.name || editingItem.price <= 0) {
      alert('Название и цена обязательны');
      return;
    }
    setSaving(true);
    try {
      if (editingItem.id) {
        await adminApi.restaurants.updateItem(editingItem.id, {
          categoryId: editingItem.categoryId,
          name: editingItem.name,
          price: editingItem.price,
          image: editingItem.image,
          isAvailable: editingItem.isAvailable,
        });
      } else {
        await adminApi.restaurants.createItem({
          categoryId: editingItem.categoryId,
          name: editingItem.name,
          price: editingItem.price,
          image: editingItem.image,
          isAvailable: editingItem.isAvailable,
        });
      }
      await loadData();
      setIsItemModalOpen(false);
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Удалить блюдо?')) return;
    try {
      await adminApi.restaurants.deleteItem(id);
      await loadData();
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    }
  };

  useEffect(() => {
    (window as any).__restaurantAddHandler = () => categories[0] && handleAddItem(categories[0].id);
    return () => { delete (window as any).__restaurantAddHandler; };
  }, [categories]);

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
          <p className="text-gray-400 text-xs mb-1">Категорий</p>
          <p className="text-2xl font-bold text-gray-200">{categories.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Блюд</p>
          <p className="text-2xl font-bold text-gray-200">{allItems.length}</p>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Поиск блюд..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300" />
          </div>
          <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Добавить категорию
          </button>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1e2537] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-200">{cat.title}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEditCategory(cat)} className="p-2 hover:bg-[#1e2537] rounded-lg text-gray-400"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => handleAddItem(cat.id)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Блюдо
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 p-4">
            {cat.items.filter(i => !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <div key={item.id} className="bg-[#0d1117] border border-[#1e2537] rounded-xl overflow-hidden">
                <div className="h-32 overflow-hidden">
                  <img src={item.image || 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-200 truncate">{item.name}</h4>
                  <p className="text-sm text-orange-400 font-bold">{item.price.toLocaleString()} смн</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditItem(item, cat.id)} className="flex-1 bg-blue-500/10 text-blue-400 text-xs py-1.5 rounded-lg"><Edit2 className="w-3 h-3 inline mr-1" /> Изменить</button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {categories.length === 0 && <p className="text-center text-gray-400 py-8">Нет категорий. Добавьте категорию.</p>}

      <Modal isOpen={isCatModalOpen} onClose={() => { setIsCatModalOpen(false); setEditingCategory(null); }} title={editingCategory?.id ? 'Редактировать категорию' : 'Добавить категорию'} size="md">
        {editingCategory && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название</label>
              <input type="text" value={editingCategory.title} onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Порядок</label>
              <input type="number" value={editingCategory.order} onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsCatModalOpen(false)} className="px-4 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg">Отмена</button>
              <button onClick={handleSaveCategory} disabled={saving} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isItemModalOpen} onClose={() => { setIsItemModalOpen(false); setEditingItem(null); }} title={editingItem?.id ? 'Редактировать блюдо' : 'Добавить блюдо'} size="lg">
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название *</label>
              <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Цена (смн) *</label>
                <input type="number" min="0" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">В наличии</label>
                <select value={editingItem.isAvailable ? '1' : '0'} onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.value === '1' })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200">
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL изображения</label>
              <input type="text" value={editingItem.image || ''} onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg">Отмена</button>
              <button onClick={handleSaveItem} disabled={saving} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
