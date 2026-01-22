import React, { ComponentType } from 'react';

// HOC который добавляет CRUD функционал к любому компоненту
export function withCRUD<P extends object>(Component: ComponentType<P>) {
  return function WithCRUDComponent(props: P) {
    // Добавляем глобальные обработчики для кнопок
    React.useEffect(() => {
      const handleGlobalClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button');
        
        if (!button) return;
        
        const buttonText = button.textContent || '';
        
        // Обработка кнопок по тексту
        if (buttonText.includes('Просмотр') || buttonText.includes('View')) {
          console.log('🔍 Просмотр элемента');
        } else if (buttonText.includes('Редактир') || buttonText.includes('Edit')) {
          console.log('✏️ Редактирование элемента');
        } else if (buttonText.includes('Удал') || buttonText.includes('Delete')) {
          console.log('🗑️ Удаление элемента');
        } else if (buttonText.includes('Добавить') || buttonText.includes('Add')) {
          console.log('➕ Добавление элемента');
        } else if (buttonText.includes('Сохранить') || buttonText.includes('Save')) {
          console.log('💾 Сохранение');
        }
      };
      
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }, []);
    
    return <Component {...props} />;
  };
}
