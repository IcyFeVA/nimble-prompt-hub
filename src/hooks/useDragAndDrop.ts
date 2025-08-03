import { useState } from 'react';

export function useDragAndDrop<T>() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string, onReorder: (draggedId: string, targetId: string) => void) => {
    if (draggedItem && draggedItem !== targetId) {
      onReorder(draggedItem, targetId);
    }
    setDraggedItem(null);
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  };
}