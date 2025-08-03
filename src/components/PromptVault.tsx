import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Copy, Trash2, GripVertical, Download, Upload, Lightbulb } from 'lucide-react';
import { PromptCard } from './PromptCard';
import { CategorySidebar } from './CategorySidebar';
import { QuickAddModal } from './QuickAddModal';
import { Toast } from './Toast';
import { EmptyState } from './EmptyState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSearch } from '../hooks/useSearch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  usageCount: number;
}

export interface Category {
  name: string;
  count: number;
}

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Marketing Copy Generator',
    content: 'Create compelling marketing copy for [PRODUCT/SERVICE]. Focus on benefits, use emotional triggers, and include a clear call-to-action. Target audience: [AUDIENCE]. Tone: [PROFESSIONAL/CASUAL/URGENT].',
    category: 'Marketing',
    createdAt: Date.now(),
    usageCount: 0
  },
  {
    id: '2',
    title: 'Code Review Assistant',
    content: 'Review this code for best practices, security issues, and performance optimizations. Provide specific suggestions with examples:\n\n[PASTE CODE HERE]',
    category: 'Development',
    createdAt: Date.now(),
    usageCount: 0
  }
];

export const PromptVault: React.FC = () => {
  const { data: prompts, setData: setPrompts } = useLocalStorage<Prompt[]>('promptVault_v1', []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Check if this is the first time user
  useEffect(() => {
    if (prompts.length === 0) {
      setIsFirstTime(true);
    }
  }, [prompts.length]);

  // Search functionality
  const { filteredItems: filteredPrompts } = useSearch(prompts, searchQuery, ['title', 'content', 'category']);

  // Filter by category
  const categoryFilteredPrompts = selectedCategory === 'All' 
    ? filteredPrompts 
    : filteredPrompts.filter(prompt => prompt.category === selectedCategory);

  // Get categories with counts
  const categories: Category[] = React.useMemo(() => {
    const categoryMap = prompts.reduce((acc, prompt) => {
      acc[prompt.category] = (acc[prompt.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'All', count: prompts.length },
      ...Object.entries(categoryMap).map(([name, count]) => ({ name, count }))
    ];
  }, [prompts]);

  // Drag and drop functionality
  const { draggedItem, handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDragAndDrop<Prompt>();

  const reorderPrompts = useCallback((draggedId: string, targetId: string) => {
    setPrompts(prevPrompts => {
      const newPrompts = [...prevPrompts];
      const draggedIndex = newPrompts.findIndex(p => p.id === draggedId);
      const targetIndex = newPrompts.findIndex(p => p.id === targetId);
      
      if (draggedIndex > -1 && targetIndex > -1) {
        const [draggedPrompt] = newPrompts.splice(draggedIndex, 1);
        newPrompts.splice(targetIndex, 0, draggedPrompt);
      }
      
      return newPrompts;
    });
  }, [setPrompts]);

  // Add sample prompts for first-time users
  const addSamplePrompts = useCallback(() => {
    setPrompts(SAMPLE_PROMPTS);
    showToast('Sample prompts added!', 'success');
    setIsFirstTime(false);
  }, [setPrompts]);

  // Hotkey for quick add (Cmd/Ctrl + Shift + P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsQuickAddOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt' | 'usageCount'>) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      usageCount: 0
    };
    setPrompts(prev => [newPrompt, ...prev]);
    showToast('Prompt added successfully!', 'success');
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    showToast('Prompt deleted', 'success');
  };

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      
      // Increment usage count
      setPrompts(prev => prev.map(p => 
        p.id === prompt.id 
          ? { ...p, usageCount: p.usageCount + 1 }
          : p
      ));
      
      showToast('Copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-vault-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Prompts exported!', 'success');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPrompts: Prompt[] = JSON.parse(e.target?.result as string);
        setPrompts(prev => [...importedPrompts, ...prev]);
        showToast(`Imported ${importedPrompts.length} prompts!`, 'success');
      } catch (error) {
        showToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Prompt Vault</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Export prompts"
            >
              <Download className="w-4 h-4" />
            </button>
            <label className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer" title="Import prompts">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="mobile-hide">Add Prompt</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isFirstTime && prompts.length === 0 ? (
            <EmptyState onAddSample={addSamplePrompts} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryFilteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onCopy={handleCopyPrompt}
                  onDelete={handleDeletePrompt}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(targetId) => handleDrop(targetId, reorderPrompts)}
                  isDragging={draggedItem === prompt.id}
                />
              ))}
            </div>
          )}

          {!isFirstTime && categoryFilteredPrompts.length === 0 && (
            <div className="empty-state">
              <p className="text-lg mb-2">No prompts found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <QuickAddModal
          categories={categories.slice(1).map(c => c.name)} // Exclude "All"
          onAdd={handleAddPrompt}
          onClose={() => setIsQuickAddOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};