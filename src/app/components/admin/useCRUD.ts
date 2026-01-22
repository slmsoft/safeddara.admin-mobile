import { useState } from 'react';

export function useCRUD<T extends { id: string }>(initialData: T[]) {
  const [items, setItems] = useState<T[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);

  const handleCreate = (newItem: T) => {
    setItems([...items, newItem]);
    setIsModalOpen(false);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedItem: T) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleView = (item: T) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingItem(null);
  };

  return {
    items,
    setItems,
    isModalOpen,
    isViewModalOpen,
    editingItem,
    setEditingItem,
    viewingItem,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleView,
    openCreateModal,
    closeModal,
    closeViewModal
  };
}
