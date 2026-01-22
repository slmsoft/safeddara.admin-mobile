import { useState, useEffect, useCallback } from 'react';
import { FileText, Save, Edit2, Plus, X } from 'lucide-react';
import { Modal } from './Modal';

interface Rule {
  num: number;
  title: string;
  text: string;
}

export function RulesManagement() {
  const [rules, setRules] = useState<Rule[]>([
    { num: 1, title: 'Уважение к другим', text: 'Каждый лыжник должен вести себя таким образом, чтобы не подвергать опасности других' },
    { num: 2, title: 'Контроль скорости', text: 'Скорость движения должна соответствовать личным возможностям и погодным условиям' },
    { num: 3, title: 'Выбор направления', text: 'Лыжник, находящийся впереди, имеет преимущество' },
    { num: 4, title: 'Обгон', text: 'Обгон может осуществляться справа или слева, но с достаточным расстоянием' },
    { num: 5, title: 'Выход на склон', text: 'Выезжать на склон нужно только после того, как убедитесь в безопасности' },
    { num: 6, title: 'Остановка', text: 'Остановка разрешена только на краю склона или в местах с хорошей видимостью' },
    { num: 7, title: 'Подъем', text: 'Подниматься пешком нужно только по краю склона' },
    { num: 8, title: 'Знаки', text: 'Все знаки и указатели должны быть соблюдены' },
    { num: 9, title: 'Помощь', text: 'При несчастном случае каждый обязан оказать помощь' },
    { num: 10, title: 'Идентификация', text: 'Каждый участник ДТП обязан сообщить свои данные' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const handleAddRule = useCallback(() => {
    const newRule: Rule = {
      num: rules.length + 1,
      title: '',
      text: ''
    };
    setEditingRule(newRule);
    setIsModalOpen(true);
  }, [rules.length]);

  // Экспортируем функцию для использования из заголовка
  useEffect(() => {
    (window as any).__rulesAddHandler = handleAddRule;
    return () => {
      delete (window as any).__rulesAddHandler;
    };
  }, [handleAddRule]);

  const handleEditRule = (rule: Rule) => {
    setEditingRule({ ...rule });
    setIsModalOpen(true);
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    
    if (!editingRule.title || !editingRule.text) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (editingRule.num && rules.find(r => r.num === editingRule.num)) {
      setRules(rules.map(r => r.num === editingRule.num ? editingRule : r));
    } else {
      setRules([...rules, editingRule]);
    }
    
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (num: number) => {
    if (confirm('Вы уверены, что хотите удалить это правило?')) {
      const newRules = rules.filter(r => r.num !== num).map((r, index) => ({
        ...r,
        num: index + 1
      }));
      setRules(newRules);
    }
  };

  const handleSaveAll = () => {
    alert('Изменения сохранены!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-200">Правила FIS</h2>
              <p className="text-sm text-gray-400">Международные правила безопасности на склонах</p>
            </div>
          </div>
          <button
            onClick={handleAddRule}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить правило
          </button>
        </div>

        <div className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.num} className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-4 group hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 text-blue-400 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                  {rule.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-200 mb-1">{rule.title}</h3>
                  <p className="text-sm text-gray-400">{rule.text}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-2 hover:bg-[#1e2537] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.num)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-[#1e2537] flex justify-end">
          <button 
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Сохранить изменения
          </button>
        </div>
      </div>

      {/* Add/Edit Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        title={editingRule?.num && rules.find(r => r.num === editingRule.num) ? 'Редактировать правило' : 'Добавить правило'}
        size="lg"
      >
        {editingRule && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Номер правила
              </label>
              <input
                type="number"
                min="1"
                value={editingRule.num}
                onChange={(e) => setEditingRule({ ...editingRule, num: parseInt(e.target.value) || 1 })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                value={editingRule.title}
                onChange={(e) => setEditingRule({ ...editingRule, title: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Название правила"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание *
              </label>
              <textarea
                value={editingRule.text}
                onChange={(e) => setEditingRule({ ...editingRule, text: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 min-h-[120px] focus:outline-none focus:border-blue-500"
                placeholder="Текст правила..."
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingRule(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveRule}
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
