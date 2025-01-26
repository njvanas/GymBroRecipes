import React, { useState, useEffect } from 'react';
import { Star, User, ChevronDown, ChevronUp, Loader, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { RecipeReview } from './RecipeReview';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface RecipeReviewsProps {
  recipeId: string;
  avgRating?: number;
  reviewCount?: number;
}

export const RecipeReviews: React.FC<RecipeReviewsProps> = ({
  recipeId,
  avgRating = 0,
  reviewCount = 0
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('recipe_reviews')
        .select(`
          id,
          user_id,
          rating,
          review_text,
          created_at
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data as Review[]);
      
      if (user) {
        const userReview = data?.find(review => review.user_id === user.id);
        setUserReview(userReview || null);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

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
          rating: newReview.rating,
          review_text: newReview.text
        });

      if (error) throw error;

      await loadReviews();
      setNewReview({ rating: 0, text: '' });
    } catch (error: any) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader className="animate-spin text-green-500" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-1">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {avgRating ? avgRating.toFixed(1) : '0.0'}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Write Review Section */}
      {!userReview && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating: value }))}
                    className="p-1 transition-colors"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        value <= newReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {newReview.rating ? `You rated this recipe ${newReview.rating} stars` : 'Rate this recipe'}
              </span>
            </div>

            <textarea
              value={newReview.text}
              onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Share your experience with this recipe..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
              rows={3}
            />

            <button
              type="submit"
              disabled={isSubmitting || !newReview.rating}
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
        </div>
      )}

      {/* Reviews List */}
      {displayedReviews.length > 0 && (
        <div className="space-y-3">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      User
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </time>
              </div>
              {review.review_text && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">
                  {review.review_text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors"
        >
          {showAllReviews ? (
            <>
              <ChevronUp size={20} />
              Show less reviews
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              Show all {reviews.length} reviews
            </>
          )}
        </button>
      )}
    </div>
  );
};