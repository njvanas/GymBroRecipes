import React from 'react';
import { ShoppingBag, Check, Trash2 } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';

export const ShoppingList = () => {
  const { shoppingLists, toggleShoppingItem } = useRecipeStore();
  const activeList = shoppingLists[shoppingLists.length - 1];

  if (!activeList) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 text-center">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Shopping List Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Generate a shopping list from your meal plan to get started
        </p>
      </div>
    );
  }

  const categorizedItems = activeList.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof activeList.items>);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-green-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {activeList.name}
        </h2>
      </div>

      <div className="space-y-6">
        {Object.entries(categorizedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors ${
                    item.isChecked ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleShoppingItem(activeList.id, item.id)}
                    className={`w-5 h-5 rounded border ${
                      item.isChecked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center transition-colors`}
                  >
                    {item.isChecked && <Check size={14} className="text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-gray-900 dark:text-gray-100 ${
                      item.isChecked ? 'line-through text-gray-500 dark:text-gray-400' : ''
                    }`}>
                      {item.ingredientName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.amount} {item.unit}
                    </p>
                  </div>

                  <button
                    onClick={() => {/* Implement remove item */}}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center py-4 border-t dark:border-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {activeList.items.filter(i => i.isChecked).length} of {activeList.items.length} items checked
        </div>
        <button
          onClick={() => {/* Implement clear completed */}}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Clear completed
        </button>
      </div>
    </div>
  );
};