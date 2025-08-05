import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Prompt } from './PromptVault';

interface QuickAddModalProps {
  categories: string[];
  onAdd: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'usageCount'>) => void;
  onEdit: (prompt: Prompt) => void;
  onClose: () => void;
  promptToEdit?: Prompt | null;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  categories,
  onAdd,
  onEdit,
  onClose,
  promptToEdit
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    if (promptToEdit) {
      setTitle(promptToEdit.title);
      setContent(promptToEdit.content);
      setCategory(promptToEdit.category);
    }
  }, [promptToEdit]);

  // Focus title input on mount
  useEffect(() => {
    const titleInput = document.getElementById('title-input') as HTMLInputElement;
    if (titleInput) {
      titleInput.focus();
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;

    const finalCategory = isCreatingCategory && newCategory.trim() 
      ? newCategory.trim() 
      : category || 'Uncategorized';

    if (promptToEdit) {
      onEdit({ 
        ...promptToEdit, 
        title: title.trim(),
        content: content.trim(),
        category: finalCategory
      });
    } else {
      onAdd({
        title: title.trim(),
        content: content.trim(),
        category: finalCategory
      });
    }

    onClose();
  };

  const handleCreateCategory = () => {
    setIsCreatingCategory(true);
    setCategory('');
  };

  const handleCancelCreateCategory = () => {
    setIsCreatingCategory(false);
    setNewCategory('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-bounce-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{promptToEdit ? 'Edit Prompt' : 'Add New Prompt'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title-input" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief descriptive name..."
              className="search-input"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            {isCreatingCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name..."
                  className="search-input flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCancelCreateCategory}
                  className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="search-input flex-1"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                  title="Create new category"
                >
                  <Plus className="w-3 h-3" />
                  <span className="mobile-hide">New</span>
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content-input" className="block text-sm font-medium mb-2">
              Prompt Content
            </label>
            <textarea
              id="content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={6}
              className="search-input resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {promptToEdit ? 'Save Changes' : 'Add Prompt'}
            </button>
          </div>
        </form>

        {/* Hotkey Hint */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Pro tip: Use <kbd className="bg-muted px-1 py-0.5 rounded text-xs">Cmd+Shift+P</kbd> to quick-add anywhere
        </div>
      </div>
    </div>
  );
};