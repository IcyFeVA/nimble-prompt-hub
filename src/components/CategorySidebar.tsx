import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from './PromptVault';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`border-r border-border bg-background transition-all duration-smooth ${
      isCollapsed ? 'w-12' : 'w-64'
    } mobile-hide`}>
      
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-sm font-medium text-secondary-foreground hover:text-foreground transition-colors"
        >
          {!isCollapsed && <span>Categories</span>}
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Category List */}
      <div className="p-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className={`category-item w-full ${
              selectedCategory === category.name ? 'active' : ''
            }`}
            title={isCollapsed ? category.name : undefined}
          >
            <span className={`truncate ${isCollapsed ? 'sr-only' : ''}`}>
              {category.name}
            </span>
            {!isCollapsed && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};