'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';

interface RateUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSubmit: (rating: number, review: string) => void;
}

export default function RateUserPopup({ isOpen, onClose, userName, onSubmit }: RateUserPopupProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(rating, review);
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-md p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Rate {userName}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Share your experience working with {userName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Your Review (Optional)
              </label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share details about your experience..."
                className={`min-h-[100px] ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}
              />
            </div>

            <Button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}