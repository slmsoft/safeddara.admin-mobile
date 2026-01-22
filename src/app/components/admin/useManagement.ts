import { useState } from 'react';

export function useManagement<T extends { id: string }>(initialData: T[]) {
  const [items, setItems] = useState<T[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: T) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setItems(items.map(item => (item.id === editingItem.id ? editingItem : item)));
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить этот элемент?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return {
    items,
    setItems,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    editingItem,
    setEditingItem,
    viewingItem,
    setViewingItem,
    handleEdit,
    handleView,
    handleSave,
    handleDelete
  };
}
