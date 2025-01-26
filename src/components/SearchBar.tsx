import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { ingredients } from '../data/ingredients';
import { AutocompleteState } from '../types/recipe';

export const SearchBar = () => {
  const setFilters = useRecipeStore((state) => state.setFilters);
  const [state, setState] = useState<AutocompleteState>({
    isOpen: false,
    highlightedIndex: -1,
    inputValue: '',
    selectedIngredients: [],
  });
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredIngredients = ingredients
    .filter(ingredient => {
      const searchTerm = state.inputValue.toLowerCase();
      return (
        !state.selectedIngredients.includes(ingredient.name) &&
        !excludedIngredients.includes(ingredient.name) &&
        (ingredient.name.toLowerCase().includes(searchTerm) ||
         ingredient.aliases.some(alias => alias.toLowerCase().includes(searchTerm)))
      );
    })
    .slice(0, 8);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      inputValue: e.target.value,
      isOpen: true,
      highlightedIndex: -1,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: Math.min(
            prev.highlightedIndex + 1,
            filteredIngredients.length - 1
          ),
          isOpen: true,
        }));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: Math.max(prev.highlightedIndex - 1, -1),
          isOpen: true,
        }));
        break;
      case 'Enter':
        e.preventDefault();
        if (state.highlightedIndex >= 0) {
          selectIngredient(filteredIngredients[state.highlightedIndex].name);
        }
        break;
      case 'Escape':
        setState(prev => ({ ...prev, isOpen: false, highlightedIndex: -1 }));
        break;
    }
  };

  const selectIngredient = (ingredientName: string, exclude = false) => {
    if (exclude) {
      setExcludedIngredients(prev => [...prev, ingredientName]);
    } else {
      setState(prev => ({
        ...prev,
        selectedIngredients: [...prev.selectedIngredients, ingredientName],
      }));
    }
    setState(prev => ({
      ...prev,
      inputValue: '',
      isOpen: false,
      highlightedIndex: -1,
    }));
  };

  const removeIngredient = (ingredientName: string, excluded = false) => {
    if (excluded) {
      setExcludedIngredients(prev => prev.filter(i => i !== ingredientName));
    } else {
      setState(prev => ({
        ...prev,
        selectedIngredients: prev.selectedIngredients.filter(i => i !== ingredientName),
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ingredients: state.selectedIngredients,
      excludeIngredients: excludedIngredients,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <div className="flex flex-wrap gap-2 mb-2">
          {state.selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-full text-sm flex items-center gap-1 transition-all hover:bg-green-100 dark:hover:bg-green-900/50"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(ingredient)}
                className="ml-1 hover:text-green-900 dark:hover:text-green-50 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {excludedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-full text-sm flex items-center gap-1 transition-all hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              -{ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(ingredient, true)}
                className="ml-1 hover:text-red-900 dark:hover:text-red-50 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={state.inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter ingredients (e.g., chicken breast, spinach)"
            className="w-full px-4 py-3 pl-12 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
            aria-label="Search ingredients"
            aria-expanded={state.isOpen}
            aria-autocomplete="list"
            aria-controls="ingredient-list"
            aria-activedescendant={
              state.highlightedIndex >= 0
                ? `ingredient-${state.highlightedIndex}`
                : undefined
            }
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          
          {(state.selectedIngredients.length > 0 || excludedIngredients.length > 0) && (
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all hover:shadow-md active:shadow-sm"
            >
              Search
            </button>
          )}
        </div>

        {state.isOpen && filteredIngredients.length > 0 && (
          <ul
            ref={listRef}
            id="ingredient-list"
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredIngredients.map((ingredient, index) => (
              <li
                key={ingredient.name}
                id={`ingredient-${index}`}
                role="option"
                aria-selected={index === state.highlightedIndex}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  index === state.highlightedIndex ? 'bg-green-50 dark:bg-green-900/20' : ''
                } hover:bg-green-50 dark:hover:bg-green-900/20`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {ingredient.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ingredient.category}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selectIngredient(ingredient.name)}
                      className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                      Include
                    </button>
                    <button
                      type="button"
                      onClick={() => selectIngredient(ingredient.name, true)}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      Exclude
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
};