@extends('emails.base-layout')

@section('title', 'تحديث حالة الطلب - Order Status Update')
@section('preheader', 'تم تحديث حالة طلبك - Your order status has been updated')
@section('icon', '🔄')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    تحديث حالة الطلب
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $orderName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    تم تحديث حالة طلبك. الحالة الجديدة:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
    <tr>
        <td style="padding: 18px 20px; text-align: center;">
            <p style="margin: 0; font-size: 20px; color: #6366f1; font-weight: 700;">
                {{ $orderStatus ?? '' }}
            </p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    شكراً لتسوقك معنا! يمكنك متابعة تفاصيل طلبك من الزر أدناه.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Order Status Update
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $orderName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Your order status has been updated. New status:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
    <tr>
        <td style="padding: 18px 20px; text-align: center;">
            <p style="margin: 0; font-size: 20px; color: #6366f1; font-weight: 700;">
                {{ $orderStatus ?? '' }}
            </p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    Thank you for shopping with us! You can track your order details using the button below.
</p>
@endsection

@section('cta_url', $orderUrl ?? '#')
@section('cta_text_ar', 'تفاصيل الطلب')
@section('cta_text_en', 'Order Details')
