@extends('emails.base-layout')

@section('title', 'تم تأكيد الطلب! - Order Confirmed!')
@section('preheader', 'تم استلام طلبك - Your order has been received')
@section('icon', '🛒')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    تم تأكيد الطلب!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $orderName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    شكراً لطلبك! لقد تلقينا طلب الشراء الخاص بك وسنتواصل معك قريباً.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
    <tr>
        <td style="padding: 18px 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #166534; font-weight: 600;">
                جاري معالجة طلبك
            </p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    يمكنك متابعة حالة طلبك باستخدام الزر أدناه.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Order Confirmed!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $orderName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Thank you for your order! We have received your purchase request and will be in touch shortly.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
    <tr>
        <td style="padding: 18px 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #166534; font-weight: 600;">
                Your order is being processed
            </p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    You can track your order status using the button below.
</p>
@endsection

@section('cta_url', $orderUrl ?? '#')
@section('cta_text_ar', 'تتبع الطلب')
@section('cta_text_en', 'Track Order')
