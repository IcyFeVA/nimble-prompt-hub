import { useMemo } from 'react';

export function useSearch<T>(
  items: T[],
  query: string,
  searchKeys: (keyof T)[]
) {
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return items.filter(item => {
      return searchTerms.every(term => {
        return searchKeys.some(key => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(term);
          }
          return false;
        });
      });
    });
  }, [items, query, searchKeys]);

  return { filteredItems };
}