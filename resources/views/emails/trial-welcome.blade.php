@extends('emails.base-layout')

@section('title', 'مرحباً بك في التجربة المجانية! - Welcome to Your Free Trial!')
@section('preheader', 'بدأت تجربتك المجانية لمدة 7 أيام - Your 7-day free trial has started')
@section('icon', '🎉')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    مرحباً بك في التجربة المجانية!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $userName ?? '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مبروك! تم تفعيل <strong style="color: #6366f1;">تجربتك المجانية لمدة 7 أيام</strong> لخطة <strong>{{ $planName ?? 'Pro' }}</strong>. يمكنك الآن الوصول إلى جميع الميزات المتقدمة.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #166534;">ما يمكنك فعله الآن:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #166534;">&#10003; إنشاء منتجات غير محدودة</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #166534;">&#10003; الوصول إلى القوالب المميزة</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #166534;">&#10003; تحليلات وتقارير متقدمة</p>
            <p style="margin: 0; font-size: 14px; color: #166534;">&#10003; دعم فني أولوي</p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    تنتهي تجربتك في <strong>{{ $trialEndDate ?? '' }}</strong>. يمكنك الترقية في أي وقت للاحتفاظ بالميزات المتقدمة.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Welcome to Your Free Trial!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $userName ?? 'there' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Congratulations! Your <strong style="color: #6366f1;">7-day free trial</strong> for the <strong>{{ $planName ?? 'Pro' }}</strong> plan has been activated. You now have full access to all premium features.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
    <tr>
        <td style="padding: 18px 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #166534;">What you can do now:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #166534;">&#10003; Create unlimited products</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #166534;">&#10003; Access premium themes</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #166534;">&#10003; Advanced analytics &amp; reports</p>
            <p style="margin: 0; font-size: 14px; color: #166534;">&#10003; Priority support</p>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    Your trial ends on <strong>{{ $trialEndDate ?? '' }}</strong>. Upgrade anytime to keep your premium features.
</p>
@endsection

@section('cta_url', $dashboardUrl ?? url('/dashboard'))
@section('cta_text_ar', 'الذهاب للوحة التحكم')
@section('cta_text_en', 'Go to Dashboard')
