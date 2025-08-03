import React from 'react';
import { Copy, Trash2, GripVertical } from 'lucide-react';
import { Prompt } from './PromptVault';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (targetId: string) => void;
  isDragging: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onCopy,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(prompt.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(prompt.id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`group prompt-card ${isDragging ? 'opacity-50 scale-95' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {/* Drag Handle */}
      <div className="drag-handle absolute top-2 left-2">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Copy Button */}
      <button
        onClick={() => onCopy(prompt)}
        className="copy-button"
        title="Copy to clipboard"
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(prompt.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast 
                   bg-destructive text-destructive-foreground rounded-[var(--radius-sm)] p-2 hover:bg-destructive/90
                   absolute top-4 right-16 shadow-[var(--shadow)]"
        title="Delete prompt"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="pl-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-card-foreground text-lg leading-tight pr-20">
            {prompt.title}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
          {prompt.content}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-[var(--radius-sm)] font-medium">
              {prompt.category}
            </span>
            <span>{formatDate(prompt.createdAt)}</span>
          </div>
          
          {prompt.usageCount > 0 && (
            <span className="text-primary font-medium">
              Copied {prompt.usageCount}×
            </span>
          )}
        </div>
      </div>
    </div>
  );
};