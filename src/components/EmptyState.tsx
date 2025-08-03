import React from 'react';
import { Lightbulb, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onAddSample: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddSample }) => {
  return (
    <div className="empty-state animate-fade-in">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-12 h-12 text-primary animate-pulse-soft" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold mb-3">Welcome to Prompt Vault</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your personal AI prompt library. Organize, search, and copy prompts with zero friction.
          Start by adding your first prompt or try our samples.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onAddSample}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary-hover transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Add Sample Prompts
          </button>
          
          {/* Quick Add hint */}
          <div className="text-center text-sm text-muted-foreground pt-2">
            or press{' '}
            <kbd className="bg-muted px-2 py-1 rounded text-xs font-mono">
              {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}+Shift+P
            </kbd>{' '}
            to create your first prompt
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Quick Add</h3>
            <p className="text-xs text-muted-foreground">
              Keyboard shortcuts for lightning-fast prompt creation
            </p>
          </div>
          
          <div className="p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">One-Click Copy</h3>
            <p className="text-xs text-muted-foreground">
              Hover any prompt to instantly copy to clipboard
            </p>
          </div>
          
          <div className="p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Smart Categories</h3>
            <p className="text-xs text-muted-foreground">
              Organize with categories and powerful search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};