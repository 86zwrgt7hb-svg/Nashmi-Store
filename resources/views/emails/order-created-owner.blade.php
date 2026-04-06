@extends('emails.base-layout')

@section('title', 'طلب جديد! - New Order Received!')
@section('preheader', 'لقد تلقيت طلباً جديداً - You have received a new order')
@section('icon', '📦')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    طلب جديد!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $ownerName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    أخبار رائعة! لقد تلقيت طلباً جديداً في متجرك.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; width: 100px; text-align: right;">رقم الطلب:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; font-weight: 600; text-align: right;">{{ $orderId ?? '' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; text-align: right;">التاريخ:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; font-weight: 600; text-align: right;">{{ $orderDate ?? '' }}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    اضغط على الزر أدناه لعرض تفاصيل الطلب ومعالجته.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    New Order Received!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $ownerName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Great news! You have received a new order on your store.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
    <tr>
        <td style="padding: 18px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; width: 100px;">Order ID:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; font-weight: 600;">{{ $orderId ?? '' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af;">Date:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1e40af; font-weight: 600;">{{ $orderDate ?? '' }}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    Click the button below to view the order details and process it.
</p>
@endsection

@section('cta_url', $orderUrl ?? '#')
@section('cta_text_ar', 'عرض الطلب')
@section('cta_text_en', 'View Order')
