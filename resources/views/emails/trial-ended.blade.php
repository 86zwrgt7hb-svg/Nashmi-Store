@extends('emails.base-layout')

@section('title', 'انتهت تجربتك المجانية - Your Trial Has Ended')
@section('preheader', 'انتهت تجربتك المجانية - قم بالترقية للاستمرار - Your free trial has ended - upgrade to continue')
@section('icon', '📋')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    انتهت تجربتك المجانية
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $userName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    انتهت تجربتك المجانية لمدة 7 أيام لخطة <strong style="color: #6366f1;">{{ $planName ?? 'Pro' }}</strong>. تم نقل حسابك إلى الخطة <strong>المجانية</strong>.
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    لا تقلق &mdash; جميع بيانات متجرك آمنة! يمكنك الترقية في أي وقت لاستعادة الميزات المتقدمة.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e40af;">لماذا تقوم بالترقية؟</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #1e40af;">&#10003; منتجات ومتاجر غير محدودة</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #1e40af;">&#10003; قوالب مميزة وتخصيص متقدم</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #1e40af;">&#10003; تحليلات متقدمة</p>
            <p style="margin: 0; font-size: 14px; color: #1e40af;">&#10003; دعم فني أولوي</p>
        </td>
    </tr>
</table>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Your Free Trial Has Ended
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $userName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Your 7-day free trial for the <strong style="color: #6366f1;">{{ $planName ?? 'Pro' }}</strong> plan has ended. Your account has been moved to the <strong>Free</strong> plan.
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Don't worry &mdash; all your store data is safe! You can upgrade at any time to unlock premium features again.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
    <tr>
        <td style="padding: 18px 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e40af;">Why upgrade?</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #1e40af;">&#10003; Unlimited products &amp; stores</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #1e40af;">&#10003; Premium themes &amp; customization</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #1e40af;">&#10003; Advanced analytics</p>
            <p style="margin: 0; font-size: 14px; color: #1e40af;">&#10003; Priority customer support</p>
        </td>
    </tr>
</table>
@endsection

@section('cta_url', $upgradeUrl ?? url('/plans'))
@section('cta_text_ar', 'عرض الخطط')
@section('cta_text_en', 'View Plans')
