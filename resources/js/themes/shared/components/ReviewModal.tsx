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

interface ReviewModalProps {
  productId: string | number;
  productName: string;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ productId, productName, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customer_name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isArabic } = useStoreLanguage();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    fetchReviews();
    return () => { document.body.style.overflow = 'unset'; };
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/product/${productId}`);
      const data = await response.json();
      setReviews(data.reviews?.data || data.reviews || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
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
        setFormData({ customer_name: '', rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
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
        <span className="w-3 text-gray-600">{stars}</span>
        <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
        <span className="w-8 text-gray-500 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {isArabic ? 'التقييمات' : 'Reviews'}
              </h2>
              <p className="text-sm text-gray-500 truncate">{productName}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors ms-2 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin w-8 h-8 border-3 border-gray-200 border-t-yellow-400 rounded-full mx-auto"></div>
                <p className="text-sm text-gray-400 mt-3">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : (
              <>
                {/* Rating Summary */}
                {stats && stats.total_reviews > 0 && (
                  <div className="flex gap-5 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center flex-shrink-0">
                      <div className="text-3xl font-bold text-gray-900">{stats.average_rating}</div>
                      {renderStars(Math.round(stats.average_rating))}
                      <div className="text-xs text-gray-500 mt-1">
                        {stats.total_reviews} {isArabic ? 'تقييم' : 'reviews'}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map(stars => 
                        renderRatingBar(stars, stats.rating_distribution[stars] || 0, stats.total_reviews)
                      )}
                    </div>
                  </div>
                )}

                {/* Write Review Button */}
                {!showForm && !submitted && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-medium text-sm transition-colors"
                  >
                    {isArabic ? 'اكتب تقييماً' : 'Write a Review'}
                  </button>
                )}

                {/* Success Message */}
                {submitted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
                    {isArabic
                      ? 'شكراً لتقييمك! سيظهر بعد مراجعته.'
                      : 'Thank you! Your review will appear after approval.'}
                  </div>
                )}

                {/* Review Form */}
                {showForm && (
                  <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-xl space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'الاسم' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customer_name}
                        onChange={e => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 outline-none"
                        placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {isArabic ? 'التقييم' : 'Rating'} *
                      </label>
                      {renderStars(formData.rating, true, (r) => setFormData(prev => ({ ...prev, rating: r })))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isArabic ? 'التعليق' : 'Comment'}
                      </label>
                      <textarea
                        value={formData.comment}
                        onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 outline-none resize-none"
                        rows={3}
                        placeholder={isArabic ? 'شاركنا رأيك...' : 'Share your experience...'}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                      >
                        {submitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : (isArabic ? 'إرسال' : 'Submit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600"
                      >
                        {isArabic ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map(review => (
                      <div key={review.id} className="p-3.5 border border-gray-100 rounded-xl bg-white">
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-medium text-sm text-gray-900">{review.customer_name}</span>
                              {review.is_verified_purchase && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                  {isArabic ? 'مؤكد' : 'Verified'}
                                </span>
                              )}
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-[11px] text-gray-400 flex-shrink-0">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                        )}
                        {review.reply && (
                          <div className="mt-2.5 p-2.5 bg-blue-50 rounded-lg text-sm">
                            <span className="font-medium text-blue-700 text-xs">
                              {isArabic ? 'رد المتجر' : 'Store Reply'}
                            </span>
                            <p className="mt-0.5 text-blue-600 text-sm">{review.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : !submitted && (
                  <div className="text-center py-10 text-gray-400">
                    <svg className="w-14 h-14 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-sm">{isArabic ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
                    <p className="text-xs mt-1">{isArabic ? 'كن أول من يقيّم!' : 'Be the first to review!'}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
