import { Settings, Save, Bell, Lock, Palette, Globe } from 'lucide-react';

export function SettingsManagement() {
  return (
    <div className="space-y-6">
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-200">Настройки системы</h2>
            <p className="text-sm text-gray-400">Общие настройки и конфигурация</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-200">Общие настройки</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Название сайта</label>
                <input type="text" className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500" defaultValue="Safedara Resort" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Язык по умолчанию</label>
                <select className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500">
                  <option>Русский</option>
                  <option>Таджикский</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Валюта</label>
                <select className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500">
                  <option>Таджикский сомони (смн)</option>
                  <option>USD ($)</option>
                  <option>RUB (₽)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-200">Уведомления</h3>
            </div>
            <div className="space-y-3">
              {['Email уведомления о бронированиях', 'SMS уведомления о заказах', 'Push уведомления', 'Еженедельные отчеты'].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-[#161b2e] rounded-lg cursor-pointer hover:bg-[#1e2537] transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#1e2537] bg-[#0d1117] text-blue-500" />
                  <span className="text-sm text-gray-300">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-gray-200">Безопасность</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Время сессии (минуты)</label>
                <input type="number" className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500" defaultValue="30" />
              </div>
              <label className="flex items-center gap-3 p-3 bg-[#161b2e] rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#1e2537] text-blue-500" />
                <span className="text-sm text-gray-300">Двухфакторная аутентификация</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-[#161b2e] rounded-lg cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#1e2537] text-blue-500" />
                <span className="text-sm text-gray-300">Логирование всех действий</span>
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-200">Внешний вид</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Тема оформления</label>
                <select className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500">
                  <option>Темная</option>
                  <option>Светлая</option>
                  <option>Автоматически</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Акцентный цвет</label>
                <div className="flex gap-3">
                  {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                    <button key={color} className="w-10 h-10 rounded-lg border-2 border-[#1e2537] hover:border-blue-500 transition-colors" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#1e2537] flex justify-end gap-3">
          <button className="px-6 py-3 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors">
            Сбросить
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Save className="w-5 h-5" />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
