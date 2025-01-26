import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredIngredients = ingredients
    .filter(ingredient => {
      const searchTerm = state.inputValue.toLowerCase();
      return ingredient.name.toLowerCase().includes(searchTerm) ||
             ingredient.aliases.some(alias => alias.toLowerCase().includes(searchTerm));
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

  const selectIngredient = (ingredientName: string) => {
    setState(prev => ({
      ...prev,
      selectedIngredients: [...prev.selectedIngredients, ingredientName],
      inputValue: '',
      isOpen: false,
      highlightedIndex: -1,
    }));
  };

  const removeIngredient = (ingredientName: string) => {
    setState(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.filter(i => i !== ingredientName),
    }));
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
    setFilters({ ingredients: state.selectedIngredients });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          {state.selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(ingredient)}
                className="ml-1 hover:text-green-900"
              >
                ×
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
            className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-green-500"
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
          
          {state.selectedIngredients.length > 0 && (
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
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
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredIngredients.map((ingredient, index) => (
              <li
                key={ingredient.name}
                id={`ingredient-${index}`}
                role="option"
                aria-selected={index === state.highlightedIndex}
                className={`px-4 py-2 cursor-pointer ${
                  index === state.highlightedIndex ? 'bg-green-50' : ''
                } hover:bg-green-50`}
                onClick={() => selectIngredient(ingredient.name)}
              >
                <div className="font-medium">{ingredient.name}</div>
                <div className="text-sm text-gray-500">{ingredient.category}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
};