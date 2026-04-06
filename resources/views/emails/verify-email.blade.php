@extends('emails.base-layout')

@section('title', 'تأكيد بريدك الإلكتروني - Verify Your Email')
@section('preheader', 'يرجى تأكيد بريدك الإلكتروني لتفعيل حسابك - Please verify your email address')
@section('icon', '✉️')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    تأكيد بريدك الإلكتروني
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً{{ isset($userName) ? ' ' . $userName : '' }}،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    شكراً لتسجيلك في <strong style="color: #6366f1;">متجر نشمي</strong>. يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك.
</p>
<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    إذا لم تقم بإنشاء حساب، لا يلزم اتخاذ أي إجراء.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Verify Your Email Address
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello{{ isset($userName) ? ' ' . $userName : '' }},
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Thank you for registering with <strong style="color: #6366f1;">Nashmi Store</strong>. Please click the button below to verify your email address and activate your account.
</p>
<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    If you did not create an account, no further action is required.
</p>
@endsection

@section('cta_url', $verificationUrl)
@section('cta_text_ar', 'تأكيد البريد')
@section('cta_text_en', 'Verify Email')
