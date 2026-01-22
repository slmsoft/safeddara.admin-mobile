import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ScrollPosition {
  [key: string]: number;
}

interface ScrollPositionContextType {
  scrollPositions: ScrollPosition;
  saveScrollPosition: (pageId: string, position: number) => void;
  getScrollPosition: (pageId: string) => number;
  clearScrollPosition: (pageId: string) => void;
}

const ScrollPositionContext = createContext<ScrollPositionContextType | undefined>(undefined);

export function ScrollPositionProvider({ children }: { children: ReactNode }) {
  const [scrollPositions, setScrollPositions] = useState<ScrollPosition>({});

  const saveScrollPosition = (pageId: string, position: number) => {
    setScrollPositions(prev => ({
      ...prev,
      [pageId]: position
    }));
  };

  const getScrollPosition = (pageId: string): number => {
    return scrollPositions[pageId] || 0;
  };

  const clearScrollPosition = (pageId: string) => {
    setScrollPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[pageId];
      return newPositions;
    });
  };

  return (
    <ScrollPositionContext.Provider
      value={{
        scrollPositions,
        saveScrollPosition,
        getScrollPosition,
        clearScrollPosition
      }}
    >
      {children}
    </ScrollPositionContext.Provider>
  );
}

export function useScrollPosition() {
  const context = useContext(ScrollPositionContext);
  if (context === undefined) {
    throw new Error('useScrollPosition must be used within a ScrollPositionProvider');
  }
  return context;
}
