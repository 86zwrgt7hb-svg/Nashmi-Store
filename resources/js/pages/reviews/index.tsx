import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Star, RefreshCw, Eye, Check, X, MessageSquare, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';

interface Review {
  id: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string;
  reply: string | null;
  replied_at: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_verified_purchase: boolean;
  created_at: string;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

interface Props {
  reviews: {
    data: Review[];
    current_page: number;
    last_page: number;
    total: number;
  };
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    average_rating: number;
  };
  filters: {
    status?: string;
    rating?: string;
    search?: string;
  };
}

export default function ReviewsIndex({ reviews, stats, filters }: Props) {
  const { t } = useTranslation();
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [replyDialog, setReplyDialog] = useState<{ open: boolean; review: Review | null }>({ open: false, review: null });
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');

  const handleFilter = (key: string, value: string) => {
    router.get(route('reviews.index'), { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
  };

  const handleSearch = () => {
    router.get(route('reviews.index'), { ...filters, search: searchQuery || undefined }, { preserveState: true });
  };

  const handleApprove = (reviewId: number) => {
    router.post(route('reviews.approve', reviewId), {}, { preserveState: true });
  };

  const handleReject = (reviewId: number) => {
    router.post(route('reviews.reject', reviewId), {}, { preserveState: true });
  };

  const handleDelete = (reviewId: number) => {
    if (confirm(t('Are you sure?'))) {
      router.delete(route('reviews.destroy', reviewId), { preserveState: true });
    }
  };

  const handleReply = () => {
    if (replyDialog.review && replyText.trim()) {
      router.post(route('reviews.reply', replyDialog.review.id), { reply: replyText }, {
        preserveState: true,
        onSuccess: () => {
          setReplyDialog({ open: false, review: null });
          setReplyText('');
        }
      });
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedReviews.length === 0) return;
    router.post(route('reviews.bulk-action'), { action, ids: selectedReviews }, {
      preserveState: true,
      onSuccess: () => setSelectedReviews([])
    });
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews.data.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.data.map(r => r.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedReviews(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status] || ''}`}>
        {t(status.charAt(0).toUpperCase() + status.slice(1))}
      </span>
    );
  };

  const pageActions = [
    {
      label: t('Refresh'),
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: () => router.reload(),
      variant: 'outline' as const,
    }
  ];

  return (
    <PageTemplate
      title={t('Reviews & Ratings')}
      description={t('Manage customer reviews and ratings')}
      url="/reviews"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Reviews & Ratings') }
      ]}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">{t('Total Reviews')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">{t('Pending')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">{t('Approved')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">{t('Rejected')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{stats.average_rating}</span>
            </div>
            <div className="text-sm text-muted-foreground">{t('Average Rating')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder={t('Search reviews')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={filters?.status || 'all'} onValueChange={(v) => handleFilter('status', v)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('Filter by status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Reviews')}</SelectItem>
                <SelectItem value="pending">{t('Pending')}</SelectItem>
                <SelectItem value="approved">{t('Approved')}</SelectItem>
                <SelectItem value="rejected">{t('Rejected')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters?.rating || 'all'} onValueChange={(v) => handleFilter('rating', v)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('Filter by rating')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All')}</SelectItem>
                <SelectItem value="5">5 {t('stars')}</SelectItem>
                <SelectItem value="4">4 {t('stars')}</SelectItem>
                <SelectItem value="3">3 {t('stars')}</SelectItem>
                <SelectItem value="2">2 {t('stars')}</SelectItem>
                <SelectItem value="1">1 {t('star')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 me-1" />
              {t('Filter')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedReviews.length} {t('selected')}</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
            <Check className="h-3 w-3 me-1" /> {t('Approve Selected')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
            <X className="h-3 w-3 me-1" /> {t('Reject Selected')}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
            <Trash2 className="h-3 w-3 me-1" /> {t('Delete Selected')}
          </Button>
        </div>
      )}

      {/* Reviews List */}
      <Card>
        <CardContent className="p-0">
          {reviews.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Star className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">{t('No reviews yet')}</p>
            </div>
          ) : (
            <div className="divide-y">
              {/* Header */}
              <div className="hidden md:flex items-center gap-4 p-4 bg-muted/50 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={selectedReviews.length === reviews.data.length}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
                <div className="flex-1">{t('Review')}</div>
                <div className="w-32">{t('Product')}</div>
                <div className="w-24">{t('Rating')}</div>
                <div className="w-24">{t('Status')}</div>
                <div className="w-32">{t('Actions')}</div>
              </div>

              {/* Review Items */}
              {reviews.data.map((review) => (
                <div key={review.id} className="flex flex-col md:flex-row md:items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => toggleSelect(review.id)}
                    className="rounded mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.customer_name}</span>
                      {review.is_verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="h-3 w-3 me-1" />
                          {t('Verified Purchase')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{review.customer_email}</div>
                    <div className="md:hidden mb-2">{renderStars(review.rating)}</div>
                    {review.comment && (
                      <p className="text-sm mt-1 line-clamp-2">{review.comment}</p>
                    )}
                    {review.reply && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                        <span className="font-medium text-blue-700 dark:text-blue-300">{t('Merchant Reply')}:</span>
                        <p className="mt-1">{review.reply}</p>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="w-32 hidden md:block">
                    <span className="text-sm truncate block">{review.product?.name}</span>
                  </div>
                  <div className="w-24 hidden md:block">
                    {renderStars(review.rating)}
                  </div>
                  <div className="w-24 hidden md:block">
                    {getStatusBadge(review.status)}
                  </div>
                  <div className="flex items-center gap-1 md:w-32">
                    <div className="md:hidden me-auto">
                      {getStatusBadge(review.status)}
                    </div>
                    {review.status === 'pending' && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleApprove(review.id)} title={t('Approve')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleReject(review.id)} title={t('Reject')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setReplyDialog({ open: true, review }); setReplyText(review.reply || ''); }} title={t('Reply')}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(review.id)} title={t('Delete')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {reviews.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: reviews.last_page }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={page === reviews.current_page ? 'default' : 'outline'}
              size="sm"
              onClick={() => router.get(route('reviews.index'), { ...filters, page }, { preserveState: true })}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialog.open} onOpenChange={(open) => !open && setReplyDialog({ open: false, review: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Write a Reply')}</DialogTitle>
          </DialogHeader>
          {replyDialog.review && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{replyDialog.review.customer_name}</span>
                  {renderStars(replyDialog.review.rating)}
                </div>
                <p className="text-sm">{replyDialog.review.comment}</p>
              </div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t('Write a Reply')}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialog({ open: false, review: null })}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleReply} disabled={!replyText.trim()}>
              {t('Submit Reply')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}
