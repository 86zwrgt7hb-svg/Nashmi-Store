@extends('emails.base-layout')

@section('title', 'تم تعليق المتجر - Store Suspended')
@section('preheader', 'تم تعليق متجرك بسبب تجاوز حدود الخطة - Your store has been suspended due to plan limits')
@section('icon', '⚠️')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    تم تعليق المتجر
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $userName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    تم تعليق متجرك <strong style="color: #6366f1;">{{ $storeName ?? '' }}</strong> مؤقتاً لأنه يتجاوز حدود خطتك <strong>المجانية</strong> الحالية.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #fef2f2; border-radius: 10px; border: 1px solid #fecaca;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #991b1b;">مهم:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #991b1b;">&#8226; متجرك غير مرئي للعملاء أثناء التعليق</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #991b1b;">&#8226; لديك <strong>مهلة 3 أيام</strong> لاتخاذ إجراء</p>
            <p style="margin: 0; font-size: 14px; color: #991b1b;">&#8226; بعد 3 أيام، قد يتم أرشفة المتجر</p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    يمكنك حل هذا عن طريق ترقية خطتك أو تقليل محتوى متجرك ليتناسب مع حدود الخطة المجانية.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Store Suspended
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $userName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Your store <strong style="color: #6366f1;">{{ $storeName ?? '' }}</strong> has been temporarily suspended because it exceeds the limits of your current <strong>Free</strong> plan.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #fef2f2; border-radius: 10px; border: 1px solid #fecaca;">
    <tr>
        <td style="padding: 18px 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #991b1b;">Important:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #991b1b;">&#8226; Your store is not visible to customers while suspended</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #991b1b;">&#8226; You have a <strong>3-day grace period</strong> to take action</p>
            <p style="margin: 0; font-size: 14px; color: #991b1b;">&#8226; After 3 days, the store may be archived</p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    You can resolve this by upgrading your plan or reducing your store content to fit within the Free plan limits.
</p>
@endsection

@section('cta_url', $upgradeUrl ?? url('/plans'))
@section('cta_text_ar', 'ترقية الخطة')
@section('cta_text_en', 'Upgrade Plan')
