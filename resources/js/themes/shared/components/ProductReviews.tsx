import React, { useState, useEffect } from 'react';
import { useStoreLanguage } from '../StoreLanguageContext';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  reply: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: number]: number };
}

interface ProductReviewsProps {
  productId: string | number;
  storeSlug: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, storeSlug }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customer_name: '', customer_email: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isArabic } = useStoreLanguage();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/product/${productId}`);
      const data = await response.json();
      setReviews(data.reviews?.data || []);
      setStats(data.stats || null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, product_id: productId }),
      });
      if (response.ok) {
        setSubmitted(true);
        setShowForm(false);
        setFormData({ customer_name: '', customer_email: '', rating: 5, comment: '' });
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange?.(i)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <svg className={`w-5 h-5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );

  const renderRatingBar = (stars: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-sm" key={stars}>
        <span className="w-3">{stars}</span>
        <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
        <span className="w-8 text-gray-500">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold mb-4">
        {isArabic ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
        {stats && stats.total_reviews > 0 && (
          <span className="text-sm font-normal text-gray-500 ms-2">({stats.total_reviews})</span>
        )}
      </h3>

      {/* Rating Summary */}
      {stats && stats.total_reviews > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-4xl font-bold">{stats.average_rating}</div>
            {renderStars(Math.round(stats.average_rating))}
            <div className="text-sm text-gray-500 mt-1">
              {stats.total_reviews} {isArabic ? 'تقييم' : 'reviews'}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(stars => renderRatingBar(stars, stats.rating_distribution[stars] || 0, stats.total_reviews))}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          {isArabic ? 'اكتب تقييماً' : 'Write a Review'}
        </button>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {isArabic
            ? 'شكراً لتقييمك! سيظهر بعد مراجعته من قبل إدارة المتجر.'
            : 'Thank you for your review! It will be visible after approval.'}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'الاسم' : 'Name'} *</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={e => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={e => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{isArabic ? 'التقييم' : 'Rating'} *</label>
            {renderStars(formData.rating, true, (r) => setFormData(prev => ({ ...prev, rating: r })))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'التعليق' : 'Comment'}</label>
            <textarea
              value={formData.comment}
              onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              placeholder={isArabic ? 'شاركنا رأيك...' : 'Share your experience...'}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
            >
              {submitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : (isArabic ? 'إرسال التقييم' : 'Submit Review')}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="p-4 border rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.customer_name}</span>
                    {review.is_verified_purchase && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {isArabic ? 'مشتري مؤكد' : 'Verified'}
                      </span>
                    )}
                  </div>
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              {review.comment && <p className="text-sm text-gray-700 mt-2">{review.comment}</p>}
              {review.reply && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                  <span className="font-medium text-blue-700">{isArabic ? 'رد المتجر:' : 'Store Reply:'}</span>
                  <p className="mt-1 text-blue-600">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !submitted && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-sm">{isArabic ? 'لا توجد تقييمات بعد. كن أول من يقيّم!' : 'No reviews yet. Be the first to review!'}</p>
        </div>
      )}
    </div>
  );
};
