// Add to imports
import { useMeasurements } from '../../hooks/useMeasurements';

// Modify RecipeCard component
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { formatMeasurement } = useMeasurements();
  // ... existing code ...

  return (
    <>
      {/* ... existing JSX ... */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {Math.round(getNutrientValue('Calories'))}
          </div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xs text-green-600 dark:text-green-400">Protein</div>
          <div className="font-semibold text-green-700 dark:text-green-300">
            {formatMeasurement(getNutrientValue('Protein'), 'g')}
          </div>
        </div>
      </div>
      {/* ... rest of JSX ... */}
    </>
  );
};