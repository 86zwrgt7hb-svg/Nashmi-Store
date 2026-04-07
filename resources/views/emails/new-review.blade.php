<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .stars { color: #f59e0b; font-size: 24px; letter-spacing: 2px; }
        .review-box { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; }
        .divider { border-top: 2px dashed #e5e7eb; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⭐ تقييم جديد / New Review</h1>
        </div>
        <div class="content">
            <!-- Arabic -->
            <div dir="rtl" style="text-align: right;">
                <h2>مرحباً {{ $storeName ?? 'صاحب المتجر' }}،</h2>
                <p>تم إضافة تقييم جديد على منتجك:</p>

                <div class="review-box">
                    <p><strong>المنتج:</strong> {{ $productName ?? '' }}</p>
                    <p><strong>العميل:</strong> {{ $customerName ?? '' }}</p>
                    <div class="stars">
                        @for($i = 1; $i <= 5; $i++)
                            {{ $i <= ($rating ?? 5) ? '★' : '☆' }}
                        @endfor
                    </div>
                    <p style="margin-top: 10px;">{{ $comment ?? '' }}</p>
                </div>

                <p>يمكنك الموافقة على هذا التقييم أو الرد عليه من لوحة التحكم.</p>
            </div>

            <div class="divider"></div>

            <!-- English -->
            <div dir="ltr" style="text-align: left;">
                <h2>Hello {{ $storeName ?? 'Store Owner' }},</h2>
                <p>A new review has been submitted for your product:</p>

                <div class="review-box">
                    <p><strong>Product:</strong> {{ $productName ?? '' }}</p>
                    <p><strong>Customer:</strong> {{ $customerName ?? '' }}</p>
                    <div class="stars">
                        @for($i = 1; $i <= 5; $i++)
                            {{ $i <= ($rating ?? 5) ? '★' : '☆' }}
                        @endfor
                    </div>
                    <p style="margin-top: 10px;">{{ $comment ?? '' }}</p>
                </div>

                <p>You can approve or reply to this review from your dashboard.</p>
            </div>
        </div>
        <div class="footer">
            <p>{{ config('app.name') }} - {{ date('Y') }}</p>
        </div>
    </div>
</body>
</html>
