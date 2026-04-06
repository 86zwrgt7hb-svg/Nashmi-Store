@extends('emails.base-layout')

@section('title', 'تجربتك تنتهي غداً - Your Trial Expires Tomorrow')
@section('preheader', 'تنتهي تجربتك المجانية خلال 24 ساعة - Your free trial ends in 24 hours')
@section('icon', '⏰')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    تجربتك تنتهي غداً
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $userName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    ستنتهي تجربتك المجانية لخطة <strong style="color: #6366f1;">{{ $planName ?? 'Pro' }}</strong> خلال <strong>24 ساعة</strong>. بعد ذلك، سيتم نقل حسابك إلى الخطة المجانية.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #fef3c7; border-radius: 10px; border: 1px solid #fde68a;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #92400e;">ما سيحدث بعد انتهاء التجربة:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #92400e;">&#8226; سيتم الحفاظ على بيانات متجرك</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #92400e;">&#8226; ستكون الميزات المتقدمة محدودة</p>
            <p style="margin: 0; font-size: 14px; color: #92400e;">&#8226; يمكنك الترقية في أي وقت لاستعادة الوصول الكامل</p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    قم بالترقية الآن للاستمتاع بجميع الميزات المتقدمة دون انقطاع.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Your Trial Expires Tomorrow
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $userName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Your free trial for the <strong style="color: #6366f1;">{{ $planName ?? 'Pro' }}</strong> plan will expire in <strong>24 hours</strong>. After that, your account will be moved to the Free plan.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #fef3c7; border-radius: 10px; border: 1px solid #fde68a;">
    <tr>
        <td style="padding: 18px 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #92400e;">What happens after the trial:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #92400e;">&#8226; Your store data will be preserved</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #92400e;">&#8226; Premium features will be limited</p>
            <p style="margin: 0; font-size: 14px; color: #92400e;">&#8226; Upgrade anytime to restore full access</p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    Upgrade now to keep enjoying all premium features without interruption.
</p>
@endsection

@section('cta_url', $upgradeUrl ?? url('/plans'))
@section('cta_text_ar', 'ترقية الآن')
@section('cta_text_en', 'Upgrade Now')
