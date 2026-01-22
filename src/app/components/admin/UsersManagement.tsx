import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit2,
  Trash2,
  Users as UsersIcon,
  UserPlus,
  UserCheck,
  UserX,
  Plus,
  Save,
  X
} from 'lucide-react';
import { Modal } from './Modal';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  role: 'superadmin' | 'admin' | 'accountant' | 'user';
  status: 'online' | 'offline';
  avatar: string;
  companyColor: string;
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Carter',
      email: 'john@google.com',
      phone: '(414) 907 - 1574',
      location: 'United States',
      company: 'Google',
      role: 'admin',
      status: 'online',
      avatar: 'https://i.pravatar.cc/150?img=12',
      companyColor: 'bg-red-500'
    },
    {
      id: '2',
      name: 'Sophie Moore',
      email: 'sophie@webflow.com',
      phone: '(406) 480 - 4977',
      location: 'United Kingdom',
      company: 'Webflow',
      role: 'user',
      status: 'offline',
      avatar: 'https://i.pravatar.cc/150?img=45',
      companyColor: 'bg-blue-500'
    },
    {
      id: '3',
      name: 'Neil Crimson',
      email: 'neil@facebook.com',
      phone: '(318) 689 - 9589',
      location: 'Australia',
      company: 'Facebook',
      role: 'accountant',
      status: 'offline',
      avatar: 'https://i.pravatar.cc/150?img=33',
      companyColor: 'bg-blue-600'
    },
    {
      id: '4',
      name: 'Graham Hills',
      email: 'graham@twitter.com',
      phone: '(540) 627 - 3890',
      location: 'India',
      company: 'Twitter',
      role: 'admin',
      status: 'online',
      avatar: 'https://i.pravatar.cc/150?img=56',
      companyColor: 'bg-sky-500'
    },
    {
      id: '5',
      name: 'Sandy Houston',
      email: 'sandy@youtube.com',
      phone: '(440) 470 - 3848',
      location: 'Canada',
      company: 'YouTube',
      role: 'user',
      status: 'offline',
      avatar: 'https://i.pravatar.cc/150?img=20',
      companyColor: 'bg-red-600'
    },
    {
      id: '6',
      name: 'Andy Smith',
      email: 'andy@reddit.com',
      phone: '(504) 458 - 3268',
      location: 'United States',
      company: 'Reddit',
      role: 'user',
      status: 'online',
      avatar: 'https://i.pravatar.cc/150?img=68',
      companyColor: 'bg-orange-500'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      superadmin: { label: 'Super Admin', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      admin: { label: 'Admin', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      accountant: { label: 'Accountant', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
      user: { label: 'User', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
    };
    return badges[role as keyof typeof badges] || badges.user;
  };

  const getCompanyIcon = (company: string) => {
    const colors: Record<string, string> = {
      'Google': 'bg-red-500',
      'Webflow': 'bg-blue-500',
      'Facebook': 'bg-blue-600',
      'Twitter': 'bg-sky-500',
      'YouTube': 'bg-red-600',
      'Reddit': 'bg-orange-500'
    };
    return colors[company] || 'bg-gray-500';
  };

  const handleAddUser = useCallback(() => {
    const newUser: User = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      location: '',
      company: '',
      role: 'user',
      status: 'offline',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      companyColor: 'bg-gray-500'
    };
    setEditingUser(newUser);
    setIsModalOpen(true);
  }, []);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__usersAddHandler = handleAddUser;
    return () => {
      delete (window as any).__usersAddHandler;
    };
  }, [handleAddUser]);

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    if (!editingUser.name || !editingUser.email) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingUser.id && users.find(u => u.id === editingUser.id)) {
      // Обновление существующего пользователя
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    } else {
      // Добавление нового пользователя
      setUsers([...users, editingUser]);
    }
    
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(users.filter(u => u.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`Вы уверены, что хотите удалить ${selectedUsers.length} пользователей?`)) {
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Имя', 'Email', 'Телефон', 'Локация', 'Компания', 'Роль', 'Статус'].join(','),
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.phone,
        u.location,
        u.company,
        u.role,
        u.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Обновляем статистику на основе реальных данных
  const onlineUsers = users.filter(u => u.status === 'online').length;
  const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;
  
  const stats = [
    {
      title: 'Всего пользователей',
      value: users.length.toString(),
      icon: UsersIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Онлайн',
      value: onlineUsers.toString(),
      icon: UserPlus,
      color: 'bg-orange-500'
    },
    {
      title: 'Администраторы',
      value: adminUsers.toString(),
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Обычные пользователи',
      value: regularUsers.toString(),
      icon: UserX,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-200">Все пользователи</h2>
              <p className="text-sm text-gray-400 mt-1">
                1 - {filteredUsers.length} из {users.length}
              </p>
            </div>
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
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить ({selectedUsers.length})
                </button>
              )}
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-[#0d1117] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Экспорт
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить пользователя
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-[#1e2537] bg-[#161b2e] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Имя
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Локация
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Компания
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="text-right p-4 pr-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-[#1e2537] hover:bg-[#0d1117] transition-colors"
                >
                  <td className="p-4 pl-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-[#1e2537] bg-[#161b2e] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-200">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-300">{user.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-300">{user.location}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${user.companyColor} flex items-center justify-center text-xs text-white font-bold`}>
                        {user.company[0]}
                      </div>
                      <span className="text-sm text-gray-300">{user.company}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'online' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      {user.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-[#1e2537] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
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

        {/* Table Footer */}
        <div className="p-4 border-t border-[#1e2537] flex items-center justify-between bg-[#0d1117]">
          <p className="text-sm text-gray-400">
            Показано {filteredUsers.length} из {users.length} пользователей
          </p>
          <div className="flex gap-2">
            <button 
              disabled
              className="px-3 py-1.5 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-500 rounded-lg text-sm transition-colors cursor-not-allowed"
            >
              Назад
            </button>
            <button 
              disabled
              className="px-3 py-1.5 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-500 rounded-lg text-sm transition-colors cursor-not-allowed"
            >
              Далее
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser?.id && users.find(u => u.id === editingUser.id) ? 'Редактировать пользователя' : 'Добавить пользователя'}
        size="lg"
      >
        {editingUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя *
              </label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Введите имя"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Телефон
              </label>
              <input
                type="text"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Локация
              </label>
              <input
                type="text"
                value={editingUser.location}
                onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Страна, город"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Компания
              </label>
              <input
                type="text"
                value={editingUser.company}
                onChange={(e) => {
                  const company = e.target.value;
                  const companyColor = getCompanyIcon(company);
                  setEditingUser({ ...editingUser, company, companyColor });
                }}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Название компании"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Роль
              </label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
                <option value="accountant">Бухгалтер</option>
                <option value="superadmin">Супер-администратор</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="online">Онлайн</option>
                <option value="offline">Офлайн</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveUser}
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