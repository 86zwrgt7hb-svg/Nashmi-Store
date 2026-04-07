<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .alert-box { background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #f59e0b; }
        .product-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .product-item:last-child { border-bottom: none; }
        .stock-badge { display: inline-block; padding: 2px 8px; background-color: #fecaca; color: #991b1b; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .divider { border-top: 2px dashed #e5e7eb; margin: 30px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ تنبيه مخزون منخفض / Low Stock Alert</h1>
        </div>
        <div class="content">
            <!-- Arabic -->
            <div dir="rtl" style="text-align: right;">
                <h2>مرحباً {{ $storeName ?? 'صاحب المتجر' }}،</h2>
                <p>المنتجات التالية وصلت لمستوى مخزون منخفض:</p>

                <div class="alert-box">
                    @foreach($products ?? [] as $product)
                    <div class="product-item">
                        <strong>{{ $product['name'] ?? '' }}</strong>
                        <span class="stock-badge">{{ $product['stock'] ?? 0 }} متبقي</span>
                    </div>
                    @endforeach
                </div>

                <p>يرجى تحديث المخزون في أقرب وقت.</p>
            </div>

            <div class="divider"></div>

            <!-- English -->
            <div dir="ltr" style="text-align: left;">
                <h2>Hello {{ $storeName ?? 'Store Owner' }},</h2>
                <p>The following products have reached low stock levels:</p>

                <div class="alert-box">
                    @foreach($products ?? [] as $product)
                    <div class="product-item">
                        <strong>{{ $product['name'] ?? '' }}</strong>
                        <span class="stock-badge">{{ $product['stock'] ?? 0 }} remaining</span>
                    </div>
                    @endforeach
                </div>

                <p>Please update your inventory as soon as possible.</p>
            </div>
        </div>
        <div class="footer">
            <p>{{ config('app.name') }} - {{ date('Y') }}</p>
        </div>
    </div>
</body>
</html>
