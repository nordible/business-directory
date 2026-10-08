'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing } from '@/lib/types';
import { Star, X, MessageSquare, Send } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: BusinessListing | null;
  primaryColor: string;
  onReviewAdded: (listingId: string, newRating: number, newCount: number) => void;
}

interface UserReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  listing,
  primaryColor,
  onReviewAdded,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<UserReview[]>([
    {
      id: 'r-1',
      author: 'Maximilian S.',
      rating: 5,
      comment: t('reviewsModal.sampleReview1'),
      date: t('reviewsModal.dateYesterday'),
    },
    {
      id: 'r-2',
      author: 'Laura B.',
      rating: 4,
      comment: t('reviewsModal.sampleReview2'),
      date: t('reviewsModal.dateDaysAgo', { days: 3 }),
    },
  ]);

  if (!isOpen || !listing) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim() || t('reviewsModal.anonymousUser'),
      rating,
      comment,
      date: t('reviewsModal.dateJustNow'),
    };

    const nextReviews = [newRev, ...reviews];
    setReviews(nextReviews);

    // Calculate new average rating
    const currentTotal = listing.rating * listing.reviewCount;
    const nextCount = listing.reviewCount + 1;
    const nextAvg = (currentTotal + rating) / nextCount;

    onReviewAdded(listing.id, Number(nextAvg.toFixed(1)), nextCount);

    setComment('');
    setAuthorName('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm md:text-base leading-tight">
                {t('reviewsModal.title')}
              </h3>
              <p className="text-[11px] text-gray-600 line-clamp-1">{listing.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Average Rating Banner */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50/60 border border-amber-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-amber-700">
                {listing.rating.toFixed(1)}
              </span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(listing.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {listing.reviewCount} Bewertungen
            </span>
          </div>

          {/* New Review Form */}
          <form onSubmit={handleSubmitReview} className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
              <span>{t('reviewsModal.writeReview')}</span>
            </h4>

            {/* Interactive Stars Selection */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  type="button"
                  key={starVal}
                  onClick={() => setRating(starVal)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      starVal <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={t('reviewsModal.namePlaceholder')}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
            />

            <textarea
              rows={2}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('reviewsModal.commentPlaceholder')}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-98 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('reviewsModal.submit')}</span>
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-2xl border border-gray-100 bg-white shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{rev.author}</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-gray-400 block">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
