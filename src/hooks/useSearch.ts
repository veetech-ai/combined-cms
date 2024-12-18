import { useState, useMemo } from 'react';

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  defaultSort?: keyof T
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof T | undefined>(defaultSort);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedItems = useMemo(() => {
    let result = items;

    // Search
    if (searchTerm) {
      result = items.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
    }

    return result;
  }, [items, searchTerm, sortField, sortDirection, searchFields]);

  const toggleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    toggleSort,
    results: filteredAndSortedItems,
  };
}