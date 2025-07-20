import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardHeader, CardContent } from './ui/Card';

const FoodSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFoods = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query,
        )}&search_simple=1&action=process&json=1&page_size=5`,
      );
      const data = await res.json();
      const items = (data.products || []).map((p) => ({
        id: p.id,
        name: p.product_name || 'Unknown',
        calories: Number(p.nutriments?.['energy-kcal_100g']) || 0,
        protein: Number(p.nutriments?.proteins_100g) || 0,
        carbs: Number(p.nutriments?.carbohydrates_100g) || 0,
        fats: Number(p.nutriments?.fat_100g) || 0,
      }));
      setResults(items);
    } catch (err) {
      console.error('Search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold md:text-2xl">Food Search</h2>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex space-x-2">
          <Input
            aria-label="Search food"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
          <Button onClick={searchFoods} disabled={loading || !query} aria-label="Search">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {results.length > 0 ? (
          <ul className="space-y-2" aria-live="polite">
            {results.map((item) => (
              <li
                key={item.id}
                className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
                    {item.calories} kcal | P {item.protein} | C {item.carbs} | F {item.fats}
                  </p>
                </div>
                <Button
                  className="bg-transparent text-blue-600 hover:underline px-2 py-1"
                  onClick={() => onSelect(item)}
                  aria-label={`Add ${item.name}`}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && query && <p className="text-gray-500">No results found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodSearch;
