import React, { useState } from 'react';
import { Star, StarOff, Send, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface RecipeReviewProps {
  recipeId: string;
  existingRating?: number;
  existingReview?: string;
  onReviewSubmitted?: () => void;
}

export const RecipeReview: React.FC<RecipeReviewProps> = ({
  recipeId,
  existingRating,
  existingReview,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(existingRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(existingReview || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to leave a review');

      const { error } = await supabase
        .from('recipe_reviews')
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating,
          review_text: review
        });

      if (error) throw error;

      toast.success('Review submitted successfully');
      onReviewSubmitted?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-colors"
            >
              {(hoverRating || rating) >= value ? (
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ) : (
                <StarOff className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              )}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {rating ? `You rated this recipe ${rating} stars` : 'Rate this recipe'}
        </span>
      </div>

      <div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with this recipe..."
          className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !rating}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <Loader className="animate-spin" size={20} />
        ) : (
          <>
            <Send size={20} />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
};