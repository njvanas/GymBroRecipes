import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardHeader, CardContent } from './ui/Card';

const ExerciseSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://wger.de/api/v2/exercise/?language=2&limit=8&search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      const items = (data.results || []).map((ex) => ({ id: ex.id, name: ex.name }));
      setResults(items);
    } catch (err) {
      console.error('Exercise search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold md:text-2xl">Exercise Search</h2>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex space-x-2">
          <Input
            aria-label="Search exercise"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
          <Button onClick={search} disabled={loading || !query} aria-label="Search">
            Search
          </Button>
        </div>
        <ul className="space-y-2">
          {results.map((item) => (
            <li
              key={item.id}
              className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
            >
              <p className="font-semibold">{item.name}</p>
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
      </CardContent>
    </Card>
  );
};

export default ExerciseSearch;
