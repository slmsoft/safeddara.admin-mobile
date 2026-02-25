import { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, Trash2, UserPlus, Save, Shield } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi } from '../../../api/backendApi';
import { getAdminToken } from '../../../api/adminAuth';

interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export function AdminsManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<{ id: string; email: string; password: string; role: 'admin' | 'accountant' } | null>(null);
  const [saving, setSaving] = useState(false);

  const currentAdminId = (() => {
    try {
      const t = getAdminToken();
      if (!t) return null;
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload?.adminId || null;
    } catch {
      return null;
    }
  })();

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.admins.list();
      if (res.success && res.data?.admins) {
        setAdmins(res.data.admins);
      }
    } catch (e) {
      console.error('Load admins:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleAdd = useCallback(() => {
    setEditingAdmin({ id: '', email: '', password: '', role: 'admin' });
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    (window as any).__adminsAddHandler = handleAdd;
    return () => { delete (window as any).__adminsAddHandler; };
  }, [handleAdd]);

  const filteredAdmins = admins.filter((a) =>
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      superadmin: { label: 'Суперадмин', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      admin: { label: 'Администратор', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      accountant: { label: 'Бухгалтер', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    };
    return badges[role] || { label: role, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  const handleEdit = (a: Admin) => {
    setEditingAdmin({ id: a.id, email: a.email, password: '', role: a.role === 'accountant' ? 'accountant' : 'admin' });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingAdmin) return;
    if (!editingAdmin.email.trim()) {
      alert('Email обязателен');
      return;
    }
    if (!editingAdmin.id && !editingAdmin.password) {
      alert('Пароль обязателен при создании');
      return;
    }
    if (editingAdmin.password && editingAdmin.password.length < 6) {
      alert('Пароль минимум 6 символов');
      return;
    }
    setSaving(true);
    try {
      if (editingAdmin.id) {
        await adminApi.admins.update(editingAdmin.id, {
          email: editingAdmin.email.trim(),
          ...(editingAdmin.password ? { password: editingAdmin.password } : {}),
        });
      } else {
        await adminApi.admins.create({
          email: editingAdmin.email.trim(),
          password: editingAdmin.password,
          role: editingAdmin.role,
        });
      }
      await loadAdmins();
      setIsModalOpen(false);
      setEditingAdmin(null);
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentAdminId) {
      alert('Нельзя удалить себя');
      return;
    }
    if (!confirm('Удалить этого админа?')) return;
    try {
      await adminApi.admins.delete(id);
      await loadAdmins();
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Поиск по email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-[#1e2537] rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2537]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Email</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Роль</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Создан</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((a) => {
                  const badge = getRoleBadge(a.role);
                  return (
                    <tr key={a.id} className="border-b border-[#1e2537] hover:bg-[#1e2537]/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-200 font-medium">{a.email}</span>
                          {a.id === currentAdminId && (
                            <span className="text-xs text-gray-500">(вы)</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">{formatDate(a.createdAt)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(a)}
                            className="p-2 hover:bg-[#1e2537] rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {a.role !== 'superadmin' && a.id !== currentAdminId && (
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="p-2 hover:bg-[#1e2537] rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingAdmin(null); }}
        title={editingAdmin?.id ? 'Редактировать админа' : 'Добавить админа'}
      >
        {editingAdmin && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={editingAdmin.email}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500"
                placeholder="admin@example.com"
                disabled={!!editingAdmin.id && editingAdmin.role === 'superadmin'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Пароль {editingAdmin.id ? '(оставьте пустым, чтобы не менять)' : ''}
              </label>
              <input
                type="password"
                value={editingAdmin.password}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500"
                placeholder="Минимум 6 символов"
                disabled={!!editingAdmin.id && editingAdmin.role === 'superadmin'}
              />
            </div>
            {!editingAdmin.id && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Роль</label>
                <select
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as 'admin' | 'accountant' })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="admin">Администратор</option>
                  <option value="accountant">Бухгалтер</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => { setIsModalOpen(false); setEditingAdmin(null); }}
                className="px-4 py-2 rounded-lg border border-[#1e2537] text-gray-400 hover:bg-[#1e2537]"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
