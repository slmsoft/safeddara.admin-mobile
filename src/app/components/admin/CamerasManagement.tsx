import { useState, useEffect, useCallback } from 'react';
import { Search, Camera, Video, Eye, Edit2, Trash2, Play, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface CameraItem {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  viewers: number;
  quality: string;
  image: string;
  streamUrl?: string;
}

export function CamerasManagement() {
  const [cameras, setCameras] = useState<CameraItem[]>([
    { id: '1', name: 'Склон №1 - Верх', location: 'Склон 1', status: 'online', viewers: 234, quality: '4K', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', streamUrl: 'https://example.com/stream1' },
    { id: '2', name: 'Склон №2 - Середина', location: 'Склон 2', status: 'online', viewers: 189, quality: '1080p', image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800', streamUrl: 'https://example.com/stream2' },
    { id: '3', name: 'Центральная площадь', location: 'Центр', status: 'online', viewers: 456, quality: '4K', image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800', streamUrl: 'https://example.com/stream3' },
    { id: '4', name: 'Подъемник №1', location: 'Подъемник', status: 'offline', viewers: 0, quality: '1080p', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', streamUrl: 'https://example.com/stream4' },
    { id: '5', name: 'Сноу-парк', location: 'Парк', status: 'online', viewers: 312, quality: '4K', image: 'https://images.unsplash.com/photo-1519315901367-a16c76c64e46?w=800', streamUrl: 'https://example.com/stream5' },
    { id: '6', name: 'Ресторан - Терраса', location: 'Ресторан', status: 'online', viewers: 98, quality: '1080p', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', streamUrl: 'https://example.com/stream6' },
    { id: '7', name: 'Парковка', location: 'Парковка', status: 'online', viewers: 45, quality: '720p', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800', streamUrl: 'https://example.com/stream7' },
    { id: '8', name: 'Детская зона', location: 'Детская', status: 'online', viewers: 167, quality: '1080p', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', streamUrl: 'https://example.com/stream8' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<CameraItem | null>(null);

  const filteredCameras = cameras.filter(camera => 
    camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = cameras.filter(c => c.status === 'online').length;
  const offlineCount = cameras.filter(c => c.status === 'offline').length;
  const totalViewers = cameras.reduce((sum, c) => sum + c.viewers, 0);

  const stats = [
    { label: 'Всего камер', value: cameras.length.toString(), color: 'bg-blue-500', icon: '📹' },
    { label: 'Онлайн', value: onlineCount.toString(), color: 'bg-green-500', icon: '✅' },
    { label: 'Офлайн', value: offlineCount.toString(), color: 'bg-red-500', icon: '❌' },
    { label: 'Зрителей', value: totalViewers >= 1000 ? `${(totalViewers / 1000).toFixed(1)}K` : totalViewers.toString(), color: 'bg-purple-500', icon: '👁️' }
  ];

  const handleAddCamera = useCallback(() => {
    const newCamera: CameraItem = {
      id: Date.now().toString(),
      name: '',
      location: '',
      status: 'offline',
      viewers: 0,
      quality: '1080p',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      streamUrl: ''
    };
    setEditingCamera(newCamera);
    setIsModalOpen(true);
  }, []);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__camerasAddHandler = handleAddCamera;
    return () => {
      delete (window as any).__camerasAddHandler;
    };
  }, [handleAddCamera]);

  const handleEditCamera = (camera: CameraItem) => {
    setEditingCamera({ ...camera });
    setIsModalOpen(true);
  };

  const handleSaveCamera = () => {
    if (!editingCamera) return;
    
    if (!editingCamera.name || !editingCamera.location) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingCamera.id && cameras.find(c => c.id === editingCamera.id)) {
      setCameras(cameras.map(c => c.id === editingCamera.id ? editingCamera : c));
    } else {
      setCameras([...cameras, editingCamera]);
    }
    
    setIsModalOpen(false);
    setEditingCamera(null);
  };

  const handleDeleteCamera = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту камеру?')) {
      setCameras(cameras.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск камер..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddCamera}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить камеру
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredCameras.map((camera) => (
          <div key={camera.id} className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group">
            <div className="relative h-40 overflow-hidden bg-gray-900">
              <img src={camera.image} alt={camera.name} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium border ${camera.status === 'online' ? 'bg-red-500/90 text-white border-red-600' : 'bg-gray-500/90 text-white border-gray-600'}`}>
                {camera.status === 'online' ? '● LIVE' : '● OFFLINE'}
              </div>
              <div className="absolute top-3 right-3 bg-[#0d1117]/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-200">
                {camera.quality}
              </div>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-200 mb-1">{camera.name}</h3>
                <p className="text-xs text-blue-400">{camera.location}</p>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{camera.viewers} зрителей</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#1e2537]">
                <button className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Video className="w-3 h-3" />
                  Смотреть
                </button>
                <button 
                  onClick={() => handleEditCamera(camera)}
                  className="bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-400 p-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleDeleteCamera(camera.id)}
                  className="bg-[#0d1117] hover:bg-red-500/10 border border-[#1e2537] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Показано 1-{filteredCameras.length} из {cameras.length}</p>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">Назад</button>
          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">1</button>
          <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">Далее</button>
        </div>
      </div>

      {/* Add/Edit Camera Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCamera(null);
        }}
        title={editingCamera?.id && cameras.find(c => c.id === editingCamera.id) ? 'Редактировать камеру' : 'Добавить камеру'}
        size="lg"
      >
        {editingCamera && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название камеры *
              </label>
              <input
                type="text"
                value={editingCamera.name}
                onChange={(e) => setEditingCamera({ ...editingCamera, name: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Склон №1 - Верх"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Локация *
              </label>
              <input
                type="text"
                value={editingCamera.location}
                onChange={(e) => setEditingCamera({ ...editingCamera, location: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Склон 1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={editingCamera.status}
                  onChange={(e) => setEditingCamera({ ...editingCamera, status: e.target.value as CameraItem['status'] })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="online">Онлайн</option>
                  <option value="offline">Офлайн</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Качество
                </label>
                <select
                  value={editingCamera.quality}
                  onChange={(e) => setEditingCamera({ ...editingCamera, quality: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Количество зрителей
              </label>
              <input
                type="number"
                min="0"
                value={editingCamera.viewers}
                onChange={(e) => setEditingCamera({ ...editingCamera, viewers: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL изображения
              </label>
              <input
                type="text"
                value={editingCamera.image}
                onChange={(e) => setEditingCamera({ ...editingCamera, image: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL потока
              </label>
              <input
                type="text"
                value={editingCamera.streamUrl || ''}
                onChange={(e) => setEditingCamera({ ...editingCamera, streamUrl: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/stream"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCamera(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveCamera}
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
