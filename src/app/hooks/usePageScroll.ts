import { useEffect, useRef } from 'react';
import { useScrollPosition } from '../contexts/ScrollPositionContext';

/**
 * Универсальный хук для управления позицией скролла на странице
 * @param pageId - уникальный идентификатор страницы
 * @param dependencies - зависимости для отслеживания изменений
 */
export function usePageScroll(pageId: string, dependencies: any[] = []) {
  const { getScrollPosition, saveScrollPosition } = useScrollPosition();
  const containerRef = useRef<HTMLDivElement>(null);
  const isRestoringScroll = useRef(false);

  // Восстановление позиции скролла при монтировании
  useEffect(() => {
    const savedPosition = getScrollPosition(pageId);
    
    if (savedPosition > 0 && containerRef.current) {
      isRestoringScroll.current = true;
      
      // Небольшая задержка для полной загрузки контента
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'smooth'
        });
        
        // Сбрасываем флаг после завершения скролла
        setTimeout(() => {
          isRestoringScroll.current = false;
        }, 500);
      }, 100);
    }
  }, [...dependencies]);

  // Сохранение позиции скролла при скролле
  useEffect(() => {
    const handleScroll = () => {
      // Не сохраняем позицию во время восстановления скролла
      if (!isRestoringScroll.current) {
        const scrollPosition = window.scrollY || window.pageYOffset;
        saveScrollPosition(pageId, scrollPosition);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageId, saveScrollPosition]);

  return { containerRef };
}
